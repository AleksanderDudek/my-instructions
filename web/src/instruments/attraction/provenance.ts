/**
 * Provenance for attraction.
 *
 * Checked by test/instruments/provenance.test.js.
 */
export default {
  construct: {
    name: "Attraction, behaviour and identity as separate dimensions",
    origin: "The ABI framework used across NSFG, Natsal, NHIS and the ONS census; Storms (1980) for independent intensity axes",
    public: true,
    note: "The three-dimension structure and the two-axis idea are published scholarship and government survey practice, not instruments. Items here are written fresh. Specifically not used: the Kinsey Institute's rating descriptions, which carry their own copyright notice; Klein's Sexual Orientation Grid, whose wording and variable prompts are the American Institute of Bisexuality's and are marked all rights reserved; and the AIS-12, which is journal-published and normally reused by author permission.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* Nothing is scored against anything. The axes are four-step answers
     reported back, and the instrument assigns no identity at all. */
  evidence: {
    reliability: "none",
    factorStructure: "none",
    criterion: "none",
    note: "The National Academies concluded in 2022 that no attraction measure has been validated for assigning an identity, which is a stronger statement than this instrument would need: it does not assign one. What it reports are the answers given.",
  },

  reproduces: [],
  avoided: [
    "Kinsey scale rating descriptions",
    "Klein Sexual Orientation Grid",
    "Asexuality Identification Scale (AIS-12)",
    "Sell Assessment of Sexual Orientation",
  ],
};
