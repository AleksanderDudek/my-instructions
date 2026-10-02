/**
 * Provenance for riasec.
 *
 * Checked by test/instruments/provenance.test.ts. See src/core/provenance.ts
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Holland's RIASEC hexagon",
    origin: "John Holland, 1959 onwards",
    public: true,
    note: "The six types and the hexagon are public, and freely available item pools exist (Liao, Armstrong and Rounds — whose own lab page calls them copyrighted, free for noncommercial use, though the paper's title says public domain; the US DOL Interest Profiler). Items here are still written fresh.",
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
    // checked: https://api.crossref.org/works/10.1037/h0040767
    { authors: "Holland, J. L.", year: 1959, title: "A theory of vocational choice", source: "Journal of Counseling Psychology, 6(1), 35–45", url: "https://doi.org/10.1037/h0040767", kind: "foundational" },
    // checked: Library of Congress catalogue, LCCN 97008435 (ISBN 0911907270), queried via http://lx2.loc.gov:210/lcdb SRU
    { authors: "Holland, J. L.", year: 1997, title: "Making vocational choices: A theory of vocational personalities and work environments (3rd ed.)", source: "Psychological Assessment Resources, Odessa, FL", url: "https://lccn.loc.gov/97008435", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1037/a0018213
    { authors: "Nauta, M. M.", year: 2010, title: "The development, evolution, and status of Holland's theory of vocational personalities: Reflections and future directions for counseling psychology", source: "Journal of Counseling Psychology, 57(1), 11–22", url: "https://doi.org/10.1037/a0018213", kind: "review" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["Self-Directed Search", "Strong Interest Inventory"],
};
