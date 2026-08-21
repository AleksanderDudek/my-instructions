import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.btoa ??= (s) => Buffer.from(s, "binary").toString("base64");
globalThis.atob ??= (s) => Buffer.from(s, "base64").toString("binary");
globalThis.location ??= { origin: "http://localhost:5173", pathname: "/", hash: "" };

const { LOCALES, DEFAULT_LOCALE, loadMessages } = await import("../../src/core/locales.js");
const { createI18n } = await import("../../src/core/i18n.js");
const { makeContext } = await import("../../src/ui/context.js");
const { makeStore, LocalAdapter } = await import("../../src/core/store.js");
const { str } = await import("../../src/core/html.js");
const { registry, fakeStorage, makeCtx } = await import("../helpers/harness.js");
const { encode } = await import("../../src/core/share.js");

const { homePage } = await import("../../src/ui/pages/home.js");
const { catalogPage } = await import("../../src/ui/pages/catalog.js");
const { runnerPage } = await import("../../src/ui/pages/runner.js");
const { resultPage } = await import("../../src/ui/pages/result.js");
const { sheetPage } = await import("../../src/ui/pages/sheet.js");
const { profilePage } = await import("../../src/ui/pages/profile.js");
const { comparePage } = await import("../../src/ui/pages/compare.js");
const { sharingPage } = await import("../../src/ui/pages/sharing.js");
const { reportPage } = await import("../../src/ui/pages/report.js");

/**
 * The gate.
 *
 * Two questions, and the second is the one that matters. Parity asks whether
 * every locale defines every key. Completeness asks whether every key exists —
 * whether a sentence is still sitting in a template somewhere, invisible to
 * the translators and permanently English.
 *
 * Completeness is tested by rendering the whole app in a pseudo-locale whose
 * every message is its own key in guillemets. Anything that comes out as
 * English prose was never routed through `t()`. A source scanner would be the
 * obvious alternative and a worse one: it cannot tell a sentence from a list
 * of CSS classes, and it passes on a string that is extracted but never used.
 */

const instruments = registry.all();
const english = await loadMessages(instruments, DEFAULT_LOCALE);
const ENGLISH_KEYS = Object.keys(english).sort();

/* ── parity ───────────────────────────────────────────────────────*/

for (const { tag, label } of LOCALES) {
  if (tag === DEFAULT_LOCALE) continue;

  test(`${label} (${tag}) defines exactly the keys English defines`, async () => {
    const messages = await loadMessages(instruments, tag);
    const keys = Object.keys(messages).sort();

    const missing = ENGLISH_KEYS.filter((k) => !Object.hasOwn(messages, k));
    const orphaned = keys.filter((k) => !Object.hasOwn(english, k));

    assert.deepEqual(missing, [], `${tag} is missing ${missing.length} keys`);
    assert.deepEqual(orphaned, [], `${tag} defines ${orphaned.length} keys English does not`);
  });

  test(`${label} (${tag}) leaves no message empty or untranslated-by-copy`, async () => {
    const messages = await loadMessages(instruments, tag);
    const empty = ENGLISH_KEYS.filter((k) => !String(messages[k] ?? "").trim());
    assert.deepEqual(empty, [], `${tag} has empty messages`);
  });
}

/* ── completeness ─────────────────────────────────────────────────*/

/**
 * Visible text only: tags, and therefore class names and attributes, go.
 * The input is already a rendered string — passing it back through `str`
 * would escape its markup and leave the tags to be read as prose.
 */
const textOf = (html) => String(html).replace(/<[^>]*>/g, " ").replace(/&[a-z]+;|&#\d+;/g, " ");

/** Three or more real words in a row is prose, not a number or a glyph. */
const PROSE = /(?:\b[A-Za-z]{3,}\b[\s,.;:'’’-]+){2}\b[A-Za-z]{3,}\b/;

/**
 * A language's own name is the one string that must never be translated —
 * "Polski" reads as Polski to a German — so the picker's endonyms are not
 * message keys and must not be flagged as leaks.
 */
const ENDONYMS = new RegExp(LOCALES.map((l) => l.endonym).join("|"), "g");

function assertNoStrayProse(html, where) {
  // Marked messages are the expected output; whatever survives their removal
  // is a string the message tables never saw.
  const leftovers = textOf(html).replace(/«[^»]*»/g, " ").replace(ENDONYMS, " ");
  const found = leftovers.match(PROSE);
  assert.equal(found, null, `${where}: untranslated prose in the page — "${found?.[0]}"`);
}

/** A plausible answer for one profiler field, honouring its own default. */
function answerFor(f) {
  if (f.kind === "multi") return [f.options[0].value];
  if (f.value !== undefined) return f.value;
  if (f.kind === "text") return "Ada";
  return f.min ?? 1;
}

async function pseudoCtx() {
  const marked = Object.fromEntries(ENGLISH_KEYS.map((k) => [k, `«${k}»`]));
  const i18n = createI18n({ locale: "en", messages: marked, fallbackMessages: marked });
  return makeContext({ store: makeStore(new LocalAdapter(fakeStorage())), registry, i18n });
}

const render = async (page, ctx, params = {}, query = new URLSearchParams()) => {
  const out = await page(ctx, params, query);
  return str(out && typeof out === "object" && "body" in out ? out.body : out);
};

test("no page hard-codes a sentence — empty store", async () => {
  const ctx = await pseudoCtx();
  assertNoStrayProse(await render(homePage, ctx), "home");
  assertNoStrayProse(await render(catalogPage, ctx), "catalog");
  assertNoStrayProse(await render(sheetPage, ctx), "sheet");
  assertNoStrayProse(await render(profilePage, ctx), "profile");
  assertNoStrayProse(await render(sharingPage, ctx), "sharing");
  assertNoStrayProse(await render(reportPage, ctx), "report (no token)");
  for (const spec of instruments) {
    assertNoStrayProse(await render(runnerPage, ctx, { id: spec.id }), `runner:${spec.id}`);
    assertNoStrayProse(await render(resultPage, ctx, { id: spec.id }), `result:${spec.id}`);
    assertNoStrayProse(await render(comparePage, ctx, { id: spec.id }), `compare:${spec.id}`);
  }
});

test("no instrument hard-codes a sentence — every view, card and comparison", async () => {
  const ctx = await pseudoCtx();
  for (const spec of instruments) {
    const form = spec.form(ctx.instrument(spec).t, ctx.locale);
    const answers = form.kind === "items"
      ? Object.fromEntries(form.items.map((i, n) => [i.id, form.scale.min + (n % (form.scale.max - form.scale.min + 1))]))
      : Object.fromEntries(form.fields.map((f) => [f.id, answerFor(f)]));
    await ctx.store.saveRun({ instrumentId: spec.id, instrumentVersion: spec.version, answers, result: spec.score(answers) });
  }

  assertNoStrayProse(await render(homePage, ctx), "home (populated)");
  assertNoStrayProse(await render(sheetPage, ctx), "sheet (populated)");
  assertNoStrayProse(await render(profilePage, ctx), "profile (populated)");
  assertNoStrayProse(await render(sharingPage, ctx), "sharing (populated)");

  for (const spec of instruments) {
    assertNoStrayProse(await render(resultPage, ctx, { id: spec.id }), `result:${spec.id}`);
    if (!spec.compare) continue;
    const run = await ctx.store.run(spec.id);
    const token = encode(run, "Bo");
    assertNoStrayProse(
      await render(comparePage, ctx, { id: spec.id }, new URLSearchParams({ with: token })),
      `compare:${spec.id}`);
  }
});

/* ── every locale actually renders ────────────────────────────────*/

for (const { tag, label } of LOCALES) {
  test(`every page renders in ${label} (${tag})`, async () => {
    const ctx = await makeCtx(tag);
    for (const page of [homePage, catalogPage, sheetPage, profilePage]) {
      const html = await render(page, ctx);
      assert.ok(html.length > 120, `${tag}: suspiciously short page`);
      assert.ok(!html.includes("[object Object]"), `${tag}: object in markup`);
      assert.ok(!html.includes("undefined<"), `${tag}: undefined in markup`);
    }
    for (const spec of instruments) {
      const html = await render(runnerPage, ctx, { id: spec.id });
      assert.ok(!html.includes("[object Object]"), `${tag}/${spec.id}: object in markup`);
    }
  });
}

/* ── across locales ───────────────────────────────────────────────*/

test("a token encoded under one locale re-scores identically under another", async () => {
  // Item ids are language-free, which is what lets two people who do not read
  // the same language hand each other a result.
  const spec = registry.get("love-languages");
  const other = LOCALES.find((l) => l.tag !== DEFAULT_LOCALE).tag;
  const theirs = await makeCtx(other);
  const mine = await makeCtx(DEFAULT_LOCALE);

  const answers = Object.fromEntries(
    spec.form(theirs.instrument(spec).t, other).items.map((item, n) => [item.id, (n % 5) + 1]));

  const token = encode({ instrumentId: spec.id, instrumentVersion: spec.version, answers }, "Ola");
  const { decode } = await import("../../src/core/share.js");
  const decoded = decode(token, mine.t);

  assert.deepEqual(spec.score(decoded.answers), spec.score(answers));
});
