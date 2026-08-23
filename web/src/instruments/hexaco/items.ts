/**
 * HEXACO — original item bank, Likert.
 *
 * The six-factor model is Ashton and Lee's and is public; the HEXACO-PI-R's
 * own items are theirs. These are original items written against the published
 * factor definitions, in the same voice as the rest of the app.
 *
 * The reason this instrument exists alongside Big Five is one factor:
 * Honesty–Humility. The five-factor model has no place to put sincerity,
 * fairness and greed avoidance, and scatters them thinly across agreeableness
 * and conscientiousness. On a page about how to deal with someone, that is the
 * dimension people most want and least often get.
 *
 * Six items per factor, four forward and two reverse-keyed.
 */

/* Glyphs are not words. Every factor's wording lives in i18n/. */
export type FactorKey =
  | "honesty"
  | "emotionality"
  | "extraversion"
  | "agreeableness"
  | "conscientiousness"
  | "openness";

const GLYPHS: Record<FactorKey, string> = {
  honesty: "◇",
  emotionality: "◈",
  extraversion: "◉",
  agreeableness: "◍",
  conscientiousness: "▤",
  openness: "✧",
};

const ORDER: FactorKey[] = ["honesty", "emotionality", "extraversion", "agreeableness", "conscientiousness", "openness"];

const row = (id: string, scale: FactorKey, reverse = false) =>
  ({ id, kind: "likert" as const, scaleName: "agree5", scale, reverse });

const ITEMS = [
  row("h1", "honesty"),
  row("h2", "honesty"),
  row("h3", "honesty"),
  row("h4", "honesty"),
  row("h5", "honesty", true),
  row("h6", "honesty", true),

  row("m1", "emotionality"),
  row("m2", "emotionality"),
  row("m3", "emotionality"),
  row("m4", "emotionality"),
  row("m5", "emotionality", true),
  row("m6", "emotionality", true),

  row("x1", "extraversion"),
  row("x2", "extraversion"),
  row("x3", "extraversion"),
  row("x4", "extraversion"),
  row("x5", "extraversion", true),
  row("x6", "extraversion", true),

  row("a1", "agreeableness"),
  row("a2", "agreeableness"),
  row("a3", "agreeableness"),
  row("a4", "agreeableness"),
  row("a5", "agreeableness", true),
  row("a6", "agreeableness", true),

  row("c1", "conscientiousness"),
  row("c2", "conscientiousness"),
  row("c3", "conscientiousness"),
  row("c4", "conscientiousness"),
  row("c5", "conscientiousness", true),
  row("c6", "conscientiousness", true),

  row("o1", "openness"),
  row("o2", "openness"),
  row("o3", "openness"),
  row("o4", "openness"),
  row("o5", "openness", true),
  row("o6", "openness", true),
];

export { GLYPHS, ORDER, ITEMS };
