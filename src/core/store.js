/**
 * Persistence.
 *
 * Everything the app owns goes through this module, and the interface is
 * deliberately async even though the only adapter today is synchronous
 * localStorage. When the server arrives, `RemoteAdapter` implements the same
 * four methods and not one call site changes.
 *
 * Keys are namespaced and versioned — `mi:1:run:big-five` — so a schema change
 * is a migration, not a corruption, and so two apps on the same origin never
 * collide.
 */

const NS = "mi";
const SCHEMA = 1;
const key = (k) => `${NS}:${SCHEMA}:${k}`;
const unkey = (k) => k.slice(`${NS}:${SCHEMA}:`.length);

/** localStorage, defensively wrapped: private browsing and quota both throw. */
class LocalAdapter {
  constructor(backing) {
    this.mem = new Map();
    try {
      backing.setItem(key("probe"), "1");
      backing.removeItem(key("probe"));
      this.ls = backing;
    } catch {
      // Private mode, disabled storage, sandboxed frame: run from memory and
      // let the UI tell the user their answers will not survive a reload.
      this.ls = null;
    }
  }
  get durable() { return this.ls !== null; }

  async get(k) {
    const full = key(k);
    if (!this.ls) return this.mem.has(full) ? structuredClone(this.mem.get(full)) : null;
    const raw = this.ls.getItem(full);
    if (raw == null) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }
  async set(k, value) {
    const full = key(k);
    if (!this.ls) { this.mem.set(full, structuredClone(value)); return value; }
    try { this.ls.setItem(full, JSON.stringify(value)); } catch (err) { throw new StorageFullError(err); }
    return value;
  }
  async del(k) {
    const full = key(k);
    if (!this.ls) { this.mem.delete(full); return; }
    this.ls.removeItem(full);
  }
  /** Every stored value whose unprefixed key starts with `prefix`. */
  async list(prefix = "") {
    const out = [];
    if (!this.ls) {
      for (const [k, v] of this.mem) if (unkey(k).startsWith(prefix)) out.push([unkey(k), structuredClone(v)]);
      return out;
    }
    for (let i = 0; i < this.ls.length; i++) {
      const full = this.ls.key(i);
      if (!full.startsWith(`${NS}:${SCHEMA}:`)) continue;
      const short = unkey(full);
      if (!short.startsWith(prefix)) continue;
      try { out.push([short, JSON.parse(this.ls.getItem(full))]); } catch { /* skip unreadable entry */ }
    }
    return out;
  }
}

class StorageFullError extends Error {
  constructor(cause) { super("Browser storage is full or unavailable."); this.name = "StorageFullError"; this.cause = cause; }
}

/* ══ typed accessors ══════════════════════════════════════════════
   The rest of the app never touches raw keys; it asks for a profile
   or a run. That keeps the key layout an implementation detail the
   future server is free to ignore.                                  */

const VISIBILITY = ["private", "friends", "public"];

function makeStore(adapter) {
  const subs = new Set();
  const announce = () => { for (const fn of subs) fn(); };

  return {
    adapter,
    get durable() { return adapter.durable; },
    /** Called after any write, so the shell can re-render counts and badges. */
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },

    /** Application settings — today just the reader's language. */
    async settings() {
      return (await adapter.get("settings")) ?? { locale: null };
    },
    async saveSettings(patch) {
      const next = { ...(await this.settings()), ...patch };
      await adapter.set("settings", next);
      announce();
      return next;
    },

    async profile() {
      return (await adapter.get("profile")) ?? { displayName: "", pronouns: "", note: "", createdAt: null };
    },
    async saveProfile(patch) {
      const next = { ...(await this.profile()), ...patch };
      next.createdAt ??= new Date().toISOString();
      await adapter.set("profile", next);
      announce();
      return next;
    },

    /** A completed instrument: answers, computed result, and who may see it. */
    async run(instrumentId) { return adapter.get(`run:${instrumentId}`); },
    async runs() {
      const rows = await adapter.list("run:");
      return rows.map(([, v]) => v).sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
    },
    async saveRun(record) {
      const prev = await this.run(record.instrumentId);
      const next = {
        visibility: prev?.visibility ?? "private",
        firstCompletedAt: prev?.firstCompletedAt ?? new Date().toISOString(),
        ...record,
        completedAt: new Date().toISOString(),
      };
      await adapter.set(`run:${record.instrumentId}`, next);
      await adapter.del(`draft:${record.instrumentId}`);
      announce();
      return next;
    },
    async setVisibility(instrumentId, visibility) {
      if (!VISIBILITY.includes(visibility)) throw new RangeError(`unknown visibility: ${visibility}`);
      const run = await this.run(instrumentId);
      if (!run) return null;
      run.visibility = visibility;
      await adapter.set(`run:${instrumentId}`, run);
      announce();
      return run;
    },
    async clearRun(instrumentId) {
      await adapter.del(`run:${instrumentId}`);
      await adapter.del(`draft:${instrumentId}`);
      announce();
    },

    /** A part-finished questionnaire, saved on every answer so a reload is cheap. */
    async draft(instrumentId) { return adapter.get(`draft:${instrumentId}`); },
    /** Every part-finished questionnaire, keyed by instrument id. */
    async drafts() {
      return Object.fromEntries((await adapter.list("draft:")).map(([k, v]) => [k.slice("draft:".length), v]));
    },
    async saveDraft(instrumentId, draft) {
      await adapter.set(`draft:${instrumentId}`, { ...draft, updatedAt: new Date().toISOString() });
      announce();
    },
    async clearDraft(instrumentId) { await adapter.del(`draft:${instrumentId}`); announce(); },

    /** Whole-account snapshot — the seed of both "export my data" and sync. */
    async exportAll() {
      const rows = await adapter.list("");
      return { schema: SCHEMA, exportedAt: new Date().toISOString(), entries: Object.fromEntries(rows) };
    },
    async importAll(dump) {
      if (!dump || dump.schema !== SCHEMA) throw new Error(`Unsupported export (schema ${dump?.schema}).`);
      for (const [k, v] of Object.entries(dump.entries ?? {})) await adapter.set(k, v);
      announce();
    },
    async wipe() {
      for (const [k] of await adapter.list("")) await adapter.del(k);
      announce();
    },
  };
}

export { makeStore, LocalAdapter, StorageFullError, VISIBILITY, SCHEMA };
