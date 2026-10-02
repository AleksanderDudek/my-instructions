/**
 * Provenance for hexaco.
 *
 * Checked by test/instruments/provenance.test.ts. See src/core/provenance.ts
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

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: https://api.crossref.org/works/10.1037/0022-3514.86.2.356
    { authors: "Ashton, M. C., Lee, K., Perugini, M., Szarota, P., de Vries, R. E., Di Blas, L., Boies, K., & De Raad, B.", year: 2004, title: "A six-factor structure of personality-descriptive adjectives: Solutions from psycholexical studies in seven languages", source: "Journal of Personality and Social Psychology, 86(2), 356–366", url: "https://doi.org/10.1037/0022-3514.86.2.356", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1177/1088868306294907
    { authors: "Ashton, M. C., & Lee, K.", year: 2007, title: "Empirical, theoretical, and practical advantages of the HEXACO model of personality structure", source: "Personality and Social Psychology Review, 11(2), 150–166", url: "https://doi.org/10.1177/1088868306294907", kind: "review" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["HEXACO-PI-R"],
};
