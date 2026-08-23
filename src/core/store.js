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

  /**
   * Runs that are never written down.
   *
   * Some answers are worth having on screen for ten minutes and not worth
   * keeping. An in-memory Map is not a privacy feature bolted onto storage —
   * it *is* the guarantee. There is no key to find, no export that could
   * include it and no token that could be built from it, because once the tab
   * closes the data does not exist anywhere. A reload empties it whether or
   * not the reader remembers to.
   *
   * What it cannot protect against is somebody standing behind you, or holding
   * the unlocked device while the page is still open. The copy says so rather
   * than implying otherwise.
   */
  const ephemeral = new Map();

  /**
   * A second answer set for the same instrument, in the same tab.
   *
   * Two people comparing explicit answers is the thing this app is asked for
   * most often and the thing it is least willing to build a network for. A
   * slot solves it without one: both people answer on one device, one after
   * the other, and the comparison happens in memory between two sets that were
   * never written down. It is only available to session-only instruments,
   * which the save path enforces rather than assumes.
   *
   * Slotted runs are deliberately invisible to `runs()`. They are half of a
   * comparison, not a run of their own, and letting one appear in the
   * catalogue or the sharing page would be exactly the leak this design
   * exists to avoid.
   */
  const slotKey = (instrumentId, slot) => (slot ? `${instrumentId}#${slot}` : instrumentId);

  return {
    adapter,
    get durable() { return adapter.durable; },
    /** Called after any write, so the shell can re-render counts and badges. */
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },

    /**
     * Who may see what, as one map from element id to audience.
     *
     * Stored settings win; anything unset falls back to the per-run
     * `visibility` this app used before there was a sharing page, so an
     * existing account keeps the choices it already made. Nothing is written
     * on read — a migration that fires from a getter is a migration that
     * fires in a test and surprises somebody.
     */
    async sharing() {
      const stored = (await adapter.get("sharing")) ?? {};
      const defaults = { "profile.name": "private", "profile.pronouns": "private", "profile.note": "private" };
      for (const run of await this.runs()) defaults[`run.${run.instrumentId}`] = run.visibility ?? "private";
      return { ...defaults, ...stored };
    },
    /** Set one element's audience. Runs keep their own field in step. */
    async setAudience(elementId, audience) {
      if (!VISIBILITY.includes(audience)) throw new RangeError(`unknown audience: ${audience}`);
      const next = { ...((await adapter.get("sharing")) ?? {}), [elementId]: audience };
      await adapter.set("sharing", next);
      // Element ids are dotted (`run.big-five`); storage keys are colonned
      // (`run:big-five`). They are deliberately different namespaces, so the
      // translation between them happens here and nowhere else.
      if (elementId.startsWith("run.")) {
        const instrumentId = elementId.slice("run.".length);
        const run = await this.run(instrumentId);
        if (run) { run.visibility = audience; await adapter.set(`run:${instrumentId}`, run); }
      }
      announce();
      return next;
    },

    /**
     * Application settings — the reader's language, and whether they have
     * confirmed their age.
     *
     * `adultOk` is a self-attestation and nothing more. It keeps explicit
     * material off the catalogue of somebody who has not asked for it, which
     * is what it is for; it is not age verification and the copy beside it
     * does not pretend to be. Storing it means the confirmation is asked once
     * rather than every visit, and clearing site data asks again.
     */
    async settings() {
      return { locale: null, adultOk: false, ...((await adapter.get("settings")) ?? {}) };
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
    async run(instrumentId, slot = null) {
      if (slot) return ephemeral.get(slotKey(instrumentId, slot)) ?? null;
      return ephemeral.get(instrumentId) ?? (await adapter.get(`run:${instrumentId}`));
    },
    async runs() {
      const rows = await adapter.list("run:");
      const stored = rows.map(([, v]) => v).filter((run) => !ephemeral.has(run.instrumentId));
      const live = [...ephemeral.entries()].filter(([k]) => !k.includes("#")).map(([, v]) => v);
      return [...stored, ...live]
        .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
    },
    /** Whether this run exists only for as long as the tab is open. */
    isEphemeral(instrumentId) { return ephemeral.has(instrumentId); },

    /**
     * `session: true` keeps a run in memory and nowhere else.
     *
     * It is a separate branch rather than a flag threaded through the stored
     * path on purpose: the stored path merges with a predecessor, writes a
     * key, and clears a draft, and none of those should happen here. Two
     * short branches are easier to verify than one clever one.
     */
    async saveRun(record, { session = false, slot = null } = {}) {
      if (slot && !session) throw new TypeError("a slotted run must be session-only");
      if (session) {
        const next = { ...record, session: true, slot, completedAt: new Date().toISOString() };
        ephemeral.set(slotKey(record.instrumentId, slot), next);
        announce();
        return next;
      }
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
      for (const k of [...ephemeral.keys()]) {
        if (k === instrumentId || k.startsWith(`${instrumentId}#`)) ephemeral.delete(k);
      }
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

    /**
     * Whole-account snapshot — the seed of both "export my data" and sync.
     *
     * Session runs are absent by construction rather than by being filtered
     * out: they were never in the adapter, so there is no code path here that
     * could include one by accident.
     */
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
