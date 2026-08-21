import { test } from "node:test";
import assert from "node:assert/strict";
import { dr, sumd, reduceMaster, profile, match } from "../../src/instruments/numerology/compute.js";

test("the digital root reduces to 1–9 and never yields 0 from a sum", () => {
  assert.equal(dr(9), 9);
  assert.equal(dr(18), 9);      // not 0 — this is the whole point
  assert.equal(dr(27), 9);
  assert.equal(dr(10), 1);
  assert.equal(dr(31), 4);
  assert.equal(dr(0), 0);       // a genuine zero, from |a − a|, survives
});

test("master numbers survive reduction; everything else collapses to one digit", () => {
  assert.deepEqual(reduceMaster(31), { value: 4, steps: [31, 4] });
  assert.deepEqual(reduceMaster(29), { value: 11, steps: [29, 11] });
  assert.deepEqual(reduceMaster(33), { value: 33, steps: [33] });
  assert.equal(reduceMaster(22).value, 22);
  assert.equal(reduceMaster(58).value, 4);   // 58 → 13 → 4, no master on the way
  assert.equal(reduceMaster(48).value, 3);   // 48 → 12 → 3
});

test("8 January 1993 produces the documented chart", () => {
  const p = profile(8, 1, 1993, "");
  assert.equal(p.pretty, "8 January 1993");
  assert.equal(p.weekday, "Friday");

  assert.deepEqual([p.A, p.B, p.C], [1, 8, 4]);          // MM=01, DD=08, YYYY=1993 → 22 → 4
  assert.deepEqual([p.rise1, p.rise2], [9, 3]);          // 1+8=9 ; 8+4=12 → 3
  assert.equal(p.spire, 3);                              // 9+3=12 → 3
  assert.equal(p.crown, 5);                              // 1+4=5, the month/year axis
  assert.deepEqual([p.root1, p.root2], [7, 4]);          // |1−8| ; |8−4|
  assert.equal(p.base, 3);                               // |7−4|

  assert.equal(p.total, 31);
  assert.equal(p.destiny.value, 4);
});

test("an absolute difference of equal operands is kept as a true zero", () => {
  const p = profile(14, 6, 1993, "");
  assert.deepEqual([p.root1, p.root2], [1, 1]);
  assert.equal(p.base, 0);
  assert.equal(p.destiny.value, 33);   // 1+4+0+6+1+9+9+3 = 33, a master number
});

test("the square counts digits of DDMMYYYY and ignores zeros", () => {
  const { counts } = profile(8, 1, 1993, "");
  assert.deepEqual(counts, { 1: 2, 2: 0, 3: 1, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1, 9: 2 });
  assert.equal(Object.values(counts).reduce((a, b) => a + b, 0), 6);   // the two zeros are not placed
  assert.equal(sumd("08011993"), 31);
});

test("comparison is symmetric and bounded", () => {
  const a = profile(8, 1, 1993, "A");
  const b = profile(14, 6, 1990, "B");
  assert.equal(match(a, b).total, match(b, a).total);
  assert.equal(match(a, b).unionNum, match(b, a).unionNum);
});

test("comparison scores stay within 0–100 across a wide sample", () => {
  const dates = [[1, 1, 1950], [29, 2, 2000], [8, 1, 1993], [14, 6, 1990],
                 [31, 12, 2049], [23, 1, 1993], [15, 8, 1975], [3, 11, 1988]];
  for (const A of dates) {
    for (const B of dates) {
      const m = match(profile(...A, ""), profile(...B, ""));
      assert.ok(m.total >= 0 && m.total <= 100, `${A} vs ${B} scored ${m.total}`);
      assert.ok(m.parts.every((p) => p.v >= 0 && p.v <= p.max));
      assert.ok(typeof m.band === "string" && m.band.length > 0);
    }
  }
});

test("opposite animals score worse than allied animals", () => {
  const rat = profile(1, 6, 1996, "");      // Rat
  const horse = profile(1, 6, 2002, "");    // Horse — six signs opposite
  const dragon = profile(1, 6, 2000, "");   // Dragon — same triad as Rat
  assert.equal(rat.animal[0], "Rat");
  assert.equal(horse.animal[0], "Horse");
  assert.equal(dragon.animal[0], "Dragon");

  const clash = match(rat, horse).parts.find((p) => p.t === "Chinese zodiac").v;
  const ally = match(rat, dragon).parts.find((p) => p.t === "Chinese zodiac").v;
  assert.ok(ally > clash, `ally ${ally} should beat clash ${clash}`);
});
