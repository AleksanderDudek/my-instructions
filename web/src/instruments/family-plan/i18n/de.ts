/**
 * Familienplanung — Deutsch.
 *
 * Dreizehn Entscheidungen über Kinder, und keine einzige Vorhersage. Die Fragen
 * sind auf Deutsch gedacht und nicht aus dem Englischen übertragen: Wer nach
 * einer Geburt zu Hause bleibt, denkt hier in Elternzeit und Teilzeit, betreut
 * wird in der Krippe, in der Kita oder bei einer Tagesmutter, und ein Kind geht
 * in die Schule vor Ort. Die Bedeutung ist überall dieselbe — das ist die
 * Bedingung, unter der eine Frage dieselbe Frage bleibt.
 *
 * Deutsch läuft rund 30% länger als Englisch und neigt zu Komposita, während
 * die 80-Zeichen-Grenze an dieser Datei gemessen wird. Darum steht hier die
 * kurze Verbform statt der Nominalisierung: „Wer würde im Beruf zurückstecken,
 * wenn ein Kind kommt?“ und nicht „Wie ist die Aufteilung der Erwerbstätigkeit
 * nach der Geburt vorgesehen?“. Die Anrede ist durchgehend du, wie in der
 * Shell und in den übrigen Instrumenten.
 *
 * Der Ausweg steht in jedem Block in der ersten Person. „Ich habe mich nicht
 * festgelegt“ steht überall dort, wo das Englische «I have not decided» sagt,
 * und nirgends „wir“: Wer diese Seite allein ausfüllt, soll auf jede Frage eine
 * wahre Antwort finden. Das ist Hausregel 7 und nicht Geschmack.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Familienplanung",
  "tagline": "Dreizehn Entscheidungen über Kinder, auch die noch offenen, jede mit ihrem Gewicht.",
  "framework": "Dreizehn erklärte Haltungen — kein Wert, keine Prognose",
  "sourceNote": "Hinter diesem Ordner steht kein Instrument, und es muss auch keines dahinterstehen. Die Themenliste ist die, mit der die Bevölkerungsforschung seit Jahrzehnten arbeitet — der US National Survey of Family Growth, dessen Fragebögen als Werk einer Bundesbehörde frei verwendbar sind, und der offen veröffentlichte Generations and Gender Survey —, während jede Frage und jede Option hier für diese App geschrieben wurde; die Eheinventare, die dasselbe Feld abdecken und nur über geschulte Begleitung zugänglich sind — PREPARE/ENRICH, FOCCUS und RELATE —, werden weder wiedergegeben noch umschrieben, und ihre Produktseiten stehen in der Liste des Vermiedenen statt unter den Quellen, gerade weil nichts auf dieser Seite von dort stammt. Hier wird nichts ausgewertet und nichts vorhergesagt: Die gewünschte Kinderzahl sagt die tatsächliche nur schwach vorher, und Menschen verfehlen ihre Zahl häufiger, als sie sie treffen (Quesnel-Vallée und Morgan 2003) — lies das also als eine Haltung an einem Datum und nicht als einen Plan, der so eintritt. Nimm zuerst „Gespräche“, um herauszufinden, ob Kinder überhaupt je zur Sprache kamen, und „Vor der Ehe“, wenn eine Hochzeit ansteht; dies hier sind die dreizehn Entscheidungen danach, und es ist das, was du ins Gespräch mitbringst, nicht das, was es eröffnet. Jede Frage hier kann eine Person allein beantworten, auch die drei, die einen gedachten anderen Elternteil nennen; wo ein Block etwas Unentschiedenes festhält, heißt die Option „Ich habe mich nicht festgelegt“ und nie „wir“, denn eine Seite, die sich erst ausfüllen lässt, wenn eine zweite Person im Raum ist, wäre ein anderes Produkt. Bevor du eine Uneinigkeit als Urteil liest, lohnt es zu wissen: Wenn Partner beim ersten Kind verschiedener Meinung sind, bekommt ungefähr die Hälfte eines; bei einem weiteren Kind endet die Uneinigkeit meist bei Nein (Testa und Bolano 2021). Ein Block bietet körperliche Strafe als Antwort an, weil Menschen sie wählen und ein Antwortsatz, der eine wirkliche Antwort auslässt, stattdessen eine falsche einsammelt; die größte Metaanalyse dazu fand sie bei dreizehn von siebzehn Maßen mit schlechteren Ergebnissen verbunden und bei keinem mit besseren (Gershoff und Grogan-Kaylor 2016). Das steht hier und nicht in der Frage, denn eine Frage, die argumentiert, sammelt Zustimmung ein.",

  /* ── die Abschnitte ───────────────────────────────────────────────── */
  "section.plan.title": "Der Plan",
  "section.plan.note": "Wie viele, wann, in welchem Abstand — und was wäre, wenn es nicht dazu käme. Auf jede Frage in diesem Abschnitt ist „nicht entschieden“ eine ehrliche Antwort. Eine richtige hat keine von ihnen.",
  "section.care.title": "Beruf und wer zu Hause bleibt",
  "section.care.note": "Der Teil einer Familienplanung, an dem ein Preis und ein Datum hängen. Antworte für die Aufteilung, die du wirklich willst, und nicht für die, die sich laut ausgesprochen gerecht anhört.",
  "section.raising.title": "Erziehung",
  "section.raising.note": "Vier Entscheidungen, die in Eile fallen, einzeln, Jahre auseinander, meist von dem, der gerade dabei ist. Vorher aufgeschrieben sind es Haltungen. Im Moment getroffen sind es Streit.",
  "section.disagreement.title": "Wenn ihr euch nicht einig seid",
  "section.disagreement.note": "Zwei Fragen dazu, was passiert, wenn der Rest dieser Seite nicht zusammenpasst. Sie sind die schwersten hier und die, die niemand stellt, bevor er sie braucht.",

  /* ── die Fragen ───────────────────────────────────────────────────── */
  "stance.children-ceiling.prompt": "Auf wie viele Kinder würdest du dich höchstens einlassen?",
  "stance.timing-gate.prompt": "Was müsste sich zuerst ändern, bevor du ein Kind bekämst?",
  "stance.child-spacing.prompt": "Wie groß soll der Abstand zwischen zwei Kindern sein?",
  "stance.if-not-natural.prompt": "Wenn eine Schwangerschaft ausbleibt, wofür wärst du offen?",
  "stance.who-steps-back.prompt": "Wer würde im Beruf zurückstecken, wenn ein Kind kommt?",
  "stance.time-at-home.prompt": "Wie lange soll die Pause vom Beruf nach der Geburt dauern?",
  "stance.childcare.prompt": "Wer betreut ein kleines Kind an den meisten Wochentagen?",
  "stance.schooling.prompt": "Wo soll ein Kind von dir unterrichtet werden?",
  "stance.discipline.prompt": "Was tust du, wenn ein Kind zum dritten Mal nicht auf dich hört?",
  "stance.screens.prompt": "Mit welchem Alter bekommt ein Kind von dir ein eigenes Handy?",
  "stance.grandparents.prompt": "Wie viel Mitsprache hätten deine Eltern bei einem Kind?",
  "stance.parent-deadlock.prompt": "Was gibt den Ausschlag, wenn der andere Elternteil dagegen ist?",
  "stance.change-of-mind.prompt": "Was, wenn ein Partner seine Meinung zu Kindern ändert?",

  /* ── was geantwortet werden darf ──────────────────────────────────── */
  /* children-ceiling */
  "stance.children-ceiling.opt.none": "Keine",
  "stance.children-ceiling.opt.one": "Eins",
  "stance.children-ceiling.opt.two": "Zwei",
  "stance.children-ceiling.opt.three": "Drei",
  "stance.children-ceiling.opt.fourPlus": "Vier oder mehr",
  "stance.children-ceiling.opt.undecided": "Ich habe keine Zahl im Kopf",
  /* timing-gate */
  "stance.timing-gate.opt.readyNow": "Ich bin jetzt so weit",
  "stance.timing-gate.opt.money": "Geld oder ein sicherer Job",
  "stance.timing-gate.opt.home": "Eine bessere Wohnung",
  "stance.timing-gate.opt.study": "Studium oder Ausbildung zu Ende bringen",
  "stance.timing-gate.opt.notWanted": "Nichts — ich will keins",
  "stance.timing-gate.opt.unsure": "Ich weiß nicht, worauf ich warte",
  /* child-spacing */
  "stance.child-spacing.opt.underTwo": "Weniger als zwei Jahre Abstand",
  "stance.child-spacing.opt.twoThree": "Zwei bis drei Jahre Abstand",
  "stance.child-spacing.opt.overThree": "Mehr als drei Jahre Abstand",
  "stance.child-spacing.opt.whatever": "Wie es eben kommt",
  "stance.child-spacing.opt.notMoreThanOne": "So oder so nicht mehr als eins",
  "stance.child-spacing.opt.unsure": "Darüber habe ich nie nachgedacht",
  /* if-not-natural */
  "stance.if-not-natural.opt.treatment": "Eine Kinderwunschbehandlung, etwa IVF",
  "stance.if-not-natural.opt.donor": "Eine Behandlung mit Samen- oder Eizellspende",
  "stance.if-not-natural.opt.adoption": "Adoption",
  "stance.if-not-natural.opt.fostering": "Ein Pflegekind aufnehmen",
  "stance.if-not-natural.opt.stop": "Nichts davon — ich würde ohne Kinder leben",
  "stance.if-not-natural.opt.unsure": "Das weiß ich noch nicht",
  /* who-steps-back */
  "stance.who-steps-back.opt.me": "Ich, egal wer von uns mehr verdient",
  "stance.who-steps-back.opt.otherParent": "Der andere Elternteil",
  "stance.who-steps-back.opt.bothPartTime": "Wir beide, in Teilzeit",
  "stance.who-steps-back.opt.neither": "Keiner von uns beiden",
  "stance.who-steps-back.opt.lowerEarner": "Wer dann weniger verdient",
  "stance.who-steps-back.opt.undecided": "Ich habe mich nicht festgelegt",
  /* time-at-home */
  "stance.time-at-home.opt.weeksOrLess": "Ein paar Wochen oder weniger",
  "stance.time-at-home.opt.months": "Ein paar Monate",
  "stance.time-at-home.opt.year": "Ungefähr ein Jahr",
  "stance.time-at-home.opt.twoThreeYears": "Zwei oder drei Jahre",
  "stance.time-at-home.opt.untilSchool": "Bis zur Einschulung",
  "stance.time-at-home.opt.undecided": "Ich habe mich nicht festgelegt",
  /* childcare */
  "stance.childcare.opt.parentHome": "Ein Elternteil zu Hause",
  "stance.childcare.opt.family": "Großeltern oder andere Verwandte",
  "stance.childcare.opt.nursery": "Krippe oder Kita",
  "stance.childcare.opt.nanny": "Eine Tagesmutter oder ein Kindermädchen",
  "stance.childcare.opt.undecided": "Ich habe mich nicht festgelegt",
  /* schooling */
  "stance.schooling.opt.state": "Die staatliche Schule vor Ort",
  "stance.schooling.opt.faithSchool": "Eine staatliche Schule, wegen des Glaubens gewählt",
  "stance.schooling.opt.private": "Eine Schule, für die wir Schulgeld zahlen",
  "stance.schooling.opt.home": "Unterricht zu Hause",
  "stance.schooling.opt.whicheverAdmits": "Die Schule, die uns nimmt",
  "stance.schooling.opt.unsure": "Ich weiß es nicht",
  /* discipline */
  "stance.discipline.opt.explain": "Es noch einmal erklären und warten",
  "stance.discipline.opt.removeSomething": "Etwas wegnehmen, das ihm lieb ist",
  "stance.discipline.opt.timeOut": "Eine Auszeit für sich allein",
  "stance.discipline.opt.raiseVoice": "Lauter werden",
  "stance.discipline.opt.smack": "Ein Klaps",
  "stance.discipline.opt.unsure": "Ich weiß nicht, was ich täte",
  /* screens */
  "stance.screens.opt.underTen": "Vor dem zehnten Geburtstag",
  "stance.screens.opt.tenEleven": "Mit zehn oder elf",
  "stance.screens.opt.twelveThirteen": "Mit zwölf oder dreizehn",
  "stance.screens.opt.fourteenPlus": "Mit vierzehn oder später",
  "stance.screens.opt.noFixedAge": "Kein festes Alter — ich entscheide es dann",
  "stance.screens.opt.undecided": "Darüber habe ich nie nachgedacht",
  /* grandparents */
  "stance.grandparents.opt.sayInDecisions": "Echte Mitsprache bei Entscheidungen",
  "stance.grandparents.opt.helpNoSay": "Regelmäßige Hilfe, keine Mitsprache",
  "stance.grandparents.opt.occasional": "Nur gelegentlich Hilfe",
  "stance.grandparents.opt.minimal": "So wenig Beteiligung wie möglich",
  "stance.grandparents.opt.notAround": "Sie wären ohnehin nicht da",
  "stance.grandparents.opt.unsure": "Ich weiß es nicht",
  /* parent-deadlock */
  "stance.parent-deadlock.opt.moreWorried": "Wer mehr Sorge hat, entscheidet",
  "stance.parent-deadlock.opt.mainCarer": "Wer mehr betreut, entscheidet",
  "stance.parent-deadlock.opt.byADate": "Wir setzen ein Datum und entscheiden bis dahin",
  "stance.parent-deadlock.opt.outsideHelp": "Wir fragen jemanden, dem wir beide vertrauen",
  "stance.parent-deadlock.opt.noChange": "Nichts ändert sich, bis wir uns einig sind",
  "stance.parent-deadlock.opt.undecided": "Ich habe mich nicht festgelegt",
  /* change-of-mind */
  "stance.change-of-mind.opt.stayAndAccept": "Ich würde bleiben und mich damit abfinden",
  "stance.change-of-mind.opt.stayAndPress": "Ich würde bleiben und weiter fragen",
  "stance.change-of-mind.opt.end": "Ich würde die Beziehung beenden wollen",
  "stance.change-of-mind.opt.dependsDirection": "Kommt darauf an, in welche Richtung",
  "stance.change-of-mind.opt.unsure": "Ich weiß es nicht",

  /* ── das Playbook ─────────────────────────────────────────────────── */
  /* das ist in Ordnung */
  "playbook.ok-start-whenever": "Sprich das Kinderkriegen an, wann immer du willst. Ich warte weder auf ein Zeichen von dir noch auf sonst eines.",
  "playbook.ok-money-before-dates": "Rede mit mir über Geld, bevor du mit mir über Termine redest. Das Geld ist das, was wirklich im Weg steht.",
  "playbook.ok-no-gap-held": "Du kannst ein zweites Kind jederzeit ansprechen. Ich halte keinen Abstand im Kopf, den du damit unterlaufen würdest.",
  "playbook.ok-tests-early": "Sprich Untersuchungen beim Kinderwunsch lieber früh an als spät. Ich höre darin keinen Vorwurf gegen einen von uns.",
  "playbook.ok-adoption-first-class": "Bring Adoption als erste Möglichkeit ins Gespräch und nicht als das, was übrig bleibt, wenn alles andere gescheitert ist.",
  "playbook.ok-plan-on-me": "Rechne damit, dass ich in Teilzeit gehe. Und lass es mich laut sagen, wenn das einmal nicht mehr gilt.",
  "playbook.ok-book-the-visits": "Vereinbare die Termine in den Kitas ohne mich. Für die engere Auswahl muss ich nicht dabei sein, nur für die Entscheidung.",
  "playbook.ok-ask-my-parents": "Frag meine Eltern für einen Tag Betreuung, ohne mich vorher zu fragen. Diese Hilfe ist längst abgemacht.",
  "playbook.ok-local-school-no-case": "Setz die Schule vor Ort an die erste Stelle, ohne dafür zu argumentieren. Du musst mich dazu nicht überreden.",
  "playbook.ok-stop-me": "Halt mich auf, wenn ich einem Kind je einen Klaps gebe. Ich habe aufgeschrieben, dass ich das nicht tue — nimm mich beim Wort.",
  "playbook.ok-phone-age-settled": "Sag einem Kind, das Handyalter steht fest und wir beide haben es entschieden. Dann gibt es keinen von uns, mit dem sich darüber streiten lässt.",
  "playbook.ok-you-decide-on-the-day": "An den Tagen, an denen du betreust, entscheide selbst. Vor dem Kind stelle ich mich hinter dich.",
  "playbook.ok-say-it-either-way": "Sag mir an dem Tag, an dem du deine Meinung zu Kindern änderst. Ich gehe deswegen nicht.",
  /* das ist es nicht */
  "playbook.notok-reopen-the-number": "Nimm die Zahl, die ich genannt habe, nicht als erstes Angebot, das sich nach oben verhandeln lässt, sobald das erste Kind da ist.",
  "playbook.notok-date-before-obstacle": "Setz kein Datum für ein erstes Kind, bevor sich das bewegt hat, was ich als Hindernis genannt habe.",
  "playbook.notok-donor-small-step": "Sprich Samen- oder Eizellspende nicht so an, als wäre das von hier aus ein kleiner Schritt.",
  "playbook.notok-keep-sending-clinics": "Schick mir nicht weiter Kliniken und Erfolgsquoten. Ich habe gesagt, dass ich aufhöre statt weiterzumachen.",
  "playbook.notok-assume-i-step-back": "Geh nicht davon aus, dass ich in Teilzeit gehe, weil ich weniger verdiene. Dem habe ich nicht zugestimmt.",
  "playbook.notok-leave-has-an-end-date": "Erzähl den Leuten nicht, ich gäbe meinen Beruf auf. Die Pause hat ein Ende, und ich weiß, wann es ist.",
  "playbook.notok-ask-my-parents-first": "Plan die Woche nicht um die Hilfe meiner Eltern herum, bevor ich sie wirklich gefragt habe.",
  "playbook.notok-fees-without-me": "Verpflichte uns nicht in einem Gespräch ohne mich zu Schulgeld, auch nicht bei deiner eigenen Familie.",
  "playbook.notok-school-not-a-compromise": "Sag einem Kind nicht, die Schule vor Ort sei das gewesen, was wir uns leisten konnten. Sie war unsere Wahl.",
  "playbook.notok-smack": "Gib einem Kind von mir keinen Klaps, ganz gleich, was man mit dir gemacht hat, als du klein warst.",
  "playbook.notok-early-phone": "Kauf einem Kind kein Handy vor dem Alter, das wir vereinbart haben, weil seine Freunde schon eins haben.",
  "playbook.notok-grandparents-overrule": "Lass meine Eltern nichts umstoßen, was wir entschieden haben. Bei einem Kind zu helfen ist nicht dasselbe, wie über es zu bestimmen.",
  "playbook.notok-quiet-change": "Behalt eine geänderte Meinung zu Kindern nicht für dich. Ich muss es in dem Monat hören, in dem du es weißt, nicht im Jahr darauf.",

  /* ── der Anleitungsbogen ──────────────────────────────────────────── */
  "card.number": "Die Zahl, der Zeitpunkt, der Abstand",
  "card.raising": "Wie ein Kind von mir erzogen würde",
  "card.if-not-natural": "Wenn es nicht von selbst kommt",
  "card.care": "Wer zurücksteckt, und wie lange",
  "card.disagreement": "Wenn wir uns nicht einig sind",

  /* ── die beiden Gewichtslisten auf der Ergebnisseite ──────────────── */
  "weight.settledTitle": "Die, bei denen nichts nachgibt",
  "weight.openTitle": "Wo du gesagt hast, es ist Spielraum",
  "weight.settledNote": "Die Fragen, die du mit acht oder mehr gewichtet hast. Nichts hier sagt, dass du damit recht hast — nur, dass du gesagt hast, so viel sind sie dir wert.",
  "weight.openNote": "Die Fragen, die du mit drei oder weniger gewichtet hast. Das ist nicht dasselbe wie Gleichgültigkeit. Es heißt nur, dass du hier keinen Streit ausgeben würdest.",
};
