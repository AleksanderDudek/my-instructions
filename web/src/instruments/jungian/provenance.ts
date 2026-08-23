/**
 * Provenance for jungian.
 *
 * Checked by test/instruments/provenance.test.js. See src/core/provenance.js
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Jungian psychological types",
    origin: "C. G. Jung, Psychological Types, 1921",
    public: true,
    note: "Jung's text is public domain. The four-letter instrument built on it is a trademark with copyrighted items and is not used; the code here is derived from the function stack rather than asked for.",
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
  avoided: ["MBTI", "OEJTS items"],
};
