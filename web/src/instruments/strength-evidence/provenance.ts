/**
 * Provenance for strength-evidence.
 *
 * Checked by test/instruments/provenance.test.ts. See src/core/provenance.ts
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "Evidenced strength claims",
    origin: "No construct. The design is a refusal: self-rated ability correlates around r = .29 with measured performance, so the rating is replaced by an instance",
    public: true,
    note: "Every commercial strengths product in this space is a self-rating, usually ipsative and usually licensed. This folder asks for occasions instead of ratings, because an occasion is checkable and a rating is not. Nothing about the design is borrowed.",
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
    note: "There is nothing here to validate. The episodes are the reader's own account of their own history, reported back sorted against their own claims. No score is produced, so no score can be wrong.",
  },

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: https://api.crossref.org/works/10.1177/1745691613518075 (abstract: 22 meta-analyses, mean correlation between ability self-evaluations and performance M = .29, SD = .11)
    { authors: "Zell, E., & Krizan, Z.", year: 2014, title: "Do people have insight into their abilities? A metasynthesis", source: "Perspectives on Psychological Science, 9(2), 111–125", url: "https://doi.org/10.1177/1745691613518075", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1111/j.1529-1006.2004.00018.x (abstract: 'The correlation between self-ratings of skill and actual performance in many domains is moderate to meager')
    { authors: "Dunning, D., Heath, C., & Suls, J. M.", year: 2004, title: "Flawed self-assessment: Implications for health, education, and the workplace", source: "Psychological Science in the Public Interest, 5(3), 69–106", url: "https://doi.org/10.1111/j.1529-1006.2004.00018.x", kind: "review" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["CliftonStrengths", "VIA Character Strengths", "Strengths Profile", "Realise2"],
};
