/**
 * Provenance for enneagram.
 *
 * Checked by test/instruments/provenance.test.ts. See src/core/provenance.ts
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Enneagram of personality",
    origin: "Ichazo and Naranjo, twentieth century",
    public: true,
    note: "The nine-type model is public. The RHETI's forced-choice items are Riso and Hudson's and are not used.",
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
    // checked: Library of Congress record LCCN 94021263 (Gateways/IDHHB, c1994; LC subject heading 'Enneagram'); also cited in the reference list of Hook et al. 2021 (doi 10.1002/jclp.23097)
    { authors: "Naranjo, C.", year: 1994, title: "Character and neurosis: An integrative view", source: "Nevada City, CA: Gateways/IDHHB", url: "https://lccn.loc.gov/94021263", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1002/jclp.23097 (abstract: 'mixed evidence of reliability and validity ... factor analytic work has typically found fewer than nine factors, and no work has used clustering techniques to derive the nine types')
    { authors: "Hook, J. N., Hall, T. W., Davis, D. E., Van Tongeren, D. R., & Conner, M.", year: 2021, title: "The Enneagram: A systematic review of the literature and directions for future research", source: "Journal of Clinical Psychology, 77(4), 865–883", url: "https://doi.org/10.1002/jclp.23097", kind: "review" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["RHETI"],
};
