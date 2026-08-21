# Candidate instruments

What else could become a folder under `src/instruments/`, what its items would
legally be, and what each one would cost to build.

The constraint that shapes this whole list is the one the repo already lives
by: **the framework can be public while the questionnaire is not.** Chapman's
five categories are public and his 30-item quiz is copyrighted; the Enneagram
is public and the RHETI is copyrighted. So each candidate below is judged on
three separate things — is the *construct* public, are *items* available under
a licence we can use, and does it earn a place on an instruction sheet.

---

## Tier 1 — public-domain items, drop straight in

These need no permission, no rewriting, and no legal judgement call. The
International Personality Item Pool (`ipip.ori.org`) holds 3,000+ items and
250+ scales explicitly placed in the public domain, free for commercial use,
no permission required. It is the single most valuable source on this list.

### 1. Big Five facets (IPIP-NEO-120)

Not a new instrument — a depth upgrade to the one we have. The IPIP-NEO
resolves each of the five factors into six facets (Openness → imagination,
artistic interests, emotionality, adventurousness, intellect, liberalism).

- **Items:** public domain, 120-item and 300-item versions.
- **Fit:** high. Facets are what make the sheet specific: "high openness" is a
  horoscope, "high on imagination, low on adventurousness" is an instruction.
- **Cost:** the item bank is a data change, but `scoreLikert` currently maps
  items → one scale. Facets need a second level (item → facet → domain), which
  is a real addition to `src/core/scoring.js` rather than a new folder alone.
- **Catch:** replacing our own items changes what the instrument measures, so
  it is a `version` bump that marks every existing Big Five result stale.
  Better as a *second* instrument ("Big Five, long form") than as a rewrite.

### 2. IPIP-HEXACO-60 — the sixth factor

HEXACO adds **Honesty–Humility** to the Big Five: sincerity, fairness, greed
avoidance, modesty. It is the factor the five-factor model demonstrably
misses, and it predicts exploitation and free-riding better than anything in
OCEAN.

- **Items:** IPIP-HEXACO scales are public domain (Ashton, Lee & Goldberg 2007).
- **Fit:** very high, and it is the strongest *new* thing on this list. On an
  instruction sheet aimed at "how to deal with me", a fairness dimension is
  more actionable than a sixth flavour of extraversion.
- **Cost:** one folder. Same Likert machinery, same `scoreLikert`, six scales
  instead of five.

### 3. RIASEC interests — the empty `work` channel

Holland's six interest types (Realistic, Investigative, Artistic, Social,
Enterprising, Conventional). Our `work` channel is currently fed only by Big
Five conscientiousness; this fills it properly.

- **Items:** two public-domain sources. The Liao, Armstrong & Rounds (2008)
  RIASEC marker scales, and the US Department of Labor's O*NET Interest
  Profiler Short Form — the latter is a federal government work product.
- **Fit:** high, with one caveat — interests are about work you would choose,
  which is a slightly different question from how to work *with* you.
- **Cost:** one folder. Result is a three-letter code, which is a nice compact
  thing to put on a sheet, and `compare()` writes itself.

---

## Tier 2 — freely available, but read the terms

### 4. Attachment style (ECR-R / ECR-RS)

Two dimensions — anxiety and avoidance — crossing into four styles (secure,
preoccupied, dismissing, fearful).

- **Items:** published and distributed by R. Chris Fraley's lab and widely
  reproduced for research and clinical use. Not stamped public domain; used
  freely by convention and with the author's stated permission.
- **Fit:** the highest of anything here. Attachment is *about* the exact
  question this app asks — what happens between two people when it goes badly.
  It maps onto `conflict` and `affection` without any stretching, and the
  two-dimensional result makes `compare()` genuinely informative rather than
  decorative (anxious/avoidant pairing is the classic trap).
- **Cost:** one folder. Two continuous scales; the four styles are quadrants,
  not categories, and the honest presentation says so.
- **Caution:** this is the one instrument on the list where a bad result lands
  on something tender. The copy has to be careful in a way the others do not.

### 5. Grit (Grit-S, Duckworth)

- **Items:** free for academic and non-commercial use; commercial use asks for
  permission.
- **Fit:** moderate. Eight items, one construct, and the construct is
  contested — most of its variance is conscientiousness we already measure.
- **Verdict:** skip. Low marginal information per question asked.

### 6. Short Dark Triad (SD3)

Narcissism, Machiavellianism, psychopathy.

- **Items:** published in Jones & Paulhus (2014); used freely in research,
  commercial status not clearly stated.
- **Verdict:** skip, on product grounds rather than legal ones. A page you
  hand to someone saying "here is how to deal with me" is the wrong place for
  a psychopathy score. It would change what the product is.

---

## Tier 3 — public construct, our own items

This is the pattern the repo already uses three times, and it is the right one
whenever the theory is public but every published questionnaire is licensed.

### 7. Chronotype and daily rhythm

Morningness–eveningness. The MEQ itself is under copyright, but circadian
preference is not, and the underlying question ("when is your brain actually
on?") is easy to ask in original wording.

- **Fit:** very high for the `rhythm` and `energy` channels, which are the
  thinnest on the sheet today. It is also directly actionable: "do not put me
  in a 9am design review" is a real instruction.
- **Shape:** could be a **profiler** rather than a questionnaire — ask for
  natural sleep and wake times on free days, derive mid-sleep point, and place
  the reader on a distribution. That reuses the numerology folder's family and
  needs about six fields.

### 8. Conflict style

The dual-concern model (concern for self × concern for others → competing,
collaborating, compromising, avoiding, accommodating) is public theory. The
Thomas–Kilmann instrument that operationalises it is commercially licensed and
must not be reproduced.

- **Fit:** very high. `conflict` is the channel people actually reach for.
- **Shape:** ten to fifteen forced-choice or Likert items in our own wording,
  scored on the two concerns and reported as a position rather than a label.

### 9. Working preferences — no canonical instrument at all

Interruption tolerance, feedback register, meeting load, notice required
before change, async versus synchronous. There is no validated scale for this
because it is not a psychological construct; it is a set of preferences.

- **Fit:** highest practical value on the whole list and the lowest scientific
  baggage, precisely because it claims nothing. It is the section a colleague
  would actually read.
- **Honesty:** it must be presented as preferences, not as measurement — no
  1–100 scores, no bands. A `profiler`-family instrument with `multi` and
  `choice` fields, which the contract already supports.

---

## Explicitly not worth doing

| Instrument | Why not |
|---|---|
| MBTI / 16 Personalities | Items are copyrighted, and the dichotomies have poor test–retest reliability. The Enneagram folder already covers "typology as vocabulary" more honestly. |
| DISC | Every usable version is commercially licensed; the public ones are of unknown provenance. |
| Love Languages (Chapman's own quiz) | Copyrighted, and ipsative — already rejected, for reasons written into `love-languages/items.js`. |
| Enneagram RHETI | Copyrighted forced-choice items — already rejected in `enneagram/items.js`. |
| IQ or ability testing | Different product. Timed, proctored, and nothing to do with an instruction sheet. |

---

## GitHub sources worth reverse-engineering

Read for structure and, where the licence permits, for data.

### `rubynor/bigfive-web` — MIT, ~940 stars

The most directly useful repository on this list.

- `packages/questions/src/data/<locale>/questions.ts` holds the IPIP-NEO item
  bank as `{ id, text, keyed: 'plus' | 'minus', domain, facet }`.
- `packages/questions/src/data/<locale>/choices.ts` holds the response scale,
  with separate `plus` and `minus` arrays.
- `packages/score/src/index.ts` holds the scoring.

Two things to take from it. First, the item shape is almost exactly ours —
`keyed` is our `reverse`, `domain` is our `scale`, and `facet` is the one field
we lack. Confirmation that the contract is on the right lines.

Second, and more valuable: **it ships that item bank in more than twenty
languages.** If we adopt IPIP items for a long-form Big Five, the Polish,
Spanish and German item text already exists under MIT, which removes the
single largest cost of adding a language to a new instrument. Attribution is
required; the items themselves are public domain via IPIP regardless.

### `kholia/IPIP-NEO-PI`

The upstream item and scoring data that `bigfive-web` wraps. Worth reading for
the facet-level scoring, which is the part our `scoreLikert` cannot do yet.

### `openpsychometrics.org`

Item lists and raw response datasets for a wide range of scales, including the
RIASEC markers and SD3. Useful for checking how an instrument behaves at scale
before committing to it — and `openpsychometrics.org/_rawdata/` means we could
sanity-check our own scoring against real distributions rather than guessing at
the band cutoffs the way `band()` currently does.

---

## If only one gets built

**IPIP-HEXACO-60**, then **attachment**, then **chronotype**.

HEXACO because the items are public domain and Honesty–Humility is the one
major dimension the app currently cannot see. Attachment because it is the
best fit to what the product is actually for. Chronotype because it fills the
emptiest channel and can reuse the profiler family, so it is roughly a day's
work rather than a week's.

## Notes for whoever implements one

- Items go in `items.js` as structure only; every word lives in
  `i18n/<locale>.js` keyed by item id. The parity test fails until all four
  languages are complete.
- `score()` takes answers and nothing else. No `t`, no locale — results must
  be identical across languages or `compare()` and share links break.
- Facet-level scoring (item → facet → domain) is not in `src/core/scoring.js`
  yet. Both IPIP-NEO and HEXACO want it; the first one to need it should add
  it there rather than in its own folder.
- Cite IPIP in `sourceNote` even though no permission is required. The repo's
  habit of naming what it took and from whom is worth keeping.
