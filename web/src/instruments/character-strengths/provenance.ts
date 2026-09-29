/**
 * Provenance for character-strengths.
 *
 * See src/core/provenance.ts for what each field means. The licence research
 * behind the `avoided` list is reports/Six test sources and licences.md.
 */
export default {
  construct: {
    name: "Character strengths and virtues",
    origin: "Peterson and Seligman 2004, Character Strengths and Virtues: A Handbook and Classification",
    public: true,
    note: "The twenty-four strengths and six virtues are a published classification; the names are ordinary words. The VIA Institute's terms claim approval over assessments of \"the VIA character strengths\", so the name VIA appears nowhere here and none of its items are used. The public-domain IPIP-VIA and IPIP-VIA-R scales could be substituted as data for English wording with published reliability; they are not, because a borrowed bank would make app.noValidation false for this instrument, the web/ provenance contract does not yet check borrowed items, and whether IPIP's grant holds against VIA's claim is untested.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* Borrowed nothing, and therefore inherited nothing. */
  evidence: {
    reliability: "none",
    factorStructure: "none",
    criterion: "none",
    note: "Three items a strength has never been given to a sample. At that length a scale can order someone's strengths; it cannot measure any one of them.",
  },

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["VIA-IS", "VIA-IS-R", "VIA-120", "VIA-72", "IPIP-VIA", "IPIP-VIA-R", "CliftonStrengths", "Strengths Profile"],
};
