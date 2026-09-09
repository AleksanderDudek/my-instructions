# Four questions a student is actually asking

A design memo on career predisposition and learning style: what the market
sells, what the evidence supports, what this app already covers, and the three
folders that close the gap.

The brief was: a student takes these tests and comes away knowing **what is
genuinely a strength and what is not**, **what resources they have regardless
of their degree**, **what kind of activity suits them** — not which job title —
and **how they personally learn, communicate and get a grip on things**.

That is four questions, and they have four different evidentiary costs. One of
them cannot be paid the way the brief implies, and saying so is the first
design decision.

---

## 0. What is on the market, and why almost none of it can be copied

| Instrument | Reach | Status here |
|---|---|---|
| **MBTI** | ~3.5M/year, 115 countries, used by 89% of the Fortune 100 | Rejected. Type dichotomies, weak test–retest, and the app already refuses typology. `jungian` exists as the honest continuous version |
| **CliftonStrengths** | 34M+ people | Rejected as a model. It is ipsative by construction, commercially licensed, and its 34 themes are protected. What survives is its one good instinct — that people want the *strength* question answered — and §3 answers it differently |
| **Holland / RIASEC** | The backbone of most public career guidance | **Already shipped** as `riasec`. Public construct, public-domain item pools exist, our items written fresh |
| **O\*NET Interest Profiler / Work Importance Locator** | US federal, free | The Content Model and Database are **CC BY 4.0** with attribution to O\*NET and the US DOL. The *taxonomy* is therefore usable; the items are still ours |
| **VARK / Kolb / Honey–Mumford** | Ubiquitous in education | Already rejected in `docs/next-four-instruments.md` §4, and nothing since changes that. §4 below records why the 2024 meta-analysis does not reopen it |
| **CAAS (career adaptability)** | Validated across 13 countries, free via Vocopher | Considered and **not built**. Three of its four scales (`confidence` above all) are self-rated capability, which §3 shows this app cannot render |

The consistent pattern: the *framework* is public and the *questionnaire* is
owned. That is the pattern this repo has already navigated eight times, and it
applies unchanged.

---

## 1. What the app already covers

Before adding anything: `riasec` covers interest *domain*, `working-style`
covers how a colleague should treat you, `study-practice` covers which study
techniques you actually use, `big-five`/`hexaco`/`jungian` cover disposition,
`conflict-style` covers what happens when it goes badly, and `chronotype`
covers when you are usable.

Against the four questions in the brief:

| Question | Covered by | Gap |
|---|---|---|
| What kind of activity suits me | `riasec` — partly | RIASEC answers *which subject*, not *what shape the doing has*. A person can be Investigative and still be ruined by a job that never lets them finish anything |
| What should I look for in a job | **nothing** | The largest hole. `riasec` explicitly ends with "this is not a career recommendation" and nothing picks up after it |
| What is genuinely a strength | **nothing, and deliberately** | See §3 |
| How I learn | `study-practice` | Covers technique frequency. Does not ask the one question that separates real understanding from the feeling of it |

So: two new instruments, one new profiler, and one version bump.

---

## 2. `work-values` — what to look for, without naming a job

**The gap it fills.** "Not which job — what to look for in a job" is almost
exactly the definition of a work-values instrument, and there is a public
lineage to hang it on. Dawis and Lofquist's Theory of Work Adjustment reduced
the Minnesota Importance Questionnaire's twenty needs to six values by factor
analysis; the US Department of Labor renamed and adopted the same six for the
O\*NET Work Importance Locator: **achievement, independence, recognition,
relationships, support, working conditions**.

**Why it is honest.** A work value is a *preference*, and §5.1 of the earlier
memo established that preferences are the one reading in this app that is true
by construction. There is no external criterion for how much autonomy you want.
Your answer is definitionally the truth.

**Where the honesty has to be loud.** The instrument invites a fit inference —
"find a job that matches these" — and the fit literature is weaker than it
sounds. Kristof-Brown et al.'s meta-analysis of 172 studies puts person–job fit
at ρ ≈ .28 with job satisfaction and ρ ≈ .31 with commitment. The much larger
correlations often quoted (.61, .59) come from *direct* fit measures, where the
person is asked whether they fit and whether they are satisfied in the same
sitting — common-method variance, not a finding. The `sourceNote` carries both
numbers, because quoting only the second is how this genre lies.

**The count, not the level.** Six values all rated "essential" is not a profile,
it is a shopping list. So the reading is a **count of values above the high
band** — `mustHaves` — which §5.2 identified as the one breadth reading needing
no norms. Five or six of six triggers a card saying so, because a person who
needs everything has not yet chosen anything.

- Questionnaire, 36 items, six normative scales, five forward and one reverse.
- Channels: `work`, `energy`.

---

## 3. `work-shape` — the shape of the doing, not its subject

**The gap it fills.** This is the brief's central request — *what kind of
activity, or style of activity* — and RIASEC does not answer it. RIASEC sorts
work by subject matter. Two Investigative jobs can be opposite in every way
that decides whether someone lasts: one is a six-month problem held alone, the
other is forty small questions a day answered in a room full of people.

Eight scales, arranged as four contrasts:

| | |
|---|---|
| `depth` ⟷ `variety` | one long thing, or many short ones |
| `structure` ⟷ `openEnded` | a defined problem, or one nobody has framed |
| `making` ⟷ `people` | producing an artifact, or working through others |
| `improving` ⟷ `starting` | sharpening what exists, or the first version |

**The design decision that matters: the poles are scored independently.** Every
consumer instrument in this space forces a choice between the two ends, which
is the ipsative trap `love-languages/items.js` already argues against. Here all
eight scales are normative, so *both* ends of a contrast can be high — and that
is not a contradiction to be resolved, it is the most useful single finding the
instrument can produce. Someone high on `depth` and high on `variety` needs
variety *between* long projects, and a job that gives them neither will read as
inexplicable restlessness. Forced choice destroys exactly that person's answer.

- Questionnaire, 40 items, eight normative scales, four forward and one reverse.
- Channels: `work`, `energy`.

### The interest-congruence caveat

The temptation is to say a matched shape predicts performance. Nye, Su, Rounds
and Drasgow's meta-analysis of 92 studies reports interest congruence at
ρ ≈ .32 against performance, better than interest scores alone at .16 — but the
2017 re-analysis in *Journal of Vocational Behavior* revisits those findings
directly, and congruence indices are difference scores, with all the
reliability problems §0.2 of the earlier memo lays out. The instrument
therefore claims what it can defend: this is what you would choose, and choice
predicts how long you last far better than it predicts how well you do.

---

## 4. Strength: the one question that cannot be asked directly

The brief asks the instrument to establish "what is genuinely a strength and
what is not". A self-rated ability slider cannot do it — self-rated ability
correlates about r = .29 with measured performance — and the earlier memo
already refused them for that reason.

Refusing the *format* is not the same as refusing the *question*, and the
earlier memo left a door open: one field naming something you were the reason
went well, labelled as a **claim** rather than a measurement. `strength-evidence`
walks through that door and makes it the whole instrument.

**How it works.** Three episodes. For each: what happened, what you specifically
did, which of the eight activity shapes was the active ingredient, and how much
of it was you. Then, separately, which shapes you would *claim* as strengths.

Nothing is scored. The output is a three-way sort:

- **Backed** — you claimed it and you have an episode for it.
- **Claimed, no receipt** — you claimed it and nothing you described used it.
  Not a verdict that you are wrong; a statement that this one is currently
  unevidenced, which is the honest answer to "what is *not* a strength".
- **Shown, not claimed** — it turned up twice in your own episodes and you did
  not list it. This is the reading students most often need.

Forcing an instance converts an unverifiable trait rating into a checkable
assertion, and it is hard to invent a receipt. **No field may name another
person**, and `maxAudience` is capped at `friends`: free text about your own
history is not something to hand the open internet.

- Profiler, 13 fields, no score.
- Channels: `work`, `energy`.

---

## 5. `study-practice` v2 — the fluency question

**Learning styles stay rejected.** The 2024 *Frontiers in Psychology*
meta-analysis of the matching hypothesis is the strongest recent argument for
the other side and does not survive its own numbers: an overall matching
benefit of g = 0.31, but only 26% of outcome measures showed the crossover
interaction that is the *only* form of evidence the hypothesis actually
predicts. A main effect without the crossover is consistent with some
instructional formats simply being better, which is not the claim. Belief in it
remains near-universal among educators, which is a fact about the market, not
about the world.

What v2 adds is the question `study-practice` was missing, and it is the most
useful one in the whole learning half of this brief:

> **How do you know when you have understood something?**

Two of the four answers — *it looked familiar*, *it felt clear while I read* —
are the fluency illusions the desirable-difficulties literature is built on.
The other two — *I could explain it without notes*, *I could do a problem I had
not seen* — are the checks that actually discriminate. That single field turns
a habits inventory into something that can tell a student why their revision
felt fine and their exam did not.

Three smaller fields join it: what you do first when stuck, what your notes
look like afterwards, and what you do with a mark you did not expect. All
`select`, all preferences or behaviours, none scored.

- Version 1 → 2. Existing runs mark stale; the retake is three minutes.

---

## 6. What was considered and refused

| Candidate | Verdict | Reason |
|---|---|---|
| **CAAS / career adaptability** | No | Concern, control, curiosity, confidence. Real validation across 13 countries, and three of the four are self-rated capability. `confidence` in particular is a competence claim wearing a resource's name |
| **A skills or competence inventory** | No | Same r = .29 problem, in its purest form. The version that survives is §4 |
| **Deep vs surface approach to learning** | No | The construct has a real literature, but "surface" is a moralised label, its factor structure replicates inconsistently, and shipping a page that tells a student they are a shallow learner is the better-and-worse reading the earlier memo already refused for `intimacy-conditions` |
| **A major/degree recommender** | No | The brief explicitly asks for the opposite, and it is the single most common way this genre does harm |
| **Employability or "market readiness" scoring** | No | No norms, no criterion, and an evaluative frame aimed at a 21-year-old |

---

## 7. Standing rules these three folders inherit

Everything in `docs/next-four-instruments.md` §0 applies unchanged. In
particular: original item banks ship with **zero** reliability, factor-structure
and criterion validity, every `provenance.js` says so, and no instrument here
produces a percentile, a norm or a population comparison — because there is no
population and no plan to collect one.
