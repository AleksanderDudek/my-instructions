/**
 * Shared test rigging.
 *
 * Every test that renders anything needs a real message table behind it —
 * asserting against key names would pass while the page showed `home.lead` to
 * a reader. So the harness loads the same English files the app loads.
 */
import { createI18n } from "../../src/core/i18n.js";
import { loadMessages } from "../../src/core/locales.js";
import { makeStore, LocalAdapter } from "../../src/core/store.js";
import { makeContext } from "../../src/ui/context.js";
import { registry } from "../../src/instruments/index.js";

function fakeStorage() {
  const map = new Map();
  return {
    get length() { return map.size; }, key: (i) => [...map.keys()][i],
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k),
  };
}

/** One i18n per locale, built once — loading four files per test is waste. */
const cache = new Map();
async function i18nFor(locale = "en") {
  if (!cache.has(locale)) {
    const instruments = registry.all();
    const messages = await loadMessages(instruments, locale);
    const fallbackMessages = locale === "en" ? messages : await loadMessages(instruments, "en");
    cache.set(locale, createI18n({ locale, messages, fallbackMessages }));
  }
  return cache.get(locale);
}

/** A context with a fresh empty store. */
async function makeCtx(locale = "en") {
  return makeContext({ store: makeStore(new LocalAdapter(fakeStorage())), registry, i18n: await i18nFor(locale) });
}

/** A `t` scoped to one instrument, for testing an instrument on its own. */
async function tFor(spec, locale = "en") {
  return (await i18nFor(locale)).scope(spec.id).t;
}

export { fakeStorage, i18nFor, makeCtx, tFor, registry };
