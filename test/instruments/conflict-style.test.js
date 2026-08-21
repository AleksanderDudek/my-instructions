import { test } from "node:test";
import assert from "node:assert/strict";
import { modeOf, fallbackOf, MIDPOINT, MIDDLE } from "../../src/instruments/conflict-style/index.js";

/**
 * The plane, and where its regions actually sit.
 *
 * The five modes are derived rather than asked for, so the derivation is the
 * part that can be wrong — particularly the middle, which is a region and not
 * a corner. Presentations of this model routinely draw compromising as a fifth
 * direction, which is why it gets its own tests here.
 */

test("the four corners fall where the model says they do", () => {
  assert.equal(modeOf(90, 10), "competing");
  assert.equal(modeOf(90, 90), "collaborating");
  assert.equal(modeOf(10, 90), "accommodating");
  assert.equal(modeOf(10, 10), "avoiding");
});

test("compromising is the middle of both scales, not a fifth corner", () => {
  assert.equal(modeOf(50, 50), "compromising");
  assert.equal(modeOf(MIDPOINT + MIDDLE, MIDPOINT + MIDDLE), "compromising", "the edge of the middle is still the middle");
  assert.equal(modeOf(MIDPOINT + MIDDLE + 1, MIDPOINT + MIDDLE + 1), "collaborating", "one point past it is a corner");
});

test("being central on one concern only is not compromising", () => {
  // High assertiveness with middling cooperativeness is still a push.
  assert.equal(modeOf(95, 50), "competing");
  assert.equal(modeOf(5, 50), "avoiding");
});

test("every point on the plane resolves to exactly one mode", () => {
  const seen = new Set();
  for (let a = 1; a <= 100; a += 3) {
    for (let c = 1; c <= 100; c += 3) {
      const mode = modeOf(a, c);
      assert.ok(mode, `no mode at ${a},${c}`);
      seen.add(mode);
    }
  }
  assert.deepEqual([...seen].sort(), ["accommodating", "avoiding", "collaborating", "competing", "compromising"]);
});

test("the fallback drops the weaker concern rather than inventing a new one", () => {
  // A collaborator who pushes harder than they yield falls back to pushing.
  assert.equal(fallbackOf("collaborating", 90, 60), "competing");
  assert.equal(fallbackOf("collaborating", 60, 90), "accommodating");
  // Everyone else's last resort is to leave the field.
  assert.equal(fallbackOf("competing", 90, 10), "avoiding");
  assert.equal(fallbackOf("accommodating", 10, 90), "avoiding");
  assert.equal(fallbackOf("avoiding", 10, 10), "avoiding");
});

test("a fallback is never the mode it falls back from", () => {
  for (const [mode, a, c] of [["competing", 90, 10], ["accommodating", 10, 90], ["collaborating", 90, 60], ["compromising", 50, 50]]) {
    assert.notEqual(fallbackOf(mode, a, c), mode, `${mode} falls back to itself`);
  }
});
