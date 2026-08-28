/**
 * digital-life — Spanish.
 *
 * Key for key with `en.ts`, which is the source of truth; only the values are
 * written. Second person is `tú` throughout, per the note at the head of
 * `src/i18n/messages/es.ts`: these are house rules one person hands to
 * another, and `usted` would turn a rule about phones at the dinner table
 * into a privacy policy.
 *
 * Written in Spanish rather than carried across from the English, as §8 of the
 * stated-positions design asks. The prompts had to be: Spanish runs about a
 * fifth longer and the eighty-character gate in
 * `test/i18n/readability.test.ts` does not move for it, so "What is the most
 * that may be posted about your child?" is «¿Qué es lo máximo que se puede
 * publicar de tu hijo?» — the question asked in Spanish rather than the
 * English clause order carried over. The forbidden joiners for `es` are
 * «, pero » and «; », and no prompt here needs either; the longest of the
 * seventeen runs to 60 characters.
 *
 * The vocabulary is peninsular and domestic. «Móvil» as in every other Spanish
 * table here, «grupo de chat» with no brand name inside it, «regañina» rather
 * than a clinical word for being told off, and «contacto de legado» because
 * that is what the phone itself calls the setting somebody has to go and find.
 *
 * ── Three of the twelve ask what may NOT happen ──────────────────────
 *
 * `posted-about-me`, `group-chats` and `not-in-writing` are restrictive: a
 * ticked option earns a prohibition and the floor option «Nada de esto» earns
 * the permission. Spanish makes the permissive framing the more natural one —
 * «¿qué se puede publicar de ti?» reads better than the question actually
 * asked — and taking it would invert every playbook line derived below it with
 * the page still rendering perfectly. The bank records that this happened once
 * already. So the three prompts here forbid, as the English does, and
 * `card.spoken` states the prohibition in full, because a card prints a title
 * and an option label and nothing else.
 *
 * Nothing agrees with the reader's gender, or with the gender of whoever they
 * hand the sheet to. Where the English could leave a participle open the
 * Spanish takes a noun or a verb instead: «si estás sin fuerzas» rather than a
 * form ending in -o or -a, «llorando o en plena regañina» rather than
 * «reñido», «tus amistades» rather than «tus amigos», «una comida compartida»
 * rather than «una comida juntos». The one plural left standing is
 * `card.together`'s «cuando estamos juntos», which agrees with a household
 * rather than with either person reading the sheet.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Vida digital",
  "tagline": "Doce posturas sobre tu móvil, sobre lo que se publica y sobre lo que queda, cada una con su peso.",
  "framework": "Doce posturas declaradas — nada se puntúa y nada se infiere",
  "sourceNote": "Detrás de esto no hay ningún instrumento validado, porque no existe: las preguntas se escribieron aquí, y la investigación sirvió para elegir cuáles hacer, no para decir nada sobre tus respuestas. Lo que esa investigación sí sostiene es modesto y conviene darlo a su tamaño real. En un metaanálisis del phubbing de pareja (Ni y colaboradores, Frontiers in Psychology, 2025), la asociación entre sentir que el móvil de la pareja va antes que tú y la satisfacción con la relación fue de r = −0,22 en 30 muestras y 9040 personas: real, pequeña y sacada casi por entero de datos transversales, que no pueden decir en qué dirección corre. Un estudio de diarios con parejas encontró que el efecto se agarra a la percepción y no a la conducta: el uso del móvil que la propia pareja declaraba no predecía nada, mientras que sentir eso —que el móvil iba antes— sí predecía peor calidad de la relación ese mismo día, y ese efecto diario tampoco se mantuvo dos meses después (Carnelley, Vowels, Stanton, Millings y Hart, Computers in Human Behavior 147, 2023). Publicar cosas de los hijos es el único asunto de aquí en el que la persona más afectada no es la que responde: los daños revisados están documentados —una huella permanente que no eligió quien aparece en ella, el uso indebido de sus imágenes, el conflicto con ese hijo ya adulto por publicaciones que nunca aceptó—, los estudios que hay detrás son pequeños y sobre todo descriptivos, y en una encuesta a 1460 padres y madres checos y españoles alrededor de cuatro de cada cinco habían publicado fotos de su hijo mientras que solo alrededor de uno de cada cinco se lo había preguntado antes. Sobre los grupos de chat, sobre lo que no debería escribirse nunca y sobre lo que la gente quiere que se haga con sus cuentas después no hay evidencia útil de ninguna clase; esas preguntas están aquí porque, si nadie las plantea, se deciden solas, no porque se sepa nada de ellas. Nada de esta página se puntúa, se infiere ni se convierte en un número.",

  /* ── the sections ─────────────────────────────────────────────────── */
  "section.attention.title": "La atención",
  "section.attention.note": "Qué puede interrumpir un móvil y en cuánto tiempo se espera una respuesta.",
  "section.visibility.title": "Lo que ven los demás",
  "section.visibility.note": "Publicar — incluida la única persona de esta sección que no está aquí para responder por sí misma.",
  "section.access.title": "Lo que está abierto",
  "section.access.note": "Contraseñas, ubicación y si un móvil desbloqueado sobre la mesa es una invitación.",
  "section.permanence.title": "Lo que queda",
  "section.permanence.note": "Qué puede existir, qué no debería escribirse nunca y qué pasa después con todo el archivo.",

  /* ── the questions ────────────────────────────────────────────────── */
  "stance.phone-at-meals.prompt": "¿Dónde deben estar los móviles en una comida compartida?",
  "stance.reply-window.prompt": "¿En cuánto tiempo debe contestarse una pregunta directa?",
  "stance.work-after-hours.prompt": "¿Cuándo puede localizarte el trabajo fuera de horario?",
  "stance.posted-about-me.prompt": "¿Qué no se puede publicar sobre ti sin preguntarte?",
  "stance.children-online.prompt": "¿Qué es lo máximo que se puede publicar de tu hijo?",
  "stance.group-chats.prompt": "¿Qué cosa tuya no debería acabar en un grupo de chat?",
  "stance.passwords.prompt": "¿Qué contraseñas tuyas debería tener otra persona?",
  "stance.location.prompt": "¿Quién puede ver dónde estás ahora mismo?",
  "stance.reading-messages.prompt": "¿Quién puede leer los mensajes de tu móvil?",
  "stance.intimate-images.prompt": "¿Qué puede pasar con tus fotos íntimas?",
  "stance.not-in-writing.prompt": "¿Cuáles de estas cosas no deberían llegar nunca por mensaje?",
  "stance.accounts-after-death.prompt": "¿Qué debería quedar de tus cuentas cuando mueras?",

  /* ── what may be answered ─────────────────────────────────────────── */
  /* phone-at-meals */
  "stance.phone-at-meals.opt.out-of-room": "Fuera de la habitación, del todo",
  "stance.phone-at-meals.opt.silent-away": "Cerca, en silencio y fuera de la vista",
  "stance.phone-at-meals.opt.face-down": "En la mesa, boca abajo, sin tocarlo",
  "stance.phone-at-meals.opt.used-freely": "Usándolo con libertad, como siempre",
  "stance.phone-at-meals.opt.no-rule": "No tengo ninguna norma sobre esto",
  /* reply-window */
  "stance.reply-window.opt.hours": "En unas pocas horas",
  "stance.reply-window.opt.same-day": "El mismo día",
  "stance.reply-window.opt.day-or-more": "Un día o más está bien",
  "stance.reply-window.opt.urgent-only": "Solo si he dicho que corre prisa",
  "stance.reply-window.opt.never": "No hay ninguna expectativa",
  "stance.reply-window.opt.undecided": "No me lo he planteado",
  /* work-after-hours */
  "stance.work-after-hours.opt.never": "Nunca, espera a la mañana",
  "stance.work-after-hours.opt.cannot-wait": "Solo para algo que no puede esperar",
  "stance.work-after-hours.opt.any-evening": "Cualquier tarde, hasta que me acuesto",
  "stance.work-after-hours.opt.any-time": "A cualquier hora",
  "stance.work-after-hours.opt.no-work": "Mi trabajo no tiene forma de localizarme",
  "stance.work-after-hours.opt.undecided": "No lo tengo decidido",
  /* posted-about-me */
  "stance.posted-about-me.opt.photos": "Una foto en la que salgo",
  "stance.posted-about-me.opt.full-name": "Mi nombre y mis apellidos, escritos",
  "stance.posted-about-me.opt.whereabouts": "Dónde estoy en ese momento",
  "stance.posted-about-me.opt.relationship": "Novedades sobre mi relación",
  "stance.posted-about-me.opt.none": "Nada de esto — publica lo que quieras",
  /* children-online */
  "stance.children-online.opt.nothing": "Nada en absoluto, nunca",
  "stance.children-online.opt.private-only": "Solo en privado, a quien yo elija",
  "stance.children-online.opt.closed-account": "En una cuenta cerrada, nunca en una pública",
  "stance.children-online.opt.public-no-identifiers": "En público, sin cara y sin nombre",
  "stance.children-online.opt.public-open": "En público, como cualquier otra cosa",
  "stance.children-online.opt.undecided": "No lo tengo resuelto",
  /* group-chats */
  "stance.group-chats.opt.screenshots": "Capturas de mis mensajes",
  "stance.group-chats.opt.arguments": "Una discusión nuestra",
  "stance.group-chats.opt.health": "Cualquier cosa sobre mi salud",
  "stance.group-chats.opt.money": "Cualquier cosa sobre mi dinero",
  "stance.group-chats.opt.none": "Nada de esto — repite lo que quieras",
  /* passwords */
  "stance.passwords.opt.none": "Ninguna",
  "stance.passwords.opt.shared-accounts": "Solo las cuentas que ya compartimos",
  "stance.passwords.opt.shared-plus-passcode": "Esas, más el código de mi móvil",
  "stance.passwords.opt.emergency-all": "Todas, guardadas para una urgencia",
  "stance.passwords.opt.all-any-time": "Todas, para usarlas cuando quiera",
  "stance.passwords.opt.undecided": "No lo tengo decidido",
  /* location */
  "stance.location.opt.nobody": "Nadie, nunca",
  "stance.location.opt.only-when-i-send": "Solo cuando la mando yo",
  "stance.location.opt.travelling": "Una persona, cuando viajo o salgo hasta tarde",
  "stance.location.opt.one-person-always": "Una persona, siempre activada",
  "stance.location.opt.household-always": "Toda mi casa, siempre activada",
  "stance.location.opt.undecided": "No lo tengo decidido",
  /* reading-messages */
  "stance.reading-messages.opt.nobody": "Nadie, ni siquiera en una urgencia",
  "stance.reading-messages.opt.if-incapable": "Solo si no puedo responder por mí",
  "stance.reading-messages.opt.handed-over": "Solo lo que enseño yo al pasar el móvil",
  "stance.reading-messages.opt.ask-first": "Una persona, si me lo pide antes",
  "stance.reading-messages.opt.one-person-anytime": "Una persona, cuando quiera, sin preguntar",
  "stance.reading-messages.opt.undecided": "No lo tengo decidido",
  /* intimate-images */
  "stance.intimate-images.opt.none": "No debería existir ninguna",
  "stance.intimate-images.opt.deleted": "Hechas y borradas el mismo día",
  "stance.intimate-images.opt.my-device": "Solo en un aparato que controlo yo",
  "stance.intimate-images.opt.no-cloud": "En el aparato de cualquiera de los dos, nunca en la nube",
  "stance.intimate-images.opt.anywhere": "Donde sea, copias en la nube incluidas",
  "stance.intimate-images.opt.rather-not": "Prefiero no responder a esto",
  /* not-in-writing */
  "stance.not-in-writing.opt.apology": "Una disculpa que importa",
  "stance.not-in-writing.opt.end-of-argument": "El final de una discusión",
  "stance.not-in-writing.opt.health-news": "Malas noticias sobre la salud de alguien",
  "stance.not-in-writing.opt.money-decision": "Una decisión sobre dinero",
  "stance.not-in-writing.opt.criticism": "Cualquier crítica hacia mí",
  "stance.not-in-writing.opt.none": "Nada de esto — un mensaje vale",
  /* accounts-after-death */
  "stance.accounts-after-death.opt.nothing": "Nada — que se borre todo",
  "stance.accounts-after-death.opt.photographs": "Solo las fotos",
  "stance.accounts-after-death.opt.no-messages": "Todo menos mis mensajes privados",
  "stance.accounts-after-death.opt.as-it-is": "Todo, exactamente como está",
  "stance.accounts-after-death.opt.undecided": "No me lo he planteado",

  /* ── what a position rests on ─────────────────────────────────────── */
  "stance.work-after-hours.groundsPrompt": "¿De dónde sale esa norma sobre el trabajo por la tarde?",
  "stance.children-online.groundsPrompt": "¿De dónde sale ese límite para las fotos de tu hijo?",
  "stance.location.groundsPrompt": "¿De dónde sale esa postura sobre compartir tu ubicación?",
  "stance.reading-messages.groundsPrompt": "¿De dónde sale esa línea que trazas con tus mensajes?",
  "stance.intimate-images.groundsPrompt": "¿De dónde sale esa respuesta sobre esas fotos?",
  "stance.grounds.safety": "La seguridad, la mía o la de otra persona",
  "stance.grounds.consent": "Otra persona no ha dado su permiso",
  "stance.grounds.experience": "Algo que me pasó antes",
  "stance.grounds.privacy": "Querer que una parte de mi vida siga siendo mía",
  "stance.grounds.trust": "Lo que para mí significa la confianza",
  "stance.grounds.obligation": "Mi trabajo o la ley lo exigen",
  "stance.grounds.not-worked-out": "No lo tengo pensado",

  /* ── the playbook ─────────────────────────────────────────────────── */
  /* this is fine */
  "playbook.ok-phone-in-another-room": "Deja el móvil en otra habitación mientras comemos, sin anunciarlo — no lo leeré como un enfado.",
  "playbook.ok-glance-if-you-say-so": "Mira el móvil en la mesa si estás esperando algo — solo dime que lo esperas.",
  "playbook.ok-phone-out-at-dinner": "Usa el móvil en la mesa sin mirarme antes la cara — de verdad que no me molesta.",
  "playbook.ok-one-line-holds-it": "Mándame una línea diciendo que aún no puedes contestar bien; eso cuenta como respuesta.",
  "playbook.ok-reply-tomorrow": "Deja mi mensaje para mañana si estás sin fuerzas; yo no he estado contando las horas.",
  "playbook.ok-silence-costs-nothing": "Tarda lo que quieras en contestar, y no empieces pidiendo perdón por haber tardado.",
  "playbook.ok-send-what-cannot-wait": "Escríbeme fuera de horario si de verdad no aguanta hasta mañana.",
  "playbook.ok-take-the-work-call": "Coge la llamada del trabajo por la tarde, siempre que me digas que es del trabajo.",
  "playbook.ok-post-me-unasked": "Publica la foto en la que salgo si te gusta — no hace falta que me lo consultes.",
  "playbook.ok-send-child-photos-privately": "Manda las fotos de nuestro hijo directamente a quien las quiera ver, en vez de publicarlas.",
  "playbook.ok-ask-the-child": "Enséñale la foto a nuestro hijo antes de subirla, y acepta un no sin discutírselo.",
  "playbook.ok-tell-your-friends": "Cuéntales a tus amistades que hemos discutido si te ayuda — prefiero eso a que te lo quedes dentro.",
  "playbook.ok-use-shared-logins": "Entra en las cuentas que compartimos sin preguntármelo cada vez.",
  "playbook.ok-use-my-passcode": "Usa el código de mi móvil si no me localizas y hay algo que hacer de verdad.",
  "playbook.ok-location-when-travelling": "Activa mi ubicación mientras viajo, y vuelve a apagarla cuando esté en casa.",
  "playbook.ok-check-my-location": "Mira mi ubicación cuando quieras — para eso la tengo puesta.",
  "playbook.ok-open-my-phone-if-i-cannot": "Entra en mi móvil si estoy en el hospital y no puedo cogerlo yo.",
  "playbook.ok-read-the-handed-phone": "Lee lo que sea de mi móvil una vez te lo he pasado — no necesito quedarme mirando.",
  "playbook.ok-delete-on-request": "Pídeme que borre una foto tuya y cuenta con que estará borrada ese mismo día, sin discusión.",
  "playbook.ok-call-instead-of-typing": "Llámame en vez de escribirlo si lo que tienes que decir son malas noticias sobre la salud de alguien.",
  "playbook.ok-message-is-fine": "Mándalo por mensaje si te resulta más fácil; nada de esto hay que decirlo en voz alta.",
  "playbook.ok-name-me-legacy-contact": "Ponme como contacto de legado en tu móvil y en tu correo, para que nadie tenga que pelearse luego con un teléfono de atención.",
  /* this is not */
  "playbook.no-phone-at-the-table": "No traigas el móvil a la mesa, punto — ni boca abajo ni en silencio.",
  "playbook.no-scroll-mid-sentence": "No te pongas a deslizar la pantalla mientras estoy a media frase, aunque me sigas escuchando.",
  "playbook.no-day-long-silence": "No dejes una pregunta directa sin respuesta todo el día sin una línea diciendo por qué.",
  "playbook.no-work-in-the-evening": "No contestes un mensaje de trabajo por la tarde; seguirá ahí mañana.",
  "playbook.no-work-unless-it-burns": "No me mandes trabajo fuera de horario si no es cosa de llamar por teléfono.",
  "playbook.no-post-me-unasked": "No publiques una foto en la que salgo sin preguntarme antes, ni siquiera en una historia que desaparece.",
  "playbook.no-name-me-in-public": "No escribas mi nombre completo en una publicación pública, ni en un agradecimiento.",
  "playbook.no-post-where-i-am": "No publiques dónde estoy mientras sigo estando ahí.",
  "playbook.no-announce-my-relationship": "No anuncies nada sobre mi relación antes de que lo haya hecho yo.",
  "playbook.no-child-at-all": "No publiques nada de nuestro hijo en ningún sitio, ni donde solo hay gente de confianza.",
  "playbook.no-child-face-public": "No pongas la cara de nuestro hijo en una cuenta pública — ni una vez, ni con una foto buena.",
  "playbook.no-child-school-or-uniform": "No publiques nada que diga el colegio de nuestro hijo ni que enseñe su uniforme.",
  "playbook.no-child-embarrassment": "No publiques a nuestro hijo llorando o en plena regañina, ni siquiera como broma sobre lo que es criar.",
  "playbook.no-screenshot-into-group": "No pases capturas de mis mensajes a un grupo, por buena que fuera la frase.",
  "playbook.no-argument-into-group": "No le cuentes al grupo una discusión en la que todavía estamos metidos.",
  "playbook.no-health-into-group": "No cuentes nada de mi salud, ni a gente que solo se preocuparía con buena intención.",
  "playbook.no-money-into-group": "No repitas a nadie lo que gano ni lo que debo, en ningún chat.",
  "playbook.no-shared-logins-in-my-name": "No abras una cuenta a mi nombre y te quedes tú la contraseña.",
  "playbook.no-check-instead-of-asking": "No mires mi ubicación para saber dónde estoy en lugar de preguntármelo.",
  "playbook.no-read-while-i-shower": "No leas mis mensajes mientras me ducho, aunque el móvil esté ahí desbloqueado.",
  "playbook.no-intimate-photos-at-all": "No me hagas fotos íntimas, por muy a salvo que fueras a guardarlas.",
  "playbook.no-cloud-backup-of-photos": "No guardes fotos íntimas mías en nada que se sincronice con la nube.",
  "playbook.no-ending-arguments-by-text": "No termines una discusión por mensaje — acábala en voz alta o déjala abierta hasta que podamos.",
  "playbook.no-criticism-by-text": "No me digas por mensaje lo que he hecho mal; dímelo a la cara.",
  "playbook.no-money-by-text": "No cierres una decisión sobre dinero en un hilo de mensajes.",
  "playbook.no-reading-my-messages-after": "No leas mis mensajes privados cuando muera, te quedes con lo que te quedes de lo demás.",

  /* ── the instruction sheet ─────────────────────────────────────
     Seven headings, on the four channels the spec declares — not the four
     sections, which are the order the questions are asked in. A card is what
     somebody checks before they post, answer or put a phone down.

     Three of the twelve are restrictive multis, and a card prints a title and
     a body and nothing else: no prompt travels with the answer. So the title
     carries the direction the option label cannot. «Una disculpa que importa»
     is a thing that must never arrive as a message, and under a heading that
     did not say so it would read as its opposite — which is why «card.spoken»
     states the prohibition in full and «card.posting» is headed «antes». */
  "card.answering": "En cuánto contesto, y cuándo me localiza el trabajo",
  "card.together": "El móvil cuando estamos juntos",
  "card.photographs": "Fotos íntimas",
  "card.posting": "Antes de publicar o repetir nada",
  "card.open": "Qué está abierto, y para quién",
  "card.afterwards": "Lo que queda después",
  "card.spoken": "Lo que no debe llegar nunca por mensaje",

  /* ── the result page ───────────────────────────────────────────
     A label over the grounds, and the two lists the weights make. The headings
     are statements about the reader's own numbers and never about what they
     have «permitido» or «acordado» — three of the twelve answers are lists of
     things that may not happen, and a caption in the permissive direction
     would print them as their opposite. Nothing here mentions phubbing,
     sharenting or digital legacy: the hedged version of what that research
     supports is in the sourceNote, which the result page already draws under
     this one. */
  "view.rests": "Se apoya en:",
  "view.heaviest.title": "A lo que más peso le has dado",
  "view.heaviest.note": "Ocho o más sobre diez. Aquí no se suma nada ni se compara con nadie: es donde has dicho que hay menos margen, que es justo lo que necesita saber alguien antes de meterse en una de estas.",
  "view.lightest.title": "A lo que menos peso le has dado",
  "view.lightest.note": "Tres o menos sobre diez. Eso no es lo mismo que no tener postura: es que dices que aquí hay margen para moverse, y para quien lea esto vale tanto como la lista de arriba.",
};
