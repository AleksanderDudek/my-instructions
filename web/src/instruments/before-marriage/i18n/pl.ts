/**
 * before-marriage — Polish.
 *
 * Written in Polish rather than rendered out of the English, on the same terms
 * as the other three stated-position instruments.
 *
 * Polish makes the speaker's gender audible where English never has to: almost
 * every past tense, every conditional and every predicative adjective picks a
 * side. The reader's gender is unknown, and the playbook lines are sentences
 * they hand to somebody else whose gender is unknown too, so the whole file is
 * built out of forms that do not ask — present and future tense, imperatives,
 * infinitives, verbal nouns and impersonal constructions. Nowhere is the reader
 * made to choose between "zniosłem" and "zniosłam", and nowhere is the other
 * person handed a gender they did not pick. Where an English line only worked
 * in the past or the conditional it was thought again rather than translated:
 * "Nothing we would not already have" is "Nic ponad to, co już mamy", "I have
 * never thought about a number" is "Nie mam na to liczby w głowie", and "I
 * would take it badly" is "Źle to zniosę".
 *
 * The plural past was the same trap the family-plan file records. "Nigdy o tym
 * nie rozmawialiście" is not a sentence two women are handed, so the sourceNote
 * says "które z tych tematów nigdy między wami nie padły" — the subject is the
 * subjects, not the couple.
 *
 * ── The word for the other person ─────────────────────────────────────
 *
 * English "your spouse" has no Polish equivalent that leaves the question open:
 * "mąż" and "żona" decide, and "współmałżonek" is a form filled in at an
 * office. Every prompt and every option therefore runs through "druga osoba",
 * which is the word `couple-conversations` and `family-plan` already use in
 * Polish, and through "ślub" — "brać ślub" and "po ślubie" are the two things
 * in this whole subject that carry no gender at all. The one place a gendered
 * word stands is `final-say.opt.husband`: "Mąż" is the position somebody really
 * holds, and an option set that will not print it collects a false answer from
 * the people who hold it.
 *
 * ── Two questions that are a Polish map, not an English one ───────────
 *
 * `parents-distance` is measured in "godzina drogi" rather than an hour's
 * drive: a Polish reader who lives two towns from a parent counts the journey,
 * not the car, and a train or a bus is the journey for a great many of them.
 * "The same town" is "Ta sama miejscowość", which covers a village — "miasto"
 * would have quietly excluded half the country.
 *
 * `place-type` has no clean three-way split in Polish either. "A town" is
 * "Małe miasto" rather than "miasteczko", which in Polish reads as a size
 * somebody grew out of; "a village or open country" is "Wieś albo dom na
 * uboczu", because those are the two things a Polish household actually
 * chooses between once the city is off the list.
 *
 * ── Length ────────────────────────────────────────────────────────────
 *
 * The 80-character gate is measured on the Polish string and Polish runs
 * roughly a quarter longer than the English it would come from, so the fifteen
 * were written short here rather than translated and then trimmed. "What does
 * being married add that living together does not?" is "Co daje ślub, czego
 * nie daje samo mieszkanie razem?", and "Which of these would you treat as
 * breaking the marriage?" is "Co z tego uznajesz za koniec małżeństwa?" —
 * shorter than the English, and the question people ask in Polish.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Przed ślubem",
  "tagline": "Piętnaście stanowisk wobec lat po ślubie — każde z wagą, którą mu nadajesz.",
  "framework": "Piętnaście zapisanych stanowisk — nagłówki Gottmanów, żadne z ich pytań",
  "sourceNote": "Pięć nagłówków, na których to stoi, należy do Gottmanów i to właśnie nagłówki są tu częścią publiczną — pieniądze, plany życiowe, porozumiewanie się i konflikt, wartości oraz oczekiwania i zobowiązanie są tematem wpisu na blogu, który każdy może przeczytać. Nic więcej z ich dorobku tu nie ma. Kwestionariusze i talie kart Gottmanów objęte są prawem autorskim, sprzedawane i rozprowadzane na licencji, i żadne z nich nie zostało tu powielone, sparafrazowane ani odtworzone — każde pytanie powyżej napisano na potrzeby tej aplikacji. Trzech z pięciu nagłówków brakuje tu również celowo. O pieniądze porządnie pytają Pieniądze w domu, o dzieci i wszystko, co z nich wynika, Plan rodziny, o wiarę Wiara, a o sposób kłócenia się Styl konfliktu — pytanie o to samo jeszcze raz dałoby piętnaście pytań, na które ta aplikacja gdzie indziej odpowiada lepiej. Zostaje to, czego nie pokrywa nic innego w katalogu: co każde z was rozumie przez słowo małżeństwo, ile z tygodnia zostaje twoje i gdzie dwie kariery pozwolą wam mieszkać. Brakuje jednej rzeczy, której można by się tutaj spodziewać. To narzędzie nie pyta, czy przemoc kończy małżeństwo. Zapytać o to znaczyłoby poprosić cię o przewidzenie własnego zachowania w kryzysie, którego jeszcze nie było, a tego te narzędzia nie robią nigdy — i wydrukowałoby odpowiedź na kartce, którą można potem obrócić przeciwko osobie, która ją zaznaczyła. Jeśli to pytanie jest u ciebie żywe, nie jest to pytanie do strony internetowej. Jeśli to twoje pierwsze narzędzie z tego zestawu, zacznij od Rozmów. Zapisują one, które z tych tematów nigdy między wami nie padły, co jest tańsze i bardziej przydatne do sprawdzenia, i zmienia to, co zrobisz z tym narzędziem. Potem to, a potem Pieniądze w domu i Plan rodziny, które wchodzą głęboko w dwa tematy celowo stąd wycięte. Co do tego, czy cokolwiek z tego działa: dwa największe badania z randomizacją nad edukacją okołomałżeńską, Building Strong Families i Supporting Healthy Marriage, nie znalazły żadnego efektu na to, czy pary zostawały razem, a najlepiej przeprowadzona metaanaliza edukacji przedmałżeńskiej pokazuje, że efekt na jakość związku nie przeżywa doliczenia badań nieopublikowanych. To narzędzie nigdy nie było sprawdzane i niczego nie twierdzi. Zapisuje to, co powiesz, ile to waży i dlaczego.",

  /* ── pięć rozdziałów ──────────────────────────────────────────────── */
  "section.commitment.title": "Zobowiązanie i oczekiwania",
  "section.commitment.note": "Piąty nagłówek Gottmanów wzięty dosłownie. W co się wchodzi, co by to złamało i co się dzieje, kiedy żadne z was nie ustąpi. Nic tutaj nie dotyczy tego, jak się kłócicie — to należy do Stylu konfliktu i do Przywiązania. Nic tutaj nie pyta też o przemoc, a powód nota o źródłach podaje wprost.",
  "section.time.title": "Czas razem i osobno",
  "section.time.note": "Też piąty nagłówek. Bycie razem naprzeciw czasu osobno, pytane liczbami i długościami, a nie uczuciami, bo to liczbę człowiek naprawdę zna. Wieczory, po które sięgasz, i te, które zostawiasz wolne, to jeden rachunek, więc padają na jednej stronie.",
  "section.independence.title": "Przyjaźnie i osobność",
  "section.independence.note": "Reszta piątego nagłówka: kto już jest w twoim kręgu, co się stanie z przyjaźnią, którą masz, i co nie idzie do wspólnego. Każde pytanie tutaj mówi o twoim własnym życiu, a żadne nie ustanawia reguły nad cudzym — reguły wobec drugiej osoby mieszkają w Granicach.",
  "section.careers.title": "Praca i przeprowadzki",
  "section.careers.note": "Z drugiego nagłówka, Planów życiowych, i tylko z jego wątku zawodowego. Dzieci poszły do Planu rodziny, wiara do Wiary, a pieniądze do Pieniędzy w domu, więc żadne z nich nie pada tu drugi raz.",
  "section.settling.title": "Gdzie osiądziecie",
  "section.settling.note": "Też Plany życiowe: osiadanie. W jakim miejscu spodziewasz się mieszkać, jak daleko od własnych rodziców i kto jeszcze wyląduje pod tym dachem. Nic innego w tej aplikacji o to nie pyta.",

  /* ── piętnaście pytań ─────────────────────────────────────────────── */
  "stance.marriage-means.prompt": "Co daje ślub, czego nie daje samo mieszkanie razem?",
  "stance.grounds-to-end.prompt": "Co z tego uznajesz za koniec małżeństwa?",
  "stance.final-say.prompt": "Kto ma ostatnie słowo, gdy ważna decyzja utknie?",
  "stance.evenings-together.prompt": "Ile wieczorów w tygodniu chcesz spędzać razem?",
  "stance.alone-time.prompt": "Ile czasu dla siebie potrzebujesz w zwykłym tygodniu?",
  "stance.holiday-apart.prompt": "Czy wyjedziesz na wakacje bez drugiej osoby?",
  "stance.who-knows.prompt": "Kto zna szczerą wersję twojego najgorszego miesiąca?",
  "stance.closest-friend.prompt": "Co stanie się z twoją najbliższą przyjaźnią po ślubie?",
  "stance.kept-to-myself.prompt": "Co z tego zostaje po ślubie tylko twoje?",
  "stance.career-lead.prompt": "Gdy dwie kariery się zderzą, czyja ma być ważniejsza?",
  "stance.relocation.prompt": "Czy przeprowadzisz się za granicę dla pracy drugiej osoby?",
  "stance.nights-away.prompt": "Ile nocy w miesiącu poza domem dla pracy jest do przyjęcia?",
  "stance.place-type.prompt": "W jakim miejscu spodziewasz się mieszkać?",
  "stance.parents-distance.prompt": "Jak daleko od swoich rodziców chcesz mieszkać?",
  "stance.household-who.prompt": "Kto jeszcze może z wami zamieszkać?",

  /* ── co można odpowiedzieć ────────────────────────────────────────── */
  /* co daje ślub */
  "stance.marriage-means.opt.permanence": "Odejście przestaje być opcją",
  "stance.marriage-means.opt.vow": "To ślubowanie przed Bogiem",
  "stance.marriage-means.opt.witnessed": "To mówi się przy świadkach",
  "stance.marriage-means.opt.legal": "Zmienia stan prawny",
  "stance.marriage-means.opt.nothing": "Nic ponad to, co już mamy",
  "stance.marriage-means.opt.unsure": "Nie mam tego rozstrzygniętego",
  /* koniec małżeństwa */
  "stance.grounds-to-end.opt.affair": "Zdrada fizyczna",
  "stance.grounds-to-end.opt.emotional": "Romans bez seksu",
  "stance.grounds-to-end.opt.money-lies": "Duży dług ukrywany przede mną",
  "stance.grounds-to-end.opt.addiction": "Nieleczone uzależnienie",
  "stance.grounds-to-end.opt.drift": "Lata, w których żadne z nas się nie stara",
  "stance.grounds-to-end.opt.none": "Żadne z tego",
  /* ostatnie słowo */
  "stance.final-say.opt.stall": "Nikt. Nic się nie rusza bez zgody obojga",
  "stance.final-say.opt.domain": "Rozstrzyga, czyja to dziedzina",
  "stance.final-say.opt.cares-more": "Rozstrzyga, komu bardziej zależy",
  "stance.final-say.opt.husband": "Mąż",
  "stance.final-say.opt.outsider": "Ktoś, komu oboje ufamy",
  "stance.final-say.opt.unsure": "Nie mam tego rozstrzygniętego",
  /* wieczory razem */
  "stance.evenings-together.opt.nearly-all": "Prawie każdy wieczór",
  "stance.evenings-together.opt.most": "Cztery albo pięć",
  "stance.evenings-together.opt.some": "Dwa albo trzy",
  "stance.evenings-together.opt.few": "Jeden, jeśli w ogóle",
  "stance.evenings-together.opt.never-counted": "Nie mam na to liczby w głowie",
  /* czas dla siebie */
  "stance.alone-time.opt.snatched": "Godzina tu i tam",
  "stance.alone-time.opt.evening": "Jeden wieczór dla siebie",
  "stance.alone-time.opt.day": "Większość dnia",
  "stance.alone-time.opt.more": "Więcej niż dzień",
  "stance.alone-time.opt.none": "Nie potrzebuję czasu dla siebie",
  /* wakacje osobno */
  "stance.holiday-apart.opt.yearly": "Tak, w większości lat",
  "stance.holiday-apart.opt.sometimes": "Tak, od czasu do czasu",
  "stance.holiday-apart.opt.reason": "Tylko z konkretnego powodu",
  "stance.holiday-apart.opt.no": "Nie",
  "stance.holiday-apart.opt.unsure": "Nie wiem",
  /* kto zna szczerą wersję */
  "stance.who-knows.opt.nobody": "Nikt",
  "stance.who-knows.opt.friend": "Przyjaciel albo przyjaciółka",
  "stance.who-knows.opt.parent": "Mama albo tata",
  "stance.who-knows.opt.sibling": "Brat albo siostra",
  "stance.who-knows.opt.clergy": "Ksiądz albo pastor",
  "stance.who-knows.opt.counsellor": "Terapeuta",
  /* najbliższa przyjaźń */
  "stance.closest-friend.opt.unchanged": "Zostaje dokładnie taka, jaka jest",
  "stance.closest-friend.opt.less-often": "Zostaje, choć rzadziej się widujemy",
  "stance.closest-friend.opt.becomes-ours": "Staje się przyjaźnią nas obojga",
  "stance.closest-friend.opt.fades": "Rozluźnia się i to w porządku",
  "stance.closest-friend.opt.unsure": "Nie mam tego przemyślanego",
  /* co zostaje tylko moje */
  "stance.kept-to-myself.opt.space": "Własny pokój albo biurko",
  "stance.kept-to-myself.opt.evening": "Jeden wieczór w tygodniu",
  "stance.kept-to-myself.opt.friend": "Przyjaźń, która zostaje moja",
  "stance.kept-to-myself.opt.hobby": "Zajęcie, do którego nikt się nie przyłącza",
  "stance.kept-to-myself.opt.quiet": "Godziny, w których nikt się do mnie nie odzywa",
  "stance.kept-to-myself.opt.nothing": "Nic takiego",
  /* czyja kariera */
  "stance.career-lead.opt.mine": "Moja",
  "stance.career-lead.opt.spouse": "Drugiej osoby",
  "stance.career-lead.opt.earner": "Tej osoby, która akurat więcej zarabia",
  "stance.career-lead.opt.loses-more": "Tej osoby, która więcej traci, ustępując",
  "stance.career-lead.opt.alternate": "Na zmianę, przez lata",
  "stance.career-lead.opt.unsure": "Nie mam tego rozstrzygniętego",
  /* wyjazd za granicę */
  "stance.relocation.opt.yes": "Tak",
  "stance.relocation.opt.fixed-term": "Tak, jeśli ustalimy datę powrotu",
  "stance.relocation.opt.near-only": "Tylko tam, skąd łatwo wrócić do domu",
  "stance.relocation.opt.no": "Nie",
  "stance.relocation.opt.unsure": "Nie wiem",
  /* noce poza domem */
  "stance.nights-away.opt.none": "Żadnej",
  "stance.nights-away.opt.up-to-three": "Do trzech",
  "stance.nights-away.opt.up-to-week": "Do tygodnia",
  "stance.nights-away.opt.more": "Więcej niż tydzień",
  "stance.nights-away.opt.unsure": "Nie wiem",
  /* jakie miejsce */
  "stance.place-type.opt.city": "Duże miasto",
  "stance.place-type.opt.town": "Małe miasto",
  "stance.place-type.opt.country": "Wieś albo dom na uboczu",
  "stance.place-type.opt.indifferent": "Nie ma to dla mnie znaczenia",
  "stance.place-type.opt.no-idea": "Nie mam pojęcia",
  /* jak daleko od rodziców */
  "stance.parents-distance.opt.same-town": "Ta sama miejscowość",
  "stance.parents-distance.opt.hour": "Nie dalej niż godzina drogi",
  "stance.parents-distance.opt.hours": "Kilka godzin drogi",
  "stance.parents-distance.opt.flight": "Tak daleko, że trzeba lecieć",
  "stance.parents-distance.opt.no-preference": "Nie ma to dla mnie znaczenia",
  "stance.parents-distance.opt.na": "To mnie nie dotyczy",
  /* kto jeszcze pod dachem */
  "stance.household-who.opt.my-parent": "Któreś z moich rodziców",
  "stance.household-who.opt.their-parent": "Któreś z rodziców drugiej osoby",
  "stance.household-who.opt.sibling": "Brat albo siostra",
  "stance.household-who.opt.friend": "Ktoś ze znajomych w trudnym momencie",
  "stance.household-who.opt.lodger": "Lokator płacący czynsz",
  "stance.household-who.opt.nobody": "Nikt poza nami",

  /* ── zdania do przekazania ────────────────────────────────────────── */
  /* to jest w porządku */
  "playbook.ok-first-hour": "Daj mi godzinę spokoju, kiedy wracam do domu. To nie dąsy i to nie o tobie.",
  "playbook.ok-book-tuesday": "Umów się na coś swojego we wtorek, nie pytając mnie wcześniej.",
  "playbook.ok-week-away": "Wyjedź na tydzień beze mnie. Nic sobie z tego nie dopowiem i nie potrzebuję żadnych zapewnień.",
  "playbook.ok-one-friend-knows": "Zakładaj, że ktoś ze znajomych zna szczerą wersję mojego złego tygodnia. Potrzebuję kogoś z zewnątrz.",
  "playbook.ok-friend-stays": "Moja najstarsza przyjaźń zostaje. Nie musisz tej osoby lubić, a ja z niej nie zrezygnuję.",
  "playbook.ok-my-desk": "Jedno biurko w tym domu jest moje. Nie sprzątaj go i nie kładź na nim swoich rzeczy.",
  "playbook.ok-quiet-hours": "Niech pierwsza godzina rano będzie cicha. To nie humory i to nie o tobie.",
  "playbook.ok-abroad-with-date": "Przynieś mi tę pracę za granicą, jeśli ma datę końca. Na czas określony się zgadzam.",
  "playbook.ok-send-the-listing": "Wyślij mi ogłoszenie z tamtego kraju. Nie mówię tego dla efektu. Mówię serio.",
  "playbook.ok-take-the-trip": "Wypuść mnie na ten wyjazd. Tydzień poza domem to u mnie normalna praca, a nie wybór pracy zamiast ciebie.",
  "playbook.ok-your-turn": "Bierz ten awans teraz. Mój jest następny w kolejce. Chcę, żeby to zostało powiedziane na głos już dziś.",
  "playbook.ok-sunday-lunch": "Zgadzaj się na niedzielę u moich rodziców w większość tygodni. Bliskość z nimi jest czymś, czego naprawdę chcę.",
  "playbook.ok-ask-about-parent": "Zapytaj mnie porządnie o to, żeby któreś z moich rodziców tu zamieszkało, zanim to wykluczysz.",
  "playbook.ok-bring-someone-in": "Kiedy utkniemy, poproś kogoś, komu oboje ufamy. To nie jest działanie ponad moją głową i tak tego nie potraktuję.",
  /* to nie jest w porządku */
  "playbook.no-card-then-tell": "Nie bierz dużego wydatku na kartę, żeby powiedzieć mi po fakcie. Akurat po tym nie pozbieram się szybko.",
  "playbook.no-follow-me": "Nie idź za mną do drugiego pokoju, żeby dokończyć rozmowę. Poczekaj, aż wrócę.",
  "playbook.no-fill-my-week": "Nie zajmuj czterech wieczorów w tygodniu bez pytania mnie. Większość wieczorów musi być nasza.",
  "playbook.no-week-away": "Nie rezerwuj tygodnia wyjazdu beze mnie. Źle to zniosę i wolę powiedzieć to teraz, niż udawać, że jest inaczej.",
  "playbook.no-tell-your-mother": "Nie opowiadaj swojej mamie o naszych kłótniach. To, co dzieje się między nami, nie wychodzi z domu.",
  "playbook.no-secret-friendship": "Nie utrzymuj przyjaźni, o której nie wolno mi wiedzieć. Problemem jest ukrywanie, a nie ta osoba.",
  "playbook.no-decide-then-inform": "Nie rozstrzygaj wielkich spraw i nie stawiaj mnie przed faktem. Nic się nie rusza, dopóki naprawdę oboje się nie zgodzimy.",
  "playbook.no-divorce-word": "Nie używaj słowa rozwód w kłótni. Ani razu, ani jako groźby, ani żeby coś udowodnić.",
  "playbook.no-move-for-your-job": "Nie zgadzaj się na przeprowadzkę w moim imieniu. Miejsce, w którym mieszkamy, idzie za moją pracą, i chcę, żeby to wybrzmiało przed ślubem.",
  "playbook.no-apply-abroad": "Nie startuj do pracy w innym kraju, żeby dopiero potem mnie zapytać. Za granicę się nie przeprowadzam.",
  "playbook.no-overnight-work": "Nie zgłaszaj mnie do niczego, co każe mi nocować poza domem. Ani raz w miesiącu, ani raz na kwartał.",
  "playbook.no-move-us-to-a-field": "Nie osadzaj nas tam, gdzie po chleb trzeba jechać samochodem. Wiem, jak to się dla mnie kończy.",
  "playbook.no-near-parents": "Nie osadzaj nas w jednej miejscowości z twoimi ani z moimi rodzicami. Chcę, żeby dzieliła nas droga.",
  "playbook.no-spare-room": "Nie oferuj nikomu naszego wolnego pokoju, zanim mnie nie zapytasz. Ani swojemu bratu, ani na dwa tygodnie.",

  /* ── kartka do wydruku ────────────────────────────────────────────── */
  "card.word": "Co dodaje samo słowo",
  "card.mine": "Co zostaje moje",
  "card.roof": "Gdzie mieszkamy i kto jeszcze z nami",
  "card.breaking": "Co to kończy i kto rozstrzyga",
  "card.week": "Wieczory i czas osobno",
  "card.careers": "Dwie kariery i przeprowadzki",

  /* ── strona wyniku ────────────────────────────────────────────────── */
  "view.weightTitle": "Gdzie padła waga",
  "view.weightNote": "Wagi, które tu nadajesz, odczytane z dwóch końców. To, co znalazło się między czwórką a siódemką, nie zniknęło — jest wyżej, w kolejności, w jakiej padły pytania.",
  "view.heaviestTitle": "Co waży u ciebie najwięcej",
  "view.heaviestNote": "Osiem albo więcej na dziesięć. To te sprawy, w których dowiedzieć się o czymś dopiero po fakcie kosztuje najwięcej.",
  "view.lightestTitle": "Co waży u ciebie najmniej",
  "view.lightestNote": "Trzy albo mniej na dziesięć. Jest tu miejsce na ruch, co nie znaczy, że ci to obojętne.",
};
