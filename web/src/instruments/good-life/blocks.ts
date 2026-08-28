import type { StanceBlock } from "@/core/stance";

/**
 * Twelve positions on what a life that went well would contain, and four
 * questions with no options at all.
 *
 * There is no instrument behind this one and there does not need to be. The
 * wellbeing literature — hedonic and eudaimonic accounts, Ryff's six
 * dimensions, self-determination theory's three needs, Seligman's PERMA, the
 * OECD's eleven Better Life domains — was read once, to answer one question:
 * which domains of a life do these twelve blocks leave out. Nothing was taken
 * from any of it. Those questionnaires belong to their authors, several of them
 * require written permission, and none is reproduced, paraphrased or
 * reconstructed here. `provenance.ts` names all fifteen and records the three
 * debts the first draft did not record, which is the kind of thing that looks
 * like concealment later:
 *
 * `work-purpose` sits on the job / career / calling trichotomy, which is public
 * and older than its measurement; Wrzesniewski's Work-Life Questionnaire
 * operationalises it in three paragraph-length vignettes, none of which is used
 * here. `regret-most` was rewritten because three of its six original options
 * reproduced the *shape* of Bronnie Ware's five regrets of the dying — the
 * wording was original, the set was not — and it now overlaps at one option and
 * carries an escape. And the closing question about what people would say was
 * reworded away from «what would you want said at your funeral», which is close
 * to Covey's Habit 2 visualisation.
 *
 * ── What this bank refuses to be ──────────────────────────────────────
 *
 * It computes nothing. No score, no band, no profile of a life, no percentage
 * of a good one achieved. That is a property of the declarations below rather
 * than a promise made in copy: `scoreStances` reads positions, weights and
 * whether a reason exists, and there is no second function anywhere in this
 * folder. A wellbeing number is the one output this subject invites and the one
 * it cannot survive — every scale that produces one was administered to a
 * sample first, this bank never has been, and a number here would be an
 * estimate of somebody's life made from twelve answers by an app that promised
 * to estimate nothing.
 *
 * ── Where the escapes are, and what they cost ─────────────────────────
 *
 * Every block carries a way out and every way out is a real answer: «I have not
 * worked that out», «I have never set a point», «Nothing. The shape of the year
 * is right», «None of these. I do not think that way». Three of the four
 * `multi` blocks name theirs `exclusive`, because a `choice` clears the others
 * for free and a `multi` clears nothing — a reader who could hold «Nothing at
 * the moment» beside «Two or three hours a week of training» has been handed a
 * contradiction to state about themselves.
 *
 * `money-for`'s escape cost a block, and the first draft argued it should not
 * have to: a multi that can be left with nothing ticked was said to carry its
 * own escape already. Reading the runner is what reversed that. `blocking` in
 * `components/runner/runner.tsx` treats every non-`text` item whose answer is
 * `undefined` as blocking Next, so on a form that is not `optional` an
 * untouched multi is a wall rather than a way past; this form *is* optional,
 * which moves the fault rather than removing it, because a blank multi and a
 * skipped one are then stored identically — `scoreStances` reads both as an
 * empty array — so «I have not worked that out» could only ever have been
 * inferred from an absence that also means «I got bored». The slot was paid for
 * by dropping a `standing` option that duplicated `work-purpose = standing` and
 * that, capped at two against five more comfortable answers, would have been
 * ticked by almost nobody. `docs/banks/OUTSTANDING.md` §2 records the
 * underlying gap: every multi in every inventory pays this tax.
 *
 * ── The four at the end ───────────────────────────────────────────────
 *
 * `OPEN_ITEMS` are not stance blocks and are not expanded by `stanceItems`,
 * which only knows how to grow a `choice` or a `multi` into a triad. They are
 * plain `text` items, written out below and concatenated in `spec.ts`.
 * `docs/banks/OUTSTANDING.md` §3 records that this needs no platform change:
 * `registry.validate()` already requires every `text` item to carry
 * `tier: "private"`, which is exactly what these want.
 *
 * The words are all in `i18n/`. Nothing below is reader-facing.
 */

/**
 * The six sections the closed blocks are asked in.
 *
 * Ids only: the title and the note under it are copy and live in `i18n/`. The
 * order is load-bearing twice over — it is the order the blocks are declared
 * in, and `spec.ts` sizes a page against it.
 *
 * `section.<id>.note` is copy in the strongest sense. `sectionHeader` in
 * `components/runner/runner.tsx` paints it above the questions of every page,
 * and `View.tsx` paints it again over every section of the result, so somebody
 * answering the money questions meets it twice. That went wrong once and
 * badly: all seven were written as implementer memos — backticked block ids, a
 * path into this repo's runner, and 1224 characters of argument with an earlier
 * draft — and two translators carried them faithfully into Spanish and German,
 * correctly, because the English was the contract. The argument in them was
 * worth keeping and is below. What a reader needs in its place is one to three
 * sentences saying what the section covers and how to answer it, which is what
 * the other seven banks do and what `test/i18n/section-copy.test.ts` now
 * requires.
 *
 * ── Why they are in this order ────────────────────────────────────────
 *
 * `work` first, because it is the least tender subject in the instrument and
 * because what the work is *for* changes how every later answer about money
 * reads. `learn-next` sits in it rather than in a growth section of its own, on
 * purpose: its most interesting option is the one that declines growth, and a
 * section named for growth would make declining it read as the odd answer out.
 *
 * `place` is two blocks rather than one because where a person lives and who is
 * near them come apart constantly. Somebody can be certain about the city and
 * indifferent about who is in it, or the reverse, and a single «where do you
 * want your life» block would flatten that into one answer nobody could act on.
 *
 * `later` is last of the closed six. `regret-most` is the twelfth block, so
 * eleven positions have been stated before anybody is asked which absence would
 * sting — which is the only order in which that question is answerable rather
 * than theatrical. It carries an explicit «None of these» because a person who
 * would regret none of them had no honest answer in the first draft and would
 * have had to invent one, and it leads into the open section rather than
 * closing the instrument.
 *
 * They are 2, 3, 2, 2, 2 and 1 blocks long, which is a fact `spec.ts` has to
 * spend a paragraph on rather than an arithmetic expression.
 *
 * The seventh section the bank declares is not here, and that is deliberate
 * rather than an omission: `open` has no blocks in it at all. Listing it beside
 * these would make the View draw a heading over a `BLOCKS.filter` that returns
 * nothing, on a page whose real contents — four answers with no options behind
 * them — are drawn from `answers` and not from the result.
 */
export const SECTIONS = ["work", "money", "place", "week", "keep", "later"] as const;
export type SectionId = (typeof SECTIONS)[number];

/** The seventh, which the four open items are the whole of. */
export const OPEN_SECTION = "open";

/**
 * The twelve, declared in section order.
 *
 * Eight are a `choice` and four are a `multi`. Each multi is capped, and the
 * cap is what makes it a question rather than a shopping list: everybody would
 * say every one of `who-near`'s six matters, and almost nobody would stay in a
 * town for all six, so two is what turns it into a trade. `health-effort` is
 * capped at three rather than two because it records what is *already* being
 * given up, and a person doing four things is not exaggerating.
 *
 * ── What each of them had to be re-cut into ───────────────────────────
 *
 * `enough-point` is deliberately not a question about an amount of money. It
 * asks for the stopping condition, which is a different thing from what money
 * is for, and a block that asked for a number would collect one and mean
 * nothing by it.
 *
 * `risk-appetite` is a containment ladder rather than a mixed list. Its first
 * option set crossed magnitude (savings, years, everything) with scope
 * (whatever is mine alone), so a single person with nobody depending on them
 * had two true answers and no way to pick between them — a coin-flip the block
 * would then have reported as a position. The distinction the mixed list was
 * reaching for, caution against responsibility, is recovered from where a
 * person stops on the ladder instead: anyone stopping before «Years of lower
 * income for the household» is protecting somebody else.
 *
 * `live-where` is one dimension, distance from where the reader is now, for the
 * same reason. Mixing density (a big city, somewhere quiet) with country
 * (abroad) gave anybody who wants a large city in another country two true
 * answers. Density was the more evocative half and the less actionable one, and
 * the block exists to say in advance whether a move is an opportunity or an
 * ending — which is a distance question. `who-near` was rewritten beside it
 * because «who has to be within reach» collected the same three ticks from
 * everybody with a family and therefore told a reader nothing; «Who would you
 * stay here for» is the same subject asked as a decision.
 *
 * `keep-one` is the hardest block here and is a single `choice` on purpose. A
 * multi would let everybody keep everything, which is the answer that costs
 * nothing to give and tells a reader nothing. It is framed as keeping one
 * rather than as never trading, which was the earlier version: «what would you
 * not trade» is a values statement with an obvious free answer, and almost
 * every reader knows before answering that they will say health. Keeping
 * exactly one makes health compete on level terms with the people you live with
 * and with control of your own hours, so the answer is a decision instead of a
 * sentiment, and the block stops failing the alone test.
 *
 * `health-effort` asks what is already being paid rather than what is intended.
 * «What are you willing to do to stay healthy» collects an aspiration, «What
 * are you giving up now» collects a fact, and the weight question underneath is
 * where the aspiration belongs. `less-of` deliberately does not do that — it
 * asks about next year, which is an intention — and it earns its place as the
 * one block that names what this person would cut first rather than what they
 * are already cutting. A section note claimed for a while that both blocks
 * asked the first question. They do not, and that is the shape of the mistake:
 * a memo about the bank is a thing that can quietly stop being true about it.
 *
 * No `grounds` anywhere. The bank refused a grounds list on the reasoning that
 * grounds pay for themselves only where the same small set of authorities
 * recurs across blocks in a comparable way — which is why the design gives them
 * to `faith` and to nothing else. Here the honest answer to «on what grounds»
 * is biography: a parent, a death, a job that went wrong. Biography is prose,
 * it belongs in the `why` where it already is, and closing it into six options
 * would trade a real answer for a comparable one.
 *
 * Nothing is `private` and nothing is `skipWeight`. Every block asks the weight
 * because the weight is the whole point of the format here — two people who
 * both put 9 on where they want to be living in ten years and answer it
 * differently have found the evening's conversation, and two who differ at 9
 * and 2 have found which of them has been quietly conceding a country.
 *
 * The block that would have been private is not a block. `open-avoid` is a
 * `text` item, private by kind, and it is why this instrument is `sensitive`.
 */
export const BLOCKS: readonly StanceBlock[] = [
  { id: "work-purpose", kind: "choice", section: "work", options: ["income", "craft", "service", "standing", "structure", "undecided"] },
  { id: "learn-next", kind: "choice", section: "work", options: ["trade", "newskill", "people", "temper", "nothing", "unknown"] },

  {
    id: "money-for",
    kind: "multi",
    max: 2,
    exclusive: ["undecided"],
    section: "money",
    options: ["safety", "freedom", "provide", "now", "give", "undecided"],
  },
  { id: "enough-point", kind: "choice", section: "money", options: ["number", "nodebt", "hours", "never", "already", "unknown"] },
  { id: "risk-appetite", kind: "choice", section: "money", options: ["nothing", "months", "savings", "income", "house", "unsure"] },

  { id: "live-where", kind: "choice", section: "place", options: ["here", "near", "country", "abroad", "movable", "undecided"] },
  {
    id: "who-near",
    kind: "multi",
    max: 2,
    exclusive: ["nobody"],
    section: "place",
    options: ["partner", "children", "parents", "friends", "community", "nobody"],
  },

  {
    id: "health-effort",
    kind: "multi",
    max: 3,
    exclusive: ["nothing"],
    section: "week",
    options: ["nothing", "sleep", "drink", "training", "spend", "checks"],
  },
  { id: "less-of", kind: "choice", section: "week", options: ["hours", "obligations", "debt", "screen", "noise", "nothing"] },

  { id: "keep-one", kind: "choice", section: "keep", options: ["health", "people", "voice", "time", "standard", "unknown"] },
  {
    id: "owe-others",
    kind: "multi",
    max: 2,
    exclusive: ["nothing"],
    section: "keep",
    options: ["nothing", "money", "time", "parents", "useful-work", "local"],
  },

  { id: "regret-most", kind: "choice", section: "later", options: ["children", "venture", "place", "mend", "body", "none"] },
];

/**
 * The four with no options, and the only ones of their kind in the app.
 *
 * Every block above already carries open space in its `why`. What this section
 * adds is a question with no closed answer at all — a letter to yourself at
 * seventy, the one thing that would make the next five years count, what you
 * would want the people who knew you best to say, and what you are avoiding.
 *
 * They are declared — here, and as `openItems` in the bank — rather than
 * described in a section's prose, which is where they lived in the first draft.
 * The words are then data: `test/i18n/readability.test.ts` counts the four
 * prompts against the same 80-character and 14-word gates as the twelve closed
 * ones, and a question hidden inside a paragraph is a question no gate can see.
 *
 * They are plain items and not stance blocks, so `skipWeight` does not apply to
 * them — there is no weight question here to skip — and the runner exempts
 * every `text` item from blocking Next whatever the form declares, which is why
 * `optional: true` in `spec.ts` is about the twelve and not about these.
 *
 * `rows` is the whole of the design here and it is not decoration. The letter
 * gets eight because a box the size of a sentence collects a sentence, and the
 * question is asking for a page. The other three get four. The last one is four
 * words long — «What are you avoiding?» — because every extra word offers a way
 * to answer a gentler question, and it is the reason this instrument is
 * `sensitive`: it is the one place in the eight banks where the answer is an
 * admission the reader made to themselves.
 *
 * They are never scored, never compared and never shared. That is three facts
 * rather than one, and each is held somewhere different. Never scored:
 * `score()` is `scoreStances(BLOCKS, answers)` and `BLOCKS` does not contain
 * them, so they are absent from the result rather than filtered out of it.
 * Never shared: `tier: "private"` and `packAnswers` strips on the tier — and
 * `registry.validate()` refuses any `text` item that does not carry it, so this
 * cannot be forgotten in a later edit. Never compared: `compareStances` walks
 * the blocks, and they are not blocks.
 *
 * They produce no instruction card either. §4 of the decisions spec says so in
 * one clause — «`openItems` produce no cards» — and the mechanism is the same
 * as everything else here: `instructions()` builds from block ids through
 * `cardable`, and an id that is not a declared block is dropped.
 *
 * Which is the fourth fact, and the one the copy got backwards. `section.open.note`
 * told the reader for a while that these four were «printed on the sheet»,
 * while `spec.ts` said the opposite in the same repo — «The four open items
 * produce nothing here» — and the sheet is the artefact you hand to somebody
 * else. Of the two directions a promise about private writing can be wrong in,
 * that is the worse one: a reader who believed it either wrote less than they
 * meant to or handed over more than they meant to. The note now states the four
 * the code actually holds — not scored, not compared, never in a share link, no
 * card — and nothing about where the writing goes, because it goes nowhere. The
 * result page is the one place it is drawn, from `answers`, by `View.tsx`.
 */
export type OpenItem = { id: string; rows: number };

export const OPEN_ITEMS: readonly OpenItem[] = [
  { id: "open-letter", rows: 8 },
  { id: "open-five", rows: 4 },
  { id: "open-said", rows: 4 },
  { id: "open-avoid", rows: 4 },
];

/**
 * One suggested line, and the answer it is derived from.
 *
 * `from` is copied verbatim from the bank in the bank's own notation —
 * `block = value | value` — so the two files can be diffed by eye. It is parsed
 * once, in `spec.ts`, and never read as a string anywhere else.
 *
 * The text is in `i18n/` under `playbook.<id>`. The id is what the reader's
 * ticks are stored against, so it is the bank's id unchanged: renaming one
 * silently unticks a sentence somebody had endorsed.
 */
export type Derivation = { id: string; from: string };

/**
 * Thirty OK lines and twenty-three not-OK ones, which is not what one reader
 * sees.
 *
 * The design's target of eight to fourteen a side is a target for the page, not
 * a cap on the bank, because the same design requires the lines to be derived
 * from the result. No option fires more than one line per side, so a reader who
 * answers all twelve substantively sees at most twelve and twelve, and one who
 * takes several of the escapes sees fewer.
 *
 * Several options fire no line at all, and every one of them is an escape or an
 * answer with no request inside it: «I have not worked that out», «I have never
 * set a point», «I do not know until it is in front of me». There is no
 * sentence anybody could be held to behind those, and inventing one would hand
 * a reader a commitment they did not make. Two lines do fire from a withdrawal
 * rather than a want — `ok-stop-offering-growth` from `learn-next = nothing`
 * and `ok-safe-version-first` from `risk-appetite = nothing` — and both earn
 * it, because «stop putting me forward for one» is a request a person can be
 * handed unedited.
 */
export const PLAYBOOK_OK: readonly Derivation[] = [
  { id: "ok-harder-not-bigger", from: "work-purpose = craft" },
  { id: "ok-money-not-title", from: "work-purpose = income" },
  { id: "ok-name-who-benefits", from: "work-purpose = service" },
  { id: "ok-give-me-fixed-hours", from: "work-purpose = structure" },
  { id: "ok-stop-offering-growth", from: "learn-next = nothing" },
  { id: "ok-put-me-in-hard-talks", from: "learn-next = people" },
  { id: "ok-tell-me-when-i-snapped", from: "learn-next = temper" },
  { id: "ok-ask-before-buffer", from: "money-for = safety" },
  { id: "ok-shorter-week-first", from: "money-for = freedom" },
  { id: "ok-book-it-now", from: "money-for = now" },
  { id: "ok-ask-me-for-something-specific", from: "money-for = give" },
  { id: "ok-no-is-not-modesty", from: "enough-point = already" },
  { id: "ok-price-it-in-hours", from: "enough-point = hours" },
  { id: "ok-risk-stops-at-my-savings", from: "risk-appetite = savings" },
  { id: "ok-safe-version-first", from: "risk-appetite = nothing" },
  { id: "ok-ask-me-to-move", from: "live-where = movable" },
  { id: "ok-find-the-version-that-stays", from: "live-where = here" },
  { id: "ok-bring-me-the-other-city", from: "who-near = nobody" },
  { id: "ok-dates-early-for-parents", from: "who-near = parents" },
  { id: "ok-early-not-late", from: "health-effort = sleep" },
  { id: "ok-either-side-of-lunch", from: "health-effort = training" },
  { id: "ok-cut-something", from: "less-of = hours" },
  { id: "ok-ask-before-my-name", from: "less-of = obligations" },
  { id: "ok-ask-what-i-think", from: "keep-one = voice" },
  { id: "ok-deadline-not-hours", from: "keep-one = time" },
  { id: "ok-call-me-to-show-up", from: "owe-others = time" },
  { id: "ok-tell-me-the-street-needs-it", from: "owe-others = local" },
  { id: "ok-tell-me-about-the-opening", from: "regret-most = venture" },
  { id: "ok-say-if-i-have-gone-quiet", from: "regret-most = mend" },
  { id: "ok-leave-me-out-of-the-thread", from: "less-of = noise" },
];

export const PLAYBOOK_NOT_OK: readonly Derivation[] = [
  { id: "not-reassign-my-work", from: "work-purpose = craft" },
  { id: "not-title-instead-of-money", from: "work-purpose = income" },
  { id: "not-remove-the-hours", from: "work-purpose = structure" },
  { id: "not-unasked-development", from: "learn-next = nothing" },
  { id: "not-spend-the-buffer", from: "money-for = safety" },
  { id: "not-assume-my-income", from: "money-for = provide" },
  { id: "not-tell-me-i-have-enough", from: "enough-point = never" },
  { id: "not-laugh-at-the-target", from: "enough-point = number" },
  { id: "not-stake-what-i-depend-on", from: "risk-appetite = nothing" },
  { id: "not-talk-me-out-of-it", from: "risk-appetite = house" },
  { id: "not-assume-i-will-move", from: "live-where = here" },
  { id: "not-assume-i-will-stay", from: "live-where = movable" },
  { id: "not-book-my-parent-weekends", from: "who-near = parents" },
  { id: "not-two-weekends-running", from: "who-near = children" },
  { id: "not-press-the-drink", from: "health-effort = drink" },
  { id: "not-joke-about-checkups", from: "health-effort = checks" },
  { id: "not-volunteer-me", from: "less-of = obligations" },
  { id: "not-message-me-late", from: "less-of = screen" },
  { id: "not-fill-my-calendar", from: "keep-one = time" },
  { id: "not-every-evening-out", from: "keep-one = people" },
  { id: "not-sign-me-up-locally", from: "owe-others = nothing" },
  { id: "not-joke-about-children", from: "regret-most = children" },
  { id: "not-ring-me", from: "less-of = noise" },
];
