/**
 * Provenance for chronotype.
 *
 * Checked by test/instruments/provenance.test.js. See src/core/provenance.js
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Chronotype as corrected mid-sleep",
    origin: "Roenneberg et al., Munich ChronoType Questionnaire",
    public: true,
    note: "The method \u2014 mid-sleep on free days corrected for sleep debt \u2014 is published. The MCTQ's own items are not reproduced; the six fields feeding the calculation are ours.",
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
  avoided: ["MCTQ", "Horne-Ostberg MEQ"],
};
