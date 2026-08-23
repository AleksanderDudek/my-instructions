/**
 * Provenance for intimacy-conditions.
 *
 * Checked by test/instruments/provenance.test.js.
 */
export default {
  construct: {
    name: "Conditions and requests around intimacy",
    origin: "Communication research (Mallory et al. 2022 meta-analysis); Basson's circular model and the dual-control model as background",
    public: true,
    note: "No published instrument is used, adapted or abbreviated. The dual-control model's content appears only as the wording of a condition card, never as a scored axis; Basson's circular model informs one question about when wanting arrives and is not used to assign anybody a pathway. Erotic Blueprints and every activity checklist are refused outright rather than rewritten.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* Nothing is scored, so there is no scale whose reliability could be
     claimed or borrowed. The comfort items are recorded raw and never summed. */
  evidence: {
    reliability: "none",
    factorStructure: "none",
    criterion: "none",
    note: "The one finding the content rests on — that sexual communication has the largest reliable association with satisfaction in this domain — is cross-sectional, same-source and partly overlapping in its measures. It is enough to decide what to ask about and not enough to promise a result, and the sourceNote says so.",
  },

  reproduces: [],
  avoided: [
    "Erotic Blueprints",
    "Sexual Desire Inventory",
    "SIS/SES dual control scales",
    "New Sexual Satisfaction Scale",
    "any activity checklist",
  ],
};
