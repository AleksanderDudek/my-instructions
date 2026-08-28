/**
 * good-life — Polish.
 *
 * Polish makes the speaker's gender audible wherever English can stay silent:
 * every past tense, every conditional and every predicate adjective picks a
 * side. The reader's gender is unknown, and the playbook lines are sentences
 * they hand to somebody else whose gender is unknown too, so this file is built
 * out of forms that do not ask — present and future tense, infinitives,
 * imperatives, verbal nouns and impersonal constructions. Nowhere is the reader
 * made to say "zatrzymałem" or "zatrzymałam". Where an English line only worked
 * in the past or the conditional it was thought again rather than carried
 * across: "I have never set a point" is "Nie mam takiej granicy ustalonej",
 * "I have not had to find out" is "Nic mnie jeszcze do tego wyboru nie zmusiło",
 * and "Who would you stay here for?" is "Dla kogo zostaniesz tutaj?".
 *
 * ── The gate is measured on these strings ─────────────────────────────
 *
 * Polish runs a fifth to a third longer than the English it would come from,
 * and eighty characters is counted here rather than there, so the questions
 * were asked in Polish instead of being reordered out of English clauses.
 * "What has to be true before you stop trying to earn more?" is fifty-two
 * characters as "Co musi być prawdą, żeby przestać gonić za zarobkiem?" only
 * because the infinitive does the work the English needed a subject for.
 *
 * Two questions changed shape rather than length. English "giving up" covers
 * both surrender and expenditure — you can give up alcohol and give up two
 * hours a week — and Polish "rezygnować z" covers only the first, which would
 * have left the training and the money options answering a question they were
 * not asked; "Co już dzisiaj oddajesz za swoje zdrowie?" covers both. And
 * `regret-most` keeps the inaction in the question ("czego nie zrobisz") so
 * that its options can stay infinitives, which is what Polish offers in place
 * of the English gerund list.
 *
 * ── The last of the four ──────────────────────────────────────────────
 *
 * «What are you avoiding?» is four words in English and two in Polish —
 * "Czego unikasz?" — and the section note says two, because a note that said
 * four would be reporting the English file rather than this one. Every extra
 * word here offers a way to answer a gentler question, so there are none.
 *
 * ── The section notes are notes to the reader ─────────────────────────
 *
 * `sectionHeader` draws `section.<id>.note` above the questions in the runner
 * and `View.tsx` draws it again on the result page, so these six are copy in
 * the same sense the prompts are. They say what the section covers and how to
 * answer it, as they do in every other inventory in this app. See the report
 * accompanying this file: the English values under these keys are the design
 * rationale for the block declarations — option ids in backticks, `runner.tsx`,
 * an argument with an earlier draft — and a Polish reader would be handed a
 * paragraph about a file they cannot open.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Dobre życie",
  "tagline": "Dwanaście stanowisk o tym, z czego składa się udane życie, i cztery pytania, które czytasz tylko ty.",
  "framework": "Dwanaście stanowisk i cztery pytania otwarte — nic nie jest liczone",
  "sourceNote": "Za tym nie stoi żaden kwestionariusz i nie musi stać. Literaturę o dobrostanie — nurt hedonistyczny i eudajmonistyczny, sześć wymiarów Ryff, trzy potrzeby z teorii autodeterminacji, PERMA Seligmana, jedenaście dziedzin OECD — przeczytano tutaj wyłącznie jako spis tego, co zwykle wymienia się jako części życia, i nie wzięto z niej niczego: tamte narzędzia należą do swoich autorów, część z nich wymaga pisemnej zgody, a żadne nie jest tu powielone ani sparafrazowane. Jeden stary i publiczny pomysł służy za ramę, a nie za listę: że pracę można trzymać jako posadę, jako karierę albo jako powołanie. Kwestionariusz zbudowany na tym pomyśle nie jest tu użyty ani przerabiany. Jedyne miejsce, w którym badanie ukształtowało pytanie, a nie spis, to ostatni blok zamknięty: pyta o żal z powodu rzeczy niezrobionych, a nie z powodu rzeczy zrobionych, zgodnie z ustaleniem, że przez całe życie żal za tym, czego się nie zrobiło, trwa dłużej. Powtarzano to ustalenie później, z efektami słabszymi i nie w każdym badaniu, więc czytaj je jako powód, dla którego pytanie idzie w tę stronę, a nie jako fakt o tobie. Cztery pytania na końcu nie mają żadnych opcji i nie opuszczają tego urządzenia. Nic na tej stronie nie jest punktowane, nie ma progów ani przedziałów i nie jest zestawiane z odpowiedziami kogokolwiek innego. Wraca dokładnie to, co tu zapiszesz, w kolejności wagi, jaką temu nadajesz — i dlatego powody, które napiszesz, są warte więcej niż opcje, które zaznaczysz.",

  /* ── rozdziały ─────────────────────────────────────────────────────── */
  "section.work.title": "Po co jest praca",
  "section.work.note": "Dwa pytania, na początku, bo praca jest tu tematem najmniej czułym, a to, po co jest, zmienia sens każdej późniejszej odpowiedzi o pieniądzach. W drugim jedna z odpowiedzi rezygnuje z rozwoju i jest warta dokładnie tyle, co reszta.",
  "section.money.title": "Pieniądze i to, gdzie jest dosyć",
  "section.money.note": "Trzy pytania. W pierwszym zaznaczasz najwyżej dwie rzeczy, bo pieniądze naprawdę służą naraz więcej niż jednemu celowi. Drugie nie pyta o kwotę, tylko o warunek, po którym przestajesz gonić. Trzecie pyta, jak daleko w twoje życie może sięgnąć ryzyko.",
  "section.place.title": "Gdzie, i kto blisko",
  "section.place.note": "Miejsce i ludzie rozchodzą się częściej, niż to wygląda: miasto może być rozstrzygnięte, a to, kto w nim jest, wcale nie — albo odwrotnie. Pierwsze pytanie mierzy jedno, odległość od miejsca, w którym mieszkasz dzisiaj. Drugie dopuszcza dwa zaznaczenia i przez to jest wyborem, a nie listą.",
  "section.week.title": "Ciało i tydzień",
  "section.week.note": "Pierwsze pytanie dotyczy tego, co już oddajesz, a nie tego, co zamierzasz — zamiar ma swoje miejsce w wadze pod spodem. Drugie patrzy na rok do przodu i nazywa rzecz, która poszłaby pod nóż pierwsza.",
  "section.keep.title": "Co zatrzymujesz, co się od ciebie należy",
  "section.keep.note": "Pierwsze pytanie jest tu najtrudniejsze i celowo przyjmuje jedną odpowiedź: przy wielu zaznaczeniach zostaje zatrzymane wszystko, a to nic nie mówi. Zdrowie musi tu stanąć do wyboru na równi z ludźmi, z którymi mieszkasz, i z władzą nad własnymi godzinami. Drugie przyjmuje dwie odpowiedzi.",
  "section.later.title": "Widok z siedemdziesiątki",
  "section.later.note": "Jedno pytanie, ostatnie z zamkniętych — jedenaście stanowisk jest już wypowiedzianych, zanim padnie pytanie, który brak zaboli. „Żadne z nich” jest tu pełną odpowiedzią, a nie wymówką. Zaraz po nim zaczyna się część bez żadnych opcji.",
  "section.open.title": "Wolne miejsce",
  "section.open.note": "Cztery pytania, do których nie ma opcji. Zostają na tym urządzeniu: nie są punktowane, nie ma ich w żadnym linku ani na kartce do wydruku i nie są z niczym porównywane. Ostatnie ma dwa słowa, bo każde następne dawałoby sposób na odpowiedź na łagodniejsze pytanie.",

  /* ── pytania ───────────────────────────────────────────────────────── */
  "stance.work-purpose.prompt": "Po co głównie jest twoja praca?",
  "stance.learn-next.prompt": "Co za dziesięć lat ma ci wychodzić wyraźnie lepiej?",
  "stance.money-for.prompt": "Po co głównie są pieniądze?",
  "stance.enough-point.prompt": "Co musi być prawdą, żeby przestać gonić za zarobkiem?",
  "stance.risk-appetite.prompt": "Czym zaryzykujesz dla pracy, której naprawdę chcesz?",
  "stance.live-where.prompt": "Gdzie chcesz mieszkać za dziesięć lat?",
  "stance.who-near.prompt": "Dla kogo zostaniesz tutaj?",
  "stance.health-effort.prompt": "Co już dzisiaj oddajesz za swoje zdrowie?",
  "stance.less-of.prompt": "Czego najbardziej chcesz mieć mniej w przyszłym roku?",
  "stance.keep-one.prompt": "Gdyby wolno było zatrzymać tylko jedno, to które?",
  "stance.owe-others.prompt": "Co się od ciebie należy ludziom spoza twojego domu?",
  "stance.regret-most.prompt": "Czego nie zrobisz, a będzie ci tego żal po siedemdziesiątce?",

  /* ── co można odpowiedzieć ─────────────────────────────────────────── */
  /* po co praca */
  "stance.work-purpose.opt.income": "Opłacenie życia, które mam poza nią",
  "stance.work-purpose.opt.craft": "Robienie tej jednej rzeczy coraz lepiej",
  "stance.work-purpose.opt.service": "Pożytek dla konkretnych ludzi",
  "stance.work-purpose.opt.standing": "Pozycja — to, że traktują mnie poważnie",
  "stance.work-purpose.opt.structure": "Rytm. Pusty tydzień mi nie służy.",
  "stance.work-purpose.opt.undecided": "Nie mam tego przemyślanego",
  /* czego się nauczyć */
  "stance.learn-next.opt.trade": "To, co robię już teraz",
  "stance.learn-next.opt.newskill": "Nowa umiejętność, jeszcze nietknięta",
  "stance.learn-next.opt.people": "Radzenie sobie z ludźmi, zwłaszcza w sporze",
  "stance.learn-next.opt.temper": "Trzymanie głowy, kiedy się sypie",
  "stance.learn-next.opt.nothing": "Nic. Chcę korzystać z tego, co już mam.",
  "stance.learn-next.opt.unknown": "Jeszcze nie wiem",
  /* po co pieniądze */
  "stance.money-for.opt.safety": "Zapas, żeby nic nie mogło mnie przymusić",
  "stance.money-for.opt.freedom": "Kupowanie sobie wolności mówienia „nie”",
  "stance.money-for.opt.provide": "Utrzymanie ludzi, którzy są ode mnie zależni",
  "stance.money-for.opt.now": "Wydawanie ich teraz na to, co zapamiętam",
  "stance.money-for.opt.give": "Rozdanie ich, póki widzę, gdzie trafiają",
  "stance.money-for.opt.undecided": "Nie mam tego przemyślanego",
  /* gdzie jest dosyć */
  "stance.enough-point.opt.number": "Konkretna kwota na koncie",
  "stance.enough-point.opt.nodebt": "Zero długów, z mieszkaniem włącznie",
  "stance.enough-point.opt.hours": "Kiedy większy zarobek zaczyna kosztować mój czas",
  "stance.enough-point.opt.never": "Nic. Nie zamierzam przestawać.",
  "stance.enough-point.opt.already": "Nic nie musi się zmieniać. Mam już dosyć.",
  "stance.enough-point.opt.unknown": "Nie mam takiej granicy ustalonej",
  /* apetyt na ryzyko */
  "stance.risk-appetite.opt.nothing": "Niczym. Chronię właśnie stabilność.",
  "stance.risk-appetite.opt.months": "Kilkoma miesiącami oszczędności, nie więcej",
  "stance.risk-appetite.opt.savings": "Większością tego, co mam odłożone",
  "stance.risk-appetite.opt.income": "Latami niższych dochodów całego domu",
  "stance.risk-appetite.opt.house": "Mieszkaniem i poziomem życia w nim",
  "stance.risk-appetite.opt.unsure": "Nie wiem, póki tego przed sobą nie mam",
  /* gdzie mieszkać */
  "stance.live-where.opt.here": "Tutaj. To miasto, może nawet ta ulica.",
  "stance.live-where.opt.near": "W godzinie drogi stąd",
  "stance.live-where.opt.country": "Gdzie indziej w tym kraju",
  "stance.live-where.opt.abroad": "W innym kraju",
  "stance.live-where.opt.movable": "Nigdzie na stałe. Chcę móc się ruszyć.",
  "stance.live-where.opt.undecided": "Nie mam tego rozstrzygniętego",
  /* dla kogo tu zostać */
  "stance.who-near.opt.partner": "Dla osoby, z którą mieszkam",
  "stance.who-near.opt.children": "Dla dzieci — własnych albo tych, które pomagam wychować",
  "stance.who-near.opt.parents": "Dla rodziców, póki mnie potrzebują",
  "stance.who-near.opt.friends": "Dla starych przyjaciół, którzy są tutaj",
  "stance.who-near.opt.community": "Dla grupy, na którą tu przychodzę",
  "stance.who-near.opt.nobody": "Dla nikogo. Wyjeżdżam.",
  /* co idzie na zdrowie */
  "stance.health-effort.opt.nothing": "Na razie nic",
  "stance.health-effort.opt.sleep": "Wieczory na mieście, żeby się wyspać",
  "stance.health-effort.opt.drink": "Alkohol albo coś innego, co lubię",
  "stance.health-effort.opt.training": "Dwie, trzy godziny treningu tygodniowo",
  "stance.health-effort.opt.spend": "Pieniądze — jedzenie, leczenie, dentysta",
  "stance.health-effort.opt.checks": "Czas — badania, zanim cokolwiek zaboli",
  /* czego mniej */
  "stance.less-of.opt.hours": "Godzin w pracy",
  "stance.less-of.opt.obligations": "Obowiązków nie z mojego wyboru",
  "stance.less-of.opt.debt": "Długu i tego, na co każe się godzić",
  "stance.less-of.opt.screen": "Czasu przy ekranie w domu",
  "stance.less-of.opt.noise": "Hałasu — ludzi, ruchu, bałaganu, przerywania",
  "stance.less-of.opt.nothing": "Niczego. Rok ma dobry kształt.",
  /* co zatrzymać */
  "stance.keep-one.opt.health": "Zdrowie",
  "stance.keep-one.opt.people": "Ludzi, z którymi mieszkam",
  "stance.keep-one.opt.voice": "Możliwość mówienia tego, co naprawdę myślę",
  "stance.keep-one.opt.time": "Władzę nad własnymi godzinami",
  "stance.keep-one.opt.standard": "Poziom życia, jaki mam teraz",
  "stance.keep-one.opt.unknown": "Nic mnie jeszcze do tego wyboru nie zmusiło",
  /* co się należy innym */
  "stance.owe-others.opt.nothing": "Nic ponad to, żeby dać im spokój",
  "stance.owe-others.opt.money": "Stała część tego, co zarabiam",
  "stance.owe-others.opt.time": "Godziny — obecność, podwiezienie, posiedzenie z kimś",
  "stance.owe-others.opt.parents": "Opieka nad rodzicami, kiedy przyjdzie co do czego",
  "stance.owe-others.opt.useful-work": "Praca przydatna poza tym, co za nią dostaję",
  "stance.owe-others.opt.local": "Obecność tam, gdzie mieszkam",
  /* czego żal */
  "stance.regret-most.opt.children": "Mieć dzieci albo mieć ich więcej",
  "stance.regret-most.opt.venture": "Zacząć to, co ciągle planuję",
  "stance.regret-most.opt.place": "Pomieszkać gdzie indziej, póki jeszcze można",
  "stance.regret-most.opt.mend": "Naprawić jedną relację, póki jest czas",
  "stance.regret-most.opt.body": "Zadbać o ciało, póki się jeszcze regeneruje",
  "stance.regret-most.opt.none": "Żadne z nich. Nie myślę w ten sposób.",

  /* ── zdania do przekazania ─────────────────────────────────────────
     Druga osoba, całe zdania, gotowe do podania komuś bez poprawek. */
  /* to jest w porządku */
  "playbook.ok-harder-not-bigger": "Daj mi trudniejszą wersję zadania, zanim dasz mi większą.",
  "playbook.ok-money-not-title": "Zapłać mi za dodatkową robotę, zamiast awansować mnie za nią.",
  "playbook.ok-name-who-benefits": "Powiedz mi, komu to naprawdę pomaga, a zrobię nawet nudną część.",
  "playbook.ok-give-me-fixed-hours": "Daj mi stałe godziny, a w środku nich zrobię wszystko lepiej.",
  "playbook.ok-stop-offering-growth": "Załóż, że nie szukam nowego wyzwania, i przestań mnie do nich zgłaszać.",
  "playbook.ok-put-me-in-hard-talks": "Wstaw mnie celowo w trudną rozmowę. Właśnie tego się uczę.",
  "playbook.ok-tell-me-when-i-snapped": "Powiedz mi tego samego dnia, kiedy warknę na ciebie.",
  "playbook.ok-ask-before-buffer": "Zapytaj mnie, zanim coś zejdzie z oszczędności. Prawie zawsze się zgodzę.",
  "playbook.ok-shorter-week-first": "Zaproponuj mi krótszy tydzień, zanim zaproponujesz wyższą pensję.",
  "playbook.ok-book-it-now": "Zarezerwuj tę drogą rzecz teraz. Wolę za nią zapłacić, niż na nią czekać.",
  "playbook.ok-ask-me-for-something-specific": "Poproś mnie o pieniądze na jedną konkretną rzecz, a nie na cel.",
  "playbook.ok-no-is-not-modesty": "Uwierz mi, kiedy mówię, że nie chcę większego stanowiska. To nie skromność.",
  "playbook.ok-price-it-in-hours": "Powiedz, ile godzin kosztują te dodatkowe pieniądze, zanim każesz mi decydować.",
  "playbook.ok-risk-stops-at-my-savings": "Przynieś mi ryzykowny plan, póki najgorsze kończy się na moich oszczędnościach.",
  "playbook.ok-safe-version-first": "Przynieś najpierw bezpieczną wersję planu, a wysłucham jej naprawdę uważnie.",
  "playbook.ok-ask-me-to-move": "Poproś mnie o przeprowadzkę, jeśli jest po co. Nie trzyma mnie ten adres.",
  "playbook.ok-find-the-version-that-stays": "Poszukaj takiej wersji tego, która nie wymaga ode mnie wyjazdu.",
  "playbook.ok-bring-me-the-other-city": "Przynieś mi pracę w innym mieście. Nikt mnie tutaj nie trzyma.",
  "playbook.ok-dates-early-for-parents": "Podaj mi terminy wcześnie. Weekendy układam wokół rodziców.",
  "playbook.ok-early-not-late": "Umawiaj mnie z samego rana, a nie późnym wieczorem.",
  "playbook.ok-either-side-of-lunch": "Ustaw spotkanie przed obiadem albo po nim. Środek dnia mam na trening.",
  "playbook.ok-cut-something": "Zdejmij coś z mojej listy. Wolę zrobić mniej rzeczy porządnie.",
  "playbook.ok-ask-before-my-name": "Zapytaj mnie, zanim wpiszesz gdzieś moje nazwisko, choćby przy drobiazgu.",
  "playbook.ok-ask-what-i-think": "Zapytaj, co naprawdę myślę, póki decyzja jest jeszcze otwarta.",
  "playbook.ok-deadline-not-hours": "Daj mi termin, a godziny zostaw mnie.",
  "playbook.ok-call-me-to-show-up": "Zadzwoń, kiedy kogoś trzeba podwieźć, odebrać albo przy kimś posiedzieć.",
  "playbook.ok-tell-me-the-street-needs-it": "Powiedz mi, kiedy trzeba coś zrobić na osiedlu, a przyjdę.",
  "playbook.ok-tell-me-about-the-opening": "Powiedz mi, jeśli usłyszysz o czymś, dla czego warto rzucić tę pracę.",
  "playbook.ok-say-if-i-have-gone-quiet": "Jeśli milknę wobec kogoś, powiedz to wprost. Wolę usłyszeć.",
  "playbook.ok-leave-me-out-of-the-thread": "Zostaw mnie poza grupą na tydzień i nie doszukuj się w tym niczego.",
  /* to nie jest w porządku */
  "playbook.not-reassign-my-work": "Nie oddawaj mojego kawałka komuś szybszemu dlatego, że termin się przesunął.",
  "playbook.not-title-instead-of-money": "Nie dawaj mi tytułu zamiast pieniędzy i nie licz, że przyjmę to jak nagrodę.",
  "playbook.not-remove-the-hours": "Nie zabieraj mi stałych godzin i nie nazywaj tego elastycznością.",
  "playbook.not-unasked-development": "Nie zapisuj mnie na szkolenia, o które nie proszę.",
  "playbook.not-spend-the-buffer": "Nie wydawaj pieniędzy na czarną godzinę na coś, co nią nie jest.",
  "playbook.not-assume-my-income": "Nie układaj planów opartych na moich zarobkach, żeby powiedzieć mi o nich potem.",
  "playbook.not-tell-me-i-have-enough": "Nie mów mi, że mam dosyć. Ta ocena należy do mnie.",
  "playbook.not-laugh-at-the-target": "Nie traktuj kwoty, do której zbieram, jak żartu.",
  "playbook.not-stake-what-i-depend-on": "Nie wkładaj rzeczy, od których zależę, w plan bez mojej zgody.",
  "playbook.not-talk-me-out-of-it": "Nie odwodź mnie od ryzyka, na które już się decyduję.",
  "playbook.not-assume-i-will-move": "Nie traktuj wyprowadzki jako oczywistej odpowiedzi, kiedy zmienia się praca.",
  "playbook.not-assume-i-will-stay": "Nie zakładaj, że za pięć lat nadal będę tu mieszkać.",
  "playbook.not-book-my-parent-weekends": "Nie planuj weekendu, nie pytając, czy nie trzeba mnie u rodziców.",
  "playbook.not-two-weekends-running": "Nie proś mnie o pracę w dwa weekendy z rzędu. Już je liczę.",
  "playbook.not-press-the-drink": "Nie proponuj mi drinka drugi raz, kiedy raz odmawiam.",
  "playbook.not-joke-about-checkups": "Nie żartuj z moich wizyt u lekarza. Chodzenie wcześnie to nie hipochondria.",
  "playbook.not-volunteer-me": "Nie zapisuj mnie na nic, żeby powiedzieć mi o tym po fakcie.",
  "playbook.not-message-me-late": "Nie pisz do mnie o pracy po dwudziestej pierwszej i nie czekaj na odpowiedź.",
  "playbook.not-fill-my-calendar": "Nie zapełniaj mi tygodnia, a potem nie pytaj, czemu warczę na ludzi.",
  "playbook.not-every-evening-out": "Nie wstawiaj czegoś w każdy wieczór. Chcę bywać w domu.",
  "playbook.not-sign-me-up-locally": "Nie zapisuj mnie na zbiórkę, do komitetu ani na festyn.",
  "playbook.not-joke-about-children": "Nie żartuj z tego, czy będę mieć dzieci.",
  "playbook.not-ring-me": "Nie dzwoń, kiedy wystarczy wiadomość.",

  /* ── wolne miejsce ─────────────────────────────────────────────────── */
  "item.open-letter": "List do siebie po siedemdziesiątce. Co ma być wtedy prawdą?",
  "item.open-five": "Jaka jedna rzecz sprawi, że następne pięć lat będzie się liczyło?",
  "item.open-said": "Co mają o tobie powiedzieć ludzie, którzy znali cię najlepiej?",
  "item.open-avoid": "Czego unikasz?",

  /* ── kartka do wydruku ─────────────────────────────────────────────
     Sześć nagłówków na czterech kanałach, w pierwszej osobie i w czasie
     teraźniejszym, bo to jedyna osoba w polszczyźnie, która nie zdradza płci
     tego, kto podaje kartkę. Cztery pytania otwarte nie dają tu nic. */
  "card.work": "Po co jest moja praca",
  "card.money": "Pieniądze i to, gdzie się zatrzymuję",
  "card.health": "Co oddaję za swoje zdrowie",
  "card.less": "Czego chcę mieć mniej",
  "card.place": "Gdzie chcę być i dla kogo tu zostanę",
  "card.keep": "Co zatrzymuję, co się ode mnie należy i czego mogę żałować",

  /* ── strona z wynikiem ─────────────────────────────────────────────
     Dwie listy wag i zdanie nad nimi, a potem jeden akapit, który to narzędzie
     jest winne, a żadne inne nie: co nie zostało zrobione z czterema
     odpowiedziami, których nikt inny nigdy nie zobaczy. */
  "view.weightTitle": "Gdzie leży waga",
  "view.weightNote": "Dwa końce liczb, które podajesz. To, co dostało od czterech do siedmiu, nie zginęło — jest wyżej, w kolejności, w jakiej padały pytania.",
  "view.heaviestTitle": "Co ważysz najwyżej",
  "view.heaviestNote": "Osiem na dziesięć albo więcej. Tutaj pomyłka co do ciebie kosztuje najwięcej.",
  "view.lightestTitle": "Co ważysz najniżej",
  "view.lightestNote": "Trzy na dziesięć albo mniej. Tutaj jest miejsce na ruch, co nie znaczy, że to obojętne.",
  "view.openNote": "Te cztery należą do ciebie. Nic tu nie jest punktowane, nic nie jest zestawiane z odpowiedziami kogokolwiek innego i nic z tego nie trafia do żadnego linku — jest na tej stronie dlatego, że to twoje słowa.",
};
