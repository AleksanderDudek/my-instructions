/**
 * Provenance for strength-evidence.
 *
 * Checked by test/instruments/provenance.test.js. See src/core/provenance.js
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Evidenced strength claims",
    origin: "No construct. The design is a refusal: self-rated ability correlates around r = .29 with measured performance, so the rating is replaced by an instance",
    public: true,
    note: "Every commercial strengths product in this space is a self-rating, usually ipsative and usually licensed. This folder asks for occasions instead of ratings, because an occasion is checkable and a rating is not. Nothing about the design is borrowed.",
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
    note: "There is nothing here to validate. The episodes are the reader's own account of their own history, reported back sorted against their own claims. No score is produced, so no score can be wrong.",
  },

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["CliftonStrengths", "VIA Character Strengths", "Strengths Profile", "Realise2"],
};
