/**
 * Provenance for couple-conversations.
 *
 * Checked by test/instruments/provenance.test.ts.
 */
export default {
  construct: {
    name: "Premarital conversation coverage",
    origin: "Topic areas common to premarital inventories; the design follows Stanley, Rhoades and Markman on deciding rather than sliding",
    public: true,
    note: "The five topic areas are the common property of the field and appear in every premarital inventory. Nothing is taken from PREPARE/ENRICH, FOCCUS, RELATE or SYMBIS — not their items, not their scale structure, and specifically not PREPARE's Positive Couple Agreement scoring or its four-type couple typology, both of which depend on a norm base this project does not have and will not build.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* There is no scale here to have reliability. The instrument records
     positions and discussion status and computes no score at all. */
  evidence: {
    reliability: "none",
    factorStructure: "none",
    criterion: "none",
    note: "Nothing is summed and nothing is normed. The one claim the design rests on — that talking about these topics is useful — is held lightly: the two largest randomised trials of relationship education found null-to-trivial effects on relationship quality and none on stability, and the sourceNote says so.",
  },

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: https://api.crossref.org/works/10.1111/j.1741-3729.2006.00418.x
    { authors: "Stanley, S. M., Rhoades, G. K., & Markman, H. J.", year: 2006, title: "Sliding Versus Deciding: Inertia and the Premarital Cohabitation Effect", source: "Family Relations, 55(4), 499–509", url: "https://doi.org/10.1111/j.1741-3729.2006.00418.x", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1111/jomf.12094 (record + abstract: 3-year follow-up of >4,000 couples; did not improve the couple relationship; no effect on family stability); trial also confirmed at https://acf.gov/opre/report/building-strong-families-project-long-term-effects-building-strong-families
    { authors: "Wood, R. G., Moore, Q., Clarkwest, A., & Killewald, A.", year: 2014, title: "The Long-Term Effects of Building Strong Families: A Program for Unmarried Parents", source: "Journal of Marriage and Family, 76(2), 446–463", url: "https://doi.org/10.1111/jomf.12094", kind: "critique" },
    // checked: https://acf.gov/opre/report/supporting-healthy-marriage-evaluation-family-strengthening-program-low-income-0 (title, published 4 Apr 2014, finding: did not increase likelihood couples stayed together, small positive effects on relationship quality); authors and date from https://www.mdrc.org/work/publications/family-strengthening-program-low-income-families
    { authors: "Lundquist, E., Hsueh, J., Lowenstein, A., Faucetta, K., Gubits, D., Michalopoulos, C., & Knox, V.", year: 2014, title: "A Family-Strengthening Program for Low-Income Families: Final Impacts from the Supporting Healthy Marriage Evaluation", source: "Office of Planning, Research and Evaluation, Administration for Children and Families, U.S. Department of Health and Human Services (MDRC)", url: "https://acf.gov/opre/report/supporting-healthy-marriage-evaluation-family-strengthening-program-low-income-0", kind: "critique" },
  ],

  reproduces: [],
  avoided: ["PREPARE/ENRICH", "FOCCUS", "RELATE", "SYMBIS", "Gottman Institute instruments"],
};
