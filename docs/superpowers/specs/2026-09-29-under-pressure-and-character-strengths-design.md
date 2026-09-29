# Under pressure, and character strengths — design

Two new questionnaires, built where `reports/Six test sources and licences.md`
found legal room: the ground MTQ48 and CliftonStrengths sell, measured with
items written for this app.

## Why these two, and why not the other four

The report ends with a table. Four of the six tests are "do not build":
16Personalities is already measured by `jungian` and `big-five`; bdsmtest.org
publishes nothing reusable and `intimacy-map` already covers most of its
ground; FRIS is closed, Polish-only and vendor-validated; MMPI-2 is a
court-protected clinical instrument that a non-diagnostic app must not
approach. Two are "build from an open alternative":

- **MTQ48** → a reading of how someone holds up under pressure, on the public
  hardiness / 4C construct. The app already covers emotional steadiness
  (`big-five` reactivity); Challenge and Life Control are the gap.
- **CliftonStrengths** → character strengths, which `strength-evidence`
  deliberately does not measure (it asks for receipts, not self-ratings, and
  answers "what am I good at" rather than "what am I like at my best").

## Items: written for the app, not borrowed

Both banks are original, in the app's voice, exactly as `big-five` and
`hexaco` are. The report pointed at public-domain IPIP scales (IPIP-VIA-R for
strengths; IPIP Self-Efficacy, Vulnerability, Assertiveness and Industry as
4C markers) as the one way to borrow published reliability. That route is
recorded in each `sourceNote` and provenance note as a data swap for later,
and is not taken now, for three reasons:

1. `app.noValidation` says every questionnaire here writes its own items. A
   borrowed bank makes that sentence false for one instrument in four
   languages, and the provenance contract in `web/` does not yet enforce
   `reproduces` at all (the report's correction table). Changing the contract
   and the disclaimer is its own piece of work.
2. The published reliability belongs to the English items and the sample they
   were given to. Three of the app's four languages would be this app's own
   translations either way, with no evidence behind them.
3. The VIA Institute's terms claim approval over "an assessment of the VIA
   character strengths"; whether IPIP's public-domain grant for IPIP-VIA holds
   against that is untested. Original items on the published classification,
   with "VIA" kept out of every name, is the lower-risk position.

So both instruments carry `items.origin: "original"`, `reproduces: []`, and an
evidence block that says "none" — the same honesty as the rest of the app.

## `under-pressure` — questionnaire

**Construct.** Hardiness (Kobasa 1979: commitment, control, challenge) and the
4C model of mental toughness that added confidence (Clough, Earle & Sewell
2002). The four-way split is contested: independent confirmatory studies
(Gucciardi, Hanton & Mallett 2012; Vaughan et al. 2017; Kawabata et al. 2021)
do not reproduce it cleanly. The result says so.

**Scales.** Four, eight items each, four forward and four reverse — 32 items
on `true5`, shuffled, five a page, about five minutes.

| Scale | High end | Low end |
|---|---|---|
| `control` | Keeps a hand on events and on their own reactions when things go wrong | Feels things happen to them; needs the chaos to settle before acting |
| `commitment` | Sees things through when they stop being rewarding | Drops what has stopped paying; needs the point restated |
| `challenge` | Reads a setback or a change as something to work on | Prefers stability; spots the risk in change first |
| `confidence` | Trusts their ability and says so under pressure | Doubts themselves under pressure; under-sells |

Emotional control overlaps `big-five` reactivity by design of the construct;
the `control` items lean on agency — deciding what to do next — so the new
reading is not a copy of the old one.

**Scoring.** `scoreLikert` to 1..100 per scale, `band()`, marked at 22 points
from the middle as in `big-five`. Unlike `big-five`, all four scales point the
same way, so `elevation()` — the average — is a meaningful overall reading and
is reported, with the copy saying what it is and is not. Straightlining is
flagged.

**Channels.** `work` (commitment, challenge), `energy` (control), `communication`
(confidence). One card per marked scale, high or low, strong or plain, in the
reader's first person — "Tell me the plan changed as soon as you know". A
centre-weighted profile gets one card, as in `big-five`.

**Both ends cost something.** Low challenge is not fragility; it is somebody
who notices what change breaks. High commitment is also the person who stays
in the wrong job. Every blurb names what each end buys and what it costs.

**Avoided.** MTQ48, MTQPlus, MTQ18, MTQ-10, SMTQ, MTS, MTI, CD-RISC, Grit
Scale, Brief Resilience Scale — none of their items are present.

## `character-strengths` — questionnaire

**Construct.** The 24 character strengths under six virtues of Peterson &
Seligman's classification (2004). The strength names are ordinary words and
the classification is published scholarship; items and descriptions here are
this app's own.

**Scales.** 24, three items each (two forward, one reverse) — 72 items on
`true5`, shuffled, six a page, about ten minutes. Three items per scale is
thin, and the result says so: at that length a scale ranks, it does not
measure.

**Scoring.** `scoreLikert`, then `rank()`. The reading is the top five
("where you are most yourself") and, without judgement, the bottom three
("used least"). Ties share a rank; a flat profile — the top five within a few
points of the bottom — is reported as flat rather than ranked into a false
order. Straightlining is flagged.

**Not weaknesses.** The bottom of the list is what somebody reaches for least,
not what they lack. The copy never calls it a weakness, and there are no cards
for it.

**Channels.** Each strength maps to one channel (kindness → affection,
fairness → conflict, perseverance → work, humour → communication, zest →
energy, prudence → rhythm, and so on). One card for each of the top five:
what I bring, and how to reach it.

**Relation to `strength-evidence`.** That instrument's own copy cites Zell &
Krizan (2014): self-ratings of *ability* track performance at about r = .29.
Character strengths are traits, not abilities, and self-report is the standard
way to measure traits — but the result says the difference out loud and points
at `strength-evidence` for anything someone wants to prove.

**Avoided.** VIA-IS, VIA-IS-R, VIA-120, VIA-72, IPIP-VIA / IPIP-VIA-R (items
not used), CliftonStrengths, Strengths Profile. "VIA" appears in no name,
title or result.

## What does not change

No track gains a step: a track's order is a claim about reading order, and
neither instrument has been placed in one by anybody who took them. Both are
reachable from the catalogue under Tests. Both are `tier: "free"`.

## Translation

English is written first and is the contract. Polish, Spanish and German are
written as tables in their own right, not glossed from English: the
originals, parity, readability and section gates apply to each.
