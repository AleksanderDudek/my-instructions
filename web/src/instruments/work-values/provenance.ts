/**
 * Provenance for work-values.
 *
 * Checked by test/instruments/provenance.test.ts. See src/core/provenance.ts
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

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: Library of Congress catalogue, LCCN 83023381 (ISBN 0816613168), queried via http://lx2.loc.gov:210/lcdb SRU; also Open Library OL3180751M
    { authors: "Dawis, R. V., & Lofquist, L. H.", year: 1984, title: "A psychological theory of work adjustment: An individual-differences model and its applications", source: "University of Minnesota Press, Minneapolis", url: "https://lccn.loc.gov/83023381", kind: "foundational" },
    // checked: https://www.onetcenter.org/reports/DevWIL.html and the report's title page, https://www.onetcenter.org/dl_files/DevWIL.pdf
    { authors: "McCloy, R., Waugh, G., Medsker, G., Wall, J., Rivkin, D., & Lewis, P.", year: 1999, title: "Development of the O*NET paper-and-pencil Work Importance Locator", source: "National Center for O*NET Development, Raleigh, NC", url: "https://www.onetcenter.org/reports/DevWIL.html", kind: "foundational" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["Minnesota Importance Questionnaire", "O*NET Work Importance Locator", "O*NET Work Importance Profiler", "Values Scale"],
};
