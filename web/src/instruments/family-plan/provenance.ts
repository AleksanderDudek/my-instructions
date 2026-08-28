/**
 * Provenance for family-plan.
 *
 * Transcribed from `docs/banks/family-plan.json`, where the argument was made
 * and critiqued. Two things about it are worth pointing at from here.
 *
 * The first is what was and was not taken. A *topic list* came from public
 * demographic survey instruments — the US National Survey of Family Growth,
 * whose questionnaires are a federal work product, and the openly published
 * Generations and Gender Survey. Not one item did. Every prompt and every
 * option label on this page was written for this repo, and the facilitator-
 * gated marriage inventories that cover the same ground are named in `avoided`
 * rather than in any source list because nothing here came from them. The
 * distinction is the whole licence: a subject cannot be owned and a question
 * can.
 *
 * The second is that the evidence block is empty and says so at length, and on
 * this instrument that needs saying twice. Nothing is inferred — the reader
 * states a position, weights it, and gives their reason — so there is nothing
 * to validate. But there is also a live temptation here that the other seven
 * inventories do not face, which is to read thirteen answers as a forecast of a
 * family. They are not one, and the literature says so: stated intentions
 * predict achieved family size poorly, with people more likely to miss their
 * number than hit it.
 *
 * The bank's `sources` are named in the prose below rather than carried as a
 * field, because `ProvenanceRecord` has none and inventing one here would put
 * a shape in front of the reader that no other instrument has. In full, they
 * are: the NSFG questionnaires (cdc.gov/nchs/nsfg), the GGS questionnaire
 * (ggp-i.org), Quesnel-Vallée and Morgan 2003 on intentions versus achieved
 * family size, Testa and Bolano 2021 on how couple disagreement resolves,
 * Gershoff and Grogan-Kaylor 2016 on physical punishment, WHO's 2023 review of
 * infertility prevalence, and the 2023 European Journal of Ageing paper on the
 * range of grandparental childcare across Europe.
 */
export default {
  construct: {
    name: "Stated positions on family formation and raising children",
    origin:
      "No published psychological instrument. The topic list follows demographic fertility-intention surveys — the US National Survey of Family Growth, whose questionnaires are a federal work product, and the openly published Generations and Gender Survey — plus the standard domains of marriage-preparation curricula.",
    public: true,
    note: "Nothing here is a construct and nothing is being measured. What is recorded is a position on a decision the person will have to make anyway, the weight they put on it, and their own reason for it. The construct is deliberately not called «intentions»: an intention is a forecast, and this family of instruments forecasts nothing. A topic list was taken from public survey instruments; not one item was. Every prompt and every option label on this page was written for this repo.",
  },

  items: {
    origin: "original",
    writtenFor: "my-instructions",
  },

  /* Nothing was borrowed, so nothing was inherited — including the evidence. */
  evidence: {
    reliability: "none",
    factorStructure: "none",
    criterion: "none",
    note: "None, and none is needed: nothing is inferred here, so there is nothing to validate. Reliability, factor structure and criterion validity are properties of a measurement given to a population, and this instrument does not measure — the answers are the result. Three things about the domain are worth knowing, and none of them is a property of these items. Stated intentions about children predict achieved family size poorly, with people more likely to miss their number than hit it (Quesnel-Vallée and Morgan 2003). Infertility is not an edge case: WHO's 2023 review put lifetime prevalence at roughly one adult in six, which is why the block on what happens if conceiving does not work is in the bank rather than in a footnote. And grandparental childcare, which the childcare block may name as the arrangement the week rests on, ranges from about 24% to about 60% of grandparents across European countries in SHARE data (European Journal of Ageing, 2023), so there is no safe default to assume for the reader.",
  },

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /**
   * Named products deliberately not used, and whose items are not present.
   *
   * The first five are facilitator-gated marriage and parenting inventories
   * covering this exact ground, and none of them is reproduced, adapted or
   * paraphrased. The last one is a quality-of-life measure for people in
   * fertility treatment: it is a scored instrument about distress, which is a
   * different thing from a stated position and is the thing `if-not-natural`
   * must not become.
   */
  avoided: [
    "PREPARE/ENRICH",
    "FOCCUS Pre-Marriage Inventory",
    "RELATE and the Couple CHECKUP",
    "The Gottman Institute's relationship assessments",
    "Parenting Alliance Measure (PAR Inc.)",
    "Parenting Styles and Dimensions Questionnaire",
    "Alabama Parenting Questionnaire",
    "FertiQoL",
  ],
};
