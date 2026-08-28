/**
 * Persistence.
 *
 * Keys are namespaced and versioned — `mi:1:run:big-five` — so a schema change
 * is a migration rather than a corruption, and so two apps on one origin never
 * collide. The interface is async even though localStorage is not: when the
 * accounts server arrives for the paid tier, a remote adapter implements the
 * same four methods and no call site changes.
 */
import { AUDIENCE_ORDER } from "./audience";
import type { Audience, Answers, Run } from "./types";

const NS = "mi";
const SCHEMA = 1;
const key = (k: string) => `${NS}:${SCHEMA}:${k}`;
const unkey = (k: string) => k.slice(`${NS}:${SCHEMA}:`.length);

export interface Adapter {
  readonly durable: boolean;
  get<V>(k: string): Promise<V | null>;
  set<V>(k: string, value: V): Promise<V>;
  del(k: string): Promise<void>;
  list<V>(prefix?: string): Promise<[string, V][]>;
}

export class StorageFullError extends Error {
  constructor(cause?: unknown) {
    super("Browser storage is full or unavailable.");
    this.name = "StorageFullError";
    this.cause = cause;
  }
}

/** localStorage, defensively wrapped: private browsing and quota both throw. */
export class LocalAdapter implements Adapter {
  private mem = new Map<string, unknown>();
  private ls: Storage | null;

  constructor(backing?: Storage) {
    try {
      if (!backing) throw new Error("no storage");
      backing.setItem(key("probe"), "1");
      backing.removeItem(key("probe"));
      this.ls = backing;
    } catch {
      // Private mode, disabled storage, sandboxed frame, or the server: run
      // from memory and let the UI say answers will not survive a reload.
      this.ls = null;
    }
  }

  get durable() {
    return this.ls !== null;
  }

  async get<V>(k: string): Promise<V | null> {
    const full = key(k);
    if (!this.ls) return this.mem.has(full) ? (structuredClone(this.mem.get(full)) as V) : null;
    const raw = this.ls.getItem(full);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as V;
    } catch {
      return null;
    }
  }

  async set<V>(k: string, value: V): Promise<V> {
    const full = key(k);
    if (!this.ls) {
      this.mem.set(full, structuredClone(value));
      return value;
    }
    try {
      this.ls.setItem(full, JSON.stringify(value));
    } catch (err) {
      throw new StorageFullError(err);
    }
    return value;
  }

  async del(k: string) {
    const full = key(k);
    if (!this.ls) {
      this.mem.delete(full);
      return;
    }
    this.ls.removeItem(full);
  }

  async list<V>(prefix = ""): Promise<[string, V][]> {
    const out: [string, V][] = [];
    if (!this.ls) {
      for (const [k, v] of this.mem) if (unkey(k).startsWith(prefix)) out.push([unkey(k), structuredClone(v) as V]);
      return out;
    }
    for (let i = 0; i < this.ls.length; i++) {
      const full = this.ls.key(i);
      if (!full?.startsWith(`${NS}:${SCHEMA}:`)) continue;
      const short = unkey(full);
      if (!short.startsWith(prefix)) continue;
      try {
        out.push([short, JSON.parse(this.ls.getItem(full)!) as V]);
      } catch {
        /* skip unreadable entry */
      }
    }
    return out;
  }
}

export type Profile = { displayName: string; pronouns: string; note: string; createdAt: string | null };
export type Settings = { locale: Locale | null; adultOk: boolean; theme: "dark" | "light" | null };
export type Draft = { answers: Answers; order: string[]; seed: number; page: number; total: number; updatedAt?: string };
export type Sharing = Record<string, Audience>;

/**
 * What the reader decided to *do* about a result, kept beside the run.
 *
 * `ok` and `notOk` hold the ids of suggested lines they ticked; `ownOk` and
 * `ownNotOk` hold the text of lines they wrote. Ids for ours, text for theirs
 * — see `core/playbook.ts` for why that asymmetry is the whole design.
 *
 * A separate key rather than a field on the run, because these are written at a
 * different time by a different act: a run is answers submitted once, a
 * practice is a checkbox ticked on a Tuesday. Folding them together would mean
 * every tick rewrites the record of what somebody answered.
 */
export type Practice = { ok: string[]; notOk: string[]; ownOk: string[]; ownNotOk: string[]; updatedAt?: string };

import type { Locale } from "./types";

export function makeStore(adapter: Adapter) {
  const subs = new Set<() => void>();
  // A monotonic counter is the snapshot React subscribes to. The store's own
  // data is mutable and identity-stable, so returning any part of it as a
  // snapshot would compare equal after a write and never re-render.
  let version = 0;
  const announce = () => {
    version++;
    for (const fn of subs) fn();
  };

  /**
   * Runs that are never written down.
   *
   * An in-memory Map is not a privacy feature bolted onto storage — it *is*
   * the guarantee. There is no key to find, no export that could include it
   * and no token that could be built from it, because once the tab closes the
   * data does not exist anywhere.
   *
   * A slot holds the second person of a pair. Slotted runs are deliberately
   * invisible to `runs()`: half a comparison is not a run of its own, and
   * letting one appear in the catalogue would be the leak this design avoids.
   */
  const ephemeral = new Map<string, Run>();
  const slotKey = (instrumentId: string, slot?: string | null) => (slot ? `${instrumentId}#${slot}` : instrumentId);

  const store = {
    adapter,
    get durable() {
      return adapter.durable;
    },
    subscribe(fn: () => void) {
      subs.add(fn);
      return () => void subs.delete(fn);
    },
    /** Increments on every write. The snapshot for `useSyncExternalStore`. */
    version: () => version,

    async settings(): Promise<Settings> {
      return { locale: null, adultOk: false, theme: null, ...((await adapter.get<Partial<Settings>>("settings")) ?? {}) };
    },
    async saveSettings(patch: Partial<Settings>) {
      const next = { ...(await store.settings()), ...patch };
      await adapter.set("settings", next);
      announce();
      return next;
    },

    async profile(): Promise<Profile> {
      return (
        (await adapter.get<Profile>("profile")) ?? { displayName: "", pronouns: "", note: "", createdAt: null }
      );
    },
    async saveProfile(patch: Partial<Profile>) {
      const next = { ...(await store.profile()), ...patch };
      next.createdAt ??= new Date().toISOString();
      await adapter.set("profile", next);
      announce();
      return next;
    },

    /** Who may see what, as one map from element id to audience. */
    async sharing(): Promise<Sharing> {
      const stored = (await adapter.get<Sharing>("sharing")) ?? {};
      const defaults: Sharing = {
        "profile.name": "private",
        "profile.pronouns": "private",
        "profile.note": "private",
      };
      for (const run of await store.runs()) defaults[`run.${run.instrumentId}`] = run.visibility ?? "private";
      return { ...defaults, ...stored };
    },
    async setAudience(elementId: string, audience: Audience) {
      if (!AUDIENCE_ORDER.includes(audience)) throw new RangeError(`unknown audience: ${audience}`);
      const next = { ...((await adapter.get<Sharing>("sharing")) ?? {}), [elementId]: audience };
      await adapter.set("sharing", next);
      // Element ids are dotted (`run.big-five`); storage keys are colonned
      // (`run:big-five`). The translation happens here and nowhere else.
      if (elementId.startsWith("run.")) {
        const instrumentId = elementId.slice("run.".length);
        const run = await store.run(instrumentId);
        if (run) await adapter.set(`run:${instrumentId}`, { ...run, visibility: audience });
      }
      announce();
      return next;
    },

    async run<R>(instrumentId: string, slot: string | null = null): Promise<Run<R> | null> {
      if (slot) return (ephemeral.get(slotKey(instrumentId, slot)) as Run<R>) ?? null;
      return (ephemeral.get(instrumentId) as Run<R>) ?? (await adapter.get<Run<R>>(`run:${instrumentId}`));
    },
    async runs(): Promise<Run[]> {
      const rows = await adapter.list<Run>("run:");
      const stored = rows.map(([, v]) => v).filter((run) => !ephemeral.has(run.instrumentId));
      const live = [...ephemeral.entries()].filter(([k]) => !k.includes("#")).map(([, v]) => v);
      return [...stored, ...live].sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
    },
    isEphemeral(instrumentId: string) {
      return ephemeral.has(instrumentId);
    },

    async saveRun(
      record: Omit<Run, "completedAt">,
      { session = false, slot = null }: { session?: boolean; slot?: string | null } = {},
    ): Promise<Run> {
      if (slot && !session) throw new TypeError("a slotted run must be session-only");
      if (session) {
        const next: Run = { ...record, session: true, slot, completedAt: new Date().toISOString() };
        ephemeral.set(slotKey(record.instrumentId, slot), next);
        announce();
        return next;
      }
      const prev = await store.run(record.instrumentId);
      const next: Run = {
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

    async clearRun(instrumentId: string) {
      for (const k of [...ephemeral.keys()]) {
        if (k === instrumentId || k.startsWith(`${instrumentId}#`)) ephemeral.delete(k);
      }
      await adapter.del(`run:${instrumentId}`);
      await adapter.del(`draft:${instrumentId}`);
      // Deleting a result must mean everything derived from it is gone. A set
      // of notes surviving the result they were written against is a surprise,
      // and it is the surprise in the wrong direction: the reader asked for the
      // thing to be forgotten and half of it stayed.
      await adapter.del(`practice:${instrumentId}`);
      announce();
    },

    /**
     * The reader's own lines for one instrument.
     *
     * Returns a filled shape rather than null so no call site has to remember
     * four empty arrays. An absent key and a practice with nothing in it are
     * the same thing to every reader of this, and making them different would
     * only produce a null check somebody forgets.
     */
    async practice(instrumentId: string): Promise<Practice> {
      return {
        ok: [],
        notOk: [],
        ownOk: [],
        ownNotOk: [],
        ...((await adapter.get<Partial<Practice>>(`practice:${instrumentId}`)) ?? {}),
      };
    },
    async savePractice(instrumentId: string, patch: Partial<Practice>): Promise<Practice> {
      const next = { ...(await store.practice(instrumentId)), ...patch, updatedAt: new Date().toISOString() };
      await adapter.set(`practice:${instrumentId}`, next);
      announce();
      return next;
    },
    async clearPractice(instrumentId: string) {
      await adapter.del(`practice:${instrumentId}`);
      announce();
    },

    async draft(instrumentId: string) {
      return adapter.get<Draft>(`draft:${instrumentId}`);
    },
    async drafts(): Promise<Record<string, Draft>> {
      return Object.fromEntries((await adapter.list<Draft>("draft:")).map(([k, v]) => [k.slice("draft:".length), v]));
    },
    async saveDraft(instrumentId: string, draft: Draft) {
      await adapter.set(`draft:${instrumentId}`, { ...draft, updatedAt: new Date().toISOString() });
      announce();
    },
    async clearDraft(instrumentId: string) {
      await adapter.del(`draft:${instrumentId}`);
      announce();
    },

    /**
     * Whole-account snapshot. Session runs are absent by construction rather
     * than by being filtered: they were never in the adapter, so no code path
     * here could include one by accident.
     */
    async exportAll() {
      const rows = await adapter.list("");
      return { schema: SCHEMA, exportedAt: new Date().toISOString(), entries: Object.fromEntries(rows) };
    },
    async importAll(dump: { schema: number; entries?: Record<string, unknown> }) {
      if (!dump || dump.schema !== SCHEMA) throw new Error(`Unsupported export (schema ${dump?.schema}).`);
      for (const [k, v] of Object.entries(dump.entries ?? {})) await adapter.set(k, v);
      announce();
    },
    async wipe() {
      for (const [k] of await adapter.list("")) await adapter.del(k);
      announce();
    },
  };

  return store;
}

export type Store = ReturnType<typeof makeStore>;
export { SCHEMA };
