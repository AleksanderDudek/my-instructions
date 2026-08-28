/**
 * good-life — German.
 *
 * Key for key with `en.ts`, which is the source of truth; only the values are
 * written, and sie sind auf Deutsch geschrieben und nicht aus dem Englischen
 * herübergetragen. §8 of the stated-positions design asks for four originals,
 * so the sixteen questions here are the ones somebody puts to themselves in
 * German: `open-avoid` is „Wovor drückst du dich?“ — four words, as blunt as
 * the English, reached by asking the question in German rather than by kürzen
 * an English sentence until it fits.
 *
 * The eighty-character gate in `test/i18n/readability.test.ts` is measured on
 * this string and not on the one it came from. German runs about a third
 * longer than English and compounds where English takes a phrase, so the long
 * prompts — `enough-point`, `keep-one`, `regret-most` — were asked again in
 * German instead of reassembled from English clauses. The forbidden joiners
 * for `de` are „, aber “ and „; “, and no prompt here wants either: every
 * question that asked for one was asking two things.
 *
 * `du` throughout, as everywhere in this app. This is somebody sitting alone
 * with the question of what their own life should contain, and `Sie` would
 * turn sixteen questions into eine Beratung.
 *
 * Job, career and calling stand in the `sourceNote` as Broterwerb, Laufbahn
 * und Berufung — the German trichotomy exists and needs no rendering into one.
 * `work-purpose.opt.standing` is „Stellung“ rather than „Status“, because the
 * block asks about being taken seriously and not about being envied, and
 * `keep-one.opt.time` is „Selbst über meine Zeit zu bestimmen“, because
 * „Kontrolle über meine Stunden“ is an English sentence wearing German words.
 *
 * Two phrases are word for word what the other German tables already say, so
 * that somebody who takes two of these can read two answers as one answer:
 * „Ich habe das nicht zu Ende gedacht“ is what `money-management`, `faith` and
 * `before-marriage` already offer under this English, and „Ich habe mich nicht
 * festgelegt“ is `family-plan`'s and `money-management`'s. The English keeps
 * „I have not worked that out“ and „I have not decided“ apart — the first is a
 * thought never finished, the second a decision never made — and so does this.
 *
 * The not-OK lines are negative imperatives — „Ruf mich nicht an, wenn …“ — as
 * in `boundaries` and `money-management`. An infinitive list under the heading
 * reads like a notice on a wall, and these are sentences one person hands to
 * another. Nothing here makes the reader pick a gender, for themselves or for
 * the person they hand the sheet to.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Ein gutes Leben",
  "tagline": "Zwölf Haltungen dazu, was ein gelungenes Leben enthielte, und vier Fragen, die nur du liest.",
  "framework": "Zwölf Haltungen und vier offene Fragen — nichts wird ausgewertet",
  "sourceNote": "Hinter diesem hier steht kein Instrument, und das muss auch nicht sein. Die Literatur zum Wohlbefinden — hedonische und eudaimonische Ansätze, Ryffs sechs Dimensionen, die drei Bedürfnisse der Selbstbestimmungstheorie, Seligmans PERMA, die elf Bereiche der OECD — wurde allein als Liste dessen gelesen, was ein Leben üblicherweise enthalten soll, und übernommen wurde daraus nichts: Diese Fragebögen gehören ihren Autoren, mehrere verlangen eine schriftliche Erlaubnis, und keiner davon wird hier wiedergegeben oder umschrieben. Ein alter und öffentlicher Gedanke dient als Rahmen und nicht als Liste, nämlich dass Arbeit als Broterwerb, als Laufbahn oder als Berufung gehalten werden kann. Der Fragebogen, der auf diesem Gedanken aufbaut, wird nicht verwendet und nicht umschrieben. Die eine Stelle, an der Forschung eine Frage geformt hat statt nur eine Liste zu liefern, ist der letzte geschlossene Block: Er fragt, was du bereuen würdest, nicht getan zu haben, und nicht, was du getan zu haben bereust — nach dem Befund, dass über ein Leben hinweg das Unterlassene länger nachhängt als das Getane. Der Befund wurde seither wiederholt gefunden, mit schwächeren Effekten und nicht in jeder Studie, also lies ihn als Grund für die Richtung der Frage und nicht als Tatsache über dich. Die vier Fragen am Ende haben überhaupt keine Antwortmöglichkeiten und verlassen dieses Gerät nie. Nichts auf dieser Seite wird ausgewertet, eingeordnet oder gegen die Antworten anderer gestellt. Zurück kommt, was du gesagt hast, in der Reihenfolge des Gewichts, das du daraufgelegt hast — und darum sind die Gründe, die du schreibst, mehr wert als die Kästchen, die du ankreuzt.",

  /* ── the sections ─────────────────────────────────────────────────── */
  "section.work.title": "Wofür die Arbeit da ist",
  "section.work.note": "Zwei Fragen dazu, wofür die Arbeit da ist. Sie stehen vorn, weil Arbeit das am wenigsten heikle Thema hier ist und weil die Antwort jede spätere Antwort über Geld anders lesen lässt. Eine der Antworten auf die zweite verzichtet aufs Wachsen, und sie zählt wie jede andere.",
  "section.money.title": "Geld, und wo genug ist",
  "section.money.note": "Drei Fragen. Bei der ersten kannst du bis zu zwei Dinge ankreuzen, weil Geld wirklich mehr als einem Zweck zugleich dient. Die zweite fragt nicht nach einem Betrag, sondern danach, was wahr sein müsste, damit du aufhörst. Die dritte fragt, wie weit ein Risiko in dein Leben hineinreichen darf.",
  "section.place.title": "Wo, und wer in der Nähe ist",
  "section.place.note": "Wo du wohnst und wer in der Nähe ist, gehen öfter auseinander, als es aussieht: Die Stadt kann feststehen und die Menschen darin nicht, oder umgekehrt. Die erste Frage misst nur eines, die Entfernung von dort, wo du heute bist. Die zweite lässt zwei Antworten zu und wird dadurch eine Wahl und keine Liste.",
  "section.week.title": "Der Körper und die Woche",
  "section.week.note": "Die erste Frage geht darum, worauf du jetzt schon verzichtest, und nicht darum, was du vorhast — der Vorsatz gehört in das Gewicht darunter. Die zweite blickt ein Jahr voraus und benennt das, was du zuerst streichen würdest.",
  "section.keep.title": "Was du behältst, was du schuldest",
  "section.keep.note": "Die erste Frage ist die härteste und lässt mit Absicht nur eine Antwort zu: Wäre alles erlaubt, behielte jeder alles, und das sagt nichts. Die Gesundheit muss hier gegen die Menschen antreten, mit denen du lebst, und gegen das Bestimmen über deine eigenen Stunden. Die zweite lässt zwei zu.",
  "section.later.title": "Rückblick mit siebzig",
  "section.later.note": "Eine Frage, die letzte mit Antwortmöglichkeiten. Elf Haltungen sind schon erklärt, bevor gefragt wird, welches Fehlen brennen würde. „Nichts davon“ ist hier eine ganze Antwort und kein Ausweg.",
  "section.open.title": "Freiraum",
  "section.open.note": "Vier Fragen ohne Antwortmöglichkeiten. Was du schreibst, wird nicht ausgewertet, mit niemandem verglichen, geht in keinen Link und steht auf keinem Anleitungsblatt — es bleibt auf diesem Gerät. Die letzte ist vier Wörter lang, weil jedes weitere Wort einen Weg zu einer sanfteren Frage anbieten würde.",

  /* ── the questions ────────────────────────────────────────────────── */
  "stance.work-purpose.prompt": "Wofür ist deine Arbeit vor allem da?",
  "stance.learn-next.prompt": "Worin willst du in zehn Jahren sichtbar besser sein?",
  "stance.money-for.prompt": "Wofür ist Geld vor allem da?",
  "stance.enough-point.prompt": "Was muss stimmen, damit du aufhörst, mehr verdienen zu wollen?",
  "stance.risk-appetite.prompt": "Was würdest du für Arbeit riskieren, die du wirklich willst?",
  "stance.live-where.prompt": "Wo willst du in zehn Jahren leben?",
  "stance.who-near.prompt": "Für wen würdest du hierbleiben?",
  "stance.health-effort.prompt": "Worauf verzichtest du jetzt, um gesund zu bleiben?",
  "stance.less-of.prompt": "Wovon willst du nächstes Jahr am ehesten weniger?",
  "stance.keep-one.prompt": "Wenn du nur eines davon behalten dürftest, welches wäre es?",
  "stance.owe-others.prompt": "Was schuldest du Menschen außerhalb deines Haushalts?",
  "stance.regret-most.prompt": "Was davon würdest du mit siebzig bereuen, nicht getan zu haben?",

  /* ── what may be answered ─────────────────────────────────────────── */
  /* work-purpose */
  "stance.work-purpose.opt.income": "Sie bezahlt das Leben, das ich daneben habe",
  "stance.work-purpose.opt.craft": "In der Sache selbst gut zu werden",
  "stance.work-purpose.opt.service": "Bestimmten Menschen von Nutzen zu sein",
  "stance.work-purpose.opt.standing": "Stellung — ernst genommen zu werden",
  "stance.work-purpose.opt.structure": "Struktur. Mit einer offenen Woche komme ich schlecht klar",
  "stance.work-purpose.opt.undecided": "Ich habe das nicht zu Ende gedacht",
  /* learn-next */
  "stance.learn-next.opt.trade": "Die Arbeit, die ich schon mache",
  "stance.learn-next.opt.newskill": "Etwas, womit ich noch gar nicht angefangen habe",
  "stance.learn-next.opt.people": "Der Umgang mit Menschen, vor allem im Streit",
  "stance.learn-next.opt.temper": "Den Kopf behalten, wenn etwas schiefgeht",
  "stance.learn-next.opt.nothing": "Nichts. Ich will behalten, was ich habe, und es nutzen",
  "stance.learn-next.opt.unknown": "Ich weiß es noch nicht",
  /* money-for */
  "stance.money-for.opt.safety": "Ein Polster, damit mich nichts zwingen kann",
  "stance.money-for.opt.freedom": "Es kauft die Freiheit, Nein zu sagen",
  "stance.money-for.opt.provide": "Für die zu sorgen, die auf mich angewiesen sind",
  "stance.money-for.opt.now": "Es jetzt für Dinge ausgeben, an die ich mich erinnern werde",
  "stance.money-for.opt.give": "Es abgeben, solange ich sehe, wo es ankommt",
  "stance.money-for.opt.undecided": "Ich habe das nicht zu Ende gedacht",
  /* enough-point */
  "stance.enough-point.opt.number": "Eine bestimmte Summe auf dem Konto",
  "stance.enough-point.opt.nodebt": "Keine Schulden mehr, das Haus eingeschlossen",
  "stance.enough-point.opt.hours": "Wenn mehr verdienen Zeit kostet, die ich haben will",
  "stance.enough-point.opt.never": "Nichts. Ich rechne nicht damit aufzuhören",
  "stance.enough-point.opt.already": "Nichts muss sich ändern. Ich habe jetzt genug",
  "stance.enough-point.opt.unknown": "Ich habe mir nie eine Grenze gesetzt",
  /* risk-appetite */
  "stance.risk-appetite.opt.nothing": "Nichts. Beständigkeit ist das, was ich schütze",
  "stance.risk-appetite.opt.months": "Ein paar Monate vom Ersparten, mehr nicht",
  "stance.risk-appetite.opt.savings": "Das meiste von dem, was ich zurückgelegt habe",
  "stance.risk-appetite.opt.income": "Jahre mit weniger Geld für den Haushalt",
  "stance.risk-appetite.opt.house": "Das Haus und den Lebensstandard darin",
  "stance.risk-appetite.opt.unsure": "Das weiß ich erst, wenn es vor mir liegt",
  /* live-where */
  "stance.live-where.opt.here": "Hier. Dieser Ort, womöglich diese Straße",
  "stance.live-where.opt.near": "Höchstens eine Stunde von hier",
  "stance.live-where.opt.country": "Woanders in diesem Land",
  "stance.live-where.opt.abroad": "In einem anderen Land",
  "stance.live-where.opt.movable": "Nirgends fest. Ich will umziehen können",
  "stance.live-where.opt.undecided": "Ich habe mich nicht festgelegt",
  /* who-near */
  "stance.who-near.opt.partner": "Die Person, mit der ich lebe",
  "stance.who-near.opt.children": "Kinder, meine oder welche, die ich miterziehe",
  "stance.who-near.opt.parents": "Meine Eltern, solange sie mich brauchen",
  "stance.who-near.opt.friends": "Alte Freunde, die hier sind",
  "stance.who-near.opt.community": "Eine Gruppe hier, bei der ich auftauche",
  "stance.who-near.opt.nobody": "Niemand. Ich würde gehen",
  /* health-effort */
  "stance.health-effort.opt.nothing": "Gerade nichts",
  "stance.health-effort.opt.sleep": "Abende außer Haus, für den Schlaf",
  "stance.health-effort.opt.drink": "Alkohol oder etwas anderes, das ich gern hatte",
  "stance.health-effort.opt.training": "Zwei, drei Stunden Training in der Woche",
  "stance.health-effort.opt.spend": "Geld — Essen, Behandlungen, Zähne",
  "stance.health-effort.opt.checks": "Zeit — Termine, bevor etwas weh tut",
  /* less-of */
  "stance.less-of.opt.hours": "Arbeitsstunden",
  "stance.less-of.opt.obligations": "Verpflichtungen, die ich nicht gewählt habe",
  "stance.less-of.opt.debt": "Schulden und was sie mich hinnehmen lassen",
  "stance.less-of.opt.screen": "Zeit am Bildschirm zu Hause",
  "stance.less-of.opt.noise": "Lärm — Menschen, Verkehr, Unordnung, Störungen",
  "stance.less-of.opt.nothing": "Nichts. Der Zuschnitt des Jahres stimmt",
  /* keep-one */
  "stance.keep-one.opt.health": "Meine Gesundheit",
  "stance.keep-one.opt.people": "Die Menschen, mit denen ich lebe",
  "stance.keep-one.opt.voice": "Sagen zu können, was ich wirklich denke",
  "stance.keep-one.opt.time": "Selbst über meine Zeit zu bestimmen",
  "stance.keep-one.opt.standard": "Den Lebensstandard, den ich jetzt habe",
  "stance.keep-one.opt.unknown": "Ich musste das nie herausfinden",
  /* owe-others */
  "stance.owe-others.opt.nothing": "Nichts, außer sie in Ruhe zu lassen",
  "stance.owe-others.opt.money": "Einen festen Anteil von dem, was ich verdiene",
  "stance.owe-others.opt.time": "Zeit — auftauchen, fahren, bei jemandem sitzen",
  "stance.owe-others.opt.parents": "Meine Eltern zu pflegen, wenn es so weit ist",
  "stance.owe-others.opt.useful-work": "Arbeit, die mehr nützt, als sie mir einbringt",
  "stance.owe-others.opt.local": "Da zu sein für den Ort, an dem ich wohne",
  /* regret-most */
  "stance.regret-most.opt.children": "Kinder zu bekommen oder mehr davon",
  "stance.regret-most.opt.venture": "Das anzufangen, was ich immer geplant habe",
  "stance.regret-most.opt.place": "Woanders zu leben, solange ich es noch konnte",
  "stance.regret-most.opt.mend": "Eine Beziehung zu kitten, bevor es zu spät war",
  "stance.regret-most.opt.body": "Auf meinen Körper zu achten, solange er sich noch erholte",
  "stance.regret-most.opt.none": "Nichts davon. So denke ich nicht",

  /* ── the playbook ─────────────────────────────────────────────────── */
  /* this is fine */
  "playbook.ok-harder-not-bigger": "Gib mir die schwierigere Aufgabe, bevor du mir die größere gibst.",
  "playbook.ok-money-not-title": "Bezahl mir die Mehrarbeit, statt mich dafür zu befördern.",
  "playbook.ok-name-who-benefits": "Sag mir, wem das wirklich hilft, und ich mache auch den stumpfen Teil davon.",
  "playbook.ok-give-me-fixed-hours": "Gib mir feste Zeiten, und ich bin in allem darin besser.",
  "playbook.ok-stop-offering-growth": "Geh davon aus, dass ich keine neue Herausforderung suche, und schlag mich für keine vor.",
  "playbook.ok-put-me-in-hard-talks": "Steck mich absichtlich in das schwierige Gespräch. Genau darin will ich besser werden.",
  "playbook.ok-tell-me-when-i-snapped": "Sag mir an dem Tag, an dem es passiert, wenn ich dich angefahren habe.",
  "playbook.ok-ask-before-buffer": "Frag mich, bevor etwas vom Ersparten weggeht. Ich sage fast immer Ja.",
  "playbook.ok-shorter-week-first": "Biete mir die kürzere Woche an, bevor du mir das höhere Gehalt anbietest.",
  "playbook.ok-book-it-now": "Buch das Teure jetzt. Ich zahle lieber dafür, als darauf zu warten.",
  "playbook.ok-ask-me-for-something-specific": "Frag mich um Geld für eine bestimmte Sache und nicht für einen guten Zweck.",
  "playbook.ok-no-is-not-modesty": "Glaub mir, wenn ich sage, dass ich den größeren Posten nicht will. Das ist keine Bescheidenheit.",
  "playbook.ok-price-it-in-hours": "Sag mir, was das Mehr an Geld an Stunden kostet, bevor ich entscheiden soll.",
  "playbook.ok-risk-stops-at-my-savings": "Bring mir den riskanten Plan, solange der Schaden bei meinem eigenen Ersparten aufhört.",
  "playbook.ok-safe-version-first": "Bring mir zuerst die sichere Fassung des Plans, und ich höre richtig zu.",
  "playbook.ok-ask-me-to-move": "Bitte mich umzuziehen, wenn es sich dafür lohnt. An dieser Adresse hänge ich nicht.",
  "playbook.ok-find-the-version-that-stays": "Such nach der Fassung davon, für die ich nicht weggehen muss.",
  "playbook.ok-bring-me-the-other-city": "Bring mir die Stelle in einer anderen Stadt. Hier hält mich niemand.",
  "playbook.ok-dates-early-for-parents": "Gib mir die Termine früh. Ich plane die Wochenenden um meine Eltern herum.",
  "playbook.ok-early-not-late": "Leg mich früh am Morgen fest und nicht spät am Abend.",
  "playbook.ok-either-side-of-lunch": "Leg das Treffen vor oder nach die Mittagszeit. Mitten am Tag trainiere ich.",
  "playbook.ok-cut-something": "Nimm etwas von meiner Liste. Ich mache lieber weniger und das ordentlich.",
  "playbook.ok-ask-before-my-name": "Frag mich, bevor du meinen Namen auf etwas setzt, auch auf etwas Kleines.",
  "playbook.ok-ask-what-i-think": "Frag mich, was ich wirklich denke, solange die Entscheidung noch offen ist.",
  "playbook.ok-deadline-not-hours": "Gib mir die Frist und überlass mir die Stunden.",
  "playbook.ok-call-me-to-show-up": "Ruf mich an, wenn jemand gefahren, abgeholt oder begleitet werden muss.",
  "playbook.ok-tell-me-the-street-needs-it": "Sag mir, wenn in der Straße etwas zu tun ist, und ich tauche dafür auf.",
  "playbook.ok-tell-me-about-the-opening": "Sag mir, wenn du von etwas hörst, für das ich diese Stelle aufgeben sollte.",
  "playbook.ok-say-if-i-have-gone-quiet": "Wenn ich bei jemandem still geworden bin, sag es mir. Ich höre es lieber.",
  "playbook.ok-leave-me-out-of-the-thread": "Lass mich eine Woche aus dem Gruppenchat und lies nichts hinein.",
  /* this is not */
  "playbook.not-reassign-my-work": "Gib meinen Teil nicht an jemand Schnelleren, weil der Termin sich verschoben hat.",
  "playbook.not-title-instead-of-money": "Biete mir keinen Titel statt Geld an und erwarte, dass er als Belohnung ankommt.",
  "playbook.not-remove-the-hours": "Nimm mir nicht die festen Zeiten und nenn es Flexibilität.",
  "playbook.not-unasked-development": "Melde mich nicht zu Fortbildungen an, um die ich nicht gebeten habe.",
  "playbook.not-spend-the-buffer": "Gib die Rücklage für den Notfall nicht für etwas aus, das kein Notfall ist.",
  "playbook.not-assume-my-income": "Mach keine Pläne, die mit meinem Einkommen rechnen, und erzähl mir hinterher davon.",
  "playbook.not-tell-me-i-have-enough": "Sag mir nicht, dass ich genug habe. Das zu beurteilen steht mir zu.",
  "playbook.not-laugh-at-the-target": "Nimm die Summe, auf die ich spare, nicht als Witz.",
  "playbook.not-stake-what-i-depend-on": "Setz nichts, worauf ich angewiesen bin, in einen Plan, dem ich nicht zugestimmt habe.",
  "playbook.not-talk-me-out-of-it": "Rede mir kein Risiko aus, für das ich mich schon entschieden habe.",
  "playbook.not-assume-i-will-move": "Halte den Wegzug nicht für die selbstverständliche Antwort, wenn sich die Arbeit ändert.",
  "playbook.not-assume-i-will-stay": "Geh nicht davon aus, dass ich in fünf Jahren noch hier wohne.",
  "playbook.not-book-my-parent-weekends": "Verplan das Wochenende nicht, ohne zu fragen, ob ich bei meinen Eltern gebraucht werde.",
  "playbook.not-two-weekends-running": "Bitte mich nicht um zwei Wochenenden hintereinander. Ich zähle sie ohnehin schon.",
  "playbook.not-press-the-drink": "Biete mir kein zweites Mal etwas zu trinken an, wenn ich einmal Nein gesagt habe.",
  "playbook.not-joke-about-checkups": "Mach keine Witze über die Arzttermine. Früh hinzugehen ist keine Hypochondrie.",
  "playbook.not-volunteer-me": "Trag mich nirgends ein und sag es mir hinterher.",
  "playbook.not-message-me-late": "Schick mir nach neun keine Arbeitsnachrichten und erwarte eine Antwort darauf.",
  "playbook.not-fill-my-calendar": "Füll mir nicht die Woche und frag dann, warum ich mit Menschen kurz angebunden bin.",
  "playbook.not-every-evening-out": "Leg nicht an jeden Abend etwas. Ich will im Haus sein.",
  "playbook.not-sign-me-up-locally": "Melde mich nicht für die Sammlung, den Ausschuss oder das Straßenfest an.",
  "playbook.not-joke-about-children": "Mach keine Witze darüber, ob ich Kinder bekommen werde.",
  "playbook.not-ring-me": "Ruf mich nicht an, wenn eine Nachricht gereicht hätte.",

  /* ── open space ───────────────────────────────────────────────────── */
  "item.open-letter": "Ein Brief an dich mit siebzig. Was soll dann wahr sein?",
  "item.open-five": "Was ist das eine, wofür die nächsten fünf Jahre gut sein sollen?",
  "item.open-said": "Was sollen die Menschen sagen, die dich am besten kannten?",
  "item.open-avoid": "Wovor drückst du dich?",

  /* ── the instruction sheet ─────────────────────────────────────
     Six headings, on the four channels the spec declares. Not the six
     sections: those are the order the questions are asked in, and a card is
     what somebody reads off a printed sheet weeks later. Every body under
     these is the reader's own chosen words and nothing composed for them, and
     the four open questions produce no card at all — the sheet is the thing
     you hand over, and „Wovor drückst du dich?“ is not. */
  "card.work": "Wofür die Arbeit da ist",
  "card.money": "Geld, und wo ich aufhöre",
  "card.health": "Worauf ich verzichte, um gesund zu bleiben",
  "card.less": "Wovon ich weniger will",
  "card.place": "Wo ich sein will und für wen ich bliebe",
  "card.keep": "Was ich behielte, schulde und bereute",

  /* ── the result page ───────────────────────────────────────────
     Two weight lists and the sentence over them, then the one paragraph this
     instrument owes that no other does: what was not done with the four
     answers nobody else will ever see. The headings are statements about the
     reader's own numbers and never a verdict on the life behind them. */
  "view.weightTitle": "Wohin das Gewicht gefallen ist",
  "view.weightNote": "Die beiden Enden der Zahlen, die du vergeben hast. Was du zwischen vier und sieben gelegt hast, fehlt nicht — es steht oben, in der Reihenfolge, in der gefragt wurde.",
  "view.heaviestTitle": "Was du am schwersten gewichtet hast",
  "view.heaviestNote": "Acht oder mehr von zehn. Hier kostet es am meisten, sich in dir zu irren.",
  "view.lightestTitle": "Was du am leichtesten gewichtet hast",
  "view.lightestNote": "Drei oder weniger von zehn. Hier ist Spielraum, und das ist nicht dasselbe wie Gleichgültigkeit.",
  "view.openNote": "Diese vier gehören dir. Nichts davon wurde ausgewertet, nichts gegen die Antworten anderer gestellt, und nichts davon geht in einen Link — es steht auf dieser Seite, weil du es geschrieben hast.",
};
