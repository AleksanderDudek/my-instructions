import { test } from "node:test";
import assert from "node:assert/strict";
import { makeStore, LocalAdapter, VISIBILITY } from "../../src/core/store.js";

/** A localStorage stand-in. `fail` makes every write throw, as a full quota does. */
function fakeStorage({ fail = false } = {}) {
  const map = new Map();
  return {
    get length() { return map.size; },
    key(i) { return [...map.keys()][i]; },
    getItem(k) { return map.has(k) ? map.get(k) : null; },
    setItem(k, v) { if (fail) throw new DOMException("quota"); map.set(k, String(v)); },
    removeItem(k) { map.delete(k); },
    _map: map,
  };
}
const fresh = (opts) => makeStore(new LocalAdapter(fakeStorage(opts)));

test("keys are namespaced and versioned so nothing else on the origin collides", async () => {
  const backing = fakeStorage();
  const store = makeStore(new LocalAdapter(backing));
  await store.saveProfile({ displayName: "Ada" });
  assert.deepEqual([...backing._map.keys()], ["mi:1:profile"]);
});

test("a run defaults to private and keeps its first-completed date across retakes", async () => {
  const store = fresh();
  const first = await store.saveRun({ instrumentId: "big-five", instrumentVersion: 1, answers: { a: 1 }, result: {} });
  assert.equal(first.visibility, "private");
  await new Promise((r) => setTimeout(r, 2));
  const second = await store.saveRun({ instrumentId: "big-five", instrumentVersion: 1, answers: { a: 5 }, result: {} });
  assert.equal(second.firstCompletedAt, first.firstCompletedAt);
  assert.notEqual(second.completedAt, first.completedAt);
  assert.deepEqual(second.answers, { a: 5 });
});

test("visibility is validated rather than trusted", async () => {
  const store = fresh();
  await store.saveRun({ instrumentId: "x", instrumentVersion: 1, answers: {}, result: {} });
  for (const v of VISIBILITY) assert.equal((await store.setVisibility("x", v)).visibility, v);
  await assert.rejects(() => store.setVisibility("x", "everyone"), RangeError);
});

test("visibility survives a retake — a user's sharing choice is not undone by new answers", async () => {
  const store = fresh();
  await store.saveRun({ instrumentId: "x", instrumentVersion: 1, answers: {}, result: {} });
  await store.setVisibility("x", "public");
  const again = await store.saveRun({ instrumentId: "x", instrumentVersion: 2, answers: {}, result: {} });
  assert.equal(again.visibility, "public");
});

test("finishing a run clears its draft", async () => {
  const store = fresh();
  await store.saveDraft("x", { answers: { a: 1 }, page: 0 });
  assert.ok(await store.draft("x"));
  await store.saveRun({ instrumentId: "x", instrumentVersion: 1, answers: {}, result: {} });
  assert.equal(await store.draft("x"), null);
});

test("export round-trips through import", async () => {
  const a = fresh(), b = fresh();
  await a.saveProfile({ displayName: "Ada", pronouns: "they/them" });
  await a.saveRun({ instrumentId: "enneagram", instrumentVersion: 1, answers: { e1a: 4 }, result: { type: 5 } });
  const dump = await a.exportAll();
  await b.importAll(dump);
  assert.equal((await b.profile()).displayName, "Ada");
  assert.equal((await b.run("enneagram")).result.type, 5);
});

test("an export from another schema is refused, not half-applied", async () => {
  const store = fresh();
  await assert.rejects(() => store.importAll({ schema: 99, entries: { profile: {} } }), /Unsupported export/);
  assert.equal((await store.profile()).displayName, "");
});

test("unreadable stored values are skipped rather than crashing the list", async () => {
  const backing = fakeStorage();
  backing.setItem("mi:1:run:broken", "{not json");
  const store = makeStore(new LocalAdapter(backing));
  await store.saveRun({ instrumentId: "ok", instrumentVersion: 1, answers: {}, result: {} });
  const runs = await store.runs();
  assert.equal(runs.length, 1);
  assert.equal(runs[0].instrumentId, "ok");
});

test("a browser that refuses storage still runs, in memory, and says so", async () => {
  const store = fresh({ fail: true });
  assert.equal(store.durable, false);
  await store.saveProfile({ displayName: "Ada" });
  assert.equal((await store.profile()).displayName, "Ada");
});

test("the memory fallback hands out copies, matching what JSON storage does", async () => {
  const store = fresh({ fail: true });
  await store.saveRun({ instrumentId: "x", instrumentVersion: 1, answers: { a: 1 }, result: {} });
  const run = await store.run("x");
  run.answers.a = 999;
  assert.equal((await store.run("x")).answers.a, 1);
});

test("subscribers are told about every write", async () => {
  const store = fresh();
  let calls = 0;
  const off = store.subscribe(() => calls++);
  await store.saveProfile({ displayName: "A" });
  await store.saveRun({ instrumentId: "x", instrumentVersion: 1, answers: {}, result: {} });
  assert.equal(calls, 2);
  off();
  await store.saveProfile({ displayName: "B" });
  assert.equal(calls, 2);
});

test("wipe leaves nothing behind", async () => {
  const store = fresh();
  await store.saveProfile({ displayName: "A" });
  await store.saveRun({ instrumentId: "x", instrumentVersion: 1, answers: {}, result: {} });
  await store.wipe();
  assert.deepEqual(await store.runs(), []);
  assert.equal((await store.profile()).displayName, "");
});

/* ── sharing ──────────────────────────────────────────────────────
   One map, one place. The per-run `visibility` field predates it and
   is kept in step so the badges elsewhere stay honest.               */

test("sharing defaults to private and inherits any visibility already chosen", async () => {
  const store = makeStore(new LocalAdapter(fakeStorage()));
  await store.saveRun({ instrumentId: "big-five", instrumentVersion: 1, answers: {}, result: {} });
  await store.setVisibility("big-five", "public");

  const sharing = await store.sharing();
  assert.equal(sharing["profile.name"], "private", "a name must not be shared until asked for");
  assert.equal(sharing["profile.note"], "private");
  assert.equal(sharing["run.big-five"], "public", "an existing choice was not carried over");
});

test("setting an audience persists it and keeps the run's own field in step", async () => {
  const store = makeStore(new LocalAdapter(fakeStorage()));
  await store.saveRun({ instrumentId: "enneagram", instrumentVersion: 1, answers: {}, result: {} });

  await store.setAudience("run.enneagram", "friends");
  await store.setAudience("profile.name", "public");

  const sharing = await store.sharing();
  assert.equal(sharing["run.enneagram"], "friends");
  assert.equal(sharing["profile.name"], "public");
  assert.equal((await store.run("enneagram")).visibility, "friends", "the run's field drifted");
});

test("an unknown audience is refused rather than stored", async () => {
  const store = makeStore(new LocalAdapter(fakeStorage()));
  await assert.rejects(() => store.setAudience("profile.name", "everyone"), RangeError);
});

/* ── session-only runs ────────────────────────────────────────────
   Some answers are worth having on screen and not worth keeping.
   The guarantee is that there is nothing to find, not that there is
   something hidden.                                                 */

test("a session run is readable now and absent from storage entirely", async () => {
  const backing = fakeStorage();
  const store = makeStore(new LocalAdapter(backing));

  await store.saveRun({ instrumentId: "fleeting", instrumentVersion: 1, answers: { a: 1 }, result: {} }, { session: true });

  assert.equal((await store.run("fleeting"))?.instrumentVersion, 1, "it should be readable during the session");
  assert.equal(store.isEphemeral("fleeting"), true);

  // The real assertion: nothing about it exists in the backing store, under
  // any key. Not obscured, not encoded — absent.
  const keys = Array.from({ length: backing.length }, (_, i) => backing.key(i));
  assert.equal(keys.some((k) => k.includes("fleeting")), false, "a session run reached storage");
  const dump = keys.map((k) => backing.getItem(k)).join("");
  assert.equal(dump.includes("fleeting"), false, "a session run appeared in a stored value");
});

test("a session run is not in an export, and cannot be", async () => {
  const store = makeStore(new LocalAdapter(fakeStorage()));
  await store.saveRun({ instrumentId: "kept", instrumentVersion: 1, answers: {}, result: {} });
  await store.saveRun({ instrumentId: "fleeting", instrumentVersion: 1, answers: {}, result: {} }, { session: true });

  const dump = await store.exportAll();
  assert.ok(JSON.stringify(dump).includes("kept"));
  assert.equal(JSON.stringify(dump).includes("fleeting"), false, "a session run reached an export");
});

test("a session run appears in the current session's list and a stored one is not shadowed", async () => {
  const store = makeStore(new LocalAdapter(fakeStorage()));
  await store.saveRun({ instrumentId: "kept", instrumentVersion: 1, answers: {}, result: {} });
  await store.saveRun({ instrumentId: "fleeting", instrumentVersion: 1, answers: {}, result: {} }, { session: true });

  const ids = (await store.runs()).map((r) => r.instrumentId).sort();
  assert.deepEqual(ids, ["fleeting", "kept"]);
});

test("a new store has no memory of a previous one, which is what a reload is", async () => {
  const backing = fakeStorage();
  const first = makeStore(new LocalAdapter(backing));
  await first.saveRun({ instrumentId: "fleeting", instrumentVersion: 1, answers: {}, result: {} }, { session: true });

  // The same backing storage, a fresh store: exactly what happens when the
  // page is reloaded, and the session run is simply gone.
  const second = makeStore(new LocalAdapter(backing));
  assert.equal(await second.run("fleeting"), null);
  assert.equal(second.isEphemeral("fleeting"), false);
});
