/**
 * Provenance for couple-conversations.
 *
 * Checked by test/instruments/provenance.test.js.
 */
export default {
  construct: {
    name: "Premarital conversation coverage",
    origin: "Topic areas common to premarital inventories; the design follows Stanley, Rhoades and Markman on deciding rather than sliding",
    public: true,
    note: "The five topic areas are the common property of the field and appear in every premarital inventory. Nothing is taken from PREPARE/ENRICH, FOCCUS, RELATE or SYMBIS — not their items, not their scale structure, and specifically not PREPARE's Positive Couple Agreement scoring or its four-type couple typology, both of which depend on a norm base this project does not have and will not build.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* There is no scale here to have reliability. The instrument records
     positions and discussion status and computes no score at all. */
  evidence: {
    reliability: "none",
    factorStructure: "none",
    criterion: "none",
    note: "Nothing is summed and nothing is normed. The one claim the design rests on — that talking about these topics is useful — is held lightly: the two largest randomised trials of relationship education found null-to-trivial effects on relationship quality and none on stability, and the sourceNote says so.",
  },

  reproduces: [],
  avoided: ["PREPARE/ENRICH", "FOCCUS", "RELATE", "SYMBIS", "Gottman Institute instruments"],
};
