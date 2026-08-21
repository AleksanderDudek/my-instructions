import { test } from "node:test";
import assert from "node:assert/strict";
import { LOCALES, DEFAULT_LOCALE, isSupported, resolveLocale } from "../../src/core/locales.js";

/**
 * Which language the reader gets.
 *
 * Locale lives in storage rather than in the URL, and the consequence is
 * deliberate: a share link opened by a friend renders in the *receiver's*
 * language. Two people who do not read the same language can still hand
 * each other a result.
 */

test("English is the default and every locale declares an endonym", () => {
  assert.equal(DEFAULT_LOCALE, "en");
  for (const l of LOCALES) {
    assert.ok(l.tag && l.label && l.endonym, `locale ${l.tag} is incomplete`);
  }
});

/* The assertions name no language beyond English. Which locales have shipped
   changes as translations land, and a test that hard-codes today's list fails
   for the wrong reason tomorrow. */
const OTHER = LOCALES.find((l) => l.tag !== DEFAULT_LOCALE).tag;

test("a stored preference wins over the browser", () => {
  assert.equal(resolveLocale(OTHER, ["en-GB"]), OTHER);
});

test("an unsupported stored preference is ignored rather than obeyed", () => {
  // "zz" is not a language this app speaks; the browser decides instead.
  assert.equal(resolveLocale("zz", [`${OTHER}-XX`]), OTHER);
});

test("the browser is matched by prefix, so a regional tag still counts", () => {
  assert.equal(resolveLocale(null, [`${OTHER}-XX`]), OTHER);
  assert.equal(resolveLocale(null, ["en-GB"]), "en");
});

test("the first browser language this app speaks wins", () => {
  assert.equal(resolveLocale(null, ["fr-FR", `${OTHER}-XX`, "en-GB"]), OTHER);
});

test("a reader with no recognisable language gets English", () => {
  assert.equal(resolveLocale(null, ["fr-FR", "ja-JP"]), "en");
  assert.equal(resolveLocale(null, []), "en");
  assert.equal(resolveLocale(undefined, undefined), "en");
});

test("isSupported is exact, not prefix-based", () => {
  assert.equal(isSupported(OTHER), true);
  assert.equal(isSupported(`${OTHER}-XX`), false);
});
