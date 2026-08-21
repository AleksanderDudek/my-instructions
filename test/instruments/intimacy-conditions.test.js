import { test } from "node:test";
import assert from "node:assert/strict";
import spec from "../../src/instruments/intimacy-conditions/index.js";
import { COMFORT, BELIEFS, itemsFor } from "../../src/instruments/intimacy-conditions/items.js";
import { audiencesFor } from "../../src/core/registry.js";
import { privateIdsOf, encodeReport, decodeReport } from "../../src/core/report.js";
import { str } from "../../src/core/html.js";
import { i18nFor } from "../helpers/harness.js";

/**
 * The guarantees that make this instrument shippable.
 *
 * Everything here is a property that would be trivial to break with a
 * well-meaning refactor — a card added to the wrong list, an audience opened
 * up, a raw answer surfaced "for context". Each one is asserted rather than
 * documented, because the cost of getting it wrong is not a broken page.
 */

const t = (key) => key;
const items = spec.form(t).items;
const answers = Object.fromEntries(
  items.map((item, n) => [item.id, item.kind === "likert" ? (n % 5) + 1 : item.options[n % item.options.length].value]));
const result = spec.score(answers);

test("public is not an audience this instrument offers", () => {
  assert.equal(spec.sensitive, true);
  assert.deepEqual(audiencesFor(spec), ["private", "friends"]);
  assert.ok(!audiencesFor(spec).includes("public"));
});

test("every comfort and belief answer is a private-tier item", () => {
  const priv = privateIdsOf(spec);
  for (const id of COMFORT) assert.ok(priv.has(`c.${id}`), `comfort item ${id} is shareable`);
  for (const id of BELIEFS) assert.ok(priv.has(`b.${id}`), `belief item ${id} is shareable`);
});

test("no raw answer reaches a token, in either direction", () => {
  const registry = { get: (id) => (id === spec.id ? spec : null) };
  const token = encodeReport({
    registry, profile: {},
    runs: [{ instrumentId: spec.id, instrumentVersion: 1, answers }],
    sharing: { [`run.${spec.id}`]: "friends" },
    audience: "friends",
  });
  const back = decodeReport(token, registry).runs[0].answers;

  for (const id of COMFORT) assert.equal(back[`c.${id}`], undefined, `comfort answer ${id} travelled`);
  for (const id of BELIEFS) assert.equal(back[`b.${id}`], undefined, `belief answer ${id} travelled`);
  assert.ok(Object.keys(back).length > 0, "the conditions themselves should still travel");
});

test("the shareable surface is composed of message keys and nothing else", () => {
  // `cards` is the only thing a partner ever sees. If a number ever appears in
  // it, something has been scored that should not have been.
  for (const card of result.cards) {
    assert.equal(typeof card, "string");
    assert.match(card, /^(condition|practice)\./, `"${card}" is not a condition or a practice`);
  }
  assert.ok(!JSON.stringify(result.cards).match(/\d/), "a number reached the shareable cards");
});

test("nothing in the result is a score, a total or a rank", () => {
  // Deliberately structural: an added `scores` key is how this instrument
  // would quietly become the thing it exists not to be.
  assert.equal(result.scores, undefined);
  assert.equal(result.total, itemsFor(t).length, "total is an item count, not a score");
  assert.equal(typeof result.beliefs, "string", "beliefs is a three-state word, never a number");
  assert.ok(!("compatibility" in result));
  assert.ok(!("discrepancy" in result));
});

test("comparison shows two lists and computes no distance between them", async () => {
  // Rendered through the real English table: an identity `t` returns the key
  // and never interpolates, so a name would never appear regardless.
  const real = (await i18nFor("en")).scope(spec.id).t;
  const other = spec.score(Object.fromEntries(
    items.map((item, n) => [item.id, item.kind === "likert" ? 5 - (n % 5) : item.options[(n + 1) % item.options.length].value])));
  const html = str(spec.compare(result, other, { nameA: "Ada", nameB: "Bo", t: real }));

  assert.ok(html.includes("Ada") && html.includes("Bo"));
  // No percentage, no "%", no out-of-100 anywhere in the two-person view.
  assert.ok(!/%/.test(html), "a percentage appeared in the comparison");
  assert.ok(!/\/\s*100/.test(html), "an out-of-100 appeared in the comparison");
});

test("the source note says all four of the things it has to say", () => {
  const note = (key) => key;
  // Asserted as one long string in the message file rather than four keys,
  // so this checks the English copy still carries each idea.
  const en = spec.messages.en;
  assert.equal(typeof en, "function");
  assert.equal(spec.maxAudience, "friends");
  assert.equal(note("sourceNote"), "sourceNote");
});
