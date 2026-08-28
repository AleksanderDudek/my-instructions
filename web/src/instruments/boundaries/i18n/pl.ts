/**
 * Granice — po polsku.
 *
 * Polski wymusza wybór, którego angielski nigdy nie musi zrobić: prawie każdy
 * czas przeszły i każdy przymiotnik orzecznikowy niesie płeć mówiącego. Płeć
 * czytającego jest nieznana, a zdania z playbooka są zdaniami, które ktoś
 * podaje komuś innemu — też o nieznanej płci. Cały plik jest więc zbudowany z
 * form, które o to nie pytają: czasu teraźniejszego i przyszłego, trybu
 * rozkazującego, bezokoliczników i konstrukcji bezosobowych. Nigdzie nie każe
 * się czytającemu powiedzieć „nie zgodziłem się” ani „nie zgodziłam się”, i
 * nigdzie nie każe mu się nazwać drugiej osoby „zostawiony”. Tam, gdzie
 * angielskie zdanie działało wyłącznie w czasie przeszłym, zostało napisane od
 * nowa, a nie przełożone: „you sitting on it” to „żeby zostawało to w tobie”,
 * „Ask me and I will show you myself” to „Zapytaj, a pokażę ci osobiście”, a
 * „I am not, and pretending otherwise would be worse” to „Nie mam go, a
 * udawanie byłoby gorsze”.
 *
 * ── Słowo, którego w polszczyźnie nie ma ──────────────────────────────
 *
 * Angielskie „an ex” nie ma polskiego odpowiednika bez płci: „były” i „była”
 * rozstrzygają za czytającego, kim jest osoba, o której nic nie wiemy. Dwa
 * pytania i pięć zdań z playbooka biegną więc przez „ktoś ze swojego dawnego
 * związku” — dłużej niż angielski oryginał, za to bez rozstrzygnięcia, którego
 * to narzędzie nie ma prawa zrobić. Ta sama zasada rządzi znajomym z pytania o
 * okrutne słowa: „ktoś ze znajomych”, a nie „znajomy”.
 *
 * Dwanaście pytań jest krótszych, niż wyszłoby z dosłownego przekładu, bo bramka
 * na 80 znaków mierzy ten napis, a polski biegnie o ćwierć dłużej od angielskiego,
 * z którego by powstał. „How much can you lend family without a conversation?”
 * to „Ile możesz pożyczyć rodzinie bez wcześniejszej rozmowy?”, bo tak to
 * pytanie brzmi w domu, w którym pada.
 *
 * ── Czego ten plik nie robi ───────────────────────────────────────────
 *
 * „Not something I decide” to „To nie zależy ode mnie” — zdanie, które nic nie
 * przyznaje i nie wygląda podejrzanie na cudzym ekranie. To jest ta połowa,
 * która niesie ciężar: strona, która zamieniłaby „rodzic ma klucz wbrew mnie” w
 * zdanie zaczynające się od „Wchodź”, zapisałaby czyjeś podporządkowanie jako
 * jego preferencję i podała je dalej. W tej opcji nie ma nic o żadnym układzie
 * i nie ma za nią żadnego zdania z playbooka.
 *
 * Rejestr jest ten sam co w bratnich narzędziach: nieformalne „ty”, nic
 * złagodzone i nic pochwalone. Pytanie o przychodzenie bez uprzedzenia jest w
 * polskim domu cięższe niż w angielskim i właśnie dlatego zostaje takie, jakie
 * jest — zadane wprost i bez żadnej sugestii, która odpowiedź jest normalna.
 */
export default {
  "title": "Granice",
  "tagline": "Dwanaście spraw: twoje drzwi, twój sen i twoje pieniądze — każda z wagą, którą jej dajesz.",
  "framework": "Dwanaście zapisanych stanowisk — nic nie jest punktowane, nikt nie jest oceniany",
  "sourceNote": "Za tym narzędziem nie stoi żadna zwalidowana skala i stać nie może: ile pożyczysz bratu i jak długie spóźnienie jest już za długie, żeby obyć się bez wiadomości, nie są konstruktami psychologicznymi. To fakty o tym, jak żyjesz. Słowo «granice» przychodzi na tę stronę z dwóch stron — z teorii systemów rodzinnych, gdzie opisuje miejsce, w którym jedna część rodziny się kończy, a zaczyna druga, oraz z literatury poradnikowej, która nie wydała ani jednego badania nad skutkami wartego zacytowania — więc używamy go tutaj jako zwykłego polskiego słowa i nie stoi za nim żadne twierdzenie. Nic nie jest punktowane, dzielone na przedziały ani z kimkolwiek porównywane. Jedną rzecz warto powiedzieć wprost, a nie w przypisie: wszystko, co tu zapiszesz, jest albo zdaniem o twoim własnym postępowaniu, albo prośbą, a prośbę druga osoba ma prawo odrzucić. Ta zasada jest powodem, dla którego żadne pytanie tutaj nie każe ci ustanawiać reguł nad inną dorosłą osobą — ani z kim może się widywać, ani do kogo może pisać, ani gdzie ma być. Tam, gdzie odpowiedź opisuje układ zastany, a nie uzgodniony, ta strona zapisuje go dokładnie jako taki i nie nazywa go preferencją. I nic na tej stronie nie czyta twoich odpowiedzi w poszukiwaniu oznak czegokolwiek.",

  /* ── cztery rozdziały ──────────────────────────────────────────────── */
  "section.home.title": "Drzwi i wieczór",
  "section.home.note": "Trzy rzeczy, które rozstrzyga ten, kto pierwszy się ruszy: kto przychodzi, kto wchodzi i jak długo czekasz.",
  "section.people.title": "Wszyscy pozostali",
  "section.people.note": "Dawne związki, znajomi, rodzina — i to, czego którekolwiek z nich się dowiaduje.",
  "section.body.title": "Twoje ciało i twój sen",
  "section.body.note": "Dwie rzeczy, które łatwiej powiedzieć teraz niż w danej chwili.",
  "section.yours.title": "Co jest twoje do oddania",
  "section.yours.note": "Twoje rzeczy, twoje pieniądze, twój czas — co odchodzi bez wcześniejszej rozmowy.",

  /* ── dwanaście pytań ───────────────────────────────────────────────── */
  "stance.unannounced-visit.prompt": "Kto może przyjść do ciebie bez uprzedzenia?",
  "stance.closed-door.prompt": "Co u ciebie w domu znaczy zamknięte drzwi?",
  "stance.lateness.prompt": "Ile ktoś może się spóźnić, zanim oczekujesz wiadomości?",
  "stance.partner-ex-friend.prompt": "Partner przyjaźni się z kimś ze swojego dawnego związku. Czego potrzebujesz?",
  "stance.own-ex-contact.prompt": "Odzywa się do ciebie ktoś z dawnego związku. Co robisz?",
  "stance.friend-rude.prompt": "Ktoś ze znajomych mówi okrutne rzeczy o kimś, kogo kochasz. Co robisz?",
  "stance.told-outside.prompt": "Kto może się dowiedzieć o kłótni w domu?",
  "stance.public-touch.prompt": "Jaki dotyk przy ludziach jest dla ciebie w porządku?",
  "stance.woken.prompt": "Co jest wystarczającym powodem, żeby cię obudzić?",
  "stance.things-read.prompt": "Kto może zaglądać do twoich rzeczy bez pytania?",
  "stance.money-family.prompt": "Ile możesz pożyczyć rodzinie bez wcześniejszej rozmowy?",
  "stance.volunteered.prompt": "Ktoś zgadza się na coś w twoim imieniu. Co robisz?",

  /* ── co można odpowiedzieć ─────────────────────────────────────────── */
  /* przyjście bez uprzedzenia */
  "stance.unannounced-visit.opt.nobody": "Nikt — najpierw wiadomość",
  "stance.unannounced-visit.opt.parent": "Rodzic może",
  "stance.unannounced-visit.opt.family": "Bliska rodzina może",
  "stance.unannounced-visit.opt.anyone": "Każdy, kto jest mi bliski",
  "stance.unannounced-visit.opt.notMine": "To nie zależy ode mnie",
  "stance.unannounced-visit.opt.never": "Nigdy się to nie zdarzyło",
  /* zamknięte drzwi */
  "stance.closed-door.opt.nobody": "Nikt nie wchodzi",
  "stance.closed-door.opt.knockWait": "Zapukaj i poczekaj na odpowiedź",
  "stance.closed-door.opt.knockIn": "Zapukaj i od razu wejdź",
  "stance.closed-door.opt.openHouse": "U nas nie zamyka się drzwi",
  "stance.closed-door.opt.never": "Nigdy się to nie zdarzyło",
  /* spóźnienie */
  "stance.lateness.opt.always": "Każde spóźnienie",
  "stance.lateness.opt.ten": "Jakieś dziesięć minut",
  "stance.lateness.opt.thirty": "Jakieś pół godziny",
  "stance.lateness.opt.hour": "Godzina albo więcej",
  "stance.lateness.opt.never": "Nigdy nie potrzebuję wiadomości",
  /* dawny związek partnera */
  "stance.partner-ex-friend.opt.nothing": "Nic — to nie moja sprawa",
  "stance.partner-ex-friend.opt.toKnow": "Tylko wiedzieć, że tak jest",
  "stance.partner-ex-friend.opt.told": "Wiedzieć przed spotkaniem",
  "stance.partner-ex-friend.opt.met": "Poznać tę osobę osobiście",
  "stance.partner-ex-friend.opt.hard": "Tak czy tak jest mi z tym trudno",
  "stance.partner-ex-friend.opt.unknown": "Jeszcze nie wiem",
  /* mój dawny związek */
  "stance.own-ex-contact.opt.sayFirst": "Mówię w domu, zanim odpiszę",
  "stance.own-ex-contact.opt.replyThenSay": "Odpisuję i potem o tym mówię",
  "stance.own-ex-contact.opt.replyQuiet": "Odpisuję i zostawiam to dla siebie",
  "stance.own-ex-contact.opt.noReply": "Nie odpisuję",
  "stance.own-ex-contact.opt.blocked": "Nie ma jak mnie złapać",
  "stance.own-ex-contact.opt.never": "Nie zdarzyło mi się to",
  /* okrutne słowa znajomego */
  "stance.friend-rude.opt.thereAndThen": "Reaguję na miejscu",
  "stance.friend-rude.opt.after": "Mówię tej osobie później",
  "stance.friend-rude.opt.tellThem": "Mówię o tym osobie, o którą chodziło",
  "stance.friend-rude.opt.nothing": "Nic — odpuszczam",
  "stance.friend-rude.opt.distance": "Rzadziej się z tą osobą widuję",
  "stance.friend-rude.opt.notHappened": "Nie zdarzyło mi się to",
  /* kto się dowiaduje */
  "stance.told-outside.opt.nobody": "Nikt spoza tego pokoju",
  "stance.told-outside.opt.onePerson": "Jedna zaufana osoba",
  "stance.told-outside.opt.friends": "Bliscy znajomi",
  "stance.told-outside.opt.family": "Rodzina też",
  "stance.told-outside.opt.anyone": "Wszystko jedno kto",
  "stance.told-outside.opt.undecided": "Nie mam tego rozstrzygniętego",
  /* dotyk przy ludziach */
  "stance.public-touch.opt.none": "Nic",
  "stance.public-touch.opt.hand": "Ręka albo ramię",
  "stance.public-touch.opt.kiss": "Krótki pocałunek też",
  "stance.public-touch.opt.anything": "Wszystko, co robię w domu",
  "stance.public-touch.opt.depends": "Zależy, kto patrzy",
  /* budzenie */
  "stance.woken.opt.never": "Nie budź mnie do niczego",
  "stance.woken.opt.emergency": "Tylko nagły wypadek",
  "stance.woken.opt.today": "Wszystko, co zmienia dzisiejszy dzień",
  "stance.woken.opt.anything": "Budź mnie do wszystkiego",
  "stance.woken.opt.depends": "Zależy od godziny",
  /* moje rzeczy */
  "stance.things-read.opt.nobody": "Nikt nie zagląda do moich rzeczy",
  "stance.things-read.opt.ask": "Każdy, kto najpierw zapyta",
  "stance.things-read.opt.partner": "Osoba, z którą mieszkam",
  "stance.things-read.opt.notMine": "To nie zależy ode mnie",
  "stance.things-read.opt.never": "Nigdy się to nie zdarzyło",
  /* pożyczka dla rodziny */
  "stance.money-family.opt.discussFirst": "Nic bez wcześniejszej rozmowy",
  "stance.money-family.opt.dayPay": "Dzienny zarobek",
  "stance.money-family.opt.weekPay": "Tygodniowy zarobek",
  "stance.money-family.opt.monthPay": "Miesięczny zarobek",
  "stance.money-family.opt.whatever": "Tyle, ile trzeba",
  "stance.money-family.opt.neverLend": "Rodzinie nie pożyczam",
  /* zgoda w moim imieniu */
  "stance.volunteered.opt.sayNo": "Od razu odmawiam",
  "stance.volunteered.opt.pullOut": "Później się z tego wykręcam",
  "stance.volunteered.opt.sayLater": "Robię to i mówię o tym potem",
  "stance.volunteered.opt.doIt": "Robię to i nic nie mówię",
  "stance.volunteered.opt.notHappened": "Jeszcze mi się to nie zdarzyło",

  /* ── zdania do przekazania ─────────────────────────────────────────── */
  /* to jest w porządku */
  "playbook.ok.door.open": "Wchodź, jeśli drzwi są otwarte. Nigdy nie musisz najpierw dzwonić.",
  "playbook.ok.door.hour": "Napisz godzinę przed przyjściem, a odpowiedź prawie zawsze będzie brzmiała tak.",
  "playbook.ok.doorclosed.knock": "Zapukaj, jeśli moje drzwi są zamknięte, i od razu wejdź. Nie chowam się przed tobą.",
  "playbook.ok.late.relax": "Nie przepraszaj za dziesięć minut spóźnienia. Naprawdę tego nie zauważam.",
  "playbook.ok.late.line": "Jeśli spóźniasz się mniej niż pół godziny, nie pisz. Zamówię dla nas.",
  "playbook.ok.ex.theirs": "Widuj się z kimś ze swojego dawnego związku, ile chcesz. Nie potrzebuję potem relacji.",
  "playbook.ok.myex.reply": "Jeśli odezwie się do mnie ktoś z mojego dawnego związku, odpiszę. To nie jest tajemnica i nie jest początkiem niczego.",
  "playbook.ok.myex.ask": "Pytaj mnie wprost, czy odezwał się ktoś z mojego dawnego związku. Za każdym razem dostaniesz prostą odpowiedź.",
  "playbook.ok.friend.push": "Jeśli powiem coś niesprawiedliwego, zaprotestuj przy wszystkich. Wolę, żeby to wybrzmiało na głos.",
  "playbook.ok.told.talk": "Po naszej kłótni powiedz o tym komuś, komu ufasz. Wolę to, niż żeby zostawało to w tobie.",
  "playbook.ok.touch.street": "Trzymaj mnie za rękę na ulicy. Pocałuj mnie na dworcu. Nic z tego mnie nie krępuje.",
  "playbook.ok.wake.me": "Obudź mnie, jeśli mnie potrzebujesz. Wolę stracić godzinę snu niż usłyszeć o tym przy śniadaniu.",
  "playbook.ok.things.open": "Możesz zaglądać do moich rzeczy. Niczego wcześniej nie przekładam.",
  "playbook.ok.money.lend": "Jeśli twoja rodzina potrzebuje pieniędzy, pożycz im. Powiedz mi potem, zamiast pytać wcześniej.",
  /* to nie jest w porządku */
  "playbook.no.door.message": "Nie zjawiaj się pod moimi drzwiami bez wcześniejszej wiadomości. Klucz to nie zaproszenie.",
  "playbook.no.doorclosed.open": "Nie otwieraj moich drzwi bez pukania. Poczekaj na odpowiedź, zanim wejdziesz.",
  "playbook.no.late.silence": "Nie każ mi czekać w niepewności. Jeśli masz do mnie dalej niż dziesięć minut, napisz jedno zdanie.",
  "playbook.no.ex.afterwards": "Nie umawiaj się z kimś ze swojego dawnego związku i nie mów mi o tym po fakcie. Powiedz wcześniej.",
  "playbook.no.ex.pretend": "Nie proś mnie o luz w tej sprawie. Nie mam go, a udawanie byłoby gorsze.",
  "playbook.no.myex.number": "Nie podawaj mojego numeru nikomu z moich dawnych związków, jakikolwiek powód poda.",
  "playbook.no.friend.jokes": "Nie żartuj przy ludziach z osób, które kocham. Nawet dobrym żartem.",
  "playbook.no.told.story": "Nie powtarzaj swojej rodzinie tego, co powiem w kłótni. Nawet jako zabawnej historii przy stole.",
  "playbook.no.touch.colleagues": "Nie całuj mnie przy swoich współpracownikach. Ręka na plecach jest w porządku.",
  "playbook.no.touch.any": "Nie sięgaj po mnie przy ludziach. To nie jest o tobie i to się nie zmieni.",
  "playbook.no.wake.morning": "Nie budź mnie po to, żeby powiedzieć coś, co rano nadal będzie prawdą.",
  "playbook.no.things.out": "Nie zaglądaj do moich rzeczy pod moją nieobecność. Zapytaj, a pokażę ci osobiście.",
  "playbook.no.money.promise": "Nie obiecuj rodzinie pieniędzy, zanim nie powiesz mi kwoty na głos.",
  "playbook.no-lend-then-tell": "Nie pożyczaj pieniędzy komuś ze swojej rodziny i nie mów mi o tym po fakcie.",
  "playbook.no.volunteer.yes": "Nie zgadzaj się w moim imieniu. Powiedz, że to ze mną sprawdzisz — i tak zwykle się zgodzę.",

  /* ── kartka do wydruku ─────────────────────────────────────────────── */
  "card.arriving": "Zanim wejdziesz",
  "card.committing": "Do czego można mnie zobowiązać",
  "card.clock": "Spóźnienia i budzenie mnie",
  "card.touch": "Dotyk przy ludziach",
  "card.repeating": "Dawne związki i to, co idzie dalej",

  /* ── strona wyniku ─────────────────────────────────────────────────── */
  "view.weightTitle": "Gdzie padła waga",
  "view.weightNote": "Wagi, które tu nadajesz, odczytane z dwóch końców. To, co znalazło się między czwórką a siódemką, nie zniknęło — jest wyżej, w kolejności, w jakiej padły pytania.",
  "view.heaviestTitle": "Co waży u ciebie najwięcej",
  "view.heaviestNote": "Osiem albo więcej na dziesięć. To te miejsca, w których cudza pomyłka kosztuje najwięcej.",
  "view.lightestTitle": "Co waży u ciebie najmniej",
  "view.lightestNote": "Trzy albo mniej na dziesięć. Jest tu miejsce na ruch, co nie znaczy, że ci to obojętne.",
};
