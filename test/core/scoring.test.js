import { test } from "node:test";
import assert from "node:assert/strict";
import { SCALES, flip, normalize, scoreLikert, shares, rank, band, straightlining } from "../../src/core/scoring.js";

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
