/**
 * Provenance for intimacy-conditions.
 *
 * Checked by test/instruments/provenance.test.ts.
 */
export default {
  construct: {
    name: "Conditions and requests around intimacy",
    origin: "Communication research (Mallory 2022, a meta-analysis); Basson's circular model and the dual-control model as background",
    public: true,
    note: "No published instrument is used, adapted or abbreviated. The dual-control model's content appears only as the wording of a condition card, never as a scored axis; Basson's circular model informs one question about when wanting arrives and is not used to assign anybody a pathway. Erotic Blueprints and every activity checklist are refused outright rather than rewritten.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* Nothing is scored, so there is no scale whose reliability could be
     claimed or borrowed. The comfort items are recorded raw and never summed. */
  evidence: {
    reliability: "none",
    factorStructure: "none",
    criterion: "none",
    note: "The one finding the content rests on — that sexual communication has the largest reliable association with satisfaction in this domain — is cross-sectional, same-source and partly overlapping in its measures. It is enough to decide what to ask about and not enough to promise a result, and the sourceNote says so.",
  },

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: PubMed PMID 34968095 (https://pubmed.ncbi.nlm.nih.gov/34968095/); Crossref https://api.crossref.org/works/10.1037/fam0000946 — single author
    { authors: "Mallory, A. B.", year: 2022, title: "Dimensions of couples' sexual communication, relationship satisfaction, and sexual satisfaction: A meta-analysis", source: "Journal of Family Psychology, 36(3), 358–371", url: "https://doi.org/10.1037/fam0000946", kind: "review" },
    // checked: PubMed PMID 10693116 (https://pubmed.ncbi.nlm.nih.gov/10693116/); Crossref https://api.crossref.org/works/10.1080/009262300278641
    { authors: "Basson, R.", year: 2000, title: "The female sexual response: A different model", source: "Journal of Sex & Marital Therapy, 26(1), 51–65", url: "https://doi.org/10.1080/009262300278641", kind: "foundational" },
    // checked: https://doi.org/10.1080/00224490902747222 (Crossref; offered as the verified alternative by the reference researcher)
    { authors: "Bancroft, J., Graham, C. A., Janssen, E., & Sanders, S. A.", year: 2009, title: "The dual control model: Current status and future directions", source: "Journal of Sex Research, 46(2–3), 121–142", url: "https://doi.org/10.1080/00224490902747222", kind: "review" },
  ],

  reproduces: [],
  avoided: [
    "Erotic Blueprints",
    "Sexual Desire Inventory",
    "SIS/SES dual control scales",
    "New Sexual Satisfaction Scale",
    "any activity checklist",
  ],
};
