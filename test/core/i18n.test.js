import { test } from "node:test";
import assert from "node:assert/strict";
import { createI18n, format } from "../../src/core/i18n.js";

/**
 * The message formatter.
 *
 * The syntax is a deliberate subset of ICU — interpolation, plural, select —
 * because those are the three things Polish, Spanish and German actually
 * require of this app. Anything outside the subset throws rather than
 * silently rendering something plausible and wrong.
 */

const en = {
  "greet": "Hello, {name}.",
  "left": "{count, plural, one{# left} other{# left}}",
  "taken": "Taken {when}.",
};

const pl = {
  "greet": "Cześć, {name}.",
  "left": "{count, plural, one{został #} few{zostały #} many{zostało #} other{zostało #}}",
};

test("a plain message passes through untouched", () => {
  const { t } = createI18n({ locale: "en", messages: en, fallbackMessages: en });
  assert.equal(t("taken", { when: "today" }), "Taken today.");
});

test("interpolation substitutes named variables", () => {
  const { t } = createI18n({ locale: "en", messages: en, fallbackMessages: en });
  assert.equal(t("greet", { name: "Aleksander" }), "Hello, Aleksander.");
});

test("a variable with no value renders empty rather than the word undefined", () => {
  const { t } = createI18n({ locale: "en", messages: en, fallbackMessages: en });
  assert.equal(t("greet", {}), "Hello, .");
});

test("Polish plurals select one, few and many", () => {
  const { t } = createI18n({ locale: "pl", messages: pl, fallbackMessages: en });
  assert.equal(t("left", { count: 1 }), "został 1");
  assert.equal(t("left", { count: 2 }), "zostały 2");
  assert.equal(t("left", { count: 5 }), "zostało 5");
  assert.equal(t("left", { count: 22 }), "zostały 22");
});

test("English plurals fall back to other when a category is absent", () => {
  const { t } = createI18n({ locale: "en", messages: { n: "{count, plural, other{# items}}" }, fallbackMessages: en });
  assert.equal(t("n", { count: 1 }), "1 items");
});

test("an exact match beats the plural category", () => {
  const messages = { n: "{count, plural, =0{nothing left} one{# left} other{# left}}" };
  const { t } = createI18n({ locale: "en", messages, fallbackMessages: en });
  assert.equal(t("n", { count: 0 }), "nothing left");
  assert.equal(t("n", { count: 3 }), "3 left");
});

test("select branches on an arbitrary value", () => {
  const messages = { v: "{tone, select, warm{Close by.} cold{Far off.} other{Somewhere.}}" };
  const { t } = createI18n({ locale: "en", messages, fallbackMessages: en });
  assert.equal(t("v", { tone: "warm" }), "Close by.");
  assert.equal(t("v", { tone: "unknown" }), "Somewhere.");
});

test("branches may themselves interpolate", () => {
  const messages = { v: "{count, plural, one{{name} has one} other{{name} has #}}" };
  const { t } = createI18n({ locale: "en", messages, fallbackMessages: en });
  assert.equal(t("v", { count: 4, name: "Ada" }), "Ada has 4");
});

test("a key missing from the active locale falls back to English", () => {
  const { t } = createI18n({ locale: "pl", messages: pl, fallbackMessages: en });
  assert.equal(t("taken", { when: "dziś" }), "Taken dziś.");
});

test("has reports what the active locale defines, not what English defines", () => {
  const i18n = createI18n({ locale: "pl", messages: pl, fallbackMessages: en });
  assert.equal(i18n.has("greet"), true);
  assert.equal(i18n.has("taken"), false);
});

test("an unknown argument type throws rather than rendering something plausible", () => {
  assert.throws(() => format("{n, ordinal, one{#st}}", { n: 1 }, "en"), /unsupported argument type "ordinal"/);
});

test("an unbalanced brace throws", () => {
  assert.throws(() => format("{count, plural, one{# left}", { count: 1 }, "en"), /unbalanced/);
});

test("the locale is reported back", () => {
  assert.equal(createI18n({ locale: "pl", messages: pl, fallbackMessages: en }).locale, "pl");
});

/* ── scoping ──────────────────────────────────────────────────────
   Instruments are plugins, so their message files use bare keys and
   the loader namespaces them. A scoped `t` hides that: the folder
   asks for "item.words1" and never learns its own prefix.          */

test("a scoped t resolves the namespaced key first", () => {
  const messages = { "love-languages.item.words1": "Scoped.", "item.words1": "Global." };
  const { scope } = createI18n({ locale: "en", messages, fallbackMessages: messages });
  assert.equal(scope("love-languages").t("item.words1"), "Scoped.");
});

test("a scoped t falls through to a shared key when the instrument has none", () => {
  const messages = { "band.high": "High." };
  const { scope } = createI18n({ locale: "en", messages, fallbackMessages: messages });
  assert.equal(scope("big-five").t("band.high"), "High.");
});

test("a scoped t finds a namespaced key that only the fallback locale defines", () => {
  const pl = { "pack.a": "Polski." };
  const en = { "pack.a": "English.", "pack.b": "Only English." };
  const { scope } = createI18n({ locale: "pl", messages: pl, fallbackMessages: en });
  assert.equal(scope("pack").t("a"), "Polski.");
  assert.equal(scope("pack").t("b"), "Only English.");
});
