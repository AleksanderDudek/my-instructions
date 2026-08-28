# The eight inventories — the decisions they share

Date: 2026-08-27. Status: implementation contract. Companion to
`2026-08-27-stated-positions-design.md`, which settled the *format*. This
settles the seven things that cannot be decided one folder at a time, all of
them cheap now and expensive later: a block id chosen in isolation becomes a
stored answer id, a message key and a line on a printed sheet; a channel chosen
in isolation fails a contract test in another folder; an optimistic `minutes` is
the number somebody abandons the form against. The banks are written and
critiqued. What is left is the seams.

---

## 1. Overlap — four instruments, three subjects, two cuts

`couple-conversations`, `before-marriage`, `family-plan` and `money-management`
all touch money, children and religion. Most of that is not duplication, and
design §7.2 says why. Two blocks are — and both are duplication between two of
the *new* eight rather than with the old questionnaire.

### 1.1 What each of the four asks that no other does

| Instrument | Its own question, stated exactly | What it will not tell you |
|---|---|---|
| `couple-conversations` | **Has this been raised at all**, and what does each of you predict the other thinks — `money.status`, `children.status`, `religion.status`, and the `*.predict` items that the position items exist to make answerable | Any amount, any age, any number. `m1` is a Likert agreement, not a threshold |
| `before-marriage` | What the **word** adds (`marriage-means`), what would break it (`grounds-to-end`), whose career leads (`career-lead`), how much of the week stays yours (`alone-time`, `kept-to-myself`), where you land (`place-type`, `parents-distance`) | Money, children, faith and conflict — cut on purpose, and its `sourceNote` already says so |
| `family-plan` | The thirteen decisions **downstream of "yes"** — number, timing, gap, fertility, who steps back, weekday care, schooling, discipline, screens, grandparents, and the two on not agreeing | Whether you want children at all in the first place. That is `couple-conversations.k1` |
| `money-management` | **Amounts and thresholds** — `spend-threshold`, `saving-rate`, `giving-share`, `bad-month` — plus the one block that is an admission rather than a position, `undisclosed-debt` | What money is *for*. That is `good-life.money-for`, and it is a different question |

The pattern worth naming, because it recurs: `couple-conversations.k2` asks the
number you **wish** for, `family-plan.children-ceiling` the number you would
**agree to**. Those are two different numbers in most people, and the gap
between them is where the negotiation lives.

### 1.2 Cut one — `family-plan.faith-formation`

Duplicates **`faith.children-taught`**. Both are single-choice blocks about a
child's religious upbringing, and the option sets are the same ladder wearing
different words: `practising` ≈ `raised-in-it`, `exposedThenChoose` ≈
`taught-then-choose`, `none` ≈ `none-unless-asked`, `undecided` ≈ `undecided`.

`faith.children-taught` survives because it is the only one of the two that
declares `grounds`. A position on a child's religious upbringing without what it
rests on is the half of the answer that starts the argument rather than settling
it — "taught, then left to choose" means one thing resting on `upbringing` and
another resting on `church`. `family-plan` has no grounds vocabulary and its own
`rejected` argues against adding one.

What moves with the cut:

- `ok-take-them-along` and `notok-baptism-without-me` fire from `faith-formation`
  and nothing else. Both move to `faith`, re-keyed on `children-taught`. The cut
  relocates two lines; it does not lose them.
- The `rejected` entry "Declaring grounds on schooling, discipline and
  faith-formation" loses a third of its subject; reword to the two that remain.
- The `sourceNote` says "the fourteen decisions downstream of that". Thirteen.

`family-plan.schooling` stays, `faithSchool` option included: where a child is
*educated* is a different decision from what they are *taught to believe*,
settled by different constraints, and plenty of people pick a faith school for a
child they are not raising in it. That adjacency goes in `rejected` on both.

### 1.3 Cut two — `money-management.family-lending`

Duplicates **`boundaries.money-family`**. Same question, same magnitude ladder:
"How much could you hand a relative without mentioning it?" against "How much
can you lend family without a conversation?"

`boundaries.money-family` survives for two reasons. Design §7.1 names money lent
to family as `boundaries`' own example when it justifies the instrument existing
at all; and `money-management` already asks its threshold ladder at
`spend-threshold` — a bank that asks "above what amount would you say something"
twice, of two counterparties, has one block doing work and one producing a
near-identical second row on the sheet.

What moves with the cut:

- `no-lend-then-tell` fires from `family-lending` alone; it moves to
  `boundaries`, re-keyed on `money-family`.
- `ok-refuse-my-family` and `no-unmentioned-giving` each fire from
  `family-lending` **and** another block; both re-derive on the other alone
  (`parent-support → crisis`, `giving-share → set-amount / tenth`).
- The `rejected` entry "Do you lend to family, or give?" was reasoning about
  `family-lending`'s option set. It moves to `boundaries`.
- The `sourceNote` says "every one of the fourteen is answerable by one person
  sitting alone". Thirteen.

Neither cut is backfilled. A bank critiqued end to end should lose a block
rather than gain an uncritiqued one, and thirteen is not a defect: the counts in
design §7 were a target for how much subject to cover, not a quota.

### 1.4 Checked and kept, with the distinction recorded in `rejected`

- `faith.money-use` (does belief constrain money, including refusing to earn or
  spend) vs `money-management.giving-share` (what share). The seam is deliberate:
  `money-management`'s grounds set contains `faith`, so somebody who gives a
  tenth on religious grounds says a different thing in each.
- `good-life.money-for` vs `money-management` entire: purpose against mechanism.
- `good-life.risk-appetite` vs `money-management.risk-response`: a career bet
  against a portfolio reflex.
- `boundaries.told-outside` vs `digital-life.group-chats`: who may hear against
  which medium carries it.
- `digital-life.children-online` vs `family-plan.screens`: what is done *to* a
  child against what is given *to* them.
- `faith.funeral` vs `digital-life.accounts-after-death`: both after you die,
  neither answers the other.
- `before-marriage.who-knows` (a fact about the past) vs `boundaries.told-outside`
  (a permission).

### 1.5 The four sentences

One sentence per `sourceNote`, saying which to take first and why. It is the
only routing the reader gets, and each names instruments rather than describing
them.

- **`couple-conversations`** — "Take this one before the inventories: it records
  which of these subjects the two of you have never actually raised, which is
  the cheapest thing to find out, and Before marrying, Managing money and The
  family plan are what you bring once you know which conversation you are in."
- **`before-marriage`** — "Take Conversations first, because it tells you which
  of these subjects has never been raised at all; then this, then Managing money
  and The family plan, which go deep on the two subjects deliberately cut from
  here."
- **`family-plan`** — "Take Conversations first to find out whether children
  have been raised as a subject at all, and Before marrying if a wedding is in
  view; this is the thirteen decisions downstream of that, and it is what you
  bring to the conversation rather than what starts it."
- **`money-management`** — "Take Conversations first if you do not yet know
  whether money has ever been discussed between you; this is where the amounts,
  the thresholds and the debt get written down, and writing them down is the
  point."

The other four get no routing sentence: after §1.2 and §1.3 they overlap
nothing, and a cross-reference nobody needs is one that goes stale.

---

## 2. Colliding ids

A block id becomes a message key (`stance.<id>.prompt`), a stored answer id
(`<id>`, `<id>.weight`, `<id>.why`, `<id>.grounds`) and a row on a printed
sheet. Storage is namespaced by run, so a cross-instrument collision is
confusing rather than broken — but two blocks with the same id asking different
questions is a defect, and the person it defeats is whoever greps.

**Every id that appears twice, across all eight banks and the sixteen existing
instruments:**

| id | where | same question? | rename |
|---|---|---|---|
| `deadlock` | `before-marriage` (any big decision) and `family-plan` (a parenting decision) | **No** | `before-marriage.deadlock` → **`final-say`**; `family-plan.deadlock` → **`parent-deadlock`** |
| `money` | `faith` (block) and `couple-conversations` (topic, giving `money.status` / `money.predict`) | No | `faith.money` → **`money-use`** |
| `spacing` | `family-plan` (years between children) and `study-practice` (spaced practice, a technique id) | No | `family-plan.spacing` → **`child-spacing`** |
| `settling` (section) | `before-marriage` ("Where you settle" — geography) and `family-plan` ("When you do not agree" — settling a dispute) | No — it is a pun | `family-plan.settling` → **`disagreement`** |

Both halves of `deadlock` are renamed rather than one, so neither surviving id
can be read as "the other instrument's one". The two questions are genuinely
different and both are worth keeping — a person can hold "whoever cares more
decides" in general and "the main carer decides" about a child, which is the
distinction the `communication-style` critique preserved between `interruption`
(a working day) and `interrupting` (a sentence). One shared id hides it.

Two more on the same principle, where the id is generic rather than colliding —
generic being how the next collision happens:

- `faith.unsure` → **`unsettled`**: `unsure` is an option *value* in six of the
  eight banks, and a block whose id is another block's answer is a grep trap.
- Grounds escapes disagree across banks: `faith` uses `not-worked-out`,
  `digital-life` and `money-management` `unworked`, for the identical option.
  Unify on **`not-worked-out`** — it is the one grounds value shared code will
  ever special-case, and it can only do that if it is spelled the same.

Nothing else collides across the twenty-four instruments.

---

## 3. Flags

| id | `adult` | `sensitive` | `maxAudience` | `persistence` |
|---|---|---|---|---|
| `communication-style` | — | — | — (public) | — |
| `boundaries` | — | ✔ | `partner` | — |
| `digital-life` | — | ✔ | `partner` | — |
| `good-life` | — | ✔ | `partner` | — |
| `faith` | — | ✔ | `partner` | — |
| `before-marriage` | — | ✔ | `partner` | — |
| `money-management` | — | ✔ | `partner` | — |
| `family-plan` | — | ✔ | `partner` | — |

**`adult`: none of the eight.** The only candidate,
`digital-life.intimate-images`, asks what may *happen* to photographs — a
handling rule, not a description of anything. Gating on it would put "where
should phones be during a shared meal" behind an age confirmation, which is how
a gate stops meaning anything.

**`sensitive`: seven of eight.** Seven of eight looks like a flag doing no work,
and the eighth is the proof that it is. `communication-style` records how you
have asked to be addressed; nothing in it is a fact about your history, its
audience is a team, and its result being nobody's business by default would be a
bug. Every other one contains at least one block whose answer is a disclosure:
`family-plan.if-not-natural`, `money-management.undisclosed-debt`,
`faith.unsettled`, `boundaries.told-outside`, `digital-life.intimate-images`,
`good-life.open-avoid`, `before-marriage.grounds-to-end`.

**`maxAudience: "partner"` on those seven, and nothing capped tighter.** The cap
governs what the *share token* may offer, and it costs nothing because the
instruction **sheet** is local and printable: a boundaries sheet handed to a
flatmate, a communication sheet handed to a team, a good-life sheet read to a
spouse — none of those is a URL. What the cap prevents is the forwarded link, a
token saying somebody has undisclosed debt or has left a faith travelling one
hop further than its author intended. `communication-style` is left uncapped
because a link in an email signature is precisely its use.

Nothing gets `maxAudience: "private"`. `good-life` was the candidate, and the
finer instrument already exists: its four `openItems` carry `tier: "private"`
per item, so the letter to yourself at seventy never enters a token whatever the
audience is, while "where do you want to be living in ten years" stays shareable
with the person you would be living with.

**`persistence: "session"`: none of the eight.** `intimacy-map` has it because
it is a live exercise done together in one sitting. These are documents. An
inventory that deleted itself when the tab closed would destroy the only thing
it produces, and §4.3's rule — `clearRun` deletes the practice alongside the run
— is already the correct and only deletion path.

**Free text is off every token regardless**, by design §1.1, with no
per-instrument decision to make. That is what lets the flags above be about the
*closed* answers only.

### 3.1 One private block, and the platform field it needs

`money-management.undisclosed-debt` carries `private: true` in its bank, and its
`sourceNote` promises the answer "never leaves this device, is never in a share
link, and never asks you for an amount". Design §1.1 makes only `<id>.why`
private, so `StanceBlock` gains `private?: true` — and **a private block is
private entire**, choice, grounds, weight and why all carrying
`tier: "private"`. Half-privacy is worse than none: a token that omits the
answer but carries `undisclosed-debt.weight = 9` tells the reader exactly what
the omission was withholding.

Two consequences, both for `docs/banks/OUTSTANDING.md`:

1. **A private block must not land in `compareStances().unanswered`.** Design
   §3.1 argues that filing an answered block under a heading the couple reads as
   "neither of you said" is a lie about a question they answered; a block
   withheld by construction is the same lie with a different cause. It needs a
   sixth list, `withheld`, on the reasoning that produced `weightless`.
2. **A private block produces no instruction card.** The sheet is the artefact
   you hand over; the point of the block is that the reader picks the moment.

It stays at exactly one block across the eight. `digital-life.intimate-images`
was considered and refused: it asks for a rule about handling, not an admission
about conduct, and `sensitive` + `maxAudience: "partner"` is right-sized for it.
Every private block costs the comparison a `withheld` case, so they are spent
one at a time.

---

## 4. Channels

The labels are the contract: communication *How to talk to me*, affection *How
to show you care*, work *How to work with me*, conflict *When we clash*, energy
*What drains and restores me*, rhythm *My grain*. An instrument declares only
what its cards use, and the contract test fails a card on an undeclared channel,
so this table and `instructions()` are written against each other.

| id | channels | cards, and where each lands |
|---|---|---|
| `communication-style` | `communication`, `conflict` | **communication**: getting hold of me (`small-talk`, `interrupting`, `no-reply`); bad news and unfinished problems (`bad-news`, `unfinished`); when I go quiet, and how to ask (`going-quiet`, `asked-if-wrong`); praise (`praise`). **conflict**: correcting me and telling me you are upset (`public-correction`, `upset-with-me`); what I need before I drop it, and how to apologise (`drop-it`, `apology`) |
| `boundaries` | `communication`, `conflict`, `affection`, `rhythm` | **communication**: before you come in (`unannounced-visit`, `closed-door`, `things-read`); what I can be committed to (`volunteered`, `money-family`). **rhythm**: lateness and being woken (`lateness`, `woken`). **affection**: touch in public (`public-touch`). **conflict**: exes and what gets repeated (`partner-ex-friend`, `own-ex-contact`, `told-outside`, `friend-rude`) |
| `digital-life` | `rhythm`, `communication`, `affection`, `conflict` | **rhythm**: how fast I answer and when work may reach me (`reply-window`, `work-after-hours`). **affection**: the phone when we are together (`phone-at-meals`); intimate photographs (`intimate-images`). **communication**: what may be posted (`posted-about-me`, `children-online`, `group-chats`); what is open (`passwords`, `location`, `reading-messages`); what is left afterwards (`accounts-after-death`). **conflict**: what must never arrive as a message (`not-in-writing`) |
| `good-life` | `work`, `energy`, `rhythm`, `communication` | **work**: what the work is for (`work-purpose`, `learn-next`); money and where enough is (`money-for`, `enough-point`, `risk-appetite`). **energy**: what I give up to stay healthy (`health-effort`). **rhythm**: what I want less of (`less-of`). **communication**: where I want to be and who I would stay for (`live-where`, `who-near`); what I would keep, owe and regret (`keep-one`, `owe-others`, `regret-most`). `openItems` produce no cards |
| `faith` | `communication`, `rhythm`, `conflict` | **communication**: what I hold and what it rests on (`god`, `after-death`, `suffering`); where I belong (`belonging`, `raised-vs-now`); children, my funeral, and my money (`children-taught`, `funeral`, `money-use`). **rhythm**: the time it keeps clear (`work-rest`, `prayer-last`). **conflict**: what I will not give up (`non-negotiable`); what I have not settled (`unsettled`) |
| `before-marriage` | `communication`, `conflict`, `rhythm`, `work` | **communication**: what the word adds (`marriage-means`); friendships and what stays mine (`who-knows`, `closest-friend`, `kept-to-myself`); where we live and who else lives there (`place-type`, `parents-distance`, `household-who`). **conflict**: what would break it, and who decides when we are stuck (`grounds-to-end`, `final-say`). **rhythm**: evenings, alone time, holidays (`evenings-together`, `alone-time`, `holiday-apart`). **work**: careers and moving (`career-lead`, `relocation`, `nights-away`) |
| `money-management` | `work`, `communication`, `conflict` | **work**: how it is held and split (`accounts`, `cost-split`, `money-admin`); what it is being built into (`saving-rate`, `risk-response`, `retirement-source`). **communication**: what I will say and when (`spend-threshold`, `debt-disclosure`); money that leaves the household (`giving-share`, `parent-support`). **conflict**: when it goes wrong (`bad-month`, `secrecy-betrayal`). `undisclosed-debt` produces nothing, per §3.1 |
| `family-plan` | `communication`, `affection`, `work`, `conflict` | **communication**: the number, the timing, the gap (`children-ceiling`, `timing-gate`, `child-spacing`); how a child of mine would be raised (`schooling`, `discipline`, `screens`, `grandparents`). **affection**: if it did not happen naturally (`if-not-natural`). **work**: who steps back and for how long (`who-steps-back`, `time-at-home`, `childcare`). **conflict**: if we do not agree (`parent-deadlock`, `change-of-mind`) |

Three checks this table passes. All six channels are used by at least one of the
eight — `energy` only by `good-life`, the honest outcome for a family about
positions rather than states. No instrument declares a channel it does not fill.
And `before-marriage` declares no `affection` despite being the marriage
instrument, because its bank leaves the couple's intimate life to the
instruments that own it; declaring it anyway is how a sheet gets an empty
heading.

---

## 5. Catalogue order

`registry.groups()` already puts the `inventory` group between the profilers and
the questionnaires, and within it order is `MODULES` order — so the eight go
into `src/instruments/index.ts` as one contiguous run, the array's only
load-bearing property being relative order within a family.

> `communication-style` → `boundaries` → `digital-life` → `good-life` →
> `faith` → `before-marriage` → `money-management` → `family-plan`

The rule is **ascending presupposition**: how much of a life an instrument
requires you to already have before its first question makes sense.
`communication-style` needs only a person who talks to other people, and it is
the one with no flags, so it is the front door. `boundaries` and `digital-life`
need a home and a phone. `good-life` needs solitude — it is the one here
answerable by somebody with nobody. `faith` is where the first reader declines
the premise, so it follows the four nobody declines.

The last three break the rule on purpose and follow the route the `sourceNotes`
describe instead: `before-marriage` is broad and shallow and tells you which of
the deep two you need, naming them in that order — "then Managing money and The
family plan". A catalogue ordered against its own copy teaches two routes.

---

## 6. Version and minutes

**Every one starts at `version: 1`.** The two cuts in §1 and the six renames in
§2 happen before anything ships, so nothing is bumping. The rule for later is
the one `intimacy-map` and `working-style` are at v2 for: bump when a change
would make a stored result mean something different — cutting a block, renaming
an option value, re-keying a playbook line.

**The unit: 45 seconds per stance block.** A closed question is about 22 seconds
— read the prompt, read five or six options, decide. The 1–10 weight is about 8.
The `why` is optional and mostly left empty; at roughly one in four written at
roughly 45 seconds, it amortises to about 15. A `grounds` multi adds 15; an
`openItems` text box, which is the point of the instrument that has them, is 45.
The calibration is `couple-conversations` — 9 minutes for 25 single Likerts and
choices is 21 seconds an item, and a stance block being twice that is the right
shape.

| id | blocks | grounds | open | arithmetic | `minutes` |
|---|---|---|---|---|---|
| `communication-style` | 12 | 0 | 0 | 12×45 = 540s | **9** |
| `boundaries` | 12 | 0 | 0 | 12×45 = 540s | **9** |
| `digital-life` | 12 | 5 | 0 | 540 + 5×15 = 615s | **10** |
| `good-life` | 12 | 0 | 4 | 540 + 4×45 = 720s | **12** |
| `faith` | 12 | 12 | 0 | 540 + 12×15 = 720s | **12** |
| `before-marriage` | 15 | 0 | 0 | 15×45 = 675s | **11** |
| `money-management` | 13 | 6 | 0 | 585 + 6×15 = 675s | **11** |
| `family-plan` | 13 | 0 | 0 | 13×45 = 585s | **10** |

Eighty-four minutes for the family, and every one of the eight is at least as
long as anything in the catalogue — the previous maximum is
`couple-conversations` at 9. Worth stating rather than smoothing: the inventory
family is the long end of this app, and `minutes` is the honest total rather
than a floor. A twelve-minute instrument advertised as six is the one people
abandon at block seven, and an abandoned inventory produces nothing at all —
there is no partial score to fall back on.

---

## 7. Glyphs

The existing sixteen: `⚭ ◈ ✦ ☾ ⚔ ⚯ ◉ ⬡ ◡ ❋ ☯ ♡ 9 ⬢ ✍ ▦`. The register is one
monochrome character, no emoji, no variation selectors, from blocks the app
already renders — Geometric Shapes, Misc Symbols, Dingbats, Math Operators.

| id | glyph | codepoint | why |
|---|---|---|---|
| `communication-style` | ❝ | U+275D | An opening quotation mark: the instrument is a record of how you have asked to be addressed |
| `boundaries` | ⌂ | U+2302 | A house. Its first section is the door and the evening |
| `digital-life` | ✆ | U+2706 | A telephone, in the same pictographic register as ✍ and ♡ |
| `good-life` | △ | U+25B3 | A summit — looking back from seventy. No triangle exists in the set |
| `faith` | ☼ | U+263C | See below |
| `before-marriage` | ⋈ | U+22C8 | The join operator: two shapes meeting at a single point. The two ring glyphs are taken by `attachment` and `couple-conversations` |
| `money-management` | ¤ | U+00A4 | The generic currency sign — the only money glyph in Unicode that names no country's money, which matters in an app answered in four languages. `$`, `€` and `zł` each pick a household |
| `family-plan` | ∴ | U+2234 | "Therefore" — one point above two. The instrument is children **and everything downstream of that**, and the glyph is the shape of the claim |

**`faith` and ☼.** Every obvious glyph for faith names a religion — ✝, ☪, ✡, ☸ —
and design §7.4 requires an instrument answerable without insult by somebody who
never held one. A sun is the least sectarian symbol in a block the app already
renders (`☾`, `☯` and `⚔` come from it). It sits near `chronotype`'s `☾`, and
the two are never adjacent: one is a profiler, one an inventory, and the
catalogue groups by family. All eight are otherwise distinct from each other and
from the sixteen; the crowding to watch at icon size is the round trio `◉`, `☼`,
`¤` — filled disc, rayed disc, spiked ring, each with a label beside it.

## 8. What this hands to the implementer

Bank edits, before any TypeScript is written:

- Delete `family-plan.faith-formation`; move two playbook lines to `faith` keyed
  on `children-taught`; reword one `rejected` entry; "fourteen" → "thirteen".
- Delete `money-management.family-lending`; move one playbook line and one
  `rejected` entry to `boundaries`; re-derive two more lines on their surviving
  blocks; "fourteen" → "thirteen".
- Renames: `before-marriage.deadlock` → `final-say`; `family-plan.deadlock` →
  `parent-deadlock`; `family-plan.spacing` → `child-spacing`;
  `family-plan.settling` (section) → `disagreement`; `faith.money` → `money-use`;
  `faith.unsure` → `unsettled`; `unworked` → `not-worked-out` in the grounds of
  `digital-life` and `money-management`.
- Add the four `sourceNote` sentences from §1.5 — including to
  `couple-conversations`, an existing instrument, which needs it most.

Platform, for `docs/banks/OUTSTANDING.md`:

- `StanceBlock.private?: true`, private entire — choice, grounds, weight, why.
- `StanceComparison.withheld`, so a private block is never reported as
  unanswered.
- `instructions()` skips private blocks.
