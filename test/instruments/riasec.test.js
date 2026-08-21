import { test } from "node:test";
import assert from "node:assert/strict";
import spec, { separation, consistencyOf, LETTER } from "../../src/instruments/riasec/index.js";
import { ORDER, ITEMS } from "../../src/instruments/riasec/items.js";

/**
 * The hexagon.
 *
 * The three-letter code is easy; what it means depends on two things the code
 * does not show. Distance around the hexagon decides whether the top two
 * interests combine or pull, and the spread decides whether the ordering is
 * signal at all. Both are computed, so both are tested.
 */

const t = (key) => key;
const items = spec.form(t).items;

/** Answers that push one interest to the top and the rest to the floor. */
const favouring = (type) =>
  Object.fromEntries(items.map((i) => [i.id, i.scale === type ? (i.reverse ? 1 : 5) : (i.reverse ? 5 : 1)]));

test("the hexagon wraps, so R and C are neighbours", () => {
  assert.equal(separation("realistic", "investigative"), 1);
  assert.equal(separation("realistic", "conventional"), 1, "the ends of the list are adjacent on a hexagon");
  assert.equal(separation("realistic", "social"), 3, "three steps is opposite");
  assert.equal(separation("artistic", "conventional"), 3);
  assert.equal(separation("realistic", "realistic"), 0);
});

test("separation is symmetric for every pair", () => {
  for (const a of ORDER) for (const b of ORDER) {
    assert.equal(separation(a, b), separation(b, a), `${a}/${b}`);
  }
});

test("consistency follows distance, not preference", () => {
  assert.equal(consistencyOf("realistic", "investigative"), "high");
  assert.equal(consistencyOf("realistic", "artistic"), "medium");
  assert.equal(consistencyOf("realistic", "social"), "low");
  assert.equal(consistencyOf("artistic", "conventional"), "low");
});

test("every type can lead, and each produces its own letter first", () => {
  for (const type of ORDER) {
    const result = spec.score(favouring(type));
    assert.equal(result.top[0], type, `${type} did not come out on top`);
    assert.equal(result.code[0], LETTER[type]);
    assert.match(result.code, /^[RIASEC]{3}$/);
  }
});

test("an undifferentiated profile is reported as such rather than given three letters to believe", () => {
  const flat = Object.fromEntries(items.map((i) => [i.id, 3]));
  const result = spec.score(flat);
  assert.equal(result.flat, true);
  assert.ok(result.spread < 20);
  const cards = spec.instructions(result, t);
  assert.ok(cards.some((c) => c.title === "instructions.flatTitle"), "the flat profile is not flagged to the reader");
});

test("a strongly differentiated profile is not flagged as flat", () => {
  const result = spec.score(favouring("artistic"));
  assert.equal(result.flat, false);
  assert.ok(result.spread >= 20);
});

test("opposed top interests produce the tension card", () => {
  // Push Artistic and Conventional — opposite corners — above everything else.
  const answers = Object.fromEntries(items.map((i) => {
    const wanted = i.scale === "artistic" || i.scale === "conventional";
    return [i.id, wanted ? (i.reverse ? 1 : 5) : (i.reverse ? 5 : 1)];
  }));
  const result = spec.score(answers);
  assert.deepEqual(result.top.slice(0, 2).sort(), ["artistic", "conventional"]);
  assert.equal(result.opposed, true);
  assert.ok(spec.instructions(result, t).some((c) => c.title === "instructions.tensionTitle"));
});

test("the item bank is balanced across all six interests", () => {
  const per = {};
  for (const item of ITEMS) per[item.scale] = (per[item.scale] ?? 0) + 1;
  assert.equal(Object.keys(per).length, 6);
  assert.equal(new Set(Object.values(per)).size, 1, `uneven blocks: ${JSON.stringify(per)}`);
});
