/**
 * Five Languages of Love — original item bank.
 *
 * The five-category framework is Gary Chapman's and is not ours; the wording
 * below is. Chapman's own 30-item questionnaire is copyrighted and, more to
 * the point, *ipsative*: it forces a choice between two languages on every
 * question, so the five scores are constrained to sum to thirty. That makes
 * "80 for touch" impossible to express and makes two people's scores
 * incomparable, which is fatal for anything that later wants to match people.
 *
 * So: forty Likert items, eight per language, each rated on its own. Two items
 * in every block are reverse-keyed to blunt the tendency to agree with
 * everything. Scores come out independent — you can want all five, or none.
 */

/* Glyphs are not words and do not travel to the translators. Everything the
   reader sees in a language lives in i18n/, keyed by the ids below. */
export type LanguageKey = "words" | "time" | "service" | "touch" | "gifts";

const GLYPHS: Record<LanguageKey, string> = {
  words: "✎",
  time: "◷",
  service: "⚒",
  touch: "✋",
  gifts: "❖",
};

const ORDER: LanguageKey[] = ["words", "time", "service", "touch", "gifts"];

/** kind/scale are constant across this bank, so the rows stay readable. */
const row = (id: string, scale: LanguageKey, reverse = false) =>
  ({ id, kind: "likert" as const, scaleName: "true5", scale, reverse });

const ITEMS = [
  row("w1", "words"),
  row("w2", "words"),
  row("w3", "words"),
  row("w4", "words"),
  row("w5", "words"),
  row("w6", "words"),
  row("w7", "words", true),
  row("w8", "words", true),

  row("t1", "time"),
  row("t2", "time"),
  row("t3", "time"),
  row("t4", "time"),
  row("t5", "time"),
  row("t6", "time"),
  row("t7", "time", true),
  row("t8", "time", true),

  row("s1", "service"),
  row("s2", "service"),
  row("s3", "service"),
  row("s4", "service"),
  row("s5", "service"),
  row("s6", "service"),
  row("s7", "service", true),
  row("s8", "service", true),

  row("p1", "touch"),
  row("p2", "touch"),
  row("p3", "touch"),
  row("p4", "touch"),
  row("p5", "touch"),
  row("p6", "touch"),
  row("p7", "touch", true),
  row("p8", "touch", true),

  row("g1", "gifts"),
  row("g2", "gifts"),
  row("g3", "gifts"),
  row("g4", "gifts"),
  row("g5", "gifts"),
  row("g6", "gifts"),
  row("g7", "gifts", true),
  row("g8", "gifts", true),
];

export { GLYPHS, ORDER, ITEMS };
