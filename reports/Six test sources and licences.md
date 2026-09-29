# Build around six tests, never from them

The app cannot legally rebuild any of the six tests, and it does not need to. 16Personalities, bdsmtest.org, MTQ48, CliftonStrengths, FRIS and MMPI-2 all keep their item text and scoring keys unpublished or reserved. Three of them (16Personalities, bdsmtest.org and CliftonStrengths) compute results on their own platforms, using algorithms nobody outside has seen. Every GitHub repository found that carries their items is an illegitimate source, whatever licence badge it wears, because an MIT, BSD, Unlicense or CC0 tag from someone who does not own the text grants nothing. The only legitimate GitHub material is data or code built around open instruments. The evidence behind the six is also thinner than their reach. 16Personalities, FRIS and CliftonStrengths rest almost entirely on vendor-published figures. Independent teams repeatedly fail to confirm MTQ48's factor structure. bdsmtest.org publishes no psychometrics at all. MMPI-2 is a clinical instrument built to detect psychopathology, and courts have enforced its owners' rights. Only one pool is free for any purpose, including commercial use and translation into PL, EN, ES and DE: the public-domain International Personality Item Pool (IPIP). The notes found one openly licensed specialist instrument worth adopting, the CC BY 4.0 Sadomasochism Checklist. The recommendation:

- Build none of the six.
- If the app wants a 16P-style four-letter code, derive it from the existing `big-five` scores.
- Build a resilience view and a character-strengths profiler from open material.
- Treat the Checklist as an optional `intimacy-map` extension.
- List FRIS and the MMPI family as avoided.

Any borrowed item, even a public-domain one, would make the app's disclaimer that "every questionnaire in this app writes its own items" false for that instrument. The disclaimer text has to change when the code does.

## 16Personalities is a reworked Big Five that the app already measures

16Personalities is the "NERIS Type Explorer®" from NERIS Analytics Limited. It is a **five-scale trait questionnaire presented as four-letter type codes**. Its aspects are:

| Aspect | Poles |
|---|---|
| Energy | Introverted / Extraverted |
| Mind | Intuitive / Observant |
| Nature | Thinking / Feeling |
| Tactics | Judging / Prospecting |
| Identity | Assertive (-A) / Turbulent (-T) |

NERIS says it has "not incorporated Jungian concepts such as cognitive functions" and has instead chosen to "rework and rebalance the dimensions of personality called the Big Five" ([16Personalities, Our Theory](https://www.16personalities.com/articles/our-theory)). Its AI-reference page calls the test "a scale-based, five-trait model" with "percentage-based trait scores" that takes about ten minutes ([16Personalities, for-ai](https://www.16personalities.com/for-ai)). The current site puts Energy on I/E and Mind on N/O, while some third-party write-ups have the two swapped. When the labels changed is **unverified**.

The publisher is an English company (no. 8646330, Cambridge). Its terms were last updated 9 September 2025 ([16Personalities Terms](https://www.16personalities.com/terms)). They:

- forbid anyone to "reproduce, translate or reverse engineer material";
- ban automated scraping without written consent;
- declare the products "for personal use only and … not intended for use in any business, educational, employment or recruitment context".

**What is public about the questions is their count and format, nothing more.** The one external factor-analysis paper describes the scale as "60 statements" ([Makwana & Dave 2020, IAEME PDF](https://iaeme.com/MasterAdmin/Journal_uploads/IJM/VOLUME_11_ISSUE_9/IJM_11_09_025.pdf)). Third-party code examined for the notes, itself illegitimate (see below), shows a seven-point agree–disagree scale. Scoring has never been published: the public pages describe only "percentage-based trait scores" on "five independent spectrums" ([for-ai](https://www.16personalities.com/for-ai)). The notes found that the calculation runs on NERIS's own servers. Whether the 60 items are fixed or adaptive is undocumented. Neither the items nor the scoring can be reused, and reconstructing the scoring by probing the site would breach the reverse-engineering and scraping clauses.

**The evidence is NERIS's own, unauthored and unreviewed.**

- **NERIS's self-published psychometrics** ([16Personalities, Reliability and Validity](https://www.16personalities.com/articles/reliability-and-validity)):
  - Internal consistency: alphas of **.75–.87** (n = 10,000).
  - Retest after five to seven months: correlations of **.74–.83** (n = 2,900).
  - No authors, technical manual, peer review or comparison against any external instrument.
- **The one outside "validation"** is Makwana & Dave (2020) in IAEME's *International Journal of Management* ([SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3709640)):
  - 1,067 management students in Gujarat; CMIN/DF 2.76, RMSEA .032.
  - Alphas given only as "between 0.70 and 0.90".
  - No stated permission from NERIS.
  - The journal's standing is doubtful but **unverified**.
- **Critique of the type format** comes from the MBTI literature:
  - McCrae and Costa (1989) found no support for truly dichotomous types. They also found that the four indices "did measure aspects of four of the five major dimensions of normal personality" ([Wiley abstract](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-6494.1989.tb00759.x)).
  - Pittenger (1993) concluded the MBTI "does not conform to many basic standards expected of psychological tests" ([ERIC EJ475507](https://eric.ed.gov/?id=EJ475507)).
  - The widely repeated claim that about half of people get a different type on retest after five weeks could not be traced to Pittenger's primary text and remains **unverified**.
- **A rival publisher's comparison.** Open Psychometrics compared its own OEJTS with 16Personalities (n = 449 in that arm) and found 25–40% more differentiating power on three dichotomies. A competitor ran that study ([OEJTS comparison](http://openpsychometrics.org/tests/OEJTS/comparison/)).

The notes infer a mapping onto the Big Five: E/I ≈ Extraversion, N/S ≈ Openness, T/F ≈ reversed Agreeableness, J/P ≈ reversed Conscientiousness, and A/T ≈ Neuroticism. That mapping comes from the literature, not from NERIS, which publishes no Big Five correlations. NERIS's own figures show the scale scores as reasonably reliable. The type code, though, is a hard cut of those scores, so anyone near 50% on a scale can flip letters on retest while barely moving.

**The most credible sources** are NERIS's own theory, reliability, terms and AI-reference pages for what the test claims, and McCrae & Costa and Pittenger for the critique.

**No GitHub repository gives legitimate access to NERIS items or scoring.** These are not legitimate sources, because they scrape, copy or proxy the site:

- SwapnilSoni1999/16personalities-api (despite its MIT tag)
- ghdtjdwls08/16personalities-API
- nguyentienhoang810/16personalities
- the gist deedy/7db1cbc6e8095cfbed037d0f185d5189 (likely)

The rest are also unusable:

- **80x24/mbti-test** automates the live site against its terms.
- **1574802103/MBTI_Test_16Personalities** has unknown provenance. It may reproduce MBTI material (**unverified**).
- **Jeffx5-SHA/16MBTI-16personalities-, CashewRose/PersonalityType and Gardahadi/16-personalities-python-api** carry no licence, so nothing in them is reusable.
- **The Kaggle "16 Personalities" dataset** (anshulmehtakaggl) is not legitimate. Its own description admits the responses are synthetic ([Kaggle](https://www.kaggle.com/datasets/anshulmehtakaggl/60k-responses-of-16-personalities-test-mbt)).

The legitimate open-type repos wrap the OEJTS, whose content is **CC BY-NC-SA 4.0, not public domain**:

- [m27frogy/JungI](https://github.com/m27frogy/JungI) is GPL-3.0.
- [openjung/core](https://github.com/openjung/core), [DomBruno/OpenJungTypes](https://github.com/DomBruno/OpenJungTypes) and [GitCMDR/OpenSourcePersonality](https://github.com/GitCMDR/OpenSourcePersonality) have no code licence.

For public-domain Big Five content, [rubynor/bigfive-web](https://github.com/rubynor/bigfive-web) (MIT, 952 stars, multilingual IPIP-NEO bank) is the most usable repo. [kholia/IPIP-NEO-PI](https://github.com/kholia/IPIP-NEO-PI) holds public-domain items, but its code is unlicensed.

**Of the two open routes, only IPIP is clean.**

- **OEJTS/OJTS.** OEJTS 1.2 has 32 bipolar items on a 1–5 scale; OJTS 2.1 has 48 questions. Both publish their scoring: the printable [OEJTS 1.2 PDF](https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf) contains a linear key, not reproduced here. Both are CC BY-NC-SA 4.0 and come with "no guarantees of reliability or accuracy". Open Psychometrics' own pages disagree on the item count: 48 selected, "forty scored", 32 and 60 ([OEJTS development](https://openpsychometrics.org/tests/OEJTS/development/); [OJTS](https://openpsychometrics.org/tests/OJTS/)). The non-commercial clause collides with the app's declared premium tier (`PREMIUM_FEATURES = ["numerology.compatibility"]` in [entitlements.ts](/Users/pl2mac0030/Projects/my-instructions/web/src/core/entitlements.ts)). ShareAlike would bind any derivative bank.
- **IPIP.** IPIP grants use "for any purpose, commercial or non-commercial" ([IPIP permissions](https://ipip.ori.org/newPermission.htm)). The 50-item Big-Five markers have alphas of **.79–.87** and the 100-item version **.88–.91** ([IPIP Big-Five key](https://ipip.ori.org/newBigFive5broadKey.htm)). The IPIP-NEO-120 has facet alphas of .63–.88 in an internet sample of 619,150 ([IPIP-NEO-120](https://ipip.ori.org/30FacetNEO-PI-RItems.htm)).
- **Norms.** Open Psychometrics publishes **1,015,342 anonymous IPIP-FFM responses**, but the raw-data page states no licence ([Open Psychometrics raw data](https://openpsychometrics.org/_rawdata/)).

**The app already measures every 16P dimension with its own items.**

- **`jungian`** asks 40 original items and scores eight functions independently. It derives the four-letter code from the function stack with a confidence margin, and maps codes onto Keirsey's temperament cut under the app's own names ([jungian/spec.ts](/Users/pl2mac0030/Projects/my-instructions/web/src/instruments/jungian/spec.ts)).
- **`big-five`** measures the same constructs continuously. Its `reactivity` factor covers the Assertive/Turbulent pole ([big-five/items.ts](/Users/pl2mac0030/Projects/my-instructions/web/src/instruments/big-five/items.ts)).
- **The repo already rejected 16P.** `docs/candidate-instruments.md` lists "MBTI / 16 Personalities" under "Explicitly not worth doing".

Only the presentation would be new:

- an "INTJ"-style code with per-axis percentages and an -A/-T-style suffix, read directly from `big-five` scores (closer to NERIS's actual Big-Five method than the `jungian` stack is);
- an introversion × reactivity quadrant under app-owned names;
- a "translate your 16P result" helper where users type their own code.

None of these may use NERIS's profile prose, Role or Strategy names, or Assertive/Turbulent wording. A `big-five`-derived code can disagree with the `jungian` code, and the evidence block must say so. **Recommendation: do not build a 16P instrument.** Treat the derived code as an optional presentation layer. If validated wording matters, swap `big-five` to the IPIP markers, which would give the -A/-T equivalent a published α of .86.

## bdsmtest.org publishes nothing reusable, and the Sadomasochism Checklist is the open alternative

bdsmtest.org is an anonymous project that describes itself as "a near-zero-budget, non-profit project, entirely run by volunteers", founded in 2014 "to help beginner kinksters see which labels fit them and which don't". Its other self-reported claims:

- it has been "taken by over 100 million people worldwide" (self-reported and unaudited);
- its FAQ says the authors have chosen not to be publicly identified, and that all public authorship claims are incorrect.

A secondary site names a creator called "Ged", which is **unverified** and contradicted by the FAQ ([bdsmtest.org site bundle](https://bdsmtest.org/js/app.min.js?hash=20260615210321); [Odd Culture](https://oddculture.com/bdsm-test/)). It reports **0–100% "fit" on 25 archetypes**. That set changes over time: a circa-2022 FAQ says Vanilla was removed for poor prediction quality, and it is back in 2026 ([angelod1as/bdsmtest i18n](https://github.com/angelod1as/bdsmtest/blob/HEAD/i18n/en.json); [bdsmtest.org/info](https://bdsmtest.org/info)). It is not purely non-commercial in effect. Its code promotes a dating app "made in collaboration with BDSMTest" that uses the results, and a 2020 capture showed ads ([Wayback 2020](https://web.archive.org/web/20200107081104/http://bdsmtest.org/)).

**What is known about the items is historical; what is known about scoring is only that it is hidden.**

- **2015 version:** 96 agree/disagree statements over eight pages. A banner admitted some items did not affect results. Its preliminary page offered age bands of "15 years old or younger" and "16-17 years old" ([Wayback 2015](https://web.archive.org/web/20150107183056/http://bdsmtest.org/)).
- **From 2017:** the test moved into a JavaScript app.
- **By about 2022:** it served "individualized questions" adaptively.
- **Today:** it asks for agreement on a seven-point scale plus "No idea", behind an 18+ confirmation and reCAPTCHA, in 18 languages ([site bundle](https://bdsmtest.org/js/app.min.js?hash=20260615210321)).

Item text is not in the site's public code. The server serves the items and scores the answers, and the FAQ says individual answers are "not retrievable" afterwards. The results screen shows percentiles against everyone, men, women, non-binary people and age groups, so the site holds norms it has never published. A third-party wrapper claims 93 items in a "normal" mode plus a "fast" mode, and secondary sites mention 10- and 25-minute versions; all of this is **unverified**.

**No psychometric evidence exists to cite.** The site publishes no methodology, reliability, factor or validity data. Europe PMC and OpenAlex full-text searches for "bdsmtest.org" return zero hits ([Europe PMC](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%22bdsmtest.org%22&format=json)). One peer-reviewed paper uses it as a data source rather than as a measure. La Corte (2023) cluster-analysed **236,353 result profiles** and concluded that "no binary opposition or single spectrum constitutes a workable typology". How those profiles were obtained is **unverified** ([PubMed 35166194](https://pubmed.ncbi.nlm.nih.gov/35166194/)). The authors of the Kink Orientation Scale note "limited validated measures related to kink" and do not list bdsmtest.org among them ([Wignall et al. 2024](https://sure.sunderland.ac.uk/id/eprint/18006/1/The%20Kink%20Orientation%20Scale%20Developing%20and%20Validating%20a%20Measure%20of%20Kink%20Desire%20Practice%20and%20Identity.pdf)). **The most credible sources** are the site's own FAQ and about text, Wayback captures and La Corte.

**Silence is not a licence.** The site has no terms page, no licence and no copyright notice in any language, so default all-rights-reserved copyright applies to anonymous authors. The FAQ says anyone may "feature BDSMTest", mention it, or "use it in psychology research" without prior permission, and offers written consent by email. That covers linking to the test or having people take it. It does not cover copying, translating or re-scoring the items ([site bundle, FAQ](https://bdsmtest.org/js/app.min.js?hash=20260615210321)). In a 2022 email, the owner said previous contributors had to sign over intellectual property ([angelod1as/bdsmtest ADR 0001](https://github.com/angelod1as/bdsmtest/blob/HEAD/docs/decisions/0001-gplv3-license.md)). The app already records this: `intimacy-map` lists "bdsmtest.org questions and archetype names" under `avoided` ([intimacy-map/provenance.ts](/Users/pl2mac0030/Projects/my-instructions/web/src/instruments/intimacy-map/provenance.ts)).

**GitHub has no current item set, but several repos are still not legitimate.** Across 17 cloned repos, the notes found **0 of 94** archived 2015 items verbatim. None of the repos examined holds the current items. These are not legitimate sources:

- **bdsmtests/bdsmtests.github.io and bdsmcompass/bdsmcompass.github.io** (MIT). Their quiz items appear to paraphrase the 2015 site items.
- **MCmoderSD/BDSM-Test-API** (BSD-3). It redistributes the site's own copy without evident permission.

The others are not item sources either:

- **[angelod1as/bdsmtest](https://github.com/angelod1as/bdsmtest)** is a GPL-3.0 front-end refactor, now dead. It contains no items and no scoring.
- **Zizuixixiang/cedartoy** drives the live site. Building on that private interface would be unlicensed use.
- **Result tooling** (TwrFyr/bdsmtestplotter, bartoszluka/bdsm-compatibility, zmbush/bdsm-cmp-bot, TheFallenSpirit/es-bdsmtest-proxy) handles users' own results.
- **Unlicensed or unsourced repos:** nullisnotempty/bdsmtestorgKOR is an unlicensed translation layer; douchmond/bdsm_test_analysis holds charts of unstated origin; Copoder/bdsm-test and bdsm-tests/bdsm-tests.github.io are unlicensed hobby quizzes.

No public response dataset exists.

**The Sadomasochism Checklist (SMC) is the only open, peer-reviewed role instrument the notes found.** It is Weierstall & Giebel (2017), *Archives of Sexual Behavior* 46(3), published under **CC BY 4.0**, which permits translation and adaptation with credit and a note of changes ([KOPS repository PDF](https://kops.uni-konstanz.de/bitstream/123456789/38760/1/Weierstall_0-406521.pdf)).

- **Structure:** 24 practices, each asked in a dominant voice and a submissive voice, in six clusters: soft play, domination, beating, toys, breath control, bodily fluids.
- **Response format:** experience (none, fantasy, real life) and pleasure (0–4).
- **Scoring:** one total pleasure score per role. The authors advise against cluster subscores and against summing experience.
- **Reliability:** Submission α = .96, Dominance α = .89.
- **Sample:** 652 German adults, 527 of them from the SM community. The totals separated self-identified dominants, submissives, switches and a conventional group.
- **Stated limitations:** the list is not exhaustive and content validity needs further proof.
- **Independent reuse:** Selič & Jug (2025) used an adapted version, α = .96, N = 318 ([Behavioral Sciences, CC BY](https://pmc.ncbi.nlm.nih.gov/articles/PMC12190122/)).
- **Caveat:** the item wordings are images in the repository PDF and must be transcribed and checked before use.

The other candidates fail:

- **The Kink Orientation Scale** is validated but **CC BY-NC-ND**. ND forbids translation, which rules it out for an app shipping DE, ES and PL, and it measures kink engagement rather than role ([Wignall et al. 2024](https://sure.sunderland.ac.uk/id/eprint/18006/1/The%20Kink%20Orientation%20Scale%20Developing%20and%20Validating%20a%20Measure%20of%20Kink%20Desire%20Practice%20and%20Identity.pdf)).
- **The BDSM Proclivity Scale and IFAKBDSM** have unverified licences.
- **Research practice** still measures role by self-identification ([Li 2024, CC BY](https://pmc.ncbi.nlm.nih.gov/articles/PMC11176214/); [Wismeijer & van Assen 2013](https://pubmed.ncbi.nlm.nih.gov/23679066/)).
- **No validated instrument** maps onto archetypes like those bdsmtest reports.

**An archetype test would add exactly what the app refuses to do.**

- **`intimacy-map`** asks 50 original items per direction as a/b facing pairs, persists nothing beyond the session, and deliberately dropped a role axis.
- **`attraction`** "assigns no identity at all".
- **`intimacy-conditions`** produces no numbers ([attraction/provenance.ts](/Users/pl2mac0030/Projects/my-instructions/web/src/instruments/attraction/provenance.ts); [intimacy-map/spec.ts](/Users/pl2mac0030/Projects/my-instructions/web/src/instruments/intimacy-map/spec.ts)).

The SMC's clusters largely overlap `intimacy-map`'s power, words and watching sections. The new ground would be:

- the two role totals;
- domains the map omits: breath control and bodily fluids (both high-risk, needing safety framing), rope as distinct from generic restraint, and age, pet and primal play;
- an experience versus fantasy distinction.

**Recommendation: do not build a bdsmtest-style archetype test.** If the domain matters, extend `intimacy-map` inside its session-only model, either with original a/b items for the missing domains or with SMC items under CC BY attribution. The SMC route would make this the app's first instrument with licensed items. Whether the adults-only gate covers `intimacy-map` is **unverified**.

## MTQ48 sells a contested four-factor model through licensed users only

MTQ48 is AQR International's **48-item, five-point Likert questionnaire** of the "4Cs". It extends Kobasa's hardiness construct by adding Confidence. Items per scale:

| Scale | Items | Subscales |
|---|---|---|
| Challenge | 8 | — |
| Commitment | 11 | — |
| Control | 14 | Emotional Control 7, Life Control 7 |
| Confidence | 15 | Confidence in Abilities 9, Interpersonal Confidence 6 |

Sources: [AQR Technical Manual](https://aqrinternational.co.uk/wp-content/uploads/2018/02/i2KDVs89QCTbXMjhOeSQ_The-MTQ48-Technical-Manual.pdf); [Vaughan, Hanna & Breslin 2017](https://ray.yorksj.ac.uk/id/eprint/2556/1/Psychometrics%20of%20the%20MTQ48%20SEPP%20Manuscript%20(Final).pdf).

**Scoring and reporting.** The instrument gives a total plus four or six subscale scores. They are reported as **stens (mean 5.5, SD 2) against AQR's proprietary global norm**, and the English comparison sample is 38,363 people. AQR's own guide tells practitioners not to give results in stens ([AQR User Guide 2022](https://aqrinternational.co.uk/wp-content/uploads/2022/03/MTQ-User-Manual-2022.pdf)).

**Authorship and date: sources disagree.** AQR credits Clough, Earle and Strycharczyk, with publication in 2002; the academic origin is a 2002 chapter by Clough, Earle and Sewell (development sample n = 963). SMG/KRC's Polish page instead dates it to 2004 and omits Earle ([SMG/KRC](https://smgkrc.com/narzedzia-i-testy/kwestionariusz-mtq48)).

**The MTQ family.** Every short form is a subset of the proprietary items:

- **MTQPlus:** eight subscales, but its item count is unresolved (63, 68, 73 or 74 depending on the source).
- **MTQ18:** unidimensional, r = .91 with the MTQ48 total.
- **MTQ-10.**
- **Short and Very Short MTQ** (18 and 6 items), from Kawabata et al. 2021 ([AQR product page](https://aqrinternational.co.uk/mtq48-mental-toughness-questionnaire); [Dagnall et al. 2019](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.01933/full)).

**Access in Poland runs through two gates: a licence and a per-use fee.** "Licensed user training is a requirement to use the MTQ48 assessment". The online course takes about eight to ten hours ([AQR training](https://aqrinternational.co.uk/product/online-licensed-user-training-mtq48)). Polish prices:

- **SMG/KRC** sells a feedback session with a developmental report through a named licensed consultant: **550 PLN in person, 450 PLN online**. It claims mental toughness accounts for as much as 25% of effectiveness, echoing AQR's "around 25% of the variation" ([SMG/KRC](https://smgkrc.com/narzedzia-i-testy/kwestionariusz-mtq48)).
- **An independent consultant** charges 470 PLN for MTQ48 and 630 PLN for MTQPlus ([martajagodzinska.pl](https://www.martajagodzinska.pl/mtq48-odpornosc-psychiczna)).
- **AQR's own 2018 Polish MTQ48 Sport licensing workshop** cost 1,850 PLN ([AQR event](https://aqrinternational.co.uk/event/odpornosc-psychiczna-w-sporcie-warsztat-licencyjny-mtq48-sport)).

**Items are not published and no open licence exists.** AQR's guide reads "All rights reserved", and the Technical Manual is © AQR International 2015. Journal articles print only one or two example items. The CC BY licence on Dagnall et al. covers the article, not AQR's instrument ([AQR User Guide 2022](https://aqrinternational.co.uk/wp-content/uploads/2022/03/MTQ-User-Manual-2022.pdf); [Dagnall et al. 2019](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.01933/full)). No public research-use grant was found for MTQ48 or MTQ18, and whether the 2002 chapter prints all 48 items is unknown. Scores only mean something against AQR's norm table, so even a holder of the items could not produce MTQ-comparable stens without it.

**The developer's figures are good; independent replication mostly fails.**

- **AQR's Technical Manual:**
  - Alphas: **.91** for the whole scale and **.70–.81** for subscales. The manual admits Emotional Control "has not achieved the 0.70 cut off" on occasion.
  - Test–retest: .90.
  - Structural fit on an English sample of 8,207 (the Perry et al. 2013 data): CFI = .94, RMSEA = .03. Clough co-authored that paper.
- **Independent teams:**
  - **Gucciardi, Hanton & Mallett (2012)**, N = 1,325: neither CFA nor ESEM confirmed the four- or six-factor model.
  - **Birch et al. (2017)**, two athlete samples: supported neither model ([IJSP](https://www.ijsp-online.com/abstract/view/48/331)).
  - **Vaughan et al. (2017)**, N = 1,096: the six-factor model reached acceptable fit only with "weak intended loadings and cross-loading items" in every factor. They advised caution with elite athletes.
  - **Kawabata et al. (2021)**, two samples of about 2,200 and 3,200 students: "none of one-, four- and six-factor models with 48 items satisfactorily fit" ([PubMed 33145967](https://pubmed.ncbi.nlm.nih.gov/33145967/)). A secondary summary adds that only 13 of 48 items were judged content-valid, which is **unverified**.
  - **Dagnall et al. (2019):** the MTQ-18 fit poorly (CFI .640), and the MTQ-10 did better.
- **What the total tracks.** It correlated **.68 with self-efficacy and −.57 with trait anxiety** in the original work, so it largely indexes low neuroticism plus self-efficacy ([Vaughan et al. 2017](https://ray.yorksj.ac.uk/id/eprint/2556/1/Psychometrics%20of%20the%20MTQ48%20SEPP%20Manuscript%20(Final).pdf)).
- **The Polish adaptation is unpublished.** A reseller says it was "validated" in 2006 with the University of Hull, but no report, sample or norms are public ([BizYou](https://bizyou.pl/wydarzenia/certyfikacja-mtq48-certyfikacja-mtqplus-pomiar-i-rozwoj-odpornosci-psychicznej/)). A second named standardiser is **unverified**.

**The most credible sources** are Vaughan et al.'s open author manuscript as the best independent summary, AQR's manuals for the vendor's claims, and Kawabata and Dagnall.

**GitHub offers one clean dataset and no item bank.**

- **Legitimate:** [ben-domingue/irw](https://github.com/ben-domingue/irw/blob/main/data/benchelbi_2021_mtq48.py) loads CC BY 4.0 Arabic-language MTQ48 response data (853 Tunisian respondents × 48 items, from Zenodo) with no item text. It is legitimate, but useful only for psychometric reanalysis.
- **Not legitimate:** xdenniepe/mental-toughness-quiz (unlicensed, apparently MTQ18-derived) and mahledi/RewirePerform (it embeds other published sport instruments whose reuse terms are unverified).
- **Not relevant:** issameddinebenchelbi/article1MT is empty, NathanWycoff/MentalToughness is research code for an unconfirmed instrument, and jai960216/MentalFit contains only a placeholder.

**IPIP covers four of the five 4C subscales; the named resilience scales are all restricted.** IPIP has no "mental toughness" or "resilience" label ([IPIP scale index](https://ipip.ori.org/newIndexofScaleLabels.htm)). Its public-domain scales map onto the model like this:

| 4C subscale | IPIP scale | Source |
|---|---|---|
| Emotional Control | Vulnerability (NEO N6, α .82) and Anxiety (N1, α .83), both reversed | [IPIP NEO key](https://ipip.ori.org/newNEOKey.htm) |
| Life Control | Levenson's Locus of Control | [IPIP scale index](https://ipip.ori.org/newIndexofScaleLabels.htm) |
| Commitment | Industry/Perseverance (α .81) | [IPIP VIA key](https://ipip.ori.org/newVIAKey.htm) |
| Confidence in Abilities | Self-Efficacy (NEO C1, α .78) | [IPIP NEO key](https://ipip.ori.org/newNEOKey.htm) |
| Interpersonal Confidence | Assertiveness (E3, α .84) | [IPIP NEO key](https://ipip.ori.org/newNEOKey.htm) |
| Challenge | No clean analogue | — |

The named alternatives all carry restrictions:

- **Mental Toughness Index** (Gucciardi et al. 2015; eight items, unidimensional): "copyrighted and cannot be … used for commercial purposes unless prior permission" is obtained ([Gucciardi, Questionnaires](http://www.danielgucciardi.com.au/questionnaires.html)).
- **CD-RISC:** "a proprietary protocol" that "requires a licensing agreement" ([PhenX](https://www.phenxtoolkit.org/protocols/view/870601)).
- **Grit scales:** non-commercial and "not for wide public distribution" ([Duckworth measures](https://www.angeladuckworth.com/measures)). A meta-analysis found grit "very strongly correlated with conscientiousness" ([Credé et al. 2017](https://pubmed.ncbi.nlm.nih.gov/27845531/)).
- **Brief Resilience Scale:** circulates as "open access", but no explicit licence from its authors was found ([EdInstruments](https://edinstruments.org/instruments/brief-resilience-scale-brs)).
- **Mental Toughness Scale and Sports Mental Toughness Questionnaire:** licence terms unknown.

**Much of this already exists in the app, with two genuine gaps.**

- **Emotional control:** `big-five` reactivity items already cover setbacks, overwhelm and calm under pressure.
- **Commitment:** conscientiousness covers follow-through.
- **Interpersonal confidence:** `hexaco` extraversion covers "confident of being welcome" ([big-five/i18n/en.ts](/Users/pl2mac0030/Projects/my-instructions/web/src/instruments/big-five/i18n/en.ts); [hexaco/i18n/en.ts](/Users/pl2mac0030/Projects/my-instructions/web/src/instruments/hexaco/i18n/en.ts)).
- **The gaps:** Challenge (threat versus opportunity appraisal) and Life Control (agency) are not targeted.

**Recommendation: build from the open alternative.** Make a 4C-style resilience view from existing `big-five` and `hexaco` items, plus a few original Challenge and Life-Control items, optionally anchored by IPIP markers. The `avoided` list should name:

- MTQ48, MTQPlus, MTQ18, MTQ-10 and the Short/Very Short MTQ
- CD-RISC
- Grit
- the Mental Toughness Index
- the Sports Mental Toughness Questionnaire and the Mental Toughness Scale

Keep "MTQ" and "4Cs Mental Toughness" out of product names. Their trademark status was not checked.

## CliftonStrengths forbids even renamed clones, so character strengths come from IPIP-VIA-R

**"177 items" is two revisions out of date.** Gallup's February 2026 Technical Report (Asplund & Harter, 372 pages) documents **196 paired statements**. Each is answered on a five-point scale with "Strongly Describes Me" at both ends and a neutral midpoint, with 20 seconds per item. The item count has changed several times ([Gallup Technical Report 2026](https://www.gallup.com/file/services/176321/Clifton%20StrengthsFinder%202.0%20Technical%20Report.pdf); [2023 report mirror](https://theryleygroup.com/wp-content/uploads/2024/05/CliftonStrengths-Technical-Report.pdf)):

| Year | Items | Themes |
|---|---|---|
| 1999 launch | 180 | 35 |
| 2006 | 177 | 34 |
| 2023 report | 200 | 34 |
| 2026 report | 196 | 34 |

The 34 themes fall into four domains: Executing, Influencing, Relationship Building and Strategic Thinking. The test is administered only on Gallup's platform through a purchased access code, calibrated for ages 16+, available in 25+ languages, and completed by more than 36 million people. Most people receive their Top 5 themes; a growing share get all 34.

**Public:** the format, how many items feed each theme, and the share of cross-linked items. **Private:** the items, the key and the theme descriptions.

- **The algorithm.** Gallup writes that "the precise algorithm is not disclosed". It describes response values aggregated per theme, standardised, then ranked within the person.
- **Items per theme** range from **7 to 13**.
- **The source of ipsativity:** "in 26% of the items, each of the two statements within that item is linked to a separate theme". Gallup calls the result "quasi-ipsative".
- **Example items:** the Technical Report shows one illustrative pair only.
- **No Thurstonian IRT.** Gallup did not fit it, the model the forced-choice literature recommends, saying a 34-dimensional model "exceeds the current capabilities of available open-source software". It treated responses as three-point ordinal data instead ([Gallup Technical Report 2026](https://www.gallup.com/file/services/176321/Clifton%20StrengthsFinder%202.0%20Technical%20Report.pdf)).

**Reliability is moderate and validity is mostly Gallup's own.**

- **Gallup's figures:**
  - omega **.62–.78** and alpha .61–.77 across themes (n = 53,848);
  - six-month full-profile retest of **.73**, with themes ranging .63–.82 (n = 12,355);
  - IRT marginal reliabilities of .63–.77;
  - domain–Big Five correlations of .73 (Strategic Thinking–Openness), .59 (Relationship Building–Agreeableness), .58 (Influencing–Extraversion) and .49 (Executing–Conscientiousness), with no domain above .14 on Emotional Stability.
- **Validity evidence** consists of Gallup-run, quasi-experimental meta-analyses of client data.
- **Stated purpose:** Gallup says the test is "not a tool for mental health diagnosis or employee selection".
- **Independent critique:**
  - Reid & Short (2024) judged the evidence for use in higher education insufficient and its psychometrics "weak and flawed". Their specific numbers are known only through Gallup's rebuttal, because the paper is paywalled ([APA PsycNet](https://psycnet.apa.org/record/2025-34934-001); [Gallup response](https://www.gallup.com/file/cliftonstrengths/en/652592/The_Real_Reliability_and_Validity_Evidence_for_CliftonStrengths_in_Higher_Education.pdf)).
  - Chara & Eppright (2012) showed that themes measured by more items are less likely to reach the Top 5. That imbalance persists in the 7-to-13-item design ([PubMed](https://www.ncbi.nlm.nih.gov/pubmed/23045864)).
  - Brown & Maydeu-Olivares (2013) showed that classical scoring of forced-choice data distorts reliability and validity unless it is modelled with Thurstonian IRT ([PubMed](https://pubmed.ncbi.nlm.nih.gov/23148475/)).
  - A 2021 paper directly testing Gallup's "many scales reduce ipsativity" argument was located, but its conclusion was not read ([Schulte et al. 2021](https://doi.org/10.1177/0013164420934861)).
- **The notes' inference:** theme reliabilities of about .62–.78 are too modest to separate adjacent ranks among 34 closely spaced scores.

**Gallup's terms close off clones, including renamed ones.**

- **Trademarks:** Gallup claims "CliftonStrengths", "StrengthsFinder" and each of the 34 theme names.
- **Copyright:** Gallup's licensing lead says Gallup holds copyright on "all of the short and long descriptions" ([Gallup webcast 2021](https://www.gallup.com/cliftonstrengths/en/350171/partnering-with-gallup.aspx)).
- **Product Terms** (updated 17 October 2025; [Gallup Product Terms](https://login.gallup.com/Home/ProductTerms)):
  - they bar anyone to create "applications, digital tools, or platforms that use Gallup's intellectual property (such as its assessments, research content, or frameworks, including the 34 Themes of Talent)" without written permission;
  - they forbid "based on" claims;
  - they restrict references to "factual or descriptive purposes".

A renamed 34-theme, four-domain structure therefore conflicts with the terms for anyone bound by them, and reused theme names risk trademark confusion for everyone. This is a risk assessment, not legal advice. **The most credible sources** are the 2026 Technical Report itself (vendor-authored but detailed), the Product Terms, Reid & Short, and Chara & Eppright.

**GitHub holds imitations, not Gallup's bank.** An exact-phrase probe for the report's example item returned nothing. GitHub's exact-phrase search is unreliable, though, so the absence of leaked items is not proven. These imitation quizzes are not legitimate sources, because they use Gallup's marks and are unvalidated:

- copterk/Gallup-CliftonStrengths-survey-clone
- alexivanovvv/clifton-strengths-test
- fransiskusb/clifton
- elyunque/CliftonStrengths
- tungpham42/clifton
- wh131462/gallup-strengths
- Zenobia000/gallup-strengths-assessment
- valiramhr/forzamap
- JiaheWSX-thu/talent-trainer

Some tools only visualise a team's existing results and use the theme names only as data. They are low-risk but still subject to the marks: [jrg94/clifton-strengths-viz](https://github.com/jrg94/clifton-strengths-viz), [tomaztk/Clifton_Strengths_R_analysis](https://github.com/tomaztk/Clifton_Strengths_R_analysis), [pjanczewski-acc/CliftonApp](https://github.com/pjanczewski-acc/CliftonApp) and [jeremyprice/strengths_name_tents](https://github.com/jeremyprice/strengths_name_tents). The one clean asset is [Emotion-Bien-etre-Apprentissage/afe-strength-use-french](https://github.com/Emotion-Bien-etre-Apprentissage/afe-strength-use-french). It is CC0 and holds data and scripts for a French validation of the Strengths Use Scale.

**IPIP-VIA-R is the legal route to what the app lacks.** IPIP offers three strengths banks:

- **IPIP-VIA:** 24 scales and 213 keyed items, with alphas of .70–.91 ([IPIP-VIA key](https://ipip.ori.org/newVIAKey.htm)).
- **IPIP-VIA-R** (Bluemke et al. 2021): **96 balanced items**, two positively and two negatively keyed per strength. Mean omega is .75 (Germany) and .76 (UK); retest is .74 and .66; Self-regulation is the weakest scale ([IPIP-VIA-R key](https://ipip.ori.org/IPIP-VIA-R_Key.html); [table](https://ipip.ori.org/IPIP-VIA-R_Table.html)).
- **Three core strengths:** an 18-item set ([IPIP core strengths](https://ipip.ori.org/IPIP-VIA-R-core-strengths_Key.html)).

German, Polish and Spanish IPIP-VIA versions are listed on IPIP's translation page ([IPIP translations](https://ipip.ori.org/newItemTranslations.htm)). Two open questions attach to this route:

- **VIA's own rights.** VIA's own surveys are free only for individuals and approved research. Its terms bar commercial and modified use, and VIA requires approval to "create any products using the VIA Classification (e.g., … smart-phone apps)" or "an assessment – abridged or otherwise" ([VIA terms](https://www.viacharacter.org/terms-of-service); [VIA permissions](https://www.viacharacter.org/faq/permissions-and-guidelines-for-use-and-interpretation)). The app should therefore cite the items as IPIP, use IPIP's scale labels and keep "VIA" out of titles. Whether IPIP's public-domain grant fully protects items derived from Peterson's 2001 draft against VIA's claims is **untested**.
- **Strengths use.** The Strengths Use Scale (14 items; α .94–.97, Wood et al. 2011) measures how much people use their strengths. No explicit licence was found for it ([Manchester Research Explorer](https://research.manchester.ac.uk/en/publications/using-personal-and-psychological-strengths-leads-to-increases-in-)).

**What the app covers, and what it lacks.** `strength-evidence` already answers CliftonStrengths' question ("what am I good at?") without self-rating or ipsativity:

- it collects up to three real episodes and eight "work shapes";
- it sorts claims into backed, unbacked, unclaimed and repeated;
- it scores nothing;
- it lists CliftonStrengths, VIA, Strengths Profile and Realise2 as avoided ([strength-evidence/provenance.ts](/Users/pl2mac0030/Projects/my-instructions/web/src/instruments/strength-evidence/provenance.ts)).

Its r = .29 premise is verified: ability self-evaluations correlate M = .29 (SD .11) with performance across 22 meta-analyses ([Zell & Krizan 2014](https://pubmed.ncbi.nlm.nih.gov/26173249/)). Nothing in the app covers **character strengths** or **strengths use**.

**Recommendation: do not build CliftonStrengths or any 34-theme structure.** Build an IPIP-VIA-R character-strengths profiler as new ground, with an optional three-factor summary. Write strengths-use items fresh unless the Strengths Use Scale authors grant permission. Do not advertise any mapping from work shapes to Gallup domains. Letting users type in their own Gallup Top 5 is factual use by the notes' reading, but the Product Terms' app clause makes even that worth checking with Gallup's permissions page.

## FRIS is closed, Polish-only and vendor-validated, so it belongs on the avoided list

**The brief needs three corrections.**

- **The style names.** The four Thinking Styles are **Zawodnik, Partner, Wizjoner and Badacz**. They correspond to the Facts, Relations, Ideas and Structures perspectives in the acronym Fakty–Relacje–Idee–Struktury. There is no "Realizator"; "Realista" is one of the Action Style labels.
- **The author.** The model's author is **Anna Samborska-Owczarek**, not "Joanna Rzepka". She holds a PhD in computer science specialising in AI and lectures at ZUT in Szczecin.
- **The scale structure.** FRIS publishes **four perspective scales, not two bipolar axes** ([fris.pl/style-myslenia](https://fris.pl/style-myslenia); [fris.pl/zespol](https://fris.pl/zespol)).

The company is a sole proprietorship in Szczecin that grew out of a 2013–2015 research project. It claims 140,000 test-takers, and the questionnaire exists **only in Polish** ([fris.pl/regulamin](https://fris.pl/regulamin); [fris.pl/en](https://fris.pl/en)).

The model has two layers. The Thinking Style is one dominant perspective, claimed to be stable "from preschool age". There are also "14 Stylów Działania" (Action Styles), each built from one, two or three active perspectives, which can evolve over time ([fris.pl/style-dzialania](https://fris.pl/style-dzialania)). FRIS says outright that it "nie czerpie z teorii Junga" (does not draw on Jung's theory) and names no link to Herrmann, Kolb or the MBTI. Its four perspectives resemble HBDI's four quadrants in shape, but no source documents any lineage.

**Public:** 76 Likert items and four near-independent scales. **Private:** everything else.

- **Format.** "Kwestionariusz FRIS® zawiera 76 pozycji w skali Likerta oraz 4 skale pomiarowe" (the FRIS questionnaire has 76 Likert items and four measurement scales). How many Likert points are used is not published.
- **Scale independence.** The scales correlate "nisko ujemnie lub w sposób nieistotny statystycznie" (weakly negatively, or not significantly), so they are scored separately rather than by forced choice ([fris.pl/wiarygodnosc](https://fris.pl/wiarygodnosc)).
- **Action Styles.** Fourteen is exactly the number of one-, two- and three-perspective subsets of four (4 + 6 + 4). An Action Style is therefore probably the set of above-threshold perspectives, but that is an inference. The threshold and the full list of 14 names are not public.
- **Unpublished:** item wording, polarity and the algorithm.
- **Unverified:** a "30 to 40 minutes" duration.

**The psychometrics are vendor-only and weaker than they first look.** The validity page is signed by a psychometrician ([fris.pl/wiarygodnosc](https://fris.pl/wiarygodnosc)). It reports:

- a development sample of **N = 1,220**;
- alphas of **.82–.88**;
- "relative stability" of r .77–.79. This is a parallel-forms estimate between the stage I and stage II development questionnaires, not a retest of the form now sold;
- a four-factor PCA in which 58 of 76 items load, leaving about a quarter unloaded;
- self-chosen description groups scoring 0.78–1.61 SD higher on the matching scale, which is agreement with self-description rather than criterion validity.

A third-party explainer gives lower alphas of .76–.82 ([zerobs.pl](https://zerobs.pl/zarzadzanie-projektami/badanie-fris-co-to-jest/)). The only peer-reviewed uses are two 2018 computer-graphics conference chapters, co-authored by the FRIS author, that use FRIS as a grouping variable ([Crossref ICIAR 2018](https://api.crossref.org/works/10.1007/978-3-319-93000-8_39); [Crossref ICCVG 2018](https://api.crossref.org/works/10.1007/978-3-030-00692-1_42)). The notes found no listing at the Polish test publisher PTP.

Critique of the whole class of cognitive-style questionnaires applies here. A CC BY study found such questionnaires "overlap with personality" ([Cuneo et al. 2018](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0203115)). Matching teaching to a stated style is unsupported ([Pashler et al. 2008](https://api.crossref.org/works/10.1111/j.1539-6053.2009.01038.x)). The FAQ nevertheless endorses use in recruitment ([fris.pl/faq](https://fris.pl/faq)). **The most credible sources** are fris.pl's validity page and terms, plus Crossref for the publication record.

**Every legal door is shut.** Section 9 of the terms ([fris.pl/regulamin](https://fris.pl/regulamin); [fris.pl/zamow](https://fris.pl/zamow)):

- calls the questionnaire copyrighted and bars copying or modifying it without written consent;
- claims the FRIS® word and graphic marks through the Polish Patent Office and EUIPO (registrations **unverified**);
- limits use to personal use.

Reports are sold only by licensed partners, and only certified trainers run assessments. Because the tool exists only in Polish, even a negotiated licence could serve just one of the app's four locales.

**GitHub holds nothing FRIS-related.**

- **[maddykelley/FRIS](https://github.com/maddykelley/FRIS)** is an unrelated ArcGIS app.
- **[onlynikitin/fris_test](https://github.com/onlynikitin/fris_test)** is empty.
- **Code search** found no reimplementation.
- **[expfactory-experiments/need-for-cognition-and-faith-in-intuition-survey](https://github.com/expfactory-experiments/need-for-cognition-and-faith-in-intuition-survey)** is AGPL code, but its item text comes from an APA journal article. APA holds that copyright, so the repo gives no right to ship those items ([APA copyright](https://www.apa.org/about/contact/copyright)).

**No open instrument measures F/R/I/S, but IPIP covers the thinking-style ground.** Public-domain options:

| IPIP scale | Items | Alpha | Source |
|---|---|---|---|
| Need-for-Cognition proxy | 10 | .84 | [IPIP single constructs](https://ipip.ori.org/newSingleConstructsKey.htm) |
| IPIP-NEO Intellect | — | .86 | [IPIP NEO key](https://ipip.ori.org/newNEOKey.htm) |
| IPIP-NEO Imagination | — | .83 | [IPIP NEO key](https://ipip.ori.org/newNEOKey.htm) |
| AB5C Ingenuity | — | .84 | [AB5C key](https://ipip.ori.org/newAB5CKey.htm) |
| AB5C Reflection | — | .75 | [AB5C key](https://ipip.ori.org/newAB5CKey.htm) |
| AB5C Introspection | — | .71 | [AB5C key](https://ipip.ori.org/newAB5CKey.htm) |

IPIP's AB5C "Rationality" scale is a weak analytic marker (α .67). IPIP's translation page lists a Polish 50-item Big-Five marker set from the University of Gdańsk, a Polish IPIP-VIA, Spanish and German versions ([IPIP translations](https://ipip.ori.org/newItemTranslations.htm)). The named thinking-style instruments are all restricted:

- **Rational-Experiential Inventory:** research use with acknowledgement, per a second-hand statement. Its items are APA-copyrighted, and APA requires permission for reproduction "on the open internet" ([PsyToolkit](https://www.psytoolkit.org/survey-library/thinking-style-rei.html); [APA PsycTests FAQ](https://www.apa.org/pubs/databases/psyctests/faq)).
- **Need for Cognition short form:** no explicit licence.
- **Cognitive Style Index:** Pearson/TalentLens copyright ([CSI manual copy](https://www.readkong.com/page/the-cognitive-style-index-6111732)).
- **Kirton Adaption–Innovation Inventory:** "can only be used by Certificated Practitioners" ([kai.foundation](https://kai.foundation/)).
- **Object–Spatial Imagery and Verbal Questionnaire:** "copyrighted by Rutgers University. All rights reserved".

**Recommendation: do not build.**

- **Record it as closed.** No file in the repo mentions FRIS. Add it to the "Commercial / No" row of the licence table in `docs/next-four-instruments.md`, alongside MBTI and HBDI. Also add it to the `avoided` list of any future thinking-style instrument, with the copyright-versus-trademark split that `communication-style` already uses.
- **If thinking style matters,** present IPIP Intellect, Imagination and the Need-for-Cognition proxy as a facet view of the Openness content in `big-five` and `hexaco`, labelled honestly as Openness. Do not use the F/R/I/S acronym or FRIS's four style names.

## MMPI-2 is a court-protected clinical instrument the app must not approach

The MMPI-2 is a **567-item true/false clinical inventory**. It was first published in 1989 and scores more than 120 scales in several families ([UMN Press, MMPI-2](https://www.upress.umn.edu/test-division/mmpi-2/)):

- validity indicators, which catch careless, defensive or exaggerated responding;
- ten clinical scales;
- nine Restructured Clinical scales;
- content, content-component and supplementary scales.

Its norms come from **2,600 US adults**, and "no separate cultural norms are available". The original MMPI was built by empirical criterion keying: items were kept when patients with known diagnoses answered them differently. The first publication is dated 1943 in Wikipedia and 1942 in another summary ([Wikipedia](https://en.wikipedia.org/wiki/Minnesota_Multiphasic_Personality_Inventory)). Its successors are the MMPI-2-RF (338 items, 51 scales) and the MMPI-3 (2020, 335 items, new norms from 1,620 adults) ([UMN Press, MMPI-3](https://www.upress.umn.edu/test-division/mmpi-3/)). The constructs are psychopathology by design. The scales are defined by their keyed items, so an "original-items MMPI" would be a different instrument borrowing a trademark.

**Only the scale names, item count and format are public.** Items, scale memberships, scoring directions and T-score tables are all restricted.

**Ownership is enforced in court.**

- **Rights holders.** The Regents of the University of Minnesota own the copyrights and the "MMPI" marks. Pearson is the exclusive distributor, and "a Level C qualification is required to purchase" ([UMN Press](https://www.upress.umn.edu/test-division/mmpi-2/)).
- **UMN Press policy:** "The Press does not allow for the reproduction of test items in dissertations/theses, journal articles, books or online" ([UMN Press permissions](https://www.upress.umn.edu/test-division/permissions-and-ordering/)).
- ***Regents v. Applied Innovations*** (1987, affirmed 1989) found a software vendor liable for infringing the University's MMPI copyrights ([Justia, 8th Cir.](https://law.justia.com/cases/federal/appellate-courts/F2/876/626/67594/)).
- ***Regents and NCS Pearson v. Dobson*** (S.D.N.Y. 2012) ended in a consent judgment ([Consent Judgment PDF](https://storage.courtlistener.com/recap/gov.uscourts.nysd.390302.2.0.pdf)). It:
  - enjoined reproducing "MMPI-2 test statements, scale definitions (included items and scored directions)", scoring works, "or any derivative work";
  - barred confusing use of the marks;
  - ordered removal of the material from websites within 48 hours;
  - recorded that the posted scoring software "is not a fair use".
- **APA Ethics Standard 9.11** binds psychologists to maintain test security ([APA Ethics Code](https://www.apa.org/ethics/code)).
- **Copyright horizon.** The notes' rough estimate, not legal advice, is that a renewed 1943 work stays protected to about the end of 2038. The MMPI-2 is protected far longer.

**The Polish site is the legitimate channel, not a quiz.**

- **The licensed Polish adaptation.** PTP published it in 2012 (Brzezińska, Koć-Januchta & Stańczak). It covers adults aged 18–69, has separate norms by sex, and runs on paper or on PTP's Epsilon e-testing platform.
- **Who may buy it.** It is a **Category C** test: buyers must hold a master's degree in psychology. Independent use requires PTP's certified training ([PTP MMPI-2](https://www.practest.com.pl/sklep/test/MMPI-2); [Polish Psychological Association test categorisation](https://psych.org.pl/dla-psychologow/kategoryzacja-narzedzi-diagnostycznych)).
- **What poradniaterapeutyczna.pl sells.** A **psychologist-supervised remote administration of that official PTP version** ([poradniaterapeutyczna.pl](https://poradniaterapeutyczna.pl/test-mmpi-2-online-test-osobowosci/); [second page](https://poradniaterapeutyczna.pl/test-mmpi-2-online-diagnoza-osobowosci/)):
  - it runs on Epsilon and requires Windows;
  - it starts with an intake interview over video, then the client completes all 567 items while staying in contact with the psychologist;
  - a visit lasts up to 2.5 hours, and a written opinion arrives within seven business days;
  - it costs **790 PLN**. A stale card on the page still shows 598 PLN.
- **Diagnostic framing.** The service is openly diagnostic. It is marketed for identifying "ewentualnych zaburzeń psychicznych" (possible mental disorders) and for court, military and recruitment certification, and it carries no not-a-diagnosis disclaimer.
- **Unverifiable from the page:** the administering psychologists' MMPI-2 certification.
- **Fit with PTP's remote-testing rules.** The setup matches PTP's rules (webcam supervision, and "nie ma możliwości zbierania danych od anonimowych osób": no data collection from anonymous people), which suggests licensed use ([PTP Epsilon](https://www.practest.com.pl/epsilon)).

**Every GitHub repo found carrying MMPI items or scoring is unauthorised.** Their permissive tags (Unlicense, MIT, Apache-2.0, CC0) are void as to University of Minnesota content, and Dobson ¶3 covers "scoring-only" calculators too. These are not legitimate sources:

- nucular/mmpi-2
- MMPI-CHN/MMPI-CHN.github.io
- LLAA178/mmpi2-CN-normals
- kosciolek/MMPI-2
- lsweatman/MMPI_2_Grader
- SHENGYUKing/MMPI_Test
- dark-bandit/mmpi2-L-scale
- supermarsx/mmpi2-app
- eusinbay/mmpi-2test
- fumanti/mmpi2
- novokshonovp/MMPI
- WijdanTherapy/MMPI2-Arabic
- bima23a/mmpi2-scoring
- Dylancalle/Proyect-MMPI2RF-VidaPlena

jrcalabrese/mmpiR is unclear and was not opened. zhillan-arf/MMPI2-Optimizer describes itself as optimising answers, which is test-gaming. The only legitimate research-data route found is the **NIMH Data Archive's controlled-access `mmpi01` structure** ([NDA data dictionary](https://nda.nih.gov/api/datadictionary/datastructure/mmpi01)).

**No clinical alternative fits a public self-report app.**

| Instrument | Licence position | Why it does not fit |
|---|---|---|
| IPIP | Public domain | Usable, framed as personality style rather than symptoms ([IPIP permissions](https://ipip.ori.org/newPermission.htm)) |
| CAT-PD-SF (IPIP-hosted, 216 items, 33 scales; authorship **unverified**) | Public domain by hosting | Its psychoticism-type scales are unsuitable for unsupervised use ([CAT-PD-SF keys](https://ipip.ori.org/newCAT-PD-SFv1.1Keys.htm)) |
| PID-5 and PID-5-BF | Researchers and clinicians only; "may not be modified absent written permission" | Named "application" use requires APA permission ([APA PID-5 form](https://www.psychiatry.org/File%20Library/Psychiatrists/Practice/DSM/DSM-5-TR/APA-DSM5TR-ThePersonalityInventoryForDSM5FullVersionAdult.pdf)) |
| DASS-21 | Public domain | Its authors answer "no" to public websites and apps, and warn against showing respondents computed scores ([DASS FAQ](https://www2.psy.unsw.edu.au/dass/DASSFAQ.htm)) |
| PHQ-9 / GAD-7 | "No permission required to reproduce, translate, display or distribute" | PHQ-9 asks directly about thoughts of self-harm, creating crisis-response duties ([PHQ-9/GAD-7 form](https://uhs.fsu.edu/sites/g/files/upcbnu1651/files/docs/PHQ-9%20and%20GAD-7%20Form_a.pdf)) |

Apps routinely fail crisis-response duties: only 5 of 69 depression and suicide-prevention apps offered all six guideline strategies, and some widely downloaded apps listed wrong helpline numbers ([Martinengo et al. 2019](https://bmcmedicine.biomedcentral.com/articles/10.1186/s12916-019-1461-z)).

**The app's existing modules already cover the non-clinical core of this ground.** None of the app's instruments is clinical. `big-five` (with its `reactivity` factor) and `hexaco` cover negative emotionality, antagonism and disinhibition in de-pathologised form. **Recommendation: do not build, adapt or name anything MMPI-based.** Add `"MMPI-2"`, `"MMPI-2-RF"` and `"MMPI-3"` to an `avoided` list, and point users toward a psychologist. Consider a non-scored psychoeducation card of the kind the DASS authors suggest, with verified crisis resources for each locale. Polish numbers such as 116 123 and 116 111 are **unverified**.

## One public-domain pool and one CC BY exception cover everything worth building

| Test | Licence status | Items / scoring public? | Legitimate GitHub sources | Recommended open alternative | Overlap with app instruments | Recommendation |
|---|---|---|---|---|---|---|
| 16Personalities | Proprietary (NERIS Analytics Ltd). Terms bar reproduction, translation, reverse-engineering, scraping and non-personal use; ® model name | No / No. 60 items on a 7-point scale; scoring runs on NERIS's servers | None for 16P content. OEJTS wrappers (content CC BY-NC-SA; only m27frogy/JungI has a code licence); rubynor/bigfive-web (MIT, IPIP) | IPIP 50/100-item Big-Five markers, IPIP-NEO-120. OEJTS/OJTS only if non-commercial and share-alike | Full: `jungian` (letters, temperaments), `big-five` (continuous axes; `reactivity` ≈ A/T), `hexaco` | **Do not build.** Optional code derived from `big-five` scores |
| BDSM Test | No licence, terms or notice, so all rights reserved. FAQ permits featuring and research use only | No / No. Adaptive, server-side; 7-point scale + "No idea"; 2015 version had 96 items | None for items; angelod1as/bdsmtest is GPL front-end code only | Sadomasochism Checklist (CC BY 4.0) | `intimacy-map` (power, words, watching, structure); `attraction` refuses labels; `intimacy-conditions` | **Do not build** the archetype test. Optionally extend `intimacy-map` with the SMC (build from open alternative) |
| MTQ48 | Proprietary (AQR International), all rights reserved; licensed users only | No / Partly: subscale item counts, 5-point scale, stens against a proprietary norm | ben-domingue/irw (CC BY 4.0 response data, no item text) | Original 4C items plus IPIP Self-Efficacy, Vulnerability/Anxiety (reversed), Assertiveness, Industry/Perseverance, Locus of Control | `big-five` reactivity and conscientiousness; `hexaco` extraversion. Gaps: Challenge, Life Control | **Build from open alternative** |
| CliftonStrengths | Trademarks (product and 34 theme names), copyright (descriptions); Product Terms bar apps using the framework | No / No. 196 items, format and item-to-theme counts public; algorithm undisclosed | afe-strength-use-french (CC0); result visualisers are low-risk only | IPIP-VIA-R (96 items); IPIP-VIA (213); IPIP core strengths (18) | `strength-evidence` answers "what am I good at"; character strengths not covered | **Do not build** CliftonStrengths. **Build** IPIP-VIA-R character strengths |
| FRIS | Copyright (terms §9), claimed FRIS® marks in PL/EU, licensed partners and certified trainers only; Polish only | No / No. 76 Likert items, four F/R/I/S scales; vendor alphas only | None; the Expfactory NFC repo's items are APA copyright | IPIP Need-for-Cognition proxy, IPIP-NEO Intellect and Imagination, AB5C Ingenuity/Reflection | Openness in `big-five`/`hexaco`; the `communication-style` and `working-style` avoid-patterns; `jungian` | **Do not build.** Optional Openness facet view |
| MMPI-2 | UMN copyright and MMPI marks; Pearson Level C; PTP Category C; enforced in court (Applied Innovations, Dobson) | No / No | None on GitHub; NIMH Data Archive `mmpi01` (controlled access) for research | No clinical substitute; IPIP temperament scales framed as style; non-scored psychoeducation card | `big-five` reactivity, `hexaco` (non-clinical) | **Do not build** |

## Corrections the notes found in the app's own docs and code

The repo was checked on 29 September 2026 while writing, to confirm which corrections are still open. One has already landed. The last row records a gap the notes flagged and the check resolved.

| Where | What it says | What the notes found | Status |
|---|---|---|---|
| `docs/candidate-instruments.md`, openjung section | OEJTS is "public domain" | OEJTS items are **CC BY-NC-SA 4.0** ([OEJTS 1.2 PDF](https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf); [OEJTS development](https://openpsychometrics.org/tests/OEJTS/development/)) | **Fixed** in commit 315891b, which now reads "**not** public domain" |
| `README.md`, "Where the items came from" table | openpsychometrics.org (OEPS): "Open, educational use" | Looser than the CC BY-NC-SA 4.0 terms Open Psychometrics attaches to its OEJTS/OJTS items and pages. The notes did not check whether OEPS itself carries the same licence | **Still present** |
| `docs/next-four-instruments.md`, around line 910 | Zell & Krizan "needs a source-line with a URL" | Verified: M = .29, SD = .11 across 22 meta-analyses ([SAGE](https://journals.sagepub.com/doi/abs/10.1177/1745691613518075); [PubMed](https://pubmed.ncbi.nlm.nih.gov/26173249/)) | **Still pending**; the URLs can now be added |
| `docs/next-four-instruments.md` licence table, around line 907 | MBTI, HBDI, Kolb LSI, Honey & Mumford, DiSC, VARK as "Commercial / No" | FRIS belongs in this row; no file in the repo mentions it | **Addition needed** |
| `app.noValidation` in `web/src/i18n/messages/{en,pl,de,es}.ts` | "Every questionnaire in this app writes its own items" | Becomes false for any instrument that ships IPIP or SMC items ([en.ts](/Users/pl2mac0030/Projects/my-instructions/web/src/i18n/messages/en.ts)) | Needs per-instrument wording **before** any borrowed bank ships |
| Provenance contract | `reproduces` is "Required to be empty"; all `items.origin` values are "original" | The notes did not confirm where web/ enforces this. The check found the validator only in the frozen root app ([src/core/provenance.js](/Users/pl2mac0030/Projects/my-instructions/src/core/provenance.js)), which accepts `original`, `public-domain` and `licensed` (the last must name a licence). In web/, `ProvenanceRecord` types `items.origin` as a free string ([registry.ts](/Users/pl2mac0030/Projects/my-instructions/web/src/core/registry.ts)) and no web test enforces `reproduces` | Decide where web/ enforces the rule before IPIP (`public-domain`) or SMC (`licensed`, CC BY) items arrive |

The notes also corrected the research brief, as covered in each section:

- CliftonStrengths has 196 items, not 177. A repo search found no app copy repeating 177.
- FRIS's style names, author and scale structure were wrong.
- SMG/KRC dates MTQ48 to 2004, against AQR's 2002.
- 16Personalities' Energy and Mind labels appear swapped in some write-ups.

## Open questions that remain

**Licences.** These questions are unanswered, and each blocks a specific build:

- **Open Psychometrics' raw data.** The download page states no licence, so it is unclear whether the 1,015,342 IPIP-FFM responses can be used to norm a derived 16P-style code.
- **IPIP-VIA versus VIA.** No one has tested whether IPIP's public-domain grant for IPIP-VIA items holds against the VIA Institute's claim over any "assessment … of the VIA character strengths".
- **Resilience and strengths scales.** Licence terms for the Strengths Use Scale, the Brief Resilience Scale, the Mental Toughness Scale and the Sports Mental Toughness Questionnaire need direct enquiries to their authors.
- **Research access to MTQ.** AQR's research terms for the MTQ18 are unknown.
- **Other rights holders.** APA's app-licensing fees for PID-5, Gallup's permission process, and whether bdsmtest.org would license anything at all were not reachable.
- **Trademarks.** Registrations for "NERIS Type Explorer", "16Personalities", FRIS® and the MTQ names were not verified in any trademark registry.

**Evidence.** Several claims rest on sources that could not be read in full:

- Pittenger's "half change type in five weeks" figure.
- Reid & Short's specific numbers, known only through Gallup.
- Schulte et al.'s conclusion on high-dimensional forced choice.
- Kawabata et al.'s 13-of-48 content-validity figure.
- How La Corte obtained 236,353 bdsmtest profiles.

The notes also found that:

- no independent study correlates 16Personalities scale scores with a Big Five measure;
- FRIS has no independent validation of any kind;
- the SMC's 24 item wordings still have to be transcribed from the Springer article and checked;
- CAT-PD-SF authorship and the licences of IFAKBDSM and the BDSM Proclivity Scale are unconfirmed.

**Inside the app.**

- **Code agreement.** No sample data exists to show whether the `jungian`-derived code agrees with `big-five` axes.
- **Adults-only gate.** It is unconfirmed whether the gate covers `intimacy-map`.
- **Crisis resources.** Per-locale crisis resources have not been verified.
- **Device regulation.** Whether scoring PHQ-9 or GAD-7 for users would make the app medical-device software under EU MDR Rule 11 was not researched.
- **Polish adaptations.** A Polish IPIP-BFM-50 adaptation (Strus, Cieciuch & Rowiński) is believed to exist but was not verified. IPIP's translation page does list a Polish 50-item set from Gdańsk. A Polish resilience scale sold by PTP (SPP-25) was not checked.
- **Frozen root app.** It was not audited for separate copies of these instruments.

## Conclusion

The six tests make the same point from different directions: the valuable part of each is the part that is locked. MTQ's stens depend on AQR's norm table. Gallup ranks against an undisclosed standardisation. MMPI T-scores come from copyrighted conversion tables. bdsmtest's percentiles sit on a server. A lookalike with original items would take on each brand's legal risk and get none of its evidence. That is why the app's write-your-own stance is sound, and why its evidence field honestly reads "none". The only way to move that field without borrowing someone else's credibility is to adopt IPIP scales. Their published alphas and omegas belong to the actual English items and to validated translations, not to the construct's name. So the upgrade path is a provenance change, not a cloning project, and it matches the project's rule of honest provenance over persuasion.

Two process lessons follow. First, in this domain a repository's LICENSE file says nothing reliable about its content. The scan found scrapers tagged MIT, clinical keys tagged Unlicense and CC0, and paraphrased quiz items tagged MIT. The only trustworthy grant comes from the rights holder's own page. Second, "open" has to mean public domain or CC BY. Non-commercial and no-derivatives licences (OEJTS, the Kink Orientation Scale) fail an app that translates into four languages and declares a premium tier. With those two filters applied, the useful work is filling gaps, not copying tests: character strengths, Challenge and Life Control, and the practice domains and experience-versus-fantasy distinction the Sadomasochism Checklist adds to `intimacy-map`.
