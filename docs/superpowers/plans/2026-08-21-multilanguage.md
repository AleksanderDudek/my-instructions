# Multilanguage Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. TDD throughout — failing test, then implementation, then commit.

**Goal:** Make every user-facing string in the app translatable, ship a complete English extraction, then land Polish, Spanish and German.

**Architecture:** A ~70-line ICU-lite `t()` in `src/core/i18n.js`. Instruments keep structure in `items.js` and move wording into a per-instrument `i18n/<locale>.js` keyed by item id. The registry contract passes `t` to every text-producing function; `score()` stays pure so results are identical across locales. Locales load by dynamic `import()`, which the single-file bundler is taught to follow.

**Tech Stack:** Plain ES modules, `node --test`, no dependencies.

**Spec:** `docs/superpowers/specs/2026-08-21-multilanguage-design.md`

---

## File structure

| File | Responsibility |
|---|---|
| `src/core/i18n.js` | Create | `createI18n`, the ICU-lite formatter, locale resolution |
| `src/core/locales.js` | Create | The locale registry: supported tags, labels, dynamic loaders |
| `src/ui/i18n/en.js` | Create | Every shell string |
| `src/instruments/*/i18n/en.js` | Create | Per-instrument items and prose |
| `src/core/registry.js` | Modify | `t` in the contract; `CHANNEL_LABEL` becomes keys |
| `src/core/scoring.js` | Modify | Band names become keys |
| `src/ui/app.js` | Modify | Boot the i18n layer, re-render on locale change |
| `tools/build.mjs` | Modify | Follow dynamic imports |
| `test/core/i18n.test.js` | Create | Formatter behaviour |
| `test/i18n/parity.test.js` | Create | Key parity + no stray literals |

---

## Task 1: The ICU-lite formatter

**Files:** Create `src/core/i18n.js`, `test/core/i18n.test.js`

- [ ] **Step 1: Write failing tests** — interpolation, plural (`one`/`few`/`many`/`other`), select, missing-key fallback to English, unsupported syntax throwing.
- [ ] **Step 2: Run `node --test test/core/i18n.test.js`** — expect failures ("Cannot find module").
- [ ] **Step 3: Implement `createI18n({ locale, messages, fallback })` returning `{ t, locale, has }`.** Plural category comes from `Intl.PluralRules`, which Node and every target browser ship — no hand-written Polish rules.
- [ ] **Step 4: Run tests** — expect pass.
- [ ] **Step 5: Commit** `feat: ICU-lite message formatter`

## Task 2: Locale registry

**Files:** Create `src/core/locales.js`, extend `test/core/i18n.test.js`

- [ ] **Step 1: Failing test** — `resolveLocale` picks stored preference, else `navigator.language` prefix, else `en`; unknown tags fall back.
- [ ] **Step 2: Run — fail.**
- [ ] **Step 3: Implement** `LOCALES` (tag, label, endonym), `resolveLocale(stored, navigatorLanguages)`, `loadMessages(locale)` using dynamic `import()`.
- [ ] **Step 4: Run — pass. Step 5: Commit** `feat: locale registry and resolution`

## Task 3: Extract the shell

**Files:** Create `src/ui/i18n/en.js`; modify `src/ui/app.js`, `src/ui/pages/*.js`, `src/core/registry.js`, `src/core/scoring.js`

- [ ] **Step 1:** Move every literal in `src/ui/pages/` and the `NAV` labels into `src/ui/i18n/en.js`.
- [ ] **Step 2:** `CHANNEL_LABEL` in `registry.js` becomes `channel.<name>` keys; `band()` names in `scoring.js` become `band.<name>` keys.
- [ ] **Step 3:** Pages take `ctx.t`. `app.js` builds the i18n layer at boot and puts `t` on `ctx`.
- [ ] **Step 4:** Run `npm test` — the existing page tests must still pass once their ctx supplies `t`.
- [ ] **Step 5: Commit** `refactor: route shell strings through t()`

## Task 4: Registry contract

**Files:** Modify `src/core/registry.js`, `test/instruments/contract.test.js`

- [ ] **Step 1: Failing test** — `validate()` passes an identity `t` to `form(t)`; an instrument whose `form` ignores `t` still validates.
- [ ] **Step 2: Run — fail. Step 3:** Change signatures: `form(t)`, `instructions(result, t)`, `view(result, ctx)` with `ctx.t`, `compare(a, b, opts)` with `opts.t`. `score()` untouched.
- [ ] **Step 4: Run — pass. Step 5: Commit** `feat: pass t through the instrument contract`

## Task 5: Migrate the four instruments

**Files:** Create `src/instruments/{love-languages,enneagram,big-five,numerology}/i18n/en.js`; modify each `index.js` and `items.js`

One commit per instrument. For each:

- [ ] **Step 1:** Move prompts out of `items.js` into `i18n/en.js` keyed `item.<id>`; `items.js` keeps id, scale, reverse flag.
- [ ] **Step 2:** Move trait/type prose (`label`, `blurb`, `starved`, `fed`, `ask`, `conflict`) to keys.
- [ ] **Step 3:** Conditional prose in `compare()` becomes one whole-sentence key per branch — no nouns interpolated into sentences.
- [ ] **Step 4:** Run `npm test`. **Step 5: Commit** `refactor: extract <instrument> strings`

## Task 6: The gate

**Files:** Create `test/i18n/parity.test.js`

- [ ] **Step 1:** Key parity — every locale's key set equals `en`'s exactly, reporting missing and orphaned keys by name.
- [ ] **Step 2:** No stray literals — walk `src/ui` and `src/instruments` outside `i18n/`, flag string literals inside `html``` templates that contain two or more words of prose.
- [ ] **Step 3:** Every page renders under every locale.
- [ ] **Step 4:** Cross-locale share — a token encoded under one locale re-scores identically under another.
- [ ] **Step 5: Commit** `test: key parity and extraction completeness gate`

## Task 7: Bundler + picker

**Files:** Modify `tools/build.mjs`, `src/ui/app.js`, `src/ui/pages/profile.js`, `index.html`

- [ ] **Step 1:** Teach `build.mjs` to follow dynamic `import()` and compile it to a promise-returning `__require`.
- [ ] **Step 2:** Run `npm run build`, confirm the bundle boots and reports its module count.
- [ ] **Step 3:** Language picker in the panel; persist to `settings` through the store; update `<html lang>` and re-render.
- [ ] **Step 4:** Pass the active locale to `toLocaleString()` on the result date.
- [ ] **Step 5: Commit** `feat: locale picker and lazy locale loading`

## Task 8-10: Translations

One task, one commit, one language: `pl`, then `es`, then `de`. Each adds `i18n/<tag>.js` beside every `en.js`, and passes only when the parity test is green.

- [ ] Polish — `one`/`few`/`many` plurals exercised; nouns inflected inside whole sentences.
- [ ] Spanish — gender agreement inside whole sentences.
- [ ] German — long compounds; check the layout does not break.
