# Four requests, four different answers

A design memo on the premarital, sexual-preferences, workplace and
learning-styles modules: what to build, what to reshape, what to refuse, and
what has to change in the shell before any of it can ship.

Two of the four should be built roughly as asked, in a form the requester will
recognise. One should be built as a much smaller thing than the request
implies, gated behind a legal question this project has not yet answered. One
should not be built at all, and the thing to build instead is a different
instrument with a different name measuring a different construct.

| # | Asked for | Verdict | Ships as |
|---|---|---|---|
| 1 | Premarital: money, children, conflict, roles, religion | **Build, reshaped.** Not a compatibility test, not a risk score, no verdict | `couple-conversations` — questionnaire, 28 items, five topics, output is an agenda |
| 2 | Sexual preferences | **Build a much narrower version, gated.** No activity inventory, no compatibility, no scores | `intimacy-conditions` — questionnaire, ~22 items, output is condition cards |
| 3 | Work instrument for an employer or coworker | **Mostly not a new instrument.** Extend what exists; refuse the employer framing | `working-style` v2 — profiler, 8 → 13 fields, plus a work-audience report |
| 4 | Learning styles (VAK/R) | **Reject outright.** The construct does not survive contact with the evidence | `study-practice` — profiler, ~10 fields, about technique use, not about a type |

Everything below is downstream of two things that apply to all four, so they go
first.

---

## 0. Two facts that govern every decision in this memo

### 0.1 Validity does not survive the rewrite

The house pattern — public construct, original items — is used three times
already and is the right pattern legally. It is not a psychometric pattern.
Reliability, factor structure and criterion validity are properties of a
specific item set given to a specific population; they are not properties of a
construct's name. When we write forty fresh items against the Big Five, we
inherit the *idea* of five factors and none of the evidence attached to the
NEO-PI-R. The same is true of everything proposed below.

The research pack that precedes this memo repeatedly writes a dimension's
justification as though the pedigree came along — "the best-validated trait
construct in sexology", "predicted peer ratings of behaviour" — and then
specifies fresh items. The critique calls this blocking, and it is correct. So:

> **Standing rule.** Every instrument in this app that uses an original item
> bank has, on the day it ships, exactly zero reliability evidence, zero
> factor-structure evidence and zero criterion validity. Its `sourceNote` must
> say so in one sentence, in every locale. This is a new requirement and it
> applies retroactively to `love-languages`, `enneagram`, `big-five`, `hexaco`,
> `jungian`, `conflict-style`, `attachment` and `riasec`.

This is not a counsel of despair. It is the reason the four instruments below
lean hard toward **recording** rather than **estimating**: a preference that is
reported back arranged is true by construction, and needs no norms. The
`working-style` folder already writes this down and is the most defensible
thing in the app for exactly that reason.

It also means: **no `band()`, no percentiles and no population comparison in any
of the four.** The band cutoffs in `src/core/scoring.js` are informed guesses,
which is tolerable when the output is "you lean high on openness" and
intolerable when the output is about someone's marriage or their sex life.

### 0.2 What r ≈ .3 means for one person

The research pack quarantines Heyman & Slep's cross-validation lesson to
divorce prediction. The critique is right that it governs everything here. Their
equation classified its derivation sample at 90% accuracy, 92% sensitivity and
89% specificity; on cross-validation the positive predictive value fell to 29%
(https://pubmed.ncbi.nlm.nih.gov/17066126/). Nothing about that arithmetic is
specific to divorce. It is what happens when you take a group-level association
and use it to classify one person.

The strongest effects anywhere in this research are around r = .37–.43 (sexual
communication and satisfaction, Mallory et al. 2022,
https://pubmed.ncbi.nlm.nih.gov/34968095/), and those are cross-sectional,
same-source, with heavy item overlap between predictor and outcome. Joel et
al.'s 43-dataset analysis reached up to 45% of *baseline* variance and about 18%
at follow-up (https://www.pnas.org/doi/10.1073/pnas.1917036117) — the ceiling of
the whole field, using relationship-specific perceptions, in the best data
available. At those magnitudes, a statement about *this reader* is a coin toss
with good manners.

So each of the four instruments below is built so that its outputs are things
the person **told us**, not things we **inferred about them**. Where an
inference is unavoidable, it is coarse, hedged in the copy, and never ordered by
its own magnitude.

---

## 1. Premarital → `couple-conversations`

### Verdict

Build it. Do not build the thing the request describes.

The request lists five content domains, which is the shape every consumer
premarital product takes and the shape that makes them worthless: five scales,
five percentages, one headline compatibility figure. Three findings kill that
design outright.

- **Actual similarity stops predicting once a relationship exists.** Montoya,
  Horton & Kirchner's meta-analysis of 460 effect sizes found similarity
  correlates r = .47 with attraction at zero acquaintance and is not significant
  in existing relationships, while *perceived* similarity predicts at every
  stage (http://persweb.wabash.edu/facstaff/hortonr/pubs/Montoya,%20Horton,%20&%20Kirchner,%202008,%20JSPR%20similarity%20effect%20meta%20analysis.pdf).
  A compatibility percentage built by differencing two questionnaires is
  therefore measuring something the literature says does not predict the
  outcome the reader cares about.
- **The couple is not a person.** Averaging two partners into one score destroys
  the only information a two-person instrument has. Two people at 2 and 8
  average to the same place as two people at 5 and 5.
- **No verdict is supportable.** Fowers & Olson said so about their own
  instrument, and their 80–85% figure comes from a purposive sample where clergy
  nominated couples they already knew the outcome for, with a 49% return rate and
  no cross-validation
  (https://www.prepare-enrich.com/wp-content/uploads/2020/12/Fowers-Olson-1986-Predicting-Marital-Success-With-PREPARE.pdf).

What survives is smaller and better: **an agenda**. The instrument's job is to
find the conversations two people have not had, and hand each of them a topic
list. That is a claim the evidence supports — premarital education produces
modest improvements in communication and relationship quality (Carroll & Doherty
2003, https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1741-3729.2003.00105.x),
and the critique is right that even this ceiling is set too high: the large
federal randomised trials, Building Strong Families and Supporting Healthy
Marriage, found null-to-trivial effects on relationship quality and none on
stability. The pack omits them. They belong in the `sourceNote`, because they
are the strongest counterweight to the only positive claim this instrument makes.

### Where I depart from the research pack

The pack's flagship output is the **calibration gap** — ask each person to
predict their partner's answer, score the error, and order the report by the
size of the gap. It calls this "the single strongest form-design finding in the
literature". I am not building it, for three reasons, all from the critiques.

1. **It is a difference score built from a difference score**, which the pack's
   own pitfall list forbids by citing Griffin, Murray & Gonzalez (1999). An
   accuracy score decomposes into assumed similarity, stereotype accuracy and
   differential accuracy — Cronbach's 1955 critique, which is the direct
   ancestor of the Sillars finding and which the pack does not cite. A per-item
   accuracy on one 1–5 prediction has near-zero reliability; over three items it
   is barely better. **Ordering the report by gap size therefore orders it by
   measurement error**, and the couple opens their report on the noisiest item
   in the bank.
2. **It is a weapon.** "You were wrong about your partner" is the line one
   person reads aloud in an argument. If the report shows *which* partner
   mispredicted, the product has assigned blame in a domain where it has no
   standing.
3. **Sillars et al. (1994) is a warning, not a mandate.** Its finding is that
   assumed similarity inflates apparent understanding
   (https://journals.sagepub.com/doi/10.1177/0265407594114008). That is a reason
   to distrust agreement scores, not a reason to build the product around an
   accuracy score.

What replaces it is **discussion status**, which the pack also proposes and
which is the better variable for a reason the pack does not state: it is a
*self-reported fact about an event*, not an inference about a mental state.
"Have you two talked about this?" has reliability closer to a date of birth than
to a personality item. FOCCUS already operationalises something like it by
excluding "uncertain" from its agreement percentage
(https://foccusinventory.com/foccus-inventory.aspx), and Stanley, Rhoades &
Markman's sliding-versus-deciding frame is the theoretical warrant
(https://onlinelibrary.wiley.com/doi/10.1111/j.1741-3729.2006.00418.x) — though
the critique is right that this frame is one lab's, mostly cross-sectional, and
grew out of a cohabitation-effect literature that has weakened substantially
(Kuperberg 2014; the Rosenfeld & Roesler exchange). It is a design intuition
with support, not an established predictor, and the `sourceNote` should say so.

I keep **one** trace of the calibration idea, heavily de-rated: a single
prediction item per topic, used only to raise a **pair-level, unattributed**
flag, and only when the two people's positions are two steps apart on a
three-state summary. No accuracy score. No per-person accuracy. No ordering by
it. The wording is always symmetric — "this one hasn't been talked through
clearly enough for either of you to be sure" — never "you thought X and they
said Y".

I also drop three things the pack wants:

- **The idealisation guard.** PREPARE has carried one since 1986 and revises
  individual scores against it. Two objections converge. Conventionalisation
  scales correlate heavily with actual relationship satisfaction, so the flag
  misfires on exactly the couples it is meant to reassure; and correcting
  substantive scores for social desirability does not improve criterion validity
  (Ones, Viswesvaran & Reiss). More decisively: a sentence telling two people,
  in a document they read together, that the app thinks they answered
  dishonestly is an accusation the product made. Since this instrument computes
  no scale scores, there is nothing for the guard to protect. **Cut the items;
  ship the caveat unconditionally to everyone.** `straightlining()` already
  exists in core and covers the careless-responding case.
- **The children contingency item** ("what would happen if your partner wanted
  the opposite"). "This would end us", surfaced to a partner who did not know
  it, is a relationship-ending disclosure delivered by a web page with no
  facilitator and nobody in the room. Every instrument this design derives from
  is facilitator-gated. Ask the discrete fact; put the contingency question in
  the reader's *own* result copy as a question to sit with, never as a stored,
  scored or compared item.
- **Domain weighting.** The pack proposes weighting money and conflict heavily
  and religion lightly, on the basis that PREPARE's scales discriminated 10 of
  11 and 9 of 11. The critique's reading is better: when eleven heterogeneous
  scales all discriminate the same criterion groups, the parsimonious
  explanation is a single evaluative factor contaminating all of them, and an
  omnibus ANOVA cannot license relative weights. All five topics get equal item
  counts. We select topics on the basis that couples report not having discussed
  them; we do not claim to know which matters most.

### Shape

| | |
|---|---|
| **id** | `couple-conversations` |
| **family** | `questionnaire` |
| **items** | 28 |
| **scale** | `agree5` for positions; `choice` for status, predictions and the children facts |
| **shuffle** | **off** — see below |
| **pageSize** | 5, but topic-aligned |
| **minutes** | 9 |
| **channels** | `communication`, `conflict` |
| **compare** | yes, and it is the point |

Five topics × (3 position items + 1 discussion-status choice + 1 prediction
choice) = 25, plus three children facts = 28.

**Shuffle is off**, which departs from the house default, and the reason is
worth writing into the folder. The runner shuffles so that eight consecutive
items measuring one scale do not announce themselves and inflate it. There is no
scale here to inflate — nothing is summed into a 1–100 — and the discussion-status
question is meaningless away from the topic it refers to. So items stay grouped
by topic, one topic per page, and the shuffle cost is not paid because there is
no benefit to buy.

**Within a topic, the discussion-status question comes first**, before the
position items. Stating your position on joint accounts primes you to believe
you have discussed joint accounts. Since discussion status is the load-bearing
output and the positions are not scored, priming the position is the cheaper
error.

### Dimensions

| Topic | Items | What it asks | Evidence, honestly stated |
|---|---|---|---|
| **Money** | 3 + status + prediction | Arrangements and friction: what each knows about the other's income, debt and savings; the amount above which a purchase is a joint decision; whether either has spent something they expected the other to object to | Dew, Britt & Huston found financial disagreements the strongest *of the disagreement types they measured* (https://scholarsarchive.byu.edu/facpub/4526/). The pack's "it's the fighting, not the balance sheet" is an overcontrol artefact — conditioning on a plausible mediator and concluding the upstream variable is irrelevant. We ask about both arrangements and friction and claim neither is the cause. The concealment pair (a disapproved-of act plus deliberate non-disclosure) is Garbinsky et al.'s two-component structure, used as a construct definition only (https://academic.oup.com/jcr/article/47/1/1/5610529) |
| **Conflict and repair** | 3 + status + prediction | What each does when a disagreement gets heated, whether an argument gets finished, and what repair looks like — behaviour, not an abstract "style" | Birditt et al. is the strongest citation here: 373 couples, prospective, sixteen years, racially diverse, independent of the Gottman lab, and dyadic-pattern-based (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3777640/). Busby & Holman's 1,983-couple result is worth having but the pack overstates it: the outcomes are concurrent self-reported satisfaction and perceived stability in a self-selected online sample, not divorce (https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1545-5300.2009.01300.x). We do not repeat "contempt is the strongest single predictor of divorce" — that comes from the same small Bay Area samples that failed to cross-validate, and the Heyman & Slep discount either applies to the whole corpus or to none of it |
| **Roles and lifestyle** | 3 + status + prediction | Who is expected to do what, whether the arrangement is judged fair, and the load-bearing lifestyle facts (where you live, proximity to family, time apart) | Included, with a weaker claim than the pack makes. The pack asserts that perceived fairness is "repeatedly the best psychosocial predictor of marital happiness" and cites nothing; the critique names Cooke, Sigle-Rushton, and Sayer & Bianchi as a genuinely mixed and country-dependent record. Both halves are stated more strongly than the literature supports, and this is precisely the kind of unsourced settled-sounding claim the house style exists to catch. Ask about expectations and perceived fairness; make no predictive claim in the copy |
| **Children** | 3 facts + status | Want / how many / roughly when — as `choice` items, not attitudes | This is where the evidence forces a reframe and the reframe survives the critique even though its supporting numbers do not. Children & Parenting was the one PREPARE scale that failed to distinguish later-satisfied from later-divorced in Fowers & Olson, failed again in Larsen & Olson's replication, and has the worst reliability in the battery (α ≈ .49 original, .60 for engaged couples). Premarital parenting *attitudes* are hypothetical and measure badly. The pack justifies the discrete-fact version with hazard ratios for unintended and disagreed-upon births — but those describe births that already happened inside existing unions, classified retrospectively, heavily confounded with age, education and income. **The design move is right on reasoning grounds; the numbers must not appear in product copy** |
| **Religion and shared meaning** | 3 + status + prediction | Practice rather than label: whether anything is enacted jointly, what is expected of the other person, what would be transmitted to children | The weakest of the five and it must say so. Religious Orientation failed the ANOVA in the Larsen & Olson replication; in FOCCUS's five-year study the only scale that failed to discriminate was the Catholic edition's marriage-covenant scale (https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1752-0606.1995.tb00149.x). Mahoney's work finds the constructs that do relate are enacted and relationship-directed — sanctification, spiritual intimacy, praying for the partner — at r ≈ .12–.22 (https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1741-3737.2010.00732.x). Denominational match is not the variable, and a denominational-compatibility feature would be folk wisdom |

Two items across the whole instrument are **private tier** (see §7.1): the money
concealment item and the conflict item that touches fear. They are answered,
they inform the reader's own page and the support routing, and they never enter
`compare()`, `instructions()` or any token.

### What `score()` returns

Numbers and identifiers only, as the contract requires, and — importantly —
carrying the per-item responses, because `compare()` receives *results*, not
answers, and a side-by-side of two people's positions is the entire output.

```js
{
  v: 1,
  topics: {
    money: {
      items:     { m1: 4, m2: 2, m3: 5 },   // raw 1–5, unanswered omitted
      lean:      "separate",                // "separate" | "mixed" | "joint"
      discussed: "passing",                 // "never" | "passing" | "talked" | "decided"
      predicted: "joint",                   // the same 3-state summary, for the partner
    },
    conflict: { … }, roles: { … }, religion: { … },
  },
  children: { want: "probably", count: "two", when: "twoToFive", discussed: "talked" },
  answered: 26,
  total: 28,
  flat: false,        // straightlining()
}
```

Three things that are deliberately absent: any 1–100 score, any percentage, and
anything at all about the other person. `lean` is a coarse three-state summary
derived by a rule written in the folder, not a normalised scale — a three-item
topic bank has unknown reliability and a two-decimal score would be a lie about
precision. Unanswered items are **omitted, not substituted**: `scoreLikert`'s
midpoint substitution is correct for a scored scale and wrong here, where "I
didn't answer" is a real state and the FOCCUS design lesson is that the
uncertain response belongs in its own bucket.

### What the result page reports

The solo page has to be worth reading before any partner is involved, because
most people will take it alone and some will never send it to anyone.

1. **Your map.** Five rows: what you said, whether you've discussed it, whether
   you think you've decided it. Ordered `never` → `passing` → `talked` →
   `decided`, so the top of the page is the list of conversations not had.
2. **The contingency prompt** for children, as a question in the copy — not an
   item, not stored, not compared.
3. **The standing caveats, on the page and not in a footer.** This is not a
   prediction about your relationship. Agreement is not the goal and
   disagreement is not a failure. A couple who argue about money and know it are
   not in the same position as a couple who have never raised it. And the
   `sourceNote` line: original items, no norms, no validation, and the two large
   randomised trials of premarital education found null-to-trivial effects.

No archetype names, no couple types, no "you are The Harmonisers". PREPARE's
four-type typology is derived from cluster analysis over a 100,000-couple norm
base; inventing types from a fresh bank with no norms is the point where this
stops being defensible.

### What `compare()` does

`compare(a, b, { nameA, nameB, t })` renders one row per topic, ordered by the
*pair's* discussion status — the least-discussed topic first. Each row shows:

- **Both positions, unaveraged, side by side**, in words rather than numbers:
  "you lean toward keeping finances mostly separate; they lean toward mostly
  joint". No gap magnitude, signed or unsigned.
- **Both discussion statuses**, and — when they disagree about whether they have
  decided something — that disagreement stated as the finding it is.
- **The surprise flag**, only when the two leans are two steps apart *and* at
  least one prediction pointed the other way. Pair-level, unattributed,
  symmetric. Never per-person, never counted, never ranked.
- **An opening line** either person could say out loud. Never a scripted
  confrontation, never an instruction to raise something with a partner who
  controls the money.

Four cells, styled in this priority order: you have never discussed it (top,
regardless of whether the answers match, because accidental agreement is not a
decision); you disagree and at least one of you did not expect that; you
disagree and you both knew (normal, negotiable, already live); you agree and
neither knew (pleasant, cheap, low information).

The existing `working-style` `compare()` is the model: it reports the specific
clashes in order and refuses to compute an overall similarity figure. This is
the same design at higher stakes.

---

## 2. Sexual preferences → `intimacy-conditions`

### Verdict

Build a much narrower instrument than the request describes, and treat one legal
question as a hard gate before writing a single item.

Three findings govern the whole design.

**Matching does not predict.** Joel, Eastwick & Finkel fed 100+ self-report
measures from speed daters into random forests: actor variance 4–18% predictable,
partner variance 7–27%, relationship-specific variance **not predictable at all**
from anything measured before the pair met
(https://journals.sagepub.com/doi/abs/10.1177/0956797617714580). The critique is
right that this is being stretched — it is a four-minute first encounter, not two
established partners' preference concordance, which is a different and largely
untested question. The refusal to ship a compatibility percentage rests better on
two other legs: there is no validated concordance-to-satisfaction evidence at
all, and a percentage built from two questionnaires is the difference-score
problem again.

**Communication is the largest reliable association.** Mallory et al.: 93
studies, 209 effect sizes, 38,499 people; r = .43 with sexual satisfaction, r =
.37 with relationship satisfaction, quality beating frequency and disclosure
(https://pubmed.ncbi.nlm.nih.gov/34968095/). The pack calls it "the lever". It
is not: the meta-analysis is essentially all cross-sectional, same-source on
both sides, with substantial item overlap between the communication measures and
the satisfaction measures, and satisfying sex plausibly makes talking about sex
easy at least as much as the reverse. It is the best-supported *association* in
the domain, which is enough to make it the content, and not enough to promise a
result.

**Compatibility framing is the thing to avoid, for a softer reason than the pack
gives.** Maxwell, Muise et al. showed sexual destiny beliefs predict worse
outcomes when problems arise while growth beliefs buffer them
(https://www.utoronto.ca/news/u-t-study-reveals-key-happy-sex-life). The pack
concludes "a product that sells compatibility manufactures destiny beliefs".
Nothing shows that taking a quiz shifts implicit theories; that is an invented
causal claim and the critique is right to flag it. It remains an excellent
design heuristic, and it should be labelled as one in the folder rather than
cited as a finding.

### What is rejected outright

- **A compatibility score, percentage, or verdict.** Any form.
- **Typology.** No erotic types, no blueprints, no "sexual love language".
  Erotic Blueprints is trademarked, has no published psychometrics of any kind,
  and is ipsative by construction — the objection already written into
  `love-languages/items.js`. A sexual type label is also something a partner can
  hold against a person for years.
- **The yes / no / ask-me-first activity inventory.** The pack proposes it as the
  safe alternative to a score. It is the highest-harm artefact in the whole
  design: an itemised written record of a named person's sexual interests, which
  is raw material for outing, blackmail, harassment, and custody and employment
  disputes, and which a public web page makes globally reachable including in
  jurisdictions that criminalise particular practices. Removing the score does
  not remove the harm — **the list is the harm**. Not stored, not shared, not
  exported. If some version of it ever ships it is a session-only on-screen
  checklist that is never written to storage and is destroyed on navigation, and
  the page says so before the first line.
- **Scored excitation/inhibition scales.** The dual-control model is the
  best-validated trait construct in sexology, which is a low bar; SIS2's internal
  consistency is mediocre in several samples, the three-factor structure
  replicates unevenly across translations, and there is essentially no evidence
  that the scores predict sexual satisfaction or relationship outcomes — which
  matters, because the pedigree is the entire argument for including it. The
  *content* is good ("worrying about how I'm doing takes me out of it") and
  belongs on a card. The two 1–100 axes do not.
- **Any diagnostic vocabulary.** Dysfunction, disorder, low libido, hypoactive,
  abnormal, deficient. DSM-5 requires distress plus roughly six months for
  HSDD/FSIAD, and distress or a non-consenting party for a paraphilic disorder
  (https://jaapl.org/content/42/2/191). We have neither the duration data nor the
  distress judgement, and the FDA general-wellness safe harbour — which names
  sexual function explicitly as a wellness category — evaporates the moment a
  disease claim appears
  (https://fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices).
- **A frequency benchmark.** Muise, Schimmack & Impett: n = 30,645, curvilinear,
  flattening at about once a week, and no association at all for single people
  (https://journals.sagepub.com/doi/abs/10.1177/1948550615616462). There is no
  target to point at.

### The gate

This platform has no accounts, no payment rail, no identity signal and no
server. It therefore has **no means of age assurance whatsoever**, and hiding an
instrument from the catalogue is obscurity, not a gate. The UK Online Safety Act
requires highly effective age assurance for content of a certain kind, several
US states require verification, and children's-code duties attach in EU locales
this app already ships in.

I am not qualified to decide whether a non-explicit instrument about
communication comfort and desire conditions falls inside those regimes; it
plausibly sits closer to relationship education than to the content those laws
target. **That question goes to counsel before items are written, not after.**
The fallback if the answer is unfavourable is simply not to ship this
instrument, and the rest of the roadmap does not depend on it.

### Shape

| | |
|---|---|
| **id** | `intimacy-conditions` |
| **family** | `questionnaire` (not profiler — see §8.3) |
| **items** | ~22 |
| **scale** | `agree5` for comfort items; `choice` for conditions and practices |
| **shuffle** | off — grouped by area, because the areas are the output |
| **pageSize** | 4 |
| **minutes** | 7 |
| **channels** | `affection`, `communication` |
| **maxAudience** | `friends` — `public` is not offerable (new manifest field, §10) |
| **persistence** | `ephemeral` (new manifest field, §10) |
| **compare** | yes, but card-only and double-opt-in |

The name matters. A folder called `intimacy-conditions` promises what it can
deliver; one called `sexual-compatibility` promises what nobody can.

### Dimensions

| Area | Items | Reported as |
|---|---|---|
| **Communication comfort** — saying what you want, saying what you don't, hearing a no, raising something afterwards. These dissociate and are asked separately | 6 (`agree5`) | Four cards, each a sentence the person could hand over. Low comfort is a skill state, never a defect, and never a score |
| **Desire conditions** — what has to be true first: unhurried time, privacy, no unfinished conflict, a particular kind of approach; and whether wanting tends to arrive before contact or during it | 6 (`choice`) | Condition cards only. Never a type. Basson's circular model made responsive desire legible, but the evidence says people alternate between patterns rather than belong to one (https://pubmed.ncbi.nlm.nih.gov/19686428/), and there is no validated instrument for it. Report the conditions, never the pathway as an identity |
| **Initiation and refusal practice** — how asking is done, how declining is done, what a decline is taken to mean | 5 (`choice`) | Descriptive cards. No style ranked above another. This converts cleanly into an instruction card in a way nothing else in the domain does: "ask me in words rather than starting" is usable |
| **Growth vs destiny beliefs** | 3 (`agree5`) | Not scored and not reported as a trait. Used to select which of two versions of the closing paragraph the page shows, and to let the page say "this is not a compatibility verdict" with something behind the sentence |
| **What has changed** — one item on whether any of this has shifted recently | 2 (`choice`) | A prompt, plus the routing to §7.2's standing support link |

**A health confound note the research pack omits entirely and the critique
catches:** SSRIs, hormonal contraception, menopause, chronic pain, sleep debt and
illness dominate variance in desire and arousal. A "conditions" profile that
never mentions them will silently attribute a drug effect to a context
preference. The instrument must not ask about medication — that is health data
we have no business collecting — but the result page must say plainly, once,
that these things move everything on this page and that a change worth
explaining is worth raising with a clinician rather than with a questionnaire.

### What `score()` returns

No scores. Identifiers, and the identifiers are message keys, which keeps
`score()` language-free as the contract requires.

```js
{
  v: 1,
  comfort:    { asking: 4, declining: 5, hearingNo: 2, raisingAfter: 2 },  // raw 1–5
  conditions: { pace: "unhurried", approach: "words", conflict: "blocks", privacy: "high" },
  practice:   { initiate: "either", decline: "plain", declineMeans: "tonightOnly" },
  beliefs:    "growth",                       // "growth" | "mixed" | "destiny"
  cards:      ["condition.pace.unhurried", "practice.decline.tonightOnly", …],
  answered: 20, total: 22,
}
```

`cards` is the shareable surface and nothing else is. Raw `comfort` responses
and `beliefs` stay on the device: they inform the reader's own page and are
never in a token, never in a comparison and never in a report.

### What the result page reports

A stack of cards, each a sentence a person could hand to a partner: *"I need to
feel unhurried — a deadline ends it for me."* *"Ask me in words rather than
starting."* *"A no from me means tonight and nothing more."* That is the same
instruction-card shape the app already produces for the `conflict` and
`affection` channels, and it is the only output in this domain that is both
defensible and useful.

Behind the cards, four `sourceNote` sentences, not one: what the construct is and
who proposed it; that no model of sexual response fits everyone and people
alternate between them; that a difference between two people is normal and is not
a diagnosis; and that this is not clinical assessment. The numerology folder
already does exactly this habit — this instrument needs a stronger version of it,
not a weaker one.

### What `compare()` does

Two columns of cards, side by side, and the overlap. That is all.

- **No gap metric, no compatibility figure, no ordering that implies one column
  is the standard.**
- **No desire discrepancy number, to either party.** The ESSM position statement
  treats discrepancy as normative, dyadic and often non-distressing, and warns
  explicitly against pathologising the lower-desire partner
  (https://www.sciencedirect.com/science/article/pii/S2050116120300337) — and it
  is expert consensus, not an evidence synthesis, which is how it should be
  labelled. The pack then proposes computing wanted-minus-current for each
  partner, which is the same difference score it forbids elsewhere. Two people at
  "wanted 4 / current 1" and "wanted 1 / current 1" produce a comparison whose
  meaning lives in the components, not the gap. And "the app says we're
  mismatched" is a sentence that will be used in an argument. It does not ship.
- **Double opt-in, revocable, expiring, card-only.** Each side initiates
  separately on their own device. Either can withdraw silently, and the other
  sees an indistinguishable "not available" state rather than "they revoked".
  The invitation never surfaces progress, completion or non-participation, and
  its copy says "you can ignore this" in the invitation itself. Double opt-in
  does not solve coercion — consent given while a partner is in the room is
  exactly the fact pattern WHO's guidance exists for
  (https://www.who.int/publications/i/item/WHO-FCH-GWH-01.1) — but it removes the
  mechanic where one person's request is itself the pressure and the result is
  the leverage.

---

## 3. The work instrument → `working-style` v2, not a new folder

### Verdict

The request is for one instrument covering "your talent, your natural way of
communicating and understanding the world, your mindset, and how to cooperate
with you". Four of those five things are already in the app: `riasec` covers
interests, `big-five` and `hexaco` cover disposition, `conflict-style` covers
what happens when it goes badly, `chronotype` covers when you are usable, and
`working-style` covers preferences. What is genuinely missing is a handful of
fields, and one framing decision.

**Do not build a new instrument.** Add five fields to `working-style`, bump it
to version 2, and add a work-shaped audience preset to the sharing page. That
is roughly a day of work and it produces the thing the requester actually wants:
one page a colleague can read.

### The framing decision

The research pack designs this instrument with "the stated reader is an
employer" and treats that as a constraint. It is the thing to refuse.

Once the reader is the employer, the sheet functions as a selection and
evaluation instrument. It then has no norms, no adverse-impact study and no
validation supporting that use; it acquires employment-discrimination exposure
wherever it touches hiring or promotion; NYC Local Law 144-style disclosure
regimes and the EU AI Act's Annex III classification of employment evaluation
tools as high-risk come into scope; and — by the pack's own faking analysis —
the answers are inflated in exactly the domains that matter, because the person
filling it in knows who reads it. The pack's regulatory treatment of the sexual
instrument is thorough and its treatment of the workplace instrument is absent,
which is backwards: employment is the higher-regulation context.

So:

> **The sheet is written by a person for a colleague, and must not be used in
> hiring, promotion, compensation, performance evaluation, discipline or
> termination.** That sentence goes in the product, in the export and on the
> sheet itself. There is no mechanic by which an employer can request or require
> one — sharing is person-initiated only, and there is no "ask a colleague for
> theirs" button. Before a first share, the app says plainly that stating your
> needs to a manager can be used against you, because it can.

### The five new fields

All `select`, all preferences, all unscored, all in the register `working-style`
already uses — "a fact about how you would like to be treated", not a
measurement.

| Field | Options | Why it earns a place |
|---|---|---|
| `brief` | headline-first / full context / written then talked | The operational residue of Kolb and HBDI once the discredited theory is stripped out. **Framed as a courtesy preference with no claimed benefit** — the critique is right that the evidence that kills the meshing hypothesis kills the implied payoff here too. Stating a format preference does not predict better outcomes from that format. It tells a colleague how to prepare before walking over; that is all it claims |
| `prep` | document 24h ahead / agenda ahead / happy to go in cold | Same register. Directly actionable, entirely unfalsifiable as a preference, which is the point |
| `evidence` | a number / a worked example / a user saying it / someone I trust disagreeing | "What changes my mind" is the single most useful unguessable fact on a work sheet, and it is a preference rather than a claim about cognition |
| `repair` | finish it now / give me an hour / tell me explicitly we're fine | The gap `conflict-style` leaves. Every framework describes how someone behaves in conflict; almost none say what to do afterwards, which is the part a coworker needs |
| `dissent` | in the meeting / in writing afterwards / 1:1 first | Where an objection should be raised. Pairs with `feedback`, which already exists |

`working-style`'s `score()` already falls back to the default option for any
field it does not find, so a version-2 run of an existing version-1 answer set
degrades gracefully rather than throwing. The bump marks existing runs stale;
at two minutes to retake, that is the cheapest version bump in the app.

`channels` gains `conflict` for the `repair` card.

### What is rejected, and why

| Proposed | Verdict | Reason |
|---|---|---|
| **TREO six team roles** (Organizer, Doer, Challenger, Innovator, Team Builder, Connector) as the backbone | **No** | Three independent reasons. Legally: TREO appears in the research pack only inside a dimension, never in the sources list — no licence field, no usable flag, no vetting. It is a journal-published instrument whose items carry publisher copyright like every other journal scale the pack correctly refuses, and the six-name taxonomy plus its construct definitions reproduced together is closer to protectable selection-and-arrangement than any single label. Empirically: it is essentially one group's instrument, validated largely on student teams, and the headline criterion — peers rating the same behaviours the self-report describes — is criterion contamination through shared construct and method. There is no evidence it predicts team or job performance, which is exactly what an employer reading the sheet would assume. Productively: six named roles on a work sheet is a typology with the serial numbers filed off, and this app rejects typology |
| **A psychological-safety threshold dimension** | **No** | The pack calls Project Aristotle "the most robust finding in the team-effectiveness literature". It is an unpublished internal Google analysis with no methods, no sample, no measures and no peer review — precisely the consultancy folklore this codebase exists to avoid. The peer-reviewed base is Edmondson (1999) and the Frazier et al. (2017) meta-analysis, where the corrected relationship with team performance is around ρ ≈ .18–.20: real, modest, nothing like dominant. And psychological safety is defined and validated as a **shared team-level climate construct** requiring aggregation with justification. An individual's "threshold for speaking up" is a different, unvalidated construct with no evidence behind it |
| **An observer / 360 form and a self-other gap** | **No** | The pack calls it "the only mechanism that can move any of this toward what is true". Connelly & Ones is solid on incremental validity, but the conditions are omitted: the advantage is largest for well-acquainted raters, and here the raters are non-anonymous colleagues rating someone who will read the result — the condition that maximises leniency and politics. The larger omission is the outcome literature: Smither, London & Reilly's meta-analysis found small average improvement (ρ ≈ .12), and Kluger & DeNisi found roughly a third of feedback interventions *reduced* performance, with self-other discrepancy feedback among the riskier forms. A feature that makes a third of its users worse is not a feature |
| **Self-rated ability sliders** ("I am good at X", 1–100) | **No** | Self-rated ability correlates about r = .29 with objective performance (Zell & Krizan's metasynthesis). A 1–100 on a competence claim is the single most misleading thing this platform could emit. Preferences can be scored; competence cannot, not from the inside |
| **Strengths as claims with evidence** | **Yes, narrowly** | One `text` field: name something you were the reason went well, and what you specifically did. Labelled on the card as a **claim**, not a measurement. Forcing an instance converts an unverifiable trait rating into a checkable assertion, and it is hard to invent a receipt. **No field may name another person** — a corroborator's name is a third party's personal data collected without their knowledge |
| **Load, drain and recovery** | **Reframe or drop** | As specified ("what depletes you", "what you look like when depleted", "what you need to recover") these elicit health information: likely disability-related inquiry when an employer is in the loop, and GDPR Article 9 health data regardless. The pack flags Article 9 for the sexual instrument and misses it here. What survives is working conditions in the `working-style` register — "three back-to-back meetings means I schedule nothing after", "I do my best writing in a two-hour uninterrupted block". No symptom-shaped item survives |
| **A mindset scale** | **No** | Nothing in the research pack supports one. The only implicit-theory construct with evidence in the pack is the sexual growth/destiny distinction, which is domain-specific and does not generalise to work by assertion. Building a mindset scale would mean sourcing a literature nobody has reviewed, and the honest answer to "can you measure my mindset" is that we have not looked |

### What `compare()` does

`working-style` already has the right `compare()`, and the memo's only
recommendation is to keep its discipline as fields are added: it reports the
specific collisions in order — one wants a week's notice, the other tells you
the same day — and refuses to compute an overall similarity figure. The
disagreement is the finding. The average is nothing.

---

## 4. Learning styles → rejected; build `study-practice` instead

### Verdict

**Do not build it.** Not in a reduced form, not with a caveat, not as "how I
take in information" with the four labels still attached.

The visual / auditory / reading-writing / kinaesthetic model asks the reader to
accept the meshing hypothesis — that instruction matched to a style produces
better learning. Pashler, McDaniel, Rohrer & Bjork's review concluded there is
no adequate evidence base for style-matched instruction, and Coffield et al.'s
review of thirteen learning-style models found most lacked adequate test-retest
reliability and internal consistency. VARK itself is a licensed commercial
instrument. The research pack contains **no findings object for learning styles
at all** — three of four commissioned domains were researched — while the
workplace section's own pitfall list says shipping learning styles is
disqualifying. That contradiction is the strongest possible signal: the
instrument as briefed is one the project's own research says must not exist.

Two further reasons specific to this codebase. A four-way style assignment is
ipsative in exactly the way `love-languages/items.js` and `enneagram/items.js`
already argue against. And a learning style is a fixed-identity label about
capability, which is the category of claim §0.1 says self-report cannot make.

### The substitute

The evidence-backed version of this request is not about how you *are*; it is
about what you *do*. Dunlosky, Rawson, Marsh, Nathan & Willingham (2013),
*Improving Students' Learning With Effective Learning Techniques*, Psychological
Science in the Public Interest 14(1), rated **distributed practice** and
**retrieval practice** as high utility and **rereading**, **highlighting** and
**summarisation** as low utility; Rohrer & Pashler's work on interleaving adds a
third technique with support. Neither reference appears in the research pack's
vetted source list, so both need the same licence-and-provenance pass as
everything else in §6 before an item is written. Their items are not needed —
the constructs are behaviours with plain names.

| | |
|---|---|
| **id** | `study-practice` |
| **family** | `profiler` |
| **fields** | ~10 (`select` and `multi`) |
| **minutes** | 3 |
| **channels** | `work` |
| **compare** | optional, low value — two people's study habits do not collide |

Fields ask frequency of use for six named techniques (retrieval practice,
spaced review, interleaving, elaborative interrogation, rereading,
highlighting), plus where studying happens, plus what the person does when they
get something wrong.

```js
{
  v: 1,
  uses: { retrieval: "sometimes", spacing: "never", interleaving: "never",
          elaboration: "often", rereading: "always", highlighting: "always" },
  repertoire: 2,          // count of high-utility techniques used at least "sometimes"
  leaning: "restudy",     // "restudy" | "mixed" | "retrieval"
}
```

The result page reports what you currently do, and — separately and clearly
labelled as advice rather than measurement — which of the techniques with the
best evidence are absent from your repertoire. `repertoire` is a **count of
behaviours**, which is the one honest breadth reading in this memo (see §5.2).
No type, no label, no score.

**Product honesty:** this is the weakest product fit of the four. This app
exists to produce a page you hand to someone, and study habits are self-directed.
`study-practice` is the only instrument here whose output the reader mostly keeps.
It earns its place because it is the only version of the request that is true, and
because the marginal cost is one profiler folder.

---

## 5. Preference, breadth, and level — the three readings

The author asked that each instrument let a person understand *either* what
specific thing they like or are best at, *or* the range of their interest, *or*
how developed they are in an area. These are three different claims with three
different evidentiary costs, and one of them cannot be paid.

### 5.1 Preference — "what I like"

**Self-report is the correct method, and it is the only reading in this list
that is true by construction.** There is no external criterion for how much
notice you want before a plan changes, so your answer is definitionally the
truth. This is why `working-style` is the most defensible folder in the app.

- **What scoring needs:** nothing. Record the choice; report it back arranged.
  Where a preference is asked as Likert across several items, scales must be
  **normative** so all of them can be high — the house rule already, and the
  reason `love-languages` is not Chapman's quiz.
- **What the app needs:** nothing new, except discipline about the boundary.

The trap is the second half of the author's phrasing: "what I like **or am best
at**". Those are not the same reading. Liking is a preference; being best at
something is a competence claim, and self-rated ability correlates about r = .29
with measured performance. **A preference item's output must never be rendered
in a way that reads as competence.** This is what the epistemic tier in §10
enforces.

### 5.2 Breadth — "the range of my interest"

This is a dispersion reading, and `src/core/scoring.js` already computes it two
ways: `range` (max − min, the blunt one) and `evenness` (normalised entropy of
the shares, which distinguishes 90/50/50/50/10 from 90/80/50/20/10). `riasec`'s
hexagon consistency is the existing precedent.

- **What scoring needs:** all scales normative (so breadth is not an artefact of
  a constant sum), and scales of comparable length and comparable item
  difficulty — otherwise "evenness" partly reflects how many items each scale
  got.
- **What the app needs:** a stated **frame**, and this is the honest limit.
  Without norms, breadth can only ever mean *broad relative to your own other
  scales*. It can never mean *broader than most people*, because we have no
  population to compare against and no plan to collect one. Every breadth
  sentence in every locale must carry that frame, and `dispersion()`'s
  `concentrated` threshold (range ≥ 15) is a floor below which the ordering is
  mostly noise and should not be printed at all.

A genuinely clean breadth reading is a **count of behaviours**, not a spread of
scores: `study-practice`'s `repertoire` is a count of techniques the person says
they use, and a count needs no norms and no invariance. Where a breadth reading
is wanted, prefer a count.

Note what this rules out for two of the four instruments. "How many topics you
have actually settled" is a legitimate count in `couple-conversations` and is
worth reporting. "How many conditions you need" in `intimacy-conditions` is
**not** breadth — it is specificity, it has an obvious better-and-worse reading
attached, and it does not ship.

### 5.3 Developmental level — "how developed I am"

**Self-report cannot support this claim, and no amount of item writing changes
that.**

The two serious traditions of measuring developmental level — Kegan's
subject-object interview and the Loevinger / Cook-Greuter sentence completion
test — both require trained expert coders working from narrative, *precisely
because* a person's level of development is not visible from inside it. A
questionnaire asking "how developed are you" measures how developed you believe
you are, which is a different variable with a well-known ceiling (r ≈ .29 against
objective performance). Attempting it is the fastest way to make an instrument
indefensible.

Three substitutes are honest, and each says something narrower than the request:

1. **Behaviour frequency.** "How often do you currently do X" is a claim about
   practice, checkable in principle, and it is what `study-practice` reports.
2. **Practice versus evidence.** Comparing what someone does against techniques
   with published support is *advice*, not measurement, and must be labelled as
   advice.
3. **Change in self-report over time.** Re-taking the same instrument shows
   movement in a self-report, and the copy must say exactly that: an increase in
   a self-report score is an increase in a self-report score. This is the only
   one of the three that needs a platform change — `mi:1:run:<id>` holds one run
   per instrument, so a history reading needs a new key shape (§10).

> The sentence to put in the product, once, in all four locales: **this app can
> tell you what you prefer and what you do; it cannot tell you how good you are
> at anything, and it will not pretend to.**

### 5.4 Which reading each instrument supports

| Instrument | Preference | Breadth | Level |
|---|---|---|---|
| `couple-conversations` | Yes — positions, recorded and reported | A count only: how many topics you have actually decided | No |
| `intimacy-conditions` | Yes — conditions and requests, the whole output | No. "Number of conditions" has a better/worse reading and does not ship | No |
| `working-style` v2 | Yes — the entire instrument | No. Thirteen unrelated preferences have no meaningful spread | No |
| `study-practice` | Yes — what you do | Yes — `repertoire`, a count of behaviours | Closest legitimate approach: current practice against evidence-backed practice, labelled as advice |

---

## 6. Licensing

The house position is already correct and does not need changing: the framework
may be public while the questionnaire is copyrighted, so items are always
written fresh. Four things do need changing, and they are all consequences of
this batch being larger and more commercially exposed than the last.

### 6.1 Four standing rules

**1. Clean-room, and the word "paraphrase" is banned.** The research pack says
"write your own items against the public construct" three times and
"paraphrase", "replicate the wording" or "copy the format" at least twice. Those
are different operations and the difference is the entire legal question: a
paraphrase of a copyrighted item is a derivative work, not an escape from one.
The process is: an author writes from a **construct definition** — one or two
sentences describing what the scale measures — and never sees the source
instrument's items; a second person who has seen the source reviews only for
construct coverage, never for wording.

**Every sample item in the research pack is contaminated and unshippable.** They
were written by someone who had just read the source scales, and at least one
(the idealisation guard's "my partner has never done anything that annoyed me")
tracks Edmonds' Marital Conventionalization content closely enough that a claim
would not be frivolous. Regenerate all of them.

**2. Provenance is a file, and the contract test enforces it.** Each instrument
folder gains `provenance.js` beside `items.js`: per item, the author, the date,
the construct definition used, and the sources consulted. `test/instruments/
contract.test.js` already loops the registry — extend it so an item with no
provenance entry fails the suite, and extend `tools/build.mjs` so a folder with
no provenance file cannot be inlined.

**3. Split the licence.** `package.json` declares MIT and there is no `LICENSE`
file. MIT on this repo purports to grant every visitor the right to copy and
redistribute the item text — so a single licensing error would not merely
infringe, it would sublicense someone else's property to an unbounded number of
forks, and `dist/my-instructions.html` is a single self-contained file with no
CDN to pull and no version to yank. Add a `LICENSE` that splits the terms: **code
under MIT, item banks and locale strings all rights reserved**, mirrored in
`package.json` and the README provenance table, with a named operator and a
takedown contact.

**4. "Free for research" and "free for clinical use" and "CC BY-NC" all mean
no.** One written policy, so no future contributor re-litigates it per source. A
public consumer web app with a sharing feature is neither research nor clinical
use, and the roadmap adds accounts and sync — a free front end to a product with
a commercial roadmap is not safely non-commercial.

### 6.2 Every source, and what we do with it

Premarital:

| Source | Licence | Usable | What we do |
|---|---|---|---|
| PREPARE/ENRICH Scientific Foundation (https://www.prepare-enrich.com/wp-content/uploads/2020/12/Scientific_Foundation.pdf) | Commercial, facilitator-gated | No | Read for scale structure and alphas. Never name it as lineage. Never emit anything resembling "Positive Couple Agreement" |
| Fowers & Olson 1986 (https://www.prepare-enrich.com/wp-content/uploads/2020/12/Fowers-Olson-1986-Predicting-Marital-Success-With-PREPARE.pdf) | Paper, findings citable | Yes | Cite the Children & Parenting failure. Never cite the 80–85% accuracy figure |
| Larsen & Olson 1989 replication | Paper, findings citable | Yes | Cite the two failing scales. Note it is author-conducted, like every predictive study of this instrument |
| FOCCUS (https://foccusinventory.com/foccus-inventory.aspx) | Commercial, facilitator-only | No | Take the *idea* that "uncertain" is its own state. **Do not** take the 19-category taxonomy, the response set and the agreement-percentage formula together — that combination starts to reproduce protectable selection and arrangement. Derive our five topics from the peer-reviewed predictor literature, and be able to show the derivation |
| Williams & Jurich 1995 (https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1752-0606.1995.tb00149.x) | Paper | Yes | Cite the marriage-covenant scale failure |
| RELATE / Busby, Holman & Taniguchi 2001 (https://onlinelibrary.wiley.com/doi/10.1111/j.1741-3729.2001.00308.x) | Unclear, not open for commercial reuse | No | Structure only |
| Busby & Holman 2009 (https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1545-5300.2009.01300.x) | Paper | Yes | Cite, downgraded: concurrent self-report outcomes, not divorce |
| Joel et al. 2020 (https://www.pnas.org/doi/10.1073/pnas.1917036117) | Open access | Yes | The architecture citation: ask about *this relationship*, not about the person |
| Sillars et al. 1994 (https://journals.sagepub.com/doi/10.1177/0265407594114008) | Paper | Yes | Cite as a caution against agreement scores, not as a mandate for accuracy scores |
| Montoya et al. 2008 (http://persweb.wabash.edu/facstaff/hortonr/pubs/Montoya,%20Horton,%20&%20Kirchner,%202008,%20JSPR%20similarity%20effect%20meta%20analysis.pdf) | Free author PDF | Yes | Cite narrowly: trait/attitude similarity indices do not predict in established couples. It does **not** license the claim that concrete goal discordance is non-predictive — the pack contradicts itself on this two dimensions later |
| Dew, Britt & Huston 2012 (https://scholarsarchive.byu.edu/facpub/4526/) | Open institutional copy | Yes | Cite for "disagreements matter", not for "the balance sheet doesn't" |
| Garbinsky et al. 2020 (https://academic.oup.com/jcr/article/47/1/1/5610529) | Journal copyright | Findings only | Use the two-component construct definition. **Do not paraphrase the FI-Scale items** |
| Klontz KMSI-R (https://journals.newprairiepress.org/jft/article/id/5721/) | CC BY-NC | No | Non-commercial, and a 2025 evaluation found the four-factor model's fit poor (https://link.springer.com/article/10.1007/s10834-025-10055-7). Not used at all |
| Heyman & Slep 2001 (https://pubmed.ncbi.nlm.nih.gov/17066126/) | Paper | Yes | Governs the copy on all four instruments |
| Gottman Institute (https://www.gottman.com/blog/managing-conflict-solvable-vs-perpetual-problems/, https://www.johngottman.net/wp-content/uploads/2011/05/Empirical-Basis-for-Gottman-Method-Therapy-May2013.pdf) | Commercial, clinician-gated | No | Concepts are describable; questionnaires are not reproducible. We repeat neither the accuracy figures nor "contempt is the strongest predictor" |
| Birditt et al. 2010 (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3777640/) | Free full text | Yes | The primary conflict citation — independent, prospective, dyadic |
| Stanley, Rhoades & Markman 2006 (https://onlinelibrary.wiley.com/doi/10.1111/j.1741-3729.2006.00418.x) | Paper | Yes | Cite as a frame, with the single-lab provenance and the weakened cohabitation literature named |
| Baxter & Wilmot 1985 (https://journals.sagepub.com/doi/10.1177/0265407585023002); Caughlin & Afifi 2004 (https://onlinelibrary.wiley.com/doi/10.1111/j.1468-2958.2004.tb00742.x) | Papers | Yes | The warrant for asking *why* a topic is unaddressed, not only whether |
| Mahoney et al. (https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1741-3737.2010.00732.x) | Scales "free for research" via BGSU | **No** | "Free for research" is a scope limit, not a price. Construct only |
| Olson Circumplex / FACES (https://www.uwagec.org/eruralfamilies/ERFLibrary/Readings/CircumplexModelOfMaritalAndFamilySystems.pdf) | Commercial | No | And do not implement a curvilinear "too close / too rigid" rule — it is genuinely contested |
| Rogge lab: CSI, PN-RQ, ARS, DQS (https://couples-research.com/measures/) | "Free for clinical and research use" | **No — flipped from the pack's `usable: true`** | A public consumer app is neither. The CSI sits under APA journal copyright whatever the lab page says. This is the single most likely place items actually get lifted, because it is the only source the pack presented as safe. Write original careless-responding items; `straightlining()` already exists |
| SYMBIS (https://www.symbis.com/) | Commercial | No | No independent peer-reviewed validation is findable. Not a source for construct structure |
| Carroll & Doherty 2003 (https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1741-3729.2003.00105.x) | Paper | Yes | Cite **with** the null federal RCTs (Building Strong Families; Supporting Healthy Marriage) attached, or the caveat is itself an overclaim |
| IPIP (https://ipip.ori.org) | Public domain, commercial use permitted | Yes | Already used. Relevant here only as a reminder that individual-difference content should stay small and public-domain |

Intimacy — every named instrument in this domain is author-permission or
commercial. There is no IPIP for sexuality, so the house pattern is not one
option among several; it is the only option.

| Source | Licence | Usable | What we do |
|---|---|---|---|
| SIS/SES and SIS/SES-SF (https://pubmed.ncbi.nlm.nih.gov/19308839/, CFA: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8416846/, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5846736/) | Unclear; author permission by convention | No | Construct informs card content. No scored scales, so the pedigree argument is moot |
| SESII-W/M | Unclear | No | Preferred conceptually for being gender-neutral. Structure only |
| SDI / SDI-2 (https://pubmed.ncbi.nlm.nih.gov/26756821/) | Journal copyright | No | Copies circulating on clinical-form sites are not a licence |
| NSSS / NSSS-S (https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0330353) | Unclear | No | Five-dimension framing only |
| GMSEX / IEMSS (https://files.eric.ed.gov/fulltext/EJ590818.pdf) | Journal copyright | No | The IEMSS *theory* — satisfaction as rewards minus costs against a comparison level, plus perceived equality of exchange — is the best available frame, because it centres negotiation rather than trait matching |
| FSFI (https://labs.la.utexas.edu/mestonlab/files/2014/10/2000-Rosen-Brown-Heimen-et-al.pdf) | Free non-commercial; commercial requires permission | No | And wrong regardless of licence: it is a dysfunction measure with clinical cut-offs. Shipping it manufactures diagnoses |
| IIEF (https://eprovide.mapi-trust.org/instruments/international-index-of-erectile-function) | Licence-gated via Mapi/ePROVIDE | No | Same objection. Note FSFI and IIEF have active licensing bodies, so exposure there is a fee claim plus damages — a different risk class from a takedown |
| Dyadic Sexual Communication Scale (Catania 1986) | Copyright; reproduced by permission in the Handbook | No | The Handbook is worth owning for construct definitions and is not a licence to us |
| Sexual Communication Self-Efficacy Scale (https://emerge.ucsd.edu/r_2srzwwdx5benykl/) | Journal copyright | No | Borrow one finding: positive-message and negative-message self-efficacy split |
| Sexual Consent Scale–Revised (https://pubmed.ncbi.nlm.nih.gov/19685367/) | Journal copyright | **No, and never adapted** | A low consent-attitude score shown to a user is an accusation; shown to a partner it is ammunition |
| Maxwell, Muise et al. 2017 (https://www.utoronto.ca/news/u-t-study-reveals-key-happy-sex-life, https://pubmed.ncbi.nlm.nih.gov/33656409/, https://www.amymuise.com/s/Uppot-et-al-2023.pdf) | Journal copyright; construct public | Findings only | Growth/destiny distinction, used as a design heuristic and labelled as one |
| Erotic Blueprints (Jaiya) | Commercial and trademarked | **No** | No peer-reviewed validation exists, and ipsative by construction. Do not implement, do not name the marks, do not build a compatibility matrix from it |
| Joel, Eastwick & Finkel 2017 (https://journals.sagepub.com/doi/abs/10.1177/0956797617714580) | Paper | Yes | Cite within its design: first-encounter desire is unpredictable |
| Mallory et al. 2022 (https://pubmed.ncbi.nlm.nih.gov/34968095/) | Paper | Yes | The content justification, stated as an association |
| ESSM position statement (https://www.sciencedirect.com/science/article/pii/S2050116120300337) | Open access | Yes | Label as expert consensus, not evidence synthesis |
| Basson; Giles & McCabe 2009 (https://pubmed.ncbi.nlm.nih.gov/19686428/); Brotto & Graham (https://med-fom-brotto.sites.olt.ubc.ca/files/2022/01/Brotto-and-Graham-2021-JSMT-1.pdf) | Journal copyright | Findings only | Report conditions, never a pathway as a type |
| Nagoski, *Come As You Are* | Commercial book | No | Do not print the "75% / 30%" figures — they are secondary and approximate, and the author states there is no validated instrument for responsive desire |
| Muise, Schimmack & Impett 2016 (https://journals.sagepub.com/doi/abs/10.1177/1948550615616462) | Paper | Yes | The reason no frequency target appears anywhere |
| DSM-5 paraphilia distinction (https://jaapl.org/content/42/2/191) | APA copyright | Findings only | The rule that keeps an interest from becoming a pathology |

Workplace and learning:

| Source | Licence | Usable | What we do |
|---|---|---|---|
| TREO (Mathieu et al. 2015) | **Unvetted** — no licence field anywhere in the research pack | **No** | Vet it exactly as PREPARE was vetted; write to the authors for written commercial permission. Until that exists: no items, no six role names as scale labels, no citing it as this app's validation |
| Belbin Team Role Self-Perception Inventory | Commercial, trademarked | No | The rights-holder's "450+ successful infringement actions" figure is vendor marketing carried into a risk register as legal fact — strike the number, keep the conclusion. And note the pack's "naming the theme set is enough to infringe" is a legal overstatement: nominative reference in a descriptive or comparative context is generally permissible. The real exposures are copyright in items and text, and implying affiliation. Confine trademark mentions to accurate negative nominative use in a provenance table ("Belbin — not used, items original"), never in a `sourceNote`, tagline or result screen |
| CliftonStrengths | Commercial; 34 theme names trademarked; product terms forbid building platforms on the framework | No | Not used. The strengths-use meta-analytic figures (ρ ≈ .42 performance, ρ ≈ .62 wellbeing) are self-report on both sides with probable item overlap — a ρ of .62 for a wellbeing correlate should trigger suspicion on sight, and much of the evidence base is vendor-internal with unavailable data |
| MBTI, HBDI, Kolb LSI, Honey & Mumford LSQ, DiSC, VARK | Commercial | No | Already covered by `docs/candidate-instruments.md` for MBTI and DiSC. Same treatment |
| Pashler, McDaniel, Rohrer & Bjork; Coffield et al. | Papers | Yes | The basis for rejecting learning styles outright |
| Dunlosky et al. 2013; Rohrer & Pashler | Papers, **not in the vetted list** | Findings, pending vetting | The basis for `study-practice`. Vet before writing items |
| Zell & Krizan; Connelly & Ones; Birkeland et al.; Sackett et al.; Kluger & DeNisi; Smither, London & Reilly; Frazier et al.; Edmondson 1999; Griffin, Murray & Gonzalez 1999; Cronbach 1955; Ones, Viswesvaran & Reiss | Papers | Findings citable | All named by the critiques rather than the research pack. Each needs a source-line with a URL before it appears in a `sourceNote` — this memo cites them by name only, on purpose |
| Project Aristotle | Unpublished internal analysis | **No** | Not a citation. If psychological safety is ever discussed in copy, the citation is Edmondson and Frazier et al |

---

## 7. Ethics and sharing defaults

### 7.1 Two-tier items

The single most load-bearing platform change in this memo. Some items must be
answerable without ever becoming visible to anyone.

Add `tier: "private"` to the item shape. A private-tier item is answered,
contributes to the reader's own page, and:

- never appears in `instructions()` output,
- never enters `compare()`,
- is **excluded from `orderOf()` in `src/core/report.js`**, so it cannot be
  packed into a token even by accident,
- is excluded from `src/core/share.js`'s `encode()` for the same reason.

The exclusion must be structural, not a rendering convention, for exactly the
reason `report.js` already documents about audiences: withheld content has to be
*absent from the link* rather than hidden by whatever renders it. A test asserts
that no private-tier item id can appear in any token any code path can produce.

The tier assignment is disclosed to the reader **before they answer**, in the
form: these answers are yours alone, these are the ones a comparison would show.

Private-tier items in this batch: `couple-conversations` money concealment and
the conflict item touching fear; `intimacy-conditions` comfort responses and
beliefs (only the composed cards are shareable).

### 7.2 The intimacy instrument

Everything here is a requirement, not a preference.

| Requirement | Detail |
|---|---|
| **Default visibility** | `private`. **`public` is not offerable at all** — a new `maxAudience: "friends"` manifest field, enforced in `sharing.js` and `report.js`, where `friends` means one named person and is revocable |
| **No raw-answer token, ever** | The generic mechanism base64url-encodes raw answers into a permanent link. Base64 is not encryption. That link cannot be revoked, cannot expire, is not scoped to a recipient, and anyone who ever holds it — an ex-partner, whoever finds it in a shared browser history — can decode the full answer set forever. This instrument does not use `share.link()` at all; a test asserts it cannot |
| **Ephemeral persistence** | A `persistence: "ephemeral"` manifest flag the runner honours by keeping state in memory only. `runner.js` currently writes `mi:1:draft:<id>` on every answer and `store.js` persists runs in plaintext — and the *key name* is itself the disclosure. Someone on a shared device who opens devtools and sees `mi:1:run:intimacy-conditions` has learned something even if the value was cleared, and `store.list()` enumerates by prefix. If anything is written at all it uses a non-descriptive key, and the catalogue's completion pill must not render for it |
| **Quick exit** | A control that replaces the page immediately, clears memory and any key, and uses `location.replace` so the history entry is overwritten rather than appended. Roughly twenty lines and the highest-value safety feature available |
| **Every item skippable** | WHO's rule: never require an answer, never block progression. The runner currently disables Next until the page is complete — that needs an `optional: true` form flag |
| **A persistent, unconditional support link** | On every page of the instrument, worded quietly, identical whether or not any answer triggered anything, so that reading it is never evidence of having answered a particular way. Selected by the already-chosen **UI locale**, never by geolocation or IP — which would add a tracking surface to the one page that must have none. This needs a named owner, a review cadence, and a build-time reachability check that fails the build on a dead link, because a stale crisis resource is a harm in itself |
| **No flagging, no scoring of distress** | Do not tell a person what their answers "suggest". A modal saying "this looks like abuse" can escalate danger if a partner is watching the screen |
| **Article 9** | Data concerning sex life is prohibited from processing unless an Article 9(2) condition applies, *in addition to* an Article 6 basis; legitimate interest does not cover it (https://gdpr-info.eu/art-9-gdpr/). For a consumer app the only realistic condition is explicit consent, which must be separate, specific, granular, and as easy to withdraw as to give (https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/consent/what-is-valid-consent/). The planned `RemoteAdapter` **may not sync this instrument** without its own consent flow and a deletion path that actually deletes |
| **No third-party anything** | No analytics, no error reporting, no fonts or assets fetched from another host on any page of this instrument. The app already has none, which is the fact that currently saves it. The FTC pattern in BetterHelp (https://www.ftc.gov/news-events/news/press-releases/2023/07/ftc-gives-final-approval-order-banning-betterhelp-sharing-sensitive-health-data-advertising) and GoodRx (https://www.ftc.gov/news-events/news/press-releases/2023/02/ftc-enforcement-action-bar-goodrx-sharing-consumers-sensitive-health-info-advertising) is that a pixel on the page where sensitive answers are typed **is** the violation, independent of intent |
| **Keep the fragment a fragment** | Answers live after `#`, so a static host's access logs never see them. The token is formatted to look like a query string, and one refactor — a path segment, server rendering, `RemoteAdapter` — would begin shipping special-category data to a third party's logs with no lawful basis. Add a regression test asserting the token never appears outside the fragment, and a comment in `share.js` recording why |

Two counterweights so this does not become paralysis. Yeater et al. found
participants completing trauma and sex surveys reported *higher* positive affect
and greater perceived benefit than those completing cognitive measures, with
short-lived distress where it occurred, and a 2026 replication agrees
(https://pmc.ncbi.nlm.nih.gov/articles/PMC12858655/). Asking carefully is not the
harm. Asking carelessly, storing carelessly and interpreting carelessly are. And
SAMHSA's six principles — safety, trustworthiness and transparency, peer support,
collaboration, empowerment and voice, cultural humility — are directly
implementable as UI requirements: skippable items, a visible "why we ask", no
forced progression, no dark patterns on consent
(https://library.samhsa.gov/product/samhsas-concept-trauma-and-guidance-trauma-informed-approach/sma14-4884).

### 7.3 The couple instrument

The pack applies WHO safety guidance to the sexual instrument only. It applies
here at least as strongly: a meaningful fraction of people taking a premarital
assessment are in financially or emotionally controlling relationships, and the
money and conflict items are *by design* sensitive to exactly that.

- **Two-tier items**, as §7.1, disclosed before answering.
- **No scripted confrontation prompts.** Handing someone a line to say to a
  partner who controls the money is not neutral. Opening lines are phrased so
  either person could say them, and topics routed through private-tier items
  produce no opening line at all.
- **Independent completion.** The comparison unlocks only when both have
  completed on their own devices. The first screen says "answer this on your
  own". No progress, completion or reminder signal is ever surfaced to the other
  partner, and there is no mechanic by which one partner can see that the other
  declined. The pack frames isolation as a validity requirement; framing it that
  way means it will be traded away for conversion. It is a safety requirement.
- **A no-questions-asked discard** that leaves no trace the run happened.
- **Symmetric, pair-level framing of every calibration finding**, per §1. Test
  the locale strings for second-person-singular blame constructions.
- **Expiring, revocable, card-only comparison tokens.** No raw-answer token for
  anything in the couple or intimacy family — the property that makes the
  generic token durable across versions is the property that makes it a
  permanent plaintext record of one person's positions on money, sex, children
  and religion, held by someone who may become an ex-partner. The share screen
  says plainly, not in a footer, that anything already shared cannot be recalled
  and that clearing local storage does not delete it.
- **The same persistent, unconditional support link** as the intimacy
  instrument.

### 7.4 The work instrument

- Default `private`; `friends` and `public` both offerable, because this is the
  one instrument here whose whole purpose is being handed over.
- The ban on employment-decision use in the product, the export and the sheet.
- Person-initiated sharing only. No request mechanic.
- A one-time warning before the first share.
- No symptom-shaped items, no health inferences, no third-party names in free
  text.

### 7.5 Defaults at a glance

| Instrument | Default | Offerable | Token contents | Comparison |
|---|---|---|---|---|
| `couple-conversations` | `private` | `private`, `friends` | Shared-tier answers only; expiring | Double opt-in, both complete independently, revocable |
| `intimacy-conditions` | `private` | `private`, `friends` | Composed cards only, never answers | Double opt-in, revocable silently, card-only |
| `working-style` v2 | `private` | all three | Answers (as today) | Existing `compare()` |
| `study-practice` | `private` | all three | Answers | Optional, low value |

---

## 8. The answering experience

### 8.1 What the shell already gets right

`runner.js` pages five items at a time on purpose — "a forty-item page invites
pattern-answering down the column" — shuffles once with a seed persisted in the
draft so leaving and returning does not re-deal the deck, saves a draft on every
answer, and accepts number keys for fast entry. Those are the right defaults and
none of them needs changing. What changes is that two of these instruments need
to *opt out* of the shuffle, and all of them need to opt out of the requirement
to answer.

### 8.2 Keeping a questionnaire about someone's marriage bearable

The author's phrasing was "a forty-item questionnaire about someone's marriage".
The first answer is: **it isn't forty items, it's twenty-eight**, and the
reason is not kindness. In a bank with no norms and no validated factor
structure, the marginal information of item 31 is close to zero while its
marginal cost in attention is the same as item 3. Length in this app buys
reliability we cannot verify, and pays for it in careless responding we can
detect but not repair.

Seven concrete things make the remaining twenty-eight bearable:

1. **Topic-aligned pages, not shuffled ones.** Five items per page, one topic
   per page, with the topic named at the top and one sentence saying what it is
   for. Six pages, each of which feels like a subject rather than a slog.
2. **Discussion status first within each topic.** A cheap, factual, low-stakes
   question opens every page; the harder position items follow. Starting with
   "have you two talked about this?" is a warm-up that happens to also be the
   most important variable.
3. **The easiest topic first.** Roles and lifestyle, then money, then conflict,
   then children, then religion. The form order and the report order are
   different problems solved differently: the form escalates, the report leads
   with what they could not have learned alone.
4. **Alternate the item format.** Three `agree5` items, one `choice`, one
   `choice`. A change of control breaks the down-the-column rhythm more
   effectively than any amount of wording variation.
5. **Concrete beats general.** "When we last argued about something that
   mattered…" is answerable; "in general, I tend to…" invites a self-concept
   rather than a memory, and self-concepts are where idealisation lives.
6. **Name the sitting boundary.** The draft already persists; the page after
   topic three says so — "you're past halfway, and this will still be here
   tomorrow". A questionnaire people are allowed to leave is one they finish.
7. **No mid-run feedback.** Nothing partial is shown before the end. Anchoring
   is not a UX nicety here; a person who sees a partial reading answers the rest
   of the instrument differently.

And one thing to *not* do: no gamification, no streaks, no percentage-complete
celebration. The register of this instrument is a serious conversation, and the
copy should read as though someone thoughtful wrote it rather than as though a
funnel needed optimising.

### 8.3 Two runner changes these instruments need

**Optional answers.** `runner.js` disables Next until every item on the page is
answered. That is right for a scored scale and wrong for anything WHO-shaped.
Add `optional: true` to the form contract; when set, Next is always enabled,
`scoreLikert`'s midpoint substitution is bypassed, and an unanswered item is
carried as absent rather than as a middle response — the FOCCUS lesson that
"uncertain" is its own state, applied at the storage layer.

**Profilers need paging.** The profiler path renders every field on one page and
keeps no draft — fine for `working-style`'s eight fields and `chronotype`'s six,
untenable for anything larger. `intimacy-conditions` is specified as a
`questionnaire` for exactly this reason, even though its content is
preference-shaped, because the questionnaire path already has paging, drafts and
progress. If `study-practice` grows past about ten fields, the profiler path
needs the same paging the questionnaire path has.

### 8.4 Uncovering something the person could not have got alone

The author's second question was how to surface meaningful insight. Two tests,
applied to every line of output in all four instruments:

**The Barnum test.** Could this sentence plausibly be *false* of this person? If
not, delete it. Vague positive descriptions are accepted as accurate by nearly
everyone, and the effect is strongest exactly when the profile is believed to be
individually generated and positively worded — which describes every result page
in this app.

**The alone test.** Could the reader have written this sentence themselves
before taking the instrument? If yes, it is a summary, not a finding. The
outputs that survive this test in the four instruments are narrow and worth
protecting: *which conversations you have never had* (couple), *the specific
collision between two people's stated preferences* (work), *the conditions you
need, written down in a form you can hand over* (intimacy), and *which
evidence-backed technique is missing from your repertoire* (study). Everything
else on those pages is context for those four sentences.

---

## 9. Four languages

The app ships in English, Polish, Spanish and German, and the parity test is
strong: every locale must define exactly the keys English defines, and the
pseudo-locale completeness pass catches any sentence that never went through
`t()`. That is a real guarantee and it is a guarantee about **coverage**, not
about **meaning**.

> **Translation parity is not measurement invariance.** The parity test proves
> that a Polish reader sees a Polish sentence. It proves nothing about whether
> that sentence measures the same thing the English one measures, and this app
> has no data collection and therefore no way to find out. Every one of the four
> domains here varies enormously across the four locales.

That has to be said in the `sourceNote`, and it has consequences for how items
are written.

### 9.1 Write four originals, do not translate one

Items in these four instruments are written **in parallel, one author per
locale, from the same construct definition** — not translated from English. The
parity test cannot tell a translation from an original, but a reader can: a
translated item reads as a translated item, and an item that cannot be answered
naturally in Polish is a broken item regardless of how faithfully it renders the
English. This also protects the clean-room process, since the source instruments
are overwhelmingly English-language.

### 9.2 What breaks, domain by domain

| Domain | The problem | The rule |
|---|---|---|
| **Money** | Joint versus separate accounts, normal levels of household debt, who pays for what at a wedding, and whether discussing salary is ordinary or rude all differ sharply across these four cultures. A currency figure is meaningless across them and dated within them | Never a currency amount. "The amount above which we'd decide together" is asked as a **relative** band — about a day's pay, about a week's, about a month's — which travels and does not age |
| **Religion** | "We do something together at least monthly that either of us would call spiritual practice" reads as a low bar in one locale and an unusual one in another; the same words describe different behaviour in a heavily Catholic country and a heavily secular one | Ask about **enacted practice and expectation of the other person**, never about denomination, attendance frequency benchmarks, or "how religious are you". Report no comparison to any population |
| **Children** | Fertility timing norms, the normality of cohabitation before or instead of marriage, and the expected role of extended family differ by locale and by cohort within locale | Ask facts about this couple's intention. Never present a "typical" age, count or timing |
| **Roles and labour** | This is the domain where the underlying research is itself country-dependent — the mixed record on equality and divorce risk is mixed *because* it is cohort- and country-specific | Ask about expectations and perceived fairness. Make no claim about which arrangement is better |
| **Sexual communication** | Mallory et al.'s own moderator analysis found the communication–satisfaction association **strengthened** under higher individualism and **weakened** under higher gender inequality (https://pubmed.ncbi.nlm.nih.gov/34968095/). The advice does not port uniformly across four locales even in principle | State the association once, as an association, and never as "if you communicate more, this improves". The condition cards are locale-neutral because they are the person's own requests |
| **Work** | Directness norms around feedback are a genuine cross-cultural difference and also the single richest source of national stereotype. An item that presumes blunt feedback is normal, or that it is rude, is broken in two of the four locales | Items ask what the person wants, never what is normal. `working-style`'s existing `feedback` field is already written this way and is the model |
| **Study** | Schooling systems differ enough that "how you revised for exams" means different things; highlighting and rereading carry different institutional weight | Ask about the behaviour in plain terms — "I test myself without looking at the notes" — with no reference to any exam, qualification or institution |

### 9.3 Mechanical rules

- **No idioms, no institution names, no legal terms.** No prenup, no
  common-law, no 401k, no Ehevertrag, no notariusz. If an item needs one, it
  needs a locale variant — and the contract already allows this, since
  `form(t, locale)` receives the locale and items carry structure while all
  wording lives in `i18n/<locale>.js`.
- **The response scale is the last invariance protection we have.** The comment
  in `scoring.js` is exactly right: "Rarely me" and "Often me" have to divide
  the range the same way in every language. For these four instruments that is
  the *only* thing standing between four locales and four different
  instruments, so the `agree5` labels get reviewed by all four item authors
  together, not signed off per locale.
- **No numbers about people in any locale.** No percentiles, no bands, no "most
  couples", no "people like you". We have no norms in one language, let alone
  four.

---

## 10. What the shell needs before any of this ships

| # | Change | For | Size |
|---|---|---|---|
| P0-1 | `tier: "private"` on items; excluded from `instructions()`, `compare()`, `share.encode()` and `report.orderOf()`, with a test asserting no private id reaches any token | couple, intimacy | Medium — touches `registry.js`, `report.js`, `share.js`, `sheet.js` |
| P0-2 | `persistence: "ephemeral"` manifest flag honoured by `runner.js` and `store.js`; non-descriptive storage key; excluded from the catalogue completion pill | intimacy | Medium |
| P0-3 | `maxAudience` manifest field enforced in `sharing.js` and `report.js` so `public` is not offerable | intimacy | Small |
| P0-4 | `optional: true` on the form contract: Next always enabled, no midpoint substitution, unanswered carried as absent | intimacy, couple | Small |
| P0-5 | Card-only, expiring, revocable comparison tokens as a second mechanism alongside `share.js` | couple, intimacy | Medium |
| P0-6 | Quick exit control and the standing locale-selected support link, with a build-time reachability check | intimacy, couple | Small |
| P0-7 | `provenance.js` per instrument folder, enforced by `contract.test.js` and `build.mjs` | all | Small |
| P0-8 | `LICENSE` file splitting code (MIT) from item banks and locale strings (all rights reserved) | all | Small |
| P1-1 | Epistemic tier on instruction cards — `stated` / `claimed` / `estimated`, three visual treatments — so a preference is never rendered as a competence | all, §5.1 | Medium |
| P1-2 | `shuffle: false` support with a topic-grouped paging option | couple, intimacy | Small — `runner.js` already respects `form.shuffle` |
| P1-3 | Paging and drafts on the profiler path | study, future profilers | Medium |
| P1-4 | Run history — `mi:1:run:<id>` holds one run, so any change-over-time reading needs a new key shape | §5.3 | Medium, and only if the change reading is wanted |
| P1-5 | A work-audience preset on the sharing page | work | Small |

P0-1 through P0-8 are prerequisites, not nice-to-haves. Nothing in the couple or
intimacy families should be written until they exist, because every one of them
is a property that cannot be retrofitted onto answers already stored or links
already sent.

---

## 11. Build order

**1. `working-style` v2** — five fields, one version bump, one new channel, plus
the employment-decision ban in copy and the work-audience preset. No new ethics
surface, no new legal exposure, no new platform machinery, and it delivers most
of what request 3 was actually asking for. A day.

**2. P0-7 and P0-8** — provenance file, contract-test enforcement, split
`LICENSE`. Do these before writing a single new item, because they are what makes
every subsequent item bank defensible, and because retro-fitting provenance to
items already written is the same work done twice with worse records.

**3. `study-practice`** — after vetting Dunlosky et al. and Rohrer & Pashler
into the source list properly. One profiler folder, four locales, no ethics
surface. Two days, and it discharges request 4 honestly.

**4. P0-1, P0-4, P0-5** — item tiers, optional answers, card-only tokens.

**5. `couple-conversations`** — 28 items in four languages is the largest item
bank in this batch and the four locale authors are the critical path, not the
code. A week, most of it writing.

**6. Counsel on age assurance**, then P0-2, P0-3, P0-6, then
**`intimacy-conditions`** — last, and genuinely optional. If the answer on age
assurance is unfavourable, this is where the roadmap stops and nothing before it
is wasted.

P1-1 (epistemic tiers) can land any time after step 1 and improves every existing
instrument, so it is the best thing to do while waiting on locale authors.

---

## 12. Rejected, and what to do instead

| Rejected | Instead |
|---|---|
| Learning styles (VAK/R) | `study-practice` — technique use, not a type |
| A compatibility percentage, in any instrument | Two positions side by side, unaveraged, with the gap direction in words |
| PREPARE's Positive Couple Agreement scoring | Discussion status per topic, plus both positions. PCA counts only items where both answered positively, so a couple who firmly and mutually agree money is a problem score 0% — identical to a couple who flatly disagree. It is a strengths metric wearing an agreement metric's name |
| The calibration gap as a scored, ordered output | One prediction item per topic, raising an unattributed pair-level flag only when positions are two steps apart |
| The idealisation / distortion guard | The caveat, shipped unconditionally to everyone, plus the existing `straightlining()` |
| The children contingency item | The same question as a line of copy on the reader's own page — not stored, not scored, not compared |
| Domain weighting by predictive strength | Equal item counts, and an honest statement that we do not know which topic matters most |
| The sexual activity yes/no/ask-me-first inventory | Condition and request cards. If a checklist is ever wanted, session-only, never stored |
| Scored excitation/inhibition axes | The same content as condition cards, unscored |
| Erotic typology of any kind | Conditions and requests, which are what a partner can act on |
| A desire discrepancy number | Two lists of what each person asked for, and the overlap |
| TREO six team roles | Nothing. `riasec`, `big-five` and `conflict-style` already carry the defensible part of this content |
| A psychological-safety threshold dimension | Nothing individual. If the concept appears in copy at all, cite Edmondson and Frazier et al., and say it is a team property |
| Observer / 360 form and self-other gap | Nothing. Optionally, a self-authored card: "if you think you've upset me, ask directly rather than waiting it out" — the person's own instruction, not a colleague's rating |
| Self-rated ability sliders | One claim with an instance attached, labelled as a claim, naming no other person |
| Load / drain / recovery as specified | Working-conditions preferences in the `working-style` register |
| A mindset scale | Nothing. Nobody has reviewed that literature, and saying so is the honest output |
| `public` visibility for the intimacy instrument | `private` by default, `friends` meaning one named revocable person, `public` not offerable |
| The generic raw-answer share token for couple and intimacy | Card-only, expiring, revocable tokens |

---

## Closing note

The four requests are not four instruments. They are one instrument that mostly
already exists, one that needs a new dyadic shape the plugin contract turns out
to support well, one that needs a legal answer this project does not have, and
one that is a request to measure something that is not there.

The thing that makes the first three defensible is the same thing that makes
`working-style` the best folder in the app: they record what a person tells us
and hand it back arranged, rather than estimating something about them from
behind a fresh item bank with no norms. Where they do estimate — the topic leans
in `couple-conversations` — they estimate coarsely, hedge in the copy, and never
order the page by the size of their own uncertainty.

And the plugin contract does more work here than it looks like it should.
`score()` takes answers and returns numbers and identifiers for one person;
`compare()` takes two results. That signature makes it *structurally impossible*
to average a couple into a single score, which is the error every consumer
premarital product makes. The constraint was written for share links and
languages. It turns out to be the right psychometrics too.
