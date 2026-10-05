/**
 * Big Five — the IPIP 50-item Big-Five Factor Markers (Goldberg), public domain.
 *
 * Fifty items, ten per factor, keyed as IPIP publishes them at
 * https://ipip.ori.org/newBigFive5broadKey.htm. One translation of the key:
 * IPIP's fourth factor is Emotional Stability, and this app reports its
 * mirror, reactivity, so every item of that factor carries the opposite key
 * here and nothing else changes. IPIP's fifth factor is Intellect/Imagination,
 * the lexical cousin of openness; the app keeps its name and says so.
 *
 * The keying is IPIP's and is not balanced (Emotional Stability is 2+/8−),
 * which the published alphas were measured on; rebalancing would be a
 * different instrument. Ids are IPIP's item numbers, so the Polish, German
 * and Spanish tables line up by number with the source files.
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

const row = (n: number, scale: FactorKey, reverse = false) => ({ id: `i${n}`, kind: "likert" as const, scale, reverse });

const ITEMS = [
  row(1, "extraversion"),
  row(2, "agreeableness", true),
  row(3, "conscientiousness"),
  row(4, "reactivity"),
  row(5, "openness"),
  row(6, "extraversion", true),
  row(7, "agreeableness"),
  row(8, "conscientiousness", true),
  row(9, "reactivity", true),
  row(10, "openness", true),
  row(11, "extraversion"),
  row(12, "agreeableness", true),
  row(13, "conscientiousness"),
  row(14, "reactivity"),
  row(15, "openness"),
  row(16, "extraversion", true),
  row(17, "agreeableness"),
  row(18, "conscientiousness", true),
  row(19, "reactivity", true),
  row(20, "openness", true),
  row(21, "extraversion"),
  row(22, "agreeableness", true),
  row(23, "conscientiousness"),
  row(24, "reactivity"),
  row(25, "openness"),
  row(26, "extraversion", true),
  row(27, "agreeableness"),
  row(28, "conscientiousness", true),
  row(29, "reactivity"),
  row(30, "openness", true),
  row(31, "extraversion"),
  row(32, "agreeableness", true),
  row(33, "conscientiousness"),
  row(34, "reactivity"),
  row(35, "openness"),
  row(36, "extraversion", true),
  row(37, "agreeableness"),
  row(38, "conscientiousness", true),
  row(39, "reactivity"),
  row(40, "openness"),
  row(41, "extraversion"),
  row(42, "agreeableness"),
  row(43, "conscientiousness"),
  row(44, "reactivity"),
  row(45, "openness"),
  row(46, "extraversion", true),
  row(47, "agreeableness"),
  row(48, "conscientiousness"),
  row(49, "reactivity"),
  row(50, "openness"),
];

export { GLYPHS, ORDER, ITEMS };
