/**
 * Provenance for hexaco.
 *
 * Checked by test/instruments/provenance.test.js. See src/core/provenance.js
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "HEXACO six-factor model",
    origin: "Ashton and Lee, 2000s",
    public: true,
    note: "The six-factor structure is public. The HEXACO-PI-R's own items are the authors' and are not used.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* Deliberately borrowed nothing, and therefore inherited nothing. */
  evidence: {
    reliability: "none",
    factorStructure: "none",
    criterion: "none",
    note: "Reliability and validity are properties of a specific item set given to a specific population, not of a construct's name. This bank has never been administered to a sample and has no norms.",
  },

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["HEXACO-PI-R"],
};
