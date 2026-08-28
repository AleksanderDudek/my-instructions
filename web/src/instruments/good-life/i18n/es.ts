/**
 * good-life — Spanish.
 *
 * Written by somebody thinking in Spanish rather than transposed clause by
 * clause from the English, which is what §8 of the stated-positions design
 * asks for. Four things are worth naming.
 *
 * `tú` throughout, never `usted`, on the rule the shell states in its own
 * opening lines: the English is direct and slightly blunt, and `usted` would
 * turn a question about what a life should contain into a clinical form.
 *
 * No adjective agrees with the reader or with whoever they hand the sheet to.
 * Where the English leaned on a predicate that Spanish would gender the
 * Spanish uses a verb or a noun instead: "to stay healthy" is "para cuidar tu
 * salud" rather than a form that guesses, "willing to do" is "qué harías", and
 * "a single person with no dependants" is "una persona soltera y sin nadie a
 * cargo", where the agreement is with `persona` and not with the reader.
 *
 * Spanish runs about a fifth longer than English and the eighty-character gate
 * is measured on this string rather than on the one it came from, so the
 * twelve prompts and the four open questions were reached by asking the
 * question in Spanish rather than by reordering English clauses. The longest
 * lands at 63 characters. «What are you avoiding?» is four words in English
 * and «¿Qué estás evitando?» is three, which is the right direction: every
 * extra word there offers a way to answer a gentler question.
 *
 * The six `section.*.note` strings are rendered faithfully, jargon and file
 * paths included, because they are what the English shows its own reader — see
 * `components/runner/runner.tsx` and this instrument's `View.tsx`, both of
 * which draw them. They read as design memos rather than as copy, unlike every
 * other instrument in the app, and that is a fault in the English source. It is
 * fixed there or not at all: writing six reader-facing Spanish notes under six
 * English memos would hide the fault behind a locale nobody diffs.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Una buena vida",
  "tagline": "Doce posturas sobre lo que tendría dentro una vida que salió bien, y cuatro preguntas que solo lees tú.",
  "framework": "Doce posturas y cuatro preguntas abiertas — nada se puntúa",
  "sourceNote": "Detrás de este instrumento no hay ningún cuestionario y no hace falta que lo haya. La literatura sobre bienestar —las corrientes hedónica y eudaimónica, las seis dimensiones de Ryff, las tres necesidades de la teoría de la autodeterminación, el PERMA de Seligman, los once ámbitos de la OCDE— se leyó solo como una lista de lo que suele decirse que contiene una vida, y de ninguna de ellas se tomó nada: esos cuestionarios son de sus autores, varios exigen permiso por escrito y aquí no se reproduce ni se parafrasea ninguno. Una idea antigua y de dominio público sí se usa como marco y no como lista: que el trabajo puede sostenerse como un empleo, como una carrera o como una vocación. El cuestionario de investigación construido sobre esa idea no se usa ni se parafrasea. El único sitio donde la investigación dio forma a una pregunta, y no a una lista, es el último bloque cerrado, que pregunta qué lamentarías no haber hecho en lugar de qué lamentarías haber hecho, siguiendo el hallazgo de que a lo largo de una vida los arrepentimientos por lo que no se hizo duran más que los arrepentimientos por lo que se hizo —replicado después, con efectos más débiles y no en todos los estudios, así que léelo como la razón de que la pregunta vaya en esa dirección y no como un hecho sobre ti. Las cuatro preguntas del final no tienen opciones y no salen nunca de este dispositivo. Nada de esta página se puntúa, ni se clasifica en tramos, ni se pone frente a las respuestas de nadie. Lo que vuelve es lo que dijiste, en el orden del peso que le diste, y por eso las razones que escribes valen más que las opciones que marcas.",

  /* ── las secciones ─────────────────────────────────────────────────── */
  "section.work.title": "Para qué es el trabajo",
  "section.work.note": "Dos preguntas sobre para qué es el trabajo. Van primero porque es el asunto menos delicado de este instrumento y porque la respuesta cambia cómo se lee todo lo que viene después sobre el dinero. Una de las respuestas de la segunda renuncia a crecer, y cuenta igual que cualquier otra.",
  "section.money.title": "El dinero, y dónde está lo suficiente",
  "section.money.note": "Tres preguntas. En la primera puedes marcar hasta dos cosas, porque el dinero sirve de verdad a más de un fin a la vez. La segunda no pregunta por una cantidad, sino por qué tendría que ser cierto para que pararas. La tercera, hasta dónde puede llegar un riesgo dentro de tu vida.",
  "section.place.title": "Dónde, y quién está cerca",
  "section.place.note": "Dónde vives y quién está cerca se separan más a menudo de lo que parece: la ciudad puede estar decidida y quién está en ella no, o al revés. La primera pregunta mide una sola cosa, la distancia desde donde estás hoy. La segunda admite dos respuestas, y eso la vuelve una elección y no una lista.",
  "section.week.title": "El cuerpo y la semana",
  "section.week.note": "La primera pregunta es por lo que ya estás dejando, no por lo que pretendes: la intención va en el peso de debajo. La segunda mira al año que viene y nombra lo que cortarías primero.",
  "section.keep.title": "Lo que conservas, lo que debes",
  "section.keep.note": "La primera pregunta es la más dura y admite una sola respuesta a propósito: si valiera todo, todo el mundo se quedaría con todo, y eso no dice nada. La salud tiene que competir aquí con las personas con las que vives y con el control de tus horas. La segunda admite dos.",
  "section.later.title": "Mirando atrás desde los setenta",
  "section.later.note": "Una pregunta, la última con opciones. Ya has declarado once posturas antes de que se te pregunte qué ausencia escocería. «Ninguna de estas» es aquí una respuesta entera y no una salida.",
  "section.open.title": "Espacio abierto",
  "section.open.note": "Cuatro preguntas sin opciones. Lo que escribas no se puntúa, no se compara con nadie, no entra en ningún enlace y no llega a tu hoja de instrucciones: se queda en este dispositivo. La última tiene tres palabras porque cada palabra de más ofrecería una pregunta más suave que responder.",

  /* ── las preguntas ─────────────────────────────────────────────────── */
  "stance.work-purpose.prompt": "¿Para qué te sirve sobre todo tu trabajo?",
  "stance.learn-next.prompt": "¿En qué quieres ser visiblemente mejor dentro de diez años?",
  "stance.money-for.prompt": "¿Para qué te sirve sobre todo el dinero?",
  "stance.enough-point.prompt": "¿Qué tiene que ser cierto para que dejes de intentar ganar más?",
  "stance.risk-appetite.prompt": "¿Qué arriesgarías por un trabajo que de verdad quisieras?",
  "stance.live-where.prompt": "Dentro de diez años, ¿dónde quieres estar viviendo?",
  "stance.who-near.prompt": "¿Por quién te quedarías aquí?",
  "stance.health-effort.prompt": "¿Qué estás dejando ahora para cuidar tu salud?",
  "stance.less-of.prompt": "¿De qué quieres menos el año que viene?",
  "stance.keep-one.prompt": "Si solo pudieras conservar una de estas, ¿cuál sería?",
  "stance.owe-others.prompt": "¿Qué les debes a quienes no viven en tu casa?",
  "stance.regret-most.prompt": "A los setenta, ¿cuál de estas lamentarías no haber hecho?",

  /* ── lo que se puede responder ─────────────────────────────────────── */
  /* work-purpose */
  "stance.work-purpose.opt.income": "Pagar la vida que tengo fuera de él",
  "stance.work-purpose.opt.craft": "Llegar a dominar el oficio en sí",
  "stance.work-purpose.opt.service": "Serle útil a personas concretas",
  "stance.work-purpose.opt.standing": "Posición — que me tomen en serio",
  "stance.work-purpose.opt.structure": "Estructura. Llevo mal una semana sin horarios",
  "stance.work-purpose.opt.undecided": "No lo tengo resuelto",
  /* learn-next */
  "stance.learn-next.opt.trade": "El trabajo que ya hago",
  "stance.learn-next.opt.newskill": "Algo que todavía no he empezado a aprender",
  "stance.learn-next.opt.people": "Manejar a la gente, sobre todo en el conflicto",
  "stance.learn-next.opt.temper": "Mantener la cabeza cuando algo sale mal",
  "stance.learn-next.opt.nothing": "Nada. Quiero conservar lo que tengo y usarlo",
  "stance.learn-next.opt.unknown": "Todavía no lo sé",
  /* money-for */
  "stance.money-for.opt.safety": "Un colchón, para que nada me obligue a nada",
  "stance.money-for.opt.freedom": "Comprar la libertad de decir que no",
  "stance.money-for.opt.provide": "Mantener a quienes dependen de mí",
  "stance.money-for.opt.now": "Gastarlo ahora en cosas que voy a recordar",
  "stance.money-for.opt.give": "Darlo mientras puedo ver dónde cae",
  "stance.money-for.opt.undecided": "No lo tengo resuelto",
  /* enough-point */
  "stance.enough-point.opt.number": "Una cantidad concreta en el banco",
  "stance.enough-point.opt.nodebt": "Ninguna deuda de ningún tipo, la casa incluida",
  "stance.enough-point.opt.hours": "Cuando ganar más empiece a costarme tiempo que quiero",
  "stance.enough-point.opt.never": "Nada. No cuento con parar",
  "stance.enough-point.opt.already": "No hace falta que cambie nada. Ya tengo suficiente",
  "stance.enough-point.opt.unknown": "Nunca me he puesto un punto",
  /* risk-appetite */
  "stance.risk-appetite.opt.nothing": "Nada. Lo que estoy protegiendo es la estabilidad",
  "stance.risk-appetite.opt.months": "Unos meses de ahorro, no más que eso",
  "stance.risk-appetite.opt.savings": "Casi todo lo que tengo guardado",
  "stance.risk-appetite.opt.income": "Años de menos ingresos para la casa",
  "stance.risk-appetite.opt.house": "La casa y el nivel de vida que hay en ella",
  "stance.risk-appetite.opt.unsure": "No lo sé hasta tenerlo delante",
  /* live-where */
  "stance.live-where.opt.here": "Aquí. Este pueblo, quizá esta misma calle",
  "stance.live-where.opt.near": "A menos de una hora de aquí",
  "stance.live-where.opt.country": "En otro sitio de este país",
  "stance.live-where.opt.abroad": "En otro país",
  "stance.live-where.opt.movable": "En ningún sitio fijo. Quiero poder moverme",
  "stance.live-where.opt.undecided": "No lo tengo decidido",
  /* who-near */
  "stance.who-near.opt.partner": "La persona con la que vivo",
  "stance.who-near.opt.children": "Hijos, míos o niños que ayudo a criar",
  "stance.who-near.opt.parents": "Mis padres, mientras me necesiten",
  "stance.who-near.opt.friends": "Los amigos de siempre que están aquí",
  "stance.who-near.opt.community": "Un grupo de aquí al que acudo siempre",
  "stance.who-near.opt.nobody": "Nadie. Me iría",
  /* health-effort */
  "stance.health-effort.opt.nothing": "Nada, ahora mismo",
  "stance.health-effort.opt.sleep": "Las salidas de noche, para proteger el sueño",
  "stance.health-effort.opt.drink": "El alcohol, o alguna otra cosa que disfrutaba",
  "stance.health-effort.opt.training": "Dos o tres horas de entrenamiento a la semana",
  "stance.health-effort.opt.spend": "Dinero — comida, tratamientos, dentista",
  "stance.health-effort.opt.checks": "Tiempo — citas médicas antes de que duela nada",
  /* less-of */
  "stance.less-of.opt.hours": "Horas de trabajo",
  "stance.less-of.opt.obligations": "Compromisos que no elegí",
  "stance.less-of.opt.debt": "La deuda y lo que me obliga a aceptar",
  "stance.less-of.opt.screen": "Tiempo de pantalla en casa",
  "stance.less-of.opt.noise": "Ruido — gente, tráfico, desorden, interrupciones",
  "stance.less-of.opt.nothing": "Nada. El año tiene la forma que debe",
  /* keep-one */
  "stance.keep-one.opt.health": "Mi salud",
  "stance.keep-one.opt.people": "Las personas con las que vivo",
  "stance.keep-one.opt.voice": "Poder decir lo que de verdad pienso",
  "stance.keep-one.opt.time": "El control de mis propias horas",
  "stance.keep-one.opt.standard": "El nivel de vida que tengo ahora",
  "stance.keep-one.opt.unknown": "No he tenido que averiguarlo",
  /* owe-others */
  "stance.owe-others.opt.nothing": "Nada más allá de dejarlos en paz",
  "stance.owe-others.opt.money": "Una parte fija de lo que gano",
  "stance.owe-others.opt.time": "Horas — presentarme, llevar en coche, acompañar",
  "stance.owe-others.opt.parents": "Cuidar de mis padres cuando llegue el momento",
  "stance.owe-others.opt.useful-work": "Un trabajo útil más allá de lo que me paga",
  "stance.owe-others.opt.local": "Dar la cara por el sitio donde vivo",
  /* regret-most */
  "stance.regret-most.opt.children": "Tener hijos, o tener más",
  "stance.regret-most.opt.venture": "Empezar eso que llevo años planeando",
  "stance.regret-most.opt.place": "Vivir en otro sitio mientras aún podía",
  "stance.regret-most.opt.mend": "Arreglar una relación antes de que fuera tarde",
  "stance.regret-most.opt.body": "Cuidar mi cuerpo mientras todavía se recuperaba",
  "stance.regret-most.opt.none": "Ninguna de estas. No pienso así",

  /* ── frases para entregar ──────────────────────────────────────────── */
  /* esto está bien */
  "playbook.ok-harder-not-bigger": "Dame la versión más difícil del trabajo antes que la más grande.",
  "playbook.ok-money-not-title": "Págame por el trabajo de más en vez de ascenderme por él.",
  "playbook.ok-name-who-benefits": "Dime a quién ayuda esto de verdad y haré la parte aburrida.",
  "playbook.ok-give-me-fixed-hours": "Dame un horario fijo y haré mejor todo lo que quepa dentro.",
  "playbook.ok-stop-offering-growth": "Da por hecho que no busco un reto nuevo y deja de proponerme para uno.",
  "playbook.ok-put-me-in-hard-talks": "Méteme en la conversación difícil a propósito: estoy intentando mejorar en eso.",
  "playbook.ok-tell-me-when-i-snapped": "Dime cuándo he sido cortante contigo, el mismo día que pase.",
  "playbook.ok-ask-before-buffer": "Pregúntame antes de sacar nada de los ahorros: casi siempre voy a decir que sí.",
  "playbook.ok-shorter-week-first": "Ofréceme la semana más corta antes que el sueldo más alto.",
  "playbook.ok-book-it-now": "Reserva ya lo caro: prefiero pagarlo a esperarlo.",
  "playbook.ok-ask-me-for-something-specific": "Pídeme dinero para una cosa concreta y no para una causa.",
  "playbook.ok-no-is-not-modesty": "Créeme cuando digo que no quiero el puesto más grande: no es modestia.",
  "playbook.ok-price-it-in-hours": "Dime qué cuesta en horas ese dinero de más antes de pedirme que decida.",
  "playbook.ok-risk-stops-at-my-savings": "Tráeme el plan arriesgado mientras lo peor se quede en mis ahorros.",
  "playbook.ok-safe-version-first": "Tráeme primero la versión segura del plan y te escucharé de verdad.",
  "playbook.ok-ask-me-to-move": "Pídeme que me mude por algo que lo valga: no le tengo apego a esta dirección.",
  "playbook.ok-find-the-version-that-stays": "Busca la versión de esto que no me obligue a marcharme.",
  "playbook.ok-bring-me-the-other-city": "Tráeme el trabajo en otra ciudad: aquí no me retiene nadie.",
  "playbook.ok-dates-early-for-parents": "Dame las fechas pronto: organizo los fines de semana alrededor de mis padres.",
  "playbook.ok-early-not-late": "Ponme a primera hora de la mañana y no a última de la noche.",
  "playbook.ok-either-side-of-lunch": "Pon la reunión antes o después de comer: el mediodía es entrenamiento.",
  "playbook.ok-cut-something": "Quítame algo de la lista: prefiero hacer menos cosas y hacerlas bien.",
  "playbook.ok-ask-before-my-name": "Pregúntame antes de poner mi nombre en nada, aunque sea algo pequeño.",
  "playbook.ok-ask-what-i-think": "Pregúntame qué pienso de verdad mientras la decisión siga abierta.",
  "playbook.ok-deadline-not-hours": "Dame la fecha límite y déjame a mí las horas.",
  "playbook.ok-call-me-to-show-up": "Llámame cuando haya que llevar a alguien, recogerlo o acompañarlo.",
  "playbook.ok-tell-me-the-street-needs-it": "Dime cuando el barrio necesite algo y apareceré.",
  "playbook.ok-tell-me-about-the-opening": "Dime si te enteras de algo por lo que valga la pena dejar este trabajo.",
  "playbook.ok-say-if-i-have-gone-quiet": "Si me he callado con alguien, dímelo: prefiero que me lo digan.",
  "playbook.ok-leave-me-out-of-the-thread": "Sácame del grupo una semana y no leas nada en ello.",
  /* esto no */
  "playbook.not-reassign-my-work": "No le pases mi parte a alguien más rápido porque se haya movido la fecha.",
  "playbook.not-title-instead-of-money": "No me ofrezcas un cargo en lugar de dinero esperando que suene a premio.",
  "playbook.not-remove-the-hours": "No me quites el horario fijo y lo llames flexibilidad.",
  "playbook.not-unasked-development": "No me apuntes a formación que no he pedido.",
  "playbook.not-spend-the-buffer": "No gastes el dinero de emergencias en algo que no es una emergencia.",
  "playbook.not-assume-my-income": "No hagas planes contando con mis ingresos y me los cuentes después.",
  "playbook.not-tell-me-i-have-enough": "No me digas que ya tengo suficiente: ese juicio me toca a mí.",
  "playbook.not-laugh-at-the-target": "No trates como una broma la cifra a la que estoy ahorrando.",
  "playbook.not-stake-what-i-depend-on": "No metas nada de lo que dependo en un plan que no he aceptado.",
  "playbook.not-talk-me-out-of-it": "No me quites de la cabeza un riesgo que ya he decidido correr.",
  "playbook.not-assume-i-will-move": "No des por hecho que mudarme es la respuesta obvia cuando cambie el trabajo.",
  "playbook.not-assume-i-will-stay": "No des por hecho que dentro de cinco años seguiré viviendo aquí.",
  "playbook.not-book-my-parent-weekends": "No cierres el fin de semana sin preguntar si me necesitan en casa de mis padres.",
  "playbook.not-two-weekends-running": "No me pidas trabajar dos fines de semana seguidos: ya los llevo contados.",
  "playbook.not-press-the-drink": "No vuelvas a ofrecerme una copa después de que haya dicho que no una vez.",
  "playbook.not-joke-about-checkups": "No hagas broma de las revisiones: ir pronto no es hipocondría.",
  "playbook.not-volunteer-me": "No apuntes mi nombre a nada para contármelo después.",
  "playbook.not-message-me-late": "No me mandes mensajes de trabajo después de las nueve esperando respuesta.",
  "playbook.not-fill-my-calendar": "No me llenes la semana y luego preguntes por qué estoy cortante.",
  "playbook.not-every-evening-out": "No pongas algo cada tarde: quiero estar en casa.",
  "playbook.not-sign-me-up-locally": "No me apuntes a la colecta, a la comisión ni a la fiesta del barrio.",
  "playbook.not-joke-about-children": "No hagas bromas sobre si voy a tener hijos o no.",
  "playbook.not-ring-me": "No me llames cuando bastaba con un mensaje.",

  /* ── espacio abierto ───────────────────────────────────────────────── */
  "item.open-letter": "Una carta a ti a los setenta. ¿Qué debería ser verdad?",
  "item.open-five": "¿Qué única cosa haría que los próximos cinco años contaran?",
  "item.open-said": "¿Qué querrías que dijeran quienes mejor te conocieron?",
  "item.open-avoid": "¿Qué estás evitando?",

  /* ── la hoja impresa ───────────────────────────────────────────────
     Seis encabezados, en los cuatro canales que declara la especificación. No
     son las seis secciones: esas son el orden en que se pregunta, y una ficha
     es lo que alguien lee de una hoja impresa semanas después. Debajo de cada
     una van las palabras que eligió quien respondió y nada compuesto en su
     nombre, y las cuatro preguntas abiertas no producen ficha ninguna: la hoja
     es lo que se entrega, y «¿Qué estás evitando?» no lo es. */
  "card.work": "Para qué es el trabajo",
  "card.money": "El dinero, y dónde paro",
  "card.health": "Lo que dejo para cuidar mi salud",
  "card.less": "De lo que quiero menos",
  "card.place": "Dónde quiero estar, y por quién me quedaría",
  "card.keep": "Lo que conservaría, lo que debo y lo que lamentaría",

  /* ── la página de resultados ───────────────────────────────────────
     Dos listas de peso y la frase que va sobre ellas, y luego el único párrafo
     que este instrumento debe y ningún otro: qué no se hizo con las cuatro
     respuestas que nadie más verá jamás. Los encabezados son afirmaciones
     sobre los números de quien responde y nunca un veredicto sobre la vida que
     hay detrás. */
  "view.weightTitle": "Dónde cayó el peso",
  "view.weightNote": "Los dos extremos de los números que diste. Lo que pusiste entre cuatro y siete no falta: está arriba, en el orden en que se te preguntó.",
  "view.heaviestTitle": "A lo que diste más peso",
  "view.heaviestNote": "Ocho o más sobre diez. Son aquellas en las que equivocarse contigo sale más caro.",
  "view.lightestTitle": "A lo que diste menos peso",
  "view.lightestNote": "Tres o menos sobre diez. Aquí hay margen para moverse, que no es lo mismo que dar igual.",
  "view.openNote": "Estas cuatro son tuyas. Aquí no se puntuó nada, nada se puso frente a las respuestas de nadie y nada de esto entra en un enlace: está en esta página porque lo escribiste tú.",
};
