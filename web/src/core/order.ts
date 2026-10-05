/**
 * The order a bank is answered in, after the shuffle.
 *
 * A full randomisation puts two items of one scale next to each other about
 * as often as it separates them, and a reader who meets "I start
 * conversations" straight after "I feel comfortable around people" answers
 * the pair as one question. The usual remedy is to constrain the order:
 * wherever an item follows a sibling, swap it with the next item that is not
 * one and would not itself land beside a sibling. Deterministic, so a resumed
 * draft keeps its order; a bank with one scale is left as it is.
 */
export function spaced<T>(order: readonly T[], scaleOf: (item: T) => string | undefined): T[] {
  const out = [...order];
  for (let i = 1; i < out.length; i++) {
    const prev = scaleOf(out[i - 1]);
    if (prev === undefined || scaleOf(out[i]) !== prev) continue;
    const j = out.findIndex(
      (item, k) => k > i && scaleOf(item) !== prev && (k + 1 >= out.length || scaleOf(out[k + 1]) !== scaleOf(item)),
    );
    if (j === -1) break;
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** True when no two neighbours share a scale. */
export function isSpaced<T>(order: readonly T[], scaleOf: (item: T) => string | undefined): boolean {
  return order.every((item, i) => i === 0 || scaleOf(item) === undefined || scaleOf(item) !== scaleOf(order[i - 1]));
}
