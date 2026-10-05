# Validated instruments for the app

Date: 2026-10-05. For the app's owner.

Sources: the two audits and six sweeps in `research_notes/Validated instruments for the app/` (`audit-psychometrics.md`, `audit-purpose.md`, `sweep-bigfive-hexaco.md`, `sweep-interpersonal.md`, `sweep-pubmed-usefulness.md`, `sweep-strengths-wellbeing.md`, `sweep-values-needs.md`, `sweep-work-interests.md`). Every licence sentence, figure and citation below is taken from them; where they marked something **unverified**, so does this report. The earlier report, `reports/Six test sources and licences.md`, settled three things this report builds on and does not repeat: none of the six commercial tests can be rebuilt; IPIP is the one pool free for any purpose, including commercial use and translation; and any borrowed bank makes the shared "writes its own items" disclaimer false for that instrument.

What this report answers:

1. Which validated, openly licensed instruments replace or join the app's own, and why the rest cannot (§1, §4).
2. What the peer-reviewed literature says is most useful for the app's purpose, and what that implies for the product (§2).
3. What "improving the tests" means concretely, prioritised (§3).
4. The per-language evidence for everything adopted (§1.2).

The short answer to (1): of everything the sweeps examined, only IPIP material is free for a public web app with a paid tier **and** for translation into Polish, Spanish and German. Three IPIP banks were adopted on 2026-10-05. Everything else is non-commercial (BFI-2, BFI-10, ECR-R, the SDT need scales, SWLS, Flourishing, PERMA, IRI, the Armstrong-Allison-Rounds markers, UWES), no-derivatives (Schwartz's repository, O*NET's unmodified licence), unstated (TEQ, BES, RAS, CRSI, ECR-RS, Strengths Use Scale, BMPN, SSVS, Need for Cognition, MCTQ), or proprietary (HEXACO-PI-R, VIA-IS, ROCI-II, TKI, IAS, IIP, MSLQ, MIQ, Rokeach).

---

## 1. What was adopted (done 2026-10-05)

### 1.1 The three instruments

| Instrument | Items and format | Licence (verbatim, source) | Evidence by language | What changed in the app |
|---|---|---|---|---|
| **big-five** (replaced) | IPIP 50-item Big-Five Factor Markers (Goldberg 1992): ten items a factor; keying E 5+/5−, A 6+/4−, C 6+/4−, ES 2+/8−, I 7+/3−; IPIP 5-point accuracy scale ("Very Inaccurate … Very Accurate"), summed per scale. IPIP's factor IV (Emotional Stability) is reported with the key flipped as `reactivity`; factor V (Intellect/Imagination) keeps the name openness. Longest English item 54 characters, 10 words. | "Because the IPIP has been placed in the public domain, permission has already been automatically granted for any person to use IPIP items, scales, and inventories for any purpose, commercial or non-commercial." — https://ipip.ori.org/newPermission.htm. Polish text, UKSW FAQ: "Nie, aby korzystać z kwestionariuszy nie potrzeba żadnej zgody. Są one udostępniane na zasadzie CC BY (). Każdy może swobodnie korzystać z zamieszczonych kwestionariuszy. Prosimy tylko na powołanie się na źródło, czyli www.ipip.edu.pl." — http://www.ipip.uksw.edu.pl/faq.php | en published · pl published, validated · es translation, unvalidated and contested · de translation, unvalidated (§1.2) | 40 original items → 50 IPIP items in four locales; `accurate5` scale added to `core/scoring.ts` with five shell strings per locale; `version: 2` (old results marked stale); `provenance.items.origin: "public-domain"`, `evidence: borrowed`, `appliesTo: ["en", "pl"]`; `avoided` names NEO-PI-R, BFI-2, BFI-10, TIPI; the parity test records big-five as superseded and keeps the vanilla bank as the record of the original forty. |
| **interpersonal** (new) | IPIP Interpersonal Circumplex (IPIP-IPC; Markey & Markey 2009): 32 items, eight octants × 4 items (PA assured-dominant, BC arrogant-calculating, DE cold-hearted, FG aloof-introverted, HI unassured-submissive, JK unassuming-ingenuous, LM warm-agreeable, NO gregarious-extraverted), all positively keyed; IPIP 5-point accuracy scale; dominance and warmth computed from the octants with the circumplex weights. Longest item 44 characters, 9 words. | IPIP, as above. Polish: UKSW adaptation (Strus, Cieciuch, Rowiński), http://www.ipip.uksw.edu.pl/test.php?id=39, CC BY per the same FAQ. The Polish file reorders items relative to the English survey (Polish item 1 is English 22), so the site's own key, not the English key, governs the match. | en published · pl published adaptation, no psychometrics found · es, de app translations (§1.2) | New instrument, `version: 1`. View: the two axes, the quadrant and the octant profile. `Compare`: each person's level on both axes and the widest octant gaps, deliberately with no similarity figure (Dyrenforth et al. 2010 filed as a `critique` reference). `avoided`: IAS (PAR), IIP, DiSC, Insights Discovery. |
| **character-strengths** (replaced) | IPIP-VIA-R (Bluemke, Partsch, Saucier & Lechner 2021, rev. 2023): 96 items, 24 strengths × 4 (2+/2−); plus the three core strengths (Positivity, Dependability, Mastery; Partsch, Olaru & Lechner 2024): 18 of the same items (3 × 6, 3+/3−), read as a summary layer; IPIP 5-point accuracy scale. | IPIP, as above; the authors' preprint confirms it: "IPIP scales are similar to widely used commercial personality inventories, yet they are placed in the public domain and hence free to use for all purposes without licensing charges or registration." German items from Table 7 of that preprint, licence CC BY 4.0 (OSF record), https://doi.org/10.31234/osf.io/k79qf | en published · de published, validated · pl, es app translations (§1.2) | 72 original items (3 a strength, 2:1 keying) → 96 IPIP-VIA-R items plus the 18-item core layer; `version: 2`; `provenance` public-domain, borrowed, `appliesTo: ["en", "de"]`; `avoided`: VIA-IS, VIA-IS-R, VIA-120, VIA-72, CliftonStrengths, Strengths Profile; "VIA" kept out of titles; Partsch, Bluemke & Lechner 2022 (three global dimensions) added as a `review` reference. |

Why these three and not others: they are the only candidates in the sweeps that are (a) public domain, (b) validated in at least English, (c) short enough for the item rule (≤ 80 characters, ≤ 14 words), and (d) already have a Polish or German text that is itself openly licensed. The deferred open routes that meet (a)–(c) but not (d) are in §4 (ORVIS, IPIP-HEXACO, IPIP-NEO-120, SCS-SF, IPIP 6FPQ motives).

### 1.2 Evidence by language

| | en | pl | es | de |
|---|---|---|---|---|
| **big-five** | **Published.** α E .87, A .82, C .79, ES .86, I .84; correlations with Goldberg's adjective markers .54–.73 (https://ipip.ori.org/newBigFive5broadTable.htm; the sample is not stated on that page). | **Published, validated.** IPIP-BFM-50: Strus, Cieciuch & Rowiński 2014, *Roczniki Psychologiczne* 17(2), 327–346 (PL) / 347–366 (EN); eight studies, N = 7,015, ages 10–83; CFA and multi-group invariance; external validity against NEO-FFI and NEO-PI-R; α E .87, A .81, C .80, ES .88, I .77 (UKSW page). https://ojs.tnkul.pl/index.php/rpsych/article/view/512 ; items http://www.ipip.uksw.edu.pl/test.php?id=32 | **Translation, unvalidated, contested.** de Oliveira text hosted by IPIP (https://ipip.ori.org/SpanishBig-FiveFactorMarkers.htm; the citation it gives is an HCI paper, not a validation). Hughes, de Olazabal, Kratsiotis, Twumasi & Booth 2020, *Span J Psychol* 23:e18, https://doi.org/10.1017/SJP.2020.11 (PubMed 32618534): in 778 non-university-educated Peruvian adults the a-priori five-factor CFA "failed to fit"; whether that is the same translation is not stated. | **Translation, unvalidated.** Bielefeld text (Angleitner, Hempel, Langert, Spinath; provided by Ostendorf), https://ipip.ori.org/German50-itemBigFiveFactorMarkers.htm; no validation paper found on Crossref, PubMed or the web. |
| **interpersonal** | **Published.** Markey & Markey 2009, *Assessment* 16(4), 352–361, https://doi.org/10.1177/1073191109340382 (PMID 19667139): N = 501 / 274 / 100; average 4-item composite reliability .64 (range .51–.75) and .63 (.50–.77); circular order met 287/286/283/276 of 288 predictions (CI .99/.99/.97/.92); convergence with the 64-item IAS: parallel octants median r = .58, warmth r = .82, dominance r = .75. Markey, Anderson & Markey 2013, *Assessment* 20(2), 165–174 (PMID 22333526): N = 96, coded dyadic behaviour followed the scores. | **Published adaptation, unvalidated.** UKSW text (http://www.ipip.uksw.edu.pl/test.php?id=39); the page gives no alphas and no psychometrics were found. | **App translation.** No Spanish IPIP-IPC is listed by IPIP. | **App translation.** No German IPIP-IPC is listed by IPIP. |
| **character-strengths** | **Published.** Bluemke et al. 2021/2023, UK quota sample n = 474: McDonald's omega per strength .63–.84; 2–3-week retest .53–.77 (https://ipip.ori.org/IPIP-VIA-R_Table.html). Core strengths, Partsch, Olaru & Lechner 2024, *J Pers Assess*, https://doi.org/10.1080/00223891.2024.2309994 (PMID 38407165; six samples, N = 2,754): UK omega Positivity .74, Dependability .81, Mastery .78; retest .80 / .70 / .68. | **App translation.** No Polish text of the 96-item form exists. Polish wording for the parent items exists inside Najderska & Cieciuch's 213-item IPIP-VIA (2018, *Front Psychol* 9:153, PMID 29515482, N = 908, α .66–.88, mean .74; "available upon request") and in the KUL translation (Celińska-Miszczuk & Uchnast; contact only). Neither was obtained. | **App translation.** Ovejero's IPIP-VIA translation is contact-only; no public text and no validation found. | **Published, validated.** German items from the authors' TRAPD adaptation (preprint Table 7); Germany quota sample n = 476: omega .57–.83, retest .58–.84, weakest Self-regulation (omega .57). Core strengths (DE): omega .66 / .72 / .63, retest .72 / .75 / .72; scalar invariance across DE and UK. |

Two caveats apply across the table. IPIP's own line on every hosted translation: "The accuracy of these translations has not not been verified by anyone associated with the IPIP project." (sic, https://ipip.ori.org/newItemTranslations.htm). And no norms exist for any adopted scale in any locale under a reusable licence (§4, Open Psychometrics), so bands stay descriptive: a score is where the answers fall on the scale, not a standing among other people.

### 1.3 Platform changes

| Change | Where | Effect |
|---|---|---|
| Per-instrument disclaimer | `result-view.tsx` prefers a `disclaimer` key over `app.noValidation`; the three borrowed instruments define one | The shared "every questionnaire in this app writes its own items" no longer shows on their pages (see §1.4 for the locales still missing it) |
| Evidence declared per language | `core/provenance.ts`: `evidence.appliesTo` over `en, pl, es, de`; validation refuses evidence without locales and locales without evidence | The page can say which language the published figures belong to |
| Parity test | `test/instruments/parity.test.ts`: `SUPERSEDED["big-five"]`, dated 2026-10-05 | The "scores identically to the reference" check skips big-five on purpose and still requires it to be registered |
| Midpoint rounding | `web/src/core/scoring.ts`: `normalize` returns exactly 50 at the middle of the range; `sideOf` is a strict `> 50`; attachment, hexaco and under-pressure use it. Same fix in the frozen reference (`src/core/scoring.js`, attachment and hexaco modules) | An all-neutral reader no longer scores 51 and reads "high" on every scale, "anxious", or "fearful-avoidant" |
| Accuracy scale | `accurate5` in `core/scoring.ts`; `scale.accurate5.0–4` in four locales | The borrowed instruments are administered in the format their alphas were measured on (S10, partly) |
| Comparison surface | `components/report/report.tsx`: when the reader has their own run of the opened instrument, `Compare` renders with both results and both names; otherwise a "take it first" prompt | The two-person views that existed for 15 instruments and were reachable nowhere in `web/` are reachable on the opened-report page (S1, partly) |

### 1.4 Loose ends, closed the same day

The first draft of this section listed five things still open in the working tree. Checked again before the commit:

- **Disclaimers and source notes** for the three instruments are now written in Polish, Spanish and German (translators worked from the English contract; the Polish and German item banks are the published adaptations, untouched).
- **Readability gate.** Not a named exception: `test/i18n/readability.test.ts` now gates only instruments whose `items.origin` is `"original"`. A borrowed, validated item is reproduced as published (the one 16-word core-strength item included); shortening it would make it a different, unvalidated item, which is the thing borrowing exists to avoid. The double-barrelled check is skipped for them on the same ground.
- **Polish IPIP-IPC order.** Matched octant by octant against the UKSW SPSS key (`IPIP IPC_PL.SPS`: PA 1, 9, 17, 25; BC 6, 14, 22, 30; …) and by meaning within each octant; the i18n table carries each Polish item under its English number. The Polish key is therefore not used at runtime — the English scale assignment is.
- **McGrath 2015.** The `checked:` comment now names the record that was verified (Crossref, 10.1080/17439760.2014.994222), matching the entry's URL.
- **Two-person comparison** is covered by `e2e/compare.spec.ts`: an opened report compares the sender's attachment result with the reader's own, and a reader without a run is told to take it first.

---

## 2. What the literature says the app should help people see

All citations here are from `sweep-pubmed-usefulness.md`; "PubMed" means the PMID and DOI were fetched there, "Crossref" means the DOI record was retrieved.

### 2.1 Self-knowledge is asymmetric; others see some of it better

| Finding | Source |
|---|---|
| Self-Other Knowledge Asymmetry: the self is the best judge of neuroticism-related traits, friends the best judges of intellect-related traits, all perspectives equal for extraversion | Vazire 2010, *J Pers Soc Psychol* 98(2):281–300, PMID 20085401, https://doi.org/10.1037/a0017908 (PubMed) |
| "the road to self-knowledge likely cannot be traveled alone but must be traveled with close others who can help shed light on our blind spots" | Bollich, Johannet & Vazire 2011, *Front Psychol* 2:312, PMID 22069394, https://doi.org/10.3389/fpsyg.2011.00312 (PubMed) |
| Self-reports more valid for internalising (neuroticism-defined) patterns; informant reports more valid for antagonistic and externalising patterns (low agreeableness, low conscientiousness) | Carlson, Vazire & Oltmanns 2013, *J Pers* 81(2):155–170, PMID 22583054 (PubMed) |
| Three meta-analyses, 44,178 targets, 263 samples: "informants' interpersonal intimacy with the target is necessary for substantial increases in other-rating accuracy"; observer ratings predicted behaviour, achievement and job performance "substantially greater than and incremental to self-ratings" | Connelly & Ones 2010, *Psychol Bull* 136(6):1092–1122, PMID 21038940 (PubMed) |
| Trait–Reputation–Identity model: consensus, unique self-view and the impression conveyed to others are separable | McAbee & Connelly 2016, *Psychol Rev* 123(5):569–591, PMID 27504526 (PubMed) |
| Assessment as intervention: d = 0.423 (95% CI 0.321–0.525), when feedback is "personalized, collaborative, and highly involving" | Poston & Hanson 2010, *Psychol Assess* 22(2):203–212, PMID 20528048 (PubMed) |
| Self-rated ability correlates r ≈ .29 with performance (already cited in the app) | Zell & Krizan 2014, https://doi.org/10.1177/1745691613518075 (Crossref) |
| Self-concept changes after discrepant feedback, more for larger and negative discrepancies — **web summary, unverified against the article** | Brotzeller & Gollwitzer 2024, https://doi.org/10.1177/01461672241232738 (Crossref) |

### 2.2 Between two people, compare levels, not similarity

| Finding | Source |
|---|---|
| Married couples, AU N = 5,278, UK N = 6,554, DE N = 11,418: actor effects ≈ 6 % of relationship-satisfaction variance, partner effects 1–3 % (largest for Agreeableness, Conscientiousness, Emotional Stability); "Couple similarity consistently explained less than .5% of the variance in life and relationship satisfaction after controlling for actor and partner effects." | Dyrenforth, Kashy, Donnellan & Lucas 2010, *J Pers Soc Psychol* 99(4):690–702, PMID 20718544 (PubMed) |
| 4,464 couples over 8 years, response-surface analysis: similarity "explained a small amount of variance in well-being as compared with … linear actor and partner effects"; one robust similarity effect (agreeableness, women's experience of support) | van Scheppingen, Chopik, Bleidorn & Denissen 2019, *J Pers Soc Psychol* 117(4):e51–e70, PMID 30102060 (PubMed) |
| 1,294 couples, traits and facets: similarity "was not robustly associated with either life or relationship satisfaction" | Weidmann et al. 2023, *J Res Pers* 104:104378, https://doi.org/10.1016/j.jrp.2023.104378 (Crossref; quotes from PMC10312100) |
| 254 couples: similarity in trait emotion regulation "was not associated with any well-being index" across three similarity metrics | Eldesouky, Gross & English 2025, *Sci Rep* 15:28820, PMID 40770279 (PubMed) |
| Attachment, 73 studies, 21,602 people: avoidance more negatively associated with satisfaction, connectedness and support; anxiety more positively with conflict | Li & Chan 2012, *Eur J Soc Psychol* 42:406–419, https://doi.org/10.1002/ejsp.1842 (Crossref) |
| Attachment actor and partner meta-analysis — **the figures circulating (r = −0.32 anxiety, −0.44 avoidance) are unverified against the abstract** | Candel & Turliuc 2019, *Pers Individ Dif* 147:190–199 (Crossref) |
| Teams: "team minimum agreeableness and team mean conscientiousness, openness to experience, collectivism, and preference for teamwork emerged as strong predictors of team performance" | Bell 2007, *J Appl Psychol* 92(3):595–615, PMID 17484544 (PubMed) |
| Value congruence works through trust, then communication, then attraction; relationships "often deviated from the idealized value congruence relationship" | Edwards & Cable 2009, *J Appl Psychol* 94(3):654–677, PMID 19450005 (PubMed) |
| A partner's *appreciation* of the other's strengths predicted satisfaction, commitment and daily need satisfaction beyond the partner's actual strengths or Big Five | Kashdan et al. 2017, *Psychol Assess* 30(2):241–258, PMID 28383929 (PubMed) |
| Complementarity in benevolence values — **web summary, unverified** | Leikas et al. 2018, *Pers Individ Dif* 123:191–198 (Crossref) |

### 2.3 Saying needs out loud: disclosure, quality and responsiveness

| Finding | Source |
|---|---|
| Sexual communication: r = .37 with relationship satisfaction, .43 with sexual satisfaction; quality (r = .43 / .52) beats frequency and disclosure | Mallory 2022, *J Fam Psychol*, PMID 34968095 (PubMed) |
| Disclosure raises liking in both directions | Collins & Miller 1994, *Psychol Bull* 116(3):457–475, PMID 7809308 (PubMed) |
| Intimacy as disclosure, partner disclosure and perceived partner responsiveness | Laurenceau, Barrett & Pietromonaco 1998, https://doi.org/10.1037/0022-3514.74.5.1238 (Crossref) |
| 64 observational studies, 5,071 couples: hostility strongly and withdrawal mildly negative; intimacy and problem solving positive (medium) | Woodin 2011, *J Fam Psychol* 25(3):325–335, PMID 21553964 (PubMed) |
| Relationship education: d = .30–.36 for relationship quality, .43–.45 for communication skills | Hawkins, Blanchard, Baldwin & Fawcett 2008, *J Consult Clin Psychol* 76(5):723–734, PMID 18837590 (PubMed) |
| No meta-analysis of "explicitly stating emotional needs" as such was found on PubMed | sweep note |

### 2.4 When feedback misleads

| Finding | Source |
|---|---|
| The fallacy of personal validation (Barnum effect) | Forer 1949, https://doi.org/10.1037/h0059240 ; Dickson & Kelly 1985, https://doi.org/10.2466/pr0.1985.57.2.367 (Crossref) |
| Intimate couples rated generalised feedback as more accurate and recalled more of it than strangers did | Handelsman & McLain 1988, *J Clin Psychol* 44(3):430–434, PMID 3384972 (PubMed) |
| Favourable descriptions accepted more than unfavourable; computer vs human source made no difference | Baillargeon & Danis 1984, *J Pers Assess* 48(4):415–419, PMID 16367521 (PubMed) |
| Enneagram, 104 samples: "mixed evidence of reliability and validity"; "factor analytic work has typically found fewer than nine factors" | Hook, Hall, Davis, Van Tongeren & Conner 2021, *J Clin Psychol* 77(4):865–883, PMID 33332604 (PubMed) |
| Type-based reporting (MBTI) | McCrae & Costa 1989, https://doi.org/10.1111/j.1467-6494.1989.tb00759.x ; Pittenger 2005, https://doi.org/10.1037/1065-9293.57.3.210 ; Stein & Swan 2019, https://doi.org/10.1111/spc3.12441 (Crossref) |
| Love languages evaluated against relationship science | Impett, Park & Muise 2024, https://doi.org/10.1177/09637214231217663 (Crossref) |

### 2.5 What this implies for the product

| Implication | What it means concretely | Status |
|---|---|---|
| **An informant form** | The same items answered "about my partner / friend" by someone close, shown beside the self-report. The literature's strongest claim is not "a test tells you who you are" but "a self-report plus a close other's view, compared, moves self-knowledge" (2.1). Expect disagreement on agreeableness, conscientiousness and intellect, agreement on extraversion; say so on the page. | Not built. The highest-value addition the notes found. |
| **Levels, not a match score** | Comparison pages show each person's level on the few traits with partner effects (agreeableness, conscientiousness, emotional stability; attachment avoidance and anxiety; for teams, the lowest agreeableness in the group), plus one plain sentence that a partner's level predicts *the other person's* satisfaction. No similarity percentage (2.2). | Done for `interpersonal`. `love-languages` still prints `fit`; `numerology` still prints a total with verdict bands; `big-five` and `hexaco` still aggregate a mean gap (§3, S9). |
| **Concrete first-person lines** | Instruction-sheet lines are concrete, non-hostile, first-person, and include "what I'm good at that I'd like noticed" (Kashdan 2017); quality over quantity (Mallory 2022); hostility and withdrawal are the behaviours to name and avoid (Woodin 2011). Value congruence at work matters through trust and communication, which argues for the sheet, not a fit score (Edwards & Cable 2009). | Partly: the sheet exists; the "strengths I'd like noticed" line does not. |
| **Collaborative feedback** | Poston & Hanson's effect belongs to feedback that is "personalized, collaborative, and highly involving". A results page that asks the reader to mark each line "true / not true of me / ask my partner" is closer to that than a static page. | Not built. |
| **Critiques on type-based pages** | enneagram (Hook 2021), jungian (McCrae & Costa 1989; Pittenger 2005; Stein & Swan 2019), love-languages (Impett 2024) carry the critique as a `critique` reference and say it above the fold, not only in references; result copy avoids type labels and favourable-only phrasing (favourable Barnum statements are accepted most readily). | References exist; above-the-fold copy does not. |
| **Sharing is not validation** | Sharing a result with a partner raises acceptance of *any* description (Handelsman & McLain 1988). The comparison page must not read as confirmation that the description is accurate. | Copy to check on the new compare section. |

---

## 3. Improving the tests

### 3.1 Shared machinery (S1–S13 from `audit-psychometrics.md`)

Priority: **P1** small and corrects a wrong readout; **P2** medium, makes the readout honest; **P3** robustness; **P4** new work.

| # | Issue | Fix | Status 2026-10-05 | Priority |
|---|---|---|---|---|
| S1 | Comparison feature unreachable in `web/` (no route rendered `Compare`, `PairView` or a stance comparison) | Render on the report page and on the result page when a stored partner run exists; `PairView` for pairwise; contract test that every module with `compare` or `pairScore` has a rendering path | **Partly done**: `report.tsx` renders `Compare` when the reader has their own run. Remaining: result page with a stored partner run; `PairView` for `intimacy-map` (its whole purpose); a generic inventory compare on `compareStances` (wired only in `money-management`, rendered nowhere); the contract test; sheet-level compare (Gap 7) | P2 |
| S2 | Midpoint is 51, not 50; every `>= 50` test classified a neutral responder as "high" / "anxious" / "fearful" | Centre the scale; neutral zone | **Done** (`normalize` returns 50 at the exact middle; `sideOf` strict). Remaining: all-neutral fixtures in scoring tests (S12); a neutral zone for side labels is still a design choice where only `marked` keeps a 50 off the sheet | P1 (tests) |
| S3 | Silent neutral imputation: unanswered items score the midpoint and count in the denominator; nothing tells the reader | Prorate from answered items; require ≥ 75–80 % of a scale answered, else `null` and "not enough answers"; print `answered/total` when < 100 % (Downey & King 1998) | Remaining | P1 |
| S4 | Verbal bands ("very high … very low", "{score} / 100") read as norms; the cut-offs mean different agreement levels on 5- and 7-point scales (4.19 / 3.46 / 2.54 / 1.81 vs 5.79 / 4.70 / 3.30 / 2.21) | Criterion-referenced bands in raw response units ("you mostly agreed"); show the mean response beside the rescaled score; drop "/ 100" (Clark & Watson 2019) | Remaining | P2 |
| S5 | Ad-hoc thresholds: MARKED 22, dispersion 15, riasec 20, work-shape 18/12/62/39, character-strengths 17, love-languages 40/18, enneagram/jungian margin 6, attachment 20, conflict 12, hexaco 25 — none in scale units, none tied to measurement error; a margin of 6 on a 5-item scale is about one notch on one item | Centralise in `scoring.ts` as functions of item count and scale points (`step(items, points)`, `margin = 2 × step`); instrument constants derive from them | Remaining | P2 |
| S6 | Straightlining detector flags only an all-identical vector | Add intra-individual response variability, reverse-pair consistency, longest identical run in presentation order (needs the draft's `order` in the run record); report as "read with care", never a verdict (Meade & Craig 2012; Curran 2016; Dunn et al. 2018; Kim et al. 2019) | Remaining | P3 |
| S7 | `rank()` breaks ties by bank order; primary/secondary, three-letter codes, top two, dominant function and type can be decided by item order | `rank()` returns `tiedWithNext` and a `margin`; every top-N View shows "tied" / "close" when margin < one step (Brown & Gore 1994 on permutable codes) | Remaining | P1 |
| S8 | `shares()` re-ipsatises normative scores (love-languages `share`, `quiet`, `fit`) | Presentation aid only, never an input to a threshold or comparison (Hicks 1970; Meade 2004) | Remaining | P2 |
| S9 | Dyadic comparison by raw mean gap (big-five, hexaco) or by category (attachment, conflict) | Gaps in steps or bands; state the step size; never one aggregate number without saying what it ignores (Cronbach & Gleser 1953; Furr 2008; Wood & Furr 2016; Rogers, Wood & Furr 2018) | `interpersonal` built this way (levels, widest gaps, no total). big-five, hexaco, attachment, conflict remaining | P2 |
| S10 | `true5` mixes identity and frequency anchors ("Not me at all / Rarely me / Sometimes me / Often me / That is exactly me"); its midpoint is not neutral | A single-dimension anchor set (Weijters, Cabooter & Schillewaert 2010; Simms et al. 2019) | **Partly done**: `accurate5` exists and the three borrowed instruments use it. love-languages, enneagram, under-pressure, jungian still on `true5`; re-anchor and re-translate in four locales | P3 |
| S11 | Full randomisation; items of one scale may land back-to-back | No-adjacent-same-scale constraint in the seeded shuffle (Schell & Oswald 2013) | Remaining | P3 |
| S12 | No tests of `core/scoring.ts` | `test/core/scoring.test.ts` with the audit's arithmetic as fixtures: all-neutral → 50 on 5-point/8-item, 7-point/9-item, 5-point/3-item; step sizes 4 / 3 / 8; band edges; `rank` ties; `deviation`; `straightlining` | Remaining | P1 |
| S13 | Dead `scaleName` field in `items.ts` (big-five's said `true5` while the spec used `agree5`) | Delete it or make `form()` read it | big-five `items.ts` was rewritten; check the field is gone everywhere | P3 |

### 3.2 Gaps against the purpose (from `audit-purpose.md`)

| Gap | Direction | Status |
|---|---|---|
| 1 Comparison designed everywhere, shipped nowhere | As S1 | Partly done |
| 2 No instrument had any evidence | Adopt IPIP banks where translations exist; record `appliesTo` per locale; per-instrument `disclaimer` | Done for three instruments; open routes for others in §4 |
| 3 Weaknesses: no instrument owns them | Facet-level low-pole copy framed as costs and asks (IPIP-NEO facets are public domain and give 30 named places a person can be low); never a deficit score; keep "weakness" out of headings | Remaining (P4) |
| 4 Values: work only, no general instrument | A stated-priorities inventory (ranking is a position, not an ipsative trait score) or the TwIVI if the item rule is whitelisted (§4) | Remaining (P4) |
| 5 Strengths with evidence | IPIP-VIA-R beside `strength-evidence` | Done |
| 6 Profiler defaults fabricate positions (`working-style` pre-selects `options[1]`; `study-practice` "sometimes"; `chronotype` 23:00/07:00; `numerology` 8 Jan 1993; `attraction` "Not at all" on all axes; `strength-evidence` shape "depth") | No pre-selected value; `score()` returns `null`; the View prints "not answered" | Remaining (P1: on `attraction` an untouched form stores a fabricated disclosure) |
| 7 Comparison is per instrument; the sheet is the product | After S1, a two-person reading of the instruction sheet by channel, with no number | Remaining (P4) |
| 8 Section copy lost on uneven inventories | `pageBy: "section"` in `paginate`, as `money-management/spec.ts` requests; restore multi-block pages on boundaries, good-life, faith, family-plan | Remaining (P3) |
| New (§2) Informant form | Same items, answered about the person by a close other, compared | Remaining (P4) |

### 3.3 Per-instrument fixes, prioritised

| Priority | Instrument | Fix | Effort |
|---|---|---|---|
| P1 | intimacy-conditions | **Keying bug**: `b.fixed` ("You either fit together in bed or you do not") points the destiny way but is averaged unreversed; learnable 3, fixed 5, talkHelps 3 → mean 3.67 → "growth", so a strong destiny believer reads the growth paragraph. Reverse-key it (one line). Name `hardest` only when at least one point below the next lowest | small |
| P1 | couple-conversations | `surprise` conflates projection with misprediction; correct definition `mine.predicted !== theirs.lean` (and symmetric). Limit `careless` to within-topic identical answers plus identical status everywhere (a reader who agrees with every position is currently flagged) | small |
| P1 | love-languages | Remove `fit` (the one couple score, passed to `band()` as if it were a scale); flag primary ≈ secondary; put Impett, Park & Muise 2024 above the fold and soften "lead with X" (the construct's own evidence is weak); items t2, s4 ask about a reaction, not a preference | small |
| P1 | attachment | Lead with the two coordinates and a neutral zone, not the quadrant (dimensional construct: Fraley et al. 2015); compare on dimensions with banded gaps; items av6 and ax8 are comparative/conditional; 6:3 keying. S2 already removed the all-neutral → "fearful" case | small–medium |
| P2 | enneagram, jungian | Margin ≥ 2 steps (≈ 10) and a wider shortlist state; wings, stress/growth lines and the function stack labelled as the tradition's claims, not findings; Hook 2021 / McCrae & Costa 1989, Pittenger 2005 on the page; `auxiliaryOf` tie handling; 4:1 keying with extreme reverse items (e1e) that floor | small |
| P2 | hexaco | 3:3 keying (now 4:2); a note that emotionality items m3/m6 carry a known sex difference, so "low emotionality" copy reads differently to men and women without norms; MARKED 22 is ≈ 1.3 raw points on six items. Open route: IPIP-HEXACO, English only (§4) | small |
| P2 | under-pressure | Add a `Compare` (banded gaps per scale and overall); lead with `overall`, since the four-factor split does not replicate (Gucciardi et al. 2012; Kawabata et al. 2021, already cited) | medium |
| P2 | riasec | Flag near-ties in the code letters; use a published congruence index on all three letters (Iachan, Zener–Schnuelle, C-index; Brown & Gore 1994) instead of first letters; 5:1 keying. Open route: ORVIS (§4) | medium |
| P2 | conflict-style | Label `fallback` as "a common pattern, not a measurement" or drop it (nothing in the dual-concern literature specifies it); banded gaps on the two concerns; cite De Dreu et al. 2001 in provenance. Van de Vliert & Kabanoff 1990 returned **no Crossref record** — check before it goes into a provenance file | small |
| P2 | work-values | Replace con3 (measures variety, not conditions) and con6 (double-barrelled in substance); add a forced "pick your two" after the ratings, kept out of the scale scores (Meade 2004); flag ties | small |
| P2 | work-shape | Reverse items that negate the same end rather than assert the paired scale (dep5 ≈ var, var5 ≈ dep); an item-sort with 3–5 reviewers recorded in `evidence.note` (Hinkin 1998) | medium |
| P3 | character-strengths | A "close" flag within one step beside the tie flag; a `Compare` (shared signature, each-only, banded) | medium |
| P3 | strength-evidence | Shape select defaults to "not sure" and does not count; a small `Compare` (shared backed / each-only) | small |
| P3 | chronotype | Cite the band source (Roenneberg's German cut-offs) in the View; label the "best hours" window as a heuristic; optional "minutes to fall asleep" field | small |
| P3 | study-practice | Move `elaboration` to the "moderate" tier (Dunlosky et al. 2013 rate elaborative interrogation moderate) | small |
| P3 | attraction | Four labels instead of a 1..100 bar; a third target or an "other" row | small |
| P3 | intimacy-map | Wire `PairView`; compute `lean` from the share of "yes / favourite" per side, limits out of the mean; the 15/25 thresholds have no rationale for this data | small (after S1) |
| P3 | numerology | Visually distinguish a tradition reading from a scored one; it is the one reachable couple score with verdict bands | small |

---

## 4. Declined or deferred

| Instrument | Decision | Licence sentence (verbatim) | URL | Why |
|---|---|---|---|---|
| BFI-2, BFI-2-S, BFI-2-XS | Declined | "The BFI-2 items are copyright 2015 by Oliver P. John and Christopher J. Soto. Permission is granted for personal and research use of the BFI-2." (Colby page, read via Wayback) · "At this time, the BFI-2 is for non-commercial uses only." (Berkeley) | https://www.colby.edu/academics/departments-and-programs/psychology/research-opportunities/personality-lab/the-bfi-2/ · https://ocf.berkeley.edu/~johnlab/bfi.html | The best-validated short Big Five with PL, ES and DE forms, but personal/research use does not cover a public app with a paid tier; no translation permission stated |
| BFI-10 | Declined | "The BFI-10 must not be used for commercial purposes." | https://www.gesis.org/en/services/planning-studies-and-collecting-data/items-scales/bfi-10 (via Wayback) | Non-commercial; two items a factor; "should not be used for individual diagnostics" |
| HEXACO-PI-R | Declined | "We do not allow researchers to collect data through an online survey site or an app accessible by the general public." | hexaco.org | No public apps; the PL/ES/DE forms there are "only for the purpose of non-profit academic research" |
| TIPI | Declined | "WANT TO USE THE TIPI? GO AHEAD. ANYONE CAN USE IT FOR ANY PURPOSE. NO NEED TO ASK ME FOR PERMISSION." | https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/ | Free, with PL/ES/DE translations, but every item is an adjective pair (double-barrelled by design), two items a factor, 7-point agree; fails the app's item rule |
| ECR-R | Declined (permission route in §5) | "You may not use the scales for commercial purposes without permission." | http://labs.psychology.illinois.edu/~rcfraley/measures/ecrr.htm | Paid tier; the PL (Lubiewska et al. 2016, "Licencja: Żadna"), DE (ECR-RD, Ehrenthal et al. 2009) and ES (Nóblega et al. 2018, DOI **unverified**) adaptations belong to their own publishers |
| SDT need scales: BPNSFS, BPNS, Basic Need Satisfaction in Relationships | Declined (permission route in §5) | "You may not use any of them for any commercial purposes without written permission to do so from the Center for Self-Determination Theory." | https://selfdeterminationtheory.org/questionnaires/ | Validated PL and DE BPNSFS forms exist and inherit the same terms |
| Schwartz PVQ-RR, PVQ-40, PVQ-21, SVS | Declined | "This work is licensed under a Creative Commons Attribution-Noncommercial-No Derivative Works 3.0 License." | https://scholarworks.gvsu.edu/orpc/vol2/iss2/9/ | NC bars the paid tier; ND bars translation and shortening |
| ESS Human Values Scale (PVQ-21 as fielded) | Declined (rights unresolved) | "European Social Survey documentation is licensed under CC BY-SA 4.0" | https://europeansocialsurvey.org/node/58 | The same 21 items sit in Schwartz's BY-NC-ND repository; who holds the item copyright is unresolved from public pages |
| TwIVI / TIVI | Declined | "WANT TO USE THE TIVI or TwIVI? GO AHEAD. ANYONE CAN USE IT FOR ANY PURPOSE. NO NEED TO ASK ME FOR PERMISSION." | https://gosling.psy.utexas.edu/two-short-measures-of-values-tivi-and-twivi/ | Items are two-sentence third-person portraits, 64–142 characters (longest 23 words): all 20 exceed the 14-word cap; no PL/ES/DE text; shortening would void the inherited evidence (Sandy, Gosling, Schwartz & Koelkebeck 2017, derivation N = 38,049) |
| O*NET Interest Profiler Short Form (60) / Mini-IP (30) | Declined | CC BY-ND: "do not redistribute any modified or extended versions of the tools" · Developer License: "validate all products incorporating content from the Tools" | https://www.onetcenter.org/license_tools.html | A Polish translation is "Adapted Material" and needs a validation study before release. EN and ES verbatim (CC BY-ND) and DE (Roemer, Lewis & Rounds 2023, CC BY 4.0, N = 276 and 672) would be shippable on their own |
| Armstrong, Allison & Rounds RIASEC markers (and the Basic Interest Markers) | Declined | "Permission to use RIASEC Markers is granted for free to all professionals (researchers and practitioners) if it is used for noncommercial purposes." | https://jrounds.weebly.com/riasec-markers-scalesitems.html | Noncommercial despite the paper's "public domain" title |
| ORVIS | **Deferred** — the open route for interests | IPIP public domain (§1.1) | https://ipip.ori.org/newORVISKey.htm | 92 items; eight scales (Leadership, Organization, Altruism, Creativity, Analysis, Production, Adventure, Erudition) map onto Holland's six but are a different construct from `riasec`. Validated EN (Pozzebon, Visser, Ashton, Lee & Goldberg 2010, PMID 20155566; alphas not retrieved, **unverified**). DE: IPIP-hosted Schreiber translation (unvalidated as such); the ZHAW ORVIS-R is a revised 76-item set (norm sample N = 2,338, α .81–.87, retest .74–.85) whose own licence is unstated. PL/ES none |
| Rosenberg Self-Esteem Scale | **Deferred** pending the Morris Rosenberg Foundation | "Dr. Florence Rosenberg, Manny's wife, has given permission to use the Self-Esteem Scale for educational and professional research." (UMD, 2015 Wayback capture; the live UMD pages carry no permission statement) | http://web.archive.org/web/20150610034616/http://socy.umd.edu:80/quick-links/rosenberg-self-esteem-scale | The only verbatim grant is research; a web claim that UMD now calls it public domain was found on no page (**unverified**). The validated Polish SES is PTP-distributed (category B1). Modest fit anyway: one global number |
| SWLS, Flourishing Scale | Declined | "The use of this scale is permitted for non-commercial purposes only." | https://eddiener.com/satisfaction-with-life-scale-swls/ · https://eddiener.com/flourishing-scale-fs/ | Non-commercial; `good-life` already names them as avoided |
| PERMA-Profiler | Declined | "For commercial uses of the measures, contact the Wellbeing Lab." | https://www.peggykern.org/questionnaires.html | Non-commercial; no general German form on the site |
| IPIP-HEXACO | **Deferred** — the open route to Honesty–Humility | IPIP public domain | https://ipip.ori.org/newHEXACO_PI_key.htm | English only (facet α .67–.88; convergent r .56–.83 with HEXACO-PI facets). The Polish adaptation is a 2014 conference paper (Roszczypała, Strus, Cieciuch & Rowiński) with no downloadable text on the UKSW site; no ES/DE |
| Mini-IPIP6 Honesty–Humility items | Markers only | IPIP public domain | https://www.psychology.org.nz/journal-archive/SibleyIPIP.pdf | Four reverse-keyed items (N = 5,562, NZ); English only |
| Open Psychometrics IPIP-FFM raw data (as norms) | Declined | No licence statement; the page says only "For general public edification the data collected through the personality tests on this website is dumped here." | https://openpsychometrics.org/_rawdata/ | N = 1,015,342, but anchors "1=Disagree, 3=Neutral, 5=Agree" differ from IPIP's accuracy scale; licence unknown |

Also examined in the sweeps, outside the decision list:

| Instrument | Licence (verbatim where stated) | Verdict |
|---|---|---|
| Self-Compassion Scale – Short Form | "Dr. Kristin Neff grants permission to use the Self-Compassion Scale Short Form (Raes et al., 2011) any purpose whatsoever, including research, clinical work, teaching, etc." — https://self-compassion.org/wp-content/uploads/2021/03/SCS-SF-information.pdf | Usable; the strengths sweep recommends it as a new instrument (total score only, no clinical language). Validated PL (Holas et al. 2024, PMID 39378142), ES (Garcia-Campayo et al. 2014, PMID 24410742), DE (Beerbaum et al. 2026, PMID 41592557) exist; their wordings' reuse terms were not checked. **No decision yet** |
| Couples Satisfaction Index (CSI-32/16/4) | "Scales developed and validated in the lab and freely available for use." — http://www.courses.rochester.edu/surveys/funk/main.htm | Commercial use and translation not addressed; the pool drew on the DAS, which is commercially licensed. One email (§5). German CSI-4 validated (Körner & Gauglitz 2026, CC BY); no PL |
| IPIP-NEO-120 (30 facets) | IPIP public domain — https://ipip.ori.org/30FacetNEO-PI-RItems.htm | The only free route to facets (EN facet α .63–.88, N = 619,150). PL via the UKSW SF-IPIP-NEO-PI-R (90 items, CC BY; 10 of 30 facets α < .55; conference paper only); ES Mexican text unvalidated; DE none. Candidate for the weaknesses view (Gap 3). **No decision yet** |
| IPIP 6FPQ scales (Murray-style motives: Achievement, Affiliation, Dominance, Autonomy, Order, Understanding, Change …) | IPIP public domain — https://ipip.ori.org/new6FPQKey.htm | Facet α .59–.87; English only; the values sweep suggests a `motives` instrument, framed as motives, not SDT needs. **No decision yet** |
| Mini-IPIP (20) | IPIP public domain — https://ipip.ori.org/MiniIPIPKey.htm | Validated PL (Czerwiński & Atroszko 2020, N = 723 + 765; UKSW IPIP-BFM-20, N = 903) and ES (Martínez-Molina & Arias 2018, *PeerJ* 6:e5542, CC BY 4.0, N = 940); DE none. Four items a scale: a quick form, not a profile. Not adopted; the IPIP-50 was chosen |
| IPIP-VIA (213 items) | IPIP public domain — https://ipip.ori.org/newVIAKey.htm | Parent pool of the VIA-R; α .70–.91; too long |
| IPIP NEO Agreeableness facets (Cooperation α .73, Sympathy α .75) | IPIP public domain — https://ipip.ori.org/newNEOFacetsKey.htm | Markers only, for conflict-style bands or a future empathy profile |
| IPIP JPI-R Traditional Values | IPIP public domain — https://ipip.ori.org/newJPI-RKey.htm | Markers only; politically and religiously loaded; would not translate the Schwartz circle |
| Interpersonal Reactivity Index | "The IRI is freely available for all non-commercial uses … Requests to use the IRI for any commercial project should be directed to davismh@eckerd.edu." | Skip; email worth sending (§5). The author bans total scores and norms, which matches the app |
| Emotion Regulation Questionnaire | "The measures provided here may be used for academic research purposes with appropriate citation." — https://spl.stanford.edu/resources | Research-only; the German deposit is CC BY-NC-ND |
| ECR-RS | No permission statement on the page | PL translation (Marszał) unvalidated; ES validation in 9–14-year-olds; DE none. Skip |
| TEQ, BES, RAS, CRSI | No stated terms (journal copyright) | Skip |
| ROCI-II | Proprietary (priced; the product-page wording is **unverified**) | Skip; add to `conflict-style.avoided` beside the TKI |
| Strengths Use Scale | No terms published (BPS article; PsycTests) | Skip; write own strengths-use items |
| Mental Health Continuum – Short Form | "©2009 Corey L. M. Keyes, All Rights Reserved" | Skip; its flourishing/languishing categories sit near a diagnosis frame |
| BMPN; SSVS; Rokeach Value Survey | No licence found; no terms (descriptors derive from the SVS); out of print, dropped for low reliability by Hanel et al. 2018 | Skip |
| O*NET Work Importance Locator | "These materials are provided 'AS IS' and should be used for research purposes only." — https://www.onetcenter.org/reports/WIL_Archive.html | Retired 2024-06-03; ipsative card sort; raw alphas .33 to −.21 (adjusted .35–.68). Skip; the taxonomy credit in `work-values` stays |
| UWES | "The use is free for academic purposes only, such as PhD theses and scientific papers. For all other purposes, a contract should be drafted." — https://www.wilmarschaufeli.nl/downloads/ | Skip; a state about one's current job |
| Need for Cognition (NCS-18 / NCS-6) | No licence; the items are Cacioppo & Petty's | Skip; the construct is public and can be written fresh |
| MSLQ | "©1991 The Regents of The University of Michigan. All rights reserved." | Skip; course-bound |
| MCTQ / µMCTQ | Terms **unverified** (thewep.org returned certificate errors) | Hold; `chronotype` keeps its own fields |

---

## 5. Open questions and permission requests

### 5.1 Permission requests worth sending

| To | Instrument | Ask | What it unlocks | Translations already validated |
|---|---|---|---|---|
| R. Chris Fraley (the ECR-R page invites contact) | ECR-R | Written permission for a public web app with a paid tier, in four languages | Validated attachment items (IRT; Fraley, Waller & Brennan 2000, N = 1,085) to replace the app's 18 | PL: Lubiewska et al. 2016 (DBZ-R; "Licencja: Żadna"); DE: ECR-RD, Ehrenthal et al. 2009 (ECR-RD8 2021 has representative norms, N = 2,428); ES: Nóblega et al. 2018 (DOI **unverified**). Each adaptation would need its own permission |
| Center for Self-Determination Theory ("Request Commercial License" on the questionnaires page) | BPNSFS **and** Basic Need Satisfaction in Relationships | Commercial licence covering both | The obvious `needs` instrument (24 items, six subscales); the 9-item relationships form answers "what I need from you" in a named relationship, which is the instruction-sheet idea | PL: Kuźma, Szulawski, Vansteenkiste & Cantarero 2020 (PMID 32116867; α .72–.87; 4-week retest .63–.79) and Tabiś et al. 2021; DE: Heissel et al. 2018, short form 2023; ES: Peruvian sample in Chen et al. 2015. Payne & Schimmack 2025 (PMID 40471799) find the satisfaction/frustration distinction "negligible" after bias control — read as bipolar scales |
| The Morris Rosenberg Foundation, c/o UMD Sociology | RSES | Whether the research grant extends to a public app with a paid tier, and to translation | Global self-esteem (modest fit) | PL wording is PTP's (needs PTP consent); DE: von Collani & Herzberg 2003, Roth et al. 2008; ES: Martín-Albo et al. 2007, Gómez-Lugo et al. 2016 |
| Shalom Schwartz, and ESS ERIC (ess@city.ac.uk) | PVQ-21 / Human Values Scale | Who may license the 21 items; whether ESS's CC BY-SA 4.0 documentation licence covers them | A validated values instrument with ESS-fielded PL, ES and DE text (Davidov, Schmidt & Schwartz 2008; German PVQ-21 "largely confirmed" with six value types merged into three, Schmidt et al. 2007) | ESS national questionnaires (TRAPD) |

Lower-value or cheaper asks the sweeps named: **Mark Davis** (IRI, commercial use; davismh@eckerd.edu); **Ron Rogge** (CSI: commercial use, translation, and which items are original to the lab; rogge@psych.rochester.edu); **Samuel Gosling** (TwIVI: a one-line confirmation, since Schwartz co-authored and the DOCX carries no notice); **UKSW** (confirm CC BY for the hosted Polish texts: the FAQ says CC BY, the site footer says "Copyright © 2016 Uniwersytet Kardynała Stefana Wyszyńskiego w Warszawie"); **Najderska & Cieciuch** (Polish IPIP-VIA items, "available upon request") and **Ovejero** (Spanish IPIP-VIA, contact-only), either of which would replace the app's own PL/ES character-strengths translations with ones that have a lineage; **Peggy Kern** (PERMA) only if a scored wellbeing instrument is wanted.

### 5.2 Open questions

1. **VIA versus IPIP.** VIA's terms require permission to "Create an assessment – abridged or otherwise – of the VIA character strengths and virtues" and to "Use the word 'VIA'"; its pages make no mention of IPIP, and the IPIP-VIA-R authors treat the items as public domain. Whether IPIP's grant would hold against a VIA challenge is untested. "VIA" is kept out of titles (done).
2. **IPIP-VIA-R publication status.** The development citation on IPIP's key page ("Bluemke, Partsch, Saucier & Lechner 2021") exists only as a PsyArXiv preprint (CC BY 4.0, rev. 2023); no peer-reviewed version was found. The ZIS record for the German translation could not be loaded. The three-dimension paper (Partsch, Bluemke & Lechner 2022) and the core-strengths paper (Partsch, Olaru & Lechner 2024) are peer-reviewed.
3. **Polish IPIP-IPC.** No psychometrics exist; the UKSW page gives no alphas. The page says "translation exists, unvalidated" and must keep saying so.
4. **Spanish big-five.** Whether Hughes et al. 2020 tested the de Oliveira text is not stated. One option not examined in the notes: the validated Spanish Mini-IPIP (Martínez-Molina & Arias 2018, CC BY 4.0 article; also hosted at https://ipip.ori.org/Spanishmini-IPIPposneg.htm) covers 20 of the 50 English items, which could narrow the evidence gap for those 20 after item-by-item checking.
5. **German big-five.** No validation of the Bielefeld markers exists; the German evidence in the literature belongs to the BFI-10 and BFI-2, which the app cannot use.
6. **Norms.** None exist for any adopted scale under a reusable licence; the Open Psychometrics data has no licence and different anchors. Bands stay descriptive (S4).
7. **The two remaining couple scores.** `love-languages` `fit` and `numerology`'s compatibility total contradict both the literature (§2.2) and the app's own refusal of compatibility figures elsewhere.
8. **Readability gate and borrowed items.** Closed: the gate applies to original items only (§1.4); the 76-character, 16-word core-strength item is reproduced as published.
9. **Citations the audit could not verify and therefore did not rely on:** Van de Vliert & Kabanoff 1990 (DOI 10.5465/256359 returned no Crossref record); Marsh, Hau, Balla & Grayson 1998; Reynierse 2009; McGrath 2019 technical report; Sorokowska et al. 2014 (TIPI-PL); the Polish IPIP-HEXACO adaptation (congress listing only); MCTQ terms.
10. **Translation and reference loose ends.** Closed the same day (§1.4).
11. **Informant form design.** The literature's strongest recommendation has no design yet: the same items answered about the person by a close other; how the second run is stored and shared; which traits to flag as "others see this better" (Vazire 2010) on the comparison.
12. **The ORVIS versus O*NET choice for interests**, if `riasec` is ever replaced: ORVIS is clean in all four locales but 92 items and eight scales; O*NET is six RIASEC types with an official Spanish text and a CC BY German validation, but Polish would need a validation study.
