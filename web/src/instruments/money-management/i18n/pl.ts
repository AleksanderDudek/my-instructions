/**
 * money-management — Polish.
 *
 * Polish makes the speaker's gender audible where English never has to: almost
 * every past tense and every predicate adjective picks a side. The reader's
 * gender is unknown, and the playbook lines are sentences they hand to somebody
 * else whose gender is unknown too, so this file is built out of forms that do
 * not ask — present and future tense, infinitives, imperatives, verbal nouns and
 * impersonal constructions. Nowhere is the reader made to say "ustaliłem" or
 * "ustaliłam", and nowhere are they made to call the other person "zapłaciłeś".
 * Where an English line only worked in the past or the conditional it was
 * rewritten rather than translated: "I have never set a figure" is
 * "Nie mam takiej kwoty ustalonej", "Which money secrets would you count as a
 * betrayal?" is "Które tajemnice finansowe są dla ciebie zdradą?", and
 * "there is nothing in them I would move first" is
 * "nie ma tam nic do wcześniejszego posprzątania".
 *
 * The thirteen questions and the six grounds questions are shorter than a
 * literal rendering would be, because the 80-character gate is measured on this
 * string and Polish runs a quarter longer than the English it would come from.
 * "On what principle should shared costs be divided?" would not survive being
 * carried across word by word, so it was thought again in Polish and asked in
 * five words.
 *
 * ── Money, in Polish, without naming institutions ──────────────────────
 *
 * The bank never asks for an amount, and the Polish keeps that promise the same
 * way the English does: every threshold is a unit of pay — dniówka, tygodniowa
 * wypłata, miesięczna wypłata — and never a number of złotych. A figure would
 * be false from anybody hiding a debt and a record of somebody's finances from
 * everybody else.
 *
 * The retirement options name no institution. ZUS, PPK and PPE are what a
 * reader in Poland would think of first, and they are exactly wrong for the
 * reader in London or Berlin answering the same question in Polish, so the
 * options say "emerytura państwowa" and "program emerytalny od pracodawcy" and
 * let each reader put their own scheme behind the words.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Pieniądze w domu",
  "tagline": "Trzynaście stanowisk o własnych pieniądzach i to, ile każde z nich dla ciebie waży.",
  "framework": "Trzynaście wypowiedzianych stanowisk — bez wyniku i bez werdyktu",
  "sourceNote": "Nie ma tu żadnej skali ani mierzonego konstruktu: zapisywane jest stanowisko, które wypowiadasz o własnych pieniądzach, waga, jaką mu nadajesz, i twój powód. Tam, gdzie pytanie mówi „ktoś” albo „druga osoba”, chodzi o osobę, z którą mieszkasz albo będziesz mieszkać — każde z tych trzynastu pytań da się odpowiedzieć w pojedynkę. Sama lista tematów jest publiczna: typologia Jan Pahl opisuje od 1980 roku gospodarowanie całą wypłatą, system kieszonkowego, wspólną pulę i finanse osobne, a zawartość domowego budżetu nie jest niczyją własnością intelektualną. Narzędzia, które w tym obszarze mierzą, są już czyjąś własnością i żadne z nich nie zostało tu powielone ani sparafrazowane: ani Financial Infidelity Scale (Garbinsky, Gladstone, Nikolova i Olson, 2020), ani Klontz Money Script Inventory, ani kwestionariusze przedmałżeńskie, których wydawcy sami piszą, że ich pozycje są zastrzeżone. Dwa cudze ustalenia warto mieć przy sobie, odpowiadając — jako czyjeś dowody, nie nasze. Olson, Rick, Small i Finkel przydzielili losowo 230 par zaręczonych albo świeżo po ślubie do wspólnego konta, do kont osobnych albo do rozwiązania wedle własnego uznania, i po dwóch latach tylko grupa ze wspólnym kontem uniknęła zwykłego spadku jakości związku (Journal of Consumer Research 50(4), 2023) — jeden eksperyment, na młodych amerykańskich małżeństwach, który nie mówi, co stanie się w twoim domu, i ta strona nie uzna jednej odpowiedzi na pierwsze pytanie za właściwą. Dew, Britt i Huston pokazali na 4574 parach, że niezgoda o pieniądze zapowiadała rozwód silniej niż jakikolwiek inny temat sporów; to powód, żeby te odpowiedzi spisać, a nie prognoza o tobie. Ile osób trzyma przed bliską osobą finansową tajemnicę — na to solidnej liczby nie ma w ogóle: sondaże komercyjne dają od jednej trzeciej do połowy, na definicjach, które do siebie nie pasują, i to właśnie ten rozrzut jest ustaleniem. Zacznij od Rozmów, jeśli nie wiesz jeszcze, czy pieniądze w ogóle padły między wami; tutaj spisuje się kwoty, progi i długi, a spisanie ich jest całym sensem. Twoja odpowiedź na pytanie o nieujawniony dług nie opuszcza tego urządzenia, nie ma jej w żadnym linku do udostępnienia i nigdy nie jest pytaniem o kwotę.",

  /* ── rozdziały ─────────────────────────────────────────────────────── */
  "section.holding.title": "Jak trzymane są pieniądze",
  "section.holding.note": "Trzy rozstrzygnięcia, z których wynika cała reszta: gdzie pieniądze leżą, według jakiej zasady są dzielone i kto ich pilnuje. Odpowiadaj z myślą o osobie, z którą mieszkasz albo będziesz mieszkać.",
  "section.disclosure.title": "Co zostaje powiedziane i kiedy",
  "section.disclosure.note": "Nie postawy wobec szczerości. Próg, moment i jedno pytanie na tak albo nie, które nigdy nie pyta o kwotę.",
  "section.building.title": "Na co się to odkłada",
  "section.building.note": "Część wypłaty, reguła na spadek i pytanie, kto ma cię utrzymywać, kiedy skończysz siedemdziesiąt lat.",
  "section.outward.title": "Pieniądze, które wychodzą z domu",
  "section.outward.note": "Dawanie i starość rodzica: dwie sprawy tańsze do ustalenia, zanim się pojawią, niż w trakcie.",
  "section.strain.title": "Kiedy idzie źle",
  "section.strain.note": "Po co sięgasz najpierw i którędy biegnie granica między prywatnością a zdradą — jedno i drugie lepiej ustalić, póki nic się nie pali.",

  /* ── pytania ───────────────────────────────────────────────────────── */
  "stance.accounts.prompt": "Jak trzymać pieniądze, kiedy już z kimś mieszkasz?",
  "stance.cost-split.prompt": "Według jakiej zasady dzielić wspólne koszty?",
  "stance.money-admin.prompt": "Kto ma pilnować rachunków i papierów?",
  "stance.spend-threshold.prompt": "Od jakiej kwoty mówisz o zakupie, zanim go zrobisz?",
  "stance.debt-disclosure.prompt": "W którym momencie ktoś ma zobaczyć, ile masz długów?",
  "stance.undisclosed-debt.prompt": "Czy masz dług, o którym nikt bliski nie wie?",
  "stance.saving-rate.prompt": "Jaka część wypłaty ma co miesiąc iść na oszczędności?",
  "stance.risk-response.prompt": "Co zrobić, gdy zainwestowane pieniądze spadną o jedną trzecią?",
  "stance.retirement-source.prompt": "Z czego będziesz głównie żyć, kiedy przestaniesz pracować?",
  "stance.giving-share.prompt": "Jaka część zarobków ma być oddawana innym?",
  "stance.parent-support.prompt": "Co należy się rodzicowi, który nie utrzyma się sam?",
  "stance.bad-month.prompt": "Gdy w miesiącu zabraknie pieniędzy, co dzieje się najpierw?",
  "stance.secrecy-betrayal.prompt": "Które tajemnice finansowe są dla ciebie zdradą?",

  /* ── co można odpowiedzieć ─────────────────────────────────────────── */
  /* konta */
  "stance.accounts.opt.one-pot": "Jedna wspólna pula, z której wydaje każde z nas",
  "stance.accounts.opt.hybrid": "Wspólne konto na wspólne koszty, do tego własne",
  "stance.accounts.opt.separate": "Całkiem osobno, z rozliczaniem się między sobą",
  "stance.accounts.opt.one-manages": "Jedno z nas trzyma całość, drugie bierze swoją część",
  "stance.accounts.opt.undecided": "Nie mam tego rozstrzygniętego",
  /* podział kosztów */
  "stance.cost-split.opt.equal": "Po połowie, niezależnie od zarobków",
  "stance.cost-split.opt.proportional": "Proporcjonalnie do tego, ile kto zarabia",
  "stance.cost-split.opt.one-income": "Jedna pensja utrzymuje dom",
  "stance.cost-split.opt.by-category": "Każde z nas ma swoje rachunki na głowie",
  "stance.cost-split.opt.whoever": "Płaci ten, kto akurat ma pieniądze",
  "stance.cost-split.opt.undecided": "Nie mam tego rozstrzygniętego",
  /* prowadzenie spraw */
  "stance.money-admin.opt.me": "Ja — wolę mieć cały obraz",
  "stance.money-admin.opt.them": "Druga osoba, a ja mam być na bieżąco",
  "stance.money-admin.opt.by-category": "Podzielone działami, każde ma swoje",
  "stance.money-admin.opt.together": "Razem, o stałej porze raz w miesiącu",
  "stance.money-admin.opt.whoever": "Ten, kto akurat zauważy, że trzeba",
  "stance.money-admin.opt.undecided": "Nie mam tego rozstrzygniętego",
  /* próg wydatku */
  "stance.spend-threshold.opt.any": "Każda kwota, choćby najmniejsza",
  "stance.spend-threshold.opt.day": "Mniej więcej dniówka",
  "stance.spend-threshold.opt.week": "Mniej więcej tygodniowa wypłata",
  "stance.spend-threshold.opt.month": "Miesięczna wypłata albo więcej",
  "stance.spend-threshold.opt.never": "Żadna — nie mówię o tym",
  "stance.spend-threshold.opt.not-set": "Nie mam takiej kwoty ustalonej",
  /* ujawnienie długu */
  "stance.debt-disclosure.opt.early": "Zanim zrobi się poważnie",
  "stance.debt-disclosure.opt.moving-in": "Zanim zamieszkamy razem",
  "stance.debt-disclosure.opt.marriage": "Przed ślubem",
  "stance.debt-disclosure.opt.if-asked": "Tylko wtedy, gdy ktoś zapyta",
  "stance.debt-disclosure.opt.never": "Nigdy — to zostaje moje",
  "stance.debt-disclosure.opt.undecided": "Nie mam tego rozstrzygniętego",
  /* dług nieujawniony */
  "stance.undisclosed-debt.opt.none": "Nie — nic z tego, co mam do oddania, nie jest ukryte",
  "stance.undisclosed-debt.opt.will-say": "Tak, i zamierzam o tym powiedzieć",
  "stance.undisclosed-debt.opt.wont-say": "Tak, i nie zamierzam o tym mówić",
  "stance.undisclosed-debt.opt.unsure": "Nie wiem, ile ta osoba już wie",
  "stance.undisclosed-debt.opt.decline": "Wolę na to nie odpowiadać",
  /* stopa oszczędzania */
  "stance.saving-rate.opt.none": "Nic — nie ma z czego",
  "stance.saving-rate.opt.five": "Do 5%",
  "stance.saving-rate.opt.ten": "Około 10%",
  "stance.saving-rate.opt.twenty": "Około 20%",
  "stance.saving-rate.opt.more": "Ponad 20%",
  "stance.saving-rate.opt.no-target": "Bez celu — tyle, ile zostanie",
  /* reakcja na spadek */
  "stance.risk-response.opt.sell": "Sprzedać i przenieść wszystko na gotówkę",
  "stance.risk-response.opt.wait": "Nic — zostawić tam, gdzie jest",
  "stance.risk-response.opt.buy": "Dołożyć, póki jest tanio",
  "stance.risk-response.opt.ask": "Najpierw zapytać kogoś, kto się na tym zna",
  "stance.risk-response.opt.not-invested": "Nie mam nic zainwestowanego",
  "stance.risk-response.opt.undecided": "Nie mam tego rozstrzygniętego",
  /* z czego na starość */
  "stance.retirement-source.opt.state": "Emerytura państwowa",
  "stance.retirement-source.opt.workplace": "Program emerytalny od pracodawcy",
  "stance.retirement-source.opt.own-savings": "Własne oszczędności i inwestycje",
  "stance.retirement-source.opt.property": "Nieruchomość albo własna firma",
  "stance.retirement-source.opt.family": "Dzieci albo dalsza rodzina",
  "stance.retirement-source.opt.unworked": "Nie mam tego przemyślanego",
  /* dawanie */
  "stance.giving-share.opt.none": "Nic regularnego",
  "stance.giving-share.opt.when-asked": "Tyle, ile ktoś poprosi, kiedy poprosi",
  "stance.giving-share.opt.set-amount": "Stała kwota, a nie część zarobków",
  "stance.giving-share.opt.tenth": "Dziesiąta część tego, co zarabiam",
  "stance.giving-share.opt.more-than-tenth": "Więcej niż dziesiąta część",
  "stance.giving-share.opt.undecided": "Nie mam tego rozstrzygniętego",
  /* rodzic */
  "stance.parent-support.opt.home": "Wszystko, co trzeba, z miejscem w naszym domu włącznie",
  "stance.parent-support.opt.monthly": "Pieniądze co miesiąc, rzecz oczywista",
  "stance.parent-support.opt.top-up": "Tyle, ile nie pokrywa emerytura",
  "stance.parent-support.opt.crisis": "Pomoc w kryzysie, nie stałe zobowiązanie",
  "stance.parent-support.opt.care-not-money": "Czas i opieka zamiast pieniędzy",
  "stance.parent-support.opt.undecided": "Nie mam tego przemyślanego",
  /* chudy miesiąc */
  "stance.bad-month.opt.cut": "Tnę wydatki, aż się skończy",
  "stance.bad-month.opt.savings": "Biorę z oszczędności",
  "stance.bad-month.opt.card": "Idzie na kartę kredytową",
  "stance.bad-month.opt.family": "Proszę rodzinę o pomoc",
  "stance.bad-month.opt.extra-work": "Biorę dodatkową pracę",
  "stance.bad-month.opt.never": "To mi się jeszcze nie zdarzyło",
  /* tajemnica a zdrada */
  "stance.secrecy-betrayal.opt.hidden-account": "Ukryte konto",
  "stance.secrecy-betrayal.opt.solo-debt": "Dług wzięty na własną rękę",
  "stance.secrecy-betrayal.opt.lied-cost": "Cena podana niższa, niż była",
  "stance.secrecy-betrayal.opt.family-gift": "Duży przelew do rodziny, przemilczany",
  "stance.secrecy-betrayal.opt.private-pot": "Własne oszczędności trzymane w tajemnicy",
  "stance.secrecy-betrayal.opt.none": "Żadne — pieniądze każdego są tylko jego",

  /* ── na czym stanowisko się opiera ─────────────────────────────────
     Jeden słownik pod wszystkimi sześcioma pytaniami. „Wychowanie” musi być
     tym samym słowem pod każdym z nich, bo inaczej dwóch odpowiedzi nie da się
     odczytać jako tej samej podstawy. */
  "stance.accounts.groundsPrompt": "Na czym opiera się to zdanie o wspólnych kontach?",
  "stance.cost-split.groundsPrompt": "Na czym opiera się to poczucie sprawiedliwego podziału?",
  "stance.spend-threshold.groundsPrompt": "Na czym opiera się ta kwota?",
  "stance.risk-response.groundsPrompt": "Na czym opiera się ta reguła na spadek?",
  "stance.giving-share.groundsPrompt": "Na czym opiera się to zdanie o dawaniu?",
  "stance.parent-support.groundsPrompt": "Na czym opiera się to poczucie powinności wobec rodzica?",
  "stance.grounds.raised": "Wychowanie",
  "stance.grounds.lived": "Coś, co mi się przydarzyło",
  "stance.grounds.faith": "To, w co wierzę",
  "stance.grounds.numbers": "Liczby, jakie są dzisiaj",
  "stance.grounds.advice": "Czyjaś rada albo lektura",
  "stance.grounds.not-worked-out": "Nie mam tego przemyślanego",

  /* ── zdania do przekazania ─────────────────────────────────────────
     Druga osoba, całe zdania, gotowe do podania komuś bez poprawek. */
  /* to jest w porządku */
  "playbook.ok-under-threshold": "Możesz wydać wszystko poniżej tygodniowej wypłaty bez pytania mnie o zdanie.",
  "playbook.ok-month-threshold": "Możesz wydać do miesięcznej wypłaty i w ogóle mi o tym nie mówić.",
  "playbook.ok-own-account-private": "Możesz mieć własne konto z własnymi pieniędzmi i nigdy nie mówić mi, ile na nim jest.",
  "playbook.ok-ask-what-it-cost": "Możesz zapytać, ile coś kosztowało. Powiem wprost i nie usłyszę w tym zarzutu.",
  "playbook.ok-pay-less-than-half": "Możesz płacić mniej niż połowę czynszu, bo zarabiasz mniej niż połowę tego, co wchodzi.",
  "playbook.ok-refuse-my-family": "Możesz odmówić mojej rodzinie pieniędzy, a powiem im to ja.",
  "playbook.ok-run-the-admin": "Możesz otwierać listy, robić przelewy i rozliczać podatek bez opowiadania mi o tym.",
  "playbook.ok-save-first": "Odłóż oszczędności w dniu wypłaty, zanim któreś z nas wymyśli, na co jest reszta.",
  "playbook.ok-tithe-unasked": "Możesz oddawać dziesiątą część zarobków bez uzgadniania ze mną kwoty za każdym razem.",
  "playbook.ok-leave-investments-alone": "Możesz zostawić inwestycje dokładnie tam, gdzie są, na rok, póki są pod kreską.",
  "playbook.ok-use-the-buffer": "W chudym miesiącu możesz wziąć brakującą kwotę z oszczędności bez wcześniejszej rozmowy.",
  "playbook.ok-say-we-cannot-afford": "Powiedz mi, że nas na coś nie stać, zamiast po cichu szukać sposobu, żeby było stać.",
  "playbook.ok-see-my-statements": "Możesz w każdej chwili poprosić o moje wyciągi. Nie ma tam nic do wcześniejszego posprzątania.",
  "playbook.ok-hand-back-the-admin": "Wpisz raz w miesiącu pół godziny do kalendarza i posadź mnie przy tych liczbach ze sobą.",
  /* to nie jest w porządku */
  "playbook.no-solo-borrowing": "Nie bierz kredytu ani karty na siebie, nie mówiąc mi, że w ogóle istnieje.",
  "playbook.no-hidden-account": "Nie zakładaj konta, o którym nie wiem, nawet z powodu, który uważasz za dobry.",
  "playbook.no-shade-the-price": "Nie podawaj mi ceny niższej, niż była naprawdę.",
  "playbook.no-sell-in-a-fall": "Nie sprzedawaj inwestycji w tygodniu, w którym spadają.",
  "playbook.no-commit-to-a-parent": "Nie zobowiązuj nas do comiesięcznych pieniędzy dla rodzica, jeśli tego razem nie ustalimy.",
  "playbook.no-card-instead-of-saying": "Nie wrzucaj braku na kartę kredytową zamiast powiedzieć mi, że brak w ogóle jest.",
  "playbook.no-big-purchase-unsaid": "Nie wydawaj kwoty większej niż miesięczna wypłata bez wcześniejszego uprzedzenia mnie.",
  "playbook.no-quiet-pension-stop": "Nie przerywaj po cichu wpłat na emeryturę dlatego, że jeden miesiąc był chudy.",
  "playbook.no-dont-worry-about-it": "Nie prowadź wszystkich spraw, a potem nie mów mi, że szczegóły nie są moim zmartwieniem.",
  "playbook.no-unmentioned-giving": "Nie oddawaj więcej niż tygodniowej wypłaty bez słowa, choćby cel był najlepszy z możliwych.",
  "playbook.no-escape-fund": "Nie trzymaj własnych oszczędności na wypadek, gdyby między nami się popsuło.",
  "playbook.no-ask-parents-first": "Nie proś rodziców o pieniądze, zanim poprosisz mnie.",
  "playbook.no-silent-resplit": "Nie zmieniaj podziału rachunków w ten sposób, że po prostu zaczynasz płacić inaczej.",

  /* ── kartka do wydruku ─────────────────────────────────────────────
     Pięć nagłówków na trzech kanałach. Idą blisko rozdziałów formularza, bo
     rozdziały tego banku już mają kształt, jakiego chce kartka: co dom
     prowadzi, co musi zostać powiedziane i co się dzieje, kiedy idzie źle. */
  "card.held": "Jak trzymamy pieniądze i jak je dzielimy",
  "card.building": "Na co się to odkłada",
  "card.saying": "Co powiem i kiedy",
  "card.outward": "Pieniądze, które wychodzą z domu",
  "card.strain": "Kiedy idzie źle",

  /* ── jedyna odpowiedź, która zostaje tutaj ─────────────────────────── */
  "private.label": "Zostaje na tym urządzeniu",
  "private.note": "Tej jednej nie ma w żadnym linku do udostępnienia ani na wydruku. Nie wychodzi poza przeglądarkę.",

  /* ── wagi, odczytane jako kolejność ────────────────────────────────── */
  "weight.heaviest": "Od czego nie odstąpisz",
  "weight.lightest": "Gdzie jest miejsce na ruch",
};
