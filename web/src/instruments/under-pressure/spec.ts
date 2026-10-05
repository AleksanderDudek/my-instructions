import { scaleFor, scoreLikert, band, deviation, elevation, straightlining, sideOf } from "@/core/scoring";
import type { Answers, Channel, InstructionCard, InstrumentSpec, T } from "@/core/types";
import { ITEMS, ORDER, type TraitKey } from "./items";

/**
 * Four angles on one question — how somebody holds up when a plan breaks, a
 * job drags or someone pushes back.
 *
 * Unlike `big-five`, all four scales point the same way: higher is holding up
 * more easily in that respect. So the average is a meaningful reading here
 * and is reported, as `overall`. What the copy refuses is the step after it:
 * holding up easily is not the same as being right to, and each end of each
 * scale is described by what it buys and what it costs.
 *
 * The four-way split is contested — independent confirmatory studies do not
 * reproduce it cleanly — which is why nothing is ranked and the View says so.
 */

const scale = scaleFor("true5", (key) => key);
const MARKED = 22; // distance from 50 at which a scale stops being unremarkable, as in big-five

export type Side = "high" | "low";

export type Trait = {
  key: TraitKey;
  score: number;
  side: Side;
  bandKey: string;
  marked: boolean;
};

export type UnderPressureResult = {
  scores: Record<string, number>;
  profile: Trait[];
  marked: Trait[];
  overall: number;
  overallBand: string;
  flat: boolean;
  suspect: boolean;
  answered: number;
  total: number;
};

export function score(answers: Answers): UnderPressureResult {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const profile: Trait[] = ORDER.map((key) => {
    const s = scores[key];
    return { key, score: s, side: sideOf(s), bandKey: band(s), marked: Math.abs(s - 50) >= MARKED };
  });
  const overall = elevation(scores);
  return {
    scores,
    profile,
    marked: profile.filter((p) => p.marked),
    overall,
    overallBand: band(overall),
    flat: deviation(scores).furthest < MARKED,
    suspect: straightlining(ITEMS, answers),
    answered,
    total,
  };
}

/** Which channel of the instruction sheet each scale speaks to. */
const CHANNEL: Record<TraitKey, Channel> = {
  control: "energy",
  commitment: "work",
  challenge: "work",
  confidence: "communication",
};

export function instructions(result: UnderPressureResult, t: T): InstructionCard[] {
  const cards: InstructionCard[] = [];
  for (const p of result.marked) {
    // Whole titles per band, as big-five does: "strongly high" is not an
    // adverb bolted to an adjective in every language.
    const strong = p.bandKey === "band.veryHigh" || p.bandKey === "band.veryLow";
    const titleKey = strong
      ? `instructions.title.very${p.side === "high" ? "High" : "Low"}`
      : `instructions.title.${p.side}`;
    cards.push({
      channel: CHANNEL[p.key],
      title: t(titleKey, { trait: t(`trait.${p.key}.inline`) }),
      body: t(`trait.${p.key}.ask.${p.side}`),
    });
  }
  if (!cards.length) cards.push({ channel: "energy", title: t("instructions.flatTitle"), body: t("instructions.flatBody") });
  return cards;
}

export const spec: InstrumentSpec<UnderPressureResult> = {
  id: "under-pressure",
  version: 1,
  family: "questionnaire",
  glyph: "◭",
  minutes: 5,
  channels: ["energy", "work", "communication"],
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
    pageSize: 5,
  }),
  score,
  instructions,
};

export default spec;
