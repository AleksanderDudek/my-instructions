import { test } from "node:test";
import assert from "node:assert/strict";
import { SCALES, flip, normalize, scoreLikert, shares, rank, band, dispersion, deviation, elevation, straightlining } from "../../src/core/scoring.js";

test("reverse keying is its own inverse", () => {
  for (const scale of Object.values(SCALES)) {
    for (let v = scale.min; v <= scale.max; v++) {
      assert.equal(flip(flip(v, scale), scale), v);
      assert.ok(flip(v, scale) >= scale.min && flip(v, scale) <= scale.max);
    }
  }
});

test("normalize spans 1..100 inclusive and never leaves the range", () => {
  assert.equal(normalize(8, 8, 40), 1);
  assert.equal(normalize(40, 8, 40), 100);
  for (let raw = 8; raw <= 40; raw++) {
    const n = normalize(raw, 8, 40);
    assert.ok(n >= 1 && n <= 100, `${raw} produced ${n}`);
  }
  // A degenerate scale (one possible value) must not divide by zero.
  assert.equal(normalize(5, 5, 5), 50);
});

test("a consistent responder maxes the scale; a straight-liner does not", () => {
  const items = [
    { id: "a", scale: "X", reverse: false },
    { id: "b", scale: "X", reverse: false },
    { id: "c", scale: "X", reverse: true },
    { id: "d", scale: "X", reverse: true },
  ];
  const consistent = { a: 5, b: 5, c: 1, d: 1 };
  const straight = { a: 5, b: 5, c: 5, d: 5 };
  assert.equal(scoreLikert(items, consistent, SCALES.true5).scores.X, 100);
  assert.equal(scoreLikert(items, straight, SCALES.true5).scores.X, 51);
});

test("unanswered items fall to the midpoint rather than to zero", () => {
  const items = [{ id: "a", scale: "X", reverse: false }, { id: "b", scale: "X", reverse: false }];
  const { scores, answered } = scoreLikert(items, { a: 5 }, SCALES.agree5);
  assert.equal(answered, 1);
  assert.equal(scores.X, 75); // sum 8 of a possible 2..10
});

test("out-of-range answers are clamped, not trusted", () => {
  const items = [{ id: "a", scale: "X", reverse: false }];
  assert.equal(scoreLikert(items, { a: 99 }, SCALES.agree5).scores.X, 100);
  assert.equal(scoreLikert(items, { a: -4 }, SCALES.agree5).scores.X, 1);
});

test("shares always sum to exactly 100", () => {
  const cases = [{ a: 1, b: 1, c: 1 }, { a: 33, b: 33, c: 34 }, { a: 7, b: 11, c: 13, d: 17, e: 19 }, { a: 100 }];
  for (const c of cases) {
    const total = Object.values(shares(c)).reduce((x, y) => x + y, 0);
    assert.equal(total, 100, JSON.stringify(c));
  }
  // All-zero input must not divide by zero.
  assert.deepEqual(shares({ a: 0, b: 0 }), { a: 0, b: 0 });
});

test("ties share a rank and ranks stay ordered", () => {
  const r = rank({ a: 9, b: 9, c: 4, d: 1 });
  assert.deepEqual(r.map((x) => x.rank), [1, 1, 3, 4]);
  for (let i = 1; i < r.length; i++) assert.ok(r[i - 1].score >= r[i].score);
});

test("bands cover the whole 1..100 range without a gap, as keys rather than words", () => {
  const seen = new Set();
  for (let i = 1; i <= 100; i++) seen.add(band(i));
  assert.deepEqual([...seen].sort(), ["band.high", "band.low", "band.moderate", "band.veryHigh", "band.veryLow"]);
});

test("straightlining needs enough evidence before it accuses", () => {
  const few = Array.from({ length: 4 }, (_, i) => ({ id: `x${i}` }));
  const many = Array.from({ length: 12 }, (_, i) => ({ id: `y${i}` }));
  assert.equal(straightlining(few, Object.fromEntries(few.map((i) => [i.id, 3]))), false);
  assert.equal(straightlining(many, Object.fromEntries(many.map((i) => [i.id, 3]))), true);
  assert.equal(straightlining(many, Object.fromEntries(many.map((i, n) => [i.id, n % 2 ? 2 : 4]))), false);
});

/* ── dispersion ───────────────────────────────────────────────────
   The "range" reading. Six instruments had each grown their own
   version of this before it lived here.                             */

test("a perfectly even profile is maximally even and not concentrated", () => {
  const d = dispersion({ a: 50, b: 50, c: 50, d: 50 });
  assert.equal(d.range, 0);
  assert.equal(d.evenness, 100);
  assert.equal(d.focus, 0);
  assert.equal(d.concentrated, false);
});

test("everything in one scale reads as focus rather than spread", () => {
  const d = dispersion({ a: 100, b: 1, c: 1, d: 1 });
  assert.equal(d.range, 99);
  assert.ok(d.evenness < 40, `evenness ${d.evenness} should be low`);
  assert.equal(d.concentrated, true);
});

test("evenness sees the shape that range cannot", () => {
  // The same highest and lowest, so the same range — but one profile keeps its
  // mass in a single scale and the other spreads it, which is the whole point.
  const peaked = dispersion({ a: 90, b: 50, c: 50, d: 50, e: 10 });
  const spread = dispersion({ a: 90, b: 80, c: 50, d: 20, e: 10 });
  assert.equal(peaked.range, spread.range, "the two profiles have the same range");
  assert.notEqual(peaked.evenness, spread.evenness, "and different shapes, which evenness should see");
});

test("evenness is comparable across instruments of different sizes", () => {
  // Normalising by the entropy of an even profile of the same size is what
  // makes a five-scale reading mean the same as an eight-scale one.
  const five = dispersion(Object.fromEntries(Array.from({ length: 5 }, (_, i) => [i, 40])));
  const eight = dispersion(Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i, 40])));
  assert.equal(five.evenness, eight.evenness);
  assert.equal(five.evenness, 100);
});

test("a degenerate profile does not divide by zero", () => {
  assert.deepEqual(dispersion({}), { range: 0, evenness: 100, focus: 0, concentrated: false });
  assert.deepEqual(dispersion({ only: 70 }), { range: 0, evenness: 100, focus: 0, concentrated: false });
});

test("elevation is the mean, and is only meaningful where scales point one way", () => {
  assert.equal(elevation({ a: 10, b: 20, c: 30 }), 20);
  assert.equal(elevation({}), 0);
});

/* ── deviation ────────────────────────────────────────────────────
   A different question from spread, and the one four instruments
   were actually asking.                                             */

test("a flat profile away from the middle has deviation but no spread", () => {
  const scores = { a: 70, b: 70, c: 70, d: 70 };
  assert.equal(dispersion(scores).range, 0, "nothing separates the scales");
  assert.equal(deviation(scores).furthest, 20, "and yet every one of them is high");
});

test("deviation is comparable across instruments of different sizes", () => {
  const two = deviation({ a: 100, b: 100 });
  const six = deviation(Object.fromEntries(Array.from({ length: 6 }, (_, i) => [i, 100])));
  assert.equal(two.distance, six.distance, "both are as far from the middle as it is possible to be");
  assert.equal(two.distance, 100);
});

test("the mean cannot be inflated by a single spike, and furthest can", () => {
  const spike = deviation({ a: 100, b: 50, c: 50, d: 50 });
  assert.equal(spike.furthest, 50);
  assert.ok(spike.mean < 20, `mean ${spike.mean} should stay low with one spike`);
});

test("a profile sitting on the midpoint has no deviation at all", () => {
  assert.deepEqual(deviation({ a: 50, b: 50 }), { furthest: 0, mean: 0, distance: 0 });
  assert.deepEqual(deviation({}), { furthest: 0, mean: 0, distance: 0 });
});
