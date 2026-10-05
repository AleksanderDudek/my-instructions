/**
 * Provenance for big-five.
 *
 * Checked by test/instruments/provenance.test.ts. See src/core/provenance.ts
 * for what each field means. This is the first instrument whose items are
 * not the app's own: they are public-domain, and the evidence block names
 * the languages the published figures belong to.
 */
export default {
  construct: {
    name: "Five-factor model",
    origin: "Tupes and Christal 1961; Costa and McCrae",
    public: true,
    note: "The factor structure is public and heavily replicated. The items are Goldberg's IPIP 50-item Big-Five Factor Markers, which IPIP places in the public domain for any purpose. IPIP's factor IV is Emotional Stability and factor V is Intellect/Imagination; the app reports reactivity (the key flipped) and keeps the name openness.",
  },

  items: {
    origin: "public-domain",
    source:
      "IPIP 50-item Big-Five Factor Markers, https://ipip.ori.org/newBigFive5broadKey.htm (English, scoring key). Polish: IPIP-BFM-50, Strus, Cieciuch and Rowiński 2014, questionnaire file published CC BY at www.ipip.edu.pl (http://www.ipip.uksw.edu.pl/test.php?id=32). German: Bielefeld translation (Angleitner, Hempel, Langert, Spinath) hosted by IPIP, https://ipip.ori.org/German50-itemBigFiveFactorMarkers.htm. Spanish: de Oliveira translation hosted by IPIP, https://ipip.ori.org/SpanishBig-FiveFactorMarkers.htm. English items carry the first-person stem IPIP's instructions imply; German items the 'Ich' the translators left implicit.",
    licence: "Public domain (IPIP: \"copy, edit, translate, or use them for any purpose\"); Polish adaptation CC BY (attribution: www.ipip.edu.pl)",
  },

  /**
   * Borrowed, and borrowed only where it was measured: on the English items
   * (Goldberg) and on the Polish adaptation (N = 7,015). The German and
   * Spanish texts are hosted translations IPIP has not verified; one
   * published test of a Spanish 50-item version (Peru, 2020) failed a clean
   * five-factor fit. Nothing was collected in this app, and no norms are used.
   */
  evidence: {
    reliability: "borrowed",
    factorStructure: "borrowed",
    criterion: "none",
    appliesTo: ["en", "pl"],
    note: "English: α E .87, A .82, C .79, ES .86, I .84 (IPIP, newBigFive5broadTable.htm). Polish: α E .87, A .81, C .80, ES .88, I .77, eight studies, N = 7,015 (Strus, Cieciuch and Rowiński 2014). The published alphas belong to the 5-point accuracy format, which is why this instrument uses it. German: no validation found. Spanish: Hughes et al. 2020 report the a-priori five-factor model failed to fit in 778 Peruvian adults.",
  },

  /** Copyrighted material reproduced here. Required to be empty: public-domain text is not. */
  reproduces: [],

  /** Named instruments deliberately not used, and whose items are not present. */
  avoided: ["NEO-PI-R", "BFI-2 (personal and research use only)", "BFI-10 (non-commercial only)", "TIPI (double-barrelled pairs)"],

  /** Further reading. Each entry was checked against the record named above it. */
  references: [
    // checked: https://api.crossref.org/works/10.1037/1040-3590.4.1.26
    { authors: "Goldberg, L. R.", year: 1992, title: "The development of markers for the Big-Five factor structure", source: "Psychological Assessment, 4(1), 26–42", url: "https://doi.org/10.1037/1040-3590.4.1.26", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1016/j.jrp.2005.08.007
    { authors: "Goldberg, L. R., Johnson, J. A., Eber, H. W., Hogan, R., Ashton, M. C., Cloninger, C. R., & Gough, H. G.", year: 2006, title: "The International Personality Item Pool and the future of public-domain personality measures", source: "Journal of Research in Personality, 40(1), 84–96", url: "https://doi.org/10.1016/j.jrp.2005.08.007", kind: "foundational" },
    // checked: https://ojs.tnkul.pl/index.php/rpsych/article/view/512 (journal page) and http://www.ipip.uksw.edu.pl/test.php?id=32
    { authors: "Strus, W., Cieciuch, J., & Rowiński, T.", year: 2014, title: "Polska adaptacja kwestionariusza IPIP-BFM-50 do pomiaru pięciu cech osobowości w ujęciu leksykalnym", source: "Roczniki Psychologiczne, 17(2), 327–346", url: "https://ojs.tnkul.pl/index.php/rpsych/article/view/512", kind: "foundational", lang: "pl" },
    // checked: PubMed PMID 32618534; https://doi.org/10.1017/SJP.2020.11
    { authors: "Hughes, D. J., de Olazabal, V., Kratsiotis, I. K., Twumasi, R., & Booth, T.", year: 2020, title: "Psychometric properties of the Spanish translation of the IPIP-50 in a sample of non-university-educated Peruvians", source: "The Spanish Journal of Psychology, 23, e18", url: "https://doi.org/10.1017/SJP.2020.11", kind: "critique" },
    // checked: https://api.crossref.org/works/10.1037/0022-3514.52.1.81; PubMed PMID 3820081
    { authors: "McCrae, R. R., & Costa, P. T., Jr.", year: 1987, title: "Validation of the five-factor model of personality across instruments and observers", source: "Journal of Personality and Social Psychology, 52(1), 81–90", url: "https://doi.org/10.1037/0022-3514.52.1.81", kind: "foundational" },
    // checked: https://api.crossref.org/works/10.1037/0033-2909.117.2.187
    { authors: "Block, J.", year: 1995, title: "A contrarian view of the five-factor approach to personality description", source: "Psychological Bulletin, 117(2), 187–215", url: "https://doi.org/10.1037/0033-2909.117.2.187", kind: "critique" },
  ],
};
