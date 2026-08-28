import type { StanceBlock } from "@/core/stance";

/**
 * Twelve household positions, written down while nothing is on fire.
 *
 * There is no instrument behind this one and there could not be. What you
 * would lend a brother, and how late is too late before you want a message,
 * are not psychological constructs — they are facts about how you live, and
 * the only person who can state them is the one answering. The word
 * «boundary» arrives here from family systems theory, where it describes
 * where one part of a family stops and another begins, and from a self-help
 * literature with no outcome study worth citing; it is used as ordinary
 * English with nothing claimed for it. `provenance.ts` names the four
 * copyrighted scales this takes nothing from.
 *
 * ── The rule that decides what is not here ────────────────────────────
 *
 * Everything a reader writes here is either a statement about their own
 * conduct or a request, and a request is something the other person is free
 * to decline. That single rule is why no block asks the reader to set a rule
 * over another adult: not who they may see, not who they may write to, not
 * where they are. The bank's `rejected` list is long and specific about it —
 * «Who may your partner text late at night?», «Do you know your partner's
 * passcode?», «Whose location is shared with whom?» were each refused, and
 * the CPS and Home Office guidance on controlling or coercive behaviour under
 * s.76 of the Serious Crime Act 2015 is cited there for what it says must not
 * be *collected*, never as something to assess anybody against.
 *
 * The same reasoning killed the two blocks that would have made this a
 * screen: «Has anyone ever ignored a boundary you set?» collects an incident
 * rather than a position and turns into a distress flag in a field that can
 * be shared with the person it is about, and a closing «has any of this been
 * a problem?» is a screen with a friendlier name. Nothing here is flagged,
 * scored for distress, or interpreted back at the reader.
 *
 * ── «Not something I decide» ──────────────────────────────────────────
 *
 * Two blocks — `unannounced-visit` and `things-read` — carry that option so
 * that a person for whom the arrangement is not an arrangement has a true
 * answer available, one that reads innocuously to anyone else who sees the
 * screen. It is wired to produce no playbook line on either side. That is the
 * load-bearing half: a page that turned «my parent has a key against my
 * wishes» into a sentence beginning «Let yourself in» would have written the
 * reader's compliance down as their preference and handed it over. The same
 * argument deleted an OK line derived from `volunteered = doIt` — silent
 * compliance is not consent, this instrument cannot tell the difference, and
 * inferring contentment from it is the one estimation that does real damage.
 *
 * The words are all in `i18n/`. Nothing below is reader-facing.
 */

/**
 * The four sections, in the order they are asked.
 *
 * Ids only: the title and the note under it are copy and live in `i18n/`. The
 * order is load-bearing twice over — it is the order the blocks are declared
 * in, and `spec.ts` sizes a page against it.
 *
 * They are 3, 4, 2 and 3 blocks long, which is a fact `spec.ts` has to spend
 * a paragraph on rather than an arithmetic expression.
 */
export const SECTIONS = ["home", "people", "body", "yours"] as const;
export type SectionId = (typeof SECTIONS)[number];

/**
 * The twelve, declared in section order.
 *
 * Eleven are a `choice` and one is not. `friend-rude` is a `multi` with
 * `max: 2` because answering a friend's cruelty in the room and seeing less
 * of them afterwards are both true of the same person, and a single-select
 * makes them donate one to the other. That is only honest because `exclusive`
 * exists: «Nothing — I let it go» and «It has not happened» cannot be held
 * beside a third answer, and before the platform could say so the block was
 * demoted to a `choice` to stop a reader stating the contradiction. The
 * escape is named here and the control enforces it; a label written to read
 * as terminal is a mitigation rather than a fix.
 *
 * No `grounds` anywhere. The bank refused a grounds list on the reasoning
 * that it is a *shared* field: an option reading «something that happened to
 * me before» would be a packable, forwardable marker sitting next to a named
 * person's household arrangements. The reason belongs in the `why` box, which
 * is private by construction and is the reader's own sentence rather than one
 * of six we chose for them.
 *
 * Nothing is `private` and nothing is `skipWeight`. The weight is the whole
 * point of a block here — two people who both want the door knocked on and
 * rate it 9 have found nothing to discuss, and two who differ at 9 and 2 have
 * found which of them has been conceding.
 */
export const BLOCKS: readonly StanceBlock[] = [
  { id: "unannounced-visit", kind: "choice", section: "home", options: ["nobody", "parent", "family", "anyone", "notMine", "never"] },
  { id: "closed-door", kind: "choice", section: "home", options: ["nobody", "knockWait", "knockIn", "openHouse", "never"] },
  { id: "lateness", kind: "choice", section: "home", options: ["always", "ten", "thirty", "hour", "never"] },

  { id: "partner-ex-friend", kind: "choice", section: "people", options: ["nothing", "toKnow", "told", "met", "hard", "unknown"] },
  { id: "own-ex-contact", kind: "choice", section: "people", options: ["sayFirst", "replyThenSay", "replyQuiet", "noReply", "blocked", "never"] },
  {
    id: "friend-rude",
    kind: "multi",
    max: 2,
    exclusive: ["nothing", "notHappened"],
    section: "people",
    options: ["thereAndThen", "after", "tellThem", "nothing", "distance", "notHappened"],
  },
  { id: "told-outside", kind: "choice", section: "people", options: ["nobody", "onePerson", "friends", "family", "anyone", "undecided"] },

  { id: "public-touch", kind: "choice", section: "body", options: ["none", "hand", "kiss", "anything", "depends"] },
  { id: "woken", kind: "choice", section: "body", options: ["never", "emergency", "today", "anything", "depends"] },

  { id: "things-read", kind: "choice", section: "yours", options: ["nobody", "ask", "partner", "notMine", "never"] },
  { id: "money-family", kind: "choice", section: "yours", options: ["discussFirst", "dayPay", "weekPay", "monthPay", "whatever", "neverLend"] },
  { id: "volunteered", kind: "choice", section: "yours", options: ["sayNo", "pullOut", "sayLater", "doIt", "notHappened"] },
];

/**
 * One suggested line, and the answer it is derived from.
 *
 * `from` is copied verbatim from the bank in the bank's own notation —
 * `block = value | value` — so the two files can be diffed by eye. It is
 * parsed once, in `spec.ts`, and never read as a string anywhere else.
 *
 * The text is in `i18n/` under `playbook.<id>`. The id is what the reader's
 * ticks are stored against, so it is the bank's id unchanged, punctuation and
 * all: renaming one silently unticks a sentence somebody had endorsed. That
 * is why `no-lend-then-tell` keeps its hyphens among fourteen dotted
 * siblings — it arrived here from `money-management` when that bank's
 * `family-lending` block was cut, and the id is the thing it travelled with.
 */
export type Derivation = { id: string; from: string };

/**
 * Fourteen OK lines and fifteen not-OK ones, which is not what one reader
 * sees.
 *
 * The design's target of eight to fourteen a side is a target for the page,
 * not a cap on the bank, because the same design requires the lines to be
 * derived from the result. A reader who answers all twelve substantively sees
 * at most eleven and thirteen — no block fires more than one OK line, and
 * only `money-family = discussFirst` fires two on the not-OK side, where the
 * second is the specific one the first does not cover.
 *
 * Coverage is deliberate rather than exhaustive. Every option that describes
 * something a person does fires at least one line; the ones that fire nothing
 * are the honest escapes — «It has never come up», «I do not know yet», «I
 * have not decided» — and the two `notMine` answers, which are not escapes at
 * all but the safety option, and are silent for the reason given at the head
 * of this file.
 */
export const PLAYBOOK_OK: readonly Derivation[] = [
  { id: "ok.door.open", from: "unannounced-visit = parent | family | anyone" },
  { id: "ok.door.hour", from: "unannounced-visit = nobody | never" },
  { id: "ok.doorclosed.knock", from: "closed-door = knockIn | openHouse" },
  { id: "ok.late.relax", from: "lateness = hour | never" },
  { id: "ok.late.line", from: "lateness = thirty" },
  { id: "ok.ex.theirs", from: "partner-ex-friend = nothing | toKnow" },
  { id: "ok.myex.reply", from: "own-ex-contact = replyQuiet | replyThenSay" },
  { id: "ok.myex.ask", from: "own-ex-contact = sayFirst" },
  { id: "ok.friend.push", from: "friend-rude = thereAndThen | tellThem" },
  { id: "ok.told.talk", from: "told-outside = friends | family | anyone" },
  { id: "ok.touch.street", from: "public-touch = kiss | anything" },
  { id: "ok.wake.me", from: "woken = anything | today" },
  { id: "ok.things.open", from: "things-read = partner" },
  { id: "ok.money.lend", from: "money-family = weekPay | monthPay | whatever" },
];

export const PLAYBOOK_NOT_OK: readonly Derivation[] = [
  { id: "no.door.message", from: "unannounced-visit = nobody | never" },
  { id: "no.doorclosed.open", from: "closed-door = nobody | knockWait" },
  { id: "no.late.silence", from: "lateness = always | ten" },
  { id: "no.ex.afterwards", from: "partner-ex-friend = told | met" },
  { id: "no.ex.pretend", from: "partner-ex-friend = hard" },
  { id: "no.myex.number", from: "own-ex-contact = noReply | blocked" },
  { id: "no.friend.jokes", from: "friend-rude = thereAndThen | after | distance" },
  { id: "no.told.story", from: "told-outside = nobody | onePerson" },
  { id: "no.touch.colleagues", from: "public-touch = hand | depends" },
  { id: "no.touch.any", from: "public-touch = none" },
  { id: "no.wake.morning", from: "woken = never | emergency" },
  { id: "no.things.out", from: "things-read = nobody | ask" },
  { id: "no.money.promise", from: "money-family = discussFirst | dayPay | neverLend" },
  { id: "no-lend-then-tell", from: "money-family = discussFirst" },
  { id: "no.volunteer.yes", from: "volunteered = sayNo | pullOut | sayLater | doIt" },
];
