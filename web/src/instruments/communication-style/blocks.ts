import type { StanceBlock } from "@/core/stance";

/**
 * Twelve requests about how this person has asked to be addressed.
 *
 * The instrument is descended from a family it declines to join. The
 * four-temperament scheme comes down from Galen, the function pairs are Jung's,
 * Marston published a four-quadrant description of normal emotion in a book
 * with no assessment behind it, and the assertiveness-by-responsiveness grid
 * has been reproduced openly for forty years. All of that is public and belongs
 * to nobody. What belongs to somebody is every commercial version — and two
 * separate rights are involved, which the copy has to keep separate too.
 * Copyright covers the item text, the option wording, the report prose, the
 * adjective checklists and the wheel graphics of each product. Trade marks
 * cover the product names and the branded colour epithets, which stay marks
 * however public the underlying idea is. Nothing here reproduces either. No
 * commercial questionnaire was consulted while these twelve were written, and
 * they are organised by communication event rather than by temperament, which
 * is why they do not map onto any product's factor set.
 *
 * ── What this bank refuses to be ──────────────────────────────────────
 *
 * It computes nothing. Not a colour, not a type, not a position on an axis.
 * That is a property of the declarations below rather than a promise made in
 * copy, and the four things it refuses are worth naming here because each of
 * them is the obvious next commit:
 *
 * **No tally.** A count of which answers went which way is an inference
 * dressed as a summary. It would be read as a type, and the moment it exists
 * the twelve careful answers collapse into a label.
 *
 * **No forced choice between four descriptions.** Most-and-least from a set of
 * four is the item format of the commercial products rather than their
 * construct, and it is ipsative: somebody for whom two of the four are equally
 * true cannot answer it honestly, because the format makes them donate one to
 * the other. The same objection kills "rank the four" and "which of these four
 * is you".
 *
 * **No self-rating on an axis.** Nobody knows their own position on a
 * population axis, and a number for it would be read as a score by everyone
 * who saw it. The 1–10 field in this format is weight, and only ever weight.
 *
 * **No colour on a section.** The four sections are communication events —
 * arriving, bad news, friction, silence. Mapping them onto four temperaments
 * would invent a correspondence that does not exist and then start tracking
 * somebody's product semantics for each one. The catalogue's promise of the
 * colour vocabulary is met by naming the lineage honestly and saying, in the
 * reader's own result copy, that no colour is applied.
 *
 * What may be claimed is narrow and it is enough: that these twelve answers are
 * what this person says they want, and that they weighted them as recorded.
 * What may not be claimed is that the answers constitute a type, a
 * temperament, a measurement, or a prediction of how this person actually
 * behaves.
 *
 * ── Why the blocks are the shape they are ─────────────────────────────
 *
 * Every prompt is second person and addressed to the respondent; every option
 * calls the other person "they" or "someone" and the respondent "I". The first
 * person is kept for the playbook lines, which are the sentences the reader
 * hands to somebody else. Four blocks carry an escape that is a real answer
 * rather than filler — a person can genuinely not know what settles an
 * argument for them, and a bank that does not offer that collects a guess.
 * `asked-if-wrong` has no escape on purpose: "Not at all — I will raise it" is
 * terminal rather than evasive, and it already covers the reader who wants to
 * be left alone with it.
 *
 * Six of the twelve were checked one by one against `working-style` and
 * `digital-life`, which ask adjacent questions, and the distinctions are in the
 * bank's `rejected` list rather than in anyone's memory: `interrupting` is
 * about a sentence where `working-style.interruption` is about a working day;
 * `public-correction` is being wrong in front of people in any room where
 * `working-style.dissent` is disagreement in a meeting; `bad-news` is the order
 * you want a bad sentence in where `brief` is the order you want a request in;
 * `no-reply` is what somebody should do about a silence where
 * `digital-life.reply-window` is how fast an answer is expected.
 *
 * The words are all in `i18n/`. Nothing below is reader-facing.
 */

/**
 * The four sections, in the order they are asked.
 *
 * Ids only: the title and the note under it are copy and live in `i18n/`. The
 * order is load-bearing twice over — it is the order the blocks are declared
 * in, and `spec.ts` sizes a page so that one section is one page.
 */
export const SECTIONS = ["reaching", "hard", "friction", "reading"] as const;
export type SectionId = (typeof SECTIONS)[number];

/**
 * The twelve, declared in section order.
 *
 * Every one is a `choice`. There is no `multi` in this bank and no `grounds`
 * list: grounds earn their place where authority is genuinely a separate
 * question from weight, and here they would be a taxonomy of causes — asking
 * somebody why they are the way they are collects a plausible answer rather
 * than a known one. The reason belongs in the `why` box, where it is the
 * person's own sentence and not one of six we chose for them.
 *
 * Nothing is `private` and nothing is `skipWeight`. The weight is the whole
 * point of a block here: two people who both want bad news the same way and
 * rate it 9 have found nothing to discuss, and two who differ at 9 and 2 have
 * found which of them has been conceding.
 */
export const BLOCKS: readonly StanceBlock[] = [
  { id: "small-talk", kind: "choice", section: "reaching", options: ["none", "aLine", "fewMinutes", "depends"] },
  { id: "interrupting", kind: "choice", section: "reaching", options: ["anyTime", "toBuild", "askFirst", "wait", "depends"] },
  { id: "no-reply", kind: "choice", section: "reaching", options: ["nudge", "call", "escalate", "wait", "assumeNo", "depends"] },

  { id: "bad-news", kind: "choice", section: "hard", options: ["firstSentence", "shortWarning", "contextFirst", "writtenFirst", "depends"] },
  { id: "unfinished", kind: "choice", section: "hard", options: ["atOnce", "onceReal", "withOptions", "onceStuck", "depends"] },
  { id: "apology", kind: "choice", section: "hard", options: ["named", "said", "changed", "shown", "later", "depends"] },

  { id: "public-correction", kind: "choice", section: "friction", options: ["onTheSpot", "withReason", "afterwards", "signal", "depends"] },
  { id: "upset-with-me", kind: "choice", section: "friction", options: ["named", "atOnce", "nextDay", "inWriting", "askFirst", "depends"] },
  { id: "drop-it", kind: "choice", section: "friction", options: ["heard", "reason", "decided", "revisit", "time", "unsure"] },

  { id: "going-quiet", kind: "choice", section: "reading", options: ["thinking", "tooMuch", "upset", "finished", "yourTurn", "varies"] },
  { id: "asked-if-wrong", kind: "choice", section: "reading", options: ["straight", "named", "later", "alongside", "notAtAll"] },
  { id: "praise", kind: "choice", section: "reading", options: ["public", "private", "written", "passedOn", "lightly", "unsure"] },
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
 * Thirty-six OK lines and twenty-eight not-OK ones, which is not what one
 * reader sees.
 *
 * The design's target of eight to fourteen a side is a target for the page, not
 * a cap on the bank, because the same design requires the lines to be derived
 * from the result. No option fires more than one line per side, so a reader who
 * answers all twelve substantively sees at most twelve and twelve, and one who
 * takes several of the escapes sees fewer.
 *
 * Coverage is deliberate: 56 of the 65 options fire a line. The nine that do
 * not are the honest escapes, where there is no sentence anybody could be held
 * to. The two escapes that do fire — `small-talk = depends` and
 * `going-quiet = varies` — earn it because "ask me" is itself a request a
 * person can be handed.
 */
export const PLAYBOOK_OK: readonly Derivation[] = [
  { id: "ok.talk.straight", from: "small-talk = none | aLine" },
  { id: "ok.talk.warmup", from: "small-talk = fewMinutes" },
  { id: "ok.talk.ask", from: "small-talk = depends" },
  { id: "ok.cutin.add", from: "interrupting = anyTime | toBuild" },
  { id: "ok.cutin.name", from: "interrupting = askFirst" },
  { id: "ok.quiet.again", from: "no-reply = nudge" },
  { id: "ok.quiet.ring", from: "no-reply = call | escalate" },
  { id: "ok.quiet.silence", from: "no-reply = assumeNo" },
  { id: "ok.news.worst", from: "bad-news = firstSentence | shortWarning" },
  { id: "ok.news.context", from: "bad-news = contextFirst" },
  { id: "ok.news.written", from: "bad-news = writtenFirst" },
  { id: "ok.problem.early", from: "unfinished = atOnce" },
  { id: "ok.problem.option", from: "unfinished = withOptions" },
  { id: "ok.problem.first", from: "unfinished = onceStuck" },
  { id: "ok.sorry.name", from: "apology = named" },
  { id: "ok.sorry.after", from: "apology = changed | shown" },
  { id: "ok.sorry.once", from: "apology = said" },
  { id: "ok.correct.room", from: "public-correction = onTheSpot" },
  { id: "ok.correct.why", from: "public-correction = withReason" },
  { id: "ok.correct.signal", from: "public-correction = signal" },
  { id: "ok.angry.plain", from: "upset-with-me = named | atOnce" },
  { id: "ok.angry.write", from: "upset-with-me = inWriting" },
  { id: "ok.angry.ask", from: "upset-with-me = askFirst" },
  { id: "ok.drop.said", from: "drop-it = heard" },
  { id: "ok.drop.reason", from: "drop-it = reason" },
  { id: "ok.drop.hour", from: "drop-it = time" },
  { id: "ok.pause.think", from: "going-quiet = thinking" },
  { id: "ok.pause.done", from: "going-quiet = finished | yourTurn" },
  { id: "ok.pause.ask", from: "going-quiet = varies" },
  { id: "ok.ask.named", from: "asked-if-wrong = straight | named" },
  { id: "ok.ask.walk", from: "asked-if-wrong = alongside" },
  { id: "ok.ask.later", from: "asked-if-wrong = later" },
  { id: "ok.praise.public", from: "praise = public" },
  { id: "ok.praise.quiet", from: "praise = private | lightly" },
  { id: "ok.praise.write", from: "praise = written" },
  { id: "ok.praise.pass", from: "praise = passedOn" },
];

export const PLAYBOOK_NOT_OK: readonly Derivation[] = [
  { id: "no.talk.warmup", from: "small-talk = none | aLine" },
  { id: "no.talk.cold", from: "small-talk = fewMinutes" },
  { id: "no.cutin.across", from: "interrupting = wait | askFirst" },
  { id: "no.cutin.hold", from: "interrupting = anyTime | toBuild" },
  { id: "no.quiet.chase", from: "no-reply = wait | assumeNo" },
  { id: "no.quiet.assume", from: "no-reply = nudge | call | escalate" },
  { id: "no.news.buildup", from: "bad-news = firstSentence | shortWarning" },
  { id: "no.news.headline", from: "bad-news = contextFirst" },
  { id: "no.news.room", from: "bad-news = writtenFirst" },
  { id: "no.problem.rumour", from: "unfinished = onceReal | withOptions | onceStuck" },
  { id: "no.problem.late", from: "unfinished = atOnce" },
  { id: "no.sorry.word", from: "apology = named | changed | shown" },
  { id: "no.sorry.now", from: "apology = later" },
  { id: "no.correct.public", from: "public-correction = afterwards" },
  { id: "no.correct.aloud", from: "public-correction = signal" },
  { id: "no.correct.later", from: "public-correction = onTheSpot | withReason" },
  { id: "no.angry.hint", from: "upset-with-me = named | atOnce | askFirst" },
  { id: "no.angry.hot", from: "upset-with-me = nextDay" },
  { id: "no.angry.spot", from: "upset-with-me = inWriting" },
  { id: "no.drop.open", from: "drop-it = decided" },
  { id: "no.drop.closed", from: "drop-it = revisit" },
  { id: "no.pause.fill", from: "going-quiet = tooMuch | upset" },
  { id: "no.pause.read", from: "going-quiet = thinking | finished | yourTurn" },
  { id: "no.ask.twice", from: "asked-if-wrong = notAtAll | later" },
  { id: "no.ask.leave", from: "asked-if-wrong = straight | named | alongside" },
  { id: "no.praise.public", from: "praise = private | lightly" },
  { id: "no.praise.quiet", from: "praise = public" },
  { id: "no.praise.tome", from: "praise = passedOn" },
];
