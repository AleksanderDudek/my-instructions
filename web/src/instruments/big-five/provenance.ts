/**
 * Provenance for big-five.
 *
 * Checked by test/instruments/provenance.test.ts. See src/core/provenance.ts
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Five-factor model",
    origin: "Tupes and Christal 1961; Costa and McCrae",
    public: true,
    note: "The factor structure is public and heavily replicated. The NEO-PI-R's items are not used; IPIP's public-domain markers could be substituted as data.",
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
    // checked: 1961 report: IIT Contrails library record https://contrails.library.iit.edu/item/158880 (ASD TR 61-97, Personnel Laboratory, May 1961, DTIC AD0267778); 1992 reprint: https://api.crossref.org/works/10.1111/j.1467-6494.1992.tb00973.x and PubMed PMID 1635043; reprint relationship documented in J. A. Johnson, 'Five strong and recurrent personality factors: Revisiting Tupes and Christal (1961)', note 1
    { authors: "Tupes, E. C., & Christal, R. E.", year: 1961, title: "Recurrent personality factors based on trait ratings", source: "Technical Report ASD-TR-61-97, Personnel Laboratory, US Air Force. Reprinted in Journal of Personality, 60(2), 225–251 (1992)", url: "https://doi.org/10.1111/j.1467-6494.1992.tb00973.x", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1037/0022-3514.52.1.81
    { authors: "McCrae, R. R., & Costa, P. T., Jr.", year: 1987, title: "Validation of the five-factor model of personality across instruments and observers", source: "Journal of Personality and Social Psychology, 52(1), 81–90", url: "https://doi.org/10.1037/0022-3514.52.1.81", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1037/0003-066X.52.5.509
    { authors: "McCrae, R. R., & Costa, P. T., Jr.", year: 1997, title: "Personality trait structure as a human universal", source: "American Psychologist, 52(5), 509–516", url: "https://doi.org/10.1037/0003-066X.52.5.509", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1037/0033-2909.117.2.187
    { authors: "Block, J.", year: 1995, title: "A contrarian view of the five-factor approach to personality description", source: "Psychological Bulletin, 117(2), 187–215", url: "https://doi.org/10.1037/0033-2909.117.2.187", kind: "critique" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["NEO-PI-R"],
};
