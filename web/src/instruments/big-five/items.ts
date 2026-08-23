/**
 * Big Five — original item bank, Likert.
 *
 * The five-factor model is the one instrument here with real research behind
 * it, and its canonical item pools (IPIP) are genuinely public domain. These
 * items are nonetheless written fresh, in the same voice as the rest of the
 * app, and the scoring engine takes items as data — so dropping in the IPIP
 * fifty-item markers later is a change to this file and nothing else.
 *
 * Eight items per factor, four forward and four reverse. The even split
 * matters more here than anywhere else in the app: the factors are meant to be
 * orthogonal, and an all-forward scale quietly correlates every factor with
 * agreeableness.
 */

export type FactorKey = "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "reactivity";

/* Glyphs are not words. Every factor's wording lives in i18n/. */
const GLYPHS: Record<FactorKey, string> = {
  openness: "◇",
  conscientiousness: "▤",
  extraversion: "◈",
  agreeableness: "◍",
  reactivity: "◐",
};

const ORDER: FactorKey[] = ["openness", "conscientiousness", "extraversion", "agreeableness", "reactivity"];

/** kind/scale are constant across this bank, so the rows stay readable. */
const row = (id: string, scale: FactorKey, reverse = false) =>
  ({ id, kind: "likert" as const, scaleName: "true5", scale, reverse });

const ITEMS = [
  row("o1", "openness"),
  row("o2", "openness"),
  row("o3", "openness"),
  row("o4", "openness"),
  row("o5", "openness", true),
  row("o6", "openness", true),
  row("o7", "openness", true),
  row("o8", "openness", true),

  row("c1", "conscientiousness"),
  row("c2", "conscientiousness"),
  row("c3", "conscientiousness"),
  row("c4", "conscientiousness"),
  row("c5", "conscientiousness", true),
  row("c6", "conscientiousness", true),
  row("c7", "conscientiousness", true),
  row("c8", "conscientiousness", true),

  row("e1", "extraversion"),
  row("e2", "extraversion"),
  row("e3", "extraversion"),
  row("e4", "extraversion"),
  row("e5", "extraversion", true),
  row("e6", "extraversion", true),
  row("e7", "extraversion", true),
  row("e8", "extraversion", true),

  row("a1", "agreeableness"),
  row("a2", "agreeableness"),
  row("a3", "agreeableness"),
  row("a4", "agreeableness"),
  row("a5", "agreeableness", true),
  row("a6", "agreeableness", true),
  row("a7", "agreeableness", true),
  row("a8", "agreeableness", true),

  row("n1", "reactivity"),
  row("n2", "reactivity"),
  row("n3", "reactivity"),
  row("n4", "reactivity"),
  row("n5", "reactivity", true),
  row("n6", "reactivity", true),
  row("n7", "reactivity", true),
  row("n8", "reactivity", true),
];

export { GLYPHS, ORDER, ITEMS };
