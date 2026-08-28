import type { StanceBlock } from "@/core/stance";

/**
 * Twelve positions on what this person holds, and what each one rests on.
 *
 * The bank is `docs/banks/faith.json`, where every sentence was written and
 * critiqued; this file is the declaration behind it. Nothing below is
 * reader-facing — the words live in `i18n/`, generated from the bank by
 * `scripts/bank-to-messages.mjs`.
 *
 * ── What this bank refuses to be ──────────────────────────────────────
 *
 * It computes nothing about the person. No devoutness figure, no orthodoxy
 * figure, and no number that could be read as either — §7.4 of
 * `docs/superpowers/specs/2026-08-27-stated-positions-design.md`. Four things
 * were refused by name in the bank's own `rejected` list, and each of them is
 * the obvious next commit:
 *
 * **No strength-of-faith rating.** "How strong is your faith, from 1 to 10" is
 * a devoutness score with the label filed off. The 1–10 field in this format is
 * weight, and weight grades the stake rather than the believer: it says how
 * much a position matters to the person holding it, which is a fact about their
 * stake in a conversation and not about how much God they have.
 *
 * **No doctrinal checklist.** Resurrection, Trinity, real presence, inerrancy
 * — an option set built for one confession marks a Muslim, a Jew and an atheist
 * "wrong" on every line, which is the insult §7.4 forbids outright.
 *
 * **No frequency ladders.** Two were cut on the licence rule (they are DUREL's
 * first two items and the CRS practice items in paraphrase) and would have been
 * cut anyway on house rule 4: a person knows when they last prayed and does not
 * know how many times they prayed last year. `prayer-last` asks for a date,
 * which is known, rather than a rate, which is estimated.
 *
 * **No adding anything to anything.** Two frequencies, or a frequency and a
 * belonging, summed into a total is scoring, and this instrument does not
 * score. `practice` is two questions on one page and they stay two.
 *
 * ── Answerable by three people who share nothing ──────────────────────
 *
 * Someone who holds a faith firmly, someone who has left one, and someone who
 * never had one all have to be able to run straight through this without being
 * insulted, and none of the three may be treated as the incomplete answer. That
 * is a property of the declarations rather than a promise made in copy: every
 * block that presupposes belief carries an option declining the premise —
 * `god.untrue`, `after-death.nothing`, `suffering.no-one-allows`,
 * `prayer-last.never`, `belonging.nowhere-content`,
 * `raised-vs-now.none-either-way`, `children-taught.none-unless-asked`,
 * `funeral.nothing-religious`, `money-use.touches-nothing`, `work-rest.no`,
 * `non-negotiable.left-alone`, `unsettled.nothing-unsure`. Twelve blocks,
 * twelve declined premises.
 *
 * No block asks about anybody but the reader. There is no question here a
 * person answering alone has to invent a partner in order to reach — house
 * rule 7, and the reason `partner-change` is in the bank's `rejected` list
 * rather than in this array.
 */

/**
 * The five sections, in the order they are asked.
 *
 * Ids only: the title and the note under it are copy and live in `i18n/`. The
 * order is load-bearing twice over — it is the order the blocks are declared
 * in, and `spec.ts` sizes a page against it.
 */
export const SECTIONS = ["belief", "practice", "lineage", "consequences", "edges"] as const;
export type SectionId = (typeof SECTIONS)[number];

/**
 * What a position rests on. One vocabulary, used by all twelve blocks.
 *
 * This is the load-bearing part of the instrument and the reason the request
 * asked for grounds at all. Two people can hold the same belief at the same
 * weight on entirely different grounds, and one can hold two beliefs of equal
 * weight on different grounds from each other — patterns that are legible only
 * because the list is identical everywhere. `core/stance.ts` looks these up
 * under one flat key per value, `stance.grounds.<value>`, deliberately not per
 * block, so that "scripture" is the same word under every question.
 *
 * Seven options rather than the house maximum of six. Deliberate, and it is the
 * design's own list (§7.4). Collapsing `scripture` into `church` would merge two
 * grounds that a great many people hold separately and some hold against each
 * other; dropping `not-worked-out` would collect a false ground from everyone
 * who holds the belief and has never asked themselves why.
 */
export const GROUNDS = [
  "scripture",
  "church",
  "reason",
  "experience",
  "upbringing",
  "people",
  "not-worked-out",
] as const;

/**
 * The one ground that cannot be held beside another.
 *
 * "I have not worked that out" is the honest escape this list is required to
 * carry, and in a `multi` nothing else makes it escape: without this a reader
 * ticks it beside "Scripture" and the app stores, prints and hands on a
 * contradiction they will be read as having stated. `StanceBlock.groundsExclusive`
 * exists for exactly this value — see its declaration in `core/stance.ts` — and
 * it is the block's field rather than the question's because the two option sets
 * are unrelated.
 */
export const GROUNDS_ESCAPE = "not-worked-out";

/** Every block declares the same grounds, which is the whole point of them. */
const grounded: Pick<StanceBlock, "grounds" | "groundsExclusive"> = {
  grounds: [...GROUNDS],
  groundsExclusive: [GROUNDS_ESCAPE],
};

/**
 * The twelve, declared in section order.
 *
 * Three are `multi`, and each of those names its escape: money, refusals and
 * doubts are all sets rather than rankings, and a single choice would force a
 * false one — a person who gives a fixed share *and* will not earn certain
 * money has stated two independent facts, not chosen between them. `max: 3`
 * keeps the answer to a short list; it has no authority over an escape, which
 * it neither counts nor disables.
 *
 * Nothing is `private` and nothing is `skipWeight`. `private` was spent once
 * across the eight banks, on `money-management.undisclosed-debt`, and every
 * private block costs the two-person comparison a `withheld` case: nothing here
 * is an admission merely by being asked. And the weight is the whole point of a
 * block — two people who both want the full rite at their funeral and rate it 9
 * have found nothing to discuss, and two who differ at 9 and 2 have found which
 * of them has been conceding.
 */
export const BLOCKS: readonly StanceBlock[] = [
  { id: "god", kind: "choice", section: "belief", options: ["close", "distant", "impersonal", "untrue", "open", "rather-not"], ...grounded },
  { id: "after-death", kind: "choice", section: "belief", options: ["life-with-god", "another-life", "something", "nothing", "not-worked-out", "rather-not"], ...grounded },
  { id: "suffering", kind: "choice", section: "belief", options: ["reason-i-trust", "reason-unknown", "no-one-allows", "people-do-it", "not-worked-out", "rather-not"], ...grounded },

  { id: "prayer-last", kind: "choice", section: "practice", options: ["today", "this-week", "this-year", "longer-ago", "never"], ...grounded },
  { id: "belonging", kind: "choice", section: "practice", options: ["known-by-name", "a-face", "people-not-institution", "tradition-only", "nowhere-content", "nowhere-missed"], ...grounded },

  { id: "raised-vs-now", kind: "choice", section: "lineage", options: ["stayed", "stayed-differently", "left", "found", "none-either-way", "still-moving"], ...grounded },
  { id: "children-taught", kind: "choice", section: "lineage", options: ["raised-in-it", "taught-then-choose", "several", "none-unless-asked", "undecided"], ...grounded },
  { id: "funeral", kind: "choice", section: "lineage", options: ["full-rite", "simple-rite", "words-not-religious", "nothing-religious", "whatever-comforts", "undecided"], ...grounded },

  { id: "money-use", kind: "multi", max: 3, exclusive: ["touches-nothing", "not-thought"], section: "consequences", options: ["fixed-share", "give-when-asked", "wont-earn", "wont-spend", "touches-nothing", "not-thought"], ...grounded },
  { id: "work-rest", kind: "choice", section: "consequences", options: ["whole-day", "part-day", "in-principle", "no-but-rest", "no"], ...grounded },

  { id: "non-negotiable", kind: "multi", max: 3, exclusive: ["nothing"], section: "edges", options: ["children", "practice", "saying-so", "belonging", "left-alone", "nothing"], ...grounded },
  { id: "unsettled", kind: "multi", max: 3, exclusive: ["nothing-unsure"], section: "edges", options: ["god-exists", "after-death", "suffering", "tradition-right", "own-honesty", "nothing-unsure"], ...grounded },
];

/**
 * One suggested line, and the answer it is derived from.
 *
 * `from` is copied verbatim from the bank in the bank's own notation —
 * `block = value | value`, or `block ≠ value` — so the two files can be diffed
 * by eye. It is parsed once, in `spec.ts`, and never read as a string anywhere
 * else.
 *
 * The text is in `i18n/` under `playbook.<id>`. The id is what the reader's
 * ticks are stored against, so it is the bank's id unchanged: renaming one
 * silently unticks a sentence somebody had endorsed. That is also why
 * `notok-baptism-without-me` keeps a prefix the rest of its list does not —
 * §1.2 of the inventory decisions moves it here by that name, and a tidier id
 * would make the decision's own reference unfollowable.
 */
export type Derivation = { id: string; from: string };

/**
 * Fifteen lines a side, which is not what one reader sees.
 *
 * The design's target of eight to fourteen is a target for the page, not a cap
 * on the bank, because the same design requires the lines to be derived from
 * the result. A reader who holds a faith firmly fires a different set from one
 * who has left one, and most of these fire for neither.
 *
 * Two derivations are worth reading twice. `children-taught = taught-then-choose`
 * fires two OK lines, which is allowed: they ask for different things from a
 * different person. And `notok-baptism-without-me` is the bank's only negation
 * — every reader who has taken *any* position on a child's formation gets it,
 * and the reader who has not taken one does not, so it is still derived from
 * the answer rather than handed to everybody.
 */
export const PLAYBOOK_OK: readonly Derivation[] = [
  { id: "ok-call-me-on-the-day", from: "work-rest = whole-day" },
  { id: "ok-pray-around-me", from: "prayer-last = today" },
  { id: "ok-ask-me-straight", from: "god = open" },
  { id: "ok-say-i-dont-look-it", from: "god = distant" },
  { id: "ok-say-grace", from: "god = untrue" },
  { id: "ok-invite-me-anyway", from: "belonging = nowhere-content" },
  { id: "ok-ask-me-along", from: "belonging = nowhere-missed" },
  { id: "ok-name-the-old-parish", from: "raised-vs-now = left" },
  { id: "ok-answer-my-kids-honestly", from: "children-taught = taught-then-choose" },
  { id: "ok-take-them-along", from: "children-taught = taught-then-choose" },
  { id: "ok-ask-what-i-give", from: "money-use = fixed-share" },
  { id: "ok-call-out-the-slip", from: "work-rest = in-principle" },
  { id: "ok-plain-speech-about-death", from: "after-death = not-worked-out" },
  { id: "ok-bring-hard-questions", from: "unsettled = suffering" },
  { id: "ok-ask-in-public", from: "non-negotiable = saying-so" },
];

export const PLAYBOOK_NOT_OK: readonly Derivation[] = [
  { id: "no-small-work-messages", from: "work-rest = whole-day" },
  { id: "no-phase-talk", from: "prayer-last = today" },
  { id: "no-praying-over-me", from: "god = untrue" },
  { id: "no-treating-it-as-taste", from: "god = close" },
  { id: "no-fixing-the-distance", from: "god = distant" },
  { id: "no-you-will-return", from: "raised-vs-now = left" },
  { id: "no-unexamined-assumption", from: "raised-vs-now = stayed" },
  { id: "no-service-detour", from: "children-taught = raised-in-it" },
  { id: "notok-baptism-without-me", from: "children-taught ≠ undecided" },
  { id: "no-filling-in-my-view", from: "after-death = not-worked-out" },
  { id: "no-supplying-the-reason", from: "suffering = reason-unknown" },
  { id: "no-raiding-the-giving", from: "money-use = fixed-share" },
  { id: "no-improvising-the-funeral", from: "funeral = full-rite" },
  { id: "no-doubt-as-ammunition", from: "unsettled = own-honesty" },
  { id: "no-deciding-without-me", from: "non-negotiable = children" },
];
