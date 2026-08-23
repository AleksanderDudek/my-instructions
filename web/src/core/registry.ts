/**
 * The registry.
 *
 * An instrument is now a *module*, not a spec: pure logic in `spec`, a React
 * component in `View`, an optional `Compare`, and a provenance record. The
 * split is the point of the rewrite — `spec` can be imported by a test, a
 * server route or a script without dragging React in, and `View` can render on
 * the server without the spec knowing that servers exist.
 */
import type { ComponentType } from "react";
import type { Audience, InstrumentSpec, T, Tier } from "./types";
import { AUDIENCE_ORDER } from "./audience";

export type ProvenanceRecord = {
  construct: { name: string; origin?: string; public: boolean; note?: string };
  items: { origin: string; writtenFor?: string };
  evidence: { reliability: string; factorStructure: string; criterion: string; note?: string };
  reproduces: string[];
  avoided?: string[];
};

export type InstrumentModule<R = unknown> = {
  spec: InstrumentSpec<R>;
  View: ComponentType<{ result: R; t: T }>;
  Compare?: ComponentType<{ a: R; b: R; nameA?: string; nameB?: string; t: T }>;
  PairView?: ComponentType<{ comparison: unknown; t: T }>;
  provenance: ProvenanceRecord;
};

export const FAMILIES = new Set(["questionnaire", "profiler"]);
const ITEM_KINDS = new Set(["likert", "choice", "multi"]);
const ITEM_TIERS = new Set(["shared", "private"]);
const FIELD_KINDS = new Set(["date", "time", "text", "number", "select", "multi"]);
const TIERS = new Set<Tier>(["free", "premium"]);

/**
 * Validation renders no words, so it needs no language. An identity `t`
 * returns its own key, which is enough to check that every item has *a* prompt
 * without asserting anything about what the prompt says.
 */
export const identity: T = (key) => key;

export function validate(module: InstrumentModule): void {
  const spec = module?.spec;
  const where = spec?.id ? `instrument "${spec.id}"` : "instrument";

  for (const k of ["id", "version", "family", "glyph", "minutes", "messages", "form", "score", "instructions"] as const) {
    if (spec?.[k] == null) throw new TypeError(`${where}: missing "${k}"`);
  }
  if (typeof module.View !== "function") throw new TypeError(`${where}: missing a View component`);
  if (!FAMILIES.has(spec.family)) throw new TypeError(`${where}: family must be one of ${[...FAMILIES].join(", ")}`);
  if (!TIERS.has(spec.tier)) throw new TypeError(`${where}: tier must be "free" or "premium"`);

  if (spec.maxAudience != null && !AUDIENCE_ORDER.includes(spec.maxAudience)) {
    throw new TypeError(`${where}: maxAudience must be one of ${AUDIENCE_ORDER.join(", ")}`);
  }
  if (spec.sensitive && spec.maxAudience === "public") {
    throw new TypeError(`${where}: a sensitive instrument must not permit a public audience`);
  }
  if (spec.persistence != null && spec.persistence !== "session") {
    throw new TypeError(`${where}: persistence, if set, must be "session"`);
  }
  if (spec.persistence === "session" && (spec.maxAudience ?? "public") !== "private") {
    throw new TypeError(`${where}: a session-only instrument must set maxAudience to "private"`);
  }
  /**
   * A pairwise instrument is answered twice in one tab and compared in memory.
   * Requiring session persistence is not belt-and-braces: a stored pair
   * comparison is a written record of two people's answers, a different and
   * much worse object than either half, and the only reliable way not to have
   * one is to make the shape impossible to declare.
   */
  if (spec.pairwise) {
    if (typeof spec.pairScore !== "function" || typeof module.PairView !== "function") {
      throw new TypeError(`${where}: a pairwise instrument needs pairScore() and a PairView`);
    }
    if (spec.persistence !== "session") {
      throw new TypeError(`${where}: a pairwise instrument must set persistence to "session"`);
    }
  }

  const form = spec.form(identity, "en");
  if (form.kind === "items") {
    if (!form.items?.length) throw new TypeError(`${where}: form.items must be a non-empty array`);
    const seen = new Set<string>();
    for (const it of form.items) {
      if (!it.id) throw new TypeError(`${where}: every item needs an id`);
      if (seen.has(it.id)) throw new TypeError(`${where}: duplicate item id "${it.id}"`);
      seen.add(it.id);
      if (!ITEM_KINDS.has(it.kind)) throw new TypeError(`${where}: item "${it.id}" has unknown kind "${it.kind}"`);
      if (!it.prompt) throw new TypeError(`${where}: item "${it.id}" has no prompt`);
      if (it.kind === "likert" && !it.scale) throw new TypeError(`${where}: likert item "${it.id}" needs a scale name`);
      if (it.kind !== "likert" && !Array.isArray(it.options)) throw new TypeError(`${where}: item "${it.id}" needs options`);
      if (it.tier != null && !ITEM_TIERS.has(it.tier)) throw new TypeError(`${where}: item "${it.id}" has unknown tier`);
    }
    if (form.items.some((i) => i.kind === "likert") && !form.scale) {
      throw new TypeError(`${where}: an items form with Likert items needs a scale`);
    }
  } else if (form.kind === "fields") {
    if (!form.fields?.length) throw new TypeError(`${where}: form.fields must be a non-empty array`);
    const seen = new Set<string>();
    for (const f of form.fields) {
      if (!f.id || seen.has(f.id)) throw new TypeError(`${where}: field ids must exist and be unique`);
      seen.add(f.id);
      if (!FIELD_KINDS.has(f.kind)) throw new TypeError(`${where}: field "${f.id}" has unknown kind "${f.kind}"`);
    }
  } else {
    throw new TypeError(`${where}: form.kind must be "items" or "fields"`);
  }
}

export function createRegistry(modules: InstrumentModule[]) {
  const byId = new Map<string, InstrumentModule>();
  for (const m of modules) {
    validate(m);
    if (byId.has(m.spec.id)) throw new Error(`instrument "${m.spec.id}" is already registered`);
    byId.set(m.spec.id, m);
  }

  const all = () => [...byId.values()];
  const ungated = (family: string) => all().filter((m) => m.spec.family === family && !m.spec.adult);

  return {
    get: (id: string) => byId.get(id) ?? null,
    has: (id: string) => byId.has(id),
    all,
    ids: () => [...byId.keys()],
    byFamily: ungated,
    adult: () => all().filter((m) => m.spec.adult),
    byTier: (tier: Tier) => all().filter((m) => m.spec.tier === tier),
    /**
     * Grouped for the catalogue. The adult group comes last and carries
     * `gated: true`; the page decides whether its items are rendered at all.
     * `byFamily` already excludes them, so an adult instrument appears in
     * exactly one group and cannot leak into the ungated list.
     */
    groups() {
      return [
        { family: "profiler", labelKey: "catalog.group.profilers", noteKey: "catalog.group.profilersNote", items: ungated("profiler") },
        { family: "questionnaire", labelKey: "catalog.group.tests", noteKey: "catalog.group.testsNote", items: ungated("questionnaire") },
        { family: "adult", gated: true, labelKey: "catalog.group.adult", noteKey: "catalog.group.adultNote", items: all().filter((m) => m.spec.adult) },
      ].filter((g) => g.items.length);
    },
  };
}

/** What the sharing page may offer for one instrument. */
export function audiencesFor(spec: { maxAudience?: Audience } | null | undefined): Audience[] {
  const ceiling = AUDIENCE_ORDER.indexOf(spec?.maxAudience ?? "public");
  return AUDIENCE_ORDER.slice(0, (ceiling < 0 ? AUDIENCE_ORDER.length - 1 : ceiling) + 1);
}

export type Registry = ReturnType<typeof createRegistry>;
