/**
 * before-marriage — Spanish.
 *
 * Key for key with `en.ts`, which is the source of truth; solo se escriben los
 * valores. Segunda persona `tú` en todo, como pide la nota al principio de
 * `src/i18n/messages/es.ts`: son quince preguntas sobre la casa de alguien y
 * sobre con quién se va a casar, y `usted` las convertiría en una entrevista.
 *
 * Escrito en español y no traído del inglés, como pide §8 del diseño de
 * posturas declaradas. Los enunciados no dejaban otra salida: el español corre
 * cerca de un quinto más largo y el listón de ochenta caracteres de
 * `test/i18n/readability.test.ts` no se mueve por eso, así que «¿Qué añade el
 * matrimonio que no dé ya vivir juntos?» es la pregunta del inglés alcanzada
 * preguntándola en español, no reordenando sus cláusulas. Los conectores
 * prohibidos en `es` son «, pero » y «; », y ninguno hace falta aquí: un
 * enunciado que pedía uno estaba preguntando dos cosas.
 *
 * ── Los dos bloques que había que pensar, no verter ────────────────────
 *
 * `place-type`. «A town» no parte el mapa en español. Un país donde se pasa de
 * la ciudad grande al pueblo casi sin escalón necesita sus propios tres
 * peldaños, así que aquí son la ciudad grande, la ciudad pequeña o el pueblo
 * grande, y el pueblo pequeño o el campo. Son tres vidas distintas, que es lo
 * que el bloque quiere separar, y no tres tamaños de censo.
 *
 * `parents-distance`. Las distancias describen un mapa y el mapa cambia. «The
 * same town» se dice «en el mismo pueblo o ciudad» porque quien vive en una
 * capital no llamaría «town» a su barrio; y el último peldaño es «tan lejos que
 * haya que ir en avión», que es la frontera real y no una cifra de kilómetros
 * que cada uno mediría distinta.
 *
 * ── Vocabulario ───────────────────────────────────────────────────────
 *
 * «Tarde» y no «noche» para el `evening` que se cuenta por semanas: es el
 * hueco de después del trabajo, y «noche» arrastra en español una lectura que
 * el bloque no está preguntando. Las noches solo aparecen donde el inglés
 * cuenta camas fuera de casa, en `nights-away`.
 *
 * A quien te vas a casar se le llama «tu pareja». No es «cónyuge», que es la
 * palabra del registro civil, y no es un sustantivo que le adjudique un sexo.
 * Los adjetivos que describirían a quien responde se evitan por lo mismo: «No
 * es un enfado y no va contigo» y no una forma que adivine.
 *
 * Dos frases repiten a propósito las palabras de las otras tablas españolas,
 * porque quien hace dos de estos tests tiene que poder leer dos respuestas
 * como la misma respuesta: «No lo tengo resuelto» viene de `faith` y de
 * `money-management`, y «Alguien en quien confiemos los dos» de `family-plan`.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Antes de casarse",
  "tagline": "Quince posturas sobre los años que vienen después de la boda, cada una con el peso que le das.",
  "framework": "Quince posturas declaradas — los títulos de Gottman, ninguna de sus preguntas",
  "sourceNote": "Los cinco títulos que hay detrás de esto son de Gottman, y los títulos son la parte pública: el dinero, los planes de vida, la comunicación y el conflicto, los valores de fondo, y las expectativas y el compromiso son el asunto de una entrada de blog que puede leer cualquiera. De ellos no hay nada más aquí. Los cuestionarios y los mazos de cartas de Gottman tienen derechos de autor, se venden y se distribuyen bajo licencia, y ninguno se ha reproducido, parafraseado ni reconstruido: cada pregunta de arriba se escribió para esta aplicación. Faltan además tres de los cinco títulos, y faltan a propósito. El dinero se pregunta como es debido en Llevar el dinero, los hijos y todo lo que cuelga de ellos en El plan familiar, la creencia en Fe, y cómo discutes en Estilo de conflicto; volver a preguntarlos aquí habría dado quince preguntas cuya mayoría esta aplicación ya responde mejor en otro sitio. Lo que queda es justo la parte que no cubre nada más del catálogo: qué entiende cada uno por estar casados, cuánto de tu semana sigue siendo tuyo, y dónde os van a dejar vivir dos carreras. Falta una cosa que quizá esperabas. Aquí no se pregunta si la violencia terminaría un matrimonio. Preguntarlo sería pedirte que predigas tu propia conducta en una crisis que no has vivido, que es lo único que estos instrumentos no hacen nunca, y dejaría impresa en una hoja una respuesta que después podría usarse contra quien la escribió. Si esa pregunta está viva en tu caso, no es una pregunta para una página web. Si todavía no has hecho ninguno de estos, empieza por Conversaciones. Registra cuáles de estos asuntos no habéis sacado nunca los dos, que es un hallazgo más barato y más útil, y cambia lo que haces luego con este. Después este, y después Llevar el dinero y El plan familiar, que entran a fondo en los dos asuntos recortados aquí a conciencia. Sobre si algo de esto funciona: los dos mayores ensayos aleatorizados de educación para la pareja, Building Strong Families y Supporting Healthy Marriage, no encontraron ningún efecto sobre si las parejas seguían juntas, y el metaanálisis mejor hecho sobre educación prematrimonial encuentra que el efecto en la calidad de la relación no sobrevive a contar también los estudios sin publicar. Este instrumento no se ha probado nunca y no afirma nada. Registra lo que dijiste, cuánto pesa y por qué.",

  /* ── the sections ─────────────────────────────────────────────────── */
  "section.commitment.title": "Compromiso y expectativas",
  "section.commitment.note": "El quinto título de Gottman tomado al pie de la letra. Con qué se entra en un matrimonio, qué lo rompería y qué pasa cuando ninguno de los dos se mueve. Nada de aquí va sobre cómo discutís: de eso ya se ocupan Estilo de conflicto y Apego. Tampoco se pregunta aquí por la violencia, por una razón que la nota de procedencia dice sin rodeos.",
  "section.time.title": "Tiempo en común y tiempo aparte",
  "section.time.note": "También el quinto título. La vida en común frente al tiempo aparte, preguntado en números y en duraciones y no en sentimientos, porque el número es la parte cuya respuesta una persona sí se sabe. Las tardes que reclamas y las que dejas libres son una sola cuenta, así que se preguntan en la misma página.",
  "section.independence.title": "Amistades e independencia",
  "section.independence.note": "Lo que queda del quinto título: quién está ya dentro de tu círculo, qué pasa con la amistad que ya tienes, y qué no se junta con lo demás. Cada pregunta de aquí es una afirmación sobre tu propia vida y nunca una norma para la de otro: las normas para la otra persona viven en Límites.",
  "section.careers.title": "Carreras y mudanzas",
  "section.careers.note": "Del segundo título, los planes de vida, y solo de su parte de trabajo. Los hijos se fueron a El plan familiar, la religión a Fe y el dinero a Llevar el dinero, así que ninguno se pregunta aquí dos veces.",
  "section.settling.title": "Dónde echar raíces",
  "section.settling.note": "También de los planes de vida: asentarse. En qué clase de sitio esperas estar, a qué distancia de tus padres, y quién más acaba bajo el mismo techo. Nada más de esta aplicación pregunta nada de esto.",

  /* ── the questions ────────────────────────────────────────────────── */
  "stance.marriage-means.prompt": "¿Qué añade el matrimonio que no dé ya vivir juntos?",
  "stance.grounds-to-end.prompt": "¿Cuáles de estas romperían el matrimonio para ti?",
  "stance.final-say.prompt": "¿Quién tiene la última palabra si algo grande se atasca?",
  "stance.evenings-together.prompt": "¿Cuántas tardes a la semana quieres pasar con tu pareja?",
  "stance.alone-time.prompt": "¿Cuánto tiempo a solas necesitas en una semana normal?",
  "stance.holiday-apart.prompt": "¿Te irías de vacaciones sin tu pareja?",
  "stance.who-knows.prompt": "¿Quién ha oído la versión sincera de tu peor mes?",
  "stance.closest-friend.prompt": "¿Qué pasa con tu amistad más cercana cuando te cases?",
  "stance.kept-to-myself.prompt": "¿Cuáles de estas seguirían siendo solo tuyas al casarte?",
  "stance.career-lead.prompt": "Cuando dos carreras chocan, ¿cuál debería ir por delante?",
  "stance.relocation.prompt": "¿Te irías a vivir a otro país por el trabajo de tu pareja?",
  "stance.nights-away.prompt": "¿Cuántas noches al mes fuera por trabajo aceptarías?",
  "stance.place-type.prompt": "¿En qué clase de sitio esperas estar viviendo?",
  "stance.parents-distance.prompt": "¿A qué distancia de tus padres quieres vivir?",
  "stance.household-who.prompt": "¿Quién más podría acabar viviendo en tu casa?",

  /* ── what may be answered ─────────────────────────────────────────── */
  /* marriage-means */
  "stance.marriage-means.opt.permanence": "Deja fuera la opción de irse",
  "stance.marriage-means.opt.vow": "Es una promesa hecha ante Dios",
  "stance.marriage-means.opt.witnessed": "Se dice delante de testigos",
  "stance.marriage-means.opt.legal": "Cambia la situación legal",
  "stance.marriage-means.opt.nothing": "Nada que no tuviéramos ya",
  "stance.marriage-means.opt.unsure": "No lo tengo resuelto",
  /* grounds-to-end */
  "stance.grounds-to-end.opt.affair": "Una infidelidad física",
  "stance.grounds-to-end.opt.emotional": "Una infidelidad sin sexo de por medio",
  "stance.grounds-to-end.opt.money-lies": "Una deuda grande que se me ocultó",
  "stance.grounds-to-end.opt.addiction": "Una adicción que no se trata",
  "stance.grounds-to-end.opt.drift": "Años sin que ninguno de los dos lo intente",
  "stance.grounds-to-end.opt.none": "Ninguna de estas lo rompería",
  /* final-say */
  "stance.final-say.opt.stall": "Nadie. Nada se mueve hasta que estemos de acuerdo",
  "stance.final-say.opt.domain": "Quien lleve ese terreno",
  "stance.final-say.opt.cares-more": "Aquel a quien más le importe",
  "stance.final-say.opt.husband": "El marido",
  "stance.final-say.opt.outsider": "Alguien en quien confiemos los dos",
  "stance.final-say.opt.unsure": "No lo tengo resuelto",
  /* evenings-together */
  "stance.evenings-together.opt.nearly-all": "Casi todas",
  "stance.evenings-together.opt.most": "Cuatro o cinco",
  "stance.evenings-together.opt.some": "Dos o tres",
  "stance.evenings-together.opt.few": "Una, como mucho",
  "stance.evenings-together.opt.never-counted": "Nunca lo he pensado en números",
  /* alone-time */
  "stance.alone-time.opt.snatched": "Una hora suelta de vez en cuando",
  "stance.alone-time.opt.evening": "Una tarde para mí",
  "stance.alone-time.opt.day": "Casi un día entero",
  "stance.alone-time.opt.more": "Más de un día",
  "stance.alone-time.opt.none": "No necesito tiempo a solas",
  /* holiday-apart */
  "stance.holiday-apart.opt.yearly": "Sí, casi todos los años",
  "stance.holiday-apart.opt.sometimes": "Sí, de vez en cuando",
  "stance.holiday-apart.opt.reason": "Solo si hubiera un motivo para ello",
  "stance.holiday-apart.opt.no": "No",
  "stance.holiday-apart.opt.unsure": "No lo sé",
  /* who-knows */
  "stance.who-knows.opt.nobody": "Nadie",
  "stance.who-knows.opt.friend": "Una amistad cercana",
  "stance.who-knows.opt.parent": "Mi madre o mi padre",
  "stance.who-knows.opt.sibling": "Un hermano o una hermana",
  "stance.who-knows.opt.clergy": "Un sacerdote o un pastor",
  "stance.who-knows.opt.counsellor": "Mi terapeuta",
  /* closest-friend */
  "stance.closest-friend.opt.unchanged": "Sigue exactamente igual",
  "stance.closest-friend.opt.less-often": "Sigue, aunque nos veamos menos",
  "stance.closest-friend.opt.becomes-ours": "Pasa a ser una amistad de los dos",
  "stance.closest-friend.opt.fades": "Se va apagando, y me parece bien",
  "stance.closest-friend.opt.unsure": "No lo he pensado",
  /* kept-to-myself */
  "stance.kept-to-myself.opt.space": "Una habitación o un escritorio para mí",
  "stance.kept-to-myself.opt.evening": "Una tarde a la semana",
  "stance.kept-to-myself.opt.friend": "Una amistad que sigue siendo mía",
  "stance.kept-to-myself.opt.hobby": "Algo que hago yo y a lo que nadie se apunta",
  "stance.kept-to-myself.opt.quiet": "Horas en las que nadie me habla",
  "stance.kept-to-myself.opt.nothing": "Nada en absoluto",
  /* career-lead */
  "stance.career-lead.opt.mine": "La mía",
  "stance.career-lead.opt.spouse": "La de mi pareja",
  "stance.career-lead.opt.earner": "La de quien más gane en ese momento",
  "stance.career-lead.opt.loses-more": "La de quien más perdería al ceder",
  "stance.career-lead.opt.alternate": "Por turnos, a lo largo de los años",
  "stance.career-lead.opt.unsure": "No lo tengo resuelto",
  /* relocation */
  "stance.relocation.opt.yes": "Sí",
  "stance.relocation.opt.fixed-term": "Sí, si acordáramos una fecha de vuelta",
  "stance.relocation.opt.near-only": "Solo a un sitio del que pudiera volver fácil",
  "stance.relocation.opt.no": "No",
  "stance.relocation.opt.unsure": "No lo sé",
  /* nights-away */
  "stance.nights-away.opt.none": "Ninguna",
  "stance.nights-away.opt.up-to-three": "Hasta tres",
  "stance.nights-away.opt.up-to-week": "Hasta una semana",
  "stance.nights-away.opt.more": "Más de una semana",
  "stance.nights-away.opt.unsure": "No lo sé",
  /* place-type */
  "stance.place-type.opt.city": "Una ciudad grande",
  "stance.place-type.opt.town": "Una ciudad pequeña o un pueblo grande",
  "stance.place-type.opt.country": "Un pueblo pequeño o el campo",
  "stance.place-type.opt.indifferent": "Me da igual",
  "stance.place-type.opt.no-idea": "No tengo ni idea",
  /* parents-distance */
  "stance.parents-distance.opt.same-town": "En el mismo pueblo o ciudad",
  "stance.parents-distance.opt.hour": "A menos de una hora en coche",
  "stance.parents-distance.opt.hours": "A unas horas de camino",
  "stance.parents-distance.opt.flight": "Tan lejos que haya que ir en avión",
  "stance.parents-distance.opt.no-preference": "Me da igual",
  "stance.parents-distance.opt.na": "No es mi caso",
  /* household-who */
  "stance.household-who.opt.my-parent": "Uno de mis padres",
  "stance.household-who.opt.their-parent": "Uno de los padres de mi pareja",
  "stance.household-who.opt.sibling": "Un hermano o una hermana",
  "stance.household-who.opt.friend": "Una amistad en un mal momento",
  "stance.household-who.opt.lodger": "Alguien que nos pague un alquiler",
  "stance.household-who.opt.nobody": "Nadie aparte de los dos",

  /* ── the playbook ─────────────────────────────────────────────────── */
  /* this is fine */
  "playbook.ok-first-hour": "Déjame a mi aire la primera hora desde que entro por la puerta. No es un enfado y no va contigo.",
  "playbook.ok-book-tuesday": "Resérvate un martes para lo que quieras sin consultármelo antes.",
  "playbook.ok-week-away": "Vete una semana sin mí. No voy a leer nada en ello y no necesito que me tranquilices por eso.",
  "playbook.ok-one-friend-knows": "Da por hecho que alguien de mis amistades ha oído la versión sincera de una mala semana. Necesito a alguien de fuera de esto.",
  "playbook.ok-friend-stays": "Mi amistad más antigua sigue siendo mía. No tiene por qué caerte bien y no la voy a dejar de lado.",
  "playbook.ok-my-desk": "En esta casa hay un escritorio que es el mío. No lo recojas y no dejes tus cosas encima.",
  "playbook.ok-quiet-hours": "Deja en silencio la primera hora de la mañana. No es mal humor y no va contigo.",
  "playbook.ok-abroad-with-date": "Tráeme el trabajo en el extranjero si viene con fecha de vuelta. Con un plazo cerrado, mi respuesta es que sí.",
  "playbook.ok-send-the-listing": "Mándame la oferta del otro país. No lo digo de boquilla. Va en serio.",
  "playbook.ok-take-the-trip": "Déjame ir al viaje. Una semana fuera es lo normal en mi trabajo y no es que elija el trabajo antes que a ti.",
  "playbook.ok-your-turn": "Coge tú el ascenso esta vez. El siguiente es el mío. Quiero que eso quede dicho en voz alta desde ahora.",
  "playbook.ok-sunday-lunch": "Di que sí a los domingos en casa de mis padres casi todas las semanas. Estar cerca de ellos es algo que quiero de verdad.",
  "playbook.ok-ask-about-parent": "Pregúntame en serio por la posibilidad de que mi madre o mi padre vivan aquí, antes de descartarla.",
  "playbook.ok-bring-someone-in": "Trae a alguien en quien confiemos los dos cuando nos atasquemos. Eso no es pasar por encima de mí y no lo voy a tomar así.",
  /* this is not */
  "playbook.no-card-then-tell": "No metas algo grande en la tarjeta y me lo cuentes después. De esa es de la que no me recupero rápido.",
  "playbook.no-follow-me": "No me sigas a la otra habitación para terminar la conversación. Espera a que vuelva yo.",
  "playbook.no-fill-my-week": "No me llenes cuatro tardes de la semana sin consultarme antes. Necesito que la mayoría de las tardes sean nuestras.",
  "playbook.no-week-away": "No reserves una semana fuera sin mí. Me sentaría mal y prefiero decírtelo ahora antes que fingir lo contrario.",
  "playbook.no-tell-your-mother": "No le cuentes nuestras discusiones a tu madre. Lo que pasa entre nosotros no sale de casa.",
  "playbook.no-secret-friendship": "No mantengas viva una amistad de la que yo no puedo saber nada. El problema es el secreto y no la persona.",
  "playbook.no-decide-then-inform": "No decidas algo grande y me lo comuniques después. Nada se mueve hasta que estemos de acuerdo los dos de verdad.",
  "playbook.no-divorce-word": "No uses la palabra divorcio en una discusión. Ni una vez, ni como amenaza, ni para marcarte un tanto.",
  "playbook.no-move-for-your-job": "No aceptes una mudanza en mi nombre. Dónde vivimos va detrás de mi trabajo, y necesito que hayas oído eso antes de casarnos.",
  "playbook.no-apply-abroad": "No eches el currículum en otro país y me lo preguntes después. Yo no me voy al extranjero.",
  "playbook.no-overnight-work": "No me ofrezcas para nada que me tenga durmiendo fuera de casa. Ni una vez al mes, ni una vez al trimestre.",
  "playbook.no-move-us-to-a-field": "No nos lleves a un sitio donde necesite el coche para comprar el pan. Sé cómo acaba eso conmigo.",
  "playbook.no-near-parents": "No nos pongas en el mismo pueblo que tus padres ni que los míos. Quiero un trayecto en coche entre ellos y nosotros.",
  "playbook.no-spare-room": "No le ofrezcas la habitación de invitados a nadie sin habérmelo preguntado antes. Ni a tu hermano, ni por quince días.",

  /* ── the instruction sheet ─────────────────────────────────────
     Six headings, on the four channels the spec declares. Not the five
     sections: those are the order the questions are asked in, and a card is
     what somebody reads off a printed sheet. Every body under these is the
     reader's own chosen words and nothing composed for them. */
  "card.word": "Lo que añade la palabra",
  "card.mine": "Lo que sigue siendo mío",
  "card.roof": "Dónde vivimos, y quién más vive ahí",
  "card.breaking": "Qué lo rompería, y quién decide",
  "card.week": "Las tardes, y el tiempo aparte",
  "card.careers": "Dos carreras, y las mudanzas",

  /* ── the result page ───────────────────────────────────────────
     Two lists and the sentence over them. The headings are statements about
     the reader's own numbers and nothing else — no readiness, no agreement,
     no verdict on a marriage that has not happened. */
  "view.weightTitle": "Dónde cayó el peso",
  "view.weightNote": "Los pesos que pusiste, leídos por los dos extremos. Lo que dejaste entre cuatro y siete no falta: está arriba, en el orden en que se te preguntó.",
  "view.heaviestTitle": "A lo que más peso le diste",
  "view.heaviestNote": "Ocho o más sobre diez. Son aquellas en las que enterarse después es lo que más caro sale.",
  "view.lightestTitle": "A lo que menos peso le diste",
  "view.lightestNote": "Tres o menos sobre diez. Aquí hay margen para moverse, que no es lo mismo que dar igual.",
};
