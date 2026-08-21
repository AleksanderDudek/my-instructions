# My Instructions

Most of what goes wrong between two people is a documentation problem.

Take a few tests, get one page that says how you work — what lands, what drains
you, what to do when it goes badly — and hand it to someone.

Everything runs in the browser. No account, no server, no analytics, no build
step, and no dependencies: `npm install` does nothing because there is nothing
to install.

```
npm run dev      # http://localhost:5173
npm test         # 98 tests, node:test, no framework
npm run build    # dist/my-instructions.html — the whole app in one file
```

---

## What is in it

| Instrument | Family | Items | What it reports |
|---|---|---|---|
| **Five Languages of Love** | questionnaire | 40 | Each language scored 1–100 *independently*, plus its share of the mix |
| **Enneagram** | questionnaire | 45 | Nine type scores, wing, centre, stress and growth lines, and how close the top two are |
| **Big Five** | questionnaire | 40 | Five factor scores, reported separately because the factors are meant to be independent |
| **Ninefold Almanac** | profiler | a birth date | Chinese and Western zodiac, destiny number, reduction pyramid, square of nine |

Each one contributes cards to the **instruction sheet** — the page the app
exists to produce. Cards are grouped by *channel* (how to talk to me, how to
show you care, when we clash, what drains me…) rather than by which test they
came from, because nobody wants to read four test results.

---

## Instruments are plugins

Adding a test is one folder and one line. Nothing in the shell knows any
instrument by name.

```
src/instruments/<id>/
  items.js     the item bank, or the static tables — data only
  index.js     the manifest
```

```js
export default {
  id: "attachment-style",   // slug: also the storage key and the URL segment
  version: 1,               // bump when items or scoring change
  family: "questionnaire",  // or "profiler"
  title, tagline, glyph, minutes, framework, sourceNote,

  form: () => ({ kind: "items", items, scale, shuffle: true, pageSize: 5 }),
  //        or ({ kind: "fields", fields: [...] })  for a profiler
  validate,                 // optional, profilers only: { fieldId: message }
  score:        (answers) => result,          // pure, and JSON-serialisable
  view:         (result)  => html`…`,
  instructions: (result)  => [{ channel, title, body }],
  compare:      (a, b, { nameA, nameB }) => html`…`,   // optional
};
```

Register it in [`src/instruments/index.js`](src/instruments/index.js) and it
appears in the catalogue, the sheet, the panel, the share links, and the test
suite. [`test/instruments/contract.test.js`](test/instruments/contract.test.js)
loops over the registry, so a new instrument inherits every contract check
without a line of new test code.

The shell supplies the mechanics: paging, shuffling, drafts, progress,
keyboard entry, escaping, storage, visibility, sharing. The instrument supplies
only meaning.

### Input kinds available to any instrument

`likert` · `choice` · `multi` — for questionnaires
`text` · `number` · `select` · `date` · `multi` — for profilers

A new input kind is added once in
[`src/ui/components/fields.js`](src/ui/components/fields.js) and becomes
available to every instrument at once.

---

## How the scoring works

Three rules, in [`src/core/scoring.js`](src/core/scoring.js), cover every
questionnaire:

1. **An item belongs to one scale** and is forward- or reverse-keyed.
2. **Reverse keying is `max + min − answer`.** Reverse items exist to defeat
   acquiescence bias — the tendency to agree with everything. A scale without
   them measures agreeableness more than it measures its own construct. Answer
   `5` to all forty Big Five items and you get five near-identical middling
   scores, and the app tells you so.
3. **Raw sums are rescaled to 1–100** against the range that scale could
   possibly have produced. That, not the raw sum, is what is stored and
   compared. The floor is 1 rather than 0 because nobody has *zero* need for
   touch — they have the minimum.

**Why Likert and not forced choice.** Chapman's own quiz and the RHETI are both
*ipsative*: every question pits two scales against each other, so the scores
are locked to a constant sum. You cannot score 80 on all five love languages,
and two people's scores cannot be meaningfully compared — which is fatal for a
product that intends to connect people later. Every questionnaire here is
normative, so all five can be high, or none.

---

## Where the items came from

The frameworks are public; the item wording is ours.

| Referenced | Status | What was done |
|---|---|---|
| Chapman's 30-item love-languages quiz | Copyright, Northfield Publishing | Original 40-item Likert bank against the same five categories |
| RHETI v2.5 (144 forced-choice items) | Copyright, The Enneagram Institute — the public repos state their items were OCR'd from the source PDF | Original 45-item Likert bank against the public nine-type model |
| "Multifactor Enneagram" (AugmentedPersonality) | No license or attribution stated | Not used |
| openpsychometrics.org (OEPS) | Open, educational use | Referenced as prior art |
| IPIP item pool | Public domain | Referenced; substitutable as pure data — see below |

Item banks are plain data. Swapping the Big Five bank for the public-domain
IPIP fifty-item markers is an edit to
[`src/instruments/big-five/items.js`](src/instruments/big-five/items.js) and
nothing else.

Every result page carries a `sourceNote` saying what its instrument is and is
not. The numerology one says plainly that it has no empirical support.

---

## Storage, and the server that is not there yet

All state goes through [`src/core/store.js`](src/core/store.js), whose
interface is **async** even though the only adapter today is synchronous
`localStorage`. When the backend arrives, a `RemoteAdapter` implements the same
four methods — `get`, `set`, `del`, `list` — and no call site changes.

```
mi:1:profile              display name, pronouns, opening line
mi:1:run:<instrumentId>   answers + result + version + visibility
mi:1:draft:<instrumentId> a part-finished questionnaire, saved on every answer
```

Keys are namespaced and versioned, so a schema change is a migration rather
than a corruption. The row shape is already the row shape a database wants:
`(user, instrument_id, version, answers, result, visibility)` — generic, with
no per-test tables.

If the browser refuses to store data (private mode, storage disabled) the app
runs from memory and says so across the top rather than losing answers
silently.

### Visibility and sharing — built now, enforced later

Every result carries `private | friends | public`. Today that governs how the
sheet presents it; when the network exists it governs what other people can
see, and the model does not have to be retrofitted.

Sharing already works without a server. A share link carries **answers, not
scores**, in the URL fragment; the receiving app re-scores them with its own
current copy of the instrument. A link made against version 1 still reads
correctly under version 2 — which storing the scores would have broken.

`#/compare/<id>?with=<token>` renders both readings side by side. Nothing is
uploaded, and nothing about the other person is stored.

---

## Layout

```
src/
  core/         html.js · store.js · registry.js · router.js · scoring.js · share.js
  ui/
    app.js      the shell: routes, nav, one animation pass
    pages/      home · catalog · runner · result · sheet · profile · compare
    components/ fields.js (every input kind) · scorecard.js (every result widget)
  instruments/  one folder per test — the only place to add features
tools/
  serve.mjs     static server, zero dependencies
  build.mjs     29 modules into one self-contained HTML file
test/           core · instruments · ui · build
```

**Pages are pure functions.** A page returns an HTML string, or
`{ body, mount }` when it needs behaviour after the markup lands. There is no
virtual DOM because there is no shared mutable view state — each route owns its
subtree and replaces it wholesale. The consequence is that the entire render
layer is testable in Node with no browser, which is what
[`test/ui/pages.test.js`](test/ui/pages.test.js) does.

**Escaping is inverted.** [`src/core/html.js`](src/core/html.js) exports an
`html` tagged template that escapes every interpolation; trusted markup must
opt out via `raw()`. Forgetting to escape is impossible; forgetting to
*un*-escape is merely ugly.

**The build is a real module system**, not a concatenation. Each module is
wrapped in a function and a four-line registry resolves the graph at runtime —
small enough to read in one sitting, which is the reason not to install a
bundler for a project that installs nothing.

---

## Roadmap

The pieces below were designed for and are not yet built.

- **Accounts and sync** — swap `LocalAdapter` for `RemoteAdapter`; the storage
  interface and row shape already assume it.
- **Connections** — friend links, then `visibility: friends` starts meaning
  something.
- **Public pages** — a shareable instruction sheet at a stable URL, showing
  only the cards marked public.
- **Matching** — every questionnaire score is normative and 1–100, so
  cross-person comparison is already well defined. `compare()` exists on three
  of the four instruments today and runs entirely client-side.
- **More instruments** — attachment style, conflict style, chronotype,
  work-preference profilers. Each is one folder.

---

*Self-report, not diagnosis. The Big Five has real research behind it at modest
effect sizes; the Enneagram and love languages are useful vocabularies with
thin evidence; the numerology has none and says so.*
