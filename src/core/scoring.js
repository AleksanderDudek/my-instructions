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

/**
 * Scales carry their shape here and their wording in the message tables. A
 * point's meaning is not a detail of presentation — "Rarely me" and "Often me"
 * have to divide the range the same way in every language, or the numbers stop
 * being comparable across locales.
 */
const SCALES = {
  agree5: { min: 1, max: 5, short: ["SD", "D", "—", "A", "SA"] },
  agree7: { min: 1, max: 7, short: ["1", "2", "3", "4", "5", "6", "7"] },
  true5: { min: 1, max: 5, short: ["1", "2", "3", "4", "5"] },
};

/** One scale with its labels resolved into the reader's language. */
function scaleFor(name, t) {
  const scale = SCALES[name];
  if (!scale) throw new RangeError(`unknown scale: ${name}`);
  const points = scale.max - scale.min + 1;
  return { ...scale, name, labels: Array.from({ length: points }, (_, i) => t(`scale.${name}.${i}`)) };
}

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/** Reverse-key a single response on a scale. */
const flip = (value, { min, max }) => max + min - value;

/**
 * Map a raw sum onto 1..100 given the sum's own possible range.
 * 1 rather than 0 as the floor: a floor of zero reads as "absent", and no one
 * has zero need for touch or zero conscientiousness — they have the minimum.
 */
function normalize(sum, lo, hi) {
  if (hi === lo) return 50;
  return Math.round(1 + ((sum - lo) / (hi - lo)) * 99);
}

/**
 * Score a Likert questionnaire.
 *
 * @param items   [{ id, scale, reverse }]
 * @param answers { [itemId]: number }
 * @param scaleDef one of SCALES
 * @returns { scores:{[scale]:1..100}, raw:{[scale]:sum}, counts, answered, total }
 */
function scoreLikert(items, answers, scaleDef) {
  const raw = {};
  const counts = {};
  let answered = 0;

  for (const item of items) {
    counts[item.scale] = (counts[item.scale] ?? 0) + 1;
    raw[item.scale] ??= 0;
    const given = answers[item.id];
    // An unanswered item scores at the scale midpoint rather than zero, so a
    // partially finished run degrades gracefully instead of reading as denial.
    const value = Number.isFinite(given) ? clamp(given, scaleDef.min, scaleDef.max) : (scaleDef.min + scaleDef.max) / 2;
    if (Number.isFinite(given)) answered++;
    raw[item.scale] += item.reverse ? flip(value, scaleDef) : value;
  }

  const scores = {};
  for (const [name, sum] of Object.entries(raw)) {
    scores[name] = normalize(sum, counts[name] * scaleDef.min, counts[name] * scaleDef.max);
  }
  return { scores, raw, counts, answered, total: items.length };
}

/** Each scale's share of the total, in percent, summing to 100. Largest-remainder rounding. */
function shares(scores) {
  const entries = Object.entries(scores);
  const total = entries.reduce((a, [, v]) => a + v, 0);
  if (!total) return Object.fromEntries(entries.map(([k]) => [k, 0]));
  const exact = entries.map(([k, v]) => [k, (v / total) * 100]);
  const floored = exact.map(([k, v]) => [k, Math.floor(v)]);
  let short = 100 - floored.reduce((a, [, v]) => a + v, 0);
  const order = exact
    .map(([k, v], i) => [i, v - Math.floor(v)])
    .sort((a, b) => b[1] - a[1]);
  for (const [i] of order) { if (short-- <= 0) break; floored[i][1]++; }
  return Object.fromEntries(floored);
}

/** Scales sorted high to low, as [{ key, score, rank }] — ties share a rank. */
function rank(scores) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  let lastScore = null, lastRank = 0;
  return sorted.map(([key, score], i) => {
    const r = score === lastScore ? lastRank : i + 1;
    lastScore = score; lastRank = r;
    return { key, score, rank: r };
  });
}

/**
 * Verbal band for a 1..100 score, as a message key. Deliberately coarse — the
 * precision is fake, and naming that in five buckets is more honest than a
 * decimal place.
 */
function band(score) {
  if (score >= 80) return "band.veryHigh";
  if (score >= 62) return "band.high";
  if (score >= 39) return "band.moderate";
  if (score >= 21) return "band.low";
  return "band.veryLow";
}

/** Cronbach-style sanity check: did they tick the same box the whole way down? */
function straightlining(items, answers) {
  const given = items.map((i) => answers[i.id]).filter(Number.isFinite);
  if (given.length < 8) return false;
  return new Set(given).size <= 1;
}

export { SCALES, scaleFor, clamp, flip, normalize, scoreLikert, shares, rank, band, straightlining };
