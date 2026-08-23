import { expect, test } from "vitest";
import { TAGS, loadShell, loadInstrument } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";

/**
 * Items have to be answerable without being decoded.
 *
 * Somebody who has to re-read a question is no longer answering it — they are
 * answering their reconstruction of it, and the number that comes out is about
 * their reading rather than about them. That is a measurement fault before it
 * is a writing fault, which is why it is a gate and not a style note.
 *
 * The thresholds are deliberately blunt. They cannot see abstraction, and a
 * short abstract item passes; they catch the failures that are mechanically
 * visible so review effort goes to the ones that are not.
 */
const LIMIT = { chars: 80, words: 14 };

const JOINERS: Record<string, string[]> = {
  en: [", and ", ", but ", "; "],
  pl: [", ale ", "; "],
  es: [", pero ", "; "],
  de: [", aber ", "; "],
};

async function promptsFor(locale: Locale) {
  const rows: { id: string; text: string }[] = [];
  const shell = await loadShell(locale);
  for (const { spec } of registry.all()) {
    const own = await loadInstrument(spec, locale);
    const messages = { ...shell, ...own };
    const keyed = spec.form((key) => key, locale);
    const list = keyed.kind === "items" ? keyed.items : keyed.fields;
    for (const item of list) {
      const key = keyed.kind === "items" ? (item as { prompt: string }).prompt : (item as { label: string }).label;
      const text = messages[`${spec.id}.${key}`] ?? messages[key];
      if (typeof text === "string") rows.push({ id: `${spec.id}/${item.id}`, text });
    }
  }
  // A gate that silently measures nothing passes forever. This one did exactly
  // that once, when it iterated locale records as though they were tags.
  expect(rows.length, `no prompts found for ${locale}`).toBeGreaterThan(0);
  return rows;
}

test.each(TAGS)("no question in %s is longer than a person reads in one pass", async (locale) => {
  const over = (await promptsFor(locale as Locale))
    .filter((r) => r.text.length > LIMIT.chars)
    .map((r) => `${r.id} (${r.text.length}ch): ${r.text}`);
  expect(over).toEqual([]);
});

test.each(TAGS)("no question in %s runs past a sentence's worth of words", async (locale) => {
  const over = (await promptsFor(locale as Locale))
    .filter((r) => r.text.split(/\s+/).filter(Boolean).length > LIMIT.words)
    .map((r) => `${r.id}: ${r.text}`);
  expect(over).toEqual([]);
});

/**
 * A double-barrelled item — "I am calm and I recover quickly" — cannot be
 * answered by anybody who is one and not the other, so whatever they pick is
 * noise. It is the oldest defect in questionnaire writing and the easiest to
 * reintroduce, because the second clause always reads like a clarification
 * while it is being written.
 */
test.each(TAGS)("no question in %s asks two things at once", async (locale) => {
  const bad = (await promptsFor(locale as Locale))
    .filter((r) => (JOINERS[locale] ?? []).some((j) => r.text.includes(j)))
    .map((r) => `${r.id}: ${r.text}`);
  expect(bad).toEqual([]);
});
