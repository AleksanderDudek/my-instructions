import { test } from "node:test";
import assert from "node:assert/strict";
import spec, { asText, at, pairScore, leanOf } from "../../src/instruments/intimacy-map/index.js";
import { ACTS, INTEREST, KEEN, facing } from "../../src/instruments/intimacy-map/acts.js";
import { audiencesFor } from "../../src/core/registry.js";
import { makeStore, LocalAdapter } from "../../src/core/store.js";
import { str } from "../../src/core/html.js";
import { fakeStorage, i18nFor } from "../helpers/harness.js";

/**
 * The guarantees that let this one exist at all.
 *
 * Every property below would be easy to lose to a reasonable-looking change —
 * a draft added for convenience, an audience opened up, a copy button added to
 * the comparison because the single view has one. Each is asserted rather than
 * trusted to a comment.
 */

const t = (key) => key;
const items = spec.form(t).items;
const answers = Object.fromEntries(items.map((item, n) => [item.id, item.options[n % item.options.length].value]));
const result = spec.score(answers);

/** A result where exactly the named items are favourites and the rest are limits. */
const keenOn = (...ids) =>
  spec.score(Object.fromEntries(ACTS.map(({ id }) => [id, ids.includes(id) ? "favourite" : "limit"])));

test("it is session-only and therefore not shareable at all", () => {
  assert.equal(spec.persistence, "session");
  assert.equal(spec.sensitive, true);
  assert.equal(spec.adult, true);
  assert.deepEqual(audiencesFor(spec), ["private"], "a worksheet that is never saved must not be linkable");
});

test("finishing it writes nothing to storage, in either slot", async () => {
  const backing = fakeStorage();
  const store = makeStore(new LocalAdapter(backing));
  const record = { instrumentId: spec.id, instrumentVersion: spec.version, answers, result };

  await store.saveRun(record, { session: true });
  await store.saveRun(record, { session: true, slot: "b" });

  assert.ok(await store.run(spec.id), "it should be readable while the tab is open");
  assert.ok(await store.run(spec.id, "b"), "and so should the partner's half");

  const keys = Array.from({ length: backing.length }, (_, i) => backing.key(i));
  const dump = keys.map((k) => backing.getItem(k)).join("");
  assert.equal(keys.some((k) => k.includes(spec.id)), false, "a key was written");
  assert.equal(dump.includes("restrain"), false, "an answer reached storage");
  assert.equal(JSON.stringify(await store.exportAll()).includes(spec.id), false, "it reached an export");
});

test("a slotted run is invisible everywhere a run is normally listed", async () => {
  const store = makeStore(new LocalAdapter(fakeStorage()));
  const record = { instrumentId: spec.id, instrumentVersion: spec.version, answers, result };
  await store.saveRun(record, { session: true });
  await store.saveRun(record, { session: true, slot: "b" });

  // Half of a comparison is not a run of its own. Letting one appear in the
  // catalogue or the sharing page is exactly the leak this design avoids.
  const listed = await store.runs();
  assert.equal(listed.length, 1, "the partner's half must not list as its own run");
  assert.equal(listed[0].slot, null);
  assert.equal(Object.keys(await store.sharing()).some((k) => k.includes("#")), false);
});

test("a slotted run cannot be written down even by asking", async () => {
  const store = makeStore(new LocalAdapter(fakeStorage()));
  await assert.rejects(
    async () => store.saveRun({ instrumentId: spec.id, answers, result }, { slot: "b" }),
    /session-only/,
  );
});

test("clearing the run clears the partner's half with it", async () => {
  const store = makeStore(new LocalAdapter(fakeStorage()));
  const record = { instrumentId: spec.id, instrumentVersion: spec.version, answers, result };
  await store.saveRun(record, { session: true });
  await store.saveRun(record, { session: true, slot: "b" });
  await store.clearRun(spec.id);
  assert.equal(await store.run(spec.id, "b"), null, "half a comparison outlived the clear");
});

test("an unanswered item is absent rather than assumed, and unknown answers are dropped", () => {
  assert.equal(Object.keys(result.picks).length, ACTS.length);

  const partial = spec.score({ "restrain.b": "yes", "impact.a": "sideways" });
  assert.equal(partial.picks["restrain.b"], INTEREST.indexOf("yes"));
  assert.equal("impact.a" in partial.picks, false, "an unknown answer was trusted");
  assert.equal("blindfold.a" in partial.picks, false, "an unanswered item defaulted to something");
  assert.equal(partial.answered, 1);
});

test("a lean is withheld rather than invented when a side went unanswered", () => {
  assert.equal(leanOf({}).side, "unknown", "an absent lean is not a neutral lean");
  assert.equal(leanOf({}).a, null);
  // One side answered and the other not is still not enough to place anybody.
  const oneSided = Object.fromEntries(ACTS.filter((a) => a.side === "a").map((a) => [a.id, 4]));
  assert.equal(leanOf(oneSided).side, "unknown");
});

test("a flat low profile is a quiet appetite, not a side", () => {
  const low = Object.fromEntries(ACTS.filter((a) => a.side).map((a) => [a.id, 0]));
  assert.equal(leanOf(low).side, "neither");
});

/* ── the crossing ─────────────────────────────────────────────────
   The one structural claim this instrument makes over every
   worksheet it descends from.                                      */

test("every directional item faces its opposite half, and a plain one faces itself", () => {
  for (const { id, side } of ACTS) {
    if (!side) { assert.equal(facing(id), id); continue; }
    assert.notEqual(facing(id), id);
    assert.equal(facing(facing(id)), id, `${id} does not face back`);
    assert.ok(ACTS.some((a) => a.id === facing(id)), `${id} faces an item that does not exist`);
  }
});

test("your giving is matched against their receiving, not against their giving", () => {
  // The whole point. Both people love the same act from opposite ends.
  const mine = keenOn("oral.a");
  const theirs = keenOn("oral.b");
  assert.deepEqual(pairScore(mine, theirs).shared.map((r) => r.id), ["oral.a"]);

  // And two people who both want to be the one giving is not a match, however
  // identical their two answer sheets look side by side.
  const bothGiving = pairScore(keenOn("oral.a"), keenOn("oral.a"));
  assert.equal(bothGiving.shared.length, 0, "like-for-like matching crept back in");
  assert.equal(bothGiving.closed.length, 2, "each keen side meets the other's limit");
});

test("a limit on either side lands as settled and never as a match or a spark", () => {
  const keen = keenOn("impact.a");
  const limits = spec.score({ "impact.b": "limit" });
  const cmp = pairScore(keen, limits);
  assert.deepEqual(cmp.closed.map((r) => r.id), ["impact.a"]);
  assert.equal(cmp.shared.length + cmp.spark.length, 0);
  assert.equal(cmp.overlap, 0);
});

test("the spark list is one keen and one curious, named as the keen person's own act", () => {
  const mine = spec.score({ "restrain.a": "yes" });
  const theirs = spec.score({ "restrain.b": "curious" });
  assert.deepEqual(pairScore(mine, theirs).spark, [{ id: "restrain.a", keen: "mine" }]);

  // Flipped, the act named is the one the keen person actually answered —
  // "they are keen" must not print under a line describing the other side.
  const flipped = pairScore(theirs, mine);
  assert.deepEqual(flipped.spark, [{ id: "restrain.a", keen: "theirs" }]);
});

test("an item only one of them answered produces nothing at all", () => {
  const cmp = pairScore(keenOn("toys.a"), spec.score({}));
  assert.equal(cmp.shared.length + cmp.spark.length + cmp.closed.length + cmp.oneWay.length, 0);
});

test("two people leaning the same way is reported as such rather than smoothed over", () => {
  const allA = spec.score(Object.fromEntries(ACTS.filter((a) => a.side).map((a) => [a.id, a.side === "a" ? "favourite" : "notNow"])));
  assert.equal(pairScore(allA, allA).roles, "sameSide");

  const allB = spec.score(Object.fromEntries(ACTS.filter((a) => a.side).map((a) => [a.id, a.side === "b" ? "favourite" : "notNow"])));
  assert.equal(pairScore(allA, allB).roles, "complement");
});

/* ── what leaves the page ─────────────────────────────────────────── */

test("the copied text is the text on screen, and carries no percentage", async () => {
  const real = (await i18nFor("en")).scope(spec.id).t;
  const text = asText(result, real);
  // The rendered page escapes its text, so an item containing an apostrophe
  // arrives as `&#39;`. This assertion is about content, not markup.
  const unescape = (html) => html
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  const screen = unescape(str(spec.view(result, { t: real })));

  for (const { id, section } of ACTS) {
    const named = at(result, section, (v) => v >= KEEN).includes(id)
      || at(result, section, (v) => v === INTEREST.indexOf("curious")).includes(id)
      || at(result, section, (v) => v === 0).includes(id);
    assert.equal(text.includes(real(`act.${id}`)), named, `${id} disagrees between the text and the grouping`);
    if (named) assert.ok(screen.includes(real(`act.${id}`)), `${id} is in the text but not on screen`);
  }
  assert.equal(/\d+%/.test(text), false, "a percentage reached the copied text");
});

test("the comparison offers no way to make a document of it", async () => {
  const real = (await i18nFor("en")).scope(spec.id).t;
  const cmp = pairScore(keenOn("oral.a", "lead.a"), keenOn("oral.b", "lead.b"));
  const screen = str(spec.pairView(cmp, { t: real }));

  // The single-person view has a copy button because those are that person's
  // own answers. A record of both of them is a different object, and only one
  // of the two would be choosing to create it.
  assert.equal(/<textarea|id="copy-|download/.test(screen), false, "the comparison grew an export");
  assert.ok(screen.includes(real("pair.goneNote")), "and it must say why");
});

test("the instruction card discloses nothing", async () => {
  const real = (await i18nFor("en")).scope(spec.id).t;
  const cards = spec.instructions(result, real);
  assert.equal(cards.length, 1);

  // The sheet is a document that gets handed to people. Nothing from this
  // worksheet belongs on it — the card is a pointer, not a summary.
  const body = cards[0].title + cards[0].body;
  for (const { id } of ACTS) {
    assert.equal(body.includes(real(`act.${id}`)), false, `${id} leaked onto the sheet`);
  }
});
