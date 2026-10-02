/**
 * Provenance for numerology.
 *
 * Checked by test/instruments/provenance.test.ts. See src/core/provenance.ts
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Pythagorean numerology and the two zodiacs",
    origin: "Traditional",
    public: true,
    note: "Traditional systems in the public domain, computed as the traditions specify. No part of it is empirically supported and the copy says so.",
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
    note: "Nothing here is measured, so there is nothing to validate. The answers are the result.",
  },

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: https://api.crossref.org/works/10.1016/j.paid.2005.11.017 ; abstract read from the authors' PDF at https://helmuthnyborg.dk/wp-content/uploads/2016/07/Publ_2006_Date-of-birth.pdf
    { authors: "Hartmann, P., Reuter, M., & Nyborg, H.", year: 2006, title: "The relationship between date of birth and individual differences in personality and general intelligence: A large-scale study", source: "Personality and Individual Differences, 40(7), 1349–1362", url: "https://doi.org/10.1016/j.paid.2005.11.017", kind: "critique" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: [],
};
