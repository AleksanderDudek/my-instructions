import { test } from "node:test";
import assert from "node:assert/strict";
import spec, { asText, grouped } from "../../src/instruments/intimacy-map/index.js";
import { AREAS, INTEREST } from "../../src/instruments/intimacy-map/areas.js";
import { audiencesFor } from "../../src/core/registry.js";
import { makeStore, LocalAdapter } from "../../src/core/store.js";
import { fakeStorage, i18nFor } from "../helpers/harness.js";

/**
 * The guarantees that let this one exist at all.
 *
 * Every property below would be easy to lose to a reasonable-looking change —
 * a draft added for convenience, an audience opened up, a count added as a
 * progress affordance. Each is asserted rather than trusted to a comment.
 */

const t = (key) => key;
const items = spec.form(t).items;
const answers = Object.fromEntries(items.map((item, n) => [item.id, item.options[n % item.options.length].value]));
const result = spec.score(answers);

test("it is session-only and therefore not shareable at all", () => {
  assert.equal(spec.persistence, "session");
  assert.equal(spec.sensitive, true);
  assert.deepEqual(audiencesFor(spec), ["private"], "a worksheet that is never saved must not be linkable");
});

test("finishing it writes nothing to storage", async () => {
  const backing = fakeStorage();
  const store = makeStore(new LocalAdapter(backing));

  await store.saveRun(
    { instrumentId: spec.id, instrumentVersion: 1, answers, result },
    { session: spec.persistence === "session" });

  assert.ok(await store.run(spec.id), "it should be readable while the tab is open");

  const keys = Array.from({ length: backing.length }, (_, i) => backing.key(i));
  const dump = keys.map((k) => backing.getItem(k)).join("");
  assert.equal(keys.some((k) => k.includes(spec.id)), false, "a key was written");
  assert.equal(dump.includes("restraint"), false, "an answer reached storage");
  assert.equal(JSON.stringify(await store.exportAll()).includes(spec.id), false, "it reached an export");
});

test("the result carries no count, no score and no total", () => {
  // A meter would turn a short honest answer into a row of near-empty bars.
  const flat = JSON.stringify(result);
  assert.equal(result.scores, undefined);
  assert.equal(result.total, undefined);
  assert.equal(result.answered, undefined);
  assert.equal(/"(count|score|percent|complete)"/.test(flat), false, "a count crept into the result");
});

test("every area can be answered, and an unanswered one is absent rather than assumed", () => {
  assert.equal(Object.keys(result.areas).length, AREAS.length);

  const partial = spec.score({ "i.restraint": "yes" });
  assert.equal(partial.areas.restraint.interest, "yes");
  assert.equal(partial.areas.impact.interest, null, "an unanswered area must not default to anything");
  assert.equal(grouped(partial).length, 1, "only what was said should be grouped");
});

test("an unknown answer is dropped rather than trusted", () => {
  const junk = spec.score({ "i.impact": "extremely", "r.impact": "sideways" });
  assert.equal(junk.areas.impact.interest, null);
});

test("the copied text is the text on screen, and names no state the person did not use", async () => {
  const real = (await i18nFor("en")).scope(spec.id).t;
  const text = asText(result, real);

  for (const group of grouped(result)) {
    assert.ok(text.includes(real(`interest.${group.state}`)), `${group.state} is missing from the text`);
  }
  for (const state of INTEREST) {
    const used = grouped(result).some((g) => g.state === state);
    if (!used) assert.equal(text.includes(real(`interest.${state}`)), false, `${state} appeared unused`);
  }
  assert.ok(!/\d+%/.test(text), "a percentage reached the copied text");
});

test("the instruction card discloses nothing", async () => {
  const real = (await i18nFor("en")).scope(spec.id).t;
  const cards = spec.instructions(result, real);
  assert.equal(cards.length, 1);

  // The sheet is a document that gets handed to people. Nothing from this
  // worksheet belongs on it — the card is a pointer, not a summary.
  const body = cards[0].title + cards[0].body;
  for (const area of AREAS) {
    assert.equal(body.includes(real(`area.${area.id}.label`)), false, `${area.id} leaked onto the sheet`);
  }
});
