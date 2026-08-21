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

test("a stored preference wins over the browser", () => {
  assert.equal(resolveLocale("pl", ["de-DE", "en-GB"]), "pl");
});

test("an unsupported stored preference is ignored rather than obeyed", () => {
  assert.equal(resolveLocale("fr", ["de-DE"]), "de");
});

test("the browser is matched by prefix, so de-AT counts as German", () => {
  assert.equal(resolveLocale(null, ["de-AT"]), "de");
  assert.equal(resolveLocale(null, ["es-419"]), "es");
});

test("the first browser language this app speaks wins", () => {
  assert.equal(resolveLocale(null, ["fr-FR", "pl-PL", "de-DE"]), "pl");
});

test("a reader with no recognisable language gets English", () => {
  assert.equal(resolveLocale(null, ["fr-FR", "ja-JP"]), "en");
  assert.equal(resolveLocale(null, []), "en");
  assert.equal(resolveLocale(undefined, undefined), "en");
});

test("isSupported is exact, not prefix-based", () => {
  assert.equal(isSupported("pl"), true);
  assert.equal(isSupported("pl-PL"), false);
});
