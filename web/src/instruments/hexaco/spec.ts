import { scaleFor, scoreLikert, band, deviation, straightlining } from "@/core/scoring";
import type { Answers, Channel, InstrumentSpec, InstructionCard, T } from "@/core/types";
import { ORDER, ITEMS, type FactorKey } from "./items";

/**
 * Six factors, and one of them is the point.
 *
 * Honesty–Humility is what HEXACO has and the five-factor model does not, so
 * the headline leads with it rather than with whichever factor happens to be
 * furthest from the middle. Everything else is reported plainly beside it.
 *
 * Like Big Five and unlike the Enneagram, nothing here is ranked: the factors
 * are meant to be independent, so "your highest factor" would be a category
 * error. Each is read on its own.
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

export type HexacoResult = {
  scores: Record<string, number>;
  profile: Factor[];
  honesty: Factor;
  marked: Factor[];
  flat: boolean;
  suspect: boolean;
  answered: number;
  total: number;
};

export function score(answers: Answers): HexacoResult {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const profile: Factor[] = ORDER.map((key) => {
    const s = scores[key];
    return { key, score: s, side: s >= 50 ? "high" : "low", bandKey: band(s), marked: Math.abs(s - 50) >= MARKED };
  });
  return {
    scores,
    profile,
    honesty: profile[0],
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
  honesty: "work",
  emotionality: "energy",
  extraversion: "energy",
  agreeableness: "conflict",
  conscientiousness: "work",
  openness: "communication",
};

export function instructions(result: HexacoResult, t: T): InstructionCard[] {
  const cards: InstructionCard[] = [
    // Honesty–Humility always gets a card, marked or not. It is the reason to
    // take this rather than Big Five, and a middling score on it still says
    // something a colleague can act on.
    {
      channel: "work",
      title: t("instructions.honestyTitle", { band: t(result.honesty.bandKey) }),
      body: t(`factor.honesty.ask.${result.honesty.side}`),
    },
  ];
  for (const p of result.marked) {
    if (p.key === "honesty") continue;
    cards.push({
      channel: CHANNEL[p.key],
      title: t(`instructions.title.${p.side}`, { factor: t(`factor.${p.key}.inline`) }),
      body: t(`factor.${p.key}.ask.${p.side}`),
    });
  }
  if (cards.length === 1) {
    // "Read the situation rather than the profile" is guidance on how to
    // approach a person, which is the communication channel. It was filed under
    // rhythm — a channel neither instrument declares — so the card rendered on
    // the sheet under a heading its own instrument said it never contributes to.
    // Only reachable on a flat profile, which is why it survived: the contract
    // test answered every item the same way and never produced one.
    cards.push({ channel: "communication", title: t("instructions.flatTitle"), body: t("instructions.flatBody") });
  }
  return cards;
}

/**
 * Two people, six factors, and one gap that is not like the others.
 *
 * A large gap on Honesty–Humility is not the same kind of news as a large gap
 * on openness, and saying so is most of this instrument's value — so the split
 * is flagged here and worded in the component.
 */
export type Gap = { key: FactorKey; a: number; b: number; gap: number };

const HONESTY_SPLIT = 25;

export function compare(a: HexacoResult, b: HexacoResult) {
  const gapFor = (k: FactorKey): Gap => ({ key: k, a: a.scores[k], b: b.scores[k], gap: Math.abs(a.scores[k] - b.scores[k]) });
  const gaps = ORDER.map(gapFor).sort((x, y) => y.gap - x.gap);
  const widest = gaps[0];
  const honesty = gapFor("honesty");
  const mean = Math.round(gaps.reduce((s, g) => s + g.gap, 0) / gaps.length);

  return { gaps, widest, honesty, mean, honestySplit: honesty.gap >= HONESTY_SPLIT };
}

export const spec: InstrumentSpec<HexacoResult> = {
  id: "hexaco",
  version: 1,
  family: "questionnaire",
  glyph: "⬡",
  minutes: 5,
  channels: ["work", "conflict", "communication", "energy"],
  tier: "premium",
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
    pageSize: 6,
  }),
  score,
  instructions,
  compare,
};

export default spec;
