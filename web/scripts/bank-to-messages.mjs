import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/**
 * Turn a vetted bank into an English message table.
 *
 *     node scripts/bank-to-messages.mjs faith
 *     node scripts/bank-to-messages.mjs faith --check
 *
 * `docs/banks/<id>.json` is where an inventory's words were written and
 * critiqued. `src/instruments/<id>/i18n/en.ts` is the same words keyed the way
 * `core/stance.ts` looks them up. Hand-transcribing the second from the first
 * is eight hundred lines of copying per instrument, and the first edit to
 * either afterwards is the moment they stop being the same words — silently,
 * because nothing downstream compares prose.
 *
 * So this is the convenience and `test/i18n/stance-keys.test.ts` is the
 * protection. The test fails when the form asks for a key the table does not
 * define, or the table defines a `stance.*` key the form never asks for; that
 * holds whether or not anybody ever runs this script.
 *
 * ── What it will not do ───────────────────────────────────────────────
 *
 * It does not invent copy. `title`, `tagline` and `framework` are not in any
 * bank, and neither is the wording of a `groundsPrompt`; where the existing
 * file has them they are carried through untouched, and where it does not they
 * are written as TODO placeholders and listed at the end under a heading the
 * author cannot miss. A generator that filled those in with something
 * plausible would be putting uncritiqued sentences in front of a reader with
 * the authority of everything around them.
 *
 * It does not overwrite a value somebody edited in place. If the table says
 * something different from the bank for a key this script generates, that is a
 * decision — either the bank is stale or the file is — and it is reported and
 * left alone unless `--overwrite` says which way to resolve it.
 *
 * It does not drop prose it cannot regenerate. Anything in the existing table
 * outside the namespaces below (`card.*` in `communication-style`, for
 * instance) is hand-written, is carried through verbatim, and is counted in the
 * summary. So is the leading docblock, and so is every comment *inside* the
 * table: a comment is the one thing in a message file that was written by a
 * person for a person, it says things the bank does not know — that these
 * twelve are asked in the order somebody thinks in, that the six cards are
 * deliberately not the four sections — and a generator that replaced it with a
 * label would be deleting the argument and leaving the heading. Where a key
 * already carries a comment, that comment wins over anything this script would
 * have written above it. If the file cannot be parsed with confidence, nothing
 * is written at all.
 *
 * And it does not stay quiet about a bank field it does not recognise. A
 * critiqued playbook line going missing because a key was renamed in the bank
 * and nobody taught this script about it is precisely the failure the summary
 * exists to prevent, so every leaf in the JSON is accounted for by name.
 */

const WEB = fileURLToPath(new URL("..", import.meta.url));

/* ── the key shapes, read out of core/stance.ts ──────────────────────
   Not restated here. `promptKey` and its three siblings are the definition of
   where a word lives, they are module-private, and a second copy of them in a
   generator is a second thing to keep in step. Reading the templates out of the
   source means a change to a key shape either follows into this script or stops
   it — and stopping is the right failure, because a generator that quietly
   writes yesterday's key shape produces a table that type-checks, ships, and
   renders the key at the reader. */

const stanceSource = await readFile(`${WEB}src/core/stance.ts`, "utf8");

/** The interpolations these templates are allowed to contain, and what fills them. */
const SLOTS = { "block.id": "id", value: "value" };

function keyShape(name) {
  const found = stanceSource.match(new RegExp(`\\bconst\\s+${name}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\`([^\`]*)\``));
  if (!found) {
    throw new Error(
      `bank-to-messages: could not find "const ${name} = (…) => \`…\`" in src/core/stance.ts.\n` +
        `The key shapes are read from that file rather than copied here. Either the function was ` +
        `renamed — in which case fix the name in this script — or it stopped being a one-line ` +
        `template, in which case this script must not guess what it now returns.`,
    );
  }
  const template = found[1];
  for (const [, expr] of template.matchAll(/\$\{([^}]*)\}/g)) {
    if (!(expr.trim() in SLOTS)) {
      throw new Error(
        `bank-to-messages: ${name} interpolates \${${expr.trim()}}, which this script cannot fill. ` +
          `It knows ${Object.keys(SLOTS).map((s) => "${" + s + "}").join(" and ")}.`,
      );
    }
  }
  return (parts) => template.replace(/\$\{([^}]*)\}/g, (_, expr) => parts[SLOTS[expr.trim()]]);
}

const KEY = {
  prompt: keyShape("promptKey"),
  option: keyShape("optionKey"),
  groundsPrompt: keyShape("groundsPromptKey"),
  groundsOption: keyShape("groundsOptionKey"),
};

/**
 * The prompt key for an `openItems` entry.
 *
 * `core/stance.ts` has nothing to say about these — they are not stance blocks,
 * they are plain `text` items with no answer, no weight and no grounds. So the
 * shape is the one the other fifteen instruments already use for a bare item
 * prompt (`item.<id>`, see any `spec.ts`), and it deliberately sits outside
 * `stance.*` so that the drift test's second half — no `stance.*` key the form
 * never asks for — does not read a letter to yourself at seventy as a stray
 * block prompt.
 */
const openItemKey = (id) => `item.${id}`;

/** The namespaces this script owns. Anything else in a table is hand-written. */
const GENERATED = [/^sourceNote$/, /^section\./, /^stance\./, /^playbook\./, /^item\./];
/** Written once by a person, then carried through every run. */
const CARRIED = new Set(["title", "tagline", "framework"]);

const isGenerated = (key) => GENERATED.some((re) => re.test(key));

/* ── every leaf the banks are allowed to contain ─────────────────────
   A path ending in `.*` matches anything below it. The value is what the field
   is *for*, and it is printed in the summary — the point is that a reader of
   the summary can see that `tells` was seen and deliberately not turned into a
   message, rather than having to trust that it was. */

const KNOWN = {
  "bank.id": "names the instrument",
  "bank.sections[].id": "key material",
  "bank.sections[].title": "→ section.<id>.title",
  "bank.sections[].note": "→ section.<id>.note",
  "bank.blocks[].id": "key material",
  "bank.blocks[].kind": "declaration — blocks.ts",
  "bank.blocks[].prompt": "→ stance.<id>.prompt",
  "bank.blocks[].options[].value": "key material",
  "bank.blocks[].options[].label": "→ stance.<id>.opt.<value>",
  "bank.blocks[].section": "declaration — blocks.ts",
  "bank.blocks[].max": "declaration — blocks.ts",
  "bank.blocks[].exclusive[]": "declaration — blocks.ts",
  "bank.blocks[].groundsExclusive[]": "declaration — blocks.ts",
  "bank.blocks[].skipWeight": "declaration — blocks.ts",
  "bank.blocks[].private": "declaration — blocks.ts",
  "bank.blocks[].grounds": "declaration — blocks.ts; when true, → stance.<id>.groundsPrompt",
  "bank.blocks[].grounds[]": "declaration — blocks.ts; the subset of bank.grounds this block offers",
  "bank.blocks[].tells": "editorial — what the block tells you; never shown to a reader",
  "bank.grounds[].value": "key material",
  "bank.grounds[].label": "→ stance.grounds.<value>",
  "bank.openItems[].id": "key material",
  "bank.openItems[].prompt": "→ item.<id>",
  "bank.openItems[].kind": "declaration — blocks.ts",
  "bank.openItems[].rows": "declaration — blocks.ts",
  "bank.openItems[].section": "declaration — blocks.ts",
  "bank.openItems[].tier": "declaration — blocks.ts",
  "bank.playbookOk[].id": "key material",
  "bank.playbookOk[].text": "→ playbook.<id>",
  "bank.playbookOk[].from": "declaration — spec.ts derivation",
  "bank.playbookNotOk[].id": "key material",
  "bank.playbookNotOk[].text": "→ playbook.<id>",
  "bank.playbookNotOk[].from": "declaration — spec.ts derivation",
  "bank.sourceNote": "→ sourceNote",
  "bank.provenance.*": "provenance.ts",
  "bank.rejected[].idea": "editorial — what was considered and cut",
  "bank.rejected[].why": "editorial — what was considered and cut",
  "bank.sources[]": "provenance.ts",
  "changes[]": "editorial — the critique log",
  "critiqued": "editorial — the critique log",
};

/** Every leaf path in a parsed bank, `[]` standing for an array index. */
function leaves(value, path = "", out = new Set()) {
  if (Array.isArray(value)) for (const entry of value) leaves(entry, `${path}[]`, out);
  else if (value && typeof value === "object") for (const key of Object.keys(value)) leaves(value[key], path ? `${path}.${key}` : key, out);
  else out.add(path);
  return out;
}

const knownFor = (path) => {
  if (path in KNOWN) return KNOWN[path];
  for (const [pattern, why] of Object.entries(KNOWN)) {
    if (pattern.endsWith(".*") && path.startsWith(pattern.slice(0, -1))) return why;
  }
  return null;
};

/* ── reading a table that is already on disk ─────────────────────────
   A scanner rather than an import, because the file has to be read for what it
   *says* — its leading docblock, its exact keys — and because a table that has
   grown something this script cannot account for must stop it rather than be
   half-understood. Every failure below returns a reason and writes nothing. */

function parseTable(text) {
  const at = text.indexOf("export default");
  if (at === -1) return { ok: false, why: 'no "export default" in the file' };
  let i = text.indexOf("{", at);
  if (i === -1) return { ok: false, why: "no object literal after export default" };

  const header = text.slice(0, at).trimEnd();
  const values = new Map();
  /**
   * Everything between one entry and the next: blank lines, indentation, and
   * any comment a person wrote there. Kept as raw text and put back byte for
   * byte, because a comment reflowed is a comment somebody has to re-read to
   * see whether it changed.
   */
  const leads = new Map();
  i++;

  const skip = () => {
    for (;;) {
      while (i < text.length && /\s/.test(text[i])) i++;
      if (text.startsWith("//", i)) {
        const end = text.indexOf("\n", i);
        i = end === -1 ? text.length : end + 1;
        continue;
      }
      if (text.startsWith("/*", i)) {
        const end = text.indexOf("*/", i);
        if (end === -1) return false;
        i = end + 2;
        continue;
      }
      return true;
    }
  };

  // Only a double-quoted single-line string, which is what every table in the
  // repo is written as. A template literal or a concatenation is a value this
  // script would have to evaluate to read, and evaluating is how a generator
  // ends up writing back something subtly other than what was there.
  const readString = () => {
    if (text[i] !== '"') return null;
    let j = i + 1;
    for (;;) {
      if (j >= text.length) return null;
      if (text[j] === "\\") {
        j += 2;
        continue;
      }
      if (text[j] === "\n") return null;
      if (text[j] === '"') break;
      j++;
    }
    const raw = text.slice(i, j + 1);
    i = j + 1;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  for (;;) {
    const opened = i;
    if (!skip()) return { ok: false, why: "unterminated comment" };
    if (text[i] === "}") break;
    const quoted = i;
    const key = readString();
    if (key === null) return { ok: false, why: `expected a quoted key at character ${i}` };
    if (!skip()) return { ok: false, why: "unterminated comment" };
    if (text[i] !== ":") return { ok: false, why: `expected ":" after "${key}"` };
    i++;
    if (!skip()) return { ok: false, why: "unterminated comment" };
    const value = readString();
    if (value === null) return { ok: false, why: `"${key}" is not a plain double-quoted string` };
    if (values.has(key)) return { ok: false, why: `"${key}" appears twice` };
    values.set(key, value);
    leads.set(key, text.slice(opened, quoted));
    const closed = i;
    if (!skip()) return { ok: false, why: "unterminated comment" };
    // A comment between a value and its comma belongs to neither entry, so
    // there is nowhere to put it back. Refusing beats losing it.
    if (/\/\*|\/\//.test(text.slice(closed, i))) {
      return { ok: false, why: `a comment sits between "${key}" and its comma, where this script cannot put it back` };
    }
    if (text[i] === ",") {
      i++;
      continue;
    }
    if (text[i] === "}") break;
    return { ok: false, why: `expected "," or "}" after "${key}"` };
  }

  return { ok: true, header, values, leads };
}

/* ── the run ─────────────────────────────────────────────────────────── */

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith("--")));
const id = argv.find((a) => !a.startsWith("--"));
const check = flags.has("--check");
const overwrite = flags.has("--overwrite");

for (const flag of flags) {
  if (flag !== "--check" && flag !== "--overwrite") {
    console.error(`unknown flag ${flag}. Usage: node scripts/bank-to-messages.mjs <bank-id> [--check] [--overwrite]`);
    process.exit(2);
  }
}
if (!id) {
  console.error("usage: node scripts/bank-to-messages.mjs <bank-id> [--check] [--overwrite]");
  process.exit(2);
}

const bankPath = `docs/banks/${id}.json`;
const outPath = `src/instruments/${id}/i18n/en.ts`;

let raw;
try {
  raw = JSON.parse(await readFile(`${WEB}../${bankPath}`, "utf8"));
} catch (error) {
  console.error(`cannot read ${bankPath}: ${error.message}`);
  process.exit(1);
}
const bank = raw.bank ?? raw;
if (bank.id && bank.id !== id) {
  console.error(`${bankPath} declares id "${bank.id}" but was asked for as "${id}"`);
  process.exit(1);
}

let existing = { ok: true, header: null, values: new Map(), leads: new Map() };
let hadFile = false;
try {
  const text = await readFile(`${WEB}${outPath}`, "utf8");
  hadFile = true;
  existing = parseTable(text);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (!existing.ok) {
  console.error(`REFUSING TO WRITE ${outPath}`);
  console.error(`  it is already there and this script cannot read it: ${existing.why}`);
  console.error(`  Every word in that file is either hand-written or was critiqued in the bank.`);
  console.error(`  Nothing has been changed. Move it aside deliberately if you mean to regenerate it.`);
  process.exit(1);
}

const before = existing.values;
const placeholders = [];
const edited = [];

/**
 * One row of the table.
 *
 * `bankValue` is what the bank says. A file that says something else for the
 * same key was edited in place, which is a fact worth surfacing rather than a
 * conflict to resolve silently: the bank is the critiqued copy, but a person
 * who fixed a typo in the table and not in the bank meant the fix.
 */
const rows = [];
/**
 * Two ways a bank can make a table that must not be written, both caught here
 * rather than by whoever opens the file next.
 *
 * A missing or non-string value produces `"stance.x.prompt": undefined` — which
 * does not compile, and if it did would render as the word at a reader. A
 * repeated key produces the same property twice, which TypeScript rejects and
 * which, in a file that did compile, would mean the second copy silently won.
 * Neither is a thing to warn about and write anyway: the bank is wrong, and the
 * table it would produce is not a lesser version of the right one.
 */
const unusable = [];
const duplicates = [];
const seen = new Set();

function claim(key, value) {
  if (typeof value !== "string") {
    unusable.push({ key, got: value === undefined ? "nothing at all" : JSON.stringify(value) });
    return;
  }
  if (seen.has(key)) {
    duplicates.push(key);
    return;
  }
  seen.add(key);
  rows.push({ key, value });
}

function emit(key, bankValue) {
  const was = before.get(key);
  if (typeof bankValue === "string" && was != null && was !== bankValue) {
    edited.push({ key, bank: bankValue, file: was });
    claim(key, overwrite ? bankValue : was);
    return;
  }
  claim(key, bankValue);
}

/**
 * A key with no source anywhere: carried through if a person has written it,
 * a placeholder if not.
 *
 * The placeholder is still reported on every later run, and that is the point
 * of recognising it rather than merely writing it. A TODO that stops being
 * mentioned the second time the script runs is a TODO that ships: the run that
 * created it is the one nobody re-reads, and every run after it says the file
 * is fine.
 */
const TODO = "TODO — ";
function emitAuthored(key, what) {
  const was = before.get(key);
  const value = was ?? `${TODO}${what}. No bank carries this; write it and delete this line's TODO.`;
  if (value.startsWith(TODO)) placeholders.push({ key, what, since: was != null });
  claim(key, value);
}

const group = (comment) => rows.push({ comment });

/* 1 — the four the catalogue reads, three of which no bank carries. */
emitAuthored("title", "the instrument's name in the catalogue");
emitAuthored("tagline", "one sentence under the name in the catalogue");
emitAuthored("framework", "the one-line description of what this is");
if (typeof bank.sourceNote === "string") emit("sourceNote", bank.sourceNote);

/* 2 — sections. */
const sections = bank.sections ?? [];
if (sections.length) {
  group("the sections");
  for (const section of sections) {
    emit(`section.${section.id}.title`, section.title);
    emit(`section.${section.id}.note`, section.note);
  }
}

const blocks = bank.blocks ?? [];

/* 3 — one prompt per block, all together: they are the instrument read end to
   end, and a reviewer checking that the questions do not overlap wants them in
   one run rather than sixty lines apart. */
if (blocks.length) {
  group("the questions");
  for (const block of blocks) emit(KEY.prompt({ id: block.id }), block.prompt);
}

/* 4 — what may be answered, grouped by block. */
if (blocks.length) {
  group("what may be answered");
  for (const block of blocks) {
    rows.push({ note: block.id });
    for (const option of block.options ?? []) emit(KEY.option({ id: block.id, value: option.value }), option.label);
  }
}

/* 5 — grounds. The per-block prompt has no source in any bank; the flat option
   words do, and are flat on purpose — "scripture" has to be the same word in
   every block or two answers cannot be read as the same ground. */
const grounded = blocks.filter((block) => block.grounds && (!Array.isArray(block.grounds) || block.grounds.length));
const groundsVocabulary = bank.grounds ?? [];
const groundsKnown = new Set(groundsVocabulary.map((ground) => ground.value));
/**
 * A block that names its own subset of the grounds still takes its words from
 * the one bank-level list, because `groundsOptionKey` is flat by value and not
 * by block — that is the whole point of it. A value with no entry in that list
 * has no word anywhere, so it is collected rather than skipped.
 */
const groundsMissing = grounded
  .flatMap((block) => (Array.isArray(block.grounds) ? block.grounds.map((value) => ({ block: block.id, value })) : []))
  .filter(({ value }) => !groundsKnown.has(value));
if (grounded.length || groundsVocabulary.length) {
  group("what a position rests on");
  for (const block of grounded) {
    emitAuthored(KEY.groundsPrompt({ id: block.id }), `how to ask what "${block.id}" rests on`);
  }
  for (const ground of groundsVocabulary) emit(KEY.groundsOption({ value: ground.value }), ground.label);
}

/* 6 — the playbook. Second person, complete, handable to somebody unedited.
   The two halves stay two halves: the bank writes them as separate lists and
   the id prefix is the only other thing that says which is which, so running
   them together loses a distinction the author made on purpose. */
const ok = bank.playbookOk ?? [];
const notOk = bank.playbookNotOk ?? [];
const playbook = [...ok, ...notOk];
if (playbook.length) {
  group("the playbook");
  if (ok.length) rows.push({ note: "this is fine" });
  for (const line of ok) emit(`playbook.${line.id}`, line.text);
  if (notOk.length) rows.push({ note: "this is not" });
  for (const line of notOk) emit(`playbook.${line.id}`, line.text);
}

/* 7 — open items: text with no closed answer, never scored, never shared. */
const openItems = bank.openItems ?? [];
if (openItems.length) {
  group("open space");
  for (const item of openItems) emit(openItemKey(item.id), item.prompt);
}

/* 8 — whatever else was already in the file. Not ours, not the bank's, and on
   no account dropped: `card.*` in communication-style is six hand-written
   headings that exist nowhere else. */
const written = new Set(rows.filter((r) => r.key).map((r) => r.key));
const kept = [...before.keys()].filter((key) => !written.has(key) && !isGenerated(key) && !CARRIED.has(key));
if (kept.length) {
  group("hand-written — not from the bank, carried through untouched");
  for (const key of kept) rows.push({ key, value: before.get(key) });
}

/* A generated-namespace key the bank no longer describes is stale — a block or
   a playbook line that was cut. It is dropped, and said out loud, because the
   alternative is a table that accumulates keys for questions nobody is asked. */
const stale = [...before.keys()].filter((key) => !written.has(key) && !kept.includes(key) && !CARRIED.has(key));

/* ── before anything is written ──────────────────────────────────────
   Three faults in the bank that would produce a table nobody can use. Each is
   the bank's to fix, and a half-written file is not a smaller version of the
   right one — it is the same missing sentence with a compiler error in front of
   it, or without. */

if (unusable.length || duplicates.length || groundsMissing.length) {
  console.error(`REFUSING TO WRITE ${outPath} — ${bankPath} cannot make a whole table`);
  for (const { key, got } of unusable) {
    console.error(`  ${key} would have no words: the bank has ${got} where a string belongs`);
  }
  for (const key of duplicates) {
    console.error(`  ${key} is claimed twice — two blocks, sections or playbook lines share an id`);
  }
  for (const { block, value } of groundsMissing) {
    console.error(`  block "${block}" offers the ground "${value}", which bank.grounds does not define`);
  }
  console.error(`  Nothing has been changed.`);
  process.exit(1);
}

/* ── the file ────────────────────────────────────────────────────────── */

const DEFAULT_HEADER = `/**
 * ${id} — English, and the source of truth for the other three.
 *
 * Generated by scripts/bank-to-messages.mjs from docs/banks/${id}.json, which
 * is where these sentences were written and critiqued. This file is that bank
 * keyed the way core/stance.ts looks words up, so a prompt has exactly one
 * home. test/i18n/stance-keys.test.ts fails if the two drift.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */`;

const rule = (label) => {
  const line = `  /* ── ${label} `;
  return `${line}${"─".repeat(Math.max(3, 72 - line.length))} */`;
};

/**
 * Turn the rows into text, one lead at a time.
 *
 * A "lead" is everything between one entry and the next — the blank line, the
 * indentation, the group rule. Where the file on disk already had a comment in
 * that gap, the gap is put back exactly as it was and whatever this script had
 * queued for it is dropped. That is the rule the header docblock follows too,
 * and it is why regenerating `communication-style` is a no-op rather than a
 * diff that quietly replaces four paragraphs of argument with four labels.
 */
const carriedComments = [];
const pieces = [];
let pending = "";
for (const row of rows) {
  if (row.comment) {
    pending += `\n\n${rule(row.comment)}`;
    continue;
  }
  if (row.note) {
    pending += `\n  /* ${row.note} */`;
    continue;
  }
  const carried = existing.leads.get(row.key);
  const keepsProse = carried != null && /\/\*|\/\//.test(carried);
  if (keepsProse) carriedComments.push(row.key);
  pieces.push(`${keepsProse ? carried : `${pending}\n  `}${JSON.stringify(row.key)}: ${JSON.stringify(row.value)},`);
  pending = "";
}

/* A file whose docblock somebody deleted gets the generated one back. Silence
   at the top of a generated file is the one thing it must not have: the next
   person to edit it by hand has no way to know the bank exists. */
const ownHeader = existing.header && existing.header.trim() ? existing.header : null;
const output = `${ownHeader ?? DEFAULT_HEADER}\nexport default {${pieces.join("")}\n};\n`;

/* ── what happened ───────────────────────────────────────────────────── */

const keyCount = rows.filter((r) => r.key).length;
let current = null;
try {
  current = await readFile(`${WEB}${outPath}`, "utf8");
} catch {
  /* no file yet */
}
const identical = current === output;

if (check) {
  console.log(`${identical ? "unchanged" : "WOULD CHANGE"}  ${outPath}`);
} else if (identical) {
  console.log(`unchanged  ${outPath}`);
} else {
  // Seven of the eight banks have no instrument folder yet, and the table is
  // the first file of one.
  await mkdir(`${WEB}src/instruments/${id}/i18n`, { recursive: true });
  await writeFile(`${WEB}${outPath}`, output, "utf8");
  console.log(`wrote  ${outPath}`);
}

console.log(`  ${keyCount} keys — ${blocks.length} blocks, ${sections.length} sections, ${playbook.length} playbook lines, ${openItems.length} open items`);
if (kept.length) console.log(`  carried through ${kept.length} hand-written key(s) the bank does not describe: ${kept.join(", ")}`);
if (carriedComments.length) {
  console.log(`  left ${carriedComments.length} comment block(s) exactly as they were — this script never rewrites a comment it finds: ${carriedComments.join(", ")}`);
}
if (ownHeader) console.log(`  kept the file's own docblock — this script did not write it and will not replace it`);
if (!hadFile) console.log(`  no previous ${outPath} — everything above had to be written from scratch`);

/**
 * Every leaf in the JSON, named, with what became of it.
 *
 * Printed in full on every run rather than only on a surprise. The failure this
 * guards against is a critiqued line that never reaches a reader, and that
 * failure looks exactly like success from here: the script writes a table, the
 * table type-checks, the page renders, and one sentence somebody argued over is
 * simply not in it. A list of thirty paths is cheap; noticing that `tells` is on
 * it and `text` is not is the whole point.
 */
const unaccounted = [];
const accounted = [];
for (const path of [...leaves(raw)].sort((a, b) => a.localeCompare(b))) {
  const why = knownFor(path);
  if (why) accounted.push([path, why]);
  else unaccounted.push(path);
}
console.log(`  bank fields seen and what became of them:`);
for (const [path, why] of accounted) console.log(`    ${path.padEnd(34)} ${why}`);

let blocking = false;
const shout = (line) => console.log(line);

if (unaccounted.length) {
  blocking = true;
  shout(`\n!! ${unaccounted.length} BANK FIELD(S) THIS SCRIPT DOES NOT KNOW ABOUT`);
  for (const path of unaccounted) shout(`     ${path}`);
  shout(`   Nothing was written for them. If one of those is reader-facing copy it is`);
  shout(`   now missing from ${outPath} and nothing downstream will say so.`);
  shout(`   Teach KNOWN in this script what it is for.`);
}

if (placeholders.length) {
  shout(`\n!! ${placeholders.length} KEY(S) NEED AN AUTHOR — no bank carries them`);
  for (const { key, what, since } of placeholders) shout(`     ${key.padEnd(38)} ${what}${since ? " (still a placeholder from an earlier run)" : ""}`);
  shout(`   They are placeholders, in the file, reading as copy. Replace them before this ships.`);
}

if (edited.length) {
  shout(`\n!! ${edited.length} KEY(S) DIFFER BETWEEN THE BANK AND THE FILE`);
  for (const { key, bank: b, file: f } of edited) {
    shout(`     ${key}`);
    shout(`       bank: ${b.length > 90 ? b.slice(0, 90) + "…" : b}`);
    shout(`       file: ${f.length > 90 ? f.slice(0, 90) + "…" : f}`);
  }
  if (overwrite) {
    shout(`   --overwrite was given, so the bank's wording won. Check that was the intent.`);
  } else {
    shout(`   SKIPPED — the file's wording was kept and the bank's was not written. One of`);
    shout(`   the two is stale. Fix the bank, or re-run with --overwrite to take the bank's.`);
  }
}

if (stale.length) {
  shout(`\n!! ${stale.length} KEY(S) DROPPED — in the file, no longer in the bank`);
  for (const key of stale) shout(`     ${key}`);
  shout(`   These are in namespaces this script owns, so a bank that no longer describes`);
  shout(`   them means the question or line was cut. If that is wrong, the bank is wrong.`);
}

/**
 * `--check` says what a real run would do, at the level that matters.
 *
 * Keys and values, not bytes: a run that reflows a rule of box-drawing
 * characters has changed nothing anybody reads, and a check that reported it as
 * a difference alongside a dropped playbook line would teach whoever runs it to
 * skim past both.
 */
if (check && !identical) {
  const now = before;
  const added = rows.filter((r) => r.key && !now.has(r.key)).map((r) => r.key);
  const changed = rows.filter((r) => r.key && now.has(r.key) && now.get(r.key) !== r.value).map((r) => r.key);
  if (added.length) console.log(`  --check: would add ${added.length} key(s): ${added.join(", ")}`);
  if (changed.length) console.log(`  --check: would change ${changed.length} value(s): ${changed.join(", ")}`);
  if (!added.length && !changed.length && !stale.length) {
    console.log(`  --check: same keys and same values — the difference is comments or spacing only.`);
  }
}

/**
 * Non-zero for the two failures nobody may decide to live with: a bank field
 * with no home, and a `--check` that found real work to do. A TODO placeholder
 * and an edited-in-place value are loud but expected — the first is the normal
 * state of a table on the day it is generated, and the second is a question for
 * a person rather than a broken build.
 */
process.exit(blocking || (check && !identical) ? 1 : 0);
