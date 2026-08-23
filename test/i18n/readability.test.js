import { test } from "node:test";
import assert from "node:assert/strict";
import { registry } from "../helpers/harness.js";
import { LOCALES, loadMessages } from "../../src/core/locales.js";

/** Language tags. `LOCALES` carries display names too; only the tag loads. */
const TAGS = LOCALES.map((l) => l.tag);

/**
 * Items have to be answerable without being decoded.
 *
 * A person who has to re-read a question is no longer answering it — they are
 * answering their reconstruction of it, and the number that comes out the
 * other end is about their reading rather than about them. That is a
 * measurement fault before it is a writing fault, which is why it is a gate
 * here and not a note in a style guide.
 *
 * The thresholds are deliberately blunt. They cannot see abstraction, and a
 * short abstract item will pass; they exist to catch the failures that are
 * mechanically visible, so that review effort goes to the ones that are not.
 */

/** Everything an instrument puts in front of a reader as a question. */
async function promptsFor(locale) {
  const specs = registry.all();
  const messages = await loadMessages(specs, locale);
  const rows = [];
  for (const spec of specs) {
    const keyed = spec.form((key) => key, locale);
    const list = keyed.kind === "items" ? keyed.items : keyed.fields;
    for (const item of list) {
      const key = keyed.kind === "items" ? item.prompt : item.label;
      if (typeof key !== "string" || !key) continue;
      const text = messages[`${spec.id}.${key}`] ?? messages[key];
      if (typeof text === "string") rows.push({ id: `${spec.id}/${item.id}`, locale, text });
    }
  }
  // A gate that silently measures nothing passes forever. This one has done
  // exactly that once already, when it iterated locale records as if they were
  // tags, so the count is asserted rather than assumed.
  assert.ok(rows.length > 300, `only ${rows.length} prompts found for ${locale} — the gate is not reading anything`);
  return rows;
}

const LIMIT = { chars: 80, words: 14 };

test("no question is longer than a person will read in one pass", async () => {
  const over = [];
  for (const locale of TAGS) {
    for (const row of await promptsFor(locale)) {
      if (row.text.length > LIMIT.chars) over.push(`${row.id} [${locale}] ${row.text.length}ch: ${row.text}`);
    }
  }
  assert.deepEqual(over, [], `${over.length} questions run past ${LIMIT.chars} characters`);
});

test("no question runs past a sentence's worth of words", async () => {
  const over = [];
  for (const locale of TAGS) {
    for (const row of await promptsFor(locale)) {
      const words = row.text.split(/\s+/).filter(Boolean).length;
      if (words > LIMIT.words) over.push(`${row.id} [${locale}] ${words} words: ${row.text}`);
    }
  }
  assert.deepEqual(over, [], `${over.length} questions run past ${LIMIT.words} words`);
});

/**
 * Two questions wearing one number.
 *
 * A double-barrelled item — "I am calm and I recover quickly" — cannot be
 * answered by anybody who is one and not the other, so whatever they pick is
 * noise. It is the oldest known defect in questionnaire writing and the
 * easiest to reintroduce, because the second clause always reads like a
 * helpful clarification while it is being written.
 */
const JOINERS = {
  en: [", and ", ", but ", "; "],
  pl: [", ale ", "; "],
  es: [", pero ", "; "],
  de: [", aber ", "; "],
};

test("no question asks two things at once", async () => {
  const bad = [];
  for (const locale of TAGS) {
    for (const row of await promptsFor(locale)) {
      const hit = (JOINERS[locale] ?? []).find((j) => row.text.includes(j));
      if (hit) bad.push(`${row.id} [${locale}] joins on «${hit.trim()}»: ${row.text}`);
    }
  }
  assert.deepEqual(bad, [], `${bad.length} questions are double-barrelled`);
});

test("every locale states a question at the same length as every other", async () => {
  // A translation that runs half again as long as its source is usually a
  // literal one, and literal is where the unreadable sentences come from.
  const en = new Map((await promptsFor("en")).map((r) => [r.id, r.text.length]));
  const stretched = [];
  for (const locale of TAGS.filter((tag) => tag !== "en")) {
    for (const row of await promptsFor(locale)) {
      const source = en.get(row.id);
      if (source && row.text.length > source * 1.6 && row.text.length > 60) {
        stretched.push(`${row.id} [${locale}] ${source}ch → ${row.text.length}ch: ${row.text}`);
      }
    }
  }
  assert.deepEqual(stretched, [], `${stretched.length} translations ran far past their source`);
});
