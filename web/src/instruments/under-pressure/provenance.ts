/**
 * Provenance for under-pressure.
 *
 * See src/core/provenance.js for what each field means and why the evidence
 * block is allowed to be embarrassing. The licence research behind the
 * `avoided` list is reports/Six test sources and licences.md.
 */
export default {
  construct: {
    name: "Hardiness; the 4C model of mental toughness",
    origin: "Kobasa 1979 (commitment, control, challenge); Clough, Earle and Sewell 2002 (adds confidence)",
    public: true,
    note: "The construct is published and widely used. Its four-way split is contested: independent confirmatory studies (Gucciardi, Hanton and Mallett 2012; Vaughan et al. 2017; Kawabata et al. 2021) do not reproduce the four or six factors cleanly. Public-domain IPIP scales for self-efficacy, vulnerability, assertiveness and industry could be substituted as data; they are not, because a borrowed bank would make app.noValidation false for this instrument and the web/ provenance contract does not yet check borrowed items.",
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

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["MTQ48", "MTQPlus", "MTQ18", "MTQ-10", "SMTQ", "MTS", "MTI", "CD-RISC", "Grit Scale", "Brief Resilience Scale"],
};
