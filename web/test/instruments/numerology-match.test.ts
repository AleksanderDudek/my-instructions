import { describe, expect, test } from "vitest";
import { match, profile } from "@/instruments/numerology/compute";

/**
 * The comparison arithmetic, exercised for the first time.
 *
 * `match()` has been in `compute.ts` since the port and was reachable only
 * through `spec.compare()`, which nothing rendered — so every line of it has
 * shipped untested. The ad-hoc calculator is its first real caller, and a
 * scoring function nobody has run is exactly where a `NaN` waits.
 *
 * Nothing here asserts that the numbers are *right*: there is no fact of the
 * matter about numerological compatibility, and a test claiming otherwise would
 * be the same overreach the instrument's own `sourceNote` refuses. What is
 * tested is that the arithmetic is arithmetic — bounded, total, deterministic,
 * and the same whichever way round the two dates are handed in.
 */

const t = (key: string) => key;
const chart = (d: number, m: number, y: number) => profile(d, m, y, "");

/** A spread of dates: leap day, century boundary, either side of a Chinese new year. */
const DATES: [number, number, number][] = [
  [29, 2, 2000],
  [1, 1, 1900],
  [31, 12, 2049],
  [8, 1, 1993],
  [20, 2, 1985],
  [15, 2, 1985],
  [3, 7, 1966],
  [11, 11, 2011],
];

describe("every pair of dates", () => {
  const pairs = DATES.flatMap((a) => DATES.map((b) => [a, b] as const));

  test.each(pairs)("%j against %j is a finite, bounded reading", (a, b) => {
    const reading = match(chart(...a), chart(...b), t);

    expect(Number.isFinite(reading.total)).toBe(true);
    expect(reading.total).toBeGreaterThanOrEqual(0);
    expect(reading.total).toBeLessThanOrEqual(100);

    // The total is the four parts and nothing else. A total that drifted from
    // its own bars would be the one number a reader trusts and cannot check.
    expect(reading.parts.reduce((sum, part) => sum + part.v, 0)).toBe(reading.total);

    for (const part of reading.parts) {
      expect(Number.isFinite(part.v), part.t).toBe(true);
      expect(part.v).toBeGreaterThanOrEqual(0);
      expect(part.v, `${part.t} exceeded its own maximum`).toBeLessThanOrEqual(part.max);
      expect(part.note.length).toBeGreaterThan(0);
    }

    // A digital root, so 1..9 — never 0, which is what a bad reduction returns.
    expect(reading.unionNum).toBeGreaterThanOrEqual(1);
    expect(reading.unionNum).toBeLessThanOrEqual(9);
  });

  /**
   * Whoever is handed in first must not change the answer.
   *
   * This is the defect the feature would most plausibly have, and the one a
   * reader would most reasonably be angry about: checking your partner against
   * yourself and getting a different number from checking yourself against your
   * partner. The lists of what each fills in the other do swap, correctly.
   */
  test.each(pairs)("%j against %j scores the same either way round", (a, b) => {
    const forward = match(chart(...a), chart(...b), t);
    const backward = match(chart(...b), chart(...a), t);

    expect(backward.total).toBe(forward.total);
    expect(backward.band).toBe(forward.band);
    expect(backward.unionNum).toBe(forward.unionNum);
    expect(backward.parts.map((p) => p.v)).toEqual(forward.parts.map((p) => p.v));
    expect(backward.aFills).toEqual(forward.bFills);
    expect(backward.bFills).toEqual(forward.aFills);
  });
});

test("a date against itself is deterministic", () => {
  const mine = chart(8, 1, 1993);
  expect(JSON.stringify(match(mine, mine, t))).toBe(JSON.stringify(match(mine, mine, t)));
});

test("a chart against itself fills nothing in either direction", () => {
  // Same squares lit, so neither has a number the other lacks. Worth pinning:
  // an off-by-one in the set arithmetic would show up here first.
  const mine = chart(8, 1, 1993);
  const reading = match(mine, mine, t);
  expect(reading.aFills).toEqual([]);
  expect(reading.bFills).toEqual([]);
  expect(reading.inter.length).toBeGreaterThan(0);
});

test("the reading is language-free apart from the notes it was handed", () => {
  // `t` renders every word, so a reading built with an identity translator
  // contains message keys and no prose. That is what lets the same comparison
  // be drawn in four languages from one calculation.
  const reading = match(chart(8, 1, 1993), chart(3, 7, 1966), t);
  for (const part of reading.parts) expect(part.note).toMatch(/^[a-z]+\.[A-Za-z.]+$/);
  expect(reading.band).toMatch(/^match\.band\./);
});
