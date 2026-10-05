# Validated instruments, and what borrowing them changes — design

**Date:** 2026-10-05
**Status:** implemented, with the parts that remain listed at the end

## What this is

The owner asked for two things after the six-test licence research: the
tests should be *improved*, and where possible the site should carry
*reliable, recognised* instruments; and the peer-reviewed literature should
say which instruments serve the app's purpose — helping a person understand
themselves (values, needs, strengths, weaknesses) and others (by comparing
results).

The research is in `reports/Validated instruments for the app.md`. This
note records what was decided and why, so the shape of the code reads as a
decision rather than an accident.

## The decision that shapes everything else

Every instrument here wrote its own items and said so, honestly, in
`app.noValidation`. The only honest way to put *recognised reliability* on
the site is to adopt instruments whose items are genuinely free to use and
whose reliability was actually measured — and to say, per language, where
that measurement happened. Writing new items "in the style of" a recognised
test would give the app the test's name and none of its evidence, which is
the move the app has refused since its first commit.

One pool is free for a public app with a possible paid tier, in four
languages, with translation and editing allowed: the International
Personality Item Pool, public domain by its authors' own statement. The
Polish IPIP adaptations (UKSW) are CC BY. Everything else that is validated
and open turned out to be research-only (BFI-2, ECR-R, the SDT need scales),
non-derivative (O*NET tools, Schwartz's PVQ), or unverifiable.

So: **borrow from IPIP where IPIP has what the purpose needs; keep writing
our own where it does not; never claim evidence in a language it was not
collected in.**

## What was adopted

| Instrument | Items | Source and licence | Evidence by language |
|---|---|---|---|
| `big-five` (v2) | IPIP 50-item Big-Five Factor Markers, 5-point accuracy scale | IPIP, public domain; Polish IPIP-BFM-50 (Strus, Cieciuch & Rowiński 2014) CC BY; German (Bielefeld) and Spanish (de Oliveira) translations hosted by IPIP | **en, pl** published (α .79–.88); de, es: hosted translations, unvalidated (a Spanish 50-item version failed five-factor fit in Peru, Hughes et al. 2020) |
| `interpersonal` (new) | IPIP Interpersonal Circumplex, 32 items, 8 octants, dominance and warmth axes | IPIP, public domain (Markey & Markey 2009); Polish UKSW adaptation CC BY | **en** published (four-item octants, reliability ≈ .6; circle confirmed; r .82/.75 with the IAS axes); pl: published, unvalidated; es, de: the app's translations |
| `character-strengths` (v2) | IPIP-VIA-R, 96 items, 4 a strength (2+/2−), plus the three core strengths from 18 of them | IPIP, public domain; German items from the authors' CC BY preprint (GESIS) | **en, de** published (ω .57–.84; retest .53–.84); pl, es: the app's translations |

IPIP's own caveat on hosted translations is carried onto every page that
uses one: "The accuracy of these translations has not been verified by
anyone associated with the IPIP project."

## What borrowing changed in the platform

- **A disclaimer per instrument.** The shared sentence now opens "Unless a
  test says otherwise on its own page". A borrowed instrument carries its own
  `disclaimer` in four languages, shown on its page and under its result;
  an original one must not. A test holds the two in lockstep.
- **Evidence per language.** `evidence.appliesTo` names the locales a
  borrowed figure was collected in. The page tells a reader of the app's own
  translation that the figures were "published for the original, not for
  this translation".
- **The accuracy scale.** IPIP's format ("very inaccurate … very accurate")
  exists as `accurate5`, because the published alphas belong to it. Polish
  anchors are the UKSW ones.
- **The readability gate** (80 characters, 14 words, no double-barrelled
  items) applies to the app's own items only. A validated item is reproduced
  as published; shortening it would make it a different, unvalidated item.
- **The parity test** against the frozen reference records `big-five` as
  superseded, with the reason; the reference is otherwise still the check on
  the port, and the midpoint fix below was applied to both sides so they
  still agree.
- **`version` bumps** on both replaced instruments mark every stored result
  stale, which the result page already says; the old answers are kept.

## What the audit found and what was fixed

The psychometric audit (`research_notes/…/audit-psychometrics.md`) and the
purpose audit (`audit-purpose.md`) found, among thirteen shared issues:

- **The comparison feature was unreachable.** Twenty folders export a
  `Compare`; no route rendered one. Fixed where the sender's data already
  arrives: the opened-report page renders the instrument's `Compare` under
  the sender's result whenever the reader has their own run of the same
  instrument (re-scored, never stored), and offers "take it first" when they
  do not. The report link is the comparison link; no second format.
- **The midpoint was 51.** `normalize` floors at 1, so an all-neutral reader
  scored 51 and read as "high" on every `>= 50` test — and as
  fearful-avoidant on attachment. Fixed: the exact middle is 50, `sideOf` is
  strict, attachment's styles need more than neutral.
- **Siblings back to back.** The shuffle now keeps two items of one scale
  from landing next to each other (`core/order.ts`), deterministically.
- **No scoring tests.** `test/core/scoring.test.ts` holds the arithmetic.

What the literature says, in one line each (full citations in the report):
feedback improves self-knowledge mainly when checked against a close other;
between two people, each person's *level* predicts how they get on and
similarity barely does; disclosure raises liking in both directions; a
partner noticing your strengths matters more than the strengths. The new
comparison views therefore show levels and gaps and no match figure.

## Deferred, with the open route named

- **Honesty–Humility with evidence:** IPIP-HEXACO is public domain but English
  only; the Polish adaptation is a conference paper with no public text.
  `hexaco` stays original.
- **Interests:** ORVIS (IPIP) is public domain with English and German
  evidence, but it is 92 items and a different construct (eight interest
  scales) than `riasec`'s six types. `riasec` stays original; ORVIS is the
  open route.
- **Values:** TwIVI is free for any purpose and validated in English, but its
  items are two-sentence portraits of 64–142 characters and no PL/ES/DE
  versions exist. The honest alternative is a stated-priorities inventory in
  the app's own format.
- **Needs:** every validated scale is research-only. The app's own
  need-shaped instruments stay; a permission request to the Center for
  Self-Determination Theory is the route if wanted.
- **An informant form** (a partner answers the same items about you) is the
  single feature the self-knowledge literature most directly supports and is
  not built.
- Remaining audit items: prorating unanswered items instead of imputing the
  midpoint; criterion-referenced bands; thresholds in scale units; careless-
  response indices beyond straightlining; tie disclosure on every ranked
  view; profiler defaults that fabricate positions; `pageBy: "section"`.
