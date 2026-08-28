/**
 * boundaries — Deutsch.
 *
 * Zwölf erklärte Haltungen, kein Wert. Die Fragen sind auf Deutsch geschrieben
 * und nicht übersetzt: Wo das Englische eine Wendung hat, die im Deutschen
 * niemand sagt, steht hier die Wendung, die man sagt — jemand steht
 * unangekündigt vor der Tür, jemand sagt für dich zu, und ein Streit wird
 * weitererzählt. Die Bedeutung ist dieselbe; das ist die Bedingung, unter der
 * ein Item dasselbe Item bleibt.
 *
 * Deutsch läuft rund 30% länger als Englisch, und die 80-Zeichen-Grenze wird an
 * dieser Datei gemessen. Darum steht hier «Wie viel Verspätung geht, bevor du
 * eine Nachricht erwartest?» und nicht die Nominalisierung, zu der das Deutsche
 * neigt. Die Anrede ist durchgehend du, wie in der Shell und in den übrigen
 * Instrumenten.
 *
 * Zwei Wörter sind mit Absicht gewählt und sollten so bleiben. «Das entscheide
 * nicht ich» ist die Antwort für jemanden, für den die Sache keine Abmachung
 * ist — sie muss für jeden, der über die Schulter sieht, harmlos klingen und
 * darf nirgends als Vorliebe zurückkommen. Und «Kam noch nie vor» ist ein
 * ehrlicher Ausgang und kein Nein; keine Playbook-Zeile darf daraus eine
 * Haltung machen.
 *
 * Item-Bank © der Autor, alle Rechte vorbehalten. Siehe LICENSE.
 */
export default {
  "title": "Grenzen",
  "tagline": "Zwölf Dinge über deine Tür, deinen Schlaf und dein Geld — jedes mit dem Gewicht, das du ihm gibst.",
  "framework": "Zwölf erklärte Haltungen — nichts wird ausgewertet, niemand beurteilt",
  "sourceNote": "Hinter diesem Instrument steht kein geprüftes Verfahren, und es könnte auch keines geben: Was du einem Bruder leihen würdest und ab wann dir jemand zu spät kommt, ohne sich zu melden, sind keine psychologischen Konstrukte. Es sind Tatsachen darüber, wie du lebst. Das Wort «Grenze» erreicht diese Seite aus zwei Richtungen — aus der Familiensystemtheorie, wo es beschreibt, wo ein Teil einer Familie aufhört und ein anderer anfängt, und aus einer Ratgeberliteratur, die keine einzige Wirksamkeitsstudie hervorgebracht hat, die zu zitieren sich lohnte —, und es steht hier als gewöhnliches deutsches Wort, ohne dass irgendetwas damit behauptet würde. Nichts wird ausgewertet, in Stufen eingeteilt oder mit irgendjemandem verglichen. Eines sagt man besser deutlich als in einer Fußnote: Alles, was du hier schreibst, ist entweder eine Aussage über dein eigenes Verhalten oder eine Bitte, und eine Bitte darf die andere Person ausschlagen. Diese Regel ist der Grund, warum dich hier keine Frage eine Regel über einen anderen Erwachsenen aufstellen lässt — nicht, wen er sehen darf, nicht, wem er schreiben darf, nicht, wo er ist. Wo eine Antwort eine Abmachung beschreibt, der du nie zugestimmt hast, hält diese Seite genau das fest und nennt es nicht deine Vorliebe. Und nichts auf dieser Seite liest deine Antworten auf Anzeichen von irgendetwas ab.",

  /* ── die Abschnitte ───────────────────────────────────────────────── */
  "section.home.title": "Die Tür und der Abend",
  "section.home.note": "Drei Dinge, die entscheidet, wer sich zuerst bewegt: wer kommt, wer hereingeht und wie lange du wartest.",
  "section.people.title": "Wer sonst noch dazugehört",
  "section.people.note": "Ex-Partner, Freunde, Familie und was von alldem jemand erfährt.",
  "section.body.title": "Dein Körper und dein Schlaf",
  "section.body.note": "Zwei Dinge, die sich jetzt leichter sagen lassen als im Moment selbst.",
  "section.yours.title": "Was du zu vergeben hast",
  "section.yours.note": "Deine Sachen, dein Geld, deine Zeit — was davon ohne ein Gespräch vorher aus dem Haus geht.",

  /* ── die Fragen ───────────────────────────────────────────────────── */
  "stance.unannounced-visit.prompt": "Wer darf unangekündigt bei dir vor der Tür stehen?",
  "stance.closed-door.prompt": "Was bedeutet bei dir zu Hause eine geschlossene Tür?",
  "stance.lateness.prompt": "Wie viel Verspätung geht, bevor du eine Nachricht erwartest?",
  "stance.partner-ex-friend.prompt": "Dein Partner bleibt mit einem Ex befreundet. Was brauchst du?",
  "stance.own-ex-contact.prompt": "Ein Ex schreibt dir. Was machst du?",
  "stance.friend-rude.prompt": "Ein Freund redet gemein über jemanden, den du liebst. Was machst du?",
  "stance.told-outside.prompt": "Wer darf von einem Streit zu Hause erfahren?",
  "stance.public-touch.prompt": "Welche Berührung in der Öffentlichkeit ist für dich in Ordnung?",
  "stance.woken.prompt": "Was ist Grund genug, dich zu wecken?",
  "stance.things-read.prompt": "Wer darf ungefragt deine Sachen durchsehen?",
  "stance.money-family.prompt": "Wie viel kannst du deiner Familie leihen, ohne vorher darüber zu reden?",
  "stance.volunteered.prompt": "Jemand sagt für dich zu. Was machst du?",

  /* ── was geantwortet werden darf ──────────────────────────────────── */
  /* unannounced-visit */
  "stance.unannounced-visit.opt.nobody": "Niemand — vorher eine Nachricht",
  "stance.unannounced-visit.opt.parent": "Ein Elternteil darf das",
  "stance.unannounced-visit.opt.family": "Enge Familie darf das",
  "stance.unannounced-visit.opt.anyone": "Alle, die mir nah sind",
  "stance.unannounced-visit.opt.notMine": "Das entscheide nicht ich",
  "stance.unannounced-visit.opt.never": "Kam noch nie vor",
  /* closed-door */
  "stance.closed-door.opt.nobody": "Dann kommt niemand herein",
  "stance.closed-door.opt.knockWait": "Anklopfen und auf Antwort warten",
  "stance.closed-door.opt.knockIn": "Anklopfen und gleich hereinkommen",
  "stance.closed-door.opt.openHouse": "Türen sind bei uns nie zu",
  "stance.closed-door.opt.never": "Kam noch nie vor",
  /* lateness */
  "stance.lateness.opt.always": "Jede Verspätung",
  "stance.lateness.opt.ten": "Etwa zehn Minuten",
  "stance.lateness.opt.thirty": "Etwa eine halbe Stunde",
  "stance.lateness.opt.hour": "Eine Stunde oder mehr",
  "stance.lateness.opt.never": "Ich brauche nie eine Nachricht",
  /* partner-ex-friend */
  "stance.partner-ex-friend.opt.nothing": "Nichts — das ist nicht meine Sache",
  "stance.partner-ex-friend.opt.toKnow": "Nur zu wissen, dass es das gibt",
  "stance.partner-ex-friend.opt.told": "Bescheid, bevor sie sich treffen",
  "stance.partner-ex-friend.opt.met": "Ihn selbst kennengelernt zu haben",
  "stance.partner-ex-friend.opt.hard": "Ich tue mich so oder so schwer damit",
  "stance.partner-ex-friend.opt.unknown": "Ich weiß es noch nicht",
  /* own-ex-contact */
  "stance.own-ex-contact.opt.sayFirst": "Zu Hause sagen, bevor ich antworte",
  "stance.own-ex-contact.opt.replyThenSay": "Antworten und es dann erwähnen",
  "stance.own-ex-contact.opt.replyQuiet": "Antworten und es für mich behalten",
  "stance.own-ex-contact.opt.noReply": "Ich antworte nicht",
  "stance.own-ex-contact.opt.blocked": "Ich bin gar nicht erst erreichbar",
  "stance.own-ex-contact.opt.never": "Ist noch nicht vorgekommen",
  /* friend-rude */
  "stance.friend-rude.opt.thereAndThen": "Sofort etwas sagen, dort im Raum",
  "stance.friend-rude.opt.after": "Später etwas dazu sagen",
  "stance.friend-rude.opt.tellThem": "Es der Person sagen, um die es ging",
  "stance.friend-rude.opt.nothing": "Nichts — ich lasse es auf sich beruhen",
  "stance.friend-rude.opt.distance": "Diesen Freund seltener sehen",
  "stance.friend-rude.opt.notHappened": "Ist noch nicht vorgekommen",
  /* told-outside */
  "stance.told-outside.opt.nobody": "Niemand, der nicht dabei war",
  "stance.told-outside.opt.onePerson": "Eine Person, der ich vertraue",
  "stance.told-outside.opt.friends": "Enge Freunde",
  "stance.told-outside.opt.family": "Die Familie auch",
  "stance.told-outside.opt.anyone": "Mir ist gleich, wer",
  "stance.told-outside.opt.undecided": "Ich bin unentschieden",
  /* public-touch */
  "stance.public-touch.opt.none": "Gar nichts",
  "stance.public-touch.opt.hand": "Eine Hand oder ein Arm",
  "stance.public-touch.opt.kiss": "Auch ein kurzer Kuss",
  "stance.public-touch.opt.anything": "Alles, was ich zu Hause auch täte",
  "stance.public-touch.opt.depends": "Kommt darauf an, wer zusieht",
  /* woken */
  "stance.woken.opt.never": "Weck mich für gar nichts",
  "stance.woken.opt.emergency": "Nur im Notfall",
  "stance.woken.opt.today": "Alles, was den heutigen Tag ändert",
  "stance.woken.opt.anything": "Weck mich für alles",
  "stance.woken.opt.depends": "Kommt auf die Uhrzeit an",
  /* things-read */
  "stance.things-read.opt.nobody": "Niemand geht an meine Sachen",
  "stance.things-read.opt.ask": "Jeder, der vorher fragt",
  "stance.things-read.opt.partner": "Die Person, mit der ich zusammenlebe",
  "stance.things-read.opt.notMine": "Das entscheide nicht ich",
  "stance.things-read.opt.never": "Kam noch nie vor",
  /* money-family */
  "stance.money-family.opt.discussFirst": "Nichts, ohne vorher darüber zu reden",
  "stance.money-family.opt.dayPay": "Was ich an einem Tag verdiene",
  "stance.money-family.opt.weekPay": "Was ich in einer Woche verdiene",
  "stance.money-family.opt.monthPay": "Was ich in einem Monat verdiene",
  "stance.money-family.opt.whatever": "Was immer gebraucht wird",
  "stance.money-family.opt.neverLend": "Ich leihe der Familie nichts",
  /* volunteered */
  "stance.volunteered.opt.sayNo": "Ich sage sofort Nein",
  "stance.volunteered.opt.pullOut": "Ich sage es hinterher ab",
  "stance.volunteered.opt.sayLater": "Ich mache es und sage hinterher etwas dazu",
  "stance.volunteered.opt.doIt": "Ich mache es und sage nichts",
  "stance.volunteered.opt.notHappened": "Ist mir noch nicht passiert",

  /* ── das Playbook ─────────────────────────────────────────────────── */
  /* das ist in Ordnung */
  "playbook.ok.door.open": "Komm einfach herein, wenn die Tür offen ist. Du musst nie vorher klingeln.",
  "playbook.ok.door.hour": "Schreib mir eine Stunde, bevor du kommst, und die Antwort ist fast immer ja.",
  "playbook.ok.doorclosed.knock": "Klopf an, wenn meine Tür zu ist, und komm dann gleich herein. Ich verstecke mich nicht vor dir.",
  "playbook.ok.late.relax": "Entschuldige dich nicht für zehn Minuten Verspätung. Ich hatte sie wirklich nicht bemerkt.",
  "playbook.ok.late.line": "Bei weniger als einer halben Stunde brauchst du nicht zu schreiben. Ich bestelle schon mal für uns.",
  "playbook.ok.ex.theirs": "Triff deinen Ex, so oft du magst. Ich brauche hinterher keinen Bericht darüber.",
  "playbook.ok.myex.reply": "Wenn mein Ex mir schreibt, antworte ich. Das ist kein Geheimnis und der Anfang von gar nichts.",
  "playbook.ok.myex.ask": "Frag mich geradeheraus, ob ich von meinem Ex gehört habe. Du bekommst jedes Mal eine klare Antwort.",
  "playbook.ok.friend.push": "Widersprich mir vor allen anderen, wenn ich etwas Unfaires sage. Mir ist lieber, es steht im Raum.",
  "playbook.ok.told.talk": "Erzähl jemandem, dem du vertraust, wenn wir gestritten haben. Das ist mir lieber, als dass du darauf sitzen bleibst.",
  "playbook.ok.touch.street": "Nimm meine Hand auf der Straße. Küss mich am Bahnhof. Nichts davon ist mir peinlich.",
  "playbook.ok.wake.me": "Weck mich, wenn du mich brauchst. Lieber verliere ich eine Stunde Schlaf, als es beim Frühstück zu erfahren.",
  "playbook.ok.things.open": "Du darfst in meinen Sachen nachsehen. Ich räume vorher nichts weg.",
  "playbook.ok.money.lend": "Wenn deine Familie Geld braucht, leih es ihr. Sag es mir hinterher, statt mich vorher zu fragen.",
  /* das ist es nicht */
  "playbook.no.door.message": "Steh nicht unangekündigt vor meiner Tür. Einen Schlüssel zu haben ist keine Einladung.",
  "playbook.no.doorclosed.open": "Mach meine Tür nicht ohne Anklopfen auf. Warte auf meine Antwort, bevor du hereinkommst.",
  "playbook.no.late.silence": "Lass mich nicht dort stehen. Wenn du mehr als zehn Minuten brauchst, schick mir eine Zeile.",
  "playbook.no.ex.afterwards": "Verabrede dich nicht mit deinem Ex und sag es mir hinterher. Sag es mir vorher.",
  "playbook.no.ex.pretend": "Verlang nicht von mir, das locker zu sehen. Tue ich nicht, und so zu tun wäre schlimmer.",
  "playbook.no.myex.number": "Gib meinem Ex nicht meine Nummer, welchen Grund er dir dafür auch nennt.",
  "playbook.no.friend.jokes": "Mach vor anderen keine Witze über die Menschen, die ich liebe. Auch nicht die guten.",
  "playbook.no.told.story": "Erzähl deiner Familie nicht weiter, was ich im Streit gesagt habe. Auch nicht als lustige Geschichte beim Essen.",
  "playbook.no.touch.colleagues": "Küss mich nicht vor deinen Kollegen. Eine Hand auf meinem Rücken ist in Ordnung.",
  "playbook.no.touch.any": "Greif in der Öffentlichkeit nicht nach mir. Das liegt nicht an dir und es wird sich nicht ändern.",
  "playbook.no.wake.morning": "Weck mich nicht für etwas, das morgen früh noch genauso stimmt.",
  "playbook.no.things.out": "Geh nicht an meine Sachen, während ich weg bin. Frag mich, dann zeige ich es dir selbst.",
  "playbook.no.money.promise": "Sag deiner Familie kein Geld zu, bevor du mir die Summe laut genannt hast.",
  "playbook.no-lend-then-tell": "Leih niemandem aus deiner Familie Geld und erzähl es mir erst hinterher.",
  "playbook.no.volunteer.yes": "Sag nicht für mich zu. Sag, dass du mich erst fragst — meistens sage ich ohnehin ja.",

  /* ── der Anleitungsbogen ───────────────────────────────────────
     Fünf Überschriften auf den vier Kanälen, die die Spezifikation nennt.
     Nicht die vier Abschnitte: die sind die Reihenfolge, in der gefragt wird,
     und eine Karte ist das, was jemand im Hineingehen kurz nachsieht. Was
     unter diesen Überschriften steht, sind die selbst gewählten Antworten des
     Lesers und kein Satz, der für ihn verfasst wurde. */
  "card.arriving": "Bevor du hereinkommst",
  "card.committing": "Wozu ich verpflichtet werden kann",
  "card.clock": "Verspätung, und geweckt werden",
  "card.touch": "Berührung in der Öffentlichkeit",
  "card.repeating": "Ex-Partner, und was weitererzählt wird",

  /* ── die Ergebnisseite ─────────────────────────────────────────
     Zwei Listen und der Satz darüber. Die Überschriften sind Aussagen über
     die eigenen Zahlen des Lesers — nie darüber, was er «gefordert» oder
     «entschieden» habe, denn zwei der zwölf lassen sich mit «Das entscheide
     nicht ich» beantworten, und die Quellennotiz verspricht, dass genau das
     festgehalten wird. */
  "view.weightTitle": "Wo das Gewicht liegt",
  "view.weightNote": "Die Gewichte, die du vergeben hast, von den beiden Enden her zurückgelesen. Was du zwischen vier und sieben gelegt hast, fehlt nicht — es steht oben, in der Reihenfolge, in der gefragt wurde.",
  "view.heaviestTitle": "Was du am schwersten gewichtet hast",
  "view.heaviestNote": "Acht oder mehr von zehn. Hier kostet es am meisten, wenn jemand falsch rät.",
  "view.lightestTitle": "Was du am leichtesten gewichtet hast",
  "view.lightestNote": "Drei oder weniger von zehn. Hier ist Spielraum, was nicht dasselbe ist, wie dass es dir egal wäre.",
};
