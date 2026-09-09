/**
 * Provenance for work-values.
 *
 * Checked by test/instruments/provenance.test.js. See src/core/provenance.js
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "The six work values",
    origin: "Dawis and Lofquist's Theory of Work Adjustment; adopted by the US Department of Labor for the O*NET Work Importance Locator",
    public: true,
    note: "The six values were derived by factor analysis from the Minnesota Importance Questionnaire's twenty needs, and the O*NET content model that renames and publishes them is a US federal work product released under CC BY 4.0. The taxonomy is therefore free to use with attribution. The Minnesota Importance Questionnaire itself is not, and none of its items appear here.",
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
    note: "The six-factor structure is a property of the Minnesota data, not of these thirty-six sentences. This bank has never been administered to a sample, has no norms, and its factor structure has never been checked.",
  },

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["Minnesota Importance Questionnaire", "O*NET Work Importance Locator", "O*NET Work Importance Profiler", "Values Scale"],
};
