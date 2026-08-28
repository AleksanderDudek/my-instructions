/**
 * Digitales Leben — Deutsch.
 *
 * Schlüssel für Schlüssel wie `en.ts`, das die Quelle ist; geschrieben werden
 * hier nur die Werte. Die Anrede ist durchgehend du, wie in der Shell und in
 * den übrigen Instrumenten.
 *
 * Deutsch läuft rund 30% länger als Englisch, und die 80-Zeichen-Grenze in
 * `test/i18n/readability.test.ts` wird an dieser Datei gemessen. Darum stehen
 * hier Verben, wo das Deutsche zur Nominalisierung neigt: «Wo sollen Handys
 * bei einem gemeinsamen Essen sein?» und nicht «Frage nach dem Aufbewahrungsort
 * von Mobiltelefonen während gemeinsamer Mahlzeiten».
 *
 * ── Drei Fragen fragen nach dem Verbot, nicht nach der Erlaubnis ──────
 *
 * `posted-about-me`, `group-chats` und `not-in-writing` fragen, was **nicht**
 * sein darf. Ein Häkchen erzeugt ein Verbot, und die Option «Nichts davon»
 * erzeugt die Erlaubnis. Eine erlaubende Formulierung — «was gepostet werden
 * darf» — würde jeden daraus abgeleiteten Satz umdrehen, während die Seite
 * unverändert aussieht; in der Itembank steht, dass genau das schon einmal passiert
 * ist. Deshalb verbieten die deutschen Fragen so wie die englischen, und
 * deshalb trägt die Überschrift von `card.spoken` die Richtung, die das Label
 * einer Option allein nicht tragen kann.
 *
 * ── Zwei Wörter mit Absicht ───────────────────────────────────────────
 *
 * «Posten» steht überall dort, wo das Englische *post* sagt: es ist im
 * Deutschen das gebräuchliche Wort und lässt offen, um welche Plattform es
 * geht. Und «Nachlasskontakt» steht für *legacy contact* — der Begriff, den
 * die Plattformen selbst in ihren deutschen Oberflächen verwenden, und damit
 * das Wort, nach dem jemand später sucht.
 *
 * Itembank © der Autor, alle Rechte vorbehalten. Siehe LICENSE.
 */
export default {
  "title": "Digitales Leben",
  "tagline": "Zwölf Haltungen zum Handy, zu dem, was gepostet wird, und zu dem, was bleibt — jede mit ihrem Gewicht.",
  "framework": "Zwölf erklärte Haltungen — nichts wird gewertet, nichts erschlossen",
  "sourceNote": "Hinter diesem Instrument steht kein validiertes Verfahren, weil es keines gibt — die Fragen sind hier geschrieben worden, und die Forschung diente dazu auszuwählen, welche zu stellen sind, nicht dazu, etwas über deine Antworten zu sagen. Was diese Forschung trägt, ist bescheiden und gehört in seiner tatsächlichen Größe hierher. In einer Metaanalyse zum Phubbing in Paarbeziehungen (Ni und Kollegen, Frontiers in Psychology, 2025) lag der Zusammenhang zwischen dem Gefühl, fürs Handy übergangen zu werden, und der Beziehungszufriedenheit bei r = −0,22 über 30 Stichproben und 9.040 Personen — real, klein und fast durchweg aus Querschnittsdaten, die nicht sagen können, in welche Richtung er läuft. Eine dyadische Tagebuchstudie fand, dass der Effekt an der Wahrnehmung hängt und nicht am Verhalten: die selbst berichtete Handynutzung der Partnerin oder des Partners sagte nichts vorher, während das Gefühl, übergangen zu werden, an demselben Tag eine geringere Beziehungsqualität vorhersagte — und dieser Tageseffekt hielt zwei Monate später ebenfalls nicht (Carnelley, Vowels, Stanton, Millings und Hart, Computers in Human Behavior 147, 2023). Das Posten von Kinderbildern ist das einzige Thema hier, bei dem die am meisten betroffene Person nicht die antwortende ist: die beschriebenen Schäden sind dokumentiert — eine dauerhafte Spur, die das Kind nicht gewählt hat, Missbrauch der Bilder, Streit mit dem erwachsenen Kind über Beiträge, denen es nie zugestimmt hat —, die Studien dahinter sind klein und überwiegend beschreibend, und in einer Befragung von 1.460 tschechischen und spanischen Eltern hatten rund vier von fünf Bilder ihres Kindes gepostet, während nur etwa eine oder einer von fünf das Kind vorher gefragt hatte. Für Gruppenchats, für das, was gar nicht erst geschrieben werden sollte, und für das, was Menschen nach ihrem Tod mit ihren Konten wollen, gibt es überhaupt keine brauchbare Evidenz; diese Fragen stehen hier, weil sie sonst von selbst entschieden werden, und nicht, weil etwas darüber bekannt wäre. Nichts auf dieser Seite wird gewertet, erschlossen oder in eine Zahl verwandelt.",

  /* ── die Abschnitte ───────────────────────────────────────────────── */
  "section.attention.title": "Aufmerksamkeit",
  "section.attention.note": "Was ein Handy unterbrechen darf und wie schnell eine Antwort erwartet wird.",
  "section.visibility.title": "Was andere sehen",
  "section.visibility.note": "Veröffentlichen — samt der einen Person in diesem Abschnitt, die hier nicht selbst antworten kann.",
  "section.access.title": "Was offen liegt",
  "section.access.note": "Passwörter, Standort, und ob ein entsperrtes Handy auf dem Tisch eine Einladung ist.",
  "section.permanence.title": "Was bleibt",
  "section.permanence.note": "Was existieren darf, was nie geschrieben werden sollte und was danach mit dem ganzen Archiv geschieht.",

  /* ── die Fragen ───────────────────────────────────────────────────── */
  "stance.phone-at-meals.prompt": "Wo sollen Handys bei einem gemeinsamen Essen sein?",
  "stance.reply-window.prompt": "Wie schnell soll eine direkte Frage beantwortet werden?",
  "stance.work-after-hours.prompt": "Wann darf die Arbeit dich nach Feierabend erreichen?",
  "stance.posted-about-me.prompt": "Was darf ohne Nachfrage nicht über dich gepostet werden?",
  "stance.children-online.prompt": "Was ist das Meiste, was über dein Kind gepostet werden darf?",
  "stance.group-chats.prompt": "Was von dir soll aus einem Gruppenchat herausbleiben?",
  "stance.passwords.prompt": "Welche deiner Passwörter soll jemand anderes haben?",
  "stance.location.prompt": "Wer darf sehen, wo du gerade bist?",
  "stance.reading-messages.prompt": "Wer darf die Nachrichten auf deinem Handy lesen?",
  "stance.intimate-images.prompt": "Was darf mit intimen Fotos von dir geschehen?",
  "stance.not-in-writing.prompt": "Was davon soll nie als Nachricht ankommen?",
  "stance.accounts-after-death.prompt": "Was soll nach deinem Tod von deinen Konten bleiben?",

  /* ── was geantwortet werden kann ──────────────────────────────────── */
  /* phone-at-meals */
  "stance.phone-at-meals.opt.out-of-room": "Ganz aus dem Raum",
  "stance.phone-at-meals.opt.silent-away": "In der Nähe, lautlos und außer Sicht",
  "stance.phone-at-meals.opt.face-down": "Auf dem Tisch, umgedreht, unberührt",
  "stance.phone-at-meals.opt.used-freely": "Frei benutzt, wie zu jeder anderen Zeit",
  "stance.phone-at-meals.opt.no-rule": "Ich habe dazu keine Regel",
  /* reply-window */
  "stance.reply-window.opt.hours": "Innerhalb einiger Stunden",
  "stance.reply-window.opt.same-day": "Am selben Tag",
  "stance.reply-window.opt.day-or-more": "Ein Tag oder mehr ist in Ordnung",
  "stance.reply-window.opt.urgent-only": "Nur wenn ich gesagt habe, es eilt",
  "stance.reply-window.opt.never": "Es gibt überhaupt keine Erwartung",
  "stance.reply-window.opt.undecided": "Darüber habe ich nicht nachgedacht",
  /* work-after-hours */
  "stance.work-after-hours.opt.never": "Nie, das wartet bis zum Morgen",
  "stance.work-after-hours.opt.cannot-wait": "Nur für etwas, das nicht warten kann",
  "stance.work-after-hours.opt.any-evening": "Jeden Abend, bis ich schlafen gehe",
  "stance.work-after-hours.opt.any-time": "Zu jeder Zeit",
  "stance.work-after-hours.opt.no-work": "Meine Arbeit kann mich gar nicht erreichen",
  "stance.work-after-hours.opt.undecided": "Das habe ich nicht entschieden",
  /* posted-about-me */
  "stance.posted-about-me.opt.photos": "Ein Foto, auf dem ich zu sehen bin",
  "stance.posted-about-me.opt.full-name": "Mein voller Name, ausgeschrieben",
  "stance.posted-about-me.opt.whereabouts": "Wo ich gerade bin",
  "stance.posted-about-me.opt.relationship": "Neuigkeiten über meine Beziehung",
  "stance.posted-about-me.opt.none": "Nichts davon — poste alles frei",
  /* children-online */
  "stance.children-online.opt.nothing": "Gar nichts, nie",
  "stance.children-online.opt.private-only": "Nur privat an Menschen, die ich aussuche",
  "stance.children-online.opt.closed-account": "Auf einem geschlossenen Konto, nie öffentlich",
  "stance.children-online.opt.public-no-identifiers": "Öffentlich, ohne Gesicht und ohne Namen",
  "stance.children-online.opt.public-open": "Öffentlich, wie alles andere auch",
  "stance.children-online.opt.undecided": "Das habe ich nicht geklärt",
  /* group-chats */
  "stance.group-chats.opt.screenshots": "Screenshots meiner Nachrichten",
  "stance.group-chats.opt.arguments": "Ein Streit von uns",
  "stance.group-chats.opt.health": "Alles zu meiner Gesundheit",
  "stance.group-chats.opt.money": "Alles zu meinem Geld",
  "stance.group-chats.opt.none": "Nichts davon — erzähl alles weiter",
  /* passwords */
  "stance.passwords.opt.none": "Keines davon",
  "stance.passwords.opt.shared-accounts": "Nur Konten, die wir ohnehin beide nutzen",
  "stance.passwords.opt.shared-plus-passcode": "Die, dazu der Code meines Handys",
  "stance.passwords.opt.emergency-all": "Alle, aufbewahrt für einen Notfall",
  "stance.passwords.opt.all-any-time": "Alle, jederzeit zu benutzen",
  "stance.passwords.opt.undecided": "Das habe ich nicht entschieden",
  /* location */
  "stance.location.opt.nobody": "Niemand, nie",
  "stance.location.opt.only-when-i-send": "Nur wenn ich ihn selbst schicke",
  "stance.location.opt.travelling": "Eine Person, auf Reisen oder spät unterwegs",
  "stance.location.opt.one-person-always": "Eine Person, dauerhaft an",
  "stance.location.opt.household-always": "Mein ganzer Haushalt, dauerhaft an",
  "stance.location.opt.undecided": "Das habe ich nicht entschieden",
  /* reading-messages */
  "stance.reading-messages.opt.nobody": "Niemand, nicht einmal im Notfall",
  "stance.reading-messages.opt.if-incapable": "Nur wenn ich selbst nicht antworten kann",
  "stance.reading-messages.opt.handed-over": "Nur was ich zum Zeigen weitergegeben habe",
  "stance.reading-messages.opt.ask-first": "Eine Person, wenn sie mich vorher fragt",
  "stance.reading-messages.opt.one-person-anytime": "Eine Person, jederzeit, ohne zu fragen",
  "stance.reading-messages.opt.undecided": "Das habe ich nicht entschieden",
  /* intimate-images */
  "stance.intimate-images.opt.none": "Es sollte gar keine geben",
  "stance.intimate-images.opt.deleted": "Gemacht und am selben Tag gelöscht",
  "stance.intimate-images.opt.my-device": "Nur auf einem Gerät, das ich kontrolliere",
  "stance.intimate-images.opt.no-cloud": "Auf den Geräten von uns beiden, nie in einer Cloud",
  "stance.intimate-images.opt.anywhere": "Überall, Cloud-Backups eingeschlossen",
  "stance.intimate-images.opt.rather-not": "Das möchte ich lieber nicht beantworten",
  /* not-in-writing */
  "stance.not-in-writing.opt.apology": "Eine Entschuldigung, auf die es ankommt",
  "stance.not-in-writing.opt.end-of-argument": "Das Ende eines Streits",
  "stance.not-in-writing.opt.health-news": "Schlechte Nachrichten über jemandes Gesundheit",
  "stance.not-in-writing.opt.money-decision": "Eine Entscheidung über Geld",
  "stance.not-in-writing.opt.criticism": "Alles Kritische über mich",
  "stance.not-in-writing.opt.none": "Nichts davon — eine Nachricht reicht",
  /* accounts-after-death */
  "stance.accounts-after-death.opt.nothing": "Nichts — alles davon löschen",
  "stance.accounts-after-death.opt.photographs": "Nur die Fotos",
  "stance.accounts-after-death.opt.no-messages": "Alles außer meinen privaten Nachrichten",
  "stance.accounts-after-death.opt.as-it-is": "Alles, genau so wie es ist",
  "stance.accounts-after-death.opt.undecided": "Darüber habe ich nicht nachgedacht",

  /* ── worauf die Haltung ruht ──────────────────────────────────────── */
  "stance.work-after-hours.groundsPrompt": "Woher kommt diese Regel zur Arbeit am Abend?",
  "stance.children-online.groundsPrompt": "Woher kommt diese Grenze für Fotos deines Kindes?",
  "stance.location.groundsPrompt": "Woher kommt diese Sicht auf das Teilen deines Standorts?",
  "stance.reading-messages.groundsPrompt": "Woher kommt diese Linie um deine Nachrichten herum?",
  "stance.intimate-images.groundsPrompt": "Woher kommt diese Antwort zu diesen Fotos?",
  "stance.grounds.safety": "Sicherheit, meine oder die von jemand anderem",
  "stance.grounds.consent": "Jemand anderes hat nicht zugestimmt",
  "stance.grounds.experience": "Etwas, das mir früher passiert ist",
  "stance.grounds.privacy": "Ein Teil meines Lebens soll meiner bleiben",
  "stance.grounds.trust": "Was Vertrauen für mich heißt",
  "stance.grounds.obligation": "Meine Arbeit oder das Gesetz verlangt es",
  "stance.grounds.not-worked-out": "Das habe ich für mich nicht geklärt",

  /* ── das Playbook ─────────────────────────────────────────────────── */
  /* das ist in Ordnung */
  "playbook.ok-phone-in-another-room": "Lass dein Handy im anderen Zimmer, während wir essen, ohne es anzukündigen — ich lese das nicht als Schmollen.",
  "playbook.ok-glance-if-you-say-so": "Schau am Tisch aufs Handy, wenn du auf etwas wartest — sag mir nur, dass du wartest.",
  "playbook.ok-phone-out-at-dinner": "Benutz dein Handy am Tisch, ohne vorher mein Gesicht zu prüfen — es stört mich wirklich nicht.",
  "playbook.ok-one-line-holds-it": "Schick mir eine Zeile, dass du noch nicht richtig antworten kannst; das zählt als Antwort.",
  "playbook.ok-reply-tomorrow": "Lass meine Nachricht bis morgen liegen, wenn du müde bist; ich habe die Stunden nicht gezählt.",
  "playbook.ok-silence-costs-nothing": "Lass dir zum Antworten so viel Zeit, wie du willst, und fang nicht mit einer Entschuldigung für die Lücke an.",
  "playbook.ok-send-what-cannot-wait": "Schreib mir nach Feierabend, wenn es wirklich nicht bis zum Morgen liegen bleiben kann.",
  "playbook.ok-take-the-work-call": "Nimm den Arbeitsanruf am Abend an, solange du mir sagst, dass es Arbeit ist.",
  "playbook.ok-post-me-unasked": "Poste das Foto von mir, wenn es dir gefällt — du musst mich vorher nicht fragen.",
  "playbook.ok-send-child-photos-privately": "Schick Fotos unseres Kindes direkt an die Menschen, die sie wollen, statt sie irgendwo zu posten.",
  "playbook.ok-ask-the-child": "Zeig unserem Kind das Foto, bevor es hochgeht, und nimm ein Nein hin, ohne es ihm auszureden.",
  "playbook.ok-tell-your-friends": "Erzähl deinen Freundinnen und Freunden von unserem Streit, wenn dir das hilft — lieber das, als dass es in dir bleibt.",
  "playbook.ok-use-shared-logins": "Melde dich bei den Konten an, die wir beide nutzen, ohne mich jedes Mal zu fragen.",
  "playbook.ok-use-my-passcode": "Benutz meinen Code, wenn du mich nicht erreichst und wirklich etwas erledigt werden muss.",
  "playbook.ok-location-when-travelling": "Schalt meinen Standort ein, während ich unterwegs bin, und wieder aus, wenn ich zu Hause bin.",
  "playbook.ok-check-my-location": "Schau auf meinen Standort, wann immer du willst — dafür habe ich ihn angeschaltet.",
  "playbook.ok-open-my-phone-if-i-cannot": "Öffne mein Handy, wenn ich im Krankenhaus liege und nicht selbst rangehen kann.",
  "playbook.ok-read-the-handed-phone": "Lies alles auf meinem Handy, sobald ich es dir gegeben habe — ich muss dabei nicht zusehen.",
  "playbook.ok-delete-on-request": "Bitte mich, ein Foto von dir zu löschen, und rechne damit, dass es am selben Tag weg ist, ohne Diskussion.",
  "playbook.ok-call-instead-of-typing": "Ruf mich an, statt es zu tippen, wenn es schlechte Nachrichten über jemandes Gesundheit sind.",
  "playbook.ok-message-is-fine": "Schick es als Nachricht, wenn das leichter ist; nichts davon muss laut gesagt werden.",
  "playbook.ok-name-me-legacy-contact": "Trag mich als Nachlasskontakt für dein Handy und deine Mail ein, damit später niemand mit einer Hotline streiten muss.",
  /* das ist nicht in Ordnung */
  "playbook.no-phone-at-the-table": "Bring dein Handy gar nicht erst an den Tisch — nicht umgedreht, nicht lautlos.",
  "playbook.no-scroll-mid-sentence": "Fang nicht an zu scrollen, während ich mitten im Satz bin, auch wenn du noch zuhörst.",
  "playbook.no-day-long-silence": "Lass eine direkte Frage nicht den ganzen Tag unbeantwortet, ohne eine Zeile dazu, warum.",
  "playbook.no-work-in-the-evening": "Beantworte am Abend keine Arbeitsnachricht; sie ist morgen noch da.",
  "playbook.no-work-unless-it-burns": "Schick mir nach Feierabend nichts von der Arbeit, wofür du mich nicht angerufen hättest.",
  "playbook.no-post-me-unasked": "Poste kein Foto, auf dem ich bin, ohne mich vorher zu fragen — auch nicht in einer Story, die verschwindet.",
  "playbook.no-name-me-in-public": "Schreib meinen vollen Namen nicht in einen öffentlichen Beitrag, auch nicht in ein Dankeschön.",
  "playbook.no-post-where-i-am": "Poste nicht, wo ich bin, solange ich noch dort bin.",
  "playbook.no-announce-my-relationship": "Verkünde nichts über meine Beziehung, bevor ich es getan habe.",
  "playbook.no-child-at-all": "Poste nirgends etwas über unser Kind, auch nicht dort, wo nur Menschen mitlesen, denen du es anvertrauen würdest.",
  "playbook.no-child-face-public": "Stell das Gesicht unseres Kindes nicht auf ein öffentliches Konto — kein einziges Mal, auch kein gutes Foto.",
  "playbook.no-child-school-or-uniform": "Poste nichts, was die Schule unseres Kindes nennt oder seine Schulkleidung zeigt.",
  "playbook.no-child-embarrassment": "Poste unser Kind nicht, wenn es weint oder ausgeschimpft wird, auch nicht als Witz übers Elternsein.",
  "playbook.no-screenshot-into-group": "Schick keine Screenshots meiner Nachrichten in einen Gruppenchat, so gut der Satz auch war.",
  "playbook.no-argument-into-group": "Erzähl dem Gruppenchat nicht von einem Streit, in dem wir noch mittendrin sind.",
  "playbook.no-health-into-group": "Gib nichts über meine Gesundheit weiter, auch nicht an Menschen, die sich nur freundlich sorgen würden.",
  "playbook.no-money-into-group": "Erzähl niemandem und in keinem Chat, was ich verdiene oder was ich schulde.",
  "playbook.no-shared-logins-in-my-name": "Richte kein Konto auf meinen Namen ein, dessen Passwort nur du hast.",
  "playbook.no-check-instead-of-asking": "Schau nicht auf meinen Standort, um zu erfahren, wo ich bin, statt mich zu fragen.",
  "playbook.no-read-while-i-shower": "Lies meine Nachrichten nicht, während ich dusche, auch wenn das Handy entsperrt daliegt.",
  "playbook.no-intimate-photos-at-all": "Mach überhaupt keine intimen Fotos von mir, so sicher du sie auch aufheben würdest.",
  "playbook.no-cloud-backup-of-photos": "Bewahre intime Fotos von mir in nichts auf, was sich mit einer Cloud synchronisiert.",
  "playbook.no-ending-arguments-by-text": "Beende einen Streit nicht per Nachricht — bring ihn laut zu Ende oder lass ihn offen, bis wir können.",
  "playbook.no-criticism-by-text": "Schreib mir nicht in einer Nachricht, was ich falsch gemacht habe; sag es mir ins Gesicht.",
  "playbook.no-money-by-text": "Entscheide eine Geldfrage nicht in einem Nachrichtenverlauf.",
  "playbook.no-reading-my-messages-after": "Lies meine privaten Nachrichten nach meinem Tod nicht, was immer du sonst behältst.",

  /* ── der Anweisungsbogen ───────────────────────────────────────
     Sieben Überschriften auf den vier Kanälen, die der Spec deklariert. Nicht
     die vier Abschnitte: die sind die Reihenfolge, in der gefragt wird, und
     eine Karte ist das, was jemand nachschlägt, bevor er postet, antwortet
     oder das Handy weglegt.

     Drei der zwölf Blöcke fragen nach dem Verbot, und eine Karte druckt einen
     Titel und einen Text und sonst nichts — keine Frage reist mit der Antwort
     mit. Also muss der Titel die Richtung tragen, die das Label einer Option
     nicht tragen kann: «Eine Entschuldigung, auf die es ankommt» ist etwas,
     das nie als Nachricht ankommen soll, und unter einer Überschrift, die das
     nicht sagt, läse es sich umgekehrt. */
  "card.answering": "Wie schnell ich antworte, und wann Arbeit mich erreicht",
  "card.together": "Das Handy, wenn wir zusammen sind",
  "card.photographs": "Intime Fotos",
  "card.posting": "Bevor etwas gepostet oder weitererzählt wird",
  "card.open": "Was offen liegt, und für wen",
  "card.afterwards": "Was danach bleibt",
  "card.spoken": "Was nie als Nachricht ankommen darf",

  /* ── die Ergebnisseite ─────────────────────────────────────────
     Eine Beschriftung über den Gründen und die zwei Listen, die die Gewichte
     ergeben. Die Überschriften sprechen über die eigenen Zahlen der lesenden
     Person und nie darüber, was sie «erlaubt» oder «zugesagt» hat: drei der
     zwölf Antworten sind Listen von Dingen, die nicht passieren sollen, und
     eine Beschriftung in erlaubender Richtung würde sie umgekehrt drucken.
     Hier steht nichts über Phubbing, über Kinderbilder oder über den digitalen
     Nachlass — die vorsichtige Fassung dessen, was jene Forschung trägt, steht
     im sourceNote, das die Ergebnisseite ohnehin darunter zeichnet. */
  "view.rests": "Ruht auf:",
  "view.heaviest.title": "Was du am schwersten gewichtet hast",
  "view.heaviest.note": "Acht oder mehr von zehn. Hier wird nichts addiert und mit niemandem verglichen — es ist die Stelle, an der du am wenigsten Spielraum siehst, und genau das muss jemand wissen, bevor er in eine davon hineinläuft.",
  "view.lightest.title": "Was du am leichtesten gewichtet hast",
  "view.lightest.note": "Drei oder weniger von zehn. Das ist nicht dasselbe wie keine Haltung: du sagst damit, dass hier Spielraum ist, und für die lesende Person ist das genauso viel wert wie die Liste darüber.",
};
