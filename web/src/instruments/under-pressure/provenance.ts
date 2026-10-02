/**
 * Provenance for under-pressure.
 *
 * See src/core/provenance.ts for what each field means and why the evidence
 * block is allowed to be embarrassing. The licence research behind the
 * `avoided` list is reports/Six test sources and licences.md.
 */
export default {
  construct: {
    name: "Hardiness; the 4C model of mental toughness",
    origin: "Kobasa 1979 (commitment, control, challenge); Clough, Earle and Sewell 2002 (adds confidence)",
    public: true,
    note: "The construct is published and widely used. Its four-way split is contested: independent confirmatory studies (Gucciardi, Hanton and Mallett 2012; Vaughan et al. 2018; Kawabata et al. 2021) do not reproduce the four or six factors cleanly. Public-domain IPIP scales for self-efficacy, vulnerability, assertiveness and industry could be substituted as data; they are not, because a borrowed bank would make app.noValidation false for this instrument and the web/ provenance contract does not yet check borrowed items.",
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
    note: "This bank has never been administered to a sample and has no norms. MTQ48's published reliability belongs to AQR's items and AQR's norm group, not to the construct's name.",
  },

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: https://api.crossref.org/works/10.1037/0022-3514.37.1.1; PubMed PMID 458548
    { authors: "Kobasa, S. C.", year: 1979, title: "Stressful life events, personality, and health: An inquiry into hardiness", source: "Journal of Personality and Social Psychology, 37(1), 1–11", url: "https://doi.org/10.1037/0022-3514.37.1.1", kind: "foundational" },
    // checked: Book: Open Library record https://openlibrary.org/works/OL8867288W (Cockerill, Solutions in Sport Psychology, Thomson Learning, London, 2002, ISBN 186152773X). Chapter title and pp. 32–43: reference list of 'Dimensionality of the Mental Toughness Questionnaire (MTQ48)' (PMC8342756, via Europe PMC full text); first page 32 also in the Crossref reference list of Kawabata et al. 2021 (doi 10.1002/smi.3004). No publisher record of the chapter itself was reachable
    { authors: "Clough, P., Earle, K., & Sewell, D.", year: 2002, title: "Mental toughness: The concept and its measurement", source: "In I. Cockerill (Ed.), Solutions in sport psychology (pp. 32–43). London: Thomson Learning", url: "https://openlibrary.org/works/OL8867288W", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1037/a0027190; abstract via OpenAlex ('the hypothesized correlated four factor model did not fit the data well')
    { authors: "Gucciardi, D. F., Hanton, S., & Mallett, C. J.", year: 2012, title: "Progressing measurement in mental toughness: A case example of the Mental Toughness Questionnaire 48", source: "Sport, Exercise, and Performance Psychology, 1(3), 194–214", url: "https://doi.org/10.1037/a0027190", kind: "critique" },
    // checked: PubMed PMID 33145967; https://api.crossref.org/works/10.1002/smi.3004 (abstract: 'none of one-, four- and six-factor models with 48 items satisfactorily fit')
    { authors: "Kawabata, M., Pavey, T. G., & Coulter, T. J.", year: 2021, title: "Evolving the validity of a mental toughness measure: Refined versions of the Mental Toughness Questionnaire-48", source: "Stress and Health, 37(2), 378–391", url: "https://doi.org/10.1002/smi.3004", kind: "critique" },
  ],

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["MTQ48", "MTQPlus", "MTQ18", "MTQ-10", "SMTQ", "MTS", "MTI", "CD-RISC", "Grit Scale", "Brief Resilience Scale"],
};
