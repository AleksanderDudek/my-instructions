import { scaleFor, scoreLikert, band, straightlining } from "@/core/scoring";
import type { Answers, Channel, InstructionCard, InstrumentSpec, T } from "@/core/types";
import { ITEMS, ORDER, type OctantKey } from "./items";

/**
 * Where someone sits on the interpersonal circle: how much they take charge
 * (dominance) and how much they warm to people (warmth), read off eight
 * octants of behaviour.
 *
 * The circle is the point. The octants are not eight independent traits — each
 * is a blend of the two axes, and a four-item octant has the reliability of a
 * four-item scale (around .6 in the published studies). So the reading leads
 * with the two axes and the quadrant they put you in, shows the octant profile
 * as a profile, and the comparison shows two people's positions, not a
 * similarity score: the literature on couples finds each person's level
 * matters and similarity barely does.
 */

const scale = scaleFor("accurate5", (key) => key);

/**
 * Octant → axis weights. Dominance runs PA (top) to HI (bottom), warmth LM
 * (right) to DE (left); the diagonal octants load on both at cos 45°.
 */
const W = Math.SQRT1_2;
const DOMINANCE: Record<OctantKey, number> = { pa: 1, bc: W, no: W, hi: -1, fg: -W, jk: -W, de: 0, lm: 0 };
const WARMTH: Record<OctantKey, number> = { lm: 1, no: W, jk: W, de: -1, bc: -W, fg: -W, pa: 0, hi: 0 };
/** The largest magnitude an axis can reach from octant scores of 1..100. */
const REACH = 99 * (1 + 2 * W);

/** An axis onto 1..100, with the exact centre at 50 like every other score. */
function axis(scores: Record<string, number>, weights: Record<OctantKey, number>): number {
  const raw = ORDER.reduce((sum, key) => sum + weights[key] * (scores[key] - 50), 0);
  if (raw === 0) return 50;
  return Math.round(1 + ((raw + REACH) / (2 * REACH)) * 99);
}

/** How far from the centre an axis has to be before it names a quadrant. */
const CENTRE = 10;

export type Quadrant = "warmDominant" | "warmYielding" | "coolDominant" | "coolYielding" | "centred";

export type Octant = { key: OctantKey; score: number; bandKey: string };

export type InterpersonalResult = {
  scores: Record<string, number>;
  octants: Octant[];
  dominance: number;
  warmth: number;
  quadrant: Quadrant;
  /** The octant(s) scored highest; more than one when tied. */
  leading: OctantKey[];
  suspect: boolean;
  answered: number;
  total: number;
};

export function quadrantOf(dominance: number, warmth: number): Quadrant {
  const dom = dominance - 50;
  const warm = warmth - 50;
  if (Math.abs(dom) < CENTRE && Math.abs(warm) < CENTRE) return "centred";
  if (warm >= 0) return dom >= 0 ? "warmDominant" : "warmYielding";
  return dom >= 0 ? "coolDominant" : "coolYielding";
}

export function score(answers: Answers): InterpersonalResult {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const octants = ORDER.map((key) => ({ key, score: scores[key], bandKey: band(scores[key]) }));
  const top = Math.max(...octants.map((o) => o.score));
  const dominance = axis(scores, DOMINANCE);
  const warmth = axis(scores, WARMTH);
  return {
    scores,
    octants,
    dominance,
    warmth,
    quadrant: quadrantOf(dominance, warmth),
    leading: octants.filter((o) => o.score === top).map((o) => o.key),
    suspect: straightlining(ITEMS, answers),
    answered,
    total,
  };
}

const CHANNELS: Channel[] = ["communication", "conflict"];

export function instructions(result: InterpersonalResult, t: T): InstructionCard[] {
  const q = result.quadrant;
  return [
    { channel: "communication", title: t(`quadrant.${q}.talkTitle`), body: t(`quadrant.${q}.talk`) },
    { channel: "conflict", title: t(`quadrant.${q}.clashTitle`), body: t(`quadrant.${q}.clash`) },
  ];
}

/**
 * Two people on one circle. Each axis is reported as two levels and the gap
 * between them; the octants where the two differ most are named. No
 * similarity figure: after each person's own level is known, similarity
 * explains almost nothing about how two people get on.
 */
export type AxisGap = { key: "dominance" | "warmth"; a: number; b: number; gap: number };
export type OctantGap = { key: OctantKey; a: number; b: number; gap: number };

export type InterpersonalComparison = {
  axes: AxisGap[];
  octants: OctantGap[];
  widest: OctantGap;
  quadrantA: Quadrant;
  quadrantB: Quadrant;
};

export function compare(a: InterpersonalResult, b: InterpersonalResult): InterpersonalComparison {
  const axes: AxisGap[] = [
    { key: "dominance", a: a.dominance, b: b.dominance, gap: Math.abs(a.dominance - b.dominance) },
    { key: "warmth", a: a.warmth, b: b.warmth, gap: Math.abs(a.warmth - b.warmth) },
  ];
  const octants = ORDER.map((key) => ({ key, a: a.scores[key], b: b.scores[key], gap: Math.abs(a.scores[key] - b.scores[key]) })).sort(
    (x, y) => y.gap - x.gap,
  );
  return { axes, octants, widest: octants[0], quadrantA: a.quadrant, quadrantB: b.quadrant };
}

export const spec: InstrumentSpec<InterpersonalResult> = {
  id: "interpersonal",
  version: 1,
  family: "questionnaire",
  glyph: "◎",
  minutes: 4,
  channels: CHANNELS,
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
    scale: scaleFor("accurate5", t),
    shuffle: true,
    pageSize: 8,
  }),
  score,
  instructions,
  compare,
  // Eight octants are one reading; the result page asks about it once.
  reflectOn: () => [],
};

export default spec;
