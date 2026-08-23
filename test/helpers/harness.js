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

/**
 * A plausible answer for one item, by its kind.
 *
 * Both page harnesses used to reach for `form.scale.min`, which assumed every
 * items form is Likert. It also meant choice items were being answered with
 * numbers, which happened to render and was never right.
 */
function answerForItem(item, scale, n = 0) {
  if (item.kind === "likert") {
    const span = (scale?.max ?? 5) - (scale?.min ?? 1) + 1;
    return (scale?.min ?? 1) + (n % span);
  }
  if (item.kind === "multi") return [item.options[0].value];
  return item.options[n % item.options.length].value;
}

/** A plausible answer for one profiler field, honouring its own default. */
function answerForField(f) {
  if (f.kind === "multi") return [f.options[0].value];
  if (f.value !== undefined) return f.value;
  if (f.kind === "text") return "Ada";
  return f.min ?? 1;
}

/** Every answer for one instrument, whichever family it is. */
function answersFor(spec, t, locale = "en") {
  const form = spec.form(t, locale);
  return form.kind === "items"
    ? Object.fromEntries(form.items.map((item, n) => [item.id, answerForItem(item, form.scale, n)]))
    : Object.fromEntries(form.fields.map((f) => [f.id, answerForField(f)]));
}

export { fakeStorage, i18nFor, makeCtx, tFor, registry, answerForItem, answerForField, answersFor };
