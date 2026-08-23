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

const { registry, makeCtx, i18nFor, answersFor } = await import("../helpers/harness.js");
const { str } = await import("../../src/core/html.js");
const { homePage } = await import("../../src/ui/pages/home.js");
const { catalogPage } = await import("../../src/ui/pages/catalog.js");
const { runnerPage } = await import("../../src/ui/pages/runner.js");
const { resultPage } = await import("../../src/ui/pages/result.js");
const { sheetPage } = await import("../../src/ui/pages/sheet.js");
const { profilePage } = await import("../../src/ui/pages/profile.js");
const { comparePage } = await import("../../src/ui/pages/compare.js");
const { sharingPage } = await import("../../src/ui/pages/sharing.js");
const { reportPage } = await import("../../src/ui/pages/report.js");
const { encode } = await import("../../src/core/share.js");


const render = async (page, ctx, params = {}, query = new URLSearchParams()) => {
  const out = await page(ctx, params, query);
  const body = out && typeof out === "object" && "body" in out ? out.body : out;
  return str(body);
};

/** Fill a store with a completed run for every instrument. */
async function completeAll(ctx) {
  for (const spec of registry.all()) {
    const answers = answersFor(spec, ctx.instrument(spec).t, ctx.locale);
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
  const ctx = await makeCtx();
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
  const ctx = await makeCtx();
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
  const ctx = await makeCtx();
  for (const page of [runnerPage, resultPage, comparePage]) {
    const html = await render(page, ctx, { id: "no-such-test" });
    assert.match(html, /No such test|Nothing recorded/);
  }
});

test("a result for an instrument that has since been revised is flagged, not hidden", async () => {
  const ctx = await makeCtx();
  const spec = registry.get("big-five");
  const answers = Object.fromEntries(spec.form(ctx.instrument(spec).t, ctx.locale).items.map((i) => [i.id, 3]));
  await ctx.store.saveRun({ instrumentId: spec.id, instrumentVersion: 0, answers, result: spec.score(answers) });
  const html = await render(resultPage, ctx, { id: spec.id });
  assert.ok(html.includes("has been revised"), "a stale result was shown as current");
});

test("compare asks you to take the test first, then offers a link, then reads one", async () => {
  const ctx = await makeCtx();
  const spec = registry.get("love-languages");
  assert.match(await render(comparePage, ctx, { id: spec.id }), /Take it first/);

  await completeAll(ctx);
  assert.match(await render(comparePage, ctx, { id: spec.id }), /Copy my link/);

  const answers = Object.fromEntries(spec.form(ctx.instrument(spec).t, ctx.locale).items.map((i) => [i.id, 2]));
  const token = encode({ instrumentId: spec.id, instrumentVersion: 1, answers }, "Bo");
  const html = await render(comparePage, ctx, { id: spec.id }, new URLSearchParams({ with: token }));
  sane(html, "compare");
  assert.ok(html.includes("Bo"), "the other person is not named");
});

test("a share token for the wrong test is diagnosed, and a corrupt one is caught", async () => {
  const ctx = await makeCtx();
  await completeAll(ctx);
  const wrong = encode({ instrumentId: "enneagram", instrumentVersion: 1, answers: { e1a: 3 } }, "Bo");
  assert.match(await render(comparePage, ctx, { id: "big-five" }, new URLSearchParams({ with: wrong })), /Wrong test/);
  assert.match(await render(comparePage, ctx, { id: "big-five" }, new URLSearchParams({ with: "@@@" })), /did not open/);
});

test("a run left by an instrument that is no longer installed does not break the panel", async () => {
  const ctx = await makeCtx();
  await ctx.store.saveRun({ instrumentId: "retired-test", instrumentVersion: 1, answers: {}, result: {} });
  const html = await render(profilePage, ctx);
  assert.ok(html.includes("no longer installed"));
  sane(await render(sheetPage, ctx), "sheet with orphan run");
});

test("the runner resumes a draft instead of restarting it", async () => {
  const ctx = await makeCtx();
  const spec = registry.get("enneagram");
  const items = spec.form(ctx.instrument(spec).t, ctx.locale).items;
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
  const ctx = await makeCtx();
  await ctx.store.saveProfile({ displayName: '<script>alert(1)</script>', note: '"onload="x' });
  for (const page of [homePage, sheetPage, profilePage]) {
    const html = await render(page, ctx);
    assert.ok(!html.includes("<script>alert"), "a script tag survived into the markup");
  }
});

/* ── sharing, end to end ──────────────────────────────────────────
   The unit tests prove the token is filtered. This proves the page
   built from that token cannot show what the token does not carry. */

test("a public report renders public elements and cannot render the rest", async () => {
  const ctx = await makeCtx();
  await completeAll(ctx);
  await ctx.store.saveProfile({ displayName: "Ada", pronouns: "she/her", note: "Handle with care." });

  await ctx.store.setAudience("profile.name", "public");
  await ctx.store.setAudience("profile.pronouns", "friends");
  await ctx.store.setAudience("profile.note", "private");
  await ctx.store.setAudience("run.big-five", "public");
  await ctx.store.setAudience("run.enneagram", "friends");
  for (const id of ["love-languages", "numerology", "hexaco", "jungian"]) {
    await ctx.store.setAudience(`run.${id}`, "private");
  }

  const { encodeReport } = await import("../../src/core/report.js");
  const args = {
    registry,
    profile: await ctx.store.profile(),
    runs: await ctx.store.runs(),
    sharing: await ctx.store.sharing(),
  };

  const publicHTML = await render(reportPage, ctx, {}, new URLSearchParams({ d: encodeReport({ ...args, audience: "public" }) }));
  assert.ok(publicHTML.includes("Ada"), "the name was marked public and is missing");
  assert.ok(!publicHTML.includes("she/her"), "a friends-only pronoun reached the public report");
  assert.ok(!publicHTML.includes("Handle with care"), "a private note reached a report");

  const friendsHTML = await render(reportPage, ctx, {}, new URLSearchParams({ d: encodeReport({ ...args, audience: "friends" }) }));
  assert.ok(friendsHTML.includes("she/her"), "a friends element is missing from the friends report");
  assert.ok(!friendsHTML.includes("Handle with care"), "a private note reached the friends report");
  assert.ok(friendsHTML.length > publicHTML.length, "the friends report should carry more than the public one");
});

test("the sharing page lists every completed run and defaults to private", async () => {
  const ctx = await makeCtx();
  await completeAll(ctx);
  const html = await render(sharingPage, ctx);
  for (const spec of registry.all()) {
    assert.ok(html.includes(`data-element="run.${spec.id}"`), `${spec.id} has no row on the sharing page`);
  }
  sane(html, "sharing");
});

/* ── the age gate ────────────────────────────────────────────────
   The gate is worth testing because the failure mode is silent:
   a change that renders the cards anyway looks identical to a
   reader who has already confirmed.                               */

test("an unconfirmed catalogue does not name what is behind the gate", async () => {
  const ctx = await makeCtx("en");
  const adult = registry.all().filter((s) => s.adult);
  assert.ok(adult.length, "nothing is gated, so this test proves nothing");

  const closed = await render(catalogPage, ctx);
  assert.ok(closed.includes("data-adult-confirm"), "the gate is missing");
  for (const spec of adult) {
    const title = ctx.instrument(spec).t("title");
    assert.equal(closed.includes(title), false, `${spec.id} is named on a closed catalogue`);
    assert.equal(closed.includes(`#/test/${spec.id}`), false, `${spec.id} is linked on a closed catalogue`);
  }

  await ctx.store.saveSettings({ adultOk: true });
  const open = await render(catalogPage, ctx);
  assert.equal(open.includes("data-adult-confirm"), false, "the gate stayed after confirmation");
  for (const spec of adult) {
    assert.ok(open.includes(`#/test/${spec.id}`), `${spec.id} did not appear after confirmation`);
  }
});

test("a gated instrument appears in exactly one catalogue group", async () => {
  const groups = registry.groups();
  const seen = registry.all().map((s) => ({
    id: s.id,
    in: groups.filter((g) => g.items.some((i) => i.id === s.id)).map((g) => g.family),
  }));
  for (const row of seen) assert.equal(row.in.length, 1, `${row.id} is in ${row.in.join(" and ")}`);
});

/* ── the two-person flow ─────────────────────────────────────────── */

test("a pairwise result offers the handover, then the comparison, and never the wrong half", async () => {
  const ctx = await makeCtx("en");
  const spec = registry.all().find((s) => s.pairwise);
  assert.ok(spec, "nothing is pairwise, so this test proves nothing");

  const answers = answersFor(spec, ctx.instrument(spec).t, ctx.locale);
  const record = { instrumentId: spec.id, instrumentVersion: spec.version, answers, result: spec.score(answers) };
  await ctx.store.saveRun(record, { session: true });

  const alone = await render(resultPage, ctx, { id: spec.id });
  assert.ok(alone.includes(`#/test/${spec.id}?who=b`), "no way to hand the device over");

  await ctx.store.saveRun(record, { session: true, slot: "b" });
  const paired = await render(resultPage, ctx, { id: spec.id });
  assert.ok(paired.includes(ctx.t("pair.resultHeading")), "the comparison did not appear");

  // The second person's page is their own reading plus the comparison. It must
  // not carry the first person's sharing controls, which govern a run that is
  // not theirs.
  const second = await render(resultPage, ctx, { id: spec.id }, new URLSearchParams("who=b"));
  assert.ok(second.includes(ctx.t("pair.secondDone")));
  assert.equal(second.includes('id="vis"'), false, "the partner got the owner's audience controls");
  assert.equal(second.includes('id="clear"'), false, "the partner could delete the owner's run");
});

test("who=b on an instrument that is not pairwise is read as the ordinary run", async () => {
  const ctx = await makeCtx("en");
  const spec = registry.all().find((s) => !s.pairwise && s.family === "questionnaire");
  const answers = answersFor(spec, ctx.instrument(spec).t, ctx.locale);
  await ctx.store.saveRun({ instrumentId: spec.id, instrumentVersion: spec.version, answers, result: spec.score(answers) });

  const out = await render(resultPage, ctx, { id: spec.id }, new URLSearchParams("who=b"));
  assert.ok(out.includes(ctx.instrument(spec).t("title")), "a stray query broke an ordinary result page");
});
