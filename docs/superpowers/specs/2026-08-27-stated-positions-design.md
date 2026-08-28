# Stated positions, weight, and the reader's own playbook — design

Date: 2026-08-27. Status: implementation contract.

## What was asked for

Six questionnaires, a house format for them, and more in the results:

1. Attachment styles — **already exists** as `attachment`. Nothing to build.
2. Communication styles, in colours.
3. Family — how many children, and everything downstream of that.
4. Managing money.
5. Faith — what, why, and on what grounds.
6. My idea of a life that went well — questions plus open space.
7. Gottman's five talks before marriage.
8. "Add further tests" — two chosen here.

And one shape for all of them:

> Question and answer (single or multiple choice, closed, depending on what the
> question is). How important is this to you, 1–10. Why is it (un)important to
> you — open text.

And more on the result page:

> Examples for the results — what you can do that is OK, what you can do that is
> not OK. Multi-select, with the option of writing your own.

## The decision that shapes everything else

**This is not a questionnaire format. It is a different kind of instrument, and
calling it by the right name is what keeps the rest of the app honest.**

Every scored instrument in this app estimates something about a person from
behind an item bank with no norms — and says so, at length, in its
`sourceNote`. The format asked for here does not estimate anything. It records
a position the person states, how much weight they put on it, and the reason
they give. Nothing is inferred, so nothing has to be defended.

That makes it the *strongest* thing in the app epistemically and the weakest
psychometrically, and both facts have consequences:

- **It gets its own family**, `inventory`, beside `questionnaire` and
  `profiler`. Not a variant of questionnaire — the catalogue, the result page
  and the sheet all treat scored and stated content differently, and one flag
  in the right place is cheaper than remembering the difference in six places.
- **It is never scored to 1–100.** No `band()`, no bars, no elevation. A
  1–100 number attached to a stated position would import exactly the false
  precision the rest of the app spends its copy apologising for.
- **It is not retrofitted onto the existing scored instruments.** Adding an
  importance rating and a free-text box to each of forty Big Five items would
  triple the length of an instrument whose items are individually meaningless
  — a person cannot say how important item 17 is, because item 17 is not about
  anything on its own. The triad belongs to instruments whose questions are
  each about something.

The reader-authored playbook (§4) is the opposite: it applies to **every**
instrument, scored or stated, because every result can carry the sentence "so
here is what to do about it".

## 1. The stance block

One declared question expands into three or four items with derived ids.

```ts
// core/stance.ts
export type StanceBlock = {
  id: string;
  kind: "choice" | "multi";
  options: string[];        // option value ids; every word lives in i18n
  max?: number;             // multi only
  grounds?: string[];       // optional fourth part — see §1.3
  section?: string;         // page grouping
  skipWeight?: boolean;     // rare; an item that carries no weight question
  private?: true;           // the whole block is withheld — see §1.4
};
```

`stanceItems(blocks, t, { id })` expands each block into, in order:

| id | kind | prompt key | tier |
|---|---|---|---|
| `<id>` | `choice` or `multi` | `stance.<id>.prompt` | shared |
| `<id>.grounds` | `multi` (only if declared) | `stance.<id>.groundsPrompt` | shared |
| `<id>.weight` | `rating` 1–10 | shell `stance.weightPrompt` | shared |
| `<id>.why` | `text` | shell `stance.whyPrompt` | **private** |

Every one of the four carries `group: "<id>"` and the block's `section`, so the
runner can keep a triad on one screen and the report can find its parts.

Where the block declares `private`, every tier in that table reads **private**,
including the first two. That is §1.4, and it is the only thing that moves a
tier the author did not set.

### 1.1 Why the free text is private, always, without an opt-out

The report layer already has a `tier: "private"` that keeps an item out of
every share token (`core/report.ts`, `privateIdsOf`). The `why` uses it, and
the instrument author does not get to choose.

Free text is the only answer in this app whose contents nobody has reviewed.
A closed option is a word we wrote; a Likert point is a number. A `why` can
contain a third party's name, a diagnosis, a confession, or an address, and
the person writing it is thinking about the question rather than about who
might read the URL later. The rule the codebase already lives by is that
withheld content is *absent from the link* rather than hidden by the page that
renders it — so this is not a setting, it is a property of the item kind.

The reader's own words come back to them on their own result page and on their
own instruction sheet, both of which are local. They never enter a token.

### 1.2 Why the weight question earns its place

It is not decoration and it is not engagement. It is the only field in the
block that makes `compare()` say something neither person could have worked
out alone — which is the test §8.4 of the previous design memo sets for every
line of output.

Two people who answer a question differently and both rate it 9 have found the
thing worth an evening. Two who answer differently and rate it 2 and 3 have
found nothing. One at 10 and one at 2 have found an asymmetry, which is a
different and often more useful discovery than a disagreement — it means one
of them has been conceding something the other did not know was being
conceded.

Without the weight, a stated-position inventory produces two lists side by
side and leaves the reader to do the work. With it, the instrument produces an
agenda ordered by stakes.

### 1.3 Grounds — the fourth part, for one instrument

The faith request asked for three things: what, why, and *on what grounds*.
Those last two are not the same question. "Why does this matter to you" is
about weight and biography. "What does it rest on" is about authority —
scripture, the church's teaching, reason, personal experience, upbringing,
the witness of people you trust.

That distinction is worth capturing and is worth capturing as *closed* options,
because the whole point is that a person can hold two beliefs of equal
strength on completely different grounds, and that pattern is legible only if
the grounds are comparable across questions. So `grounds` is a `multi` with
declared options rather than more free text.

It is declared per block and used only where it means something. `faith` uses
it throughout. Nothing else uses it by default.

### 1.4 Why a private block is private entire

`inventory-decisions.md` §3.1 asks for one block across the eight banks whose
question is itself an admission — `money-management.undisclosed-debt`, whose
`sourceNote` promises the reader that the answer never leaves this device, is
never in a share link, and is never asked for as an amount. §1.1 makes only
`<id>.why` private, so the block declares `private: true` and `stanceItems`
puts all four derived items on `tier: "private"`. `packAnswers` strips on the
tier, so nothing about the block travels.

The field is `private` and not `privateAnswer` because half-privacy is worse
than none. A token that omits the answer and carries
`undisclosed-debt.weight = 9` has told the reader exactly what the omission was
withholding: nobody rates a question they have nothing to declare at nine, so
the number announces the one thing the person meant to keep back, and announces
it to somebody who now knows there is something to ask about. The grounds leak
the same way in words. A redaction that leaves the weight behind is a black bar
with the shape of the word still legible through it, and the person who drew it
believed they had said nothing.

Two consequences follow, and neither is optional.

**It is compared into `withheld` and nothing else.** §3.1 below.

**It produces no instruction card.** The sheet is the artefact you print and
hand to somebody; the whole point of the block is that the reader picks the
moment themselves. A card headed "Money you have not mentioned" is the
disclosure — what it goes on to say is a detail. `core/stance.ts` exports
`cardable(blocks, ids?)`, returning the block ids a card may be built from, in
the order they were given; an instrument derives `instructions()` through it
rather than eight authors each remembering the rule, and an id with no declared
block behind it is dropped rather than passed through, because a helper whose
job is to withhold has to fail towards withholding.

`registry.validate()` checks the half of this that import can see: within an
items form, if the item whose id *is* its `group` carries `tier: "private"`,
every other item in that group must too. That catches the expansion having gone
wrong and the hand-written bank that imitates it badly, which is the failure
that puts a lone weight in a token. It is keyed on the group's own question
rather than on agreement across the group, because `<id>.why` is private in
every block by construction.

It cannot check the card rule, and does not pretend to. An `InstructionCard` is
`{ channel, title, body }` — a channel and two finished strings — so by the time
a card reaches `validate()` the block it came from is absent rather than hidden,
and there is nothing to match against a list of private ids. Calling
`instructions()` with the identity `t` yields message keys, and a key like
`stance.undisclosed-debt.card.title` does name its block; but a card built from
a private block under a key that does not name it would pass, and a card built
from a public block whose key happens to contain a private block's id would
fail. A check wrong in both directions is worse than no check, because an author
reading the file would believe the sheet was policed. The guarantee is made
before the card exists — in `cardable()` — and held there by
`test/core/stance.test.ts`.

## 2. New item kinds

Two kinds and one new field on an old one, added to `core/types.ts` and honoured
everywhere the union is switched on.

```ts
export type RatingItem = ItemBase & {
  kind: "rating";
  min: number; max: number;
  minLabel?: string; maxLabel?: string;
};
export type TextItem = ItemBase & {
  kind: "text";
  placeholder?: string;
  rows?: number;
};
export type MultiItem = ItemBase & {
  kind: "multi";
  options: Option[];
  max?: number;
  exclusive?: string[];   // values that cannot be held with any other
};
```

**`exclusive` is what makes an honest escape honest.** Every option set in this
app is required to carry a way out — "none of these", "I have not thought about
it", "it touches none of my money". A `choice` clears the others for free,
because picking one is picking one. A `multi` clears nothing, so without this a
reader ticks "Nothing at the moment" beside "Two or three hours a week of
training" and the app stores, scores and prints the contradiction back at them as
a position they stated. Writing the label to read as terminal is a mitigation;
naming the option is the fix.

The control's rule is three sentences. Ticking an exclusive value replaces the
whole selection with just that value. Ticking any other value drops every
exclusive value on the way in. Unticking is untouched — it stays the one gesture
that does exactly and only what it says.

`max` has no authority over an escape: it neither counts one nor disables one.
The file already argues that a limit stops you adding and never stops you
removing, because disabling a ticked box at the cap traps somebody who picked
wrong; this is that argument one step on. Somebody who has spent every pick and
then realises none of them are true must be able to say so in one click, rather
than deduce that they have to untick something first.

`validate()` refuses three declarations, all of which render as a perfectly
ordinary checkbox and none of which can be told apart downstream from a reader
who meant both: an `exclusive` value that is not one of the item's own options
(a typo, or an option renamed on one line and not the other — it clears nothing);
a multi whose every option is exclusive (a `choice` wearing the wrong kind, whose
reader can never pick two of anything); and `exclusive` on any kind but `multi`,
where nothing would read it.

`StanceBlock` carries `exclusive` for the block's own question and
`groundsExclusive` for its grounds multi — two fields rather than one, because
the two option sets are unrelated and a single list would be checked against
neither. `stanceItems` passes each onto the item that can enforce it, and refuses
a block that declares either where no such item will exist. `scoreStances` needs
no change: it already filters to declared values, and a correctly built control
can no longer hand it a contradiction.

**`rating` is not a Likert item with more points.** A Likert point is a verbal
anchor — "Rarely me", "Often me" — and the scale machinery exists to keep those
anchors dividing the range identically in four languages. A rating is a
number the person chooses on a labelled continuum with words only at the ends.
Rendering it through `scaleFor` would demand ten translated anchors per locale
that nobody would read, and would let a rating be reverse-keyed and summed,
which is precisely what must never happen to it.

**`text` never blocks progress**, item by item, regardless of `form.optional`.
"I would rather not explain" is a real answer, and a form that will not
advance until a reason is typed collects reasons that were typed to advance
the form.

### 2.1 What this does to the share codec

`core/report.ts` packs answers to one character per item and falls back to JSON
for any instrument whose bank contains something that will not fit. Neither new
kind fits: a rating of 10 is two characters and a text answer is arbitrary.

Both are therefore declared unpackable, which drops the whole instrument to the
JSON path. That is the honest outcome rather than a clever one — the codec's
own comment records that a partly packed string misaligns every item after the
first wide one and produces a plausible wrong result, which shipped once
already. The JSON path still strips private ids, so the `why` is gone either
way.

Inventory tokens are therefore larger than questionnaire tokens. They are also
rarer, and correctness is worth more than a shorter URL.

## 3. Scoring a stated inventory

`core/stance.ts` exports `scoreStances(blocks, answers)`:

```ts
export type StanceReading = {
  id: string;
  choice: string | string[] | null;  // option identifiers, never prose
  weight: number | null;             // 1..10, or null if not given
  reasoned: boolean;                 // did they write anything in `why`
  grounds: string[];                 // option identifiers
};

export type StanceResult = {
  v: 1;
  stances: Record<string, StanceReading>;
  ranked: string[];        // block ids, heaviest first; ties keep declared order
  settled: string[];       // answered, weight >= 8 — the ones with no give in them
  open: string[];          // answered, weight <= 3 — where there is room to move
  unweighted: string[];    // answered, a weight was asked for, none given
  answered: number;
  total: number;
};
```

**The text of `why` is not in the result and must never be.**
`test/instruments/contract.test.ts` fails any `score()` that returns prose,
and it is right to: a result is stored, shared and re-read in another
language, so a word inside it is a word that cannot be translated later. The
`reasoned` boolean is what the result carries; the sentence stays in `answers`,
where the View reads it from and no token can reach it.

### 3.1 Comparing two people

`compareStances(a, b, blocks)` — generic, used by every inventory's `compare()`:

```ts
export type StanceComparison = {
  collisions: string[];   // both weights >= 7, different answers
  asymmetries: string[];  // |weightA - weightB| >= 5
  aligned: string[];      // same answer, both weights >= 7
  quiet: string[];        // different answers, both weights <= 4
  weightless: string[];   // both answered, no pair of weights to compare
  unanswered: string[];   // at least one of them did not answer
  withheld: string[];     // declared private, so compared by neither — §1.4
};
```

Ordered by weight, never averaged, never a percentage. The previous design memo
rejects a compatibility figure in every instrument for reasons that apply here
unchanged: averaging two people into one number destroys the only information a
two-person instrument has.

**Every shared block leaves the comparison in at least one list, and
`weightless` is what makes that true.** The four findings above are each a
claim about two weights, so a block where either side has none — a `skipWeight`
block, where neither side can have one by construction, or a rating one of them
left blank — matches none of them. Without a list of its own such a block is
silently dropped: two people who answer a `skipWeight` question differently get
five empty lists, and an inventory built entirely from `skipWeight` blocks
compares to nothing at all.

It is a fifth list rather than a second meaning for `unanswered` because the
two are different facts. `unanswered` says somebody did not state a position.
`weightless` says both did, and only the *stakes* are unknown. Filing an
answered block under a heading a couple reads as "neither of you said" is a lie
about a question they answered, and an instrument that infers nothing has no
excuse for one.

**`withheld` is the sixth list, on that same reasoning one cause further back.**
A block declared `private` (§1.4) was answered — probably carefully — and
withheld by construction. `unanswered` would be the same lie about the same
question with a different cause, and the more dangerous of the two to tell,
because the one person who knows it is a lie is the one who answered it. So the
check comes first in the loop, before anything reads a choice or a weight: every
other list is a statement about what the two of them said to each other, and
there is no version of such a statement a private block belongs in. The list
carries ids in declared order and is deliberately *not* sorted by weight the way
the other five are — the sort key would be the private weight, and a `withheld`
list ordered heaviest-first is the ranking the tier was set to prevent.

**Why it takes `blocks` rather than reading a flag off the result.** A
`StanceResult` cannot say which of its blocks was private, and the shape of the
fix is a real decision. A seventh field on `StanceReading` was the obvious move
and is the wrong one, twice over. First, a private block is *absent*:
`packAnswers` strips all four of its items, so a partner re-scoring a share
token has no answers for it and produces a reading indistinguishable from a
question that was skipped — the flag would have to be carried in the token
(metadata about the omission, on the wrong side of the promise the bank made) or
set locally from the blocks, which is the parameter taking the scenic route.
Second, and decisively: a result is `v: 1` and is stored, exported and pasted
back months later, so a flag inside one is a copy of a fact that lives in the
bank. Make a block private today and every result already on disk says `false`
— a missing field is falsy, the block is filed in an ordinary list, and the
comparison prints exactly what the change was made to stop printing. Stale
results would fail *open*, which is the one direction a privacy feature must not
fail. The blocks are the declaration this build is running, the parameter is
required so no caller can omit it, and an instrument's `compare()` has them in
scope already. They also fix the loop's membership: a block missing from them is
not compared at all, because a block the caller did not declare is one whose
privacy the caller cannot vouch for. Neither prose nor an answer enters the
result either way — `withheld` is a list of ids, like the other five.

## 4. The playbook — the reader's own OK and not-OK

This is the second request and it applies to every instrument in the app, not
only to the new ones.

### 4.1 What the instrument supplies

An optional method on the spec:

```ts
playbook?(result: R, t: T): { ok: PlaybookSuggestion[]; notOk: PlaybookSuggestion[] };
export type PlaybookSuggestion = { id: string; text: string };
```

Suggestions are **derived from the result**, not a fixed list. Someone who
scored high on avoidance gets different suggested lines from someone who did
not, and the whole value of the feature is that the reader recognises a
sentence rather than composing one from nothing.

Each suggestion is a complete, second-person, actionable sentence — something
that could be handed to another human unedited. Not "consider my need for
space" but "give me an hour before we finish the conversation". The Barnum
test applies: if the line could not plausibly be false of somebody, it is not
worth offering.

Eight to fourteen suggestions per side is the target. Fewer reads as a
suggestion; more reads as a form.

### 4.2 What the reader does with it

A client component on the result page. Two columns — *this is fine* and *this
is not* — each a list of checkboxes plus an "add your own" row. Picking is
instant and saved on every change; nothing is submitted.

The reader's own lines are the point. A suggested line the reader ticks is a
sentence we wrote that they endorsed; a line they type is one we could not have
written. Both go on the sheet, and the sheet marks which is which only in that
the reader's own words are theirs.

### 4.3 Storage

A new key, separate from the run:

```
mi:1:practice:<instrumentId>   { ok, notOk, ownOk, ownNotOk, updatedAt }
```

Suggestion ids are stored, not their text, so the lines re-render in whatever
language the reader is in today. An id that no longer exists — because the
instrument was revised, or the result changed on a retake — is dropped
silently at render rather than shown as a stale sentence.

`clearRun` deletes the practice alongside the run. Deleting a result must mean
everything derived from it is gone; a set of notes surviving the result they
were written against is a surprise, and the surprise is in the wrong direction.

### 4.4 What the playbook does *not* do yet

It does not go into share tokens. The reader's typed sentences are prose of
unreviewed content, and §1.1's argument applies to them for the same reason —
with the difference that these were written deliberately to be handed over, so
this is a scope decision rather than a permanent rule. They appear on the
instruction sheet, which is local, printable, and the thing the app exists to
produce. Sharing them is future work and needs its own audience element.

## 5. Runner changes

1. **Render `rating` and `text`.** Rating as a single row of ten numbered
   targets with the two end labels beneath; text as a textarea that grows.
   Both controlled, both Radix where a primitive exists.
2. **`pageBy: "group"` on `ItemsForm`.** Page boundaries fall where `group`
   changes, so a stance block is never split across a page break. This is
   P1-2 from the previous memo, which asked for topic-grouped paging.
3. **A `text` item never blocks Next**, independent of `form.optional`.
4. Shuffle stays off for every inventory. A weight question shuffled away from
   the question it weighs is meaningless, and `group` ordering is load-bearing.

## 6. Registry and test changes

- `FAMILIES` gains `inventory`; `ITEM_KINDS` gains `rating` and `text`.
- `validate()` checks: a `rating` has finite `min < max`; a `text` has no
  options; every `.why` item carries `tier: "private"`; an `inventory` declares
  `shuffle: false`.
- `registry.groups()` gains an inventory group before the questionnaires.
- **`test/instruments/parity.test.ts` is rescoped.** It currently derives its
  case list from the web registry and imports `../../../src/instruments/<id>`
  for each, which demands a vanilla twin of every instrument that will ever
  exist. Its actual purpose is narrower and stated in its own header: *the
  ported instrument must score identically to the one in production*. A new
  instrument was never in production, so there is nothing to compare it to.

  The fix keeps every bit of the test's protective value: derive the case list
  from the directories under `src/instruments/`, and additionally assert that
  every vanilla instrument is present in the web registry. A ported instrument
  can then never silently lose its parity check, and new work does not have to
  be written twice in two languages to satisfy a test about a port.
- `contract.test.ts` gains: stance blocks expand completely; every `.why` is
  private; `playbook()`, where declared, returns unique ids and non-empty text
  on both sides; no inventory result contains a 1–100 score field.

## 7. The instruments

Eight folders. Each is `spec.ts`, `blocks.ts`, `View.tsx`, `provenance.ts`,
`i18n/{en,pl,es,de}.ts`, `index.ts`, and `Compare.tsx` where a second person
makes it better.

| id | family | blocks | what it records |
|---|---|---|---|
| `communication-style` | inventory | 12 | How you want to be addressed, in the four-colour vocabulary |
| `family-plan` | inventory | 14 | Children, timing, and everything downstream |
| `money-management` | inventory | 14 | Accounts, thresholds, debt, giving, risk |
| `faith` | inventory | 12 | What is held, how much it weighs, and on what grounds |
| `good-life` | inventory | 12 | What a life that went well would contain |
| `before-marriage` | inventory | 15 | Gottman's five talks, as five sections |
| `boundaries` | inventory | 12 | What is fine and what is not, before it is tested |
| `digital-life` | inventory | 12 | Phones, availability, what gets posted |

### 7.1 The two additions, and why these two

`boundaries` and `digital-life` were chosen against the same test as everything
else: what does a person get here that they could not have written down alone,
and is there a defensible source for it.

**`boundaries`** is the natural home of the OK / not-OK request. The playbook
attaches to every instrument, but this is the only one whose *questions* are
that shape too — what happens with money lent to family, with a partner's
friendships, with contact from an ex, with a parent who arrives unannounced.
These get decided in the moment, badly, by everyone. Writing them down while
nothing is on fire is the whole product.

**`digital-life`** is the largest uncovered surface in the catalogue. Phone at
dinner, replying at midnight, what gets posted about you and about your
children, whether locations are shared, whether passwords are, what happens to
your accounts when you die. No existing instrument touches any of it and every
couple negotiates all of it by accident.

### 7.2 Overlap with `couple-conversations`, stated plainly

`couple-conversations` covers roles, money, conflict, children and religion
already. `before-marriage`, `family-plan` and `money-management` cover the same
subjects. This is not duplication, and both sides must say so in copy:

- `couple-conversations` records **whether the two of you have talked about it**
  and what each of you predicts the other thinks. Its output is an agenda of
  unspoken subjects.
- The inventories record **your position, its weight, and your reason**. Their
  output is a document.

One tells you where to start. The other is what you bring.

### 7.3 The colours, and what may be claimed about them

`communication-style` uses a four-colour vocabulary. Every commercially sold
version of that vocabulary — Insights Discovery, DISC and their derivatives —
is licensed, and `docs/candidate-instruments.md` already rejects DISC on
exactly those grounds.

What is being used here is not any of those instruments. The colour metaphor
and the two underlying dimensions (pace and assertiveness × task and people
focus) are public and older than any of the products built on them; the items
are original; and the output is a **stated communication preference**, not a
measured personality type. That distinction is the licence and it is also the
honest description: this instrument does not claim to know how you communicate.
It records how you have asked to be communicated with.

`provenance.ts` says all of this, names the products not used, and claims no
reliability, no factor structure and no criterion validity — because a stated
preference has none of those things and does not need them.

### 7.4 The faith instrument

It records what a person holds, what weight they put on it, and what it rests
on. It does not grade orthodoxy, does not score devoutness, and produces no
number that could be read as either.

It must be answerable, without insult, by someone who holds a faith firmly, by
someone who has left one, and by someone who has never had one — so every block
that presupposes belief carries an option that declines the premise, and the
result copy never treats one answer as the complete one. Where dates or eras
are named, they are named against Jesus Christ alone, without comparative
calendar systems.

The grounds options are the load-bearing part: scripture, the teaching of the
church, reason and argument, personal experience, how you were raised, the
people you trust, and "I have not worked that out" — which is a real answer
given by a great many people who hold the belief anyway, and an instrument that
does not offer it collects a false one instead.

### 7.5 `good-life` and the open space

The request asked for "questions and open space". Every block already carries
open space in its `why`. What this instrument adds is a closing section of
`text` items with no closed answer at all — a letter to yourself at seventy, the
one thing that would make the next five years count, what you would want said
at your funeral. Those are stored, private, printed on the sheet, and never
scored, never shared, never compared.

## 8. Copy rules, enforced by the existing tests

- **80 characters and 14 words per prompt, in all four languages.**
  `test/i18n/readability.test.ts` is a gate, not a style note. Polish and German
  run long; the item has to be rewritten, not the limit.
- **No `, and ` / `, but ` / `; ` inside a prompt.** Double-barrelled items
  cannot be answered by anybody who is one and not the other.
- **Exactly the same key set in every locale.** `test/i18n/parity.test.ts`
  fails on a missing key and on an extra one.
- **Four originals, not one translation.** The previous memo's §9.1. A Polish
  item about money is written by someone thinking about Polish households, not
  transposed from an English one.
- **The Barnum test and the alone test** on every line of result copy.

## 9. What is deliberately not built

| Not built | Instead |
|---|---|
| The triad retrofitted onto Big Five, HEXACO, RIASEC, Enneagram, Jungian | Nothing. Their items are not individually about anything, so a weight question on one is unanswerable |
| A 1–100 score, band, or bar for any inventory | Weights, reported as weights, and an order |
| A compatibility percentage between two inventories | Collisions, asymmetries and alignment, as lists |
| Playbook lines in share tokens | The instruction sheet, which is local. Sharing needs its own audience element and is future work |
| A vanilla-JS twin of each new instrument | The parity test rescoped to the ports it was written for |
| Free text anywhere in a `score()` result | `reasoned: boolean`, with the sentence left in `answers` |
