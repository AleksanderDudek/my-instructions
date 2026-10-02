/**
 * Provenance for attachment.
 *
 * Checked by test/instruments/provenance.test.ts. See src/core/provenance.ts
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Two-dimensional adult attachment",
    origin: "Brennan, Clark and Shaver 1998; Fraley, Waller and Brennan 2000",
    public: true,
    note: "The anxiety-by-avoidance structure is public. The ECR-R's items are the authors' and are not reproduced.",
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
    // checked: Library of Congress record LCCN 97037552 (book: Simpson & Rholes, eds., Guilford Press, c1998) and its publisher-supplied table of contents https://catdir.loc.gov/catdir/toc/guilford041/97037552.html (ch. 3, exact chapter title and authors); page range 46–76 from https://labs.psychology.illinois.edu/~rcfraley/measures/brennan.html, first page 46 also in the Crossref reference list of Shaver, Belsky & Brennan 2000 (doi 10.1111/j.1475-6811.2000.tb00002.x)
    { authors: "Brennan, K. A., Clark, C. L., & Shaver, P. R.", year: 1998, title: "Self-report measurement of adult attachment: An integrative overview", source: "In J. A. Simpson & W. S. Rholes (Eds.), Attachment theory and close relationships (pp. 46–76). New York: Guilford Press", url: "https://lccn.loc.gov/97037552", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1037/0022-3514.78.2.350; PubMed PMID 10707340
    { authors: "Fraley, R. C., Waller, N. G., & Brennan, K. A.", year: 2000, title: "An item response theory analysis of self-report measures of adult attachment", source: "Journal of Personality and Social Psychology, 78(2), 350–365", url: "https://doi.org/10.1037/0022-3514.78.2.350", kind: "foundational" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["ECR-R", "ECR-RS"],
};
