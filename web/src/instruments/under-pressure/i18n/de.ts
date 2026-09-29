/**
 * Under pressure — German.
 *
 * The four scales use the names of the German hardiness literature —
 * Kontrolle, Engagement, Herausforderung, Selbstvertrauen — so a reader can
 * look them up. The model keeps its own name, „die vier C“, as big-five keeps
 * OCEAN, although no German name starts with C.
 *
 * Two of the four are feminine and two neuter, so no single „Hohe {trait}“
 * agrees with all of them. Titles put the band after the name instead, as
 * hexaco does for its sixth factor: „Engagement: sehr hoch“.
 */
export default {
  "title": "Unter Druck",
  "tagline": "Wie du standhältst, wenn ein Plan platzt, eine Arbeit sich zieht oder jemand dagegenhält.",
  "framework": "Hardiness und das 4C-Modell",
  "sourceNote": "Eigene Fragen zum öffentlichen Konstrukt der Hardiness (Kobasa, 1979) und zu den vier C der mentalen Stärke, die daraus hervorgegangen sind (Clough, Earle und Sewell, 2002), die Hälfte davon umgekehrt gepolt. Keine einzige Frage des MTQ48 wird verwendet. Gemeinfreie IPIP-Skalen für Selbstwirksamkeit, Verletzlichkeit, Durchsetzungsvermögen und Fleiß ließen sich als reine Daten einsetzen, wenn du einen Wortlaut mit veröffentlichter Reliabilität möchtest.",
  "lineage": "Kobasa (1979) beschrieb Hardiness als Engagement, Kontrolle und Herausforderung; Clough, Earle und Sewell (2002) fügten Selbstvertrauen hinzu und kamen so auf die vier C. Unabhängige Studien haben die Aufteilung in vier nicht sauber bestätigt, und die Items des MTQ48 werden nicht verwendet.",

  "trait.control.label": "Kontrolle",
  "trait.control.inline": "Kontrolle",
  "trait.control.high": "Behält die Ereignisse und die eigenen Reaktionen im Griff, wenn etwas schiefgeht. Der Preis: kann ungerührt wirken und übernimmt manchmal das Steuer, ohne dass jemand darum gebeten hat.",
  "trait.control.low": "Erlebt Ereignisse eher, als sie zu lenken, und wartet vor dem Handeln, bis sich der Staub gelegt hat. Der Gewinn: stürmt selten los, bevor die Fakten auf dem Tisch liegen.",
  "trait.control.ask.high": "Wenn etwas schiefgeht, gib mir die Fakten und lass mich handeln. Wenn du lieber erst gemeinsam entscheiden willst, sag es, bevor ich loslege.",
  "trait.control.ask.low": "Wenn etwas schiefgeht, gib mir einen Moment und einen einzigen konkreten nächsten Schritt. Eine Liste mit zehn lähmt mich.",

  "trait.commitment.label": "Engagement",
  "trait.commitment.inline": "Engagement",
  "trait.commitment.high": "Zieht Dinge durch, auch wenn sie längst nichts mehr zurückgeben. Der Preis: bleibt manchmal zu lange bei einem Plan, der nicht mehr funktioniert.",
  "trait.commitment.low": "Lässt los, was sich nicht mehr auszahlt. Der Preis: gibt manchmal etwas auf, das mit einem letzten Anlauf geklappt hätte.",
  "trait.commitment.ask.high": "Wenn ich aufhören soll, sag es klar und deutlich. Ich halte ein Versprechen auch dann noch, wenn es längst keinen Sinn mehr ergibt.",
  "trait.commitment.ask.low": "Erinnere mich auf halber Strecke daran, warum eine lange Aufgabe wichtig ist, nicht nur am Anfang. Kurze Etappenziele halten mich bei der Sache.",

  "trait.challenge.label": "Herausforderung",
  "trait.challenge.inline": "Herausforderung",
  "trait.challenge.high": "Sieht in einem Rückschlag oder einer plötzlichen Änderung etwas, woran sich arbeiten lässt. Der Preis: unterschätzt manchmal, was die Änderung andere kostet.",
  "trait.challenge.low": "Mag Beständigkeit und sieht an einer Änderung zuerst, was sie kaputt machen könnte, und erst dann, was sie richten könnte. Diese Frühwarnung ist etwas wert.",
  "trait.challenge.ask.high": "Bring mir das schwierige Problem. Wenn dich eine Änderung viel kostet, sag es mir, denn von selbst merke ich das womöglich nicht.",
  "trait.challenge.ask.low": "Kündige mir eine Änderung so früh wie möglich an, mit Begründung. Die Überraschung kostet mich mehr als die Änderung selbst.",

  "trait.confidence.label": "Selbstvertrauen",
  "trait.confidence.inline": "Selbstvertrauen",
  "trait.confidence.high": "Vertraut dem eigenen Können und sagt das auch unter Druck. Der Preis: klingt manchmal sicherer, als die Beleglage hergibt.",
  "trait.confidence.low": "Zweifelt an sich, wenn viel auf dem Spiel steht, und verkauft sich eher unter Wert. Der Gewinn: prüft die eigene Arbeit, wo andere es nicht täten.",
  "trait.confidence.ask.high": "Halte mit Belegen dagegen. Ich klinge manchmal sicherer, als ich bin, und lasse mich lieber korrigieren.",
  "trait.confidence.ask.low": "Frag mich direkt, was ich denke, gerade in einer Gruppe. Oft habe ich die Antwort und behalte sie für mich.",

  "view.eyebrow": "Die vier C",
  "view.headlineItem": "{trait}: {band}",
  "view.headlineFlat": "keiner der vier weit von der Mitte",
  "view.bodyFlat": "Alle vier landen nahe der Mitte. Das ist ein echtes Ergebnis: Wie du standhältst, hängt mehr von der Lage ab als von einer festen Gewohnheit, und das macht dich aus einem Profil schwer vorhersagbar.",
  "view.bodyMarked": "Die vier C zeigen in dieselbe Richtung — höher heißt, dass dir das Standhalten in dieser Hinsicht leichter fällt. Leicht standzuhalten heißt nicht, dass Standhalten jedes Mal richtig ist. Jedes Ende kauft etwas und kostet etwas.",
  "view.factValue": "{score} — {band}. {blurb}",
  "view.overallLabel": "Gesamt",
  "view.overallValue": "{score} — {band}. Der Durchschnitt aller vier. Er verdeckt, welcher Wert die anderen nach oben oder unten zieht — lies deshalb erst die vier einzeln und dann diesen.",
  "view.straightlining": "Jede Frage hat dieselbe Antwort bekommen. Die Hälfte davon ist absichtlich umgekehrt formuliert, also erzeugt eine identische Antwort auf alle zweiunddreißig vier mittlere Werte — egal, wer du bist. Eine Wiederholung lohnt sich.",
  "view.researchNote": "Hardiness wird seit 1979 erforscht, und die Aufteilung in vier C ist die Form, in der die meisten Werkzeuge aus der Arbeitswelt sie zeigen. Unabhängige Studien haben nicht bestätigt, dass sich die vier sauber trennen lassen — sie verschwimmen miteinander und mit emotionaler Stabilität. Lies sie als vier Blickwinkel auf eine Frage, nicht als vier gemessene Teile.",

  "instructions.title.high": "{trait}: hoch",
  "instructions.title.low": "{trait}: niedrig",
  "instructions.title.veryHigh": "{trait}: sehr hoch",
  "instructions.title.veryLow": "{trait}: sehr niedrig",
  "instructions.flatTitle": "Kommt auf die Lage an",
  "instructions.flatBody": "Keiner meiner vier Werte liegt weit von der Mitte. Wie ich standhalte, hängt mehr von der Situation ab als von mir — frag mich also, wie es mir mit dieser geht.",

  "item.ct1": "Wenn ein Plan scheitert, finde ich schnell den nächsten Schritt.",
  "item.ct2": "Wenn viel auf dem Spiel steht, habe ich meine Gefühle im Griff.",
  "item.ct3": "Geht etwas schief, konzentriere ich mich auf das, was ich noch ändern kann.",
  "item.ct4": "Unter Druck kann ich weiterhin klar denken.",
  "item.ct5": "Wenn etwas schiefgeht, habe ich das Gefühl, nichts tun zu können.",
  "item.ct6": "Unter Druck verliere ich den Faden bei dem, was ich gerade tue.",
  "item.ct7": "Ich fühle mich von Dingen herumgeschoben, auf die ich keinen Einfluss habe.",
  "item.ct8": "Wenn ich gestresst bin, gewinnen meine Gefühle die Oberhand.",

  "item.cm1": "Ich bringe zu Ende, was ich anfange, auch wenn es nicht mehr spannend ist.",
  "item.cm2": "Mein gegebenes Wort halte ich, auch wenn es mich etwas kostet.",
  "item.cm3": "Ich behalte im Blick, ob ich meine selbst gesetzten Ziele erreiche.",
  "item.cm4": "Eine lange, eintönige Arbeitsphase hält mich nicht auf.",
  "item.cm5": "Ich gebe Pläne auf, wenn sie schwieriger werden als erwartet.",
  "item.cm6": "Ich verliere das Interesse an einem Ziel, sobald der Reiz des Neuen weg ist.",
  "item.cm7": "Wird eine Aufgabe zäh, finde ich Gründe, sie liegen zu lassen.",
  "item.cm8": "Ich lege mich ungern fest, falls ich es dann nicht durchziehen kann.",

  "item.ch1": "Eine plötzliche Planänderung sehe ich als etwas, womit sich arbeiten lässt.",
  "item.ch2": "Ich suche Probleme, an denen ich über mich hinauswachsen muss.",
  "item.ch3": "Ein Rückschlag verrät mir etwas Nützliches für den nächsten Versuch.",
  "item.ch4": "Ich melde mich freiwillig für Dinge, die ich noch nie gemacht habe.",
  "item.ch5": "Ich bleibe lieber bei meiner Routine, als mich etwas Neuem zu stellen.",
  "item.ch6": "Eine unerwartete Änderung bringt mich lange aus dem Tritt.",
  "item.ch7": "Ich meide Situationen, in denen ich vor anderen scheitern könnte.",
  "item.ch8": "Bei etwas Neuem denke ich zuerst daran, was schiefgehen könnte.",

  "item.cf1": "Ich traue mir zu, mit allem fertigzuwerden, was der Tag bringt.",
  "item.cf2": "In Besprechungen sage ich meine Meinung, auch wenn andere widersprechen.",
  "item.cf3": "Bekomme ich eine schwere Aufgabe, glaube ich daran, dass ich sie schaffe.",
  "item.cf4": "Ich kann meinen Standpunkt halten, wenn jemand dagegenhält.",
  "item.cf5": "Steht viel auf dem Spiel, zweifle ich an meinem Können.",
  "item.cf6": "Ich sage lieber nichts, als Gefahr zu laufen, falschzuliegen.",
  "item.cf7": "Kritik lässt mich zweifeln, ob ich überhaupt etwas tauge.",
  "item.cf8": "In einem Streit fällt es mir schwer, für mich einzustehen.",
};
