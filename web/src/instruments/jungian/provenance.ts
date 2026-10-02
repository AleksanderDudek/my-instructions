/**
 * Provenance for jungian.
 *
 * Checked by test/instruments/provenance.test.ts. See src/core/provenance.ts
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Jungian psychological types",
    origin: "C. G. Jung, Psychological Types, 1921",
    public: true,
    note: "Jung's text (1921) is out of copyright in the United States but, Jung having died in 1961, remains in copyright in the EU until the end of 2031; only its ideas are used and nothing of it is quoted. The four-letter instrument built on it is a trademark with copyrighted items and is not used; the code here is derived from the function stack rather than asked for.",
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
    // checked: Library of Congress record LCCN sg 26000017 (Psychologische Typen, von C.G. Jung, Zürich: Rascher & cie., 1921), via LoC SRU catalogue gateway
    { authors: "Jung, C. G.", year: 1921, title: "Psychologische Typen", source: "Zürich: Rascher & Cie.", url: "https://lccn.loc.gov/sg26000017", kind: "foundational", lang: "de" },
    // checked: Library of Congress record LCCN 79030449 (Princeton University Press, 1971; 'A revision by R. F. C. Hull of the translation by H. G. Baynes'); volume number from the publisher page https://press.princeton.edu/books/paperback/9780691018133/collected-works-of-cg-jung-volume-6
    { authors: "Jung, C. G.", year: 1971, title: "Psychological types", source: "Collected Works of C. G. Jung, Vol. 6 (Bollingen Series). A revision by R. F. C. Hull of the translation by H. G. Baynes. Princeton, NJ: Princeton University Press", url: "https://lccn.loc.gov/79030449", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1111/j.1467-6494.1989.tb00759.x (abstract: 'no support for the view that the MBTI measures truly dichotomous preferences or qualitatively distinct types')
    { authors: "McCrae, R. R., & Costa, P. T., Jr.", year: 1989, title: "Reinterpreting the Myers-Briggs Type Indicator from the perspective of the five-factor model of personality", source: "Journal of Personality, 57(1), 17–40", url: "https://doi.org/10.1111/j.1467-6494.1989.tb00759.x", kind: "critique" },
    // checked: https://api.crossref.org/works/10.1037/1065-9293.57.3.210; abstract via https://api.openalex.org/works/doi:10.1037/1065-9293.57.3.210
    { authors: "Pittenger, D. J.", year: 2005, title: "Cautionary comments regarding the Myers-Briggs Type Indicator", source: "Consulting Psychology Journal: Practice and Research, 57(3), 210–221", url: "https://doi.org/10.1037/1065-9293.57.3.210", kind: "critique" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["MBTI", "OEJTS items"],
};
