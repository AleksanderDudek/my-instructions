import { scaleFor, scoreLikert, rank, straightlining } from "@/core/scoring";
import type { Answers, Channel, InstructionCard, InstrumentSpec, T } from "@/core/types";
import { ITEMS, ORDER, type StrengthKey } from "./items";

/**
 * Twenty-four strengths, read as an order rather than as twenty-four scores.
 *
 * The reading is the top five — where somebody is most themselves — and,
 * without judgement, the three they reach for least. The bottom of the list
 * is not a weakness and is never called one; nothing about it becomes a card.
 *
 * Two honesty guards, both carried in the result so the View can say them:
 *
 *   - `flat`: three items a scale quantise a score into steps of about eight,
 *     so a profile whose highest and lowest sit two steps apart has no order
 *     worth reporting, and ranking it would invent one.
 *   - `tiedAtCut` / `tiedAtFloor`: when the fifth and sixth are tied, which
 *     of them made the five is the classification's order, not the reader's;
 *     the same at the bottom three. The View names it instead of hiding it.
 */

const scale = scaleFor("true5", (key) => key);
const SIGNATURE = 5;
const LEAST = 3;
const FLAT_SPREAD = 17; // about two steps of a three-item scale

export type StrengthsResult = {
  scores: Record<string, number>;
  /** Highest first. Ties keep the classification's order. */
  ranked: { key: StrengthKey; score: number }[];
  signature: StrengthKey[];
  least: StrengthKey[];
  tiedAtCut: boolean;
  tiedAtFloor: boolean;
  flat: boolean;
  suspect: boolean;
  answered: number;
  total: number;
};

export function score(answers: Answers): StrengthsResult {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  // `rank` sorts by score and keeps insertion order within a tie, and
  // `scoreLikert` inserts in item order, which is the classification's.
  const ordered = rank(Object.fromEntries(ORDER.map((k) => [k, scores[k]]))).map((r) => ({
    key: r.key as StrengthKey,
    score: r.score,
  }));
  const values = ordered.map((r) => r.score);
  return {
    scores,
    ranked: ordered,
    signature: ordered.slice(0, SIGNATURE).map((r) => r.key),
    least: ordered.slice(-LEAST).reverse().map((r) => r.key),
    tiedAtCut: ordered[SIGNATURE - 1].score === ordered[SIGNATURE].score,
    tiedAtFloor: ordered[ordered.length - LEAST].score === ordered[ordered.length - LEAST - 1].score,
    flat: Math.max(...values) - Math.min(...values) < FLAT_SPREAD,
    suspect: straightlining(ITEMS, answers),
    answered,
    total,
  };
}

/** Which channel of the instruction sheet each strength speaks to. */
export const CHANNEL: Record<StrengthKey, Channel> = {
  creativity: "work",
  curiosity: "communication",
  judgment: "work",
  learning: "work",
  perspective: "communication",
  bravery: "conflict",
  perseverance: "work",
  honesty: "communication",
  zest: "energy",
  love: "affection",
  kindness: "affection",
  social: "communication",
  teamwork: "work",
  fairness: "conflict",
  leadership: "work",
  forgiveness: "conflict",
  humility: "communication",
  prudence: "rhythm",
  regulation: "rhythm",
  beauty: "energy",
  gratitude: "affection",
  hope: "energy",
  humor: "communication",
  spirituality: "energy",
};

export function instructions(result: StrengthsResult, t: T): InstructionCard[] {
  // A flat profile has no top five to hand anybody; one card says so instead.
  if (result.flat) return [{ channel: "communication", title: t("instructions.flatTitle"), body: t("instructions.flatBody") }];
  return result.signature.map((key) => ({
    channel: CHANNEL[key],
    title: t("instructions.title", { strength: t(`trait.${key}.inline`) }),
    body: t(`trait.${key}.ask`),
  }));
}

export const spec: InstrumentSpec<StrengthsResult> = {
  id: "character-strengths",
  version: 1,
  family: "questionnaire",
  glyph: "✧",
  minutes: 10,
  channels: ["work", "communication", "conflict", "energy", "affection", "rhythm"],
  tier: "free",
  messages: {
    en: () => import("./i18n/en"),
    pl: () => import("./i18n/pl"),
    es: () => import("./i18n/es"),
    de: () => import("./i18n/de"),
  },
  form: (t) => ({
    kind: "items",
    items: ITEMS.map((item) => ({ ...item, prompt: t(`item.${item.id}`) })),
    scale: scaleFor("true5", t),
    shuffle: true,
    pageSize: 6,
  }),
  score,
  instructions,
  // The five the reader just met, not all twenty-four. See `reflectOn`.
  reflectOn: (result) => (result.flat ? [] : result.signature),
};

export default spec;
