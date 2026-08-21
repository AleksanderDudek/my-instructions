/**
 * Where an instrument's content came from.
 *
 * Every folder in this app writes its own items, because the framework may be
 * public while the questionnaire is copyrighted. That practice has been
 * followed since the first instrument and recorded nowhere except in prose at
 * the top of each item bank, which is exactly the kind of record that is
 * complete until the day somebody adds a folder in a hurry.
 *
 * A provenance file makes it checkable. `validate` is called from the contract
 * test against every folder on disk, so a new instrument without one fails the
 * suite rather than shipping and being discovered later.
 *
 * The `evidence` block exists to be embarrassing. An instrument with an
 * original item bank has, on the day it ships, no reliability data, no
 * factor-structure data and no criterion validity — those are properties of a
 * specific item set given to a specific population, not properties of a
 * construct's name. Writing "none" in a file is harder to forget than
 * remembering to hedge in the copy.
 */

const ITEM_ORIGINS = new Set(["original", "public-domain", "licensed"]);
const EVIDENCE = new Set(["none", "borrowed", "collected"]);

function validate(provenance, where = "instrument") {
  const p = provenance;
  if (!p || typeof p !== "object") throw new TypeError(`${where}: provenance must be an object`);

  if (!p.construct?.name) throw new TypeError(`${where}: provenance.construct.name is required`);
  if (typeof p.construct.public !== "boolean") throw new TypeError(`${where}: provenance.construct.public must be a boolean`);

  if (!ITEM_ORIGINS.has(p.items?.origin)) {
    throw new TypeError(`${where}: provenance.items.origin must be one of ${[...ITEM_ORIGINS].join(", ")}`);
  }
  if (p.items.origin === "licensed" && !p.items.licence) {
    throw new TypeError(`${where}: licensed items must name the licence`);
  }

  for (const field of ["reliability", "factorStructure", "criterion"]) {
    if (!EVIDENCE.has(p.evidence?.[field])) {
      throw new TypeError(`${where}: provenance.evidence.${field} must be one of ${[...EVIDENCE].join(", ")}`);
    }
  }

  // The list of copyrighted material this folder reproduces. It is required to
  // exist and required to be empty: an instrument that needs a non-empty one
  // is an instrument this project has decided not to ship.
  if (!Array.isArray(p.reproduces)) throw new TypeError(`${where}: provenance.reproduces must be an array`);
  if (p.reproduces.length) throw new TypeError(`${where}: reproduces copyrighted material — ${p.reproduces.join(", ")}`);

  return p;
}

export { validate, ITEM_ORIGINS, EVIDENCE };
