/**
 * Provenance for character-strengths.
 *
 * See src/core/provenance.ts for what each field means. The items are the
 * public-domain IPIP-VIA-R; the evidence block names the two languages the
 * published figures belong to.
 */
export default {
  construct: {
    name: "Character strengths and virtues",
    origin: "Peterson and Seligman 2004, Character Strengths and Virtues: A Handbook and Classification",
    public: true,
    note: "The twenty-four strengths and six virtues are a published classification; the names are ordinary words. The items are the IPIP-VIA-R, which the International Personality Item Pool places in the public domain for any purpose; the VIA Institute's own inventories and name are not used, and whether IPIP's grant would hold against a VIA challenge is untested. The three core strengths are a published second reading of eighteen of the same items.",
  },

  items: {
    origin: "public-domain",
    source:
      "IPIP-VIA-R, 96 items, https://ipip.ori.org/IPIP-VIA-R_Key.html (English, scoring key); positions and German items from Table 7 of Bluemke, Partsch, Saucier and Lechner (2021, rev. 2023), PsyArXiv, CC BY 4.0, https://doi.org/10.31234/osf.io/k79qf. Core strengths: https://ipip.ori.org/IPIP-VIA-R-core-strengths_Key.html. Polish and Spanish: this app's own translations of the public-domain English. English items carry the first-person stem IPIP's instructions imply.",
    licence: "Public domain (IPIP: \"copy, edit, translate, or use them for any purpose\"); German items from a CC BY 4.0 preprint",
  },

  /**
   * Borrowed for English and German, the two languages the authors measured
   * in. Polish and Spanish are this app's translations with no evidence.
   * Nothing was collected here; no norms are used.
   */
  evidence: {
    reliability: "borrowed",
    factorStructure: "borrowed",
    criterion: "none",
    appliesTo: ["en", "de"],
    note: "Bluemke et al. 2021/2023 (quota samples, Germany n = 476, UK n = 474): McDonald's omega per strength .57–.83 (DE) and .63–.84 (UK); 2–3-week retest .58–.84 (DE) and .53–.77 (UK). Partsch, Olaru and Lechner 2024 (six samples, N = 2,754): core strengths omega .63–.81, retest .68–.80, scalar invariance across DE and UK. The published figures belong to the 5-point accuracy format, which is why this instrument uses it. A four-item scale is short; the page says so.",
  },

  /** Copyrighted material reproduced here. Required to be empty: public-domain text is not. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["VIA-IS", "VIA-IS-R", "VIA-120", "VIA-72", "CliftonStrengths", "Strengths Profile"],

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: Library of Congress / Oxford University Press record
    { authors: "Peterson, C., & Seligman, M. E. P.", year: 2004, title: "Character strengths and virtues: A handbook and classification", source: "Oxford University Press; American Psychological Association", url: "https://lccn.loc.gov/2003024320", kind: "foundational" },
    // checked: OSF preprint record (CC BY 4.0), https://doi.org/10.31234/osf.io/k79qf
    { authors: "Bluemke, M., Partsch, M. V., Saucier, G., & Lechner, C. M.", year: 2023, title: "Human character in the IPIP: Towards shorter, more content-valid, and cross-culturally comparable IPIP-VIA character strength scales", source: "PsyArXiv preprint, revised 2023", url: "https://doi.org/10.31234/osf.io/k79qf", kind: "foundational" },
    // checked: PubMed PMID 38407165; https://doi.org/10.1080/00223891.2024.2309994
    { authors: "Partsch, M. V., Olaru, G., & Lechner, C. M.", year: 2024, title: "Measuring global character dimensions: An ant colony optimization approach toward three core strength scales", source: "Journal of Personality Assessment", url: "https://doi.org/10.1080/00223891.2024.2309994", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1177/08902070211017760
    { authors: "Partsch, M. V., Bluemke, M., & Lechner, C. M.", year: 2022, title: "Revisiting the hierarchical structure of the 24 VIA character strengths: Three global dimensions may suffice to capture their essence", source: "European Journal of Personality, 36(5), 825–845", url: "https://doi.org/10.1177/08902070211017760", kind: "review" },
    // checked: https://api.crossref.org/works/10.1080/17439760.2014.994222 (Crossref; the record the earlier verification named)
    { authors: "McGrath, R. E.", year: 2015, title: "Integrating psychological and cultural perspectives on virtue: The hierarchical structure of character strengths", source: "The Journal of Positive Psychology, 10(5), 407–424", url: "https://doi.org/10.1080/17439760.2014.994222", kind: "critique" },
  ],
};
