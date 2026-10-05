import { describe, expect, test } from "vitest";
import { band, deviation, normalize, rank, scaleFor, scoreLikert, sideOf, straightlining } from "@/core/scoring";

/**
 * The arithmetic every questionnaire rests on, held in fixtures.
 *
 * Nothing tested `normalize`, `band` edges, `rank` ties or the midpoint until
 * the psychometric audit found that an all-neutral reader scored 51 and read
 * as "high" on every scale that tested `>= 50`. These are the cases that
 * audit wrote down.
 */
describe("normalize", () => {
  test("maps the range onto 1..100 with the exact middle at 50", () => {
    expect(normalize(10, 10, 50)).toBe(1);
    expect(normalize(50, 10, 50)).toBe(100);
    expect(normalize(30, 10, 50)).toBe(50);
    // An empty range cannot be placed; the middle is the honest answer.
    expect(normalize(3, 3, 3)).toBe(50);
  });

  test("an all-neutral set of answers lands on the middle, not above it", () => {
    const scale = scaleFor("accurate5", (k) => k);
    const items = Array.from({ length: 10 }, (_, i) => ({ id: `q${i}`, scale: "x", reverse: i % 2 === 0 }));
    const answers = Object.fromEntries(items.map((i) => [i.id, 3]));
    expect(scoreLikert(items, answers, scale).scores.x).toBe(50);
    expect(sideOf(50)).toBe("low");
    expect(sideOf(51)).toBe("high");
  });
});

describe("scoreLikert", () => {
  const scale = scaleFor("accurate5", (k) => k);
  const items = [
    { id: "a", scale: "s", reverse: false },
    { id: "b", scale: "s", reverse: true },
  ];

  test("reverse keying mirrors the scale", () => {
    expect(scoreLikert(items, { a: 5, b: 1 }, scale).scores.s).toBe(100);
    expect(scoreLikert(items, { a: 1, b: 5 }, scale).scores.s).toBe(1);
  });

  test("counts what was answered and what was not", () => {
    const r = scoreLikert(items, { a: 5 }, scale);
    expect(r.answered).toBe(1);
    expect(r.total).toBe(2);
  });
});

describe("band", () => {
  test("cuts where the copy says it does", () => {
    expect(band(80)).toBe("band.veryHigh");
    expect(band(79)).toBe("band.high");
    expect(band(62)).toBe("band.high");
    expect(band(61)).toBe("band.moderate");
    expect(band(39)).toBe("band.moderate");
    expect(band(38)).toBe("band.low");
    expect(band(21)).toBe("band.low");
    expect(band(20)).toBe("band.veryLow");
  });
});

describe("rank", () => {
  test("ties share a rank and keep their order", () => {
    const ranked = rank({ a: 70, b: 90, c: 70, d: 10 });
    expect(ranked.map((r) => [r.key, r.rank])).toEqual([
      ["b", 1],
      ["a", 2],
      ["c", 2],
      ["d", 4],
    ]);
  });
});

describe("deviation", () => {
  test("measures distance from the middle, not spread", () => {
    expect(deviation({ a: 70, b: 70, c: 70 }).furthest).toBe(20);
    expect(deviation({ a: 50, b: 50 }).furthest).toBe(0);
    expect(deviation({}).furthest).toBe(0);
  });
});

describe("straightlining", () => {
  const items = Array.from({ length: 10 }, (_, i) => ({ id: `q${i}` }));
  test("flags one answer all the way down, and only that", () => {
    expect(straightlining(items, Object.fromEntries(items.map((i) => [i.id, 4])))).toBe(true);
    expect(straightlining(items, Object.fromEntries(items.map((i, n) => [i.id, n % 2 ? 4 : 2])))).toBe(false);
    // Too few answers to call.
    expect(straightlining(items.slice(0, 4), { q0: 3, q1: 3, q2: 3, q3: 3 })).toBe(false);
  });
});
