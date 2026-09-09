/**
 * Provenance for work-shape.
 *
 * Checked by test/instruments/provenance.test.js. See src/core/provenance.js
 * for what each field means and why the evidence block is allowed to be
 * embarrassing.
 */
export default {
  construct: {
    name: "The shape of the work",
    origin: "No published instrument. The four contrasts are ordinary distinctions about work, chosen because they are the ones riasec cannot see",
    public: true,
    note: "There is no scale behind this folder. Holland's interest types sort work by subject matter, and the O*NET Generalized Work Activities taxonomy sorts tasks by what is done — neither asks whether the doing is long or short, framed or unframed, made or negotiated. Those are the questions here, and they are asked as preferences.",
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
    note: "Eight scales are asserted here, not discovered. Nobody has factor-analysed this bank, nobody has retested it, and there is no evidence that a person whose shape matches their work does better in it — only the ordinary observation that people leave work whose shape they dislike.",
  },

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["CliftonStrengths", "Myers-Briggs Type Indicator", "Kolb Learning Style Inventory", "TREO team role instrument"],
};
