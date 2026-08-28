/**
 * Życie cyfrowe — po polsku.
 *
 * Klucz w klucz z `en.ts`, które jest źródłem prawdy; pisane są tylko wartości.
 * Pytania powstały po polsku, a nie z przekładu: bramka na 80 znaków w
 * `test/i18n/readability.test.ts` nie ustępuje polszczyźnie, która biegnie o
 * jakąś czwartą dłużej od angielskiego, więc „What is the most that may be
 * posted about your child?” to „Ile najwyżej można wrzucać o twoim dziecku?”,
 * bo tak się o to pyta po polsku.
 *
 * ── Nic się nie zgadza z płcią ────────────────────────────────────────
 *
 * Płeć czytającego jest nieznana, a zdania z playbooka to zdania, które jedna
 * osoba podaje drugiej — też o nieznanej płci. Cały plik jest więc zbudowany z
 * form, które o płeć nie pytają: czasu teraźniejszego i przyszłego, trybu
 * rozkazującego, bezokoliczników i konstrukcji bezosobowych. Nigdzie nie każe
 * się nikomu powiedzieć „byłem” ani „byłam”. Tam, gdzie angielskie zdanie
 * działało wyłącznie w czasie przeszłym, zostało napisane od nowa: „unless you
 * would have phoned me about it” to „jeśli nie jest to sprawa na telefon”, a
 * „however safely you would keep them” to „choćby były trzymane najbezpieczniej”.
 * „Pokłóciliśmy się” zniknęło na rzecz „naszej kłótni”, bo forma
 * męskoosobowa rozstrzyga za dwoje ludzi, o których ta strona nic nie wie.
 *
 * ── Trzy pytania pytają o zakaz, nie o zgodę ──────────────────────────
 *
 * `posted-about-me`, `group-chats` i `not-in-writing` pytają, czego **nie**
 * wolno. Zaznaczona opcja tworzy zakaz, a opcja „Nic z tego” tworzy zgodę.
 * Przekład na „co wolno wrzucać” odwróciłby każde zdanie wyprowadzone z tych
 * bloków, przy stronie wyglądającej dokładnie tak samo — bank odnotowuje, że
 * raz już się to zdarzyło. Dlatego polskie prompty są tak samo zakazujące jak
 * angielskie, a nagłówek karty `card.spoken` niesie kierunek, którego sama
 * etykieta opcji unieść nie może.
 *
 * Zestaw pozycji © autor, wszelkie prawa zastrzeżone. Zobacz LICENSE.
 */
export default {
  "title": "Życie cyfrowe",
  "tagline": "Dwanaście stanowisk o telefonie, o tym, co trafia do sieci, i o tym, co zostaje — każde ze swoją wagą.",
  "framework": "Dwanaście wypowiedzianych stanowisk — nic nie jest punktowane ani wnioskowane",
  "sourceNote": "Za tym zestawem nie stoi żadne zwalidowane narzędzie, bo takie nie istnieje — pytania napisano tutaj, a badania posłużyły do wyboru, o co pytać, a nie do powiedzenia czegokolwiek o twoich odpowiedziach. To, co te badania rzeczywiście podpierają, jest skromne i warto podać to w prawdziwej skali. W metaanalizie phubbingu partnerskiego (Ni i współpracownicy, Frontiers in Psychology, 2025) związek między poczuciem, że partner zbywa cię dla telefonu, a zadowoleniem ze związku wyniósł r = −0,22 w 30 próbach i wśród 9040 osób — realny, mały i oparty niemal wyłącznie na danych przekrojowych, które nie mówią, w którą stronę to biegnie. Badanie dzienniczkowe par pokazało, że efekt dotyczy odczucia, a nie samego zachowania: własne deklarowane korzystanie z telefonu przez partnera nie przewidywało niczego, natomiast samo to poczucie przewidywało niższą jakość związku tego samego dnia — i ten dzienny efekt nie utrzymał się po dwóch miesiącach (Carnelley, Vowels, Stanton, Millings i Hart, Computers in Human Behavior 147, 2023). Wrzucanie zdjęć dzieci do sieci jest tu jedynym tematem, w którym osoba najbardziej zainteresowana nie jest tą, która odpowiada: opisane szkody są udokumentowane — trwały ślad, którego dziecko nie wybrało, nadużycia wizerunku, konflikt z dorosłym już dzieckiem o wpisy, na które nigdy się nie zgodziło — badania za nimi stojące są małe i w większości opisowe, a w jednej ankiecie wśród 1460 czeskich i hiszpańskich rodziców około czterech na pięciu wrzuciło zdjęcia swojego dziecka, podczas gdy tylko mniej więcej jeden na pięciu wcześniej dziecko o to zapytał. Dla grup na czacie, dla tego, czego w ogóle nie powinno się pisać, i dla tego, co ludzie chcą zrobić ze swoimi kontami po śmierci, nie ma żadnych użytecznych danych; te pytania są tutaj dlatego, że rozstrzygają się same, a nie dlatego, że cokolwiek o nich wiadomo. Nic na tej stronie nie jest punktowane, wnioskowane ani zamieniane w liczbę.",

  /* ── sekcje ───────────────────────────────────────────────────────── */
  "section.attention.title": "Uwaga",
  "section.attention.note": "Co telefonowi wolno przerwać i jak szybko oczekuje się odpowiedzi.",
  "section.visibility.title": "Co widzą inni",
  "section.visibility.note": "Publikowanie — łącznie z jedną osobą w tej sekcji, która nie może sama za siebie odpowiedzieć.",
  "section.access.title": "Co jest otwarte",
  "section.access.note": "Hasła, lokalizacja i to, czy odblokowany telefon na stole jest zaproszeniem.",
  "section.permanence.title": "Co zostaje",
  "section.permanence.note": "Co może istnieć, czego nigdy nie powinno się pisać i co dzieje się potem z całym archiwum.",

  /* ── pytania ──────────────────────────────────────────────────────── */
  "stance.phone-at-meals.prompt": "Gdzie powinny być telefony podczas wspólnego posiłku?",
  "stance.reply-window.prompt": "Jak szybko powinna przyjść odpowiedź na bezpośrednie pytanie?",
  "stance.work-after-hours.prompt": "Kiedy praca może się do ciebie odezwać po godzinach?",
  "stance.posted-about-me.prompt": "Czego nie wolno o tobie wrzucać bez pytania?",
  "stance.children-online.prompt": "Ile najwyżej można wrzucać o twoim dziecku?",
  "stance.group-chats.prompt": "Co z twoich spraw ma nie trafiać na grupę?",
  "stance.passwords.prompt": "Które twoje hasła powinien mieć ktoś inny?",
  "stance.location.prompt": "Kto może widzieć, gdzie teraz jesteś?",
  "stance.reading-messages.prompt": "Kto może czytać wiadomości w twoim telefonie?",
  "stance.intimate-images.prompt": "Co może się dziać z twoimi intymnymi zdjęciami?",
  "stance.not-in-writing.prompt": "Co z tego nigdy nie powinno przyjść jako wiadomość?",
  "stance.accounts-after-death.prompt": "Co ma zostać z twoich kont po twojej śmierci?",

  /* ── co można odpowiedzieć ────────────────────────────────────────── */
  /* phone-at-meals */
  "stance.phone-at-meals.opt.out-of-room": "Zupełnie poza pokojem",
  "stance.phone-at-meals.opt.silent-away": "Blisko, ale wyciszony i schowany",
  "stance.phone-at-meals.opt.face-down": "Na stole, ekranem w dół, nietknięty",
  "stance.phone-at-meals.opt.used-freely": "Używany swobodnie, jak zawsze",
  "stance.phone-at-meals.opt.no-rule": "Nie mam co do tego zasady",
  /* reply-window */
  "stance.reply-window.opt.hours": "W ciągu kilku godzin",
  "stance.reply-window.opt.same-day": "Tego samego dnia",
  "stance.reply-window.opt.day-or-more": "Dzień albo więcej jest w porządku",
  "stance.reply-window.opt.urgent-only": "Tylko jeśli zaznaczam, że to pilne",
  "stance.reply-window.opt.never": "Nie ma tu żadnych oczekiwań",
  "stance.reply-window.opt.undecided": "Nie mam tego przemyślanego",
  /* work-after-hours */
  "stance.work-after-hours.opt.never": "Nigdy, czeka do rana",
  "stance.work-after-hours.opt.cannot-wait": "Tylko w sprawie, która nie może czekać",
  "stance.work-after-hours.opt.any-evening": "Każdego wieczoru, aż pójdę spać",
  "stance.work-after-hours.opt.any-time": "O każdej porze",
  "stance.work-after-hours.opt.no-work": "Moja praca nie ma jak się do mnie odezwać",
  "stance.work-after-hours.opt.undecided": "To u mnie wciąż nierozstrzygnięte",
  /* posted-about-me */
  "stance.posted-about-me.opt.photos": "Zdjęcie, na którym jestem",
  "stance.posted-about-me.opt.full-name": "Moje imię i nazwisko w całości",
  "stance.posted-about-me.opt.whereabouts": "To, gdzie akurat jestem",
  "stance.posted-about-me.opt.relationship": "Wieści o moim związku",
  "stance.posted-about-me.opt.none": "Nic z tego — wrzucaj to swobodnie",
  /* children-online */
  "stance.children-online.opt.nothing": "Nic, nigdy",
  "stance.children-online.opt.private-only": "Tylko prywatnie, do wybranych przeze mnie osób",
  "stance.children-online.opt.closed-account": "Na zamkniętym koncie, nigdy na publicznym",
  "stance.children-online.opt.public-no-identifiers": "Publicznie, bez twarzy i bez imienia",
  "stance.children-online.opt.public-open": "Publicznie, jak wszystko inne",
  "stance.children-online.opt.undecided": "To u mnie wciąż nieustalone",
  /* group-chats */
  "stance.group-chats.opt.screenshots": "Zrzuty moich wiadomości",
  "stance.group-chats.opt.arguments": "Nasza kłótnia",
  "stance.group-chats.opt.health": "Cokolwiek o moim zdrowiu",
  "stance.group-chats.opt.money": "Cokolwiek o moich pieniądzach",
  "stance.group-chats.opt.none": "Nic z tego — powtarzaj wszystko",
  /* passwords */
  "stance.passwords.opt.none": "Żadnych",
  "stance.passwords.opt.shared-accounts": "Tylko do kont, z których korzystamy razem",
  "stance.passwords.opt.shared-plus-passcode": "Do nich plus kod do mojego telefonu",
  "stance.passwords.opt.emergency-all": "Wszystkie, na wypadek nagłej sytuacji",
  "stance.passwords.opt.all-any-time": "Wszystkie, do użycia o każdej porze",
  "stance.passwords.opt.undecided": "To u mnie wciąż nierozstrzygnięte",
  /* location */
  "stance.location.opt.nobody": "Nikt, nigdy",
  "stance.location.opt.only-when-i-send": "Tylko wtedy, kiedy wysyłam ją osobiście",
  "stance.location.opt.travelling": "Jedna osoba, kiedy podróżuję albo wracam późno",
  "stance.location.opt.one-person-always": "Jedna osoba, stale włączona",
  "stance.location.opt.household-always": "Wszyscy domownicy, stale włączona",
  "stance.location.opt.undecided": "To u mnie wciąż nierozstrzygnięte",
  /* reading-messages */
  "stance.reading-messages.opt.nobody": "Nikt, nawet w nagłej sytuacji",
  "stance.reading-messages.opt.if-incapable": "Tylko jeśli nie mogę odpowiedzieć osobiście",
  "stance.reading-messages.opt.handed-over": "Tylko to, co podaję do obejrzenia",
  "stance.reading-messages.opt.ask-first": "Jedna osoba, jeśli wcześniej zapyta",
  "stance.reading-messages.opt.one-person-anytime": "Jedna osoba, zawsze, bez pytania",
  "stance.reading-messages.opt.undecided": "To u mnie wciąż nierozstrzygnięte",
  /* intimate-images */
  "stance.intimate-images.opt.none": "Nie powinny w ogóle istnieć",
  "stance.intimate-images.opt.deleted": "Zrobione i skasowane tego samego dnia",
  "stance.intimate-images.opt.my-device": "Tylko na urządzeniu, które kontroluję",
  "stance.intimate-images.opt.no-cloud": "Na urządzeniu jednej albo drugiej osoby, nigdy w chmurze",
  "stance.intimate-images.opt.anywhere": "Gdziekolwiek, łącznie z kopiami w chmurze",
  "stance.intimate-images.opt.rather-not": "Wolę na to nie odpowiadać",
  /* not-in-writing */
  "stance.not-in-writing.opt.apology": "Przeprosiny, które coś znaczą",
  "stance.not-in-writing.opt.end-of-argument": "Koniec kłótni",
  "stance.not-in-writing.opt.health-news": "Złe wieści o czyimś zdrowiu",
  "stance.not-in-writing.opt.money-decision": "Decyzja o pieniądzach",
  "stance.not-in-writing.opt.criticism": "Cokolwiek krytycznego pod moim adresem",
  "stance.not-in-writing.opt.none": "Nic z tego — wiadomość jest w porządku",
  /* accounts-after-death */
  "stance.accounts-after-death.opt.nothing": "Nic — skasować wszystko",
  "stance.accounts-after-death.opt.photographs": "Tylko zdjęcia",
  "stance.accounts-after-death.opt.no-messages": "Wszystko poza prywatnymi wiadomościami",
  "stance.accounts-after-death.opt.as-it-is": "Wszystko, dokładnie tak jak jest",
  "stance.accounts-after-death.opt.undecided": "Nie mam tego przemyślanego",

  /* ── na czym stanowisko się opiera ────────────────────────────────── */
  "stance.work-after-hours.groundsPrompt": "Skąd bierze się ta zasada o pracy wieczorem?",
  "stance.children-online.groundsPrompt": "Skąd bierze się ta granica dla zdjęć dziecka?",
  "stance.location.groundsPrompt": "Skąd bierze się to podejście do udostępniania lokalizacji?",
  "stance.reading-messages.groundsPrompt": "Skąd bierze się ta granica wokół twoich wiadomości?",
  "stance.intimate-images.groundsPrompt": "Skąd bierze się ta odpowiedź o tych zdjęciach?",
  "stance.grounds.safety": "Bezpieczeństwo, moje albo czyjeś",
  "stance.grounds.consent": "Ktoś inny się na to nie zgodził",
  "stance.grounds.experience": "Coś, co mnie kiedyś spotkało",
  "stance.grounds.privacy": "Chcę, żeby część mojego życia była tylko moja",
  "stance.grounds.trust": "To, czym jest dla mnie zaufanie",
  "stance.grounds.obligation": "Wymaga tego moja praca albo prawo",
  "stance.grounds.not-worked-out": "Nie mam tego poukładanego",

  /* ── playbook ─────────────────────────────────────────────────────── */
  /* to jest w porządku */
  "playbook.ok-phone-in-another-room": "Zostaw telefon w drugim pokoju, kiedy jemy, i nie zapowiadaj tego — nie odbiorę tego jako focha.",
  "playbook.ok-glance-if-you-say-so": "Zerknij na telefon przy stole, jeśli na coś czekasz — tylko powiedz mi, że czekasz.",
  "playbook.ok-phone-out-at-dinner": "Korzystaj z telefonu przy stole bez sprawdzania mojej miny — naprawdę mi to nie przeszkadza.",
  "playbook.ok-one-line-holds-it": "Napisz mi jedno zdanie, że nie możesz jeszcze porządnie odpowiedzieć; to się liczy jako odpowiedź.",
  "playbook.ok-reply-tomorrow": "Zostaw moją wiadomość do jutra, jeśli nie masz już siły; ja nie liczę godzin.",
  "playbook.ok-silence-costs-nothing": "Odpisuj, kiedy chcesz, i nie zaczynaj od przepraszania za zwłokę.",
  "playbook.ok-send-what-cannot-wait": "Napisz do mnie po godzinach, jeśli to naprawdę nie doczeka do rana.",
  "playbook.ok-take-the-work-call": "Odbierz służbowy telefon wieczorem, o ile powiesz mi, że to praca.",
  "playbook.ok-post-me-unasked": "Wrzuć moje zdjęcie, jeśli ci się podoba — nie musisz mnie wcześniej pytać.",
  "playbook.ok-send-child-photos-privately": "Wysyłaj zdjęcia naszego dziecka prosto do osób, które ich chcą, zamiast wrzucać je gdziekolwiek.",
  "playbook.ok-ask-the-child": "Pokaż dziecku zdjęcie, zanim je wrzucisz, i przyjmij odmowę bez wybijania mu jej z głowy.",
  "playbook.ok-tell-your-friends": "Powiedz znajomym o naszej kłótni, jeśli ci to pomaga — wolę, żeby było z kim o tym pogadać, niż żeby zostawało to w tobie.",
  "playbook.ok-use-shared-logins": "Loguj się na konta, z których korzystamy razem, bez pytania mnie za każdym razem.",
  "playbook.ok-use-my-passcode": "Użyj mojego kodu, jeśli nie możesz się do mnie dodzwonić, a coś naprawdę trzeba załatwić.",
  "playbook.ok-location-when-travelling": "Włącz moją lokalizację na czas podróży i wyłącz ją, kiedy wrócę do domu.",
  "playbook.ok-check-my-location": "Sprawdzaj moją lokalizację, kiedy chcesz — po to ją włączam.",
  "playbook.ok-open-my-phone-if-i-cannot": "Wejdź do mojego telefonu, jeśli trafię do szpitala i nie mogę go odebrać.",
  "playbook.ok-read-the-handed-phone": "Czytaj w moim telefonie wszystko, kiedy już ci go podam — nie muszę przy tym stać.",
  "playbook.ok-delete-on-request": "Poproś mnie o skasowanie twojego zdjęcia i licz na to, że zniknie tego samego dnia, bez żadnej dyskusji.",
  "playbook.ok-call-instead-of-typing": "Zadzwoń, zamiast pisać, jeśli masz mi przekazać złe wieści o czyimś zdrowiu.",
  "playbook.ok-message-is-fine": "Wyślij to wiadomością, jeśli tak ci łatwiej; nic z tego nie musi paść na głos.",
  "playbook.ok-name-me-legacy-contact": "Wpisz mnie jako kontakt spadkowy w telefonie i w poczcie, żeby nikt nie musiał potem walczyć z infolinią.",
  /* to nie jest w porządku */
  "playbook.no-phone-at-the-table": "Nie przynoś telefonu do stołu w ogóle — ani ekranem w dół, ani na wyciszeniu.",
  "playbook.no-scroll-mid-sentence": "Nie zaczynaj przewijać, kiedy jestem w połowie zdania, nawet jeśli nadal słuchasz.",
  "playbook.no-day-long-silence": "Nie zostawiaj bezpośredniego pytania bez odpowiedzi przez cały dzień, chyba że napiszesz choć jedno zdanie, dlaczego.",
  "playbook.no-work-in-the-evening": "Nie odpisuj wieczorem na służbowe wiadomości; rano nadal tam będą.",
  "playbook.no-work-unless-it-burns": "Nie wysyłaj mi pracy po godzinach, jeśli nie jest to sprawa na telefon.",
  "playbook.no-post-me-unasked": "Nie wrzucaj zdjęcia, na którym jestem, bez pytania mnie — łącznie ze znikającą relacją.",
  "playbook.no-name-me-in-public": "Nie pisz mojego imienia i nazwiska w publicznym wpisie, nawet w podziękowaniu.",
  "playbook.no-post-where-i-am": "Nie wrzucaj tego, gdzie jestem, dopóki tam jestem.",
  "playbook.no-announce-my-relationship": "Nie ogłaszaj niczego o moim związku, zanim zrobię to ja.",
  "playbook.no-child-at-all": "Nie wrzucaj niczego o naszym dziecku nigdzie, także tam, gdzie są sami zaufani ludzie.",
  "playbook.no-child-face-public": "Nie umieszczaj twarzy naszego dziecka na publicznym koncie — ani razu, nawet dobrego zdjęcia.",
  "playbook.no-child-school-or-uniform": "Nie wrzucaj niczego, co zdradza szkołę naszego dziecka albo pokazuje jego mundurek.",
  "playbook.no-child-embarrassment": "Nie wrzucaj naszego dziecka, kiedy płacze albo dostaje burę, nawet jako żartu o rodzicielstwie.",
  "playbook.no-screenshot-into-group": "Nie zrzucaj moich wiadomości na grupę, choćby zdanie było nie wiadomo jak dobre.",
  "playbook.no-argument-into-group": "Nie opowiadaj grupie o kłótni, w środku której nadal jesteśmy.",
  "playbook.no-health-into-group": "Nie przekazuj niczego o moim zdrowiu, nawet ludziom, którzy tylko życzliwie by się martwili.",
  "playbook.no-money-into-group": "Nie powtarzaj nikomu i na żadnej grupie, ile zarabiam ani ile mam długów.",
  "playbook.no-shared-logins-in-my-name": "Nie zakładaj konta na moje nazwisko i nie zostawiaj hasła u siebie.",
  "playbook.no-check-instead-of-asking": "Nie sprawdzaj mojej lokalizacji zamiast zapytać mnie, gdzie jestem.",
  "playbook.no-read-while-i-shower": "Nie czytaj moich wiadomości, kiedy jestem pod prysznicem, choćby telefon leżał odblokowany.",
  "playbook.no-intimate-photos-at-all": "Nie rób mi intymnych zdjęć w ogóle, choćby były trzymane najbezpieczniej na świecie.",
  "playbook.no-cloud-backup-of-photos": "Nie trzymaj moich intymnych zdjęć w niczym, co synchronizuje się z chmurą.",
  "playbook.no-ending-arguments-by-text": "Nie kończ kłótni wiadomością — dokończ ją na głos albo zostaw otwartą do rozmowy.",
  "playbook.no-criticism-by-text": "Nie wytykaj mi błędów w wiadomości; powiedz mi to prosto w oczy.",
  "playbook.no-money-by-text": "Nie rozstrzygaj decyzji o pieniądzach w wątku wiadomości.",
  "playbook.no-reading-my-messages-after": "Nie czytaj moich prywatnych wiadomości po mojej śmierci, cokolwiek innego zdecydujesz zachować.",

  /* ── kartki instrukcji ─────────────────────────────────────────
     Siedem nagłówków na czterech kanałach, które deklaruje spec. Nie są to
     cztery sekcje: sekcje to kolejność zadawania pytań, a kartka to coś, co
     ktoś sprawdza, zanim wrzuci, odpisze albo odłoży telefon.

     Trzy z dwunastu bloków to pytania o zakaz, a kartka drukuje tytuł i treść
     i nic więcej — żadne pytanie nie wędruje razem z odpowiedzią. Tytuł musi
     więc unieść kierunek, którego etykieta opcji unieść nie może:
     „Przeprosiny, na których zależy” to rzecz, która nigdy nie ma przyjść jako
     wiadomość, a pod nagłówkiem, który tego nie mówi, znaczyłaby dokładnie
     odwrotnie. */
  "card.answering": "Jak szybko odpowiadam i kiedy dociera do mnie praca",
  "card.together": "Telefon, kiedy jesteśmy razem",
  "card.photographs": "Zdjęcia intymne",
  "card.posting": "Zanim cokolwiek trafi do sieci albo dalej",
  "card.open": "Co jest otwarte i dla kogo",
  "card.afterwards": "Co zostaje potem",
  "card.spoken": "Co nigdy nie ma przyjść jako wiadomość",

  /* ── strona wyniku ─────────────────────────────────────────────
     Podpis nad podstawami i dwie listy, które robią wagi. Nagłówki mówią o
     własnych liczbach czytającego, a nigdy o tym, na co ktoś „pozwolił” albo
     co „ustalił”: trzy z dwunastu odpowiedzi to listy rzeczy, które mają się
     nie dziać, a podpis w stronę zgody wydrukowałby je odwrotnie. Nic tutaj
     nie mówi o phubbingu, o wrzucaniu zdjęć dzieci ani o cyfrowym spadku —
     ostrożna wersja tego, co te badania podpierają, jest w sourceNote, które
     strona wyniku rysuje pod tym. */
  "view.rests": "Opiera się na:",
  "view.heaviest.title": "Czemu dajesz największą wagę",
  "view.heaviest.note": "Osiem albo więcej na dziesięć. Nic nie jest sumowane ani z nikim porównywane — tu masz najmniej pola do ustępstwa, a to jest właśnie to, co ktoś powinien wiedzieć, zanim w to wejdzie.",
  "view.lightest.title": "Czemu dajesz najmniejszą wagę",
  "view.lightest.note": "Trzy albo mniej na dziesięć. To nie to samo co brak stanowiska: to znaczy, że jest tu pole do ruchu, a dla osoby czytającej jest to warte tyle samo co lista wyżej.",
};
