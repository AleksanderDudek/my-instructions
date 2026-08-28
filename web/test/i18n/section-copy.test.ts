import { expect, test } from "vitest";
import { TAGS, DEFAULT_LOCALE, loadInstrument } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";

/**
 * A section note is copy, not a memo.
 *
 * `section.<id>.title` and `section.<id>.note` are painted at a reader twice.
 * `sectionHeader` in `src/components/runner/runner.tsx` draws them above the
 * questions of every page whose items agree about their section, and an
 * instrument's `View.tsx` draws them again over each section of the result. So
 * somebody who sits down to answer three questions about money reads that note
 * before the first one and again after the last.
 *
 * Nothing in the type system says so. A note is a string in a message table
 * beside a hundred other strings, `t()` returns whatever is in it, and the page
 * renders. That is how `good-life` came to ship seven notes written to the next
 * implementer rather than to the reader — backticked block ids, an argument
 * with a draft nobody outside the repo has seen, a path to `runner.tsx`, and
 * one note of 1224 characters over a paragraph of questions. No author caught
 * it. Two translators did, independently, and both had carried it faithfully
 * into their own language first, which was the correct thing to do: the English
 * was the contract.
 *
 * This file is the contract instead.
 *
 * ── Where the numbers come from ───────────────────────────────────────
 *
 * Measured, not chosen. Every `section.*.note` in the repository at the time of
 * writing — eight instruments declare sections, four locales each, 152 notes —
 * was counted. The seven `good-life` notes in `en`, `es` and `de` were held out
 * as the known defect; the Polish translator had already rewritten theirs as
 * reader copy, so those count as evidence rather than as offenders.
 *
 *     131 sound notes     min 53    median 145   p90 217   p95 284   max 339
 *     21 memos            min 294   median 536   max 1421
 *
 * The two distributions overlap, which is the whole reason this file is not one
 * length check. The shortest memo — 294 characters, `good-life/en/work` — is
 * shorter than the longest sound note — 339, `before-marriage/es/commitment` —
 * so no ceiling separates them. What separates them is that the memo says
 * `learn-next` and the note does not.
 *
 * `CEILING` is therefore set where it does the most work without touching a
 * sound note. Above 339 is forced by the evidence. Below 385 is what makes the
 * ceiling catch the three memos carrying no other tell — the `later` note in
 * all three languages, which is plain prose about the bank's drafting history.
 * 360 sits in that window, 6% above the longest note anybody has written, which
 * is about what German costs over English here.
 *
 * A sound note that fails this is a note to shorten, not a ceiling to raise.
 *
 * ── Why the other rules ───────────────────────────────────────────────
 *
 * Each fires on none of the 131 and on at least three of the 21. They are not
 * style preferences; each names something that cannot be true of a sentence
 * written for a reader.
 *
 *   - A backtick is a code span in a file that has no code spans. The note is
 *     rendered as text into a `<p>`, so the reader sees the character. 18 of
 *     the 21 memos carry one.
 *   - A source filename is an address inside this repository. Six memos carry
 *     one, which is how `components/runner/runner.tsx` ended up above a
 *     question about money.
 *   - A camelCase word is an identifier. Prose does not produce one in any of
 *     the four languages — a German compound takes one capital, at the front.
 *   - A block id spelled out is the note talking about the instrument rather
 *     than to the person taking it, and it is the tell that survives when every
 *     backtick is stripped. Only hyphenated ids are checked: a one-word id like
 *     `sleep` is indistinguishable from the word.
 *
 * And `*`, which is none of those: it is markup that nothing renders. A note
 * reading «what the work is *for*» prints the asterisks at somebody.
 *
 * ── What is deliberately not checked ──────────────────────────────────
 *
 * Parentheses and slashes also appear in none of the 131 and in six of the 21.
 * They are ordinary punctuation that happens to be absent today, and banning
 * them would be this file's taste rather than its evidence. The filename rule
 * already catches the only slashes that mattered.
 */

/** Above every sound note by 6%, below the shortest memo no other rule sees. */
const CEILING = 360;

/**
 * A title is a heading in `label-caps`, and it wraps rather than truncates.
 * Measured across the same 152: min 4, median 21, p90 30, max 40
 * (`good-life/pl/keep`). 60 is half again as long as anything written, which
 * leaves room for a language that needs it and none for a sentence.
 */
const TITLE_CEILING = 60;

const NOTE = /^section\.(.+)\.note$/;
const TITLE = /^section\.(.+)\.title$/;
const BLOCK = /^stance\.([^.]+)\.prompt$/;

/**
 * What every failure message says before it says which note.
 *
 * A character count in a diff tells the next author to cut a sentence. It does
 * not tell them the sentence is on a page, which is the thing they have to
 * know to cut the right one.
 */
const PAINTED =
  "A section note is reader-facing copy: sectionHeader in components/runner/runner.tsx draws it " +
  "above the questions of a page, and an instrument's View.tsx draws it again on the result. It is " +
  "one to three sentences telling the reader what this section covers and how to answer it — see " +
  "docs/banks/boundaries.json and docs/banks/faith.json for the register. It is not the place for " +
  "the argument behind the bank; that belongs in the instrument's blocks.ts, where the rest of it lives.";

type Row = {
  where: string;
  text: string;
  /** The hyphenated block ids of the instrument this note belongs to. */
  blocks: readonly string[];
};

/** Every section note and title the app can put in front of a reader, in one locale. */
async function sectionCopy(locale: Locale): Promise<{ notes: Row[]; titles: Row[]; untitled: string[] }> {
  const notes: Row[] = [];
  const titles: Row[] = [];
  const untitled: string[] = [];

  for (const { spec } of registry.all()) {
    // `loadInstrument` is the path the app itself takes, so this measures what
    // a reader would be served. It namespaces every key under the instrument's
    // id, which is stripped back off here: the shapes below are the ones
    // written in the message file and in the bank.
    const own = (key: string) => (key.startsWith(`${spec.id}.`) ? key.slice(spec.id.length + 1) : key);
    const table = await loadInstrument(spec, locale);
    // A block id is a property of the bank and not of the language, so the list
    // is read once from English and applied to every locale's notes.
    const english = await loadInstrument(spec, DEFAULT_LOCALE);
    const blocks = Object.keys(english)
      .map((raw) => BLOCK.exec(own(raw))?.[1])
      .filter((id): id is string => typeof id === "string" && id.includes("-"));

    for (const [raw, value] of Object.entries(table)) {
      if (typeof value !== "string") continue;
      const key = own(raw);
      const note = NOTE.exec(key);
      if (note) {
        notes.push({ where: `${spec.id}/${locale}/${note[1]}`, text: value, blocks });
        // `sectionHeader` returns null when the title is undefined, so a note
        // with no title beside it is never drawn on the runner at all: the
        // reader meets the questions under no heading and nothing says so.
        if (typeof table[`${spec.id}.section.${note[1]}.title`] !== "string") untitled.push(`${spec.id}/${locale}/${note[1]}`);
        continue;
      }
      const title = TITLE.exec(key);
      if (title) titles.push({ where: `${spec.id}/${locale}/${title[1]}`, text: value, blocks });
    }
  }

  // A gate that finds nothing to measure passes forever. The readability gate
  // in this directory did exactly that once.
  expect(notes.length, `no section notes found for ${locale} — this gate would be measuring nothing`).toBeGreaterThan(0);
  return { notes, titles, untitled };
}

const escaped = (id: string) => id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const named = (row: Row) =>
  row.blocks.filter((id) => new RegExp(`(^|[^\\p{L}\\p{N}-])${escaped(id)}([^\\p{L}\\p{N}-]|$)`, "u").test(row.text));

test.each(TAGS)("no section note in %s is longer than the paragraph it is", async (locale) => {
  const { notes } = await sectionCopy(locale as Locale);
  const over = notes
    .filter((row) => row.text.length > CEILING)
    .map((row) => `${row.where}: ${row.text.length} characters, ceiling ${CEILING} — ${row.text.slice(0, 140)}…`);
  expect(
    over,
    `${PAINTED}\n\nThe longest sound note in the repository is 339 characters. Anything materially ` +
      `past that is an argument that escaped into the copy, and the reader is the one holding it.`,
  ).toEqual([]);
});

test.each(TAGS)("no section note in %s is written in this repository's vocabulary", async (locale) => {
  const { notes } = await sectionCopy(locale as Locale);
  const bad = notes.flatMap((row) => {
    const tells: string[] = [];
    if (row.text.includes("`")) tells.push("a backtick, which prints as a backtick");
    const file = /[\w-]+\.(?:ts|tsx|js|mjs|json|css)\b/.exec(row.text);
    if (file) tells.push(`the filename "${file[0]}"`);
    const camel = /\b[a-z]+[A-Z][A-Za-z]*\b/.exec(row.text);
    if (camel) tells.push(`the identifier "${camel[0]}"`);
    const ids = named(row);
    if (ids.length) tells.push(`the block id(s) ${ids.map((id) => `"${id}"`).join(", ")}`);
    return tells.length ? [`${row.where}: ${tells.join("; ")}`] : [];
  });
  expect(
    bad,
    `${PAINTED}\n\nEvery item above is an address inside this codebase. The person reading it has ` +
      `no blocks.ts, no block ids and no runner — they have a page with questions on it.`,
  ).toEqual([]);
});

test.each(TAGS)("no section note in %s carries markup nothing renders", async (locale) => {
  const { notes } = await sectionCopy(locale as Locale);
  const bad = notes
    .filter((row) => row.text.includes("*"))
    .map((row) => `${row.where}: contains "*" — ${row.text.slice(0, 140)}…`);
  expect(
    bad,
    `${PAINTED}\n\nThe note is interpolated into a <p> as text. No Markdown is parsed on that page, ` +
      `so *for* reaches the reader with both asterisks still on it.`,
  ).toEqual([]);
});

test.each(TAGS)("every section note in %s has a title over it", async (locale) => {
  const { untitled } = await sectionCopy(locale as Locale);
  expect(
    untitled,
    `${PAINTED}\n\nsectionHeader returns null when section.<id>.title is undefined, so a note with ` +
      `no title beside it is never drawn at all: the reader meets those questions under no heading ` +
      `and nothing logs it. Give the section a title, or take the note away.`,
  ).toEqual([]);
});

test.each(TAGS)("every section title in %s stays a heading", async (locale) => {
  const { titles } = await sectionCopy(locale as Locale);
  const bad = titles.flatMap((row) => {
    if (!row.text.trim()) return [`${row.where}: empty`];
    if (row.text.length > TITLE_CEILING) return [`${row.where}: ${row.text.length} characters, ceiling ${TITLE_CEILING} — "${row.text}"`];
    if (/[\n\r]/.test(row.text)) return [`${row.where}: contains a line break`];
    if (row.text.includes("`")) return [`${row.where}: contains a backtick — "${row.text}"`];
    return [];
  });
  expect(
    bad,
    `A section title is the heading over a page of questions and over a block of the result. The ` +
      `longest one anybody has written is 40 characters; past ${TITLE_CEILING} it is a sentence ` +
      `wearing a heading's typography, and it wraps.`,
  ).toEqual([]);
});
