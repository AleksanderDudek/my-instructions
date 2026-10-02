/**
 * Provenance for chronotype.
 *
 * Checked by test/instruments/provenance.test.ts. See src/core/provenance.ts
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

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: PubMed PMID 12568247
    { authors: "Roenneberg, T., Wirz-Justice, A., & Merrow, M.", year: 2003, title: "Life between clocks: Daily temporal patterns of human chronotypes", source: "Journal of Biological Rhythms, 18(1), 80–90", url: "https://doi.org/10.1177/0748730402239679", kind: "foundational" },
    // checked: PubMed PMID 17936039
    { authors: "Roenneberg, T., Kuehnle, T., Juda, M., Kantermann, T., Allebrandt, K., Gordijn, M., & Merrow, M.", year: 2007, title: "Epidemiology of the human circadian clock", source: "Sleep Medicine Reviews, 11(6), 429–438", url: "https://doi.org/10.1016/j.smrv.2007.07.005", kind: "foundational" },
    // checked: PubMed PMID 31336976; full text PMC6784249
    { authors: "Roenneberg, T., Pilz, L. K., Zerbini, G., & Winnebeck, E. C.", year: 2019, title: "Chronotype and social jetlag: A (self-) critical review", source: "Biology, 8(3), 54", url: "https://doi.org/10.3390/biology8030054", kind: "review" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["MCTQ", "Horne-Ostberg MEQ"],
};
