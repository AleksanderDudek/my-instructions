/**
 * family-plan — Polish.
 *
 * Written in Polish rather than rendered out of the English, and the difference
 * is visible in three places.
 *
 * Polish makes the reader's gender audible in every past tense, every
 * conditional and every predicative adjective, so none of them is used here.
 * The thirteen questions run in the present and the future — "Co zrobisz",
 * "Kto ograniczy", "W jakim wieku" — the escapes are nominal ("Nie mam tego
 * rozstrzygniętego"), and the playbook is imperative from end to end. Nowhere
 * is the reader made to choose between "zdecydowałem" and "zdecydowałam", and
 * nowhere is the other person given a gender they did not pick: where the
 * English writes "a partner" this file writes "druga osoba", which is the word
 * the Conversations instrument already uses in Polish. Even the plural past was
 * a trap — "zdecydowaliśmy" is not a sentence two women say — so the phone line
 * says "to nasza wspólna decyzja" instead.
 *
 * The questions are shorter than a literal rendering would be. The
 * 80-character gate is measured on this string and Polish runs roughly a
 * quarter longer than the English it would come from, so several were thought
 * again rather than trimmed: "What is the largest number of children you would
 * agree to" is "Ile dzieci to dla ciebie górna granica?".
 *
 * Three answers are Polish arrangements rather than translations of English
 * ones. The default school is "szkoła rejonowa", the paid one is the one with
 * "czesne", and weekday care splits into "żłobek albo przedszkole" because that
 * is the split Polish households actually plan around. The English "a state
 * school chosen for its faith" names a category Poland does not have — a Polish
 * reader chooses a school *for* its faith, not a state school that comes with
 * one — so the option asks the question underneath it instead.
 *
 * The one thing this file may not soften is the smack. "Klaps" is the word
 * people use and the answer people choose, and an option set that leaves out a
 * real answer collects a false one in its place. What is known about the
 * practice stays in the sourceNote, where the English keeps it, and out of the
 * question — a question that argues collects agreement.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Plan rodziny",
  "tagline": "Trzynaście decyzji o dzieciach — także tych jeszcze niepodjętych — każda ze swoją wagą.",
  "framework": "Trzynaście wypowiedzianych stanowisk — bez punktacji i bez prognozy",
  "sourceNote": "Za tym zestawem nie stoi żadne narzędzie badawcze i nie ma takiej potrzeby. Lista tematów jest tą, której demografia używa od dziesięcioleci — amerykańskiego National Survey of Family Growth, którego kwestionariusze są federalnym materiałem urzędowym, oraz otwarcie publikowanego Generations and Gender Survey — a każde pytanie i każda odpowiedź zostały napisane dla tej aplikacji. Inwentarze przedmałżeńskie obejmujące ten sam teren, dostępne wyłącznie przez przeszkolonego prowadzącego — PREPARE/ENRICH, FOCCUS i RELATE — nie są tu ani powielone, ani sparafrazowane, i dlatego figurują na liście rzeczy unikanych, a nie wśród źródeł: nic na tej stronie z nich nie pochodzi. Nic tutaj nie jest punktowane i nic niczego nie prognozuje. Deklarowana liczba dzieci słabo przewiduje liczbę faktyczną, a ludziom częściej się z nią rozmija, niż zgadza (Quesnel-Vallée i Morgan, 2003), więc czytaj to jako stanowisko z konkretnego dnia, a nie jako plan, który się wydarzy. Najpierw „Rozmowy”, żeby w ogóle sprawdzić, czy temat dzieci kiedykolwiek padł, a jeśli w grze jest ślub — „Przed ślubem”. To jest trzynaście decyzji leżących niżej: to, co przynosisz do rozmowy, a nie to, co ją zaczyna. Na każde pytanie tutaj odpowiada jedna osoba siedząca sama, łącznie z tymi, które wymieniają hipotetycznego drugiego rodzica. Tam, gdzie blok zapisuje rzecz nierozstrzygniętą, opcja mówi „nie mam tego rozstrzygniętego”, nigdy „nie mamy”, bo strona, której nie da się wypełnić, dopóki w pokoju nie pojawi się druga osoba, jest innym produktem. Zanim odczytasz niezgodę jako wyrok, warto wiedzieć, że gdy dwoje ludzi różni się co do pierwszego dziecka, mniej więcej połowa i tak je ma, a niezgoda co do kolejnego kończy się zwykle na „nie” (Testa i Bolano, 2021). Jeden blok podaje klapsa jako odpowiedź, bo ludzie go wybierają, a zestaw opcji, który pomija prawdziwą odpowiedź, zbiera zamiast niej fałszywą. Największa metaanaliza tej praktyki wiązała ją z gorszymi wynikami w trzynastu z siedemnastu mierzonych rzeczy i z lepszymi w żadnej (Gershoff i Grogan-Kaylor, 2016). Jest to powiedziane tutaj, a nie w treści pytania, bo pytanie, które argumentuje, zbiera zgodę.",

  /* ── rozdziały ─────────────────────────────────────────────────────── */
  "section.plan.title": "Plan",
  "section.plan.note": "Liczba, termin, odstęp i to, co robisz, jeśli nie wyjdzie. Na każde pytanie w tym rozdziale uczciwą odpowiedzią jest „nie mam tego rozstrzygniętego”. Na żadne nie ma odpowiedzi poprawnej.",
  "section.care.title": "Praca i to, kto zostaje w domu",
  "section.care.note": "Ta część planu rodziny, która ma cenę i datę. Odpowiadaj o układzie, którego naprawdę chcesz, a nie o tym, który dobrze brzmi powiedziany na głos.",
  "section.raising.title": "Wychowanie",
  "section.raising.note": "Cztery decyzje zapadające w pośpiechu, pojedynczo, w odstępie lat, zwykle u tego, kto akurat jest w pokoju. Spisane wcześniej są stanowiskami. Podjęte w biegu są kłótniami.",
  "section.disagreement.title": "Kiedy się nie zgadzacie",
  "section.disagreement.note": "Dwa pytania o to, co się dzieje, kiedy reszta tej strony się nie schodzi. Są tu najtrudniejsze i nikt ich nie zadaje, zanim nie zrobią się potrzebne.",

  /* ── pytania ───────────────────────────────────────────────────────── */
  "stance.children-ceiling.prompt": "Ile dzieci to dla ciebie górna granica?",
  "stance.timing-gate.prompt": "Co musi się najpierw zmienić, zanim będziesz mieć dziecko?",
  "stance.child-spacing.prompt": "Jaka ma być różnica wieku między dziećmi?",
  "stance.if-not-natural.prompt": "Co wchodzi w grę, jeśli poczęcie się nie uda?",
  "stance.who-steps-back.prompt": "Kto ograniczy pracę zarobkową, kiedy pojawi się dziecko?",
  "stance.time-at-home.prompt": "Jak długo ma trwać przerwa w pracy po porodzie?",
  "stance.childcare.prompt": "Kto w dni robocze będzie najwięcej przy małym dziecku?",
  "stance.schooling.prompt": "Gdzie ma się uczyć twoje dziecko?",
  "stance.discipline.prompt": "Co zrobisz, gdy dziecko trzeci raz cię zignoruje?",
  "stance.screens.prompt": "W jakim wieku twoje dziecko dostanie własny telefon?",
  "stance.grandparents.prompt": "Ile twoi rodzice będą mieć do powiedzenia o dziecku?",
  "stance.parent-deadlock.prompt": "Co rozstrzyga, gdy drugi rodzic jest innego zdania?",
  "stance.change-of-mind.prompt": "Co zrobisz, jeśli druga osoba zmieni zdanie o dzieciach?",

  /* ── co można odpowiedzieć ─────────────────────────────────────────── */
  /* children-ceiling */
  "stance.children-ceiling.opt.none": "Żadnego",
  "stance.children-ceiling.opt.one": "Jedno",
  "stance.children-ceiling.opt.two": "Dwoje",
  "stance.children-ceiling.opt.three": "Troje",
  "stance.children-ceiling.opt.fourPlus": "Czworo lub więcej",
  "stance.children-ceiling.opt.undecided": "Nie mam liczby w głowie",
  /* timing-gate */
  "stance.timing-gate.opt.readyNow": "Nic — mogę już teraz",
  "stance.timing-gate.opt.money": "Pieniądze albo pewność pracy",
  "stance.timing-gate.opt.home": "Lepsze miejsce do mieszkania",
  "stance.timing-gate.opt.study": "Skończenie studiów albo szkolenia",
  "stance.timing-gate.opt.notWanted": "Nic — nie chcę dziecka",
  "stance.timing-gate.opt.unsure": "Nie wiem, na co czekam",
  /* child-spacing */
  "stance.child-spacing.opt.underTwo": "Mniej niż dwa lata",
  "stance.child-spacing.opt.twoThree": "Dwa do trzech lat",
  "stance.child-spacing.opt.overThree": "Więcej niż trzy lata",
  "stance.child-spacing.opt.whatever": "Jak wyjdzie",
  "stance.child-spacing.opt.notMoreThanOne": "Tak czy inaczej tylko jedno dziecko",
  "stance.child-spacing.opt.unsure": "Nie mam tego przemyślanego",
  /* if-not-natural */
  "stance.if-not-natural.opt.treatment": "Leczenie niepłodności, na przykład in vitro",
  "stance.if-not-natural.opt.donor": "Leczenie z komórką jajową albo nasieniem dawcy",
  "stance.if-not-natural.opt.adoption": "Adopcja",
  "stance.if-not-natural.opt.fostering": "Rodzina zastępcza",
  "stance.if-not-natural.opt.stop": "Nic z tego — zatrzymam się i będę żyć bez dzieci",
  "stance.if-not-natural.opt.unsure": "Jeszcze nie wiem",
  /* who-steps-back */
  "stance.who-steps-back.opt.me": "Ja, niezależnie od tego, kto ile zarabia",
  "stance.who-steps-back.opt.otherParent": "Drugi rodzic",
  "stance.who-steps-back.opt.bothPartTime": "Oboje, na pół etatu",
  "stance.who-steps-back.opt.neither": "Żadne z nas",
  "stance.who-steps-back.opt.lowerEarner": "To z nas, które wtedy zarabia mniej",
  "stance.who-steps-back.opt.undecided": "Nie mam tego rozstrzygniętego",
  /* time-at-home */
  "stance.time-at-home.opt.weeksOrLess": "Kilka tygodni albo krócej",
  "stance.time-at-home.opt.months": "Kilka miesięcy",
  "stance.time-at-home.opt.year": "Mniej więcej rok",
  "stance.time-at-home.opt.twoThreeYears": "Dwa albo trzy lata",
  "stance.time-at-home.opt.untilSchool": "Aż dziecko pójdzie do szkoły",
  "stance.time-at-home.opt.undecided": "Nie mam tego rozstrzygniętego",
  /* childcare */
  "stance.childcare.opt.parentHome": "Rodzic w domu",
  "stance.childcare.opt.family": "Dziadkowie albo inna rodzina",
  "stance.childcare.opt.nursery": "Żłobek albo przedszkole",
  "stance.childcare.opt.nanny": "Niania albo opiekunka",
  "stance.childcare.opt.undecided": "Nie mam tego rozstrzygniętego",
  /* schooling */
  "stance.schooling.opt.state": "W rejonowej szkole publicznej",
  "stance.schooling.opt.faithSchool": "W szkole wybranej ze względu na wiarę",
  "stance.schooling.opt.private": "W szkole, za którą płacimy czesne",
  "stance.schooling.opt.home": "W edukacji domowej",
  "stance.schooling.opt.whicheverAdmits": "W tej, do której uda się dostać",
  "stance.schooling.opt.unsure": "Nie wiem",
  /* discipline */
  "stance.discipline.opt.explain": "Wytłumaczę jeszcze raz i poczekam",
  "stance.discipline.opt.removeSomething": "Zabiorę coś, co dziecko lubi",
  "stance.discipline.opt.timeOut": "Odeślę je na chwilę, żeby pobyło samo",
  "stance.discipline.opt.raiseVoice": "Podniosę głos",
  "stance.discipline.opt.smack": "Klaps",
  "stance.discipline.opt.unsure": "Nie wiem, co zrobię",
  /* screens */
  "stance.screens.opt.underTen": "Zanim skończy dziesięć lat",
  "stance.screens.opt.tenEleven": "Mając dziesięć albo jedenaście lat",
  "stance.screens.opt.twelveThirteen": "Mając dwanaście albo trzynaście lat",
  "stance.screens.opt.fourteenPlus": "Mając czternaście lat albo więcej",
  "stance.screens.opt.noFixedAge": "Bez ustalonego wieku — zdecyduję wtedy",
  "stance.screens.opt.undecided": "Nie mam tego przemyślanego",
  /* grandparents */
  "stance.grandparents.opt.sayInDecisions": "Realny głos w decyzjach",
  "stance.grandparents.opt.helpNoSay": "Stała pomoc, żadnego głosu w decyzjach",
  "stance.grandparents.opt.occasional": "Tylko pomoc od czasu do czasu",
  "stance.grandparents.opt.minimal": "Jak najmniej udziału",
  "stance.grandparents.opt.notAround": "Nie będzie ich, żeby było kogo pytać",
  "stance.grandparents.opt.unsure": "Nie wiem",
  /* parent-deadlock */
  "stance.parent-deadlock.opt.moreWorried": "Decyduje to z nas, które bardziej się martwi",
  "stance.parent-deadlock.opt.mainCarer": "Decyduje to z nas, które więcej zajmuje się dzieckiem",
  "stance.parent-deadlock.opt.byADate": "Wyznaczamy termin i do niego rozstrzygamy",
  "stance.parent-deadlock.opt.outsideHelp": "Pytamy kogoś, komu oboje ufamy",
  "stance.parent-deadlock.opt.noChange": "Nic się nie zmienia, dopóki oboje nie będziemy za",
  "stance.parent-deadlock.opt.undecided": "Nie mam tego rozstrzygniętego",
  /* change-of-mind */
  "stance.change-of-mind.opt.stayAndAccept": "Zostanę i to przyjmę",
  "stance.change-of-mind.opt.stayAndPress": "Zostanę i będę wracać do tematu",
  "stance.change-of-mind.opt.end": "Będę chcieć zakończyć ten związek",
  "stance.change-of-mind.opt.dependsDirection": "To zależy, w którą stronę zmieni zdanie",
  "stance.change-of-mind.opt.unsure": "Nie wiem",

  /* ── zdania do przekazania ─────────────────────────────────────────
     Druga osoba, całe zdania, gotowe do podania komuś bez poprawek. */
  /* to jest w porządku */
  "playbook.ok-start-whenever": "Możesz podnieść temat dziecka, kiedy tylko zechcesz. Nie czekam na sygnał ani od ciebie, ani od niczego innego.",
  "playbook.ok-money-before-dates": "Rozmawiaj ze mną o pieniądzach, zanim zaczniesz o terminach. To pieniądze naprawdę stoją na drodze.",
  "playbook.ok-no-gap-held": "Możesz w każdej chwili podnieść temat drugiego dziecka. Nie trzymam w głowie odstępu, który dałoby się tym złamać.",
  "playbook.ok-tests-early": "Podnieś ze mną temat badań płodności wcześnie, a nie późno. Nie usłyszę w tym oskarżenia — ani wobec ciebie, ani wobec siebie.",
  "playbook.ok-adoption-first-class": "Połóż adopcję na stole jako pierwszą możliwość, a nie jako to, co robimy, kiedy wszystko inne zawiedzie.",
  "playbook.ok-plan-on-me": "Licz na to, że to ja przejdę na pół etatu. A jeśli to przestanie być prawdą, każ mi powiedzieć to na głos.",
  "playbook.ok-book-the-visits": "Umawiaj wizyty w żłobkach beze mnie. Do zawężenia listy nie musisz mnie mieć w pokoju — dopiero do wyboru.",
  "playbook.ok-ask-my-parents": "Poproś moich rodziców o dzień z dzieckiem bez pytania mnie o zgodę. Ta pomoc jest już ustalona.",
  "playbook.ok-local-school-no-case": "Stawiaj szkołę rejonową na pierwszym miejscu bez budowania argumentacji. Nie musisz mnie do niej przekonywać.",
  "playbook.ok-stop-me": "Zatrzymaj mnie, jeśli kiedykolwiek dam dziecku klapsa. Mam zapisane, że tego nie robię, więc trzymaj mnie za słowo.",
  "playbook.ok-phone-age-settled": "Powiedz dziecku, że wiek na telefon jest ustalony i że to nasza wspólna decyzja, więc nie ma z kim się targować.",
  "playbook.ok-you-decide-on-the-day": "W dni, kiedy to ty jesteś przy dziecku, rozstrzygaj sprawy po swojemu. Przy dziecku cię poprę.",
  "playbook.ok-say-it-either-way": "Powiedz mi w dniu, w którym zmienisz zdanie o dzieciach. Nie odejdę z tego powodu.",
  /* to nie jest w porządku */
  "playbook.notok-reopen-the-number": "Nie traktuj mojej liczby jak oferty otwarcia, którą podbija się, kiedy pierwsze dziecko już jest.",
  "playbook.notok-date-before-obstacle": "Nie wyznaczaj terminu pierwszego dziecka, zanim ruszy się to, co nazywam przeszkodą.",
  "playbook.notok-donor-small-step": "Nie podnoś przy mnie tematu komórki albo nasienia dawcy tak, jakby to był mały krok od miejsca, w którym jesteśmy.",
  "playbook.notok-keep-sending-clinics": "Nie przysyłaj mi kolejnych klinik i wskaźników skuteczności. Mówię, że się zatrzymuję, a nie że idę dalej.",
  "playbook.notok-assume-i-step-back": "Nie zakładaj, że to ja przejdę na pół etatu, bo mniej zarabiam. Nie ma na to mojej zgody.",
  "playbook.notok-leave-has-an-end-date": "Nie mów ludziom, że rezygnuję z pracy. Przerwa ma datę końca i znam tę datę.",
  "playbook.notok-ask-my-parents-first": "Nie układaj tygodnia wokół pomocy moich rodziców, dopóki naprawdę ich o nią nie poproszę.",
  "playbook.notok-fees-without-me": "Nie zobowiązuj nas do czesnego w rozmowie, w której mnie nie ma — także w rozmowie z własną rodziną.",
  "playbook.notok-school-not-a-compromise": "Nie mów dziecku, że szkoła rejonowa to było tyle, na ile nas stać. To jest to, co wybieramy.",
  "playbook.notok-smack": "Nie dawaj klapsa mojemu dziecku, cokolwiek robiono tobie w dzieciństwie.",
  "playbook.notok-early-phone": "Nie kupuj dziecku telefonu przed ustalonym wiekiem dlatego, że koledzy już mają.",
  "playbook.notok-grandparents-overrule": "Nie pozwalaj moim rodzicom unieważniać tego, co ustaliliśmy. Pomoc przy dziecku to nie to samo co decydowanie za nie.",
  "playbook.notok-quiet-change": "Nie przetrzymuj zmiany zdania o dzieciach. Chcę usłyszeć to w miesiącu, w którym wiesz, a nie w roku.",

  /* ── kartka do wydruku ─────────────────────────────────────────────
     Pięć nagłówków. To nie są rozdziały formularza: rozdział to kolejność
     pytań, a kartkę czyta się w środku tej rzeczy, której dotyczy. */
  "card.number": "Liczba, termin, odstęp",
  "card.raising": "Jak ma być wychowywane moje dziecko",
  "card.if-not-natural": "Jeśli nie stanie się to naturalnie",
  "card.care": "Kto się wycofuje i na jak długo",
  "card.disagreement": "Jeśli się nie zgadzamy",

  /* ── dwie listy wagi na stronie wyniku ─────────────────────────────
     Żaden z nagłówków nie ocenia odpowiedzi. Nazywają pytania, nigdy
     stanowiska: to tutaj twoje wagi układają pytania w kolejność, i nic
     innego na tej stronie tego nie robi. */
  "weight.settledTitle": "Te, w których nie ma luzu",
  "weight.openTitle": "Tam, gdzie zostawiasz miejsce",
  "weight.settledNote": "Pytania z wagą osiem lub wyższą. Nic tutaj nie mówi, że masz w nich rację — tylko tyle, że tyle są dla ciebie warte.",
  "weight.openNote": "Pytania z wagą trzy lub niższą. To nie to samo co obojętność: mówi tylko tyle, że nie tu chcesz stoczyć spór.",
};
