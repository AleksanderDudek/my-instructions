/**
 * Provenance for conflict-style.
 *
 * Checked by test/instruments/provenance.test.ts. See src/core/provenance.ts
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Dual-concern model of conflict",
    origin: "Blake and Mouton; Pruitt and Rubin",
    public: true,
    note: "The two-concern model is public theory. The Thomas-Kilmann instrument that operationalises it is commercially licensed and is not used.",
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
    // checked: Library of Congress record LCCN 64014724 (Robert R. Blake and Jane S. Mouton, Houston, Tex.: Gulf Pub. Co., 1964)
    { authors: "Blake, R. R., & Mouton, J. S.", year: 1964, title: "The managerial grid: Key orientations for achieving production through people", source: "Houston, TX: Gulf Publishing", url: "https://lccn.loc.gov/64014724", kind: "foundational" },
    // checked: Library of Congress record LCCN 85010842 (Random House, c1986, 1st ed., series Topics in social psychology)
    { authors: "Pruitt, D. G., & Rubin, J. Z.", year: 1986, title: "Social conflict: Escalation, stalemate, and settlement", source: "New York: Random House", url: "https://lccn.loc.gov/85010842", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1037/0022-3514.78.5.889; abstract via OpenAlex (meta-analysis of 28 studies testing Dual Concern Theory, Pruitt & Rubin 1986)
    { authors: "De Dreu, C. K. W., Weingart, L. R., & Kwon, S.", year: 2000, title: "Influence of social motives on integrative negotiation: A meta-analytic review and test of two theories", source: "Journal of Personality and Social Psychology, 78(5), 889–905", url: "https://doi.org/10.1037/0022-3514.78.5.889", kind: "review" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["Thomas-Kilmann Conflict Mode Instrument"],
};
