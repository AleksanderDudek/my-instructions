# Multilanguage support — design

**Date:** 2026-08-21
**Status:** approved, not yet implemented

## What this is

Make My Instructions readable end to end in a language other than English:
the shell, all 125 questionnaire items, and all result prose. First delivery
is the machinery plus a complete English extraction. Polish, Spanish and
German follow as separate deliveries, one per language.

Splitting it that way is not caution for its own sake. Extraction bugs — a
string left hard-coded, a key that no locale defines — are cheap to find
against one locale and expensive to find against four, after three
translators have already worked around them.

## Why the app is ready for this

Nothing here fights the change. There is no framework, no build-time string
extraction, and no string glued to layout: every view goes through the
`html` tagged template in `src/core/html.js`, and instruments are already
isolated behind the registry contract.

Two properties matter more than the rest:

**Scoring is already locale-free.** `score(answers)` reads answers keyed by
item id and returns numbers. Translating an item's prompt does not touch it.

**Share links are already locale-proof.** `src/core/share.js` encodes
answers, not scores, keyed by item id — and item ids (`e5e`, `words`) are
language-independent. A test taken in Polish decodes and re-scores correctly
in a German browser with no extra work.

## Measured scope

| Area | String content | Notes |
|---|---|---|
| `src/instruments/` | ~31 KB | 125 items, plus type/language/trait prose and generated comparison sentences |
| `src/ui/` | ~7.4 KB | Page chrome, buttons, empty states, errors |
| `src/core/` | ~2.5 KB | `CHANNEL_LABEL`, scoring band names, share errors |
| `index.html` | small | Title, meta description, noscript, footer |

Roughly 6–7k words per language.

## Architecture

### 1. The `t` seam

`src/core/i18n.js` (~70 lines) exports:

```js
createI18n({ locale, messages, fallback: "en" })  // -> { t, locale, has }
```

Message syntax is ICU-lite: `{name}` interpolation, plus
`{count, plural, one{…} few{…} many{…} other{…}}` and
`{gender, select, …}`. It is a deliberate subset, not a general ICU parser —
the same choice `tools/build.mjs` makes about ES modules. An unsupported
form throws at load rather than mis-rendering at runtime.

Polish is the language this subset exists for: `one` / `few` / `many` is a
real requirement, not a theoretical one.

### 2. Registry contract change

`src/core/registry.js` gains `t` where text is produced, and only there:

| Before | After |
|---|---|
| `form()` | `form(t)` |
| `score(answers)` | unchanged |
| `view(result, ctx)` | `ctx` gains `ctx.t` |
| `instructions(result)` | `instructions(result, t)` |
| `compare(a, b, opts)` | `opts` gains `t` |

`score()` staying pure is load-bearing. Results computed under any locale are
identical, which is what keeps `compare` and share links honest across
languages.

`validate(spec)` calls `spec.form()` at registration time. It passes an
identity `t` that returns its own key: validation checks item ids, kinds and
shapes, never wording.

### 3. Where the words live

Per instrument, an `i18n/` folder beside `items.js`:

```
src/instruments/love-languages/
  items.js        structure only — id, scale, reverse-key flag
  i18n/en.js      "item.words1": "…", "lang.words.starved": "…"
  i18n/pl.js
```

Prompts key off the item id, so a translator's file is a flat id→sentence
list — the only shape that makes back-translation reviewable.

Shell strings go to `src/ui/i18n/en.js`. `CHANNEL_LABEL` in `registry.js`
and the band names in `scoring.js` become keys.

Adding an instrument therefore remains "write one folder", which is the
property the whole plugin design exists to protect.

### 4. Prose: whole-sentence keys

Generated prose — `compare()` in the Enneagram picks one of four sentences
from `adjacent` / `lineLinked` / `sameCentre` and interpolates a centre
label mid-sentence — does **not** get interpolated variables in translation.
Each conditional variant is its own complete key, with any noun already
inflected inside the sentence.

The reason is grammatical. `Both of you lead from the ${centre} centre`
needs the interpolated noun in the correct case in Polish and the correct
gender in Spanish. Keeping the sentence whole makes agreement the
translator's problem inside one string, rather than the code's problem
across an interpolation boundary. Interpolation is reserved for values that
are genuinely variable — names, counts, dates.

### 5. Loading

Locales load by dynamic `import()`, so an English reader never downloads
Polish.

This requires teaching `tools/build.mjs` to follow dynamic imports: a second
regex alongside `IMPORT_RE`, and `import()` compiling to a promise-returning
`__require`. Roughly 20 lines. The bundler is already a small module system,
so the addition is contained.

Rejected alternative: static-import every locale. Simpler, but it grows
`dist/my-instructions.html` from 164 KB to roughly 300 KB and makes every
reader pay for three languages they do not read.

### 6. Choosing a language

Resolution order: stored preference → `navigator.language` prefix match →
`en`.

Stored through the existing store as a new `settings` key — no new
persistence layer, and it inherits the private-mode fallback `LocalAdapter`
already implements.

Locale lives in storage, not in the URL. The consequence is deliberate: a
share link opened by a friend renders in **the receiver's** language, not
the sender's, which is the correct default for a link handed between two
people who may not read the same language.

On locale change: `<html lang>` updates, and the current route re-renders.
`toLocaleString()` on the result date in `src/ui/pages/result.js` starts
taking the active locale instead of the system default.

### 7. Missing keys

A missing key renders the English string and warns once to the console. It
never renders a raw key to a reader.

Tests fail hard on any gap, so this fallback is a safety net for production,
not a workflow for development.

## Translation and instrument versioning

Translating an instrument does **not** bump its `version`. Item ids and
scoring are untouched, and bumping would mark every existing English result
stale for no reason.

Instead each locale's item bank carries its own `revision`, recorded on the
run alongside `instrumentVersion`. A later fix to a badly translated Polish
item can then flag Polish results as stale without invalidating anyone
else's.

This is a real risk worth stating plainly: a loosely translated Likert item
changes what that item measures. Scores stay computable, but they stop being
comparable across languages. Per-locale `revision` is what makes that
correctable after the fact.

## Testing

| Test | What it proves |
|---|---|
| Key parity | Every locale's key set equals `en`'s exactly — catches missing *and* orphaned keys |
| No stray literals | Scan `src/ui` and `src/instruments` for user-facing literals outside `i18n/`. This is what makes "everything is translated" a fact rather than a claim |
| Every page, every locale | Extends the existing loop in `test/ui/pages.test.js` |
| Polish plurals | `1 left` / `2 left` / `5 left` resolve to `one` / `few` / `many` |
| Cross-locale share | A token encoded under `pl` decodes and re-scores identically under `en` |
| ICU-lite parser | Interpolation, plural, select; unsupported forms throw rather than mis-render |

## Out of scope

- RTL layout. None of pl/es/de need it; adding it now would be untested speculation.
- Translated URLs or per-language routes.
- Machine translation as a delivery path. The prose is the product; a machine draft may seed a human pass, never ship unreviewed.
- Locale-aware number formatting beyond the existing integer scores.

## Delivery order

1. `core/i18n.js` + its tests, English only
2. Registry contract change + all instruments migrated to `t`
3. Shell and core string extraction
4. Parity and stray-literal tests — the gate that proves extraction is complete
5. Bundler support for dynamic imports
6. Locale picker UI and persistence
7. pl, then es, then de — one delivery each, gated on parity
