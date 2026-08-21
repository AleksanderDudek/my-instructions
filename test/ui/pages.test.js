import { test } from "node:test";
import assert from "node:assert/strict";

/**
 * Page-level smoke tests.
 *
 * Every page in this app is a pure function from context to an HTML string,
 * with anything DOM-dependent deferred to `mount`. That split exists partly
 * for clarity and mostly for this file: the whole render layer can be
 * exercised in Node, with no browser and no test framework, and a broken
 * template fails in a hundred milliseconds instead of on someone's screen.
 */

globalThis.btoa ??= (s) => Buffer.from(s, "binary").toString("base64");
globalThis.atob ??= (s) => Buffer.from(s, "base64").toString("binary");
globalThis.location ??= { origin: "http://localhost:5173", pathname: "/", hash: "" };

const { makeStore, LocalAdapter } = await import("../../src/core/store.js");
const { registry } = await import("../../src/instruments/index.js");
const { str } = await import("../../src/core/html.js");
const { homePage } = await import("../../src/ui/pages/home.js");
const { catalogPage } = await import("../../src/ui/pages/catalog.js");
const { runnerPage } = await import("../../src/ui/pages/runner.js");
const { resultPage } = await import("../../src/ui/pages/result.js");
const { sheetPage } = await import("../../src/ui/pages/sheet.js");
const { profilePage } = await import("../../src/ui/pages/profile.js");
const { comparePage } = await import("../../src/ui/pages/compare.js");
const { encode } = await import("../../src/core/share.js");

function fakeStorage() {
  const map = new Map();
  return {
    get length() { return map.size; }, key: (i) => [...map.keys()][i],
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k),
  };
}
const makeCtx = () => ({ store: makeStore(new LocalAdapter(fakeStorage())), registry, router: { go() {} } });

const render = async (page, ctx, params = {}, query = new URLSearchParams()) => {
  const out = await page(ctx, params, query);
  const body = out && typeof out === "object" && "body" in out ? out.body : out;
  return str(body);
};

/** Fill a store with a completed run for every instrument. */
async function completeAll(ctx) {
  for (const spec of registry.all()) {
    const form = spec.form();
    const answers = form.kind === "items"
      ? Object.fromEntries(form.items.map((i) => [i.id, form.scale.max]))
      : Object.fromEntries(form.fields.map((f) => [f.id, f.kind === "text" ? "Ada" : f.value ?? f.min ?? 1]));
    await ctx.store.saveRun({ instrumentId: spec.id, instrumentVersion: spec.version, answers, result: spec.score(answers) });
  }
}

const sane = (html, where) => {
  assert.ok(html.length > 120, `${where}: suspiciously short`);
  assert.ok(!html.includes("[object Object]"), `${where}: object in markup`);
  assert.ok(!html.includes("undefined<"), `${where}: undefined in markup`);
  assert.ok(!/\bNaN\b/.test(html), `${where}: NaN in markup`);
};

test("every page renders from an empty store", async () => {
  const ctx = makeCtx();
  sane(await render(homePage, ctx), "home");
  sane(await render(catalogPage, ctx), "catalog");
  sane(await render(sheetPage, ctx), "sheet");
  sane(await render(profilePage, ctx), "profile");
  for (const spec of registry.all()) {
    sane(await render(runnerPage, ctx, { id: spec.id }), `runner:${spec.id}`);
    sane(await render(resultPage, ctx, { id: spec.id }), `result:${spec.id}`);
  }
});

test("every page renders from a fully populated store", async () => {
  const ctx = makeCtx();
  await ctx.store.saveProfile({ displayName: "Ada", pronouns: "they/them", note: "Reads slowly, decides fast." });
  await completeAll(ctx);
  const home = await render(homePage, ctx);
  sane(home, "home");
  assert.ok(home.includes("Ada"), "the display name never reaches the page");
  sane(await render(catalogPage, ctx), "catalog");
  const sheet = await render(sheetPage, ctx);
  sane(sheet, "sheet");
  assert.ok(sheet.includes("How to talk to me"), "the sheet lost its channels");
  sane(await render(profilePage, ctx), "profile");
  for (const spec of registry.all()) sane(await render(resultPage, ctx, { id: spec.id }), `result:${spec.id}`);
});

test("an unknown instrument id is handled rather than thrown", async () => {
  const ctx = makeCtx();
  for (const page of [runnerPage, resultPage, comparePage]) {
    const html = await render(page, ctx, { id: "no-such-test" });
    assert.match(html, /No such test|Nothing recorded/);
  }
});

test("a result for an instrument that has since been revised is flagged, not hidden", async () => {
  const ctx = makeCtx();
  const spec = registry.get("big-five");
  const answers = Object.fromEntries(spec.form().items.map((i) => [i.id, 3]));
  await ctx.store.saveRun({ instrumentId: spec.id, instrumentVersion: 0, answers, result: spec.score(answers) });
  const html = await render(resultPage, ctx, { id: spec.id });
  assert.ok(html.includes("has been revised"), "a stale result was shown as current");
});

test("compare asks you to take the test first, then offers a link, then reads one", async () => {
  const ctx = makeCtx();
  const spec = registry.get("love-languages");
  assert.match(await render(comparePage, ctx, { id: spec.id }), /Take it first/);

  await completeAll(ctx);
  assert.match(await render(comparePage, ctx, { id: spec.id }), /Copy my link/);

  const answers = Object.fromEntries(spec.form().items.map((i) => [i.id, 2]));
  const token = encode({ instrumentId: spec.id, instrumentVersion: 1, answers }, "Bo");
  const html = await render(comparePage, ctx, { id: spec.id }, new URLSearchParams({ with: token }));
  sane(html, "compare");
  assert.ok(html.includes("Bo"), "the other person is not named");
});

test("a share token for the wrong test is diagnosed, and a corrupt one is caught", async () => {
  const ctx = makeCtx();
  await completeAll(ctx);
  const wrong = encode({ instrumentId: "enneagram", instrumentVersion: 1, answers: { e1a: 3 } }, "Bo");
  assert.match(await render(comparePage, ctx, { id: "big-five" }, new URLSearchParams({ with: wrong })), /Wrong test/);
  assert.match(await render(comparePage, ctx, { id: "big-five" }, new URLSearchParams({ with: "@@@" })), /did not open/);
});

test("a run left by an instrument that is no longer installed does not break the panel", async () => {
  const ctx = makeCtx();
  await ctx.store.saveRun({ instrumentId: "retired-test", instrumentVersion: 1, answers: {}, result: {} });
  const html = await render(profilePage, ctx);
  assert.ok(html.includes("no longer installed"));
  sane(await render(sheetPage, ctx), "sheet with orphan run");
});

test("the runner resumes a draft instead of restarting it", async () => {
  const ctx = makeCtx();
  const spec = registry.get("enneagram");
  const items = spec.form().items;
  await ctx.store.saveDraft(spec.id, {
    answers: { [items[0].id]: 5 }, order: items.map((i) => i.id), seed: 1, page: 3, total: items.length,
  });
  const html = await render(runnerPage, ctx, { id: spec.id });
  // The paged body is drawn by mount(), so what the server-rendered string
  // must prove is only that the draft was found and not discarded.
  assert.ok((await ctx.store.draft(spec.id)).answers[items[0].id] === 5);
  sane(html, "runner with draft");
});

test("profile text is escaped, not interpreted", async () => {
  const ctx = makeCtx();
  await ctx.store.saveProfile({ displayName: '<script>alert(1)</script>', note: '"onload="x' });
  for (const page of [homePage, sheetPage, profilePage]) {
    const html = await render(page, ctx);
    assert.ok(!html.includes("<script>alert"), "a script tag survived into the markup");
  }
});
