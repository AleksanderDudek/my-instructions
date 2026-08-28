/**
 * Provenance for before-marriage.
 *
 * Transcribed from `docs/banks/before-marriage.json`, where the argument was
 * made and critiqued. Two things in it are unusual enough to point at from
 * here.
 *
 * The first is the licence position, and it is the whole reason this record
 * exists. A published list of five topic headings is the framework, and the
 * framework is the public part. The Gottman Method's own measurement materials
 * are not: the Sound Relationship House questionnaires and the Gottman Card
 * Decks carry an explicit copyright in the names of John M. Gottman and Julie
 * Schwartz Gottman and are distributed under licence by The Gottman Institute,
 * Inc. None of them has been reproduced, paraphrased closely or reconstructed
 * from memory or from a description — `reproduces` is empty and has to stay
 * empty.
 *
 * The second is that the evidence block is empty and says so at length, and the
 * surrounding literature it declines to borrow from is mostly negative. The two
 * largest randomised trials of relationship education found no effect on
 * whether couples stayed together. That is in the reader's own `sourceNote`
 * rather than buried here, because a reader deciding whether to spend eleven
 * minutes on this deserves it before they start.
 */
export default {
  construct: {
    name: "Gottman's five talks before marriage (public headings only), narrowed to the two headings this app does not already cover",
    origin:
      "The Gottman Institute blog, «The 5 Most Important Talks to Have Before Marriage» — a freely readable article whose five headings are: Money; Life Plans; Communication Styles and Conflict; Core Values, Beliefs, and Worldviews; Expectations, Commitment and Decision Making.",
    public: true,
    note: "A published list of topic headings is the framework, and the framework is the public part. The Gottman Method's own measurement materials are not: the Sound Relationship House questionnaires and the Gottman Card Decks carry an explicit copyright in the names of John M. Gottman and Julie Schwartz Gottman and are distributed under licence by The Gottman Institute, Inc. No item, no card, no wording and no option set from any of them has been copied, paraphrased closely, or reconstructed from memory or description. Every prompt and every option label is original to this repo, and the item shapes were driven by this repo's own constraints (80 characters, 14 words, no double-barrelled prompts, an honest escape in every option set) rather than by anything of theirs. On scope: the design memo's table asks for one section per Gottman heading. That is not what is delivered, and the reason is the scope problem rather than a preference. Money is money-management's whole subject; children and their downstream are family-plan's; belief is faith's; how you argue is conflict-style's, communication-style's and attachment's; and whether you have raised any of it is couple-conversations'. Taking each heading literally would have produced an instrument three-fifths of which asks questions this app answers better elsewhere. So headings 1, 3 and 4 are dropped entirely, heading 5 is expanded into three sections (commitment, time, independence), and heading 2 is reduced to the two sub-topics — careers and settling down — that nothing in the catalogue touches. The lineage is still Gottman's; the coverage is deliberately partial and the sourceNote says so to the reader. On grounds: this instrument does not declare grounds, and should not. The fourth part is reserved for faith, where every block is about something held on an authority and the whole value is that grounds are comparable across all twelve. Here it would attach honestly to three blocks at most — marriage-means, final-say, grounds-to-end — and the cross-block pattern that justifies closed options rather than free text would not exist across the other twelve. Four decisions are worth defending individually. First, `final-say` includes «The husband» because a headship view is a real stated position held by real people who will take this, and an option set that omits it collects a false answer from them; the other five options carry no such premise, so the block insults nobody either way. It is also the one answer the playbook deliberately generates no line from, because the only handable sentence it yields is a rule for somebody else's behaviour, and every line on this sheet is a first-person claim. Second, `grounds-to-end` is capped at two rather than left open, because an uncapped list of six would be ticked five times by almost everybody and produce nothing — the cap is what turns it into a ranking. A multi permits zero selections and the runner does not block on it, so «I would rather not answer this one» remains available without an option that says so. Third, and consequent on that cap: no option in `grounds-to-end` is a harm. An earlier draft listed «being hit» alongside an affair and a hidden debt, and it was cut on two counts. In a max-of-two ranking an option almost nobody would reject eats a slot from everybody and separates nobody from anybody, which is the Barnum failure in its option-set form. Worse, a reader who spent both slots elsewhere would have produced a stored, printable document recording that they do not count being hit as grounds — a false answer collected on the one item in the bank where a false answer does real harm. The whole subject is now out of the instrument and the sourceNote tells the reader so rather than leaving its absence to be noticed. Fourth, `who-knows` asks who has already heard the honest version of a bad month rather than who you would tell if the marriage were in trouble. Those look like one question and are not: the second is a forecast of your own behaviour under stress, which this app's rules forbid, where the first is a fact the reader already holds and surfaces the same six people.",
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
    note: "None, and none is needed. This is a stated-preference inventory: it has no reliability coefficient, no factor structure, no norms and no criterion validity, because it estimates nothing and there is nothing for those statistics to be about. A person answering «two or three evenings» is not being measured against a population; they are stating a number they already knew. The only claim being made is that they said it, that they weighted it, and that they gave a reason — and all three of those are facts about an event rather than inferences about a mind. What can honestly be said about the surrounding evidence is thin and mostly negative, and it is in the sourceNote rather than buried here: Building Strong Families (n > 4,700 couples, eight sites, random assignment) found no overall effect on relationship quality or on whether couples stayed together; Supporting Healthy Marriage found small effects on relationship quality and none on staying together; Fawcett et al. (2010) find that premarital education's effect on relationship quality does not survive the inclusion of unpublished studies, though the effect on observed communication skill holds up better. One further line of work is sometimes reached for in support of a careers section — Sandow's Swedish register study of long-distance commuters and separation risk. It is not cited here as support, and no wording anywhere leans on it. It is observational and cannot separate the commuting from the circumstances that produce it; its exposure is a daily commute rather than the nights away this instrument asks about; and the percentage usually quoted from it travels through a university press release rather than the paper, which is why no figure from it appears anywhere in this instrument's copy. It is listed in the sources so a reader can go and judge it. No study anywhere has tested whether writing your position down in this format helps. It probably has not been tried. Say that, rather than borrowing credibility from the trials above, which mostly failed.",
  },

  /**
   * Copyrighted material reproduced here. Required to be empty, and this is the
   * instrument where that requirement does the most work: everything the
   * Gottmans sell on this subject is a questionnaire or a card deck, and the
   * only thing taken from them is a list of five topic headings from a blog
   * post.
   */
  reproduces: [],

  /** Named products deliberately not used, and whose items are not present. */
  avoided: [
    "The Gottman Institute's Sound Relationship House questionnaires (copyrighted, distributed under licence)",
    "Gottman Card Decks — all fourteen decks and the app that carries them (commercial product)",
    "Eight Dates (Gottman & Gottman) and its question sets",
    "The Love Maps question set (copyrighted, distributed under licence)",
    "PREPARE/ENRICH — sold per couple and gated behind paid facilitator certification",
    "FOCCUS — sold per couple through FOCCUS Inc., facilitator training required",
    "RELATE (RELATE Institute) — a paid premarital assessment; not consulted, and no item from it was wanted",
    "Thomas–Kilmann Conflict Mode Instrument (commercially licensed; the conflict heading is cut here anyway)",
  ],
};
