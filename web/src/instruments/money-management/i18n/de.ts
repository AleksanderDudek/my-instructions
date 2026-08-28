/**
 * money-management — German.
 *
 * Key for key with `en.ts`, which is the source of truth; only the values are
 * written, and they are written in German rather than carried across from the
 * English. §8 of the stated-positions design asks for four originals, so the
 * thirteen questions here are the ones a German household puts to itself:
 * `spend-threshold` is „Ab welcher Summe sagst du vor einem Kauf Bescheid?“,
 * which is the question the English asks, reached by asking it in German
 * rather than by reordering English clauses.
 *
 * The eighty-character gate in `test/i18n/readability.test.ts` settled several
 * wordings before taste got a vote. German runs about a third longer than
 * English and compounds where English takes a phrase, and the gate is measured
 * on this string, not on the one it came from. The forbidden joiners for `de`
 * are „, aber “ and „; “, and no prompt here wants either: every question that
 * asked for one was asking two things.
 *
 * `du` throughout, as everywhere in this app. This is somebody's own money in
 * their own house, and `Sie` would turn thirteen questions into a
 * Bankgespräch.
 *
 * The vocabulary is a household's, not a bank's. Pahl's four systems stand in
 * the `sourceNote` as das abgegebene Gehalt, das Wirtschaftsgeld, die
 * gemeinsame Kasse und getrennte Kassen — „Wirtschaftsgeld“ is the German word
 * for the allowance arrangement and needs no rendering into one. The
 * thresholds are Tageslohn, Wochenlohn and Monatslohn, one family of words so
 * that a reader can compare them; `saving-rate` asks about „dem, was
 * reinkommt“, which is what people say and what `ok-pay-less-than-half` says
 * too. The one place the register lifts is the `sourceNote`, because that is
 * where somebody else's citations are.
 *
 * Nothing here makes the reader pick a gender, for themselves or for the
 * person they hand the sheet to. `accounts.one-manages` is „Eine Person hält
 * es, die andere bekommt einen Anteil“ rather than „Einer … der andere“,
 * `ok-refuse-my-family` says „überlass mir, es ihr zu sagen“ where the English
 * has „let me be the one“, and `ok-save-first` says „bevor irgendwer
 * entscheidet“ rather than naming one of two people.
 *
 * Three phrases are word for word what the other German tables already say,
 * because somebody who takes two of these has to be able to read two answers
 * as one answer: „Ich habe mich nicht festgelegt“ is `family-plan`'s, and „Wie
 * ich aufgewachsen bin“ and „Ich habe das nicht zu Ende gedacht“ are the
 * grounds `faith` already offers under exactly this English.
 *
 * The not-OK lines are negative imperatives — „Nimm keinen Kredit …“ — as in
 * `boundaries`. An infinitive list under the heading reads like a notice on a
 * wall, and these are sentences one person hands to another.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Umgang mit Geld",
  "tagline": "Dreizehn Haltungen zu deinem eigenen Geld, jede mit dem Gewicht, das du ihr gibst.",
  "framework": "Dreizehn erklärte Haltungen — kein Wert, kein Urteil",
  "sourceNote": "Hier gibt es keine Skala und kein Konstrukt, das gemessen würde: Festgehalten wird eine Haltung, die du zu deinem eigenen Geld erklärst, das Gewicht, das du ihr gibst, und dein Grund dafür. Wo eine Frage „jemand“ oder „die andere Person“ sagt, ist gemeint, mit wem du jetzt zusammenlebst oder zusammenleben würdest — alle dreizehn sind von einer Person allein zu beantworten, die allein am Tisch sitzt. Die Themenliste ist öffentlich: Jan Pahls Typologie der Haushaltsführung beschreibt seit 1980 das abgegebene Gehalt, das Wirtschaftsgeld, die gemeinsame Kasse und getrennte Kassen, und was in einem Haushaltsbudget steht, gehört niemandem. Die Instrumente, die auf diesem Feld messen, gehören sehr wohl jemandem, und keines davon wird hier wiedergegeben oder umschrieben: weder die Financial Infidelity Scale (Garbinsky, Gladstone, Nikolova und Olson, 2020) noch das Klontz Money Script Inventory noch die vorehelichen Inventare, deren Herausgeber schriftlich festhalten, dass ihre Items ihr Eigentum sind. Zwei fremde Befunde lohnt es sich mitzunehmen, während du antwortest — als Beleg von anderen und nicht von uns. Olson, Rick, Small und Finkel teilten 230 verlobte oder frisch verheiratete Paare per Zufall auf ein gemeinsames Konto, auf getrennte Konten oder auf „regelt es, wie ihr wollt“ auf, und zwei Jahre später war allein die Gruppe mit dem gemeinsamen Konto dem üblichen Rückgang der Beziehungsqualität entgangen (Journal of Consumer Research 50(4), 2023). Ein einzelnes Experiment, an frisch verheirateten amerikanischen Paaren, das dir nicht sagt, was in deinem Haus geschähe, und diese Seite wird keine Antwort auf die erste Frage zur richtigen erklären. Dew, Britt und Huston fanden über 4.574 Paare hinweg, dass Streit über Geld eine Scheidung stärker vorhersagte als jedes andere Thema, über das Paare streiten; das ist ein Grund, diese Antworten aufzuschreiben, und keine Prognose über dich. Wie viele Partner ein Geldgeheimnis haben, dazu gibt es überhaupt keine belastbare Zahl: kommerzielle Umfragen setzen es zwischen ein Drittel und die Hälfte an, auf Definitionen, die nicht zueinander passen, und diese Spanne ist der ganze Befund. Nimm zuerst „Gespräche“, wenn du noch nicht weißt, ob zwischen euch je über Geld geredet wurde; hier werden die Beträge, die Grenzen und die Schulden aufgeschrieben, und das Aufschreiben ist der Sinn der Sache. Deine Antwort auf die Frage nach den verschwiegenen Schulden verlässt dieses Gerät nie, steht in keinem Link zum Teilen und fragt dich nie nach einem Betrag.",

  /* ── the sections ─────────────────────────────────────────────────── */
  "section.holding.title": "Wo das Geld liegt",
  "section.holding.note": "Drei Entscheidungen, von denen alles darunter abhängt: wo es liegt, nach welchem Grundsatz geteilt wird und wer den Überblick behält. Antworte für die Person, mit der du jetzt zusammenlebst oder zusammenleben würdest.",
  "section.disclosure.title": "Was gesagt wird, und wann",
  "section.disclosure.note": "Keine Einstellungen zur Ehrlichkeit. Eine Summe, ein Zeitpunkt und ein Ja oder Nein, das nie nach einem Betrag fragt.",
  "section.building.title": "Was daraus aufgebaut wird",
  "section.building.note": "Ein Anteil, eine Regel für den Fall eines Einbruchs und die Frage, wer dich mit siebzig tragen soll.",
  "section.outward.title": "Geld, das aus dem Haushalt geht",
  "section.outward.note": "Das Abgeben und das Alter der Eltern: zwei Dinge, die vorher zu klären billiger ist als mittendrin.",
  "section.strain.title": "Wenn es schiefgeht",
  "section.strain.note": "Der Hebel, zu dem du zuerst greifst, und die Grenze zwischen Privatsache und Verrat — beides klärt sich leichter, solange nichts brennt.",

  /* ── the questions ────────────────────────────────────────────────── */
  "stance.accounts.prompt": "Wie soll das Geld liegen, sobald du mit jemandem zusammenlebst?",
  "stance.cost-split.prompt": "Nach welchem Grundsatz sollen gemeinsame Kosten geteilt werden?",
  "stance.money-admin.prompt": "Wer soll die Rechnungen und den Papierkram im Blick haben?",
  "stance.spend-threshold.prompt": "Ab welcher Summe sagst du vor einem Kauf Bescheid?",
  "stance.debt-disclosure.prompt": "Wann soll jemand erfahren, was du an Schulden hast?",
  "stance.undisclosed-debt.prompt": "Hast du Schulden, von denen niemand in deiner Nähe weiß?",
  "stance.saving-rate.prompt": "Wie viel von dem, was reinkommt, soll monatlich gespart werden?",
  "stance.risk-response.prompt": "Was tun, wenn angelegtes Geld um ein Drittel fällt?",
  "stance.retirement-source.prompt": "Wovon lebst du hauptsächlich, wenn du nicht mehr arbeitest?",
  "stance.giving-share.prompt": "Wie viel von dem, was du verdienst, soll abgegeben werden?",
  "stance.parent-support.prompt": "Was schuldest du einem Elternteil, das sich nicht selbst versorgen kann?",
  "stance.bad-month.prompt": "Wenn das Geld in einem Monat knapp wird, was passiert zuerst?",
  "stance.secrecy-betrayal.prompt": "Welche Geldgeheimnisse wären für dich ein Verrat?",

  /* ── what may be answered ─────────────────────────────────────────── */
  /* accounts */
  "stance.accounts.opt.one-pot": "Ein Topf, aus dem wir beide ausgeben",
  "stance.accounts.opt.hybrid": "Gemeinsames Konto für die Kosten, dazu eigene",
  "stance.accounts.opt.separate": "Ganz getrennt, wir rechnen untereinander ab",
  "stance.accounts.opt.one-manages": "Eine Person hält es, die andere bekommt einen Anteil",
  "stance.accounts.opt.undecided": "Ich habe mich nicht festgelegt",
  /* cost-split */
  "stance.cost-split.opt.equal": "Halbe-halbe, egal wer wie viel verdient",
  "stance.cost-split.opt.proportional": "Im Verhältnis zu dem, was jede Person verdient",
  "stance.cost-split.opt.one-income": "Ein Einkommen trägt den Haushalt",
  "stance.cost-split.opt.by-category": "Jede Person übernimmt bestimmte Rechnungen ganz",
  "stance.cost-split.opt.whoever": "Wer gerade Geld hat, zahlt",
  "stance.cost-split.opt.undecided": "Ich habe mich nicht festgelegt",
  /* money-admin */
  "stance.money-admin.opt.me": "Ich — ich hätte lieber den ganzen Überblick",
  "stance.money-admin.opt.them": "Die andere Person, und ich bleibe im Bilde",
  "stance.money-admin.opt.by-category": "Nach Bereichen geteilt, jede Person hat ihre",
  "stance.money-admin.opt.together": "Wir beide, zu einem festen Termin im Monat",
  "stance.money-admin.opt.whoever": "Wer merkt, dass es ansteht",
  "stance.money-admin.opt.undecided": "Ich habe mich nicht festgelegt",
  /* spend-threshold */
  "stance.spend-threshold.opt.any": "Alles, egal wie klein",
  "stance.spend-threshold.opt.day": "Ungefähr ein Tageslohn",
  "stance.spend-threshold.opt.week": "Ungefähr ein Wochenlohn",
  "stance.spend-threshold.opt.month": "Ein Monatslohn oder mehr",
  "stance.spend-threshold.opt.never": "Nichts — ich sage nichts dazu",
  "stance.spend-threshold.opt.not-set": "Ich habe nie eine Summe festgelegt",
  /* debt-disclosure */
  "stance.debt-disclosure.opt.early": "Bevor es ernst wird",
  "stance.debt-disclosure.opt.moving-in": "Bevor wir zusammenziehen",
  "stance.debt-disclosure.opt.marriage": "Vor der Hochzeit",
  "stance.debt-disclosure.opt.if-asked": "Nur wenn ich gefragt werde",
  "stance.debt-disclosure.opt.never": "Nie — das bleibt meine Sache",
  "stance.debt-disclosure.opt.undecided": "Ich habe mich nicht festgelegt",
  /* undisclosed-debt */
  "stance.undisclosed-debt.opt.none": "Nein — ich habe keine verschwiegenen Schulden",
  "stance.undisclosed-debt.opt.will-say": "Ja, und ich habe vor, es zu sagen",
  "stance.undisclosed-debt.opt.wont-say": "Ja, und ich habe es nicht vor",
  "stance.undisclosed-debt.opt.unsure": "Ich weiß nicht genau, was schon bekannt ist",
  "stance.undisclosed-debt.opt.decline": "Das beantworte ich lieber nicht",
  /* saving-rate */
  "stance.saving-rate.opt.none": "Nichts — es ist nichts übrig",
  "stance.saving-rate.opt.five": "Bis zu 5 %",
  "stance.saving-rate.opt.ten": "Etwa 10 %",
  "stance.saving-rate.opt.twenty": "Etwa 20 %",
  "stance.saving-rate.opt.more": "Mehr als 20 %",
  "stance.saving-rate.opt.no-target": "Kein Ziel — was übrig bleibt",
  /* risk-response */
  "stance.risk-response.opt.sell": "Verkaufen und alles aufs Konto legen",
  "stance.risk-response.opt.wait": "Nichts — es bleibt, wo es ist",
  "stance.risk-response.opt.buy": "Nachkaufen, solange es billig ist",
  "stance.risk-response.opt.ask": "Erst jemanden fragen, der sich auskennt",
  "stance.risk-response.opt.not-invested": "Von mir ist nichts angelegt",
  "stance.risk-response.opt.undecided": "Ich habe mich nicht festgelegt",
  /* retirement-source */
  "stance.retirement-source.opt.state": "Vor allem die gesetzliche Rente",
  "stance.retirement-source.opt.workplace": "Betriebliche Altersvorsorge",
  "stance.retirement-source.opt.own-savings": "Eigene Ersparnisse und Anlagen",
  "stance.retirement-source.opt.property": "Immobilien oder eine eigene Firma",
  "stance.retirement-source.opt.family": "Meine Kinder oder andere Verwandte",
  "stance.retirement-source.opt.unworked": "Ich habe das nicht zu Ende gedacht",
  /* giving-share */
  "stance.giving-share.opt.none": "Nichts Regelmäßiges",
  "stance.giving-share.opt.when-asked": "Was gefragt wird, wenn gefragt wird",
  "stance.giving-share.opt.set-amount": "Eine feste Summe, kein Anteil vom Verdienst",
  "stance.giving-share.opt.tenth": "Ein Zehntel von dem, was ich verdiene",
  "stance.giving-share.opt.more-than-tenth": "Mehr als ein Zehntel",
  "stance.giving-share.opt.undecided": "Ich habe mich nicht festgelegt",
  /* parent-support */
  "stance.parent-support.opt.home": "Was nötig ist, einen Platz bei uns eingeschlossen",
  "stance.parent-support.opt.monthly": "Jeden Monat Geld, ganz selbstverständlich",
  "stance.parent-support.opt.top-up": "Was die Rente nicht deckt",
  "stance.parent-support.opt.crisis": "Hilfe in der Not, keine feste Zusage",
  "stance.parent-support.opt.care-not-money": "Zeit und Zuwendung statt Geld",
  "stance.parent-support.opt.undecided": "Ich habe das nicht zu Ende gedacht",
  /* bad-month */
  "stance.bad-month.opt.cut": "Ich schränke ein, bis es vorbei ist",
  "stance.bad-month.opt.savings": "Ich nehme es vom Ersparten",
  "stance.bad-month.opt.card": "Es geht auf die Kreditkarte",
  "stance.bad-month.opt.family": "Ich frage die Familie um Hilfe",
  "stance.bad-month.opt.extra-work": "Ich nehme zusätzliche Arbeit an",
  "stance.bad-month.opt.never": "Das ist mir noch nicht passiert",
  /* secrecy-betrayal */
  "stance.secrecy-betrayal.opt.hidden-account": "Ein Konto, das verschwiegen wird",
  "stance.secrecy-betrayal.opt.solo-debt": "Ein Kredit, allein aufgenommen",
  "stance.secrecy-betrayal.opt.lied-cost": "Ein Preis, niedriger genannt als er war",
  "stance.secrecy-betrayal.opt.family-gift": "Ein großes Geschenk an die Familie, unerwähnt",
  "stance.secrecy-betrayal.opt.private-pot": "Ein eigener Spartopf, zurückgehalten",
  "stance.secrecy-betrayal.opt.none": "Nichts davon — Geld bleibt Privatsache",

  /* ── what a position rests on ─────────────────────────────────────── */
  "stance.accounts.groundsPrompt": "Worauf beruht deine Sicht auf gemeinsame Konten?",
  "stance.cost-split.groundsPrompt": "Worauf beruht deine Vorstellung von einer fairen Teilung?",
  "stance.spend-threshold.groundsPrompt": "Worauf beruht diese Summe?",
  "stance.risk-response.groundsPrompt": "Worauf beruht diese Regel für einen Einbruch?",
  "stance.giving-share.groundsPrompt": "Worauf beruht deine Sicht aufs Abgeben?",
  "stance.parent-support.groundsPrompt": "Worauf beruht dieses Gefühl, etwas zu schulden?",
  "stance.grounds.raised": "Wie ich aufgewachsen bin",
  "stance.grounds.lived": "Etwas, das ich erlebt habe",
  "stance.grounds.faith": "Was ich glaube",
  "stance.grounds.numbers": "Die Zahlen, wie sie gerade stehen",
  "stance.grounds.advice": "Ein Rat, den ich bekommen oder gelesen habe",
  "stance.grounds.not-worked-out": "Ich habe das nicht zu Ende gedacht",

  /* ── the playbook ─────────────────────────────────────────────────── */
  /* this is fine */
  "playbook.ok-under-threshold": "Gib alles unter einem Wochenlohn aus, ohne mich vorher zu fragen.",
  "playbook.ok-month-threshold": "Gib bis zu einem Monatslohn aus, ohne es mir überhaupt zu sagen.",
  "playbook.ok-own-account-private": "Halte dein eigenes Konto mit deinem eigenen Geld darauf und sag mir nie, was darauf liegt.",
  "playbook.ok-ask-what-it-cost": "Frag mich, was etwas gekostet hat — ich sage es dir geradeheraus und höre darin keinen Vorwurf.",
  "playbook.ok-pay-less-than-half": "Zahl weniger als die Hälfte der Miete, weil du weniger als die Hälfte von dem verdienst, was reinkommt.",
  "playbook.ok-refuse-my-family": "Sag meiner Familie Nein, wenn sie um Geld bittet, und überlass mir, es ihr zu sagen.",
  "playbook.ok-run-the-admin": "Öffne die Post, mach die Überweisungen und die Steuererklärung, ohne mir davon zu berichten.",
  "playbook.ok-save-first": "Leg das Ersparte am Zahltag weg, bevor irgendwer entscheidet, wofür der Rest da ist.",
  "playbook.ok-tithe-unasked": "Gib ein Zehntel von dem ab, was du verdienst, ohne die Summe jedes Mal mit mir abzustimmen.",
  "playbook.ok-leave-investments-alone": "Lass die Anlagen ein Jahr lang genau dort, wo sie sind, während sie im Minus stehen.",
  "playbook.ok-use-the-buffer": "Nimm in einem schlechten Monat das Fehlende vom Ersparten, ohne vorher darüber zu reden.",
  "playbook.ok-say-we-cannot-afford": "Sag mir, dass wir uns etwas nicht leisten können, statt still einen Weg zu finden, es doch zu können.",
  "playbook.ok-see-my-statements": "Sieh dir jederzeit meine Kontoauszüge an — da steht nichts, was ich vorher wegräumen müsste.",
  "playbook.ok-hand-back-the-admin": "Trag einmal im Monat eine halbe Stunde ein und setz mich mit den Zahlen neben dich.",
  /* this is not */
  "playbook.no-solo-borrowing": "Nimm keinen Kredit und keine Karte auf deinen Namen auf, ohne mir zu sagen, dass es sie gibt.",
  "playbook.no-hidden-account": "Eröffne kein Konto, von dem ich nichts weiß, auch nicht aus einem Grund, den du für gut hältst.",
  "playbook.no-shade-the-price": "Nenn mir keinen niedrigeren Preis als den, den du wirklich gezahlt hast.",
  "playbook.no-sell-in-a-fall": "Verkauf die Anlagen nicht in der Woche, in der sie fallen.",
  "playbook.no-commit-to-a-parent": "Sag einem Elternteil kein Geld für jeden Monat zu, bevor wir zwei das entschieden haben.",
  "playbook.no-card-instead-of-saying": "Schieb kein Loch auf die Kreditkarte, statt mir zu sagen, dass da ein Loch ist.",
  "playbook.no-big-purchase-unsaid": "Gib für nichts mehr als einen Monatslohn aus, ohne es vorher zu sagen.",
  "playbook.no-quiet-pension-stop": "Halte die Altersvorsorge nicht still an, weil ein Monat eng war.",
  "playbook.no-dont-worry-about-it": "Mach nicht den ganzen Papierkram und sag mir dann, ich solle mich um nichts kümmern.",
  "playbook.no-unmentioned-giving": "Gib nicht mehr als einen Wochenlohn ab, ohne es zu erwähnen, so gut die Sache auch ist.",
  "playbook.no-escape-fund": "Leg keinen eigenen Spartopf an für den Fall, dass es zwischen uns schiefgeht.",
  "playbook.no-ask-parents-first": "Frag nicht deine Eltern um Geld, bevor du mich gefragt hast.",
  "playbook.no-silent-resplit": "Ändere nicht die Aufteilung der Rechnungen, indem du einfach anfängst, anders viel zu zahlen.",

  /* ── the instruction sheet ─────────────────────────────────────
     Five headings, on the three channels the spec declares. They track the
     sections closely, unlike the pilot's, because the bank's sections already
     are the shape a sheet wants: what a household runs, what it has to say,
     and what happens when it goes wrong. `undisclosed-debt` has no heading
     here and never will — see `instructions()` in spec.ts. */
  "card.held": "Wo das Geld liegt und wie geteilt wird",
  "card.building": "Was daraus aufgebaut wird",
  "card.saying": "Was ich sage, und wann",
  "card.outward": "Geld, das aus dem Haushalt geht",
  "card.strain": "Wenn es schiefgeht",

  /* ── the one answer that stays here ────────────────────────────
     Drawn on the reader's own result page beside their own answer, because
     that page is local and the answer is theirs. Not drawn like the other
     twelve, because those are in the share link and on the printed sheet and
     this one is in neither. See the note on `Sealed` in View.tsx. */
  "private.label": "Bleibt auf diesem Gerät",
  "private.note": "Diese eine steht in keinem Link zum Teilen und auf keinem gedruckten Blatt. Sie verlässt den Browser nie.",

  /* ── the weights, read back as an order ────────────────────────
     Questions rather than answers, and the private block is in neither list:
     a ranking is the one shape a withheld weight still speaks through. */
  "weight.heaviest": "Wovon du nicht abrückst",
  "weight.lightest": "Wo Spielraum ist",
};
