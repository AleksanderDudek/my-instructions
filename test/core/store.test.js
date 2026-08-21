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
