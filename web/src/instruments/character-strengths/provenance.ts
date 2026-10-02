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

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: Library of Congress record LCCN 2003024320 (Christopher Peterson & Martin E.P. Seligman; American Psychological Association / Oxford University Press, 2004; ISBN 0195167015)
    { authors: "Peterson, C., & Seligman, M. E. P.", year: 2004, title: "Character strengths and virtues: A handbook and classification", source: "Washington, DC: American Psychological Association; New York: Oxford University Press", url: "https://lccn.loc.gov/2003024320", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1080/17439760.2014.994222; abstract via OpenAlex ('factor analyses ... usually suggest 4–5 factors that do not correspond well to traditional lists of virtues'; proposes a three-virtue structure across 1,070,549 cases)
    { authors: "McGrath, R. E.", year: 2015, title: "Integrating psychological and cultural perspectives on virtue: The hierarchical structure of character strengths", source: "The Journal of Positive Psychology, 10(5), 407–424", url: "https://doi.org/10.1080/17439760.2014.994222", kind: "critique" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["VIA-IS", "VIA-IS-R", "VIA-120", "VIA-72", "IPIP-VIA", "IPIP-VIA-R", "CliftonStrengths", "Strengths Profile"],
};
