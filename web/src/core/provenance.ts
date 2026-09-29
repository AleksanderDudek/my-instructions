/**
 * Where an instrument's content came from — the contract, enforced.
 *
 * Ported from the frozen root app's `src/core/provenance.js`, which checks it
 * there. `web/` had the type and none of the checks: `items.origin` was any
 * string and nothing looked at `reproduces`, so the rule that every folder
 * writes its own items held only because every author so far had kept it.
 * `validate` in `core/registry.ts` now calls this for every module at import,
 * so a folder that breaks the contract breaks the build rather than shipping.
 *
 * The `evidence` block exists to be embarrassing. An original item bank has,
 * on the day it ships, no reliability, no factor structure and no criterion
 * validity: those belong to a specific item set given to a specific sample,
 * not to a construct's name. "none" in a file is harder to forget than a
 * hedge in the copy.
 */

export const ITEM_ORIGINS = ["original", "public-domain", "licensed"] as const;
export type ItemOrigin = (typeof ITEM_ORIGINS)[number];

export const EVIDENCE = ["none", "borrowed", "collected"] as const;
export type Evidence = (typeof EVIDENCE)[number];

export type ProvenanceRecord = {
  construct: { name: string; origin?: string; public: boolean; note?: string };
  /** `licence` is required when `origin` is "licensed", and names it (e.g. "CC BY 4.0"). */
  items: { origin: ItemOrigin; writtenFor?: string; licence?: string; source?: string };
  evidence: { reliability: Evidence; factorStructure: Evidence; criterion: Evidence; note?: string };
  /** Copyrighted material reproduced. Required to exist and to be empty. */
  reproduces: string[];
  /** Named instruments deliberately not used, and whose items are not present. */
  avoided?: string[];
};

const has = <T extends string>(list: readonly T[], value: unknown): value is T => list.includes(value as T);

export function validateProvenance(p: unknown, where = "instrument"): ProvenanceRecord {
  const r = p as Partial<ProvenanceRecord> | null;
  if (!r || typeof r !== "object") throw new TypeError(`${where}: provenance must be an object`);

  if (!r.construct?.name) throw new TypeError(`${where}: provenance.construct.name is required`);
  if (typeof r.construct.public !== "boolean") throw new TypeError(`${where}: provenance.construct.public must be a boolean`);

  if (!has(ITEM_ORIGINS, r.items?.origin)) {
    throw new TypeError(`${where}: provenance.items.origin must be one of ${ITEM_ORIGINS.join(", ")}`);
  }
  if (r.items.origin === "licensed" && !r.items.licence) {
    throw new TypeError(`${where}: licensed items must name the licence`);
  }
  // Borrowed items must say where from, or "public domain" is an assertion
  // nobody can check.
  if (r.items.origin !== "original" && !r.items.source) {
    throw new TypeError(`${where}: items that are not original must name their source`);
  }

  for (const field of ["reliability", "factorStructure", "criterion"] as const) {
    if (!has(EVIDENCE, r.evidence?.[field])) {
      throw new TypeError(`${where}: provenance.evidence.${field} must be one of ${EVIDENCE.join(", ")}`);
    }
  }

  // Required to exist and required to be empty: an instrument that needs a
  // non-empty one is an instrument this project has decided not to ship.
  if (!Array.isArray(r.reproduces)) throw new TypeError(`${where}: provenance.reproduces must be an array`);
  if (r.reproduces.length) throw new TypeError(`${where}: reproduces copyrighted material — ${r.reproduces.join(", ")}`);

  return r as ProvenanceRecord;
}
