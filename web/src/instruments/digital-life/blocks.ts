import type { StanceBlock } from "@/core/stance";

/**
 * Twelve household rules about phones, publication and what is kept.
 *
 * No validated instrument sits behind this one because none exists. Four
 * separate literatures were read to decide which twelve questions were worth
 * asking — partner phubbing and technoference, sharenting, electronic partner
 * surveillance, and digital legacy — and none of them supplies a questionnaire
 * this bank uses. The research chose the subjects. It says nothing whatever
 * about anybody's answers, and neither does this file.
 *
 * That distinction is the whole licence position and it is also the honest
 * description, so it is worth putting the sizes here rather than leaving them
 * in the `sourceNote` where only a reader sees them. The partner-phubbing
 * meta-analysis (Ni and colleagues, Frontiers in Psychology, 2025) puts the
 * association between feeling phubbed and relationship satisfaction at
 * r = −0.22 across 30 samples and 9,040 people — real, small, and almost
 * entirely cross-sectional, so it cannot say which way it runs. The dyadic
 * diary study (Carnelley, Vowels, Stanton, Millings and Hart, Computers in
 * Human Behavior 147, 2023) found the effect attaches to the *perception*: a
 * partner's own reported phone use predicted nothing, feeling phubbed
 * predicted lower relationship quality on the day, and that day-level effect
 * did not hold two months later. On sharenting the reviewed harms are
 * documented and the studies are small and largely descriptive; in one survey
 * of 1,460 Czech and Spanish parents around four in five had posted pictures
 * of their child and around one in five had asked the child first. For group
 * chats, for what should never be typed at all, and for what people want done
 * with their accounts afterwards there is no useful evidence at all — those
 * three are here because they get settled by default, not because anything is
 * known about them.
 *
 * Nothing in this file, in `spec.ts` or in `View.tsx` may state any of that at
 * a larger size than it is written above, and nothing may state it about a
 * reader. `provenance.ts` carries the same record with its sources.
 *
 * ── The three multis are restrictive, and inverting one inverts a playbook ──
 *
 * `posted-about-me`, `group-chats` and `not-in-writing` all ask what may
 * **not** happen. A ticked option therefore generates a prohibition and the
 * floor option — `none`, the one exclusive value in each — generates the
 * permission. The bank's `rejected` list records this as the worst defect it
 * had and the reason it is written down here rather than left to read
 * naturally:
 *
 *   > A permissive framing for posted-about-me and group-chats — "what may be
 *   > posted", "what may be repeated" … reads more naturally, and it inverts
 *   > every not-OK line derived from it: ticking "whereabouts" would mean
 *   > whereabouts may be posted, while the line generated from it said do not
 *   > post where I am.
 *
 * So `no-post-where-i-am` fires on `posted-about-me = whereabouts` and says
 * *do not post where I am*, and `ok-post-me-unasked` fires on the floor option
 * and says *post the photograph of me if you like it*. Reword any of the three
 * prompts towards permission and every derivation below it means its opposite,
 * silently, with the page still rendering perfectly. The same `rejected` entry
 * killed a ceiling option — "Any of it, I do not mind" — because in a multi it
 * says exactly what ticking nothing says and lets a reader tick "screenshots"
 * and "any of it" at once. Each multi has one floor and no ceiling.
 *
 * ── The one person in this bank who is not answering ──────────────────
 *
 * `children-online` is the only block whose subject cannot answer for
 * themselves, and it is a single ladder of reach and identifiability rather
 * than three rules at once — an audience rule, a content rule and a consent
 * rule were all in it and a parent can hold all three, which forced a false
 * answer on the highest-stakes question here. The child's own veto survives as
 * a playbook line (`ok-ask-the-child`) rather than as a block, and the bank
 * says why: it is a second axis on the same subject, and a photograph's reach
 * cannot be undone while a missed veto can still be honoured later.
 *
 * ── What is deliberately not asked ────────────────────────────────────
 *
 * Nothing estimated — no "how many hours a day do you spend on your phone",
 * because self-reported screen time is a poor match to logged use and the
 * number would measure self-image. Nothing self-diagnosed — no "is your phone
 * use out of control", which would drag in the addiction scales this bank has
 * not touched. Nothing hypothetical — no "would you look at your partner's
 * phone if you suspected something", because the answer collected would be
 * aspirational; `reading-messages` asks the same ground as a rule that holds
 * today. And nothing about a third party, because "who may you follow or stay
 * in contact with online" cannot be answered without naming other people in a
 * `why` box. The full list with reasons is the bank's `rejected` array.
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
 * Three blocks each, but not the same number of *items* each, because the
 * grounds list falls unevenly across them. `spec.ts` spends a paragraph on the
 * arithmetic that follows from that.
 */
export const SECTIONS = ["attention", "visibility", "access", "permanence"] as const;
export type SectionId = (typeof SECTIONS)[number];

/**
 * What a position rests on, offered whole to the five blocks that take it.
 *
 * One flat list rather than a per-block one, because the words are looked up
 * by `stance.grounds.<value>` and not by block — which is the entire point of
 * the field. "Somebody else has not agreed to it" has to be the same phrase
 * under every question or two answers cannot be read as the same ground, and a
 * reader whose location rule rests on safety and whose message rule rests on
 * privacy has said something the weight question cannot say for them.
 *
 * The five are the ones where authority is genuinely separate from strength of
 * feeling: when work may reach you, how far a child's photograph may travel,
 * who may see where you are, who may read your messages, and what may happen
 * to intimate photographs. The other seven are asked without grounds because
 * the answer is a description of an arrangement rather than a claim needing
 * one.
 *
 * `obligation` — "My work or the law requires it" — is load-bearing on
 * `work-after-hours`. The bank refused "Whenever my job expects it" as an
 * *option* there, because that records the employer's expectation rather than
 * the person's position and puts an obligation into a permission ladder; the
 * grounds list is what carries it instead, which is what that ground was
 * written for.
 */
const GROUNDS = ["safety", "consent", "experience", "privacy", "trust", "obligation", "not-worked-out"];

/**
 * "I have not worked that out" cannot be held beside "Safety".
 *
 * The bank does not carry a `groundsExclusive` field — its `grounds` is a flat
 * `true` on the five blocks that take the list — so this is declared here, and
 * it is declared rather than left off because a grounds multi with an escape
 * that does not escape is the exact fault `MultiItem.exclusive` exists for. A
 * reader can otherwise tick a ground and the admission that there is none, and
 * the app stores, prints and compares the contradiction as a position they
 * stated. See the note on `StanceBlock.groundsExclusive` in `core/stance.ts`,
 * and `money-management/blocks.ts`, which reached the same conclusion first.
 */
const GROUNDS_ESCAPE = ["not-worked-out"];

/**
 * The twelve, declared in section order.
 *
 * Nine are a `choice` and three are a `multi`. Every multi carries an
 * `exclusive` floor, because a checkbox list clears nothing on its own and the
 * floor option in each of the three is the one that generates the *permission*
 * — a reader who could hold it beside a prohibition would be stating a
 * contradiction in the one direction that matters most here.
 *
 * No `max` on any of them. A cap stops a reader adding and never stops them
 * removing, and on a restrictive multi a cap is worse than useless: somebody
 * who does not want four things posted about them has four prohibitions, not
 * a ranked two, and truncating that list would publish the difference.
 *
 * Nothing is `private` and nothing is `skipWeight`. `intimate-images` was
 * considered for `private` and refused in §3.1 of the decisions spec: it asks
 * for a rule about handling rather than an admission about conduct, and
 * `sensitive` plus `maxAudience: "partner"` is right-sized for it. Every
 * private block costs the comparison a `withheld` case, and they are spent one
 * at a time. The weight is the whole point of a block here besides — two
 * people who both want phones out of the room and rate it 9 have found nothing
 * to discuss, and two who differ at 9 and 2 have found which of them has been
 * conceding.
 */
export const BLOCKS: readonly StanceBlock[] = [
  { id: "phone-at-meals", kind: "choice", section: "attention", options: ["out-of-room", "silent-away", "face-down", "used-freely", "no-rule"] },
  { id: "reply-window", kind: "choice", section: "attention", options: ["hours", "same-day", "day-or-more", "urgent-only", "never", "undecided"] },
  { id: "work-after-hours", kind: "choice", section: "attention", grounds: GROUNDS, groundsExclusive: GROUNDS_ESCAPE, options: ["never", "cannot-wait", "any-evening", "any-time", "no-work", "undecided"] },

  /** Restrictive. `none` is the floor and the only permission this block gives. */
  { id: "posted-about-me", kind: "multi", exclusive: ["none"], section: "visibility", options: ["photos", "full-name", "whereabouts", "relationship", "none"] },
  { id: "children-online", kind: "choice", section: "visibility", grounds: GROUNDS, groundsExclusive: GROUNDS_ESCAPE, options: ["nothing", "private-only", "closed-account", "public-no-identifiers", "public-open", "undecided"] },
  /** Restrictive. See the header: ticking `health` forbids repeating it. */
  { id: "group-chats", kind: "multi", exclusive: ["none"], section: "visibility", options: ["screenshots", "arguments", "health", "money", "none"] },

  { id: "passwords", kind: "choice", section: "access", options: ["none", "shared-accounts", "shared-plus-passcode", "emergency-all", "all-any-time", "undecided"] },
  { id: "location", kind: "choice", section: "access", grounds: GROUNDS, groundsExclusive: GROUNDS_ESCAPE, options: ["nobody", "only-when-i-send", "travelling", "one-person-always", "household-always", "undecided"] },
  { id: "reading-messages", kind: "choice", section: "access", grounds: GROUNDS, groundsExclusive: GROUNDS_ESCAPE, options: ["nobody", "if-incapable", "handed-over", "ask-first", "one-person-anytime", "undecided"] },

  { id: "intimate-images", kind: "choice", section: "permanence", grounds: GROUNDS, groundsExclusive: GROUNDS_ESCAPE, options: ["none", "deleted", "my-device", "no-cloud", "anywhere", "rather-not"] },
  /** Restrictive, and was already so before the other two were flipped to match. */
  { id: "not-in-writing", kind: "multi", exclusive: ["none"], section: "permanence", options: ["apology", "end-of-argument", "health-news", "money-decision", "criticism", "none"] },
  { id: "accounts-after-death", kind: "choice", section: "permanence", options: ["nothing", "photographs", "no-messages", "as-it-is", "undecided"] },
];

/**
 * One suggested line, and the answer it is derived from.
 *
 * `from` is copied verbatim from the bank in the bank's own notation —
 * `block = value | value` — so the two files can be diffed by eye. It is
 * parsed once, in `spec.ts`, and never read as a string anywhere else.
 *
 * The text is in `i18n/` under `playbook.<id>`. The id is what the reader's
 * ticks are stored against, so it is the bank's id unchanged, hyphens and all:
 * renaming one silently unticks a sentence somebody had endorsed.
 */
export type Derivation = { id: string; from: string };

/**
 * Twenty-two OK lines and twenty-six not-OK ones, which is not what one reader
 * sees.
 *
 * The design's target of eight to fourteen a side is a target for the page,
 * not a cap on the bank, because the same design requires the lines to be
 * derived from the result. On the nine `choice` blocks no option fires more
 * than one line per side. The three restrictive multis are where a reader can
 * earn several at once, and that is the point of them: four ticks on
 * `posted-about-me` are four separate prohibitions somebody has to be able to
 * read one at a time, not one summarised instruction.
 *
 * Coverage is deliberate rather than exhaustive. The options that fire nothing
 * are the honest escapes — "I have not thought about it", "I have not decided
 * this", "I would rather not answer this", "My work has no way to reach me" —
 * where there is no sentence anybody could be held to. `phone-at-meals`
 * has no escape and its `no-rule` option is not one: "I have no rule about
 * this" is a stated position, so it fires `ok-phone-out-at-dinner` alongside
 * `used-freely`.
 *
 * Two derivations are worth reading twice. `ok-delete-on-request` fires on
 * *every* substantive answer to `intimate-images`, including `none` and
 * `anywhere`, because a request to delete is one nobody's answer to that
 * question makes unreasonable. And `ok-name-me-legacy-contact` fires on every
 * answer to `accounts-after-death` for the same reason in reverse: the bank
 * refused a thirteenth block asking whether the reader has already set a
 * legacy contact — it mixes what you want with what you have done — and put
 * the next step here, where it is actionable, instead.
 */
export const PLAYBOOK_OK: readonly Derivation[] = [
  { id: "ok-phone-in-another-room", from: "phone-at-meals = out-of-room | silent-away" },
  { id: "ok-glance-if-you-say-so", from: "phone-at-meals = face-down" },
  { id: "ok-phone-out-at-dinner", from: "phone-at-meals = used-freely | no-rule" },
  { id: "ok-one-line-holds-it", from: "reply-window = hours | same-day" },
  { id: "ok-reply-tomorrow", from: "reply-window = day-or-more" },
  { id: "ok-silence-costs-nothing", from: "reply-window = urgent-only | never" },
  { id: "ok-send-what-cannot-wait", from: "work-after-hours = cannot-wait" },
  { id: "ok-take-the-work-call", from: "work-after-hours = any-evening | any-time" },
  { id: "ok-post-me-unasked", from: "posted-about-me = none" },
  { id: "ok-send-child-photos-privately", from: "children-online = private-only" },
  { id: "ok-ask-the-child", from: "children-online = closed-account | public-no-identifiers | public-open" },
  { id: "ok-tell-your-friends", from: "group-chats = none" },
  { id: "ok-use-shared-logins", from: "passwords = shared-accounts | shared-plus-passcode" },
  { id: "ok-use-my-passcode", from: "passwords = emergency-all | all-any-time" },
  { id: "ok-location-when-travelling", from: "location = travelling" },
  { id: "ok-check-my-location", from: "location = one-person-always | household-always" },
  { id: "ok-open-my-phone-if-i-cannot", from: "reading-messages = if-incapable" },
  { id: "ok-read-the-handed-phone", from: "reading-messages = handed-over | ask-first | one-person-anytime" },
  { id: "ok-delete-on-request", from: "intimate-images = none | deleted | my-device | no-cloud | anywhere" },
  { id: "ok-call-instead-of-typing", from: "not-in-writing = health-news | apology | end-of-argument" },
  { id: "ok-message-is-fine", from: "not-in-writing = none" },
  { id: "ok-name-me-legacy-contact", from: "accounts-after-death = nothing | photographs | no-messages | as-it-is" },
];

export const PLAYBOOK_NOT_OK: readonly Derivation[] = [
  { id: "no-phone-at-the-table", from: "phone-at-meals = out-of-room | silent-away" },
  { id: "no-scroll-mid-sentence", from: "phone-at-meals = out-of-room | silent-away | face-down" },
  { id: "no-day-long-silence", from: "reply-window = hours | same-day" },
  { id: "no-work-in-the-evening", from: "work-after-hours = never" },
  { id: "no-work-unless-it-burns", from: "work-after-hours = cannot-wait" },
  { id: "no-post-me-unasked", from: "posted-about-me = photos" },
  { id: "no-name-me-in-public", from: "posted-about-me = full-name" },
  { id: "no-post-where-i-am", from: "posted-about-me = whereabouts" },
  { id: "no-announce-my-relationship", from: "posted-about-me = relationship" },
  { id: "no-child-at-all", from: "children-online = nothing" },
  { id: "no-child-face-public", from: "children-online = private-only | closed-account" },
  { id: "no-child-school-or-uniform", from: "children-online = private-only | closed-account | public-no-identifiers" },
  { id: "no-child-embarrassment", from: "children-online = closed-account | public-no-identifiers | public-open" },
  { id: "no-screenshot-into-group", from: "group-chats = screenshots" },
  { id: "no-argument-into-group", from: "group-chats = arguments" },
  { id: "no-health-into-group", from: "group-chats = health" },
  { id: "no-money-into-group", from: "group-chats = money" },
  { id: "no-shared-logins-in-my-name", from: "passwords = none" },
  { id: "no-check-instead-of-asking", from: "location = nobody | only-when-i-send | travelling" },
  { id: "no-read-while-i-shower", from: "reading-messages = nobody | if-incapable | handed-over | ask-first" },
  { id: "no-intimate-photos-at-all", from: "intimate-images = none" },
  { id: "no-cloud-backup-of-photos", from: "intimate-images = deleted | my-device | no-cloud" },
  { id: "no-ending-arguments-by-text", from: "not-in-writing = end-of-argument | apology" },
  { id: "no-criticism-by-text", from: "not-in-writing = criticism" },
  { id: "no-money-by-text", from: "not-in-writing = money-decision" },
  { id: "no-reading-my-messages-after", from: "accounts-after-death = nothing | no-messages" },
];
