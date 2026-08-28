/**
 * Boundaries — Spanish.
 *
 * Key for key with `en.ts`, which is the source of truth; only the values are
 * written. Second person is `tú` throughout, per the note at the head of
 * `src/i18n/messages/es.ts`: these are sentences one person hands to another
 * about their own home, and `usted` would turn them into a tenancy agreement.
 *
 * Written in Spanish rather than carried across from the English. The prompts
 * had to be, twice over: Spanish runs long, and the eighty-character gate in
 * `test/i18n/readability.test.ts` does not move for it — «¿Cuánto puede
 * retrasarse alguien antes de que esperes un mensaje?» is the question the
 * English asks, arrived at by asking it in Spanish rather than by translating
 * the clause order.
 *
 * The noun is «límite». It carries exactly the two histories the sourceNote
 * names — the family systems sense and the self-help one — so the note about
 * claiming nothing for the word survives the crossing intact.
 *
 * Nothing agrees with a gender. The options and the playbook lines are things
 * a person says about themselves and then hands to somebody else, and an
 * adjective that agreed would make the reader pick a gender in order to
 * answer — so «Do not leave me standing there» is `no me dejes esperando ahí`
 * rather than a form that ends in -o or -a, and the partner in
 * `partner-ex-friend` `mantiene la amistad` rather than being `amigo` or
 * `amiga` of anybody.
 *
 * The two `notMine` options are the load-bearing ones. `No es algo que yo
 * decida` states a fact about an arrangement and claims nothing about wanting
 * it, which is the whole reason the option exists; anything warmer would have
 * written the reader's compliance down as a preference.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Límites",
  "tagline": "Doce cosas sobre tu puerta, tu sueño y tu dinero, cada una con el peso que le das.",
  "framework": "Doce posturas declaradas — nada se puntúa, no se evalúa a nadie",
  "sourceNote": "Detrás de esto no hay ningún instrumento validado, y no podría haberlo: cuánto le prestarías a un hermano, o cuánto retraso aguantas antes de querer un mensaje, no son constructos psicológicos. Son hechos sobre cómo vives. La palabra «límite» llega a esta página por dos caminos —la teoría de sistemas familiares, donde nombra dónde termina una parte de la familia y empieza otra, y una literatura de autoayuda que no ha producido ni un solo estudio de resultados que merezca citarse—, así que aquí se usa como palabra corriente, sin atribuirle nada. Nada se puntúa, ni se coloca en una franja, ni se compara con nadie. Hay algo que conviene decir claro y no en una nota al pie: todo lo que escribas aquí es o una afirmación sobre tu propia conducta o una petición, y una petición es algo que la otra persona puede declinar. Esa regla es la razón de que ninguna pregunta te pida ponerle una norma a otro adulto: ni a quién puede ver, ni a quién puede escribir, ni dónde está. Cuando una respuesta describe un arreglo que no acordaste, esta página lo registra exactamente como eso y no lo llama una preferencia. Y nada de esta página lee tus respuestas buscando indicios de nada.",

  /* ── the sections ─────────────────────────────────────────────────── */
  "section.home.title": "La puerta y la tarde",
  "section.home.note": "Tres cosas que decide quien se mueve primero: quién llega, quién entra y cuánto esperas.",
  "section.people.title": "Los demás que hay en medio",
  "section.people.note": "Ex parejas, amistades, familia y lo que se les cuenta a cada uno.",
  "section.body.title": "Tu cuerpo y tu sueño",
  "section.body.note": "Dos cosas que es más fácil decir ahora que en el momento.",
  "section.yours.title": "Lo tuyo, y quién dispone de ello",
  "section.yours.note": "Tus cosas, tu dinero, tu tiempo: qué sale de aquí sin hablarlo antes.",

  /* ── the questions ────────────────────────────────────────────────── */
  "stance.unannounced-visit.prompt": "¿Quién puede presentarse en tu casa sin avisar antes?",
  "stance.closed-door.prompt": "¿Qué significa una puerta cerrada en tu casa?",
  "stance.lateness.prompt": "¿Cuánto puede retrasarse alguien antes de que esperes un mensaje?",
  "stance.partner-ex-friend.prompt": "Tu pareja mantiene la amistad con su ex. ¿Qué necesitas?",
  "stance.own-ex-contact.prompt": "Te llega un mensaje de tu ex. ¿Qué haces?",
  "stance.friend-rude.prompt": "Una amistad habla con crueldad de alguien a quien quieres. ¿Qué haces?",
  "stance.told-outside.prompt": "¿Quién puede enterarse de una discusión de casa?",
  "stance.public-touch.prompt": "¿Qué contacto en público te parece bien?",
  "stance.woken.prompt": "¿Qué motivo basta para despertarte?",
  "stance.things-read.prompt": "¿Quién puede mirar tus cosas sin pedir permiso?",
  "stance.money-family.prompt": "¿Cuánto puedes prestar a la familia sin hablarlo antes?",
  "stance.volunteered.prompt": "Alguien te compromete a algo. ¿Qué haces?",

  /* ── what may be answered ─────────────────────────────────────────── */
  /* unannounced-visit */
  "stance.unannounced-visit.opt.nobody": "Nadie — antes escriben",
  "stance.unannounced-visit.opt.parent": "Mi padre o mi madre, sí",
  "stance.unannounced-visit.opt.family": "Cualquiera de la familia cercana",
  "stance.unannounced-visit.opt.anyone": "Cualquier persona cercana a mí",
  "stance.unannounced-visit.opt.notMine": "No es algo que yo decida",
  "stance.unannounced-visit.opt.never": "Nunca se ha dado el caso",
  /* closed-door */
  "stance.closed-door.opt.nobody": "No entra nadie",
  "stance.closed-door.opt.knockWait": "Llamar y esperar respuesta",
  "stance.closed-door.opt.knockIn": "Llamar y entrar directamente",
  "stance.closed-door.opt.openHouse": "Aquí no se cierran las puertas",
  "stance.closed-door.opt.never": "Nunca se ha dado el caso",
  /* lateness */
  "stance.lateness.opt.always": "Cualquier retraso",
  "stance.lateness.opt.ten": "Unos diez minutos",
  "stance.lateness.opt.thirty": "Media hora más o menos",
  "stance.lateness.opt.hour": "Una hora o más",
  "stance.lateness.opt.never": "Nunca necesito un mensaje",
  /* partner-ex-friend */
  "stance.partner-ex-friend.opt.nothing": "Nada — es cosa suya",
  "stance.partner-ex-friend.opt.toKnow": "Solo saber que existe",
  "stance.partner-ex-friend.opt.told": "Que me avise antes de quedar",
  "stance.partner-ex-friend.opt.met": "Haber conocido yo a esa persona",
  "stance.partner-ex-friend.opt.hard": "Me cuesta de todas formas",
  "stance.partner-ex-friend.opt.unknown": "Todavía no lo sé",
  /* own-ex-contact */
  "stance.own-ex-contact.opt.sayFirst": "Decirlo en casa antes de responder",
  "stance.own-ex-contact.opt.replyThenSay": "Responder y luego contarlo",
  "stance.own-ex-contact.opt.replyQuiet": "Responder y no decir nada",
  "stance.own-ex-contact.opt.noReply": "No respondo",
  "stance.own-ex-contact.opt.blocked": "No puede contactar conmigo",
  "stance.own-ex-contact.opt.never": "No ha pasado",
  /* friend-rude */
  "stance.friend-rude.opt.thereAndThen": "Decir algo en el momento",
  "stance.friend-rude.opt.after": "Decírselo más tarde",
  "stance.friend-rude.opt.tellThem": "Avisar a la persona de la que hablaba",
  "stance.friend-rude.opt.nothing": "Nada — lo dejo pasar",
  "stance.friend-rude.opt.distance": "Ver menos a esa persona",
  "stance.friend-rude.opt.notHappened": "No ha pasado",
  /* told-outside */
  "stance.told-outside.opt.nobody": "Nadie que no estuviera delante",
  "stance.told-outside.opt.onePerson": "Una persona de confianza",
  "stance.told-outside.opt.friends": "Las amistades cercanas",
  "stance.told-outside.opt.family": "La familia también",
  "stance.told-outside.opt.anyone": "Me da igual quién",
  "stance.told-outside.opt.undecided": "No lo tengo decidido",
  /* public-touch */
  "stance.public-touch.opt.none": "Nada en absoluto",
  "stance.public-touch.opt.hand": "Una mano o un brazo",
  "stance.public-touch.opt.kiss": "Un beso corto también",
  "stance.public-touch.opt.anything": "Todo lo que haría en casa",
  "stance.public-touch.opt.depends": "Depende de quién esté mirando",
  /* woken */
  "stance.woken.opt.never": "Que no me despierten por nada",
  "stance.woken.opt.emergency": "Solo una emergencia",
  "stance.woken.opt.today": "Cualquier cosa que cambie el día",
  "stance.woken.opt.anything": "Que me despierten por cualquier cosa",
  "stance.woken.opt.depends": "Depende de la hora",
  /* things-read */
  "stance.things-read.opt.nobody": "Nadie mira mis cosas",
  "stance.things-read.opt.ask": "Quien pida permiso antes",
  "stance.things-read.opt.partner": "La persona con quien vivo",
  "stance.things-read.opt.notMine": "No es algo que yo decida",
  "stance.things-read.opt.never": "Nunca se ha dado el caso",
  /* money-family */
  "stance.money-family.opt.discussFirst": "Nada sin hablarlo antes",
  "stance.money-family.opt.dayPay": "Un día de sueldo",
  "stance.money-family.opt.weekPay": "Una semana de sueldo",
  "stance.money-family.opt.monthPay": "Un mes de sueldo",
  "stance.money-family.opt.whatever": "Lo que hiciera falta",
  "stance.money-family.opt.neverLend": "A la familia no le presto",
  /* volunteered */
  "stance.volunteered.opt.sayNo": "Digo que no en el momento",
  "stance.volunteered.opt.pullOut": "Después me salgo",
  "stance.volunteered.opt.sayLater": "Lo hago y luego lo digo",
  "stance.volunteered.opt.doIt": "Lo hago y no digo nada",
  "stance.volunteered.opt.notHappened": "No me ha pasado",

  /* ── the playbook ─────────────────────────────────────────────────── */
  /* this is fine */
  "playbook.ok.door.open": "Entra si la puerta está abierta. No tienes que llamar antes nunca.",
  "playbook.ok.door.hour": "Escríbeme una hora antes de venir y la respuesta será que sí casi siempre.",
  "playbook.ok.doorclosed.knock": "Si mi puerta está cerrada, llama y entra. No me estoy escondiendo de ti.",
  "playbook.ok.late.relax": "No te disculpes por diez minutos de retraso. De verdad que ni me había enterado.",
  "playbook.ok.late.line": "Si no llegas a media hora tarde, no te molestes en escribir. Voy pidiendo para los dos.",
  "playbook.ok.ex.theirs": "Ve a tu ex todas las veces que quieras. No necesito un informe después.",
  "playbook.ok.myex.reply": "Si mi ex me escribe, voy a responder. No es un secreto ni es el principio de nada.",
  "playbook.ok.myex.ask": "Pregúntame directamente si sé algo de mi ex. Vas a tener una respuesta clara, siempre.",
  "playbook.ok.friend.push": "Si digo algo injusto, contéstame delante de todos. Prefiero que quede dicho ahí.",
  "playbook.ok.told.talk": "Cuando discutamos, cuéntaselo a alguien de confianza. Prefiero eso a que te lo tragues.",
  "playbook.ok.touch.street": "Dame la mano por la calle. Bésame en la estación. Nada de eso me da vergüenza.",
  "playbook.ok.wake.me": "Despiértame si me necesitas. Prefiero perder una hora de sueño a enterarme en el desayuno.",
  "playbook.ok.things.open": "Puedes mirar mis cosas. No voy a mover nada de sitio antes.",
  "playbook.ok.money.lend": "Si tu familia necesita dinero, préstaselo. Cuéntamelo después en vez de pedirme permiso.",
  /* this is not */
  "playbook.no.door.message": "No aparezcas en mi puerta sin escribir antes. Tener llave no es una invitación.",
  "playbook.no.doorclosed.open": "No abras mi puerta sin llamar. Espera a que conteste antes de entrar.",
  "playbook.no.late.silence": "No me dejes esperando ahí. Si estás a más de diez minutos, mándame una línea.",
  "playbook.no.ex.afterwards": "No quedes con tu ex y me lo cuentes después. Dímelo antes.",
  "playbook.no.ex.pretend": "No me pidas que me lo tome con calma. No me lo tomo así, y fingirlo sería peor.",
  "playbook.no.myex.number": "No le des mi número a mi ex, sea cual sea la razón que te dé para quererlo.",
  "playbook.no.friend.jokes": "No hagas bromas sobre la gente que quiero delante de otros. Ni siquiera las buenas.",
  "playbook.no.told.story": "No le repitas a tu familia lo que dije en una pelea. Ni como anécdota graciosa en la cena.",
  "playbook.no.touch.colleagues": "No me beses delante de tus compañeros de trabajo. Una mano en la espalda está bien.",
  "playbook.no.touch.any": "No me busques la mano en público. No va de ti y no va a cambiar.",
  "playbook.no.wake.morning": "No me despiertes para contarme algo que seguirá siendo verdad por la mañana.",
  "playbook.no.things.out": "No mires mis cosas cuando no estoy. Pídemelo y te las enseño yo.",
  "playbook.no.money.promise": "No le prometas dinero a tu familia antes de haberme dicho la cifra en voz alta.",
  "playbook.no-lend-then-tell": "No le prestes dinero a alguien de tu familia y me lo cuentes después.",
  "playbook.no.volunteer.yes": "No digas que sí en mi nombre. Di que lo consultas conmigo — casi siempre voy a decir que sí.",

  /* ── the instruction sheet ─────────────────────────────────────
     Five headings, on the four channels the spec declares. Not the four
     sections: those are the order the questions are asked in, and a card is
     what somebody checks on the way through the door. Every body under these
     is the reader's own chosen words and nothing composed for them. */
  "card.arriving": "Antes de entrar",
  "card.committing": "A qué se me puede comprometer",
  "card.clock": "Retrasos, y despertarme",
  "card.touch": "El contacto en público",
  "card.repeating": "Ex parejas, y lo que se repite",

  /* ── the result page ───────────────────────────────────────────
     Two lists and the sentence over them. The headings are statements about
     the reader's own numbers — never about what they have «asked for» or
     «decided», because two of the twelve can be answered «No es algo que yo
     decida» and the sourceNote promises those are recorded as exactly that. */
  "view.weightTitle": "Dónde cayó el peso",
  "view.weightNote": "Los pesos que diste, leídos por los dos extremos. Lo que pusiste entre cuatro y siete no falta — está arriba, en el orden en que se te preguntó.",
  "view.heaviestTitle": "A lo que diste más peso",
  "view.heaviestNote": "Ocho o más sobre diez. Son aquellas en las que a alguien le sale más caro adivinar mal.",
  "view.lightestTitle": "A lo que diste menos peso",
  "view.lightestNote": "Tres o menos sobre diez. Aquí hay margen para moverse, que no es lo mismo que dar igual.",
};
