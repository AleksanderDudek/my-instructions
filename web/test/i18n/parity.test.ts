import { describe, expect, test } from "vitest";
import { TAGS, DEFAULT_LOCALE, loadShell, loadInstrument } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";

/**
 * Every locale defines exactly the keys English defines.
 *
 * The runtime falls back to English for a missing key, which is the right
 * behaviour in production and the wrong thing to rely on: a fallback that
 * nobody notices is a page that silently ships in two languages at once. This
 * test is what makes the fallback a safety net rather than a workflow.
 */
const others = TAGS.filter((tag) => tag !== DEFAULT_LOCALE);

describe("shell", () => {
  test.each(others)("%s defines exactly English's keys", async (locale) => {
    const en = Object.keys(await loadShell(DEFAULT_LOCALE)).sort();
    const mine = Object.keys(await loadShell(locale as Locale)).sort();
    expect({ locale, missing: en.filter((k) => !mine.includes(k)) }).toEqual({ locale, missing: [] });
    expect({ locale, extra: mine.filter((k) => !en.includes(k)) }).toEqual({ locale, extra: [] });
  });
});

describe("instruments", () => {
  const cases = registry.all().flatMap((m) => others.map((locale) => [m.spec.id, locale] as const));

  test.each(cases)("%s/%s defines exactly English's keys", async (id, locale) => {
    const spec = registry.get(id)!.spec;
    const en = Object.keys(await loadInstrument(spec, DEFAULT_LOCALE)).sort();
    const mine = Object.keys(await loadInstrument(spec, locale as Locale)).sort();
    expect({ id, locale, missing: en.filter((k) => !mine.includes(k)) }).toEqual({ id, locale, missing: [] });
    expect({ id, locale, extra: mine.filter((k) => !en.includes(k)) }).toEqual({ id, locale, extra: [] });
  });
});
