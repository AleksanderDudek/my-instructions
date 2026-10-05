/**
 * Provenance for interpersonal.
 *
 * See src/core/provenance.ts for what each field means. The items are the
 * public-domain IPIP-IPC; the evidence block names the one language the
 * published figures belong to.
 */
export default {
  construct: {
    name: "Interpersonal circumplex",
    origin: "Leary 1957; Wiggins 1979 (the circle of dominance and warmth); Markey and Markey 2009 (the IPIP-IPC, its public-domain short measure)",
    public: true,
    note: "The circle is public theory and the items are IPIP's, placed in the public domain for any purpose. Each octant has four items and the reliability of a four-item scale; the reading is the two axes and the profile, never eight precise scores.",
  },

  items: {
    origin: "public-domain",
    source:
      "IPIP-IPC, https://ipip.ori.org/newIPIP-IPCSurvey.htm (items) and https://ipip.ori.org/newIPIP-IPCScoringKey.htm (key). Polish: the UKSW adaptation (Strus, Cieciuch, Rowiński), questionnaire file published CC BY at www.ipip.edu.pl (http://www.ipip.uksw.edu.pl/test.php?id=39), matched to the English items octant by octant. Spanish and German: this app's own translations of the public-domain English. English items carry the first-person stem IPIP's instructions imply.",
    licence: "Public domain (IPIP: \"copy, edit, translate, or use them for any purpose\"); Polish adaptation CC BY (attribution: www.ipip.edu.pl)",
  },

  /**
   * Borrowed for the English items only. The Polish text is a published
   * adaptation with no psychometrics found; Spanish and German are this
   * app's translations. Nothing was collected here; no norms are used.
   */
  evidence: {
    reliability: "borrowed",
    factorStructure: "borrowed",
    criterion: "borrowed",
    appliesTo: ["en"],
    note: "Markey and Markey 2009: average four-item composite reliability .64 (range .51–.75) and .63 (.50–.77) in two samples (N = 501, 274); circular order confirmed by randomization tests (CI .92–.99); convergence with the 64-item IAS: warmth r = .82, dominance r = .75. Markey, Anderson and Markey 2013: observed behaviour in dyads followed IPIP-IPC scores (N = 96). Polish, Spanish, German: none.",
  },

  /** Copyrighted material reproduced here. Required to be empty: public-domain text is not. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["Interpersonal Adjective Scales (IAS; PAR)", "Inventory of Interpersonal Problems (IIP)", "DiSC", "Insights Discovery"],

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: PubMed PMID 19667139; https://doi.org/10.1177/1073191109340382
    { authors: "Markey, P. M., & Markey, C. N.", year: 2009, title: "A brief assessment of the interpersonal circumplex: The IPIP-IPC", source: "Assessment, 16(4), 352–361", url: "https://doi.org/10.1177/1073191109340382", kind: "foundational" },
    // checked: PubMed PMID 22333526; https://doi.org/10.1177/1073191112436669
    { authors: "Markey, P., Anderson, J. M., & Markey, C.", year: 2013, title: "Using behavioral mapping to examine the validity of the IPIP-IPC", source: "Assessment, 20(2), 165–174", url: "https://doi.org/10.1177/1073191112436669", kind: "review" },
    // checked: https://api.crossref.org/works/10.1037/0022-3514.37.3.395
    { authors: "Wiggins, J. S.", year: 1979, title: "A psychological taxonomy of trait-descriptive terms: The interpersonal domain", source: "Journal of Personality and Social Psychology, 37(3), 395–412", url: "https://doi.org/10.1037/0022-3514.37.3.395", kind: "foundational" },
    // checked: PubMed PMID 20718544; https://doi.org/10.1037/a0020385
    { authors: "Dyrenforth, P. S., Kashy, D. A., Donnellan, M. B., & Lucas, R. E.", year: 2010, title: "Predicting relationship and life satisfaction from personality in nationally representative samples from three countries: The relative importance of actor, partner, and similarity effects", source: "Journal of Personality and Social Psychology, 99(4), 690–702", url: "https://doi.org/10.1037/a0020385", kind: "critique" },
  ],
};
