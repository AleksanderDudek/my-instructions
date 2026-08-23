/**
 * Provenance for numerology.
 *
 * Checked by test/instruments/provenance.test.js. See src/core/provenance.js
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Pythagorean numerology and the two zodiacs",
    origin: "Traditional",
    public: true,
    note: "Traditional systems in the public domain, computed as the traditions specify. No part of it is empirically supported and the copy says so.",
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
