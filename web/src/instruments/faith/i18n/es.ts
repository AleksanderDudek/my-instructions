/**
 * Faith — Spanish.
 *
 * Written for somebody thinking in Spanish rather than transposed clause by
 * clause from the English. Two consequences worth naming.
 *
 * The reader's gender is unknown and so is the gender of whoever they hand the
 * playbook to, so no line makes either of them agree with an adjective they
 * did not choose. Where the English leaned on a participle the Spanish uses a
 * verb: "I would rather answer than be protected from it" is
 * "Prefiero responder a que me protejan de ello".
 *
 * And the register is deliberately plain rather than devotional. Spanish has a
 * ready-made religious vocabulary that would make every option sound like it
 * came from one confession, so the words here are the ones a person uses at a
 * kitchen table: "rezar" rather than "orar", "un oficio" rather than "un culto",
 * "la Escritura" rather than "la Palabra". Somebody who has never held a faith
 * has to be able to read all sixty-five options without being addressed as a
 * lapsed member of anything.
 *
 * Where a year appears it is a plain year of our Lord with nothing set beside it.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Fe",
  "tagline": "Doce posturas sobre lo que sostienes, el peso que le das y aquello en lo que se apoya.",
  "framework": "Doce posturas declaradas — nada se califica y nada se puntúa",
  "sourceNote": "Detrás de este instrumento no hay ningún cuestionario validado, y no hace falta. La investigación sobre religiosidad aportó un mapa del tema y nada más: las cinco dimensiones de Glock de 1962 (creencia, práctica, experiencia, conocimiento, consecuencias), la observación de Davie en 1994 de que creer y pertenecer se separan, y el constructo de centralidad de Huber y Huber de 2012 son la razón de que estos doce bloques se agrupen en lo que se sostiene, lo que se practica, de dónde viene y qué toca. La Escala de Centralidad de la Religiosidad, el Duke University Religion Index, la escala de orientación religiosa de Allport y Ross, el Religious Commitment Inventory-10, el cuestionario de fuerza de la fe de Santa Clara y la medida Fetzer/NIA se leyeron todos; ninguno de sus ítems aparece aquí. Leerlos es además la razón de que falten dos preguntas que llevaba un borrador anterior. Una escalera de frecuencia de asistencia es la forma del primer ítem del DUREL y del ítem de práctica pública de la CRS, así que este instrumento pregunta dónde perteneces en lugar de cada cuánto vas. Una pregunta sobre qué decide el bien y el mal es la forma de un ítem de Pew, y además repetía el vocabulario de apoyos que ya corre bajo cada bloque, así que se cortó en vez de reescribirse. Nada se puntúa. No hay una medida de devoción ni una medida de ortodoxia, y tampoco hay coeficiente de fiabilidad ni estructura factorial, porque una postura que declaras no los tiene ni los necesita: nadie te está situando frente a una muestra, estás escribiendo lo que sostienes y aquello en lo que crees que se apoya. Todo bloque que da por supuesta una creencia lleva una opción que rechaza el supuesto, de modo que el formulario se recorre entero igual para quien sostiene una fe con firmeza, para quien la ha dejado y para quien nunca tuvo ninguna, y ninguna de esas tres respuestas se trata como la incompleta. Ningún bloque pregunta por nadie más que por ti: aquí no hay ninguna pregunta que obligue a quien responde solo a inventarse una pareja.",

  /* ── las cinco secciones ───────────────────────────────────────────── */
  "section.belief.title": "Lo que se sostiene",
  "section.belief.note": "Dios, la muerte y el sufrimiento. En esta página no hay respuesta ortodoxa y nada de lo que hay aquí se califica.",
  "section.practice.title": "Práctica y pertenencia",
  "section.practice.note": "Una pregunta es cuándo fue la última vez. La otra es dónde perteneces. Ninguna se suma a la otra y ninguna mide devoción.",
  "section.lineage.title": "De dónde viene y adónde va",
  "section.lineage.note": "La distancia entre cómo te criaron y dónde estás hoy, lo que querrías transmitir, y lo que debe ocurrir el día en que ya no puedas decirlo.",
  "section.consequences.title": "Lo que toca",
  "section.consequences.note": "El dinero y el tiempo. Una creencia aparece en un extracto bancario y en un calendario o no aparece, y eso es un hecho sobre una casa, no sobre un alma.",
  "section.edges.title": "Los bordes",
  "section.edges.note": "Lo que no tiene juego y lo que sigue abierto. Quien tenga esta hoja en la mano necesita la segunda lista tanto como la primera.",

  /* ── lo que se sostiene ────────────────────────────────────────────── */
  "stance.god.prompt": "¿Qué es Dios para ti?",
  "stance.god.opt.close": "Alguien a quien hablo y que me oye",
  "stance.god.opt.distant": "Alguien real de quien no me siento cerca",
  "stance.god.opt.impersonal": "Una palabra para algo que no sé nombrar",
  "stance.god.opt.untrue": "Una idea que no creo verdadera",
  "stance.god.opt.open": "Una pregunta que dejo abierta",
  "stance.god.opt.rather-not": "Prefiero no decirlo",
  "stance.god.groundsPrompt": "¿En qué se apoya lo que sostienes sobre Dios?",

  "stance.after-death.prompt": "¿Qué crees que pasa después de morir?",
  "stance.after-death.opt.life-with-god": "La vida sigue en la presencia de Dios",
  "stance.after-death.opt.another-life": "Otra vida, vivida de nuevo",
  "stance.after-death.opt.something": "Algo sigue, aunque no sabría decir qué",
  "stance.after-death.opt.nothing": "No sigue nada",
  "stance.after-death.opt.not-worked-out": "No lo tengo resuelto",
  "stance.after-death.opt.rather-not": "Prefiero no decirlo",
  "stance.after-death.groundsPrompt": "¿En qué se apoya esa respuesta sobre la muerte?",

  "stance.suffering.prompt": "¿Por qué crees que hay sufrimiento?",
  "stance.suffering.opt.reason-i-trust": "Se permite por una razón en la que confío",
  "stance.suffering.opt.reason-unknown": "Se permite y no sé por qué",
  "stance.suffering.opt.no-one-allows": "Nadie lo permite — sencillamente ocurre",
  "stance.suffering.opt.people-do-it": "Es lo que la gente se hace entre sí",
  "stance.suffering.opt.not-worked-out": "No lo tengo resuelto",
  "stance.suffering.opt.rather-not": "Prefiero no decirlo",
  "stance.suffering.groundsPrompt": "¿En qué se apoya esa respuesta sobre el sufrimiento?",

  /* ── práctica y pertenencia ────────────────────────────────────────── */
  "stance.prayer-last.prompt": "¿Cuándo rezaste a solas por última vez?",
  "stance.prayer-last.opt.today": "Hoy",
  "stance.prayer-last.opt.this-week": "En la última semana",
  "stance.prayer-last.opt.this-year": "En el último año",
  "stance.prayer-last.opt.longer-ago": "Hace más tiempo que eso",
  "stance.prayer-last.opt.never": "Nunca, que yo sepa",
  "stance.prayer-last.groundsPrompt": "¿En qué se apoya tu práctica de la oración?",

  "stance.belonging.prompt": "¿Dónde perteneces dentro de lo que crees?",
  "stance.belonging.opt.known-by-name": "Una comunidad que me conoce por mi nombre",
  "stance.belonging.opt.a-face": "Una comunidad donde soy una cara, no un nombre",
  "stance.belonging.opt.people-not-institution": "Gente con la que practico, fuera de toda institución",
  "stance.belonging.opt.tradition-only": "Una tradición, sin un grupo de personas",
  "stance.belonging.opt.nowhere-content": "En ningún sitio, por elección",
  "stance.belonging.opt.nowhere-missed": "En ningún sitio, aunque me gustaría",
  "stance.belonging.groundsPrompt": "¿En qué se apoya tu pertenencia?",

  /* ── de dónde viene y adónde va ────────────────────────────────────── */
  "stance.raised-vs-now.prompt": "¿Qué cambió entre tu crianza y hoy?",
  "stance.raised-vs-now.opt.stayed": "Nada — sostengo aquello en lo que me criaron",
  "stance.raised-vs-now.opt.stayed-differently": "La misma fe, sostenida de otro modo que el enseñado",
  "stance.raised-vs-now.opt.left": "La he dejado y hoy no sostengo ninguna fe",
  "stance.raised-vs-now.opt.found": "Sostengo una fe en la que no me criaron",
  "stance.raised-vs-now.opt.none-either-way": "Ninguna fe entonces, ninguna ahora",
  "stance.raised-vs-now.opt.still-moving": "Sigo en movimiento",
  "stance.raised-vs-now.groundsPrompt": "¿En qué se apoya el lugar donde estás hoy?",

  "stance.children-taught.prompt": "¿Qué debe aprender sobre la fe un niño a tu cargo?",
  "stance.children-taught.opt.raised-in-it": "Criarse en mi fe, por defecto",
  "stance.children-taught.opt.taught-then-choose": "Aprender mi fe y luego elegir libremente",
  "stance.children-taught.opt.several": "Aprender sobre varias fes, sin privilegiar ninguna",
  "stance.children-taught.opt.none-unless-asked": "Nada religioso mientras no lo pida",
  "stance.children-taught.opt.undecided": "No lo tengo decidido",
  "stance.children-taught.groundsPrompt": "¿En qué se apoya esa respuesta sobre un niño?",

  "stance.funeral.prompt": "¿Qué debe pasar en tu propio funeral?",
  "stance.funeral.opt.full-rite": "El rito de mi fe, completo",
  "stance.funeral.opt.simple-rite": "Un oficio religioso, breve",
  "stance.funeral.opt.words-not-religious": "Palabras sobre mí, ninguna religiosa",
  "stance.funeral.opt.nothing-religious": "Nada religioso de ningún tipo",
  "stance.funeral.opt.whatever-comforts": "Lo que consuele a quienes estén allí",
  "stance.funeral.opt.undecided": "No lo tengo decidido",
  "stance.funeral.groundsPrompt": "¿En qué se apoya esa respuesta sobre tu funeral?",

  /* ── lo que toca ───────────────────────────────────────────────────── */
  "stance.money-use.prompt": "¿Dónde aparece tu creencia en tu dinero?",
  "stance.money-use.opt.fixed-share": "Una parte fija de mis ingresos se da",
  "stance.money-use.opt.give-when-asked": "Doy cuando me lo piden, sin parte fija",
  "stance.money-use.opt.wont-earn": "Hay dinero que no ganaré",
  "stance.money-use.opt.wont-spend": "Hay dinero que no gastaré",
  "stance.money-use.opt.touches-nothing": "No toca nada de mi dinero",
  "stance.money-use.opt.not-thought": "No lo he pensado",
  "stance.money-use.groundsPrompt": "¿En qué se apoya esa respuesta sobre tu dinero?",

  "stance.work-rest.prompt": "¿Hay un tiempo que tu creencia deja libre de trabajo?",
  "stance.work-rest.opt.whole-day": "Sí, un día entero que dejo libre",
  "stance.work-rest.opt.part-day": "Sí, parte de un día",
  "stance.work-rest.opt.in-principle": "En principio, aunque no lo consigo",
  "stance.work-rest.opt.no-but-rest": "No, aunque descanso por otras razones",
  "stance.work-rest.opt.no": "No",
  "stance.work-rest.groundsPrompt": "¿En qué se apoya esa respuesta sobre tu tiempo?",

  /* ── los bordes ────────────────────────────────────────────────────── */
  "stance.non-negotiable.prompt": "En la fe, ¿a qué te negarías a renunciar?",
  "stance.non-negotiable.opt.children": "A cómo se cría a los niños a mi cargo",
  "stance.non-negotiable.opt.practice": "A practicar, incluso donde no gusta",
  "stance.non-negotiable.opt.saying-so": "A decir lo que creo cuando me lo preguntan",
  "stance.non-negotiable.opt.belonging": "A seguir con la gente con la que me reúno",
  "stance.non-negotiable.opt.left-alone": "A que me dejen en paz con esto",
  "stance.non-negotiable.opt.nothing": "Nada de esto está fuera de discusión",
  "stance.non-negotiable.groundsPrompt": "¿En qué se apoya esa negativa?",

  "stance.unsettled.prompt": "¿Sobre qué tienes dudas de verdad?",
  "stance.unsettled.opt.god-exists": "Sobre si hay un Dios siquiera",
  "stance.unsettled.opt.after-death": "Sobre qué pasa después de la muerte",
  "stance.unsettled.opt.suffering": "Sobre por qué se permite el sufrimiento",
  "stance.unsettled.opt.tradition-right": "Sobre si la tradición de la que vengo acierta",
  "stance.unsettled.opt.own-honesty": "Sobre si lo creo o solo mantengo la costumbre",
  "stance.unsettled.opt.nothing-unsure": "Ninguna de estas está abierta para mí",
  "stance.unsettled.groundsPrompt": "¿En qué se apoya esa incertidumbre?",

  /* ── en qué se apoya ───────────────────────────────────────────────
     Un solo vocabulario bajo las doce preguntas. "La Escritura" tiene que ser
     la misma palabra bajo cada una, o dos respuestas no pueden leerse como el
     mismo apoyo. */
  "stance.grounds.scripture": "La Escritura",
  "stance.grounds.church": "La enseñanza de mi iglesia",
  "stance.grounds.reason": "La razón y el argumento",
  "stance.grounds.experience": "Algo que he vivido",
  "stance.grounds.upbringing": "Cómo me criaron",
  "stance.grounds.people": "Gente en la que confío",
  "stance.grounds.not-worked-out": "No lo tengo resuelto",

  /* ── frases para entregar ──────────────────────────────────────────
     Segunda persona, completas, entregables a alguien sin retocarlas. */
  /* esto está bien */
  "playbook.ok-call-me-on-the-day": "Puedes llamarme el día que dejo libre si de verdad pasa algo. Prefiero que me llames.",
  "playbook.ok-pray-around-me": "Puedes seguir hablando y moviéndote a mi alrededor mientras rezo. No hace falta que la habitación calle.",
  "playbook.ok-ask-me-straight": "Puedes preguntarme directamente si lo creo. Tendrás una respuesta sencilla y no será larga.",
  "playbook.ok-say-i-dont-look-it": "Puedes decirme que no parezco alguien que cree esto. Sé cómo se ve. Aun así es cierto.",
  "playbook.ok-say-grace": "Puedes bendecir la mesa en tu casa conmigo sentado allí. Me callaré y no me cuesta nada.",
  "playbook.ok-invite-me-anyway": "Puedes invitarme a un oficio por tu boda o por el bautizo de tu hijo. Iré.",
  "playbook.ok-ask-me-along": "Puedes pedirme que te acompañe. Preguntar una segunda vez está bien, no lo evito a propósito.",
  "playbook.ok-name-the-old-parish": "Puedes nombrar la iglesia de mi infancia sin bajar la voz. No es una herida.",
  "playbook.ok-answer-my-kids-honestly": "Puedes responder con honestidad a mis hijos sobre lo que crees, también donde no coincidas conmigo.",
  "playbook.ok-take-them-along": "Lleva a un niño contigo adonde vayas. Quiero que lo haya visto antes de tener edad de elegir.",
  "playbook.ok-ask-what-i-give": "Puedes preguntarme cuánto doy y quién lo recibe. La cifra no es un secreto.",
  "playbook.ok-call-out-the-slip": "Puedes señalarme que dije que dejaría ese tiempo libre y luego trabajé de principio a fin. Es justo.",
  "playbook.ok-plain-speech-about-death": "Puedes hablar de la muerte de alguien delante de mí sin buscar una fórmula. El habla llana me resulta más fácil.",
  "playbook.ok-bring-hard-questions": "Puedes traerme la pregunta más difícil que tengas sobre el sufrimiento. No voy a defender nada.",
  "playbook.ok-ask-in-public": "Puedes preguntarme delante de otros qué creo. Prefiero responder a que me protejan de ello.",
  /* esto no */
  "playbook.no-small-work-messages": "No me mandes mensajes de trabajo el día que dejo libre, ni siquiera los cortos.",
  "playbook.no-phase-talk": "No describas mi oración como un estado de ánimo o una etapa que estoy pasando.",
  "playbook.no-praying-over-me": "No reces sobre mí sin preguntarme antes.",
  "playbook.no-treating-it-as-taste": "No trates lo que sostengo como una preferencia mía en lugar de una afirmación que creo verdadera.",
  "playbook.no-fixing-the-distance": "No trates la distancia que siento con Dios como un problema que tengas que resolverme.",
  "playbook.no-you-will-return": "No me digas que volveré a esto cuando sea mayor. Ya lo he oído y llega como desprecio.",
  "playbook.no-unexamined-assumption": "No des por hecho que nunca lo he examinado solo porque me criaron en ello.",
  "playbook.no-service-detour": "No lleves a mis hijos al oficio de otra fe sin preguntarme antes.",
  "playbook.notok-baptism-without-me": "No bautices ni presentes a un niño sin que yo esté en la sala.",
  "playbook.no-filling-in-my-view": "No cuentes a la gente qué creo que pasa tras la muerte cuando alguien ha muerto. No lo tengo resuelto.",
  "playbook.no-supplying-the-reason": "No me des una razón de lo que pasó. Sostengo que la hay y que no me toca conocerla.",
  "playbook.no-raiding-the-giving": "No trates lo que doy como dinero que estaba disponible para otra cosa.",
  "playbook.no-improvising-the-funeral": "No improvises en mi funeral. El rito está escrito y quiero que se siga tal como está.",
  "playbook.no-doubt-as-ammunition": "No saques mis dudas en una discusión que va de otra cosa.",
  "playbook.no-deciding-without-me": "No decidas nada sobre la fe en que se crían mis hijos si yo no estoy en la sala.",

  /* ── la hoja impresa ───────────────────────────────────────────────
     Seis encabezados en tres canales. No son las secciones del formulario:
     esas son el orden en que se pregunta, y la hoja se consulta en mitad
     del día. */
  "card.holds": "Lo que sostengo y en qué se apoya",
  "card.belong": "Dónde pertenezco",
  "card.passed-on": "Los niños, mi funeral y mi dinero",
  "card.kept-clear": "El tiempo que mi creencia deja libre",
  "card.no-give": "A qué no renuncio",
  "card.still-open": "Lo que no tengo resuelto",

  /* ── la página de resultados ───────────────────────────────────────── */
  "view.rests": "Se apoya en:",
  "view.heaviest.title": "A lo que diste más peso",
  "view.heaviest.note": "Las preguntas a las que diste más peso. Aquí no se suma nada ni se compara con nadie — es donde dices que hay menos juego, y quien lea esta hoja necesita saberlo antes de entrar en una de ellas.",
  "view.lightest.title": "A lo que diste menos peso",
  "view.lightest.note": "Las respuestas con menos peso. No es lo mismo que no tener postura: es que dices que aquí hay margen para moverse, y para quien lea esta hoja eso vale tanto como la lista de arriba.",
};
