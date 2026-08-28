/**
 * before-marriage — German.
 *
 * Key for key with `en.ts`, which is the source of truth; only the values are
 * written, and they are written in German rather than carried across from the
 * English. §8 of the stated-positions design asks for four originals, so these
 * fifteen are the questions two people ask each other in German before a
 * wedding. `place-type` is the clearest case: a German map is divided into
 * Großstadt, Kleinstadt and Dorf, and those three are what the block offers —
 * not a rendering of «a big city, a town, a village», which would have made the
 * middle option mean nothing in particular. `parents-distance` counts in
 * Fahrtzeit for the same reason.
 *
 * The eighty-character gate in `test/i18n/readability.test.ts` is measured on
 * these strings and never on the English behind them. German runs about a third
 * longer and compounds where English takes a phrase, so every prompt is built
 * on a short verb form instead of a nominalisation: „Wenn zwei Berufswege
 * kollidieren, wer geht vor?“ and not „Wie ist die Rangfolge zweier beruflicher
 * Werdegänge geregelt?“. The forbidden joiners for `de` are „, aber “ and „; “,
 * and no prompt here wants either — every question that asked for one was
 * asking two things.
 *
 * `du` throughout, as everywhere in this app. These are somebody's own evenings
 * and their own parents; `Sie` would turn fifteen questions into a Beratung.
 *
 * ── Nobody has to pick a gender ───────────────────────────────────────
 *
 * Where the other person has to be named, it is `Ehepartner`, the generic
 * German role word, exactly as `family-plan` uses `Elternteil`. Where the
 * English names a friend and then says «him», the German holds the friendship
 * instead of the friend — `ok-friend-stays` is „Meine älteste Freundschaft
 * bleibt“ and `ok-one-friend-knows` says „jemand aus meinem Freundeskreis“ —
 * so the sheet stays true for a reader whose oldest friend is a woman.
 *
 * `career-lead` asks „wer geht vor?“ rather than «whose career», because the
 * German answer set then reads „Ich“, „Mein Ehepartner“, „Wer gerade mehr
 * verdient“, where the literal genitive would have produced „Der von der
 * Person, die …“ five times over. Same question, German grammar.
 *
 * ── Words that have to match the other tables ─────────────────────────
 *
 * „Ich habe das nicht zu Ende gedacht“ is `faith`'s and is used here for the
 * same English, and „Ich weiß es nicht“ is `family-plan`'s. The instrument
 * names in the `sourceNote` are the German titles a reader will actually see
 * in the catalogue — „Gespräche“, „Umgang mit Geld“, „Familienplanung“,
 * „Glaube“, „Konfliktstil“ — and this instrument is „Vor der Ehe“, which is
 * what `family-plan`'s own note already calls it.
 *
 * The not-OK lines are negative imperatives — „Buch keine Woche weg ohne
 * mich …“ — as in `boundaries` and `money-management`. An infinitive list reads
 * like a notice on a wall, and these are sentences one person hands to another.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Vor der Ehe",
  "tagline": "Fünfzehn Positionen zu den Jahren nach der Hochzeit, jede mit dem Gewicht, das du ihr gibst.",
  "framework": "Fünfzehn erklärte Positionen — die Überschriften der Gottmans, keine ihrer Fragen",
  "sourceNote": "Die fünf Überschriften dahinter sind die der Gottmans, und die Überschriften sind der öffentliche Teil — Geld, Lebenspläne, Kommunikation und Streit, Grundwerte sowie Erwartungen und Verbindlichkeit stehen in einem Blogbeitrag, den jeder lesen kann. Sonst ist nichts von ihnen hier. Die Fragebögen und Kartensets der Gottmans sind urheberrechtlich geschützt, werden verkauft und unter Lizenz vertrieben, und keines davon wurde wiedergegeben, umschrieben oder nachgebaut; jede Frage oben wurde für diese App geschrieben. Drei der fünf Überschriften fehlen ebenfalls mit Absicht. Geld wird im „Umgang mit Geld“ richtig gefragt, Kinder und alles, was daran hängt, in der „Familienplanung“, der Glaube im „Glauben“ und die Art zu streiten im „Konfliktstil“ — das hier noch einmal zu stellen hätte fünfzehn Fragen ergeben, von denen diese App die meisten anderswo besser beantwortet. Übrig bleibt der Teil, den sonst nichts im Katalog abdeckt: was ihr beide unter dem Wort verheiratet versteht, wie viel deiner Woche dir gehört und wo zwei Berufswege euch leben lassen. Eines fehlt, das du erwarten könntest. Hier wird nicht gefragt, ob Gewalt eine Ehe beenden würde. Das zu fragen hieße, dich dein eigenes Verhalten in einer Krise vorhersagen zu lassen, die du nie hattest — das eine, was diese Instrumente niemals tun —, und es würde eine Antwort auf ein Blatt drucken, das später gegen den verwendet werden kann, der sie geschrieben hat. Wenn diese Frage bei dir wirklich ansteht, ist sie keine Frage für eine Webseite. Wenn du noch keines davon gemacht hast, nimm zuerst „Gespräche“. Dort wird festgehalten, welche dieser Themen ihr zwei nie wirklich angesprochen habt, was billiger und nützlicher herauszufinden ist und ändert, was du mit dieser Seite anfängst. Dann dieses hier, dann „Umgang mit Geld“ und „Familienplanung“, die in die beiden Themen hineingehen, die hier absichtlich weggeschnitten sind. Und zu der Frage, ob irgendetwas davon wirkt: Die beiden größten randomisierten Studien zur Paarbildung, Building Strong Families und Supporting Healthy Marriage, fanden keinen Effekt darauf, ob Paare zusammenblieben, und die am saubersten durchgeführte Metaanalyse zur vorehelichen Bildung findet, dass der Effekt auf die Beziehungsqualität nicht standhält, sobald die unveröffentlichten Studien mitgezählt werden. Dieses Instrument ist nie geprüft worden und behauptet nichts. Es hält fest, was du gesagt hast, wie viel es dir wiegt und warum.",

  /* ── the sections ─────────────────────────────────────────────────── */
  "section.commitment.title": "Verbindlichkeit und Erwartungen",
  "section.commitment.note": "Gottmans fünfte Überschrift beim Wort genommen. Als was die Ehe eingegangen wird, was sie beenden würde und was passiert, wenn keiner von euch nachgibt. Nichts hier betrifft, wie ihr streitet — das gehört dem Konfliktstil und der Bindung. Und nichts hier fragt nach Gewalt; warum nicht, steht in der Quellennotiz in klaren Worten.",
  "section.time.title": "Zeit zu zweit und Zeit für sich",
  "section.time.note": "Ebenfalls die fünfte Überschrift. Zusammensein gegen Zeit für sich, gefragt in Zahlen und Zeiträumen statt in Gefühlen, weil die Zahl der Teil ist, auf den ein Mensch die Antwort wirklich kennt. Die Abende, die du beanspruchst, und die, die du frei lässt, sind eine einzige Rechnung, also stehen sie auf einer Seite.",
  "section.independence.title": "Freundschaften und Eigenständigkeit",
  "section.independence.note": "Der Rest der fünften Überschrift: wer schon in deinem Kreis ist, was aus der Freundschaft wird, die du längst hast, und was nicht zusammengelegt wird. Jede Frage hier ist eine Aussage über dein eigenes Leben und nie eine Regel für das Leben eines anderen — die Regeln für die andere Person stehen in den Grenzen.",
  "section.careers.title": "Beruf und Umzug",
  "section.careers.note": "Aus der zweiten Überschrift, den Lebensplänen, und nur aus deren Teil zum Beruf. Die Kinder sind in der Familienplanung gelandet, der Glaube im Glauben und das Geld im Umgang mit Geld, also wird hier nichts davon ein zweites Mal gefragt.",
  "section.settling.title": "Wo du dich niederlässt",
  "section.settling.note": "Ebenfalls Lebenspläne: das Sesshaftwerden. In was für einem Ort du dich siehst, wie weit weg von deinen eigenen Eltern und wer sonst noch unter dem Dach landet. Nichts sonst in dieser App fragt irgendetwas davon.",

  /* ── the questions ────────────────────────────────────────────────── */
  "stance.marriage-means.prompt": "Was bringt die Ehe, was das Zusammenleben nicht bringt?",
  "stance.grounds-to-end.prompt": "Was davon würde für dich die Ehe beenden?",
  "stance.final-say.prompt": "Wer hat das letzte Wort, wenn eine große Entscheidung feststeckt?",
  "stance.evenings-together.prompt": "Wie viele Abende pro Woche willst du zu zweit verbringen?",
  "stance.alone-time.prompt": "Wie viel Zeit allein brauchst du in einer gewöhnlichen Woche?",
  "stance.holiday-apart.prompt": "Würdest du ohne deinen Ehepartner Urlaub machen?",
  "stance.who-knows.prompt": "Wer hat die ehrliche Fassung deines schlimmsten Monats gehört?",
  "stance.closest-friend.prompt": "Was wird aus deiner engsten Freundschaft, wenn du heiratest?",
  "stance.kept-to-myself.prompt": "Was davon bliebe nach der Hochzeit allein deins?",
  "stance.career-lead.prompt": "Wenn zwei Berufswege kollidieren, wer geht vor?",
  "stance.relocation.prompt": "Würdest du für die Arbeit deines Ehepartners ins Ausland ziehen?",
  "stance.nights-away.prompt": "Wie viele Nächte im Monat würdest du für die Arbeit wegbleiben?",
  "stance.place-type.prompt": "In was für einem Ort siehst du dich leben?",
  "stance.parents-distance.prompt": "Wie weit weg von deinen Eltern willst du wohnen?",
  "stance.household-who.prompt": "Wer könnte am Ende noch bei euch wohnen?",

  /* ── what may be answered ─────────────────────────────────────────── */
  /* marriage-means */
  "stance.marriage-means.opt.permanence": "Damit ist Weggehen keine Möglichkeit mehr",
  "stance.marriage-means.opt.vow": "Es ist ein Gelübde vor Gott",
  "stance.marriage-means.opt.witnessed": "Es wird vor Zeugen gesagt",
  "stance.marriage-means.opt.legal": "Es ändert die Rechtslage",
  "stance.marriage-means.opt.nothing": "Nichts, was wir nicht schon hätten",
  "stance.marriage-means.opt.unsure": "Ich habe das nicht zu Ende gedacht",
  /* grounds-to-end */
  "stance.grounds-to-end.opt.affair": "Eine körperliche Affäre",
  "stance.grounds-to-end.opt.emotional": "Eine Affäre ohne Sex",
  "stance.grounds-to-end.opt.money-lies": "Große Schulden, vor mir verschwiegen",
  "stance.grounds-to-end.opt.addiction": "Eine Sucht, die unbehandelt bleibt",
  "stance.grounds-to-end.opt.drift": "Jahre, in denen keiner von uns sich bemüht",
  "stance.grounds-to-end.opt.none": "Nichts davon",
  /* final-say */
  "stance.final-say.opt.stall": "Niemand. Es geht erst weiter, wenn wir einig sind",
  "stance.final-say.opt.domain": "Wer für den Bereich zuständig ist",
  "stance.final-say.opt.cares-more": "Wem es mehr bedeutet",
  "stance.final-say.opt.husband": "Der Ehemann",
  "stance.final-say.opt.outsider": "Jemand, dem wir beide vertrauen",
  "stance.final-say.opt.unsure": "Ich habe das nicht zu Ende gedacht",
  /* evenings-together */
  "stance.evenings-together.opt.nearly-all": "Fast jeden Abend",
  "stance.evenings-together.opt.most": "Vier oder fünf",
  "stance.evenings-together.opt.some": "Zwei oder drei",
  "stance.evenings-together.opt.few": "Einen, wenn überhaupt",
  "stance.evenings-together.opt.never-counted": "Ich habe nie über eine Zahl nachgedacht",
  /* alone-time */
  "stance.alone-time.opt.snatched": "Eine Stunde hier und da",
  "stance.alone-time.opt.evening": "Einen Abend für mich",
  "stance.alone-time.opt.day": "Fast einen ganzen Tag",
  "stance.alone-time.opt.more": "Mehr als einen Tag",
  "stance.alone-time.opt.none": "Ich brauche keine Zeit allein",
  /* holiday-apart */
  "stance.holiday-apart.opt.yearly": "Ja, in den meisten Jahren",
  "stance.holiday-apart.opt.sometimes": "Ja, ab und zu",
  "stance.holiday-apart.opt.reason": "Nur wenn es einen Grund dafür gäbe",
  "stance.holiday-apart.opt.no": "Nein",
  "stance.holiday-apart.opt.unsure": "Ich weiß es nicht",
  /* who-knows */
  "stance.who-knows.opt.nobody": "Niemand",
  "stance.who-knows.opt.friend": "Ein enger Freund",
  "stance.who-knows.opt.parent": "Meine Mutter oder mein Vater",
  "stance.who-knows.opt.sibling": "Ein Bruder oder eine Schwester",
  "stance.who-knows.opt.clergy": "Ein Priester oder ein Pfarrer",
  "stance.who-knows.opt.counsellor": "Eine Beraterin oder ein Berater",
  /* closest-friend */
  "stance.closest-friend.opt.unchanged": "Sie bleibt genau, wie sie ist",
  "stance.closest-friend.opt.less-often": "Sie bleibt, wir sehen uns seltener",
  "stance.closest-friend.opt.becomes-ours": "Sie wird eine Freundschaft von uns beiden",
  "stance.closest-friend.opt.fades": "Sie schläft ein, und das ist in Ordnung",
  "stance.closest-friend.opt.unsure": "Ich habe darüber nicht nachgedacht",
  /* kept-to-myself */
  "stance.kept-to-myself.opt.space": "Ein eigenes Zimmer oder ein eigener Schreibtisch",
  "stance.kept-to-myself.opt.evening": "Ein Abend in der Woche",
  "stance.kept-to-myself.opt.friend": "Eine Freundschaft, die meine bleibt",
  "stance.kept-to-myself.opt.hobby": "Eine Sache, bei der niemand mitmacht",
  "stance.kept-to-myself.opt.quiet": "Stunden, in denen mich niemand anspricht",
  "stance.kept-to-myself.opt.nothing": "Gar nichts",
  /* career-lead */
  "stance.career-lead.opt.mine": "Ich",
  "stance.career-lead.opt.spouse": "Mein Ehepartner",
  "stance.career-lead.opt.earner": "Wer gerade mehr verdient",
  "stance.career-lead.opt.loses-more": "Wer durch Nachgeben mehr verlieren würde",
  "stance.career-lead.opt.alternate": "Das soll sich über die Jahre abwechseln",
  "stance.career-lead.opt.unsure": "Ich habe das nicht zu Ende gedacht",
  /* relocation */
  "stance.relocation.opt.yes": "Ja",
  "stance.relocation.opt.fixed-term": "Ja, wenn wir ein Enddatum vereinbaren",
  "stance.relocation.opt.near-only": "Nur dorthin, von wo ich leicht nach Hause komme",
  "stance.relocation.opt.no": "Nein",
  "stance.relocation.opt.unsure": "Ich weiß es nicht",
  /* nights-away */
  "stance.nights-away.opt.none": "Keine",
  "stance.nights-away.opt.up-to-three": "Bis zu drei",
  "stance.nights-away.opt.up-to-week": "Bis zu einer Woche",
  "stance.nights-away.opt.more": "Mehr als eine Woche",
  "stance.nights-away.opt.unsure": "Ich weiß es nicht",
  /* place-type */
  "stance.place-type.opt.city": "Eine Großstadt",
  "stance.place-type.opt.town": "Eine Kleinstadt",
  "stance.place-type.opt.country": "Ein Dorf oder ganz auf dem Land",
  "stance.place-type.opt.indifferent": "Das macht für mich keinen Unterschied",
  "stance.place-type.opt.no-idea": "Ich habe keine Ahnung",
  /* parents-distance */
  "stance.parents-distance.opt.same-town": "Am selben Ort",
  "stance.parents-distance.opt.hour": "Höchstens eine Stunde Fahrt",
  "stance.parents-distance.opt.hours": "Ein paar Stunden entfernt",
  "stance.parents-distance.opt.flight": "So weit, dass man fliegen muss",
  "stance.parents-distance.opt.no-preference": "Das macht für mich keinen Unterschied",
  "stance.parents-distance.opt.na": "Das trifft auf mich nicht zu",
  /* household-who */
  "stance.household-who.opt.my-parent": "Ein Elternteil von mir",
  "stance.household-who.opt.their-parent": "Ein Elternteil meines Ehepartners",
  "stance.household-who.opt.sibling": "Ein Bruder oder eine Schwester",
  "stance.household-who.opt.friend": "Jemand aus dem Freundeskreis, der etwas durchmacht",
  "stance.household-who.opt.lodger": "Ein Untermieter, der Miete zahlt",
  "stance.household-who.opt.nobody": "Niemand außer uns",

  /* ── the playbook ─────────────────────────────────────────────────── */
  /* this is fine */
  "playbook.ok-first-hour": "Lass mich die erste Stunde nach dem Heimkommen in Ruhe. Ich schmolle nicht, und es liegt nicht an dir.",
  "playbook.ok-book-tuesday": "Plan dir an einem Dienstag etwas ein, ohne vorher bei mir nachzufragen.",
  "playbook.ok-week-away": "Fahr eine Woche ohne mich weg. Ich lege nichts hinein, und ich brauche dazu keine Beruhigung.",
  "playbook.ok-one-friend-knows": "Geh davon aus, dass jemand aus meinem Freundeskreis die ehrliche Fassung einer schlechten Woche gehört hat. Ich brauche jemanden außerhalb davon.",
  "playbook.ok-friend-stays": "Meine älteste Freundschaft bleibt. Du musst die Person nicht mögen, und ich gebe sie nicht auf.",
  "playbook.ok-my-desk": "Ein Schreibtisch in dieser Wohnung gehört mir. Räum ihn nicht auf und leg nichts von dir darauf.",
  "playbook.ok-quiet-hours": "Lass die erste Stunde am Morgen still sein. Das ist keine Laune, und es liegt nicht an dir.",
  "playbook.ok-abroad-with-date": "Komm mit der Stelle im Ausland zu mir, wenn ein Enddatum daran hängt. Befristet ist von mir ein Ja.",
  "playbook.ok-send-the-listing": "Schick mir die Stellenanzeige aus dem anderen Land. Das ist keine Schwärmerei. Ich meine es so.",
  "playbook.ok-take-the-trip": "Sag Ja zu der Reise. Eine Woche weg ist in meinem Beruf normal, und ich wähle damit nicht die Arbeit vor dir.",
  "playbook.ok-your-turn": "Nimm diesmal die Beförderung. Die nächste ist meine. Ich will, dass das jetzt laut gesagt ist.",
  "playbook.ok-sunday-lunch": "Sag an den meisten Wochenenden Ja zum Sonntag bei meinen Eltern. Ihre Nähe will ich wirklich.",
  "playbook.ok-ask-about-parent": "Frag mich richtig, ob ein Elternteil von mir hier wohnen könnte, bevor du es ausschließt.",
  "playbook.ok-bring-someone-in": "Hol jemanden dazu, dem wir beide vertrauen, wenn wir feststecken. Das geht nicht über meinen Kopf hinweg, und ich werde es auch nicht so nehmen.",
  /* this is not */
  "playbook.no-card-then-tell": "Setz keine große Summe auf die Kreditkarte und sag es mir erst hinterher. Davon erhole ich mich am langsamsten.",
  "playbook.no-follow-me": "Folg mir nicht ins andere Zimmer, um das Gespräch zu Ende zu bringen. Warte, bis ich zurückkomme.",
  "playbook.no-fill-my-week": "Verplan nicht vier Abende in der Woche, ohne mich zu fragen. Die meisten Abende müssen uns gehören.",
  "playbook.no-week-away": "Buch keine Woche weg ohne mich. Ich nähme das schwer, und ich sage dir das lieber jetzt, als so zu tun, als wäre es anders.",
  "playbook.no-tell-your-mother": "Erzähl deiner Mutter nichts von unseren Streitereien. Was zwischen uns passiert, verlässt das Haus nicht.",
  "playbook.no-secret-friendship": "Führ keine Freundschaft, von der ich nichts wissen darf. Das Problem ist die Heimlichkeit und nicht die Person.",
  "playbook.no-decide-then-inform": "Entscheide nichts Großes, um es mir dann mitzuteilen. Es geht erst weiter, wenn wir uns wirklich einig sind.",
  "playbook.no-divorce-word": "Nimm im Streit nicht das Wort Scheidung in den Mund. Kein einziges Mal, nicht als Drohung, nicht um etwas zu beweisen.",
  "playbook.no-move-for-your-job": "Sag keinem Umzug in meinem Namen zu. Wo wir leben, richtet sich nach meiner Arbeit, und das musst du gehört haben, bevor wir heiraten.",
  "playbook.no-apply-abroad": "Bewirb dich nicht im Ausland und frag mich dann. Ich ziehe nicht ins Ausland.",
  "playbook.no-overnight-work": "Meld mich für nichts freiwillig, wofür ich über Nacht wegbleiben muss. Nicht einmal im Monat, nicht einmal im Quartal.",
  "playbook.no-move-us-to-a-field": "Setz uns nicht dorthin, wo ich fürs Brot ein Auto brauche. Ich weiß, wie das für mich ausgeht.",
  "playbook.no-near-parents": "Setz uns nicht an denselben Ort wie eines der beiden Elternpaare. Ich will eine Fahrt zwischen uns und ihnen.",
  "playbook.no-spare-room": "Biete unser Gästezimmer niemandem an, bevor du mich gefragt hast. Nicht deinem Bruder und nicht für zwei Wochen.",

  /* ── the instruction sheet ─────────────────────────────────────
     Six headings, on the four channels the spec declares. Not the five
     sections: those are the order the questions are asked in, and a card is
     what somebody reads off a printed sheet. Every body under these is the
     reader's own chosen words and nothing composed for them. */
  "card.word": "Was das Wort hinzufügt",
  "card.mine": "Was meins bleibt",
  "card.roof": "Wo wir wohnen und wer sonst noch",
  "card.breaking": "Was die Ehe beenden würde und wer entscheidet",
  "card.week": "Abende und Zeit für sich",
  "card.careers": "Zwei Berufswege und das Umziehen",

  /* ── the result page ───────────────────────────────────────────
     Two lists and the sentence over them. The headings are statements about
     the reader's own numbers and nothing else — no readiness, no agreement,
     no verdict on a marriage that has not happened. */
  "view.weightTitle": "Wo das Gewicht gelandet ist",
  "view.weightNote": "Die Gewichte, die du vergeben hast, von den beiden Enden her zurückgelesen. Was du zwischen vier und sieben gesetzt hast, fehlt nicht — es steht oben, in der Reihenfolge, in der gefragt wurde.",
  "view.heaviestTitle": "Was du am schwersten gewichtet hast",
  "view.heaviestNote": "Acht oder mehr von zehn. Das sind die, bei denen es am teuersten ist, es erst hinterher zu erfahren.",
  "view.lightestTitle": "Was du am leichtesten gewichtet hast",
  "view.lightestNote": "Drei oder weniger von zehn. Hier ist Spielraum, was nicht dasselbe ist wie Gleichgültigkeit.",
};
