/**
 * Faith — German.
 *
 * German runs long, and the 80-character gate is measured on these strings
 * rather than on the English they would come from, so the twelve questions are
 * written short from the start: "Wo gehörst du hin in dem, was du glaubst?"
 * rather than a clause-for-clause rendering of the English. Nothing is packed
 * into a compound to get under the limit — a compound noun costs the reader
 * exactly what the extra characters would have.
 *
 * Two register decisions. The whole file is on "du", like the sibling
 * instruments. And it stays out of the vocabulary of any one confession:
 * "Gemeinde" rather than "Pfarrei", "ein religiöser Gottesdienst" rather than
 * "die Messe", "Die Schrift" rather than "Gottes Wort". Somebody who has never
 * held a faith has to be able to read all sixty-five options without being
 * addressed as a lapsed member of anything, and somebody who holds one firmly
 * has to find their own answer in there without it having been softened.
 *
 * Where a year appears it is a plain year of our Lord with nothing set beside it.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Glaube",
  "tagline": "Zwölf Positionen: was du hältst, wie viel es dir wiegt und worauf es beruht.",
  "framework": "Zwölf erklärte Positionen — nichts wird benotet, nichts gezählt",
  "sourceNote": "Hinter diesem Instrument steht kein validierter Fragebogen, und es soll auch keiner dahinterstehen. Die Religiositätsforschung hat eine Landkarte des Themas geliefert und sonst nichts: Glocks fünf Dimensionen von 1962 (Glaube, Praxis, Erfahrung, Wissen, Folgen), Davies Beobachtung von 1994, dass Glauben und Dazugehören auseinandertreten, und Huber und Hubers Zentralitätskonstrukt von 2012 sind der Grund, warum diese zwölf Blöcke danach gruppiert sind, was gehalten wird, was praktiziert wird, woher es kommt und was es berührt. Die Zentralitätsskala der Religiosität, der Duke University Religion Index, Allport und Ross' Skala der religiösen Orientierung, das Religious Commitment Inventory-10, der Santa-Clara-Fragebogen zur Stärke des Glaubens und das Fetzer/NIA-Instrument wurden alle gelesen; keines ihrer Items steht hier. Sie gelesen zu haben ist auch der Grund, warum zwei Fragen eines früheren Entwurfs fehlen. Eine Häufigkeitsleiter zur Teilnahme ist die Form des ersten DUREL-Items und des CRS-Items zur öffentlichen Praxis, also fragt dieses Instrument, wo du hingehörst, statt wie oft du hingehst. Eine Frage danach, was Recht und Unrecht entscheidet, hat die Form eines Pew-Items und verdoppelte zudem das Vokabular der Gründe, das ohnehin unter jedem Block läuft, also wurde sie gestrichen statt umformuliert. Nichts wird gezählt. Es gibt keine Frömmigkeitszahl und keine Rechtgläubigkeitszahl, und es gibt auch keinen Reliabilitätskoeffizienten und keine Faktorenstruktur, denn eine Position, die du erklärst, hat beides nicht und braucht es nicht — niemand stellt dich neben eine Stichprobe, du schreibst auf, was du hältst und worauf es deiner Ansicht nach beruht. Jeder Block, der einen Glauben voraussetzt, trägt eine Option, die diese Voraussetzung zurückweist, sodass der Bogen für jemanden, der einen Glauben fest hält, für jemanden, der einen verlassen hat, und für jemanden, der nie einen hatte, gleichermaßen durchläuft — und keine dieser drei Antworten wird als die unvollständige behandelt. Kein Block fragt nach jemand anderem als nach dir: es gibt hier keine Frage, für die jemand, der allein antwortet, sich erst einen Partner ausdenken müsste.",

  /* ── die fünf Abschnitte ───────────────────────────────────────────── */
  "section.belief.title": "Was gehalten wird",
  "section.belief.note": "Gott, der Tod und das Leid. Auf dieser Seite gibt es keine rechtgläubige Antwort, und nichts darauf wird benotet.",
  "section.practice.title": "Praxis und Zugehörigkeit",
  "section.practice.note": "Die eine Frage ist, wann du es zuletzt getan hast. Die andere ist, wo du hingehörst. Keine wird zur anderen addiert, und keine misst Frömmigkeit.",
  "section.lineage.title": "Woher es kommt, wohin es geht",
  "section.lineage.note": "Der Abstand zwischen deiner Erziehung und dem Ort, an dem du heute stehst, was du weitergeben würdest, und was an dem Tag geschehen soll, an dem du nichts mehr sagen kannst.",
  "section.consequences.title": "Was es berührt",
  "section.consequences.note": "Geld und Zeit. Ein Glaube taucht auf einem Kontoauszug und in einem Kalender auf oder er tut es nicht, und das ist eine Tatsache über einen Haushalt, nicht über eine Seele.",
  "section.edges.title": "Die Kanten",
  "section.edges.note": "Was keinen Spielraum hat und was noch offen ist. Wer dieses Blatt in der Hand hält, braucht die zweite Liste so sehr wie die erste.",

  /* ── was gehalten wird ─────────────────────────────────────────────── */
  "stance.god.prompt": "Was ist Gott für dich?",
  "stance.god.opt.close": "Jemand, zu dem ich spreche und der mich hört",
  "stance.god.opt.distant": "Jemand Wirkliches, dem ich mich nicht nah fühle",
  "stance.god.opt.impersonal": "Ein Wort für etwas, das ich nicht benennen kann",
  "stance.god.opt.untrue": "Eine Vorstellung, die ich nicht für wahr halte",
  "stance.god.opt.open": "Eine Frage, die ich offen lasse",
  "stance.god.opt.rather-not": "Das sage ich lieber nicht",
  "stance.god.groundsPrompt": "Worauf beruht das, was du über Gott hältst?",

  "stance.after-death.prompt": "Was geschieht deiner Ansicht nach, wenn du stirbst?",
  "stance.after-death.opt.life-with-god": "Das Leben geht weiter in Gottes Gegenwart",
  "stance.after-death.opt.another-life": "Ein weiteres Leben, noch einmal gelebt",
  "stance.after-death.opt.something": "Etwas geht weiter, ich könnte nicht sagen was",
  "stance.after-death.opt.nothing": "Es geht nichts weiter",
  "stance.after-death.opt.not-worked-out": "Ich habe das nicht zu Ende gedacht",
  "stance.after-death.opt.rather-not": "Das sage ich lieber nicht",
  "stance.after-death.groundsPrompt": "Worauf beruht diese Antwort über den Tod?",

  "stance.suffering.prompt": "Warum gibt es deiner Ansicht nach Leid?",
  "stance.suffering.opt.reason-i-trust": "Es ist zugelassen, aus einem Grund, dem ich traue",
  "stance.suffering.opt.reason-unknown": "Es ist zugelassen, und ich weiß nicht warum",
  "stance.suffering.opt.no-one-allows": "Niemand lässt es zu — es geschieht einfach",
  "stance.suffering.opt.people-do-it": "Es ist das, was Menschen einander antun",
  "stance.suffering.opt.not-worked-out": "Ich habe das nicht zu Ende gedacht",
  "stance.suffering.opt.rather-not": "Das sage ich lieber nicht",
  "stance.suffering.groundsPrompt": "Worauf beruht diese Antwort über das Leid?",

  /* ── Praxis und Zugehörigkeit ──────────────────────────────────────── */
  "stance.prayer-last.prompt": "Wann hast du zuletzt für dich allein gebetet?",
  "stance.prayer-last.opt.today": "Heute",
  "stance.prayer-last.opt.this-week": "In der letzten Woche",
  "stance.prayer-last.opt.this-year": "Im letzten Jahr",
  "stance.prayer-last.opt.longer-ago": "Länger her als das",
  "stance.prayer-last.opt.never": "Nie, soweit ich weiß",
  "stance.prayer-last.groundsPrompt": "Worauf beruht dein Beten?",

  "stance.belonging.prompt": "Wo gehörst du hin in dem, was du glaubst?",
  "stance.belonging.opt.known-by-name": "Eine Gemeinde, die mich beim Namen kennt",
  "stance.belonging.opt.a-face": "Eine Gemeinde, in der ich ein Gesicht bin, kein Name",
  "stance.belonging.opt.people-not-institution": "Menschen, mit denen ich außerhalb einer Institution praktiziere",
  "stance.belonging.opt.tradition-only": "Eine Tradition, ohne eine Gruppe von Menschen",
  "stance.belonging.opt.nowhere-content": "Nirgends, aus freien Stücken",
  "stance.belonging.opt.nowhere-missed": "Nirgends, obwohl ich es gern hätte",
  "stance.belonging.groundsPrompt": "Worauf beruht deine Zugehörigkeit?",

  /* ── woher es kommt, wohin es geht ─────────────────────────────────── */
  "stance.raised-vs-now.prompt": "Was hat sich zwischen deiner Erziehung und heute geändert?",
  "stance.raised-vs-now.opt.stayed": "Nichts — ich halte, worin ich aufgewachsen bin",
  "stance.raised-vs-now.opt.stayed-differently": "Derselbe Glaube, anders gehalten als gelehrt",
  "stance.raised-vs-now.opt.left": "Ich habe ihn verlassen und halte heute keinen",
  "stance.raised-vs-now.opt.found": "Ich halte einen Glauben, in dem ich nicht aufwuchs",
  "stance.raised-vs-now.opt.none-either-way": "Damals kein Glaube, heute auch nicht",
  "stance.raised-vs-now.opt.still-moving": "Ich bin noch in Bewegung",
  "stance.raised-vs-now.groundsPrompt": "Worauf beruht der Ort, an dem du heute stehst?",

  "stance.children-taught.prompt": "Was soll ein Kind in deiner Obhut über Glauben lernen?",
  "stance.children-taught.opt.raised-in-it": "In meinem Glauben aufwachsen, von Haus aus",
  "stance.children-taught.opt.taught-then-choose": "Meinen Glauben lernen, dann frei wählen",
  "stance.children-taught.opt.several": "Von mehreren Glaubensweisen lernen, keine bevorzugt",
  "stance.children-taught.opt.none-unless-asked": "Nichts Religiöses, bis es selbst fragt",
  "stance.children-taught.opt.undecided": "Ich habe mich nicht entschieden",
  "stance.children-taught.groundsPrompt": "Worauf beruht diese Antwort über ein Kind?",

  "stance.funeral.prompt": "Was soll bei deiner eigenen Beerdigung geschehen?",
  "stance.funeral.opt.full-rite": "Der Ritus meines Glaubens, vollständig",
  "stance.funeral.opt.simple-rite": "Ein religiöser Gottesdienst, kurz gehalten",
  "stance.funeral.opt.words-not-religious": "Worte über mir, keines davon religiös",
  "stance.funeral.opt.nothing-religious": "Nichts Religiöses, in keiner Form",
  "stance.funeral.opt.whatever-comforts": "Was den Menschen dort Trost gibt",
  "stance.funeral.opt.undecided": "Ich habe mich nicht entschieden",
  "stance.funeral.groundsPrompt": "Worauf beruht diese Antwort über deine Beerdigung?",

  /* ── was es berührt ────────────────────────────────────────────────── */
  "stance.money-use.prompt": "Wo zeigt sich dein Glaube in deinem Geld?",
  "stance.money-use.opt.fixed-share": "Ein fester Anteil des Einkommens wird abgegeben",
  "stance.money-use.opt.give-when-asked": "Ich gebe, wenn ich gefragt werde, ohne festen Anteil",
  "stance.money-use.opt.wont-earn": "Es gibt Geld, das ich nicht verdienen werde",
  "stance.money-use.opt.wont-spend": "Es gibt Geld, das ich nicht ausgeben werde",
  "stance.money-use.opt.touches-nothing": "Er berührt nichts von meinem Geld",
  "stance.money-use.opt.not-thought": "Ich habe nicht darüber nachgedacht",
  "stance.money-use.groundsPrompt": "Worauf beruht diese Antwort über dein Geld?",

  "stance.work-rest.prompt": "Gibt es eine Zeit, die dein Glaube von Arbeit frei hält?",
  "stance.work-rest.opt.whole-day": "Ja, ein ganzer Tag, den ich frei halte",
  "stance.work-rest.opt.part-day": "Ja, ein Teil eines Tages",
  "stance.work-rest.opt.in-principle": "Im Grunde ja, nur schaffe ich es nicht",
  "stance.work-rest.opt.no-but-rest": "Nein, ich ruhe aus anderen Gründen",
  "stance.work-rest.opt.no": "Nein",
  "stance.work-rest.groundsPrompt": "Worauf beruht diese Antwort über deine Zeit?",

  /* ── die Kanten ────────────────────────────────────────────────────── */
  "stance.non-negotiable.prompt": "Was würdest du im Glauben nicht aufgeben?",
  "stance.non-negotiable.opt.children": "Wie Kinder in meiner Obhut erzogen werden",
  "stance.non-negotiable.opt.practice": "Zu praktizieren, auch wo es unerwünscht ist",
  "stance.non-negotiable.opt.saying-so": "Zu sagen, was ich glaube, wenn ich gefragt werde",
  "stance.non-negotiable.opt.belonging": "Teil der Menschen zu bleiben, mit denen ich zusammenkomme",
  "stance.non-negotiable.opt.left-alone": "Damit in Ruhe gelassen zu werden",
  "stance.non-negotiable.opt.nothing": "Nichts davon steht außerhalb der Diskussion",
  "stance.non-negotiable.groundsPrompt": "Worauf beruht diese Weigerung?",

  "stance.unsettled.prompt": "Worin bist du wirklich unsicher?",
  "stance.unsettled.opt.god-exists": "Ob es überhaupt einen Gott gibt",
  "stance.unsettled.opt.after-death": "Was nach dem Tod geschieht",
  "stance.unsettled.opt.suffering": "Warum Leid zugelassen ist",
  "stance.unsettled.opt.tradition-right": "Ob die Tradition, aus der ich komme, recht hat",
  "stance.unsettled.opt.own-honesty": "Ob ich es glaube oder nur die Gewohnheit halte",
  "stance.unsettled.opt.nothing-unsure": "Nichts davon ist bei mir offen",
  "stance.unsettled.groundsPrompt": "Worauf beruht diese Unsicherheit?",

  /* ── worauf es beruht ──────────────────────────────────────────────
     Ein Vokabular unter allen zwölf Fragen. "Die Schrift" muss unter jeder
     dasselbe Wort sein, sonst lassen sich zwei Antworten nicht als derselbe
     Grund lesen. */
  "stance.grounds.scripture": "Die Schrift",
  "stance.grounds.church": "Die Lehre meiner Kirche",
  "stance.grounds.reason": "Vernunft und Argument",
  "stance.grounds.experience": "Etwas, das ich erlebt habe",
  "stance.grounds.upbringing": "Wie ich aufgewachsen bin",
  "stance.grounds.people": "Menschen, denen ich vertraue",
  "stance.grounds.not-worked-out": "Ich habe das nicht zu Ende gedacht",

  /* ── Sätze zum Weitergeben ─────────────────────────────────────────
     Zweite Person, vollständig, ohne Änderung an jemanden übergebbar. */
  /* das ist in Ordnung */
  "playbook.ok-call-me-on-the-day": "Du kannst mich an dem Tag anrufen, den ich frei halte, wenn wirklich etwas ist. Mir ist der Anruf lieber.",
  "playbook.ok-pray-around-me": "Du kannst weiterreden und dich bewegen, während ich bete. Der Raum muss dafür nicht still werden.",
  "playbook.ok-ask-me-straight": "Du kannst mich geradeheraus fragen, ob ich es glaube. Du bekommst eine schlichte Antwort, und keine lange.",
  "playbook.ok-say-i-dont-look-it": "Du kannst sagen, dass ich nicht aussehe wie jemand, der das glaubt. Ich weiß, wie es wirkt. Es stimmt trotzdem.",
  "playbook.ok-say-grace": "Du kannst an deinem Tisch beten, während ich dabeisitze. Ich bin still, und es kostet mich nichts.",
  "playbook.ok-invite-me-anyway": "Du kannst mich zum Gottesdienst bei deiner Hochzeit oder bei der Taufe deines Kindes einladen. Ich komme.",
  "playbook.ok-ask-me-along": "Du kannst mich fragen, ob ich mitkomme. Ein zweites Mal fragen ist in Ordnung, ich weiche nicht absichtlich aus.",
  "playbook.ok-name-the-old-parish": "Du kannst die Kirche meiner Kindheit erwähnen, ohne die Stimme zu senken. Das ist keine Wunde.",
  "playbook.ok-answer-my-kids-honestly": "Du kannst meinen Kindern ehrlich sagen, was du glaubst, auch dort, wo du mir widersprichst.",
  "playbook.ok-take-them-along": "Nimm ein Kind mit dorthin, wo du hingehst. Ich will, dass es das gesehen hat, bevor es alt genug ist zu wählen.",
  "playbook.ok-ask-what-i-give": "Du kannst mich fragen, was ich abgebe und wer es bekommt. Die Zahl ist kein Geheimnis.",
  "playbook.ok-call-out-the-slip": "Du darfst mir sagen, dass ich die Zeit frei halten wollte und dann durchgearbeitet habe. Das ist fair.",
  "playbook.ok-plain-speech-about-death": "Du kannst vor mir davon sprechen, dass jemand stirbt, ohne nach einer Formulierung zu suchen. Klare Worte sind mir leichter.",
  "playbook.ok-bring-hard-questions": "Du kannst mir deine härteste Frage zum Leid bringen. Ich werde nichts verteidigen.",
  "playbook.ok-ask-in-public": "Du kannst mich vor anderen fragen, was ich glaube. Mir ist antworten lieber, als davor geschützt zu werden.",
  /* das ist es nicht */
  "playbook.no-small-work-messages": "Schick mir an dem Tag, den ich frei halte, keine Arbeitsnachrichten, auch keine kurzen.",
  "playbook.no-phase-talk": "Beschreib mein Beten nicht als Stimmung oder als Phase, durch die ich gerade gehe.",
  "playbook.no-praying-over-me": "Bete nicht über mir, ohne mich vorher zu fragen.",
  "playbook.no-treating-it-as-taste": "Behandle das, was ich halte, nicht als meinen Geschmack statt als Aussage, die ich für wahr halte.",
  "playbook.no-fixing-the-distance": "Behandle den Abstand, den ich zu Gott spüre, nicht als Problem, das du für mich lösen musst.",
  "playbook.no-you-will-return": "Sag mir nicht, dass ich im Alter dahin zurückkomme. Ich habe es gehört, und es kommt als Verachtung an.",
  "playbook.no-unexamined-assumption": "Nimm nicht an, dass ich das nie geprüft habe, nur weil ich darin aufgewachsen bin.",
  "playbook.no-service-detour": "Nimm meine Kinder nicht in den Gottesdienst eines anderen Glaubens mit, ohne mich zu fragen.",
  "playbook.notok-baptism-without-me": "Lass ein Kind nicht taufen oder segnen, ohne dass ich im Raum bin.",
  "playbook.no-filling-in-my-view": "Erzähl anderen nicht, was ich vom Tod halte, wenn jemand gestorben ist. Ich habe es nicht entschieden.",
  "playbook.no-supplying-the-reason": "Reich mir keinen Grund für das, was geschehen ist. Ich halte, dass es einen gibt und dass ich ihn nicht erfahre.",
  "playbook.no-raiding-the-giving": "Behandle das, was ich abgebe, nicht als Geld, das für etwas anderes verfügbar war.",
  "playbook.no-improvising-the-funeral": "Improvisiere bei meiner Beerdigung nicht. Der Ritus ist aufgeschrieben und ich will ihn so, wie er dasteht.",
  "playbook.no-doubt-as-ammunition": "Bring meine Zweifel nicht in einem Streit an, in dem es um etwas anderes geht.",
  "playbook.no-deciding-without-me": "Entscheide nichts über den Glauben, in dem meine Kinder aufwachsen, wenn ich nicht im Raum bin.",

  /* ── das gedruckte Blatt ───────────────────────────────────────────
     Sechs Überschriften auf drei Kanälen. Nicht die Abschnitte des Bogens:
     die sind die Reihenfolge, in der gefragt wird, und ein Blatt schlägt
     jemand mitten am Tag nach. */
  "card.holds": "Was ich halte und worauf es beruht",
  "card.belong": "Wo ich hingehöre",
  "card.passed-on": "Kinder, meine Beerdigung und mein Geld",
  "card.kept-clear": "Die Zeit, die mein Glaube frei hält",
  "card.no-give": "Was ich nicht aufgebe",
  "card.still-open": "Was ich nicht entschieden habe",

  /* ── die Ergebnisseite ─────────────────────────────────────────────── */
  "view.rests": "Beruht auf:",
  "view.heaviest.title": "Was du am schwersten gewichtet hast",
  "view.heaviest.note": "Die Fragen, denen du das meiste Gewicht gegeben hast. Hier wird nichts addiert und mit niemandem verglichen — es ist die Stelle, an der es nach deinen eigenen Worten am wenigsten Spielraum gibt, und wer dieses Blatt liest, sollte das wissen, bevor er in eine davon hineinläuft.",
  "view.lightest.title": "Was du am leichtesten gewichtet hast",
  "view.lightest.note": "Beantwortet und mit dem geringsten Gewicht versehen. Das ist nicht dasselbe wie keine Position: du sagst damit, dass hier Spielraum ist, und für die Person, die dieses Blatt liest, ist das genauso viel wert wie die Liste darüber.",
};
