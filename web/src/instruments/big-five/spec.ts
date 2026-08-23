import { scaleFor, scoreLikert, band, deviation, straightlining } from "@/core/scoring";
import type { Answers, Channel, InstructionCard, InstrumentSpec, T } from "@/core/types";
import { ITEMS, ORDER, type FactorKey } from "./items";

/**
 * Unlike the other two questionnaires, nothing here is ranked. The five
 * factors are meant to be independent, so "your highest factor" is a category
 * error — a person is not *mostly* open the way they are mostly a 5. Each
 * factor is reported on its own, and the summary picks out only the ones far
 * enough from the middle to be worth telling someone about.
 */

const scale = scaleFor("agree5", (key) => key);
const MARKED = 22; // distance from 50 at which a factor stops being unremarkable

export type Side = "high" | "low";

export type Factor = {
  key: FactorKey;
  score: number;
  side: Side;
  bandKey: string;
  marked: boolean;
};

export type BigFiveResult = {
  scores: Record<string, number>;
  profile: Factor[];
  marked: Factor[];
  flat: boolean;
  suspect: boolean;
  answered: number;
  total: number;
};

export function score(answers: Answers): BigFiveResult {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const profile: Factor[] = ORDER.map((key) => {
    const s = scores[key];
    return { key, score: s, side: s >= 50 ? "high" : "low", bandKey: band(s), marked: Math.abs(s - 50) >= MARKED };
  });
  return {
    scores,
    profile,
    marked: profile.filter((p) => p.marked),
    // Deviation from the middle, not spread between the scales: a person at 70
    // on everything has no spread and plenty to say, and calling that flat
    // would be wrong.
    flat: deviation(scores).furthest < MARKED,
    suspect: straightlining(ITEMS, answers),
    answered,
    total,
  };
}

/** Which channel of the instruction sheet a factor speaks to. */
const CHANNEL: Record<FactorKey, Channel> = {
  openness: "communication",
  conscientiousness: "work",
  extraversion: "energy",
  agreeableness: "communication",
  reactivity: "energy",
};

export function instructions(result: BigFiveResult, t: T): InstructionCard[] {
  const cards: InstructionCard[] = [];
  for (const p of result.marked) {
    // Four whole titles rather than an assembled one: "Strongly high" is not
    // "strongly" plus "high" in every language, and a title is short enough
    // that four keys cost less than one that has to be built.
    const strong = p.bandKey === "band.veryHigh" || p.bandKey === "band.veryLow";
    const titleKey = strong
      ? `instructions.title.very${p.side === "high" ? "High" : "Low"}`
      : `instructions.title.${p.side}`;
    cards.push({
      channel: CHANNEL[p.key],
      title: t(titleKey, { factor: t(`factor.${p.key}.inline`) }),
      body: t(`factor.${p.key}.ask.${p.side}`),
    });
  }
  // "Read the situation rather than the profile" is guidance on how to
  // approach a person, which is the communication channel. It was filed under
  // rhythm — a channel neither instrument declares — so the card rendered on
  // the sheet under a heading its own instrument said it never contributes to.
  // Only reachable on a flat profile, which is why it survived: the contract
  // test answered every item the same way and never produced one.
  if (!cards.length) cards.push({ channel: "communication", title: t("instructions.flatTitle"), body: t("instructions.flatBody") });
  return cards;
}

/**
 * Two people, five independent factors. Nothing is ranked, so the reading is
 * the distance between them: where the two profiles sit furthest apart, where
 * they coincide, and how far apart they are on average.
 */
export type Gap = { key: FactorKey; a: number; b: number; gap: number };

export type BigFiveComparison = {
  gaps: Gap[];
  widest: Gap;
  closest: Gap;
  mean: number;
};

export function compare(a: BigFiveResult, b: BigFiveResult): BigFiveComparison {
  const gaps: Gap[] = ORDER.map((k) => ({
    key: k,
    a: a.scores[k],
    b: b.scores[k],
    gap: Math.abs(a.scores[k] - b.scores[k]),
  })).sort((x, y) => y.gap - x.gap);
  const widest = gaps[0];
  const closest = gaps[gaps.length - 1];
  const mean = Math.round(gaps.reduce((s, g) => s + g.gap, 0) / gaps.length);
  return { gaps, widest, closest, mean };
}

export const spec: InstrumentSpec<BigFiveResult> = {
  id: "big-five",
  version: 1,
  family: "questionnaire",
  glyph: "✦",
  minutes: 6,
  channels: ["communication", "work", "energy"],
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
    scale: scaleFor("agree5", t),
    shuffle: true,
    pageSize: 5,
  }),
  score,
  instructions,
  compare,
};

export default spec;
