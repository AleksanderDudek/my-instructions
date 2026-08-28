/**
 * Provenance for good-life.
 *
 * Transcribed from `docs/banks/good-life.json`, where the argument was made and
 * critiqued. Three things in it are worth pointing at from here.
 *
 * The first is that a whole literature was read and none of it was used. The
 * wellbeing questionnaires named below were opened to answer one question —
 * which domains of a life do these twelve blocks leave out — and closed again.
 * That is a legitimate use of a copyrighted instrument and it is also the only
 * one taken here: no item, option, anchor, wording or dimension came out of any
 * of them. Two of them could not have been used in any case. Ryff's scales
 * carry no public terms of use and the page hosting them directs anyone wanting
 * to use them to write to the author; the PERMA-Profiler's items belong to
 * Butler and Kern.
 *
 * The second is that three debts are recorded which the first draft did not
 * record. A construct that is public — the job / career / calling trichotomy —
 * still has a copyrighted questionnaire behind it, and the fact that this bank
 * used the first and not the second is exactly the kind of thing that reads as
 * concealment if it is discovered rather than declared. The same goes for an
 * option set that reproduced the *shape* of a copyrighted list while using
 * none of its words, and for a closing question that was close to a famous
 * visualisation exercise. All three were rewritten and all three are named.
 *
 * The third is that the evidence block is empty and says so at length. Nothing
 * here is measured, so there is nothing to validate — the answers are the
 * result. That is `working-style`'s precedent applied to a subject that invites
 * a number more strongly than anything else in the catalogue.
 */
export default {
  construct: {
    name: "A stated account of a good life",
    origin:
      "No published instrument. The wellbeing literature was read as a coverage checklist and nothing else.",
    public: true,
    note: "Hedonic and eudaimonic accounts of wellbeing, Ryff's six dimensions, self-determination theory's autonomy, competence and relatedness, Seligman's PERMA, and the OECD's eleven Better Life domains are public frameworks. They were used to answer one question — which domains of a life do these twelve blocks leave out — and to nothing else. No item, option, anchor, wording or dimension was taken from any of them. Ryff's Scales of Psychological Well-Being carry no public terms of use and the University of Pennsylvania page hosting them directs anyone wanting to use them to write to the author, so they are not reproduced, paraphrased, or reconstructed here; the same applies to the PERMA-Profiler, whose items belong to Butler and Kern. Three further debts are recorded because the first draft did not record them and they are the kind of thing that looks like concealment later. First, `work-purpose` sits on the job / career / calling trichotomy, which is public and predates its measurement; Wrzesniewski's Work-Life Questionnaire operationalises it in three paragraph-length vignettes, none of which is used, paraphrased or reconstructed here, and this block has six short options on a different question. Second, `regret-most` was rewritten because three of its six original options — saying the thing never said, mending a relationship, being present instead of working — reproduced the shape of Bronnie Ware's five regrets of the dying, which is a copyrighted book's framing rather than a public construct. The wording was original, the set was not; it now overlaps at one option instead of three and carries an escape. Third, the closing eulogy question was reworded away from 'what would you want said at your funeral', which is close to Covey's Habit 2 visualisation, to a question about what the people who know you best would say.",
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
    note: "None, and none is required. Nothing here is measured, so there is nothing to validate — the answers are the result. Reliability, factor structure and criterion validity are properties of a specific item set administered to a specific sample; this bank has never been administered to one, has no norms, and produces no number about anybody. A stated position cannot be wrong about the person stating it, which is the whole of the epistemic claim being made. One finding is cited in the sourceNote and it is cited for the *direction* of a question rather than as a fact about the reader: regrets of inaction are reported to outlast regrets of action over a lifetime (Gilovich and Medvec, 1994), which has been replicated since with weaker effects and not in every study — Yeung and Feldman, 2022, N=988, found support in three of their studies and none in a fourth. That is why `regret-most` asks what you would regret not doing, and why the copy hedges rather than asserts.",
  },

  /** Copyrighted material reproduced here. Required to be empty. */
  reproduces: [],

  /**
   * Named instruments deliberately not used, and whose items are not present.
   *
   * The last three are a different entry from the first twelve. They are not
   * wellbeing scales that were passed over; they are the three specific pieces
   * of writing this bank came closest to without citing, and each is named
   * beside what was done about it — the vignettes that were not used, the
   * five-item list the option set was rewritten away from, and the
   * visualisation the closing question was reworded away from.
   */
  avoided: [
    "Ryff Scales of Psychological Well-Being",
    "PERMA-Profiler (Butler & Kern)",
    "Satisfaction With Life Scale (Diener)",
    "Flourishing Scale (Diener)",
    "Cantril Self-Anchoring Striving Scale",
    "Personal Wellbeing Index",
    "Warwick–Edinburgh Mental Wellbeing Scale",
    "WHO-5 Wellbeing Index",
    "Meaning in Life Questionnaire (Steger)",
    "Basic Psychological Need Satisfaction scales (SDT)",
    "VIA Inventory of Strengths",
    "Regret Elements Scale",
    "Work-Life Questionnaire (Wrzesniewski) — the job/career/calling vignettes",
    "The Top Five Regrets of the Dying (Ware) — the five-regret list as a set",
    "Begin with the End in Mind — the funeral visualisation (Covey)",
  ],
};
