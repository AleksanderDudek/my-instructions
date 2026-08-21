import { test } from "node:test";
import assert from "node:assert/strict";
import spec from "../../src/instruments/jungian/index.js";
import { temperamentOf } from "../../src/instruments/jungian/index.js";
import { PERCEIVING, JUDGING, OPPOSITE, EXTRAVERTED, ITEMS } from "../../src/instruments/jungian/items.js";

/**
 * Type dynamics.
 *
 * The four-letter code is derived rather than asked for, which means the
 * derivation is the part that can be wrong. Jung's rules are specific: the
 * auxiliary does the other job in the other attitude, the inferior is the
 * mirror of the dominant, and the last letter of the code reports which of
 * the top pair faces outward. These hold for every possible answer set, so
 * the tests say so rather than checking three worked examples.
 */

const t = (key) => key;
const items = spec.form(t).items;

/** Answers that push one function to the top and everything else to the floor. */
function favouring(fn) {
  return Object.fromEntries(items.map((i) => [i.id, i.scale === fn ? (i.reverse ? 1 : 5) : (i.reverse ? 5 : 1)]));
}

test("every function can be made dominant by answering for it", () => {
  for (const fn of [...PERCEIVING, ...JUDGING]) {
    assert.equal(spec.score(favouring(fn)).dominant, fn, `${fn} did not come out on top`);
  }
});

test("the auxiliary does the other job in the other attitude", () => {
  for (const fn of [...PERCEIVING, ...JUDGING]) {
    const { dominant, auxiliary } = spec.score(favouring(fn));
    const domPerceives = PERCEIVING.includes(dominant);
    assert.equal(PERCEIVING.includes(auxiliary), !domPerceives, `${dominant}/${auxiliary}: same job`);
    assert.notEqual(EXTRAVERTED.has(auxiliary), EXTRAVERTED.has(dominant), `${dominant}/${auxiliary}: same attitude`);
  }
});

test("the inferior is the mirror of the dominant, and the tertiary of the auxiliary", () => {
  for (const fn of [...PERCEIVING, ...JUDGING]) {
    const r = spec.score(favouring(fn));
    assert.equal(r.inferior, OPPOSITE[r.dominant]);
    assert.equal(r.tertiary, OPPOSITE[r.auxiliary]);
    assert.equal(new Set(r.stack).size, 4, "a function appears twice in the stack");
  }
});

test("the code reports the stack it was derived from", () => {
  // Ne-dominant with Ti support is the arrangement the letters ENTP name.
  const ne = spec.score(favouring("ne"));
  assert.equal(ne.dominant, "ne");
  assert.equal(ne.code[0], "E", "an outward dominant reads as E");
  assert.equal(ne.code[1], "N");
  assert.equal(ne.code[3], "P", "an outward perceiver reads as P");

  const si = spec.score(favouring("si"));
  assert.equal(si.code[0], "I", "an inward dominant reads as I");
  assert.equal(si.code[1], "S");
  assert.equal(si.code[3], "J", "an outward judge reads as J");
});

test("every code produced is a well-formed four-letter type", () => {
  const seen = new Set();
  for (const fn of [...PERCEIVING, ...JUDGING]) {
    const { code } = spec.score(favouring(fn));
    assert.match(code, /^[EI][NS][TF][JP]$/, `${fn} produced "${code}"`);
    seen.add(code);
  }
  assert.equal(seen.size, 8, "eight dominant functions should give eight distinct codes");
});

test("a close top pair is reported as unsettled rather than decided", () => {
  const flat = Object.fromEntries(items.map((i) => [i.id, 3]));
  const result = spec.score(flat);
  assert.equal(result.confident, false);
  assert.ok(result.margin < 6);
  assert.equal(spec.instructions(result, t).some((c) => c.title === "instructions.provisionalTitle"), true);
});

test("the item bank is balanced across all eight functions", () => {
  const per = {};
  for (const item of ITEMS) per[item.scale] = (per[item.scale] ?? 0) + 1;
  assert.equal(Object.keys(per).length, 8);
  assert.equal(new Set(Object.values(per)).size, 1, `uneven blocks: ${JSON.stringify(per)}`);
});

/* ── temperament ──────────────────────────────────────────────────
   A grouping of the codes rather than a separate measurement, so it
   is derived — and the derivation covers all sixteen or it is wrong. */

test("every one of the sixteen codes lands in exactly one temperament", () => {
  const groups = {};
  for (const e of "EI") for (const n of "NS") for (const t of "TF") for (const j of "JP") {
    const code = e + n + t + j;
    const group = temperamentOf(code);
    assert.ok(group, `${code} produced no temperament`);
    (groups[group] ??= []).push(code);
  }
  assert.deepEqual(Object.keys(groups).sort(), ["improviser", "interpreter", "steward", "systematiser"]);
  // Four groups of four: the concrete types split on J/P, the abstract on T/F.
  for (const [group, codes] of Object.entries(groups)) assert.equal(codes.length, 4, `${group} has ${codes.length}`);
});

test("temperament follows the documented cut, not the dominant function", () => {
  assert.equal(temperamentOf("ISTJ"), "steward");
  assert.equal(temperamentOf("ESFJ"), "steward");
  assert.equal(temperamentOf("ESTP"), "improviser");
  assert.equal(temperamentOf("ISFP"), "improviser");
  assert.equal(temperamentOf("INFP"), "interpreter");
  assert.equal(temperamentOf("ENFJ"), "interpreter");
  assert.equal(temperamentOf("INTJ"), "systematiser");
  assert.equal(temperamentOf("ENTP"), "systematiser");
});
