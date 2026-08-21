/**
 * Provenance for attachment.
 *
 * Checked by test/instruments/provenance.test.js. See src/core/provenance.js
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Two-dimensional adult attachment",
    origin: "Brennan, Clark and Shaver 1998; Fraley, Waller and Brennan 2000",
    public: true,
    note: "The anxiety-by-avoidance structure is public. The ECR-R's items are the authors' and are not reproduced.",
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
  avoided: ["ECR-R", "ECR-RS"],
};
