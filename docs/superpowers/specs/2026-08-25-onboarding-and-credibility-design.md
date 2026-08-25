# Onboarding, provenance and the reader's confidence — design

**Date:** 2026-08-25
**Status:** approved, not yet implemented

## What this is

Four changes that share one goal: a person who lands on this app should
understand what it is, trust what it tells them, and be able to find out more
when they are curious.

1. **Onboarding** — explain the app where somebody actually needs it, without
   an overlay.
2. **Provenance** — show each instrument's real lineage and a verified reading
   list, and fix the fact that the evidence table currently prints English into
   every locale.
3. **Did you know** — an info affordance carrying the interesting material that
   does not belong in the main flow.
4. **Catalogue UX** — completion state, filtering, and a recommended order.

They are designed together because they share plumbing: one popover primitive,
one provenance schema change, and one round of translation across four locales
and sixteen instruments. Doing them separately means paying the i18n cost three
times.

## The decision that shapes everything else

The brief that started this asked, for instruments with no validation evidence,
to "smoothly describe the test to make it more convincing."

We are not doing that, and the reason is not squeamishness. This app already
tells readers, in `app.noValidation`, that its questions have never been given
to a sample and have no norms. `provenance.js` describes its own evidence block
as "allowed to be embarrassing." That candour is the most distinctive thing the
app has, and copy engineered to make an unmeasured test feel measured would
spend it.

What the brief actually wants — instruments that feel substantial rather than
arbitrary — is available honestly, and mostly for free, because the material is
already in the repository and simply is not rendered:

- `construct.origin` is written for every instrument and displayed nowhere.
  `"Tupes and Christal 1961; Costa and McCrae"` is sitting in
  `big-five/provenance.ts` doing nothing.
- The frameworks behind most of these instruments have real published records.
  The five-factor model has sixty years of cross-cultural replication. That
  record is true, citable, and far more persuasive than an adjective.

So the rule for this work is: **substance comes from the framework's real
record; the honesty about our own items stays exactly where it is.** A reader
should finish the page knowing both that the idea is serious and that our
questionnaire is not evidence.

For frameworks where the honest record includes people who dismantled it —
Enneagram, love languages, numerology — the reading list carries the critiques
too. A reference list that argues with itself reads as confidence. One that
only flatters reads as marketing.

## Measured scope

| Area | Work | Notes |
|---|---|---|
| `src/core/registry.ts` | schema + validation | `ProvenanceRecord` gains `references`; evidence fields become closed unions |
| `src/instruments/*/provenance.ts` | 16 files | references added, evidence values retyped |
| `src/instruments/*/i18n/*.ts` | 64 files | lineage prose + 2–3 "did you know" facts each |
| `src/i18n/messages/*.ts` | 4 files | onboarding copy, evidence vocabulary, popover chrome |
| `src/app/[locale]/page.tsx` | rewrite | walkthrough + rendered sample sheet |
| `src/app/[locale]/tests/page.tsx` | extend | filters, completion state, first-visit strip |
| `src/app/[locale]/tests/[id]/page.tsx` | rewrite | three-plate provenance layout |
| `src/components/ui/info.tsx` | new | Radix popover primitive |
| `src/components/runner/runner.tsx` | small | first-page orientation strip |
| `test/` | extend | contract, union-translation, e2e |

Roughly 180 new translated strings and ~60 verified references.

## Architecture

### 1. Provenance becomes typed

The current record stores evidence as free text, which is why a Polish reader
sees `none` and `original` in English on `/pl/tests/big-five`. Free text cannot
be translated by a renderer that does not know what values are possible.

```ts
export type EvidenceLevel = "none" | "indirect" | "published";
export type ItemOrigin = "original" | "adapted" | "public-domain";

export type Reference = {
  authors: string;      // "Ainsworth, M. D. S., Blehar, M. C., Waters, E., & Wall, S."
  year: number;
  title: string;
  source?: string;      // journal, publisher
  url?: string;         // DOI or other stable link
  kind: "foundational" | "review" | "critique" | "popular";
};

export type ProvenanceRecord = {
  construct: { name: string; origin?: string; public: boolean; note?: string };
  items: { origin: ItemOrigin; writtenFor?: string };
  evidence: {
    reliability: EvidenceLevel;
    factorStructure: EvidenceLevel;
    criterion: EvidenceLevel;
    note?: string;
  };
  references: Reference[];
  reproduces: string[];
  avoided?: string[];
};
```

Closed unions mean the renderer translates a key — `evidence.none` — rather
than printing whatever string an instrument author typed. The vocabulary is
translated once in the shell instead of sixteen times in instrument tables.

`validate()` in `registry.ts` gains two rules:

- every instrument declares `references`; an empty array is legal only when
  `construct.origin` is `"Traditional"`;
- every reference carries `authors`, `year`, `title` and a valid `kind`.

A new instrument therefore cannot ship without a paper trail, which is the same
move the existing contract makes for `View` and `score`.

### 2. The instrument page

Three plates replace the current two.

**What this is** — unchanged, renders `sourceNote`.

**Where it comes from** — two columns and a reading list.

```
The framework                      These questions
Five-factor model                  Original, written for this app
Tupes & Christal (1961);           Never given to a sample
Costa & McCrae (1992)              No norms, no reliability figure
<lineage prose, one paragraph>

FURTHER READING
→ Goldberg (1993). The structure of phenotypic personality traits.
  American Psychologist.                              foundational
→ John & Srivastava (1999). The Big Five trait taxonomy.
  Handbook of Personality.                            review
```

The left column is the framework's record. The right column is ours. Putting
them side by side is the whole argument: it is visibly not the same claim.

**Read it as** — the framing sentence, plus an ⓘ carrying the long
`app.noValidation` text so the short version leads and the full version is one
click away rather than a wall.

### 3. The info affordance

`src/components/ui/info.tsx`, built on Radix Popover — already a dependency,
already used for the language menu and the month select.

```tsx
<Info label={t("didYouKnow.1.title")}>{t("didYouKnow.1.body")}</Info>
```

A brass ⓘ trigger, a `DID YOU KNOW` cap header, dismissal on Escape or outside
click, reachable from the keyboard, announced by screen readers.

Click rather than hover, because there is no hover on a phone and a tooltip
that half the readership cannot open is decoration.

Content lives in each instrument's own message table under `didYouKnow.N.*`,
two or three per instrument, and the shell carries the chrome.

### 4. Onboarding, three touchpoints

**Home.** The three-column strip becomes a walkthrough, and the page renders a
sample instruction sheet. The sheet is the product; the home page currently
never shows it.

The sample is a fixed set of illustrative cards written into the shell message
table and labelled as an example — not the reader's own sheet, which on a first
visit is empty, and not a live render of anyone's answers. That keeps it static
markup: indexable, correct with JavaScript disabled, and identical for every
visitor.

**Catalogue.** One dismissible strip on first visit, with a recommended
starting instrument.

**Runner, first page.** One line on what the scale means and that answers save
as you go. Shown once.

Dismissal state goes through the existing `store`, alongside drafts and runs.
No overlay anywhere: nothing to trap focus, nothing that blocks a returning
reader, and no explanatory copy hidden from search engines.

### 5. Catalogue UX

- **Completion state** per card — taken, in progress with a resumable draft, or
  untouched. Read client-side from the store; the server-rendered card stays
  the indexable default.
- **Filters** — channel, minutes, tier. Chips, not a dropdown.
- **Order** — a recommended sequence first, so a new reader is not asked to
  choose blind between sixteen options.

## Error handling

- A reference with a dead `url` still renders; the link is a convenience, not
  the citation. Nothing fetches at runtime.
- An instrument whose `references` array is empty and whose origin is not
  `"Traditional"` fails `validate()` at import, which the contract test runs
  over the whole registry — the failure is a red test, not a broken page.
- Popover content missing in a locale falls back to English through the
  existing `getI18n` fallback chain, and the parity test fails on the gap.
- Store reads for completion state and dismissals are already failure-tolerant;
  an unavailable store renders the untouched, undismissed default.

## Testing

- **Contract** — extend `test/instruments/contract.test.ts`: every instrument
  satisfies the new provenance rules.
- **Union translation** — new test: every `EvidenceLevel`, `ItemOrigin` and
  `Reference["kind"]` value has a key in all four shell tables.
- **Parity** — the existing i18n parity test already covers the new
  per-instrument keys once English defines them.
- **e2e** — the popover opens and closes from the keyboard alone; a dismissed
  onboarding strip stays dismissed across a reload; the instrument page renders
  a reading list in every locale.

## Delivery

**First delivery — plumbing.** Schema, validation, the three-plate instrument
page, the popover primitive, all three onboarding touchpoints, catalogue UX,
and tests. References and did-you-know facts filled for three or four
instruments as proof the shape works.

**Second delivery — content.** The remaining twelve instruments: references
found and verified against sources online, lineage prose, did-you-know facts,
all in four languages.

Splitting here means the structural work is reviewable before the long research
pass starts, and a mistake in the schema is found while it is cheap to change.

## Out of scope

- No change to scoring, sharing, or the report format.
- No new instruments.
- No visual redesign beyond the pages named above.
- No analytics. The app has none and this does not add any.
