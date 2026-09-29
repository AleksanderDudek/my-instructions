/**
 * Under pressure — original item bank, Likert.
 *
 * Four scales from the hardiness construct and the 4C model of mental
 * toughness that grew out of it: control, commitment, challenge, confidence.
 * Eight items each, four forward and four reverse, for the reason `big-five`
 * gives — an all-forward bank measures agreement more than it measures its
 * construct.
 *
 * `control` leans on agency — working out the next step — rather than on
 * calm, because calm under strain is what `big-five` reactivity already asks.
 * Two items keep the emotional half the construct includes, so the scale is
 * still the one the literature names.
 *
 * Public-domain IPIP scales (self-efficacy, vulnerability, assertiveness,
 * industry) could replace these as data; see the provenance note for why they
 * do not yet.
 */

export type TraitKey = "control" | "commitment" | "challenge" | "confidence";

/* Glyphs are not words. Every scale's wording lives in i18n/. */
const GLYPHS: Record<TraitKey, string> = {
  control: "◉",
  commitment: "▤",
  challenge: "△",
  confidence: "◆",
};

const ORDER: TraitKey[] = ["control", "commitment", "challenge", "confidence"];

/** kind/scale are constant across this bank, so the rows stay readable. */
const row = (id: string, scale: TraitKey, reverse = false) =>
  ({ id, kind: "likert" as const, scaleName: "true5", scale, reverse });

const ITEMS = [
  row("ct1", "control"),
  row("ct2", "control"),
  row("ct3", "control"),
  row("ct4", "control"),
  row("ct5", "control", true),
  row("ct6", "control", true),
  row("ct7", "control", true),
  row("ct8", "control", true),

  row("cm1", "commitment"),
  row("cm2", "commitment"),
  row("cm3", "commitment"),
  row("cm4", "commitment"),
  row("cm5", "commitment", true),
  row("cm6", "commitment", true),
  row("cm7", "commitment", true),
  row("cm8", "commitment", true),

  row("ch1", "challenge"),
  row("ch2", "challenge"),
  row("ch3", "challenge"),
  row("ch4", "challenge"),
  row("ch5", "challenge", true),
  row("ch6", "challenge", true),
  row("ch7", "challenge", true),
  row("ch8", "challenge", true),

  row("cf1", "confidence"),
  row("cf2", "confidence"),
  row("cf3", "confidence"),
  row("cf4", "confidence"),
  row("cf5", "confidence", true),
  row("cf6", "confidence", true),
  row("cf7", "confidence", true),
  row("cf8", "confidence", true),
];

export { GLYPHS, ORDER, ITEMS };
