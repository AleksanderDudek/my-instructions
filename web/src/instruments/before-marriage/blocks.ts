import type { StanceBlock } from "@/core/stance";

/**
 * Fifteen positions on the years after the wedding.
 *
 * ── What is borrowed, and what is emphatically not ────────────────────
 *
 * The framework is Gottman's and the framework is the public part. «The 5 Most
 * Important Talks to Have Before Marriage» is a freely readable article on The
 * Gottman Institute's blog, and its five headings — money; life plans;
 * communication styles and conflict; core values, beliefs and worldviews;
 * expectations, commitment and decision making — are a published list of topic
 * headings. A list of topics is not a measurement instrument, which is the
 * whole reason it may be taken as a starting point at all.
 *
 * Everything of theirs that *is* a measurement instrument is absent. The Sound
 * Relationship House questionnaires and the fourteen Gottman Card Decks carry
 * an explicit copyright in the names of John M. Gottman and Julie Schwartz
 * Gottman and are distributed under licence by The Gottman Institute, Inc. No
 * item, no card, no wording and no option set from any of them has been copied,
 * paraphrased closely, or reconstructed from memory or from a description of
 * one. The same refusal covers Eight Dates and the Love Maps set, and — because
 * they are the adjacent commercial products a premarital instrument drifts
 * towards — PREPARE/ENRICH, FOCCUS and RELATE. `provenance.ts` names all of
 * them.
 *
 * Every prompt and every option label below was written for this repo, and the
 * shapes were driven by this repo's own constraints rather than by anything of
 * theirs: 80 characters and 14 words per prompt, no double-barrelled question,
 * an honest escape in every option set. Those constraints produce choice and
 * multi blocks with option sets; the Gottman materials are agree/disagree
 * statement banks and partner-knowledge cards. The item shape is different
 * before the wording is.
 *
 * ── Why five sections are not five headings ───────────────────────────
 *
 * The design memo's table asks for one section per Gottman heading. That is not
 * what is here, and the reason is scope rather than preference. Money is
 * `money-management`'s entire subject; children and everything downstream are
 * `family-plan`'s; belief is `faith`'s; how you argue belongs to
 * `conflict-style`, `communication-style` and `attachment`; and whether the two
 * of you have raised any of it at all is `couple-conversations`'. Taking each
 * heading literally would have produced an instrument three-fifths of which
 * asks what this app answers better elsewhere.
 *
 * So headings 1, 3 and 4 are dropped whole, heading 5 is expanded into three
 * sections, and heading 2 is reduced to the two sub-topics — careers and
 * settling down — that nothing in the catalogue touches. The lineage is still
 * Gottman's, the coverage is deliberately partial, and the `sourceNote` tells
 * the reader so in the reader's own copy rather than leaving it to be noticed.
 *
 * ── The one question that is not asked ────────────────────────────────
 *
 * `grounds-to-end` does not offer violence, and the whole subject is out of the
 * instrument. Two independent failures killed it. In a max-of-two ranking, an
 * option no reasonable person rejects eats a slot from everybody and separates
 * nobody from anybody — the Barnum failure in its option-set form. And a reader
 * who spent both slots on an affair and a hidden debt would have produced a
 * stored, printable document recording that they do *not* count being hit as
 * grounds: a false answer collected on the one item in the bank where a false
 * answer does real harm. Asking it at all would breach the rule that this
 * instrument only asks what a person already knows, since what you would do the
 * first time is a forecast of your own behaviour in a crisis you have not had.
 * The section note and the `sourceNote` both say the question is absent and why.
 *
 * ── No grounds, anywhere ──────────────────────────────────────────────
 *
 * The fourth part of a stance block is reserved for `faith`, where every block
 * is about something held on an authority and the whole value is that the
 * grounds are comparable across all twelve. Here it would attach honestly to
 * three blocks at most — `marriage-means`, `final-say`, `grounds-to-end` — and
 * the cross-block pattern that justifies closed options rather than free text
 * would not exist across the other twelve. The free-text `why` carries the
 * reason for these fifteen, which is what it is for.
 *
 * Nothing is `private` and nothing is `skipWeight`. The weight is the whole
 * point of a block here: two people who both want four evenings and rate it 9
 * have found nothing to discuss, and two who differ at 9 and 2 have found which
 * of them has been conceding.
 *
 * The words are all in `i18n/`. Nothing below is reader-facing.
 */

/**
 * The five sections, in the order they are asked.
 *
 * Ids only: the title and the note under it are copy and live in `i18n/`. The
 * order is load-bearing twice over — it is the order the blocks are declared
 * in, and `spec.ts` sizes a page so that one section is one page.
 *
 * They are three blocks each, which is what makes that page size possible; the
 * arithmetic is spelled out where it is used rather than trusted here.
 */
export const SECTIONS = ["commitment", "time", "independence", "careers", "settling"] as const;
export type SectionId = (typeof SECTIONS)[number];

/**
 * The fifteen, declared in section order.
 *
 * Twelve are a `choice` and three are a `multi`, one closing each of the three
 * sections that has one. Each of the three caps its picks, and the cap is what
 * makes the block worth asking: an uncapped `grounds-to-end` would be ticked
 * five times by almost everybody and separate nobody from anybody, where a
 * max of two turns it into a ranking.
 *
 * All three declare an `exclusive` escape, which is what makes the escape
 * honest. A `choice` clears the others for free; a `multi` clears nothing, so
 * without it a reader can tick «None of these would» beside an affair and the
 * app stores, prints and hands back the contradiction as a position they took.
 * A label written to read as terminal is a mitigation; naming the value is the
 * fix. `max` has no authority over any of them — somebody who has spent both
 * picks and then realises none of them are true says so in one click.
 *
 * A `multi` also permits zero selections and the runner does not block on one,
 * so «I would rather not answer this one» stays available on all three without
 * an option that says so.
 */
export const BLOCKS: readonly StanceBlock[] = [
  { id: "marriage-means", kind: "choice", section: "commitment", options: ["permanence", "vow", "witnessed", "legal", "nothing", "unsure"] },
  {
    id: "grounds-to-end",
    kind: "multi",
    max: 2,
    exclusive: ["none"],
    section: "commitment",
    options: ["affair", "emotional", "money-lies", "addiction", "drift", "none"],
  },
  { id: "final-say", kind: "choice", section: "commitment", options: ["stall", "domain", "cares-more", "husband", "outsider", "unsure"] },

  { id: "evenings-together", kind: "choice", section: "time", options: ["nearly-all", "most", "some", "few", "never-counted"] },
  { id: "alone-time", kind: "choice", section: "time", options: ["snatched", "evening", "day", "more", "none"] },
  { id: "holiday-apart", kind: "choice", section: "time", options: ["yearly", "sometimes", "reason", "no", "unsure"] },

  { id: "who-knows", kind: "choice", section: "independence", options: ["nobody", "friend", "parent", "sibling", "clergy", "counsellor"] },
  { id: "closest-friend", kind: "choice", section: "independence", options: ["unchanged", "less-often", "becomes-ours", "fades", "unsure"] },
  {
    id: "kept-to-myself",
    kind: "multi",
    max: 3,
    exclusive: ["nothing"],
    section: "independence",
    options: ["space", "evening", "friend", "hobby", "quiet", "nothing"],
  },

  { id: "career-lead", kind: "choice", section: "careers", options: ["mine", "spouse", "earner", "loses-more", "alternate", "unsure"] },
  { id: "relocation", kind: "choice", section: "careers", options: ["yes", "fixed-term", "near-only", "no", "unsure"] },
  { id: "nights-away", kind: "choice", section: "careers", options: ["none", "up-to-three", "up-to-week", "more", "unsure"] },

  { id: "place-type", kind: "choice", section: "settling", options: ["city", "town", "country", "indifferent", "no-idea"] },
  { id: "parents-distance", kind: "choice", section: "settling", options: ["same-town", "hour", "hours", "flight", "no-preference", "na"] },
  {
    id: "household-who",
    kind: "multi",
    max: 3,
    exclusive: ["nobody"],
    section: "settling",
    options: ["my-parent", "their-parent", "sibling", "friend", "lodger", "nobody"],
  },
];

/**
 * One suggested line, and the answer it is derived from.
 *
 * `from` is `block = value | value`, parsed once in `spec.ts` and never read as
 * a string anywhere else.
 *
 * Unlike the pilot's, these are **not** copied verbatim from the bank. This
 * bank writes its derivations in reader-facing labels — «alone-time = most of a
 * day / more than a day», «kept-to-myself includes a room or a desk of my own»
 * — which name the option a person sees rather than the value the option has.
 * Labels are translated and values are not, so a `from` written in labels
 * cannot be parsed against a declaration and cannot survive a locale. Each one
 * below is therefore the bank's clause transposed to values, one to one, in the
 * bank's order: fourteen lines on each side, exactly as the bank has them. The
 * parser in `spec.ts` is what checks the transposition — every id and every
 * value is looked up against `BLOCKS` at module load, so a mistranscribed
 * option throws rather than quietly firing nothing.
 *
 * The text is in `i18n/` under `playbook.<id>`. The id is what the reader's
 * ticks are stored against, so it is the bank's id unchanged, hyphens and all:
 * renaming one silently unticks a sentence somebody had endorsed.
 */
export type Derivation = { id: string; from: string };

/**
 * Fourteen OK lines and fourteen not-OK ones, which is not what one reader
 * sees.
 *
 * The design's target of eight to fourteen a side is a target for the page, not
 * a cap on the bank, because the same design requires the lines to be derived
 * from the result. No block fires more than one line per side except
 * `kept-to-myself`, whose two OK lines come from two different things a reader
 * may have ticked on one `multi`, so a reader who answers all fifteen
 * substantively sees at most ten and eleven.
 *
 * Coverage is deliberately partial and the gaps are the point. Every honest
 * escape fires nothing, because there is no sentence anybody could be held to
 * behind «I have not worked that out». Neither does `final-say = husband`, and
 * that one is not an escape: the option is there because a headship view is a
 * real position really held, and an option set that omits it collects a false
 * answer from the people who hold it. What it cannot do is produce a playbook
 * line, because the only handable sentence it yields is a rule for somebody
 * else's behaviour — and every line on this sheet is a first-person claim.
 */
export const PLAYBOOK_OK: readonly Derivation[] = [
  { id: "ok-first-hour", from: "alone-time = day | more" },
  { id: "ok-book-tuesday", from: "evenings-together = some | few" },
  { id: "ok-week-away", from: "holiday-apart = yearly" },
  { id: "ok-one-friend-knows", from: "who-knows = friend" },
  { id: "ok-friend-stays", from: "closest-friend = unchanged" },
  { id: "ok-my-desk", from: "kept-to-myself = space" },
  { id: "ok-quiet-hours", from: "kept-to-myself = quiet" },
  { id: "ok-abroad-with-date", from: "relocation = fixed-term" },
  { id: "ok-send-the-listing", from: "relocation = yes" },
  { id: "ok-take-the-trip", from: "nights-away = up-to-week | more" },
  { id: "ok-your-turn", from: "career-lead = alternate" },
  { id: "ok-sunday-lunch", from: "parents-distance = same-town | hour" },
  { id: "ok-ask-about-parent", from: "household-who = my-parent" },
  { id: "ok-bring-someone-in", from: "final-say = outsider" },
];

export const PLAYBOOK_NOT_OK: readonly Derivation[] = [
  { id: "no-card-then-tell", from: "grounds-to-end = money-lies" },
  { id: "no-follow-me", from: "alone-time = day | more" },
  { id: "no-fill-my-week", from: "evenings-together = nearly-all" },
  { id: "no-week-away", from: "holiday-apart = no" },
  { id: "no-tell-your-mother", from: "who-knows = nobody" },
  { id: "no-secret-friendship", from: "kept-to-myself = nothing" },
  { id: "no-decide-then-inform", from: "final-say = stall" },
  { id: "no-divorce-word", from: "marriage-means = permanence" },
  { id: "no-move-for-your-job", from: "career-lead = mine" },
  { id: "no-apply-abroad", from: "relocation = no" },
  { id: "no-overnight-work", from: "nights-away = none" },
  { id: "no-move-us-to-a-field", from: "place-type = city" },
  { id: "no-near-parents", from: "parents-distance = flight" },
  { id: "no-spare-room", from: "household-who = nobody" },
];
