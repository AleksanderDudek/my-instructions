/**
 * Provenance for attraction.
 *
 * Checked by test/instruments/provenance.test.ts.
 */
export default {
  construct: {
    name: "Attraction, behaviour and identity as separate dimensions",
    origin: "The ABI framework used across NSFG, Natsal, NHIS and the ONS census; Storms (1980) for independent intensity axes",
    public: true,
    note: "The three-dimension structure and the two-axis idea are published scholarship and government survey practice, not instruments. Items here are written fresh. Specifically not used: the Kinsey Institute's rating descriptions, which carry their own copyright notice; Klein's Sexual Orientation Grid, whose wording and variable prompts are the American Institute of Bisexuality's and are marked all rights reserved; and the AIS-12, which is journal-published and normally reused by author permission.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* Nothing is scored against anything. The axes are four-step answers
     reported back, and the instrument assigns no identity at all. */
  evidence: {
    reliability: "none",
    factorStructure: "none",
    criterion: "none",
    note: "The National Academies concluded in 2022 that no attraction measure has been validated for assigning an identity, which is a stronger statement than this instrument would need: it does not assign one. What it reports are the answers given.",
  },

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: https://api.crossref.org/works/10.1037/0022-3514.38.5.783
    { authors: "Storms, M. D.", year: 1980, title: "Theories of sexual orientation", source: "Journal of Personality and Social Psychology, 38(5), 783–792", url: "https://doi.org/10.1037/0022-3514.38.5.783", kind: "foundational" },
    // checked: https://press.uchicago.edu/ucp/books/book/chicago/S/bo3626005.html (publisher record: title, four authors in order, 1994, ISBN 9780226470207)
    { authors: "Laumann, E. O., Gagnon, J. H., Michael, R. T., & Michaels, S.", year: 1994, title: "The Social Organization of Sexuality: Sexual Practices in the United States", source: "University of Chicago Press", url: "https://press.uchicago.edu/ucp/books/book/chicago/S/bo3626005.html", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.17226/26424 and https://www.nationalacademies.org/publications/26424; ch. 3 (https://www.nationalacademies.org/read/26424/chapter/6) treats identity, behavior and attraction as separate components, none a proxy for another
    { authors: "National Academies of Sciences, Engineering, and Medicine", year: 2022, title: "Measuring Sex, Gender Identity, and Sexual Orientation", source: "The National Academies Press", url: "https://doi.org/10.17226/26424", kind: "review" },
  ],

  reproduces: [],
  avoided: [
    "Kinsey scale rating descriptions",
    "Klein Sexual Orientation Grid",
    "Asexuality Identification Scale (AIS-12)",
    "Sell Assessment of Sexual Orientation",
  ],
};
