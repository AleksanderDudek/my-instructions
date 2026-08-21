import { test } from "node:test";
import assert from "node:assert/strict";
import { mulberry32, shuffled } from "../../src/ui/pages/runner.js";

test("the shuffle is a permutation, not a sample", () => {
  const ids = Array.from({ length: 45 }, (_, i) => `i${i}`);
  const out = shuffled(ids, 12345);
  assert.equal(out.length, ids.length);
  assert.deepEqual([...out].sort(), [...ids].sort());
});

test("the same seed always deals the same order", () => {
  const ids = Array.from({ length: 40 }, (_, i) => `i${i}`);
  assert.deepEqual(shuffled(ids, 7), shuffled(ids, 7));
  assert.notDeepEqual(shuffled(ids, 7), shuffled(ids, 8));
});

test("the shuffle actually moves things — a stored order is worth storing", () => {
  const ids = Array.from({ length: 40 }, (_, i) => `i${i}`);
  const out = shuffled(ids, 99);
  const fixed = out.filter((id, i) => id === ids[i]).length;
  assert.ok(fixed < 8, `${fixed} of 40 items never moved`);
});

test("the generator stays inside [0,1)", () => {
  const rnd = mulberry32(42);
  for (let i = 0; i < 5000; i++) { const v = rnd(); assert.ok(v >= 0 && v < 1); }
});
