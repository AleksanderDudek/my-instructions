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

export const REFERENCE_KINDS = ["foundational", "review", "critique", "popular"] as const;
export type ReferenceKind = (typeof REFERENCE_KINDS)[number];

/**
 * One entry of an instrument's further reading, shown on its page as written:
 * a citation is not translated, so `lang` marks the title's language for
 * screen readers. Every entry was checked against a DOI, PubMed or the
 * publisher's own record before it went in — a reading list is the one place
 * a fabricated citation would do the most damage to the claim the page makes.
 *
 * `critique` is a first-class kind on purpose. For frameworks whose honest
 * record includes the people who dismantled them, the list carries them too.
 */
export type Reference = {
  authors: string;
  year: number;
  title: string;
  source?: string;
  url?: string;
  kind: ReferenceKind;
  /** BCP 47 tag of the title's language; "en" when absent. */
  lang?: string;
};

export type ProvenanceRecord = {
  construct: { name: string; origin?: string; public: boolean; note?: string };
  /** `licence` is required when `origin` is "licensed", and names it (e.g. "CC BY 4.0"). */
  items: { origin: ItemOrigin; writtenFor?: string; licence?: string; source?: string };
  evidence: { reliability: Evidence; factorStructure: Evidence; criterion: Evidence; note?: string };
  /** Copyrighted material reproduced. Required to exist and to be empty. */
  reproduces: string[];
  /** Named instruments deliberately not used, and whose items are not present. */
  avoided?: string[];
  /** Further reading, verified. Absent or empty where nothing published stands behind the design. */
  references?: Reference[];
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

  if (r.references !== undefined) {
    if (!Array.isArray(r.references)) throw new TypeError(`${where}: provenance.references must be an array`);
    r.references.forEach((ref, n) => {
      const at = `${where}: reference ${n + 1}`;
      if (!ref?.authors || !ref.title) throw new TypeError(`${at} needs authors and a title`);
      if (!Number.isInteger(ref.year) || ref.year < 1500 || ref.year > 2100) throw new TypeError(`${at} needs a plausible year`);
      if (!has(REFERENCE_KINDS, ref.kind)) throw new TypeError(`${at}: kind must be one of ${REFERENCE_KINDS.join(", ")}`);
      if (ref.url !== undefined && !/^https:\/\//.test(ref.url)) throw new TypeError(`${at}: url must be https`);
    });
  }

  return r as ProvenanceRecord;
}
