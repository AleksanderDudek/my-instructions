/**
 * Provenance for love-languages.
 *
 * Checked by test/instruments/provenance.test.ts. See src/core/provenance.ts
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Five love languages",
    origin: "Gary Chapman, 1992",
    public: true,
    note: "The five categories are Chapman's and are public; his own 30-item quiz is copyrighted and ipsative, and is not used.",
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
    // checked: Library of Congress record LCCN 93182018 (The five love languages, Gary Chapman, Chicago: Northfield Pub., c1992, ISBN 1881273156); subtitle from Open Library edition record for the same ISBN https://openlibrary.org/isbn/1881273156 (LoC MARC source) and the Crossref-deposited reference in Egbert & Polk 2006 (doi 10.1080/17464090500535822)
    { authors: "Chapman, G.", year: 1992, title: "The five love languages: How to express heartfelt commitment to your mate", source: "Chicago: Northfield Publishing", url: "https://lccn.loc.gov/93182018", kind: "popular" },
    // checked: https://api.crossref.org/works/10.1111/pere.12182 (abstract: 67 couples; 'limited evidence that love language alignment promotes satisfaction')
    { authors: "Bunt, S., & Hazelwood, Z. J.", year: 2017, title: "Walking the walk, talking the talk: Love languages, self-regulation, and relationship satisfaction", source: "Personal Relationships, 24(2), 280–290", url: "https://doi.org/10.1111/pere.12182", kind: "critique" },
    // checked: https://api.crossref.org/works/10.1177/09637214231217663 (abstract: the evidence 'does not provide strong empirical support for the book's three central assumptions')
    { authors: "Impett, E. A., Park, H. G., & Muise, A.", year: 2024, title: "Popular psychology through a scientific lens: Evaluating love languages from a relationship science perspective", source: "Current Directions in Psychological Science, 33(2), 87–92", url: "https://doi.org/10.1177/09637214231217663", kind: "critique" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["Chapman's Five Love Languages quiz"],
};
