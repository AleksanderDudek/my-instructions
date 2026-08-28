/**
 * Communication style — Spanish.
 *
 * Key for key with `en.ts`, which is the source of truth; only the values are
 * translated. Second person is `tú` throughout, per the note at the head of
 * `src/i18n/messages/es.ts`: the English is direct and slightly blunt, and
 * `usted` would make the same sentences sound like a form.
 *
 * Nothing describing the reader takes a gender. The options and playbook lines
 * are things a person says about themselves and hands to somebody else, and an
 * adjective that agrees would make them pick one to answer — so «I am upset»
 * is `me ha sentado mal` rather than `estoy dolido`, and «if you are annoyed»
 * is `si algo te ha molestado` rather than `si estás molesto`.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Estilo de comunicación",
  "tagline": "Doce peticiones sobre cómo quieres que se dirijan a ti, cada una con el peso que le das.",
  "framework": "Doce peticiones declaradas — ni tipo ni color",
  "sourceNote": "El vocabulario de los cuatro colores es muchísimo más antiguo que cualquiera de los productos que se venden bajo ese nombre. El esquema de los cuatro temperamentos viene de Galeno, los pares de funciones son de Jung, y los dos ejes que suelen dibujarse debajo — a qué ritmo y con cuánta fuerza empuja alguien, y si atiende primero a la tarea o a las personas que hay en la sala — están publicados abiertamente y no son de nadie. Lo que sí es de alguien es cada versión comercial: Insights Discovery y su rueda son de The Insights Group, DiSC es de John Wiley & Sons, SOCIAL STYLE es de TRACOM, True Colors es de True Colors International, y aquí no aparece ni un solo ítem, adjetivo, nombre de color o página de informe de ninguno de ellos, ni se ha reconstruido nada a partir de ellos. Cada pregunta de abajo se escribió para esta aplicación. Conviene decir con exactitud qué deja eso, porque los colores son la razón por la que estás leyendo esta nota y no están en el instrumento: nada de lo que respondas se suma, no se te sitúa en ninguno de los dos ejes, y al final no se te pone ningún color. Se hacen doce preguntas y las respuestas se devuelven ordenadas. Lo que sale no es un tipo ni una medición: es un registro de cómo has pedido que se dirijan a ti, y una petición no necesita pruebas detrás. Menos mal, porque no las hay: ningún hallazgo independiente revisado por pares muestra que dirigirse a alguien en su estilo declarado mejore nada, y la investigación bien diseñada que más se le acerca, la de ajustar la enseñanza a la preferencia de aprendizaje declarada, encontró que, en cuanto se puso a prueba, el efecto no estaba. Aun así, las respuestas valen la pena. Son una petición y no una predicción, y quien las lee puede atender una petición sin tener que creerse ninguna teoría.",

  /* ── the four sections ─────────────────────────────────────────── */
  "section.reaching.title": "Cómo llegar hasta mí",
  "section.reaching.note": "La mecánica del contacto: cómo se abre una conversación, si se puede interrumpir y qué hacer cuando se para. Nada de esto va de lo que dices. Todo va de cómo llegas.",
  "section.hard.title": "Cuando algo va mal",
  "section.hard.note": "El orden en que debe llegar una mala noticia, lo resuelto que tiene que estar un problema antes de que quieras que te lo cuenten, y qué tiene que contener una disculpa para que cuente.",
  "section.friction.title": "Cuando chocamos",
  "section.friction.note": "Que te corrijan, que te digan que se han enfadado contigo, y qué hace falta para que dejes estar una discusión. Tres cosas que suele zanjar en el momento quien se mueve primero.",
  "section.reading.title": "Leerme",
  "section.reading.note": "Qué significa tu silencio, cómo quieres que te pregunten y adónde tiene que ir a parar un elogio. Tres huecos que la otra persona rellenará por su cuenta si no se lo dices.",

  /* ── the twelve questions ──────────────────────────────────────── */
  "stance.small-talk.prompt": "¿Cuánta charla antes de que alguien vaya al grano?",
  "stance.interrupting.prompt": "¿Cuándo puede alguien interrumpirte a media frase?",
  "stance.no-reply.prompt": "¿Qué debe hacer alguien si llevas dos días sin responder?",
  "stance.bad-news.prompt": "¿Cómo debe alguien darte una mala noticia?",
  "stance.unfinished.prompt": "¿Cuándo debe alguien contarte un problema sin resolver?",
  "stance.apology.prompt": "¿Cómo debe alguien pedirte perdón?",
  "stance.public-correction.prompt": "¿Cómo debe alguien corregirte delante de otra gente?",
  "stance.upset-with-me.prompt": "¿Cómo debe alguien decirte que se ha enfadado contigo?",
  "stance.drop-it.prompt": "¿Qué necesitas para dejar estar una discusión?",
  "stance.going-quiet.prompt": "Te callas a media conversación. ¿Qué está pasando?",
  "stance.asked-if-wrong.prompt": "¿Cómo debe alguien preguntarte si te pasa algo?",
  "stance.praise.prompt": "¿Cómo debe alguien decirte que lo has hecho bien?",

  /* ── what may be answered ──────────────────────────────────────── */
  /* small-talk */
  "stance.small-talk.opt.none": "Al grano, sin preámbulos",
  "stance.small-talk.opt.aLine": "Un saludo de una línea y al grano",
  "stance.small-talk.opt.fewMinutes": "Unos minutos de charla normal primero",
  "stance.small-talk.opt.depends": "Depende de quién sea",
  /* interrupting */
  "stance.interrupting.opt.anyTime": "Cuando quiera — no pierdo el hilo",
  "stance.interrupting.opt.toBuild": "Solo para añadir algo a lo que digo",
  "stance.interrupting.opt.askFirst": "Solo si antes dice mi nombre",
  "stance.interrupting.opt.wait": "No hasta que yo termine",
  "stance.interrupting.opt.depends": "Depende del tema",
  /* no-reply */
  "stance.no-reply.opt.nudge": "Que lo mande otra vez — se me ha perdido",
  "stance.no-reply.opt.call": "Que me llame por teléfono",
  "stance.no-reply.opt.escalate": "Que diga que es urgente, si lo es",
  "stance.no-reply.opt.wait": "Que espere — ya me pondré con ello",
  "stance.no-reply.opt.assumeNo": "Que tome el silencio por un no",
  "stance.no-reply.opt.depends": "Depende de quién pregunte",
  /* bad-news */
  "stance.bad-news.opt.firstSentence": "Lo peor en la primera frase",
  "stance.bad-news.opt.shortWarning": "Un aviso breve y luego lo peor",
  "stance.bad-news.opt.contextFirst": "Primero el contexto, lo peor al final",
  "stance.bad-news.opt.writtenFirst": "Por escrito, para leerlo a solas",
  "stance.bad-news.opt.depends": "Depende de cuál sea la noticia",
  /* unfinished */
  "stance.unfinished.opt.atOnce": "En cuanto alguien lo sospeche",
  "stance.unfinished.opt.onceReal": "Cuando alguien tenga la certeza de que es real",
  "stance.unfinished.opt.withOptions": "Cuando haya al menos una opción",
  "stance.unfinished.opt.onceStuck": "Solo cuando no se pueda resolver sin mí",
  "stance.unfinished.opt.depends": "Depende de lo grande que sea",
  /* apology */
  "stance.apology.opt.named": "Diciendo exactamente qué ha hecho",
  "stance.apology.opt.said": "Una vez, con claridad, y a otra cosa",
  "stance.apology.opt.changed": "Diciendo qué cambia a partir de ahora",
  "stance.apology.opt.shown": "Haciendo algo al respecto",
  "stance.apology.opt.later": "Ahora no — dame un día",
  "stance.apology.opt.depends": "Depende de lo que haya hecho",
  /* public-correction */
  "stance.public-correction.opt.onTheSpot": "En voz alta, en el momento",
  "stance.public-correction.opt.withReason": "En voz alta, con el motivo",
  "stance.public-correction.opt.afterwards": "Ahí no — después, en privado",
  "stance.public-correction.opt.signal": "Una señal ahora, el detalle luego",
  "stance.public-correction.opt.depends": "Depende de cuánto importe",
  /* upset-with-me */
  "stance.upset-with-me.opt.named": "Dicho sin rodeos, en la primera frase",
  "stance.upset-with-me.opt.atOnce": "En el momento, antes de que se enfríe",
  "stance.upset-with-me.opt.nextDay": "Al día siguiente, ya en frío",
  "stance.upset-with-me.opt.inWriting": "Por escrito, para poder leerlo dos veces",
  "stance.upset-with-me.opt.askFirst": "Preguntando si es buen momento",
  "stance.upset-with-me.opt.depends": "Depende de qué se trate",
  /* drop-it */
  "stance.drop-it.opt.heard": "Haber dicho lo mío entero una vez",
  "stance.drop-it.opt.reason": "El razonamiento, no solo la decisión",
  "stance.drop-it.opt.decided": "Que alguien diga claro que está decidido",
  "stance.drop-it.opt.revisit": "Una fecha para volver a mirarlo",
  "stance.drop-it.opt.time": "Una hora a solas y nada más",
  "stance.drop-it.opt.unsure": "No sé qué hace falta para cerrarlo",
  /* going-quiet */
  "stance.going-quiet.opt.thinking": "Estoy averiguando qué pienso",
  "stance.going-quiet.opt.tooMuch": "Es más de lo que puedo asumir de golpe",
  "stance.going-quiet.opt.upset": "Me ha sentado mal y aún no me sale decirlo",
  "stance.going-quiet.opt.finished": "Ya he dicho lo que tenía que decir",
  "stance.going-quiet.opt.yourTurn": "Estoy esperando a la otra persona",
  "stance.going-quiet.opt.varies": "Varía — pregúntame",
  /* asked-if-wrong */
  "stance.asked-if-wrong.opt.straight": "Directamente, en el momento",
  "stance.asked-if-wrong.opt.named": "Nombrando lo que ha notado",
  "stance.asked-if-wrong.opt.later": "Más tarde, y una sola vez",
  "stance.asked-if-wrong.opt.alongside": "Mientras hacemos otra cosa, como pasear",
  "stance.asked-if-wrong.opt.notAtAll": "Que no pregunte — ya lo saco yo",
  /* praise */
  "stance.praise.opt.public": "En voz alta, delante de otra gente",
  "stance.praise.opt.private": "En voz baja, a solas",
  "stance.praise.opt.written": "Por escrito, para poder guardarlo",
  "stance.praise.opt.passedOn": "Que se lo diga a quien de verdad le importe",
  "stance.praise.opt.lightly": "Breve — sin darle bombo",
  "stance.praise.opt.unsure": "No lo he pensado",

  /* ── the playbook ──────────────────────────────────────────────── */
  /* this is fine */
  "playbook.ok.talk.straight": "Empieza por lo que necesitas. Con una línea de saludo sobra, y que falte no me parece descortesía.",
  "playbook.ok.talk.warmup": "Dedica unos minutos a charla normal antes de pedir. Esa es la forma de entrar, no tiempo perdido.",
  "playbook.ok.talk.ask": "Pregúntame si esta conversación necesita charla antes. Cambia según quién pregunte y te lo diré.",
  "playbook.ok.cutin.add": "Córtame en cuanto tengas algo que añadir. No pierdo el hilo y prefiero tu parte ahora.",
  "playbook.ok.cutin.name": "Di mi nombre y luego córtame. Con una palabra la conversación cambia de manos sin caerse.",
  "playbook.ok.quiet.again": "Si pasan dos días, vuelve a mandarlo. Un segundo mensaje no es insistir, suele ser lo que lo desatasca.",
  "playbook.ok.quiet.ring": "Llámame, o dime claramente que es urgente. No voy a detectar la urgencia en un mensaje que parece uno más.",
  "playbook.ok.quiet.silence": "Si pasan dos días sin nada, léelo como un no. No es un descuido y volver a preguntar no lo moverá.",
  "playbook.ok.news.worst": "Empieza por lo peor, con un aviso de una línea como mucho. Lo que de verdad me cuesta es la antesala.",
  "playbook.ok.news.context": "Dame el contexto antes de lo peor. Me resulta más fácil llegar hasta ello que encontrármelo de frente.",
  "playbook.ok.news.written": "Manda las malas noticias por escrito y déjame leerlas a solas. Ya iré a buscarte cuando lo haya hecho.",
  "playbook.ok.problem.early": "Cuéntame el problema antes de que esté resuelto. Media foto el martes vale más para mí que una entera el viernes.",
  "playbook.ok.problem.option": "Tráeme el problema con una posible respuesta al lado. Se me da mucho mejor elegir que recibirlo en crudo.",
  "playbook.ok.problem.first": "Arregla lo que puedas arreglar y cuéntamelo después. Tráeme los problemas que de verdad no se pueden resolver sin mí.",
  "playbook.ok.sorry.name": "Cuando pidas perdón, di qué has hecho. Nombrarlo es la parte que me llega.",
  "playbook.ok.sorry.after": "Dime qué va a ser distinto, o simplemente hazlo. Lo que viene después de una disculpa cuenta más para mí que la disculpa.",
  "playbook.ok.sorry.once": "Dilo una vez, con claridad, y pasa página. Una disculpa basta y prefiero que los dos lo soltemos.",
  "playbook.ok.correct.room": "Corrígeme delante de la gente si me he equivocado. No me cuesta nada y ahorra la segunda conversación.",
  "playbook.ok.correct.why": "Corrígeme en la sala siempre que digas por qué. Lo único que discutiré es una contradicción a secas.",
  "playbook.ok.correct.signal": "Búscame la mirada en vez de decirlo en voz alta. Una señal ahora y el detalle después es todo lo que necesito.",
  "playbook.ok.angry.plain": "Dime en la primera frase que te ha molestado algo, mientras siga vivo. Por el tono no voy a llegar.",
  "playbook.ok.angry.write": "Escríbelo y mándamelo. Una cosa dura la leo dos veces y respondo mucho mejor a la segunda lectura.",
  "playbook.ok.angry.ask": "Pregunta si es buen momento antes de empezar. Que me lo preguntes es lo que me deja escuchar el resto.",
  "playbook.ok.drop.said": "Déjame decir lo mío entero una vez sin interrupciones. Una vez dicho, puedo soltarlo.",
  "playbook.ok.drop.reason": "Dame el razonamiento y no solo la decisión. Con el razonamiento paro, y sin él sigo tirando del hilo.",
  "playbook.ok.drop.hour": "Dame una hora a solas y luego déjalo ahí. No necesito que se resuelva, necesito que se calle.",
  "playbook.ok.pause.think": "Deja correr mis pausas. Estoy componiendo una respuesta, no reteniéndola.",
  "playbook.ok.pause.done": "Cuando paro, he terminado. El silencio es tu turno y no un hueco que tengas que rellenar.",
  "playbook.ok.pause.ask": "Si me quedo en silencio, pregúntame qué es ese silencio. No siempre es lo mismo.",
  "playbook.ok.ask.named": "Pregúntame directamente y di qué has notado. Con «¿estás bien?» solo sacas de mí un reflejo.",
  "playbook.ok.ask.walk": "Pregúntame mientras hacemos otra cosa. Hombro con hombro digo cosas que no puedo decir con una mesa de por medio.",
  "playbook.ok.ask.later": "Pregúntame más tarde, y una sola vez. Si digo que no es nada, acéptalo, y ya volveré cuando sea algo.",
  "playbook.ok.praise.public": "Dilo delante de los demás. El reconocimiento en público me llega de otra manera, ponga yo la cara que ponga.",
  "playbook.ok.praise.quiet": "Dilo en voz baja y déjalo corto. Una palabra al salir vale más para mí que un anuncio.",
  "playbook.ok.praise.write": "Ponlo por escrito, aunque sea una línea. Las guardo y las releo en una mala semana.",
  "playbook.ok.praise.pass": "Díselo a quien de verdad le importe en lugar de decírmelo a mí. Esa es la versión que sí puedo usar.",
  /* this is not */
  "playbook.no.talk.warmup": "No me des cinco minutos de charla previa. No es frialdad: estoy esperando la frase de verdad.",
  "playbook.no.talk.cold": "No abras con la petición. En frío, esa misma pregunta se lleva mi peor respuesta.",
  "playbook.no.cutin.across": "No me cortes sin avisar. Si te llevas el hilo sin más, lo pierdo y volvemos a empezar el tema.",
  "playbook.no.cutin.hold": "No te guardes algo hasta que yo deje de hablar. Prefiero mucho que me interrumpas a que me lo cuentes después.",
  "playbook.no.quiet.chase": "No me persigas a los dos días. Un segundo mensaje hace menos probable que responda, no más.",
  "playbook.no.quiet.assume": "No leas mi silencio como un no. Si no sabes de mí, la cosa sigue abierta.",
  "playbook.no.news.buildup": "No me prepares el terreno. En cuanto noto que viene algo malo dejo de escuchar y me pongo a esperar el golpe.",
  "playbook.no.news.headline": "No abras con el titular. En frío y en una frase es la versión de una mala noticia que peor llevo.",
  "playbook.no.news.room": "No me lo digas en la sala. Mándamelo primero y déjame leerlo antes de que hablemos.",
  "playbook.no.problem.rumour": "No me traigas un rumor. Espera a saber qué es verdad y entonces cuéntamelo todo de una vez.",
  "playbook.no.problem.late": "No esperes a tener certeza para contarme un problema. Prefiero oírlo pronto y equivocarme que tarde y acertar.",
  "playbook.no.sorry.word": "No te quedes en la palabra. Un «lo siento» sin nada detrás no me da nada que soltar.",
  "playbook.no.sorry.now": "No pidas perdón en los primeros diez minutos. Dale un día y entonces sí puedo recibirlo.",
  "playbook.no.correct.public": "No me corrijas en voz alta delante de otra gente. Dímelo después y lo arreglo en la frase siguiente.",
  "playbook.no.correct.aloud": "No lo digas en voz alta en la sala. Con una mirada ahora basta y el resto puede esperar a que estemos a solas.",
  "playbook.no.correct.later": "No lo guardes para después. Una corrección en privado más tarde significa que me equivoqué dos veces.",
  "playbook.no.angry.hint": "No lances indirectas. Si algo te ha molestado y no lo dices, o no me entero de nada o me invento un motivo peor.",
  "playbook.no.angry.hot": "No lo saques en caliente. Si me acorralas en el momento, me defiendo en lugar de escucharte.",
  "playbook.no.angry.spot": "No lo hagas en voz alta y sobre la marcha. Una cosa dura la respondo mucho mejor en la segunda lectura que en la sala.",
  "playbook.no.drop.open": "No lo dejes ambiguo. Di claramente que está zanjado y dejaré de darle vueltas.",
  "playbook.no.drop.closed": "No me digas que está cerrado. Dime cuándo lo volvemos a mirar y de verdad lo dejaré en paz hasta entonces.",
  "playbook.no.pause.fill": "No hables para llenar mi silencio. Si me he callado, ya hay más en la sala de lo que puedo responder.",
  "playbook.no.pause.read": "No leas mi silencio como si estuviera de morros. Pregúntame qué es en lugar de decidirlo por tu cuenta.",
  "playbook.no.ask.twice": "No me preguntes dos veces si pasa algo. Lo traeré cuando tenga las palabras, y volver a preguntar lo aleja.",
  "playbook.no.ask.leave": "No decidas dejarme a solas con ello. Prefiero mucho que me preguntes mal a que no me preguntes.",
  "playbook.no.praise.public": "No me elogies delante de toda la sala. En público me paso todo el rato controlando la cara.",
  "playbook.no.praise.quiet": "No lo guardes para un aparte. Dicha donde la oiga otra gente, esa misma frase cuenta más.",
  "playbook.no.praise.tome": "No te quedes en decírmelo a mí. Cuenta cuando lo ha oído la persona a quien de verdad le importa.",

  /* ── la hoja de instrucciones ──────────────────────────────────── */
  "card.reaching": "Cómo dar conmigo",
  "card.bad-news": "Malas noticias y problemas sin resolver",
  "card.quiet": "Cuando me quedo en silencio, y cómo preguntar",
  "card.praise": "Elogios",
  "card.correction": "Corregirme, y decirme que te has enfadado",
  "card.repair": "Qué necesito para soltarlo, y cómo pedir perdón",
};
