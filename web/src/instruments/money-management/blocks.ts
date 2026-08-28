import type { StanceBlock } from "@/core/stance";

/**
 * Thirteen positions a person states about their own money.
 *
 * The subject matter is public and the instruments that measure it are not,
 * and the bank keeps the two apart deliberately. Jan Pahl's typology of
 * household money management — whole wage, allowance, pooling, independent —
 * has been in the literature since 1980, and the contents of a household
 * budget belong to nobody. The measuring instruments in this area do belong to
 * somebody: the Financial Infidelity Scale, the Klontz Money Script Inventory
 * and the premarital inventories whose publishers state in writing that their
 * items are proprietary. Not one item, option label or response format from any
 * of them is here or was worked backwards from. Every prompt and every option
 * below was written for this repo, in `docs/banks/money-management.json`, where
 * it was critiqued.
 *
 * ── What this bank refuses to be ──────────────────────────────────────
 *
 * It computes nothing. No score, no band, no ratio, no "financial
 * compatibility" figure. Two outside findings sit in the `sourceNote` as
 * somebody else's evidence — the joint-account experiment and the money-
 * argument divorce correlation — and neither is turned into a verdict on an
 * answer here. In particular the first question has no right answer on this
 * page, whatever one experiment on newly married American couples found.
 *
 * **No amount is ever asked for.** Every question about a quantity is asked as
 * a share, a threshold in weeks of pay, or a yes and no. A bank that collects a
 * figure from somebody hiding a debt collects a false figure, and a bank that
 * collects one from anybody else has built a record of their finances for no
 * reading it can offer in return.
 *
 * ── The one private block ─────────────────────────────────────────────
 *
 * `undisclosed-debt` carries `private: true`, and it is the only block across
 * the eight inventories that does. The `sourceNote` makes the reader a promise
 * in their own copy — the answer never leaves this device, is never in a share
 * link, and is never asked for as an amount — and the flag is how the promise
 * is kept rather than merely said. `stanceItems` puts all three of its derived
 * items on `tier: "private"`, `packAnswers` strips on that tier, `cardable`
 * keeps it off the instruction sheet, and `compareStances` files it under
 * `withheld` and nowhere else.
 *
 * Private *entire*, not a private answer with a public weight beside it. A
 * token that omitted the answer and carried `undisclosed-debt.weight = 9`
 * would have announced exactly what the omission was withholding, to somebody
 * who now knows there is something to ask about. See `StanceBlock.private` in
 * `core/stance.ts`, which argues it at length.
 *
 * ── Why the blocks are the shape they are ─────────────────────────────
 *
 * Every prompt is second person. Where one says "someone" or "the other
 * person" it means whoever the reader lives with now or would, so all thirteen
 * are answerable by one person sitting alone — which is the test the whole
 * family is written against. The first person is kept for the playbook lines,
 * which are the sentences the reader hands to somebody else.
 *
 * Every option set carries a way out that is a real answer rather than filler:
 * "I have not decided", "I have never set a figure", "Nothing of mine is
 * invested", "This has not happened to me". A person who has not settled how
 * shared costs should be divided has genuinely not settled it, and a bank with
 * no such option collects a guess and prints it back as a position.
 *
 * The account options are Pahl's systems in our own words and are worded to be
 * mutually exclusive: one pot both people spend from is not the same
 * arrangement as one person holding it while the other draws a share, and an
 * earlier wording let a single answer be true of both.
 *
 * The words are all in `i18n/`. Nothing below is reader-facing.
 */

/**
 * The five sections, in the order they are asked.
 *
 * Ids only: the title and the note under it are copy and live in `i18n/`. The
 * order is load-bearing twice over — it is the order the blocks are declared
 * in, and `spec.ts` sizes a page against it so that a section is not split
 * across a page break where the arithmetic allows.
 */
export const SECTIONS = ["holding", "disclosure", "building", "outward", "strain"] as const;
export type SectionId = (typeof SECTIONS)[number];

/**
 * What a position rests on, offered whole to the six blocks that take it.
 *
 * One flat list rather than a per-block one, because the words are looked up
 * by `stance.grounds.<value>` and not by block — which is the entire point of
 * the field. "How I was raised" has to be the same phrase under every question
 * or two answers cannot be read as the same ground, and a reader who was
 * raised into one arrangement and reasoned into another has said something the
 * weight question cannot say for them.
 *
 * The six are the ones where authority is genuinely separate from strength of
 * feeling: where the money sits, how it is split, the figure at which a
 * purchase gets mentioned, what to do in a fall, what is given away, and what
 * is owed to a parent. The other seven are asked without grounds because the
 * answer is a description of an arrangement rather than a claim needing one.
 */
const GROUNDS = ["raised", "lived", "faith", "numbers", "advice", "not-worked-out"];

/**
 * "I have not worked that out" cannot be held beside "How I was raised".
 *
 * The bank does not carry a `groundsExclusive` field — its `grounds` is a flat
 * `true` on the six blocks that take the list — so this is declared here, and
 * it is declared rather than left off because a grounds multi with an escape
 * that does not escape is the exact fault `MultiItem.exclusive` exists for. A
 * reader can otherwise tick the ground and the admission that there is none,
 * and the app stores, prints and compares the contradiction as a position they
 * stated. See the note on `StanceBlock.groundsExclusive` in `core/stance.ts`,
 * which names this option as the one the field was added for.
 */
const GROUNDS_ESCAPE = ["not-worked-out"];

/**
 * The thirteen, declared in section order.
 *
 * Eleven are a `choice` and two are a `multi`, and both multis carry an
 * `exclusive` escape because a checkbox list clears nothing on its own.
 * `retirement-source` is capped at two and says "mainly" in its prompt, since a
 * cap of two over a list of real sources is a lie unless the question asks
 * which ones matter most. `secrecy-betrayal` is capped at five of its six, so
 * the cap never sits between a reader and the whole of their answer.
 *
 * Nothing is `skipWeight`. The weight is the whole point of a block here: two
 * people who both want a single pot and both rate it 9 have found nothing to
 * discuss, and two who differ at 9 and 2 have found which of them has been
 * conceding. The one block that is `private` still carries its weight question,
 * privately — see the header.
 */
export const BLOCKS: readonly StanceBlock[] = [
  { id: "accounts", kind: "choice", section: "holding", grounds: GROUNDS, groundsExclusive: GROUNDS_ESCAPE, options: ["one-pot", "hybrid", "separate", "one-manages", "undecided"] },
  { id: "cost-split", kind: "choice", section: "holding", grounds: GROUNDS, groundsExclusive: GROUNDS_ESCAPE, options: ["equal", "proportional", "one-income", "by-category", "whoever", "undecided"] },
  { id: "money-admin", kind: "choice", section: "holding", options: ["me", "them", "by-category", "together", "whoever", "undecided"] },

  { id: "spend-threshold", kind: "choice", section: "disclosure", grounds: GROUNDS, groundsExclusive: GROUNDS_ESCAPE, options: ["any", "day", "week", "month", "never", "not-set"] },
  { id: "debt-disclosure", kind: "choice", section: "disclosure", options: ["early", "moving-in", "marriage", "if-asked", "never", "undecided"] },
  /**
   * The one private block in the eight banks. See the header, and
   * `StanceBlock.private` in `core/stance.ts`.
   *
   * It asks yes or no and offers "I would rather not answer this", because an
   * option set that demands a figure from somebody hiding a debt collects a
   * false figure. Declining is a real answer and is stored as one.
   */
  { id: "undisclosed-debt", kind: "choice", section: "disclosure", private: true, options: ["none", "will-say", "wont-say", "unsure", "decline"] },

  { id: "saving-rate", kind: "choice", section: "building", options: ["none", "five", "ten", "twenty", "more", "no-target"] },
  { id: "risk-response", kind: "choice", section: "building", grounds: GROUNDS, groundsExclusive: GROUNDS_ESCAPE, options: ["sell", "wait", "buy", "ask", "not-invested", "undecided"] },
  { id: "retirement-source", kind: "multi", max: 2, exclusive: ["unworked"], section: "building", options: ["state", "workplace", "own-savings", "property", "family", "unworked"] },

  { id: "giving-share", kind: "choice", section: "outward", grounds: GROUNDS, groundsExclusive: GROUNDS_ESCAPE, options: ["none", "when-asked", "set-amount", "tenth", "more-than-tenth", "undecided"] },
  { id: "parent-support", kind: "choice", section: "outward", grounds: GROUNDS, groundsExclusive: GROUNDS_ESCAPE, options: ["home", "monthly", "top-up", "crisis", "care-not-money", "undecided"] },

  { id: "bad-month", kind: "choice", section: "strain", options: ["cut", "savings", "card", "family", "extra-work", "never"] },
  { id: "secrecy-betrayal", kind: "multi", max: 5, exclusive: ["none"], section: "strain", options: ["hidden-account", "solo-debt", "lied-cost", "family-gift", "private-pot", "none"] },
];

/**
 * One suggested line, and the answers it is derived from.
 *
 * `from` is copied verbatim from the bank in the bank's own notation, so the
 * two files can be diffed by eye. It is parsed once, in `spec.ts`, and never
 * read as a string anywhere else. The notation this bank uses is richer than
 * the pilot's, because two of its blocks are multis and one line turns on an
 * option *not* being ticked:
 *
 *     block → value                     the answer is that value
 *     block → value / value             the answer is one of them
 *     block without value               answered, and that value is not in it
 *     clause; clause                    both have to hold
 *     (…)                               a note to a reader of the bank
 *
 * The text is in `i18n/` under `playbook.<id>`. The id is what the reader's
 * ticks are stored against, so it is the bank's id unchanged: renaming one
 * silently unticks a sentence somebody had endorsed.
 */
export type Derivation = { id: string; from: string };

/**
 * Fourteen OK lines and thirteen not-OK ones, which is not what one reader
 * sees.
 *
 * The design's target of eight to fourteen a side is a target for the page
 * rather than a cap on the bank, because the same design requires the lines to
 * be derived from the result. A reader who answers everything substantively
 * sees perhaps eight or nine a side; one who takes the escapes sees fewer.
 *
 * Two of them are worth naming here. `ok-own-account-private` is the only line
 * that turns on two blocks at once and on one of them negatively: a person who
 * keeps their own account is offering the other person the same freedom, but
 * only if they do not also count a private pot as a betrayal, and offering it
 * to somebody who does would be handing over a sentence they contradict three
 * questions later.
 *
 * `ok-see-my-statements` is derived from the private block, which is legal and
 * is not an accident. The playbook is local — it is stored beside the run, it
 * is printed on a sheet, and §4.4 of the design keeps it out of share tokens
 * entirely. If that ever changes, this id must be excluded by name before any
 * playbook line is packed: whether the line is present or absent is itself a
 * read on the private answer, and an inference channel leaks as surely as a
 * field does.
 */
export const PLAYBOOK_OK: readonly Derivation[] = [
  { id: "ok-under-threshold", from: "spend-threshold → week" },
  { id: "ok-month-threshold", from: "spend-threshold → month" },
  { id: "ok-own-account-private", from: "accounts → hybrid / separate; secrecy-betrayal without private-pot" },
  { id: "ok-ask-what-it-cost", from: "secrecy-betrayal → lied-cost" },
  { id: "ok-pay-less-than-half", from: "cost-split → proportional" },
  { id: "ok-refuse-my-family", from: "parent-support → crisis" },
  { id: "ok-run-the-admin", from: "money-admin → them" },
  { id: "ok-save-first", from: "saving-rate → ten / twenty / more" },
  { id: "ok-tithe-unasked", from: "giving-share → tenth / more-than-tenth" },
  { id: "ok-leave-investments-alone", from: "risk-response → wait" },
  { id: "ok-use-the-buffer", from: "bad-month → savings" },
  { id: "ok-say-we-cannot-afford", from: "bad-month → cut" },
  { id: "ok-see-my-statements", from: "undisclosed-debt → none (local only, never in a share token)" },
  { id: "ok-hand-back-the-admin", from: "money-admin → together / by-category" },
];

export const PLAYBOOK_NOT_OK: readonly Derivation[] = [
  { id: "no-solo-borrowing", from: "debt-disclosure → moving-in / marriage; secrecy-betrayal → solo-debt" },
  { id: "no-hidden-account", from: "secrecy-betrayal → hidden-account" },
  { id: "no-shade-the-price", from: "secrecy-betrayal → lied-cost" },
  { id: "no-sell-in-a-fall", from: "risk-response → wait" },
  { id: "no-commit-to-a-parent", from: "parent-support → crisis / care-not-money" },
  { id: "no-card-instead-of-saying", from: "bad-month → card" },
  { id: "no-big-purchase-unsaid", from: "spend-threshold → month" },
  { id: "no-quiet-pension-stop", from: "retirement-source → workplace / own-savings" },
  { id: "no-dont-worry-about-it", from: "money-admin → them" },
  { id: "no-unmentioned-giving", from: "giving-share → set-amount / tenth" },
  { id: "no-escape-fund", from: "secrecy-betrayal → private-pot" },
  { id: "no-ask-parents-first", from: "bad-month → family" },
  { id: "no-silent-resplit", from: "cost-split → equal / proportional" },
];
