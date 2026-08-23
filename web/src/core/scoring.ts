/**
 * Shared psychometrics.
 *
 * Three ideas do all the work for every questionnaire in the app:
 *
 *   1. A *scale* is a named set of items. An item belongs to exactly one scale
 *      and is either forward- or reverse-keyed.
 *   2. Reverse keying is `max + min - answer`, so on a 1..5 scale a 5 becomes
 *      a 1. Reverse items exist to defeat acquiescence bias — the tendency to
 *      agree with everything — and a scale without them measures agreeableness
 *      more than it measures its own construct.
 *   3. Raw sums are meaningless across scales of different lengths, so every
 *      score is rescaled to 1..100 against the range that scale could possibly
 *      have produced. That, not the raw sum, is what gets stored and compared.
 */
import type { Answers, T, ScaleDef } from "./types";

/**
 * Scales carry their shape here and their wording in the message tables. A
 * point's meaning is not a detail of presentation — "Rarely me" and "Often me"
 * have to divide the range the same way in every language, or the numbers stop
 * being comparable across locales.
 */
export const SCALES = {
  agree5: { min: 1, max: 5, short: ["SD", "D", "—", "A", "SA"] },
  agree7: { min: 1, max: 7, short: ["1", "2", "3", "4", "5", "6", "7"] },
  true5: { min: 1, max: 5, short: ["1", "2", "3", "4", "5"] },
} as const;

export type ScaleName = keyof typeof SCALES;
export type Scale = { min: number; max: number; short: readonly string[] };

/** One scale with its labels resolved into the reader's language. */
export function scaleFor(name: string, t: T): ScaleDef {
  const scale = SCALES[name as ScaleName];
  if (!scale) throw new RangeError(`unknown scale: ${name}`);
  const points = scale.max - scale.min + 1;
  return {
    ...scale,
    short: [...scale.short],
    name,
    labels: Array.from({ length: points }, (_, i) => t(`scale.${name}.${i}`)),
  };
}

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Reverse-key a single response on a scale. */
export const flip = (value: number, { min, max }: Scale) => max + min - value;

/**
 * Map a raw sum onto 1..100 given the sum's own possible range.
 * 1 rather than 0 as the floor: a floor of zero reads as "absent", and no one
 * has zero need for touch or zero conscientiousness — they have the minimum.
 */
export function normalize(sum: number, lo: number, hi: number): number {
  if (hi === lo) return 50;
  return Math.round(1 + ((sum - lo) / (hi - lo)) * 99);
}

export type ScoredItem = { id: string; scale: string; reverse?: boolean };
export type LikertScores = {
  scores: Record<string, number>;
  raw: Record<string, number>;
  counts: Record<string, number>;
  answered: number;
  total: number;
};

/** Score a Likert questionnaire. */
export function scoreLikert(items: ScoredItem[], answers: Answers, scaleDef: Scale): LikertScores {
  const raw: Record<string, number> = {};
  const counts: Record<string, number> = {};
  let answered = 0;

  for (const item of items) {
    counts[item.scale] = (counts[item.scale] ?? 0) + 1;
    raw[item.scale] ??= 0;
    const given = answers[item.id];
    // An unanswered item scores at the scale midpoint rather than zero, so a
    // partially finished run degrades gracefully instead of reading as denial.
    const isNumber = typeof given === "number" && Number.isFinite(given);
    const value = isNumber ? clamp(given, scaleDef.min, scaleDef.max) : (scaleDef.min + scaleDef.max) / 2;
    if (isNumber) answered++;
    raw[item.scale] += item.reverse ? flip(value, scaleDef) : value;
  }

  const scores: Record<string, number> = {};
  for (const [name, sum] of Object.entries(raw)) {
    scores[name] = normalize(sum, counts[name] * scaleDef.min, counts[name] * scaleDef.max);
  }
  return { scores, raw, counts, answered, total: items.length };
}

/** Each scale's share of the total, in percent, summing to 100. Largest-remainder rounding. */
export function shares(scores: Record<string, number>): Record<string, number> {
  const entries = Object.entries(scores);
  const total = entries.reduce((a, [, v]) => a + v, 0);
  if (!total) return Object.fromEntries(entries.map(([k]) => [k, 0]));
  const exact = entries.map(([k, v]) => [k, (v / total) * 100] as const);
  const floored = exact.map(([k, v]) => [k, Math.floor(v)] as [string, number]);
  let short = 100 - floored.reduce((a, [, v]) => a + v, 0);
  const order = exact.map(([, v], i) => [i, v - Math.floor(v)] as const).sort((a, b) => b[1] - a[1]);
  for (const [i] of order) {
    if (short-- <= 0) break;
    floored[i][1]++;
  }
  return Object.fromEntries(floored);
}

/**
 * How spread out a profile is — the *range* reading.
 *
 * `range` is the blunt one, highest minus lowest: what a reader understands
 * without being taught anything, and what decides whether the ordering beneath
 * it is worth printing at all.
 *
 * `evenness` is the principled one: the entropy of the shares, normalised so
 * that 100 is perfectly even and 0 is everything in one scale. Range looks only
 * at the two extremes and cannot tell 90/50/50/50/10 from 90/80/50/20/10;
 * entropy sees the whole shape.
 */
export function dispersion(scores: Record<string, number>) {
  const values = Object.values(scores).filter(Number.isFinite);
  if (values.length < 2) return { range: 0, evenness: 100, focus: 0, concentrated: false };

  const range = Math.max(...values) - Math.min(...values);
  const total = values.reduce((a, b) => a + b, 0);
  const entropy = -values.reduce((acc, v) => {
    const share = v / total;
    return acc + (share > 0 ? share * Math.log(share) : 0);
  }, 0);
  const evenness = Math.round((entropy / Math.log(values.length)) * 100);

  return {
    range,
    evenness,
    focus: 100 - evenness,
    // Below about fifteen points between highest and lowest, the ordering is
    // mostly measurement noise.
    concentrated: range >= 15,
  };
}

/**
 * How far a profile sits from the neutral point — a different question from
 * `dispersion`, and the one four instruments were actually asking.
 *
 * Spread asks whether the scales differ *from each other*; deviation asks
 * whether they differ *from the middle*. A person at 70 on everything has no
 * spread and a lot of deviation, and telling them "no strong pattern" would be
 * wrong.
 */
export function deviation(scores: Record<string, number>, midpoint = 50) {
  const values = Object.values(scores).filter(Number.isFinite);
  if (!values.length) return { furthest: 0, mean: 0, distance: 0 };

  const offsets = values.map((v) => Math.abs(v - midpoint));
  const norm = Math.hypot(...offsets);
  const ceiling = Math.hypot(...values.map(() => midpoint));

  return {
    furthest: Math.round(Math.max(...offsets)),
    mean: Math.round(offsets.reduce((a, b) => a + b, 0) / offsets.length),
    distance: Math.round((norm / ceiling) * 100),
  };
}

/**
 * The average height of a profile — the *level* reading, where it applies.
 * Only meaningful when every scale points the same way. On Big Five it is
 * meaningless by construction: a high score on emotional reactivity is not
 * more of anything good.
 */
export const elevation = (scores: Record<string, number>) => {
  const values = Object.values(scores).filter(Number.isFinite);
  return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
};

export type Ranked = { key: string; score: number; rank: number };

/** Scales sorted high to low. Ties share a rank. */
export function rank(scores: Record<string, number>): Ranked[] {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  let lastScore: number | null = null;
  let lastRank = 0;
  return sorted.map(([key, score], i) => {
    const r = score === lastScore ? lastRank : i + 1;
    lastScore = score;
    lastRank = r;
    return { key, score, rank: r };
  });
}

/**
 * Verbal band for a 1..100 score, as a message key. Deliberately coarse — the
 * precision is fake, and naming that in five buckets is more honest than a
 * decimal place.
 */
export function band(score: number): string {
  if (score >= 80) return "band.veryHigh";
  if (score >= 62) return "band.high";
  if (score >= 39) return "band.moderate";
  if (score >= 21) return "band.low";
  return "band.veryLow";
}

/** Did they tick the same box the whole way down? */
export function straightlining(items: { id: string }[], answers: Answers): boolean {
  const given = items.map((i) => answers[i.id]).filter((v): v is number => typeof v === "number");
  if (given.length < 8) return false;
  return new Set(given).size <= 1;
}
