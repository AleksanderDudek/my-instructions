/**
 * money-management — Spanish.
 *
 * Key for key with `en.ts`, which is the source of truth; only the values are
 * written. Second person is `tú` throughout, per the note at the head of
 * `src/i18n/messages/es.ts`: this is somebody's own money and their own house,
 * and `usted` would turn thirteen questions into a solvency interview.
 *
 * Written in Spanish rather than carried across from the English, as §8 of the
 * stated-positions design asks. The prompts had to be: Spanish runs about a
 * fifth longer and the eighty-character gate in
 * `test/i18n/readability.test.ts` does not move for it, so «¿A partir de qué
 * cantidad avisarías antes de comprar algo?» is the question the English asks,
 * reached by asking it in Spanish rather than by reordering the English
 * clauses. The forbidden joiners for `es` are «, pero » and «; », and no
 * prompt here needs either — a question that wanted one was asking two things.
 *
 * The vocabulary is peninsular and domestic on purpose. Money in this bank is
 * a household running itself, not a portfolio: «sueldo» and not «ingresos
 * salariales», «lo que entra» and not «renta disponible», «un mes malo» and
 * not «un periodo de tensión de liquidez». The one place the register lifts is
 * the `sourceNote`, because that is where somebody else's citations are.
 *
 * Three phrases are deliberately the same words as in the other Spanish
 * tables, because a reader who takes two of these tests has to be able to read
 * two answers as the same answer: «No lo tengo decidido» and «No lo tengo
 * resuelto» come from `boundaries` and `faith`, and «Cómo me criaron» is the
 * ground `faith` already offers under exactly this English.
 *
 * Nothing agrees with a gender. The options are things a person says about
 * themselves and the playbook lines are things they hand to somebody else, and
 * an adjective that agreed would make the reader pick a gender in order to
 * answer — so `debt-disclosure.moving-in` is «Antes de vivir bajo el mismo
 * techo» rather than a form ending in -os or -as, and `undisclosed-debt.unsure`
 * is «No sé qué saben ya» rather than «No estoy segura/o».
 *
 * The not-OK playbook lines carry their own «No», which the English leaves to
 * the heading above them. That is not a change of meaning, it is what Spanish
 * needs: an infinitive list under «Esto no» reads like a notice on a wall,
 * and these sentences are handed to a person. It also keeps this sheet in one
 * grammar when it is printed beside `boundaries`, whose Spanish already does
 * this.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Llevar el dinero",
  "tagline": "Trece posturas sobre tu propio dinero, cada una con el peso que le das.",
  "framework": "Trece posturas declaradas — sin puntuación y sin veredicto",
  "sourceNote": "Aquí no hay ninguna escala ni ningún constructo que medir: lo que queda registrado es una postura que declaras sobre tu propio dinero, el peso que le pones y tu razón. Donde una pregunta dice «alguien» o «la otra persona» se refiere a quien vives ahora o a quien vivirías, y las trece se responden estando una persona sola. La lista de temas es pública —la tipología de Jan Pahl sobre la gestión del dinero doméstico describe desde 1980 el sueldo entregado entero, la asignación, el fondo común y las cuentas independientes, y el contenido del presupuesto de una casa no es propiedad intelectual de nadie—, mientras que los instrumentos que miden en este terreno sí lo son, y aquí no se reproduce ni se parafrasea ninguno: ni la Financial Infidelity Scale (Garbinsky, Gladstone, Nikolova y Olson, 2020), ni el Klontz Money Script Inventory, ni los inventarios prematrimoniales cuyos propios editores declaran por escrito que sus ítems son propiedad suya. Hay dos hallazgos de fuera que merece la pena llevar encima mientras respondes, como prueba de otra gente y no nuestra. Olson, Rick, Small y Finkel repartieron al azar a 230 parejas prometidas o recién casadas entre una cuenta común, cuentas separadas y arreglarlo como quisieran, y dos años después solo el grupo de la cuenta común se había librado del deterioro habitual en la calidad de la relación (Journal of Consumer Research 50(4), 2023): un experimento, con parejas estadounidenses recién casadas, que no te dice qué pasaría en tu casa, y esta página no va a tratar ninguna respuesta a la primera pregunta como la buena. Dew, Britt y Huston encontraron, sobre 4.574 parejas, que discrepar por dinero predecía el divorcio con más fuerza que ningún otro asunto por el que discute una pareja; eso es una razón para dejar estas respuestas escritas y no un pronóstico sobre ti. Sobre cuántas parejas guardan un secreto de dinero no hay ninguna cifra sólida: las encuestas comerciales la ponen entre un tercio y la mitad, con definiciones que no coinciden entre sí, y esa horquilla es el hallazgo. Empieza por Conversaciones si todavía no sabes si el dinero se ha hablado alguna vez entre vosotros; aquí es donde se ponen por escrito las cantidades, los límites y las deudas, y ponerlo por escrito es lo que importa. Tu respuesta a la pregunta sobre la deuda no contada no sale de este dispositivo ni entra en ningún enlace, y esa pregunta nunca te pide una cantidad.",

  /* ── the sections ─────────────────────────────────────────────────── */
  "section.holding.title": "Dónde está el dinero",
  "section.holding.note": "Tres decisiones de las que hereda todo lo de abajo: dónde está, con qué criterio se reparte y quién lo lleva. Respóndelas pensando en quien vives ahora, o en quien vivirías.",
  "section.disclosure.title": "Qué se dice, y cuándo",
  "section.disclosure.note": "Esto no mide actitudes ante la honestidad. Una cifra, un momento y un sí o no que nunca te pide una cantidad.",
  "section.building.title": "Lo que se construye con él",
  "section.building.note": "Un porcentaje, una regla para cuando caiga, y la pregunta de quién se espera que te esté sosteniendo a los setenta.",
  "section.outward.title": "Dinero que sale de casa",
  "section.outward.note": "Lo que se da y la vejez de un padre o una madre: dos cosas que cuestan menos de resolver antes de que lleguen que en medio.",
  "section.strain.title": "Cuando la cosa se tuerce",
  "section.strain.note": "La palanca de la que tiras primero y la línea entre lo privado y la traición: las dos conviene dejarlas fijadas mientras no hay ningún fuego.",

  /* ── the questions ────────────────────────────────────────────────── */
  "stance.accounts.prompt": "¿Cómo debería estar el dinero cuando vives con alguien?",
  "stance.cost-split.prompt": "¿Con qué criterio deberían repartirse los gastos comunes?",
  "stance.money-admin.prompt": "¿Quién debería llevar las facturas y el papeleo?",
  "stance.spend-threshold.prompt": "¿A partir de qué cantidad avisarías antes de comprar algo?",
  "stance.debt-disclosure.prompt": "¿En qué momento debería alguien ver lo que debes?",
  "stance.undisclosed-debt.prompt": "¿Tienes alguna deuda que nadie cercano a ti conoce?",
  "stance.saving-rate.prompt": "¿Qué parte de tu sueldo debería ir al ahorro cada mes?",
  "stance.risk-response.prompt": "¿Qué hacer si lo que tienes invertido cae un tercio?",
  "stance.retirement-source.prompt": "¿De qué esperas vivir sobre todo cuando dejes de trabajar?",
  "stance.giving-share.prompt": "¿Qué parte de lo que ganas debería darse a otros?",
  "stance.parent-support.prompt": "¿Qué le debes a un padre o una madre que no puede mantenerse?",
  "stance.bad-month.prompt": "Cuando un mes no llega el dinero, ¿qué pasa primero?",
  "stance.secrecy-betrayal.prompt": "¿Qué secretos de dinero contarías como una traición?",

  /* ── what may be answered ─────────────────────────────────────────── */
  /* accounts */
  "stance.accounts.opt.one-pot": "Un solo fondo, y los dos gastamos de ahí",
  "stance.accounts.opt.hybrid": "Una cuenta común y la suya cada uno",
  "stance.accounts.opt.separate": "Todo separado, y nos ajustamos las cuentas",
  "stance.accounts.opt.one-manages": "Uno lo lleva y el otro recibe una parte",
  "stance.accounts.opt.undecided": "No lo tengo decidido",
  /* cost-split */
  "stance.cost-split.opt.equal": "A partes iguales, gane lo que gane cada uno",
  "stance.cost-split.opt.proportional": "En proporción a lo que gana cada uno",
  "stance.cost-split.opt.one-income": "Un solo sueldo cubre la casa",
  "stance.cost-split.opt.by-category": "Cada uno se hace cargo de ciertos gastos",
  "stance.cost-split.opt.whoever": "Paga quien tenga dinero en ese momento",
  "stance.cost-split.opt.undecided": "No lo tengo decidido",
  /* money-admin */
  "stance.money-admin.opt.me": "Yo — prefiero tener el cuadro entero",
  "stance.money-admin.opt.them": "La otra persona, teniéndome al tanto",
  "stance.money-admin.opt.by-category": "Repartido por temas, unos cada uno",
  "stance.money-admin.opt.together": "Los dos, a una hora fija cada mes",
  "stance.money-admin.opt.whoever": "Quien se dé cuenta de que hay que hacerlo",
  "stance.money-admin.opt.undecided": "No lo tengo decidido",
  /* spend-threshold */
  "stance.spend-threshold.opt.any": "Cualquier cosa, por pequeña que sea",
  "stance.spend-threshold.opt.day": "Un día de sueldo, más o menos",
  "stance.spend-threshold.opt.week": "Una semana de sueldo, más o menos",
  "stance.spend-threshold.opt.month": "Un mes de sueldo o más",
  "stance.spend-threshold.opt.never": "Nada — no lo diría",
  "stance.spend-threshold.opt.not-set": "Nunca me he puesto una cifra",
  /* debt-disclosure */
  "stance.debt-disclosure.opt.early": "Antes de que la cosa vaya en serio",
  "stance.debt-disclosure.opt.moving-in": "Antes de vivir bajo el mismo techo",
  "stance.debt-disclosure.opt.marriage": "Antes de casarnos",
  "stance.debt-disclosure.opt.if-asked": "Solo si me lo preguntan",
  "stance.debt-disclosure.opt.never": "Nunca — eso es cosa mía",
  "stance.debt-disclosure.opt.undecided": "No lo tengo decidido",
  /* undisclosed-debt */
  "stance.undisclosed-debt.opt.none": "No — no debo nada a escondidas",
  "stance.undisclosed-debt.opt.will-say": "Sí, y pienso decirlo",
  "stance.undisclosed-debt.opt.wont-say": "Sí, y no pienso decirlo",
  "stance.undisclosed-debt.opt.unsure": "No sé qué saben ya",
  "stance.undisclosed-debt.opt.decline": "Prefiero no responder a esto",
  /* saving-rate */
  "stance.saving-rate.opt.none": "Nada — no sobra nada",
  "stance.saving-rate.opt.five": "Hasta un 5%",
  "stance.saving-rate.opt.ten": "Alrededor de un 10%",
  "stance.saving-rate.opt.twenty": "Alrededor de un 20%",
  "stance.saving-rate.opt.more": "Más de un 20%",
  "stance.saving-rate.opt.no-target": "Sin objetivo — lo que quede",
  /* risk-response */
  "stance.risk-response.opt.sell": "Vender y dejarlo todo en efectivo",
  "stance.risk-response.opt.wait": "Nada — dejarlo donde está",
  "stance.risk-response.opt.buy": "Meter más mientras está barato",
  "stance.risk-response.opt.ask": "Preguntar a quien sepa antes de decidir",
  "stance.risk-response.opt.not-invested": "No tengo nada invertido",
  "stance.risk-response.opt.undecided": "No lo tengo decidido",
  /* retirement-source */
  "stance.retirement-source.opt.state": "Sobre todo la pensión pública",
  "stance.retirement-source.opt.workplace": "Un plan de empresa",
  "stance.retirement-source.opt.own-savings": "Mis ahorros y mis inversiones",
  "stance.retirement-source.opt.property": "Una propiedad o un negocio míos",
  "stance.retirement-source.opt.family": "Mis hijos u otros familiares",
  "stance.retirement-source.opt.unworked": "No lo tengo resuelto",
  /* giving-share */
  "stance.giving-share.opt.none": "Nada de forma regular",
  "stance.giving-share.opt.when-asked": "Lo que me pidan, cuando me lo pidan",
  "stance.giving-share.opt.set-amount": "Una cantidad fija, no una parte de lo que gano",
  "stance.giving-share.opt.tenth": "La décima parte de lo que gano",
  "stance.giving-share.opt.more-than-tenth": "Más de la décima parte",
  "stance.giving-share.opt.undecided": "No lo tengo decidido",
  /* parent-support */
  "stance.parent-support.opt.home": "Lo que haga falta, un sitio en casa incluido",
  "stance.parent-support.opt.monthly": "Dinero todos los meses, por descontado",
  "stance.parent-support.opt.top-up": "Lo que su pensión no le cubra",
  "stance.parent-support.opt.crisis": "Ayuda en una crisis, no algo fijo",
  "stance.parent-support.opt.care-not-money": "Tiempo y cuidado antes que dinero",
  "stance.parent-support.opt.undecided": "No lo tengo resuelto",
  /* bad-month */
  "stance.bad-month.opt.cut": "Recorto gastos hasta que pase",
  "stance.bad-month.opt.savings": "Lo saco de los ahorros",
  "stance.bad-month.opt.card": "Va a la tarjeta de crédito",
  "stance.bad-month.opt.family": "Pido ayuda a la familia",
  "stance.bad-month.opt.extra-work": "Busco trabajo extra",
  "stance.bad-month.opt.never": "No me ha pasado",
  /* secrecy-betrayal */
  "stance.secrecy-betrayal.opt.hidden-account": "Una cuenta que se oculta",
  "stance.secrecy-betrayal.opt.solo-debt": "Una deuda pedida por cuenta propia",
  "stance.secrecy-betrayal.opt.lied-cost": "Un precio dicho más bajo del que fue",
  "stance.secrecy-betrayal.opt.family-gift": "Un regalo grande a la familia, sin decirlo",
  "stance.secrecy-betrayal.opt.private-pot": "Un ahorro propio guardado aparte",
  "stance.secrecy-betrayal.opt.none": "Ninguno — el dinero de cada uno es suyo",

  /* ── what a position rests on ─────────────────────────────────────── */
  "stance.accounts.groundsPrompt": "¿De dónde te viene esa idea sobre las cuentas comunes?",
  "stance.cost-split.groundsPrompt": "¿De dónde te viene esa idea de un reparto justo?",
  "stance.spend-threshold.groundsPrompt": "¿De dónde te viene esa cifra?",
  "stance.risk-response.groundsPrompt": "¿De dónde te viene esa regla para una caída?",
  "stance.giving-share.groundsPrompt": "¿De dónde te viene esa idea sobre dar dinero?",
  "stance.parent-support.groundsPrompt": "¿De dónde te viene ese sentido de lo que se debe?",
  "stance.grounds.raised": "Cómo me criaron",
  "stance.grounds.lived": "Algo que me pasó",
  "stance.grounds.faith": "Lo que creo",
  "stance.grounds.numbers": "Los números tal como están hoy",
  "stance.grounds.advice": "Un consejo que me dieron o que leí",
  "stance.grounds.not-worked-out": "No lo tengo resuelto",

  /* ── the playbook ─────────────────────────────────────────────────── */
  /* this is fine */
  "playbook.ok-under-threshold": "Gasta lo que quieras por debajo de una semana de sueldo sin consultármelo antes.",
  "playbook.ok-month-threshold": "Gasta hasta un mes de sueldo sin mencionármelo siquiera.",
  "playbook.ok-own-account-private": "Ten tu propia cuenta con tu dinero dentro y no me digas nunca cuánto hay.",
  "playbook.ok-ask-what-it-cost": "Pregúntame cuánto costó algo. Te lo diré claro y no lo voy a oír como una acusación.",
  "playbook.ok-pay-less-than-half": "Paga menos de la mitad del alquiler, porque ganas menos de la mitad de lo que entra.",
  "playbook.ok-refuse-my-family": "Dile que no a mi familia cuando pida dinero, y deja que se lo diga yo.",
  "playbook.ok-run-the-admin": "Abre el correo, haz las transferencias y presenta la declaración sin contarme nada de eso.",
  "playbook.ok-save-first": "Aparta el ahorro el día de cobro, antes de que ninguno decida para qué es el resto.",
  "playbook.ok-tithe-unasked": "Da la décima parte de lo que ganas sin pasarme la cifra cada vez.",
  "playbook.ok-leave-investments-alone": "Deja las inversiones exactamente donde están un año entero mientras estén caídas.",
  "playbook.ok-use-the-buffer": "En un mes malo, saca de los ahorros lo que falte sin hablarlo antes conmigo.",
  "playbook.ok-say-we-cannot-afford": "Dime que algo no nos lo podemos permitir en vez de buscar en silencio la manera de permitírnoslo.",
  "playbook.ok-see-my-statements": "Pídeme ver mis extractos cuando quieras. No hay nada ahí que yo moviera antes.",
  "playbook.ok-hand-back-the-admin": "Pon media hora en el calendario una vez al mes y hazme sentarme a ver los números contigo.",
  /* this is not */
  "playbook.no-solo-borrowing": "No pidas un préstamo ni una tarjeta a tu nombre sin decirme que existe.",
  "playbook.no-hidden-account": "No abras una cuenta que yo no sepa que existe, ni por una razón que te parezca buena.",
  "playbook.no-shade-the-price": "No me des un precio más bajo del que pagaste de verdad.",
  "playbook.no-sell-in-a-fall": "No vendas las inversiones en la semana en que caen.",
  "playbook.no-commit-to-a-parent": "No nos comprometas a mandarle dinero cada mes a un padre o una madre sin haberlo decidido los dos.",
  "playbook.no-card-instead-of-saying": "No metas en la tarjeta lo que falta en vez de decirme que falta.",
  "playbook.no-big-purchase-unsaid": "No gastes más de un mes de sueldo en nada sin decírmelo antes.",
  "playbook.no-quiet-pension-stop": "No dejes de meter en la jubilación sin decir nada porque un mes vino justo.",
  "playbook.no-dont-worry-about-it": "No lo lleves todo tú y luego me digas que no me preocupe por los detalles.",
  "playbook.no-unmentioned-giving": "No des más de una semana de sueldo sin mencionarlo, por buena que sea la causa.",
  "playbook.no-escape-fund": "No guardes un ahorro tuyo aparte por si lo nuestro sale mal.",
  "playbook.no-ask-parents-first": "No les pidas dinero a tus padres antes de habérmelo pedido a mí.",
  "playbook.no-silent-resplit": "No cambies el reparto de los gastos simplemente empezando a pagar otra cantidad.",

  /* ── the instruction sheet ─────────────────────────────────────
     Five headings, on the three channels the spec declares. They track the
     sections closely, unlike the pilot's, because the bank's sections already
     are the shape a sheet wants: what a household runs, what it has to say,
     and what happens when it goes wrong. `undisclosed-debt` has no heading
     here and never will — see `instructions()` in spec.ts. */
  "card.held": "Dónde está el dinero y cómo se reparte",
  "card.building": "Lo que se construye con él",
  "card.saying": "Lo que voy a decir, y cuándo",
  "card.outward": "Dinero que sale de casa",
  "card.strain": "Cuando la cosa se tuerce",

  /* ── the one answer that stays here ────────────────────────────
     Drawn on the reader's own result page beside their own answer, because
     that page is local and the answer is theirs. Not drawn like the other
     twelve, because those are in the share link and on the printed sheet and
     this one is in neither. See the note on `Sealed` in View.tsx. */
  "private.label": "Se queda en este dispositivo",
  "private.note": "Esta no va en ningún enlace ni en ninguna hoja impresa. No sale del navegador.",

  /* ── the weights, read back as an order ────────────────────────
     Questions rather than answers, and the private block is in neither list:
     a ranking is the one shape a withheld weight still speaks through. */
  "weight.heaviest": "En lo que no te moverías",
  "weight.lightest": "Donde hay margen para moverse",
};
