/**
 * Provenance for riasec.
 *
 * Checked by test/instruments/provenance.test.js. See src/core/provenance.js
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Holland's RIASEC hexagon",
    origin: "John Holland, 1959 onwards",
    public: true,
    note: "The six types and the hexagon are public, and public-domain item pools exist (Liao, Armstrong and Rounds; the US DOL Interest Profiler). Items here are still written fresh.",
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
  avoided: ["Self-Directed Search", "Strong Interest Inventory"],
};
