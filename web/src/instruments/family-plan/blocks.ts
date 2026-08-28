import type { StanceBlock } from "@/core/stance";

/**
 * Thirteen decisions about children, and not one prediction.
 *
 * There is no instrument behind this bank and there does not need to be. The
 * topic list is the one demographic surveys have used for decades — the US
 * National Survey of Family Growth, whose questionnaires are a federal work
 * product, and the openly published Generations and Gender Survey — and the
 * topic list is *all* that was taken. Every prompt and every option label below
 * was written for this repo. The facilitator-gated marriage inventories that
 * cover the same ground (PREPARE/ENRICH, FOCCUS, RELATE) are neither reproduced
 * nor paraphrased, and they are named in `provenance.avoided` rather than in
 * `sources` precisely because nothing here came from them.
 *
 * ── The premise every block declines ──────────────────────────────────
 *
 * This is the instrument that lands on tender ground, and the shape of the
 * option sets is the whole answer to that. Every block presupposes a decision,
 * and every block therefore carries an option that declines the premise:
 * `children-ceiling.undecided`, `timing-gate.notWanted` and `timing-gate.unsure`,
 * `child-spacing.notMoreThanOne`, `if-not-natural.unsure`,
 * `childcare.undecided`, `grandparents.notAround`, `screens.noFixedAge`,
 * `parent-deadlock.undecided`. "We have not decided" is a real, common and
 * correct answer here, and the copy has to hold it as an answer rather than as
 * a failure to give one — which is why `spec.ts` fires no playbook line off
 * most of them and why the View draws the escape exactly as it draws every
 * other position.
 *
 * Two properties of those escapes are load-bearing and were got wrong once.
 *
 * **Every escape is first person.** The bank's `rejected` list records "«we
 * have not decided» as the honest escape on seven blocks" as the worst fault in
 * the first draft. House rule 7 says no question may require a partner, and a
 * "we" in the escape quietly reintroduces one: a person answering alone, or one
 * whose partner has never raised the subject, had no true option and would have
 * been pushed onto a false one. The four blocks that name a hypothetical other
 * parent still ask what *you* would do about them.
 *
 * **`if-not-natural` names its escapes exclusive.** It is the one `multi` here,
 * and a `multi` clears nothing by itself — so without `exclusive` a reader
 * could hold "None — I would stop and live without children" beside "Adoption"
 * and the app would store, score and print the contradiction back at them as a
 * position they stated. `max: 4` is a limit on how much can be added and has no
 * authority over the escape; see `MultiItem` in `core/types.ts`.
 *
 * ── What this bank refuses to be ──────────────────────────────────────
 *
 * It computes nothing. There is no intended family size, no readiness score, no
 * agreement figure and no forecast, and the refusal is a property of these
 * declarations rather than a promise made in copy. Stated intentions about
 * children predict achieved family size poorly — people are more likely to miss
 * their number than hit it (Quesnel-Vallée and Morgan 2003) — so a number
 * derived from these thirteen answers would be a prediction the literature does
 * not support, printed with the authority of everything around it.
 *
 * Nothing is `private` and nothing is `skipWeight`. The weight is the point of
 * a block here: two people who both say "about a year" and both rate it 9 have
 * found nothing to discuss, and two who differ at 9 and 2 have found which of
 * them has been conceding. And nothing declares `grounds` — the bank's
 * `rejected` list argues it out for `schooling` and `discipline` in particular:
 * grounds become legible only when the same closed list is comparable across a
 * whole bank, two blocks out of thirteen would produce a pattern too sparse to
 * read, and the free `why` already carries the reason on every block.
 *
 * ── What is deliberately absent ───────────────────────────────────────
 *
 * Ending a pregnancy after a serious diagnosis, vaccination, circumcision, and
 * who would raise the children if you both died. Each is argued out in the
 * bank's `rejected` list; each absence is a decision rather than an oversight.
 * One thing is deliberately *present* against the same instinct: `discipline`
 * offers a smack, because people choose it and an option set that omits a real
 * answer collects a false one instead. The evidence against the practice is in
 * the `sourceNote`, where it belongs, and not inside the question — a question
 * that argues collects agreement.
 *
 * The words are all in `i18n/`. Nothing below is reader-facing.
 */

/**
 * The four sections, in the order they are asked.
 *
 * Ids only: the title and the note under it are copy and live in `i18n/`. The
 * order is load-bearing twice over — it is the order the blocks are declared
 * in, and `spec.ts` sizes a page against it so that no page ever straddles two
 * of them. Unlike the pilot's, these four are *not* the same size: four blocks,
 * three, four, two. See the `pageSize` note in `spec.ts` for what that costs.
 */
export const SECTIONS = ["plan", "care", "raising", "disagreement"] as const;
export type SectionId = (typeof SECTIONS)[number];

/**
 * The thirteen, declared in section order.
 *
 * Twelve are a `choice` and one is a `multi`. `if-not-natural` is the `multi`
 * because the routes it lists are not alternatives — a person open to fertility
 * treatment is very often open to adoption as well, and forcing one of the two
 * would collect a ranking nobody was asked for. It is also the block the
 * `sensitive` flag on this instrument exists for: infertility is not an edge
 * case, WHO's 2023 review put lifetime prevalence at roughly one adult in six,
 * and an answer to it is a disclosure rather than a preference.
 */
export const BLOCKS: readonly StanceBlock[] = [
  {
    id: "children-ceiling",
    kind: "choice",
    section: "plan",
    options: ["none", "one", "two", "three", "fourPlus", "undecided"],
  },
  {
    id: "timing-gate",
    kind: "choice",
    section: "plan",
    options: ["readyNow", "money", "home", "study", "notWanted", "unsure"],
  },
  {
    id: "child-spacing",
    kind: "choice",
    section: "plan",
    options: ["underTwo", "twoThree", "overThree", "whatever", "notMoreThanOne", "unsure"],
  },
  {
    id: "if-not-natural",
    kind: "multi",
    section: "plan",
    options: ["treatment", "donor", "adoption", "fostering", "stop", "unsure"],
    max: 4,
    // The two answers that mean *none of the others*. Both are terminal in
    // ordinary English and neither would clear anything without being named.
    exclusive: ["stop", "unsure"],
  },

  {
    id: "who-steps-back",
    kind: "choice",
    section: "care",
    options: ["me", "otherParent", "bothPartTime", "neither", "lowerEarner", "undecided"],
  },
  {
    id: "time-at-home",
    kind: "choice",
    section: "care",
    options: ["weeksOrLess", "months", "year", "twoThreeYears", "untilSchool", "undecided"],
  },
  {
    id: "childcare",
    kind: "choice",
    section: "care",
    options: ["parentHome", "family", "nursery", "nanny", "undecided"],
  },

  {
    id: "schooling",
    kind: "choice",
    section: "raising",
    options: ["state", "faithSchool", "private", "home", "whicheverAdmits", "unsure"],
  },
  {
    id: "discipline",
    kind: "choice",
    section: "raising",
    options: ["explain", "removeSomething", "timeOut", "raiseVoice", "smack", "unsure"],
  },
  {
    id: "screens",
    kind: "choice",
    section: "raising",
    options: ["underTen", "tenEleven", "twelveThirteen", "fourteenPlus", "noFixedAge", "undecided"],
  },
  {
    id: "grandparents",
    kind: "choice",
    section: "raising",
    options: ["sayInDecisions", "helpNoSay", "occasional", "minimal", "notAround", "unsure"],
  },

  {
    id: "parent-deadlock",
    kind: "choice",
    section: "disagreement",
    options: ["moreWorried", "mainCarer", "byADate", "outsideHelp", "noChange", "undecided"],
  },
  {
    id: "change-of-mind",
    kind: "choice",
    section: "disagreement",
    options: ["stayAndAccept", "stayAndPress", "end", "dependsDirection", "unsure"],
  },
];

/**
 * One suggested line, and the answer it is derived from.
 *
 * `from` is the bank's derivation in a notation `spec.ts` parses once and
 * nothing else ever reads as a string. The pilot's notation is `block = value |
 * value` and that covers nine of these twenty-six; this bank needs three more
 * shapes, and each of them is a sentence the bank already wrote in prose:
 *
 *   `block = a | b`          the choice is one of these
 *   `block != a`             a position was stated and it was not this one
 *   `block includes a | b`   the multi was ticked and holds one of these
 *   `block excludes a`       the multi was answered and holds none of these
 *
 * The last two exist for `if-not-natural`, which is the only `multi` here, and
 * `!=` exists for the two lines the bank derives from `discipline ≠ A smack`.
 * Both negative forms require an answer first: a line fired off a block nobody
 * filled in is a sentence the reader is being asked to hand somebody on the
 * strength of a blank.
 *
 * Where the bank names an option in prose — "any fixed age", "any number,
 * including None" — the values are spelled out here rather than reduced to a
 * predicate, so that the two files can still be diffed by eye against each
 * other and a renamed option fails loudly in `spec.ts` instead of silently
 * firing nothing.
 *
 * The text is in `i18n/` under `playbook.<id>`, and the id is the bank's id
 * unchanged: it is what the reader's ticks are stored against, so renaming one
 * silently unticks a sentence somebody had endorsed.
 */
export type Derivation = { id: string; from: string };

/**
 * Thirteen a side, which is not what one reader sees.
 *
 * No option fires more than one line per side, so a reader who answers all
 * thirteen substantively sees at most thirteen and thirteen, and one who takes
 * several of the escapes sees fewer. That is the design's eight-to-fourteen
 * target met by the *page* rather than by the bank.
 *
 * Coverage is deliberately uneven, and the gaps are the escapes. There is no
 * sentence anybody could be held to behind "I have no number in mind" or "I
 * have not decided", so those options fire nothing on either side — which is
 * the mechanical form of the rule that an undecided answer is an answer and not
 * a failure. `child-spacing = whatever` and `screens = noFixedAge` look like
 * escapes and are not: "I am not holding a gap in mind" and "I would decide on
 * the day" are both positions a person can be handed, and only the first of
 * them earns a line here.
 */
export const PLAYBOOK_OK: readonly Derivation[] = [
  { id: "ok-start-whenever", from: "timing-gate = readyNow" },
  { id: "ok-money-before-dates", from: "timing-gate = money" },
  { id: "ok-no-gap-held", from: "child-spacing = whatever" },
  { id: "ok-tests-early", from: "if-not-natural includes treatment" },
  { id: "ok-adoption-first-class", from: "if-not-natural includes adoption" },
  { id: "ok-plan-on-me", from: "who-steps-back = me" },
  { id: "ok-book-the-visits", from: "childcare = nursery" },
  { id: "ok-ask-my-parents", from: "grandparents = helpNoSay" },
  { id: "ok-local-school-no-case", from: "schooling = state" },
  // "discipline ≠ A smack" — the line asks to be held to something, so it is
  // owed only to a reader who said the something.
  { id: "ok-stop-me", from: "discipline != smack" },
  // "screens = any fixed age": the four ages, and not `noFixedAge`, which is
  // the answer that there is nothing to settle.
  { id: "ok-phone-age-settled", from: "screens = underTen | tenEleven | twelveThirteen | fourteenPlus" },
  { id: "ok-you-decide-on-the-day", from: "parent-deadlock = mainCarer" },
  { id: "ok-say-it-either-way", from: "change-of-mind = stayAndAccept" },
];

export const PLAYBOOK_NOT_OK: readonly Derivation[] = [
  // "children-ceiling = any number, including None". `undecided` is excluded on
  // the bank's own reasoning: "do not treat the number I gave as an opening
  // offer" is incoherent said by somebody who gave no number.
  { id: "notok-reopen-the-number", from: "children-ceiling = none | one | two | three | fourPlus" },
  // The three obstacles that can actually move. `readyNow` has nothing in the
  // way, `notWanted` is not waiting, and `unsure` cannot name the thing.
  { id: "notok-date-before-obstacle", from: "timing-gate = money | home | study" },
  { id: "notok-donor-small-step", from: "if-not-natural excludes donor" },
  // `stop` is exclusive, so holding it *is* the whole answer — the bank writes
  // this one with an `=` and the two forms mean the same thing here.
  { id: "notok-keep-sending-clinics", from: "if-not-natural includes stop" },
  { id: "notok-assume-i-step-back", from: "who-steps-back = otherParent | neither" },
  { id: "notok-leave-has-an-end-date", from: "time-at-home = year | twoThreeYears | untilSchool" },
  { id: "notok-ask-my-parents-first", from: "childcare = family" },
  { id: "notok-fees-without-me", from: "schooling = private" },
  { id: "notok-school-not-a-compromise", from: "schooling = state" },
  { id: "notok-smack", from: "discipline != smack" },
  { id: "notok-early-phone", from: "screens = underTen | tenEleven | twelveThirteen | fourteenPlus" },
  { id: "notok-grandparents-overrule", from: "grandparents = helpNoSay" },
  { id: "notok-quiet-change", from: "change-of-mind = end | dependsDirection" },
];
