/**
 * Provenance for working-style.
 *
 * Checked by test/instruments/provenance.test.js. See src/core/provenance.js
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Working preferences",
    origin: "No published instrument; this is not a psychological construct",
    public: true,
    note: "There is no instrument behind this folder and there does not need to be. How much notice you want before a plan changes is a fact about how you would like to be treated.",
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
    note: "Nothing here is measured, so there is nothing to validate. The answers are the result.",
  },

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: [],
};
