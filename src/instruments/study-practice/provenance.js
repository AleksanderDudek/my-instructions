/**
 * Provenance for study-practice.
 *
 * Checked by test/instruments/provenance.test.js.
 */
export default {
  construct: {
    name: "Study technique use",
    origin: "Dunlosky, Rawson, Marsh, Nathan and Willingham 2013; Rohrer and Pashler on interleaving",
    public: true,
    note: "The six techniques are named and rated in the published reviews, which are public scholarship rather than an instrument. There is no questionnaire to borrow \u2014 the techniques are behaviours with plain names, so the questions are ours and simply ask how often each is used.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* Nothing is measured here — frequency of a named behaviour is reported back
     as given — so there is no construct whose validity could be inherited. */
  evidence: {
    reliability: "none",
    factorStructure: "none",
    criterion: "none",
    note: "Nothing is scored. The techniques have published evidence behind them as techniques; this folder makes no claim that asking about them measures anything.",
  },

  reproduces: [],
  avoided: ["VARK", "Kolb Learning Style Inventory", "Honey and Mumford LSQ"],
};
