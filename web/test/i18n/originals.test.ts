import { expect, test } from "vitest";
import { TAGS, DEFAULT_LOCALE } from "@/core/locales";

/**
 * A table under a language tag has to be written in that language.
 *
 * `parity.test.ts` compares key *sets* and `readability.test.ts` measures the
 * strings it finds, so a file that re-exports English — `export { default }
 * from "./en"` — satisfies both perfectly: it has exactly English's keys, and
 * English strings already pass a gate English was written against. The two
 * gates together say nothing about the one property that matters to somebody
 * who picked Deutsch, which is whether any of it is in German. This test is
 * that property, and `money-management/de` is the file it was written for.
 *
 * ── Why a threshold and not equality ──────────────────────────────────
 *
 * Some values are legitimately the same in two languages, and a test that
 * demanded every value differ would be a test against proper nouns. "Metal"
 * is an element in every locale, `polarity.yang` is "yang", and a format
 * string made of nothing but placeholders — `"{score} — {blurb}"` — has no
 * words in it to translate. So the honest shape is a rate with a line drawn
 * far above where a written table lands and far below where a copied one does.
 *
 * ── Where the line came from ──────────────────────────────────────────
 *
 * Measured, not guessed. Across every written table in this repo — twenty-one
 * instruments and the shell, three non-English locales each — the identical
 * share against English is:
 *
 *     6.7%  numerology/es       15/225   element names, yin and yang
 *     6.1%  conflict-style/*     5/82    placeholder-only format strings
 *     5.2%  jungian/de           6/116   "temperament", "dominant", "inferior"
 *     3.8%  shell/de            10/263   "Premium", "{count} min", scale points
 *     0.0%  eleven of them        0/…    nothing in common at all
 *
 * The German maximum is conflict-style's 6.1%; nothing anywhere reaches 7%. A
 * copied table is 100%, and a half-finished one — the more likely future
 * failure, where somebody translated the visible headings and left the option
 * labels — is somewhere above 50%. Thirty per cent sits about four and a half
 * times above the highest real overlap ever measured here and well below any
 * table that is half English, which leaves room for a small table of proper
 * nouns without leaving room for a table nobody wrote.
 *
 * ── Why this one reads the directory instead of the registry ──────────
 *
 * The other two gates iterate `registry.all()`, and the placeholder this test
 * exists for sat in an instrument that is not registered yet — deliberately,
 * because its own header said it must not be registered until the file was
 * written. A registry-driven gate would have gone green on it every day until
 * the morning somebody added one line to `instruments/index.ts`, and then the
 * English would have shipped. The hole is not "an unwritten locale in a live
 * instrument"; it is "an unwritten locale nobody is looking at". So the unit
 * here is the file on disk, and an instrument is covered from the moment its
 * `i18n/` directory exists.
 */
const LIMIT = 0.3;

type Table = { default: Record<string, unknown> };

/**
 * Every table on disk, lazily. `import.meta.glob` is Vite's, and this file
 * only ever runs under Vitest, which is Vite; the cast is because the
 * `ImportMeta` this repo compiles against is Next's, whose `glob` returns
 * `Promise<unknown>`.
 */
const FILES = import.meta.glob([
  "../../src/instruments/*/i18n/*.ts",
  "../../src/i18n/messages/*.ts",
]) as Record<string, () => Promise<Table>>;

/** "…/instruments/faith/i18n/de.ts" → faith · de; "…/i18n/messages/de.ts" → shell · de. */
function identify(path: string): { id: string; tag: string } {
  const parts = path.split("/");
  const tag = parts[parts.length - 1].replace(/\.ts$/, "");
  const id = parts[parts.length - 2] === "messages" ? "shell" : parts[parts.length - 3];
  return { id, tag };
}

const byId = new Map<string, Map<string, () => Promise<Table>>>();
for (const [path, load] of Object.entries(FILES)) {
  const { id, tag } = identify(path);
  if (!TAGS.includes(tag as (typeof TAGS)[number])) continue;
  if (!byId.has(id)) byId.set(id, new Map());
  byId.get(id)!.set(tag, load);
}

const strings = (table: Table) =>
  Object.fromEntries(
    Object.entries(table.default).filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;

/** For one locale: every table, and how much of it is byte-identical to English. */
async function copyRates(tag: string) {
  const rows: { id: string; same: number; total: number; rate: number }[] = [];
  for (const [id, tables] of byId) {
    const mine = tables.get(tag);
    const english = tables.get(DEFAULT_LOCALE);
    if (!mine || !english) continue;
    const en = strings(await english());
    const other = strings(await mine());
    const keys = Object.keys(en).filter((k) => k in other);
    if (keys.length === 0) continue;
    const same = keys.filter((k) => en[k] === other[k]).length;
    rows.push({ id, same, total: keys.length, rate: same / keys.length });
  }
  // A gate that silently measures nothing passes forever — readability.test.ts
  // learned this the hard way. If the glob stops matching, say so here.
  expect(rows.length, `no ${tag} tables found to compare against English`).toBeGreaterThan(0);
  return rows;
}

const WHAT_IT_MEANS = [
  "One or more tables are mostly the English table under another language tag.",
  "That is invisible to the other two gates — the keys are English's keys, so parity passes,",
  "and English strings pass a readability gate written for English — and it is visible to",
  "every reader who picks that language and is served a page in the wrong one.",
  `The line is ${LIMIT * 100}% because the highest overlap any written table in this repo has`,
  "with English is 6.7% (numerology/es: element names and yin/yang) and the highest in German",
  "is 6.1% (conflict-style/de: format strings that are only placeholders). A table above the",
  "line was copied, not written. Write it, or delete the file and let the runtime fall back to",
  "English visibly — do not leave a placeholder that passes.",
].join(" ");

test.each(TAGS.filter((tag) => tag !== DEFAULT_LOCALE))(
  "every %s table is written rather than copied from English",
  async (tag) => {
    const copied = (await copyRates(tag))
      .filter((r) => r.rate > LIMIT)
      .map((r) => `${r.id}/${tag}: ${r.same} of ${r.total} values identical to English (${Math.round(r.rate * 100)}%)`);
    expect(copied, WHAT_IT_MEANS).toEqual([]);
  },
);
