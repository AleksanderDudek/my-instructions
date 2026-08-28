/**
 * Faith — Polish.
 *
 * Polish forces a choice English never has to make: almost every past tense and
 * every predicate adjective carries the speaker's gender. The reader's gender is
 * unknown, and the playbook lines are sentences they hand to somebody else whose
 * gender is unknown too, so the whole file is built out of forms that do not
 * ask — present and future tense, infinitives, imperatives, verbal nouns and
 * impersonal constructions. Nowhere is the reader made to say "odszedłem" or
 * "odeszłam", and nowhere are they made to call the other person "zaproszony".
 * Where an English line only worked in the past tense it was rewritten rather
 * than translated: "I have left it and hold no faith now" is
 * "Dziś nie mam już żadnej wiary", and "I have not thought about it" is
 * "Nie mam tego przemyślanego".
 *
 * The twelve questions are shorter than a literal rendering would be, because
 * the 80-character gate is measured on this string and Polish runs a quarter
 * longer than the English it would come from.
 *
 * ── The two things this file may not do ───────────────────────────────
 *
 * It may not make one answer the complete one. A Polish reader arrives at this
 * instrument from a country where one confession is the default assumption, so
 * the copy is watched harder here than anywhere: "kościół" is lower case and
 * "mojego Kościoła" carries the capital only where the reader means their own,
 * no option is worded as a departure from a norm, and the section notes say
 * what is asked rather than what a good answer would contain.
 *
 * And it names no era but the one. Where a year appears it is a plain year of
 * our Lord with nothing set beside it.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Wiara",
  "tagline": "Dwanaście stanowisk: co uważasz, ile to dla ciebie waży i na czym się opiera.",
  "framework": "Dwanaście wypowiedzianych stanowisk — nic nie jest oceniane ani punktowane",
  "sourceNote": "Za tym narzędziem nie stoi żaden zwalidowany kwestionariusz i nie ma takiej potrzeby. Badania nad religijnością dały mapę tematu i nic poza tym: pięć wymiarów Glocka z 1962 roku (wiara, praktyka, doświadczenie, wiedza, konsekwencje), obserwacja Davie z 1994 roku, że wiara i przynależność się rozchodzą, oraz konstrukt centralności Hubera i Hubera z 2012 roku — z nich bierze się podział tych dwunastu bloków na to, co się uważa, co się praktykuje, skąd to przyszło i czego dotyka. Skala centralności religijności, Duke University Religion Index, skala orientacji religijnej Allporta i Rossa, Religious Commitment Inventory-10, kwestionariusz siły wiary z Santa Clara oraz pomiar Fetzer/NIA zostały przeczytane; żadna z ich pozycji tutaj nie występuje. Lektura tych narzędzi jest też powodem, dla którego nie ma tu dwóch pytań z wcześniejszej wersji. Drabinka częstości uczestnictwa to kształt pierwszej pozycji DUREL i pozycji CRS o praktyce publicznej, więc to narzędzie pyta, gdzie przynależysz, zamiast jak często chodzisz. Pytanie o to, co rozstrzyga dobro i zło, ma kształt pozycji Pew, a przy tym powtarzało słownik podstaw, który biegnie pod każdym blokiem, więc zostało wycięte, a nie przeredagowane. Nic nie jest punktowane. Nie ma tu miary pobożności ani miary prawowierności, nie ma współczynnika rzetelności ani struktury czynnikowej, bo stanowisko, które wypowiadasz, ich nie ma i nie potrzebuje — nikt nie zestawia cię z próbą, tylko zapisujesz, co uważasz i na czym twoim zdaniem to się opiera. Każdy blok, który zakłada wiarę, ma opcję odrzucającą to założenie, więc formularz idzie od początku do końca tak samo u kogoś, kto trzyma wiarę mocno, u kogoś, kto od niej odszedł, i u kogoś, kto nigdy jej nie miał — żadna z tych trzech odpowiedzi nie jest traktowana jako niepełna. Żaden blok nie pyta o nikogo poza tobą: nie ma tu pytania, do którego osoba odpowiadająca sama musiałaby wymyślić sobie partnera.",

  /* ── pięć rozdziałów ───────────────────────────────────────────────── */
  "section.belief.title": "Co jest trzymane",
  "section.belief.note": "Bóg, śmierć i cierpienie. Na tej stronie nie ma odpowiedzi prawowiernej i nic tu nie jest oceniane.",
  "section.practice.title": "Praktyka i przynależność",
  "section.practice.note": "Jedno pytanie jest o to, kiedy ostatni raz. Drugie o to, gdzie przynależysz. Jedno nie jest dodawane do drugiego i żadne nie mierzy pobożności.",
  "section.lineage.title": "Skąd to przyszło, dokąd idzie",
  "section.lineage.note": "Odległość między wychowaniem a miejscem, w którym dziś stoisz, to, co chcesz przekazać dalej, i to, co ma się wydarzyć w dniu, w którym nie będziesz mógł nic powiedzieć.",
  "section.consequences.title": "Czego to dotyka",
  "section.consequences.note": "Pieniądze i czas. Wiara albo pojawia się na wyciągu i w kalendarzu, albo nie, co jest faktem o gospodarstwie domowym, a nie o duszy.",
  "section.edges.title": "Krawędzie",
  "section.edges.note": "To, w czym nie ma luzu, i to, co pozostaje otwarte. Osoba trzymająca tę kartkę potrzebuje drugiej listy tak samo jak pierwszej.",

  /* ── co jest trzymane ──────────────────────────────────────────────── */
  "stance.god.prompt": "Kim albo czym jest dla ciebie Bóg?",
  "stance.god.opt.close": "Kimś, do kogo mówię i kto mnie słyszy",
  "stance.god.opt.distant": "Kimś rzeczywistym, od kogo czuję dystans",
  "stance.god.opt.impersonal": "Słowem na coś, czego nie umiem nazwać",
  "stance.god.opt.untrue": "Ideą, której nie uważam za prawdziwą",
  "stance.god.opt.open": "Pytaniem, które zostawiam otwarte",
  "stance.god.opt.rather-not": "Wolę nie mówić",
  "stance.god.groundsPrompt": "Na czym opiera się to, co uważasz o Bogu?",

  "stance.after-death.prompt": "Co twoim zdaniem dzieje się po śmierci?",
  "stance.after-death.opt.life-with-god": "Życie trwa dalej w obecności Boga",
  "stance.after-death.opt.another-life": "Kolejne życie, przeżyte na nowo",
  "stance.after-death.opt.something": "Coś trwa, choć nie umiem powiedzieć co",
  "stance.after-death.opt.nothing": "Nic nie trwa",
  "stance.after-death.opt.not-worked-out": "Nie mam tego przemyślanego",
  "stance.after-death.opt.rather-not": "Wolę nie mówić",
  "stance.after-death.groundsPrompt": "Na czym opiera się ta odpowiedź o śmierci?",

  "stance.suffering.prompt": "Dlaczego twoim zdaniem istnieje cierpienie?",
  "stance.suffering.opt.reason-i-trust": "Jest dopuszczone dla powodu, któremu ufam",
  "stance.suffering.opt.reason-unknown": "Jest dopuszczone, a ja nie wiem dlaczego",
  "stance.suffering.opt.no-one-allows": "Nikt go nie dopuszcza — po prostu jest",
  "stance.suffering.opt.people-do-it": "To, co ludzie robią sobie nawzajem",
  "stance.suffering.opt.not-worked-out": "Nie mam tego przemyślanego",
  "stance.suffering.opt.rather-not": "Wolę nie mówić",
  "stance.suffering.groundsPrompt": "Na czym opiera się ta odpowiedź o cierpieniu?",

  /* ── praktyka i przynależność ──────────────────────────────────────── */
  "stance.prayer-last.prompt": "Kiedy była twoja ostatnia modlitwa w samotności?",
  "stance.prayer-last.opt.today": "Dzisiaj",
  "stance.prayer-last.opt.this-week": "W ostatnim tygodniu",
  "stance.prayer-last.opt.this-year": "W ostatnim roku",
  "stance.prayer-last.opt.longer-ago": "Dawniej niż to",
  "stance.prayer-last.opt.never": "Nigdy, o ile wiem",
  "stance.prayer-last.groundsPrompt": "Na czym opiera się twoja praktyka modlitwy?",

  "stance.belonging.prompt": "Gdzie przynależysz w tym, w co wierzysz?",
  "stance.belonging.opt.known-by-name": "Wspólnota, która zna mnie po imieniu",
  "stance.belonging.opt.a-face": "Wspólnota, w której jestem twarzą, nie imieniem",
  "stance.belonging.opt.people-not-institution": "Ludzie, z którymi praktykuję poza instytucją",
  "stance.belonging.opt.tradition-only": "Tradycja, ale żadna grupa ludzi",
  "stance.belonging.opt.nowhere-content": "Nigdzie, z wyboru",
  "stance.belonging.opt.nowhere-missed": "Nigdzie, choć mi tego brakuje",
  "stance.belonging.groundsPrompt": "Na czym opiera się twoja przynależność?",

  /* ── skąd to przyszło, dokąd idzie ─────────────────────────────────── */
  "stance.raised-vs-now.prompt": "Co zmieniło się między wychowaniem a dniem dzisiejszym?",
  "stance.raised-vs-now.opt.stayed": "Nic — trzymam to, w czym mnie wychowano",
  "stance.raised-vs-now.opt.stayed-differently": "Ta sama wiara, trzymana inaczej, niż mnie uczono",
  "stance.raised-vs-now.opt.left": "Dziś nie mam już żadnej wiary",
  "stance.raised-vs-now.opt.found": "Mam wiarę, w której mnie nie wychowano",
  "stance.raised-vs-now.opt.none-either-way": "Wtedy brak wiary, teraz też",
  "stance.raised-vs-now.opt.still-moving": "Wciąż jestem w drodze",
  "stance.raised-vs-now.groundsPrompt": "Na czym opiera się miejsce, w którym dziś stoisz?",

  "stance.children-taught.prompt": "Czego o wierze ma się uczyć dziecko pod twoją opieką?",
  "stance.children-taught.opt.raised-in-it": "Wychowania w mojej wierze, domyślnie",
  "stance.children-taught.opt.taught-then-choose": "Mojej wiary, a potem wolnego wyboru",
  "stance.children-taught.opt.several": "Kilku wiar, z których żadna nie jest wyróżniona",
  "stance.children-taught.opt.none-unless-asked": "Niczego religijnego, dopóki samo nie zapyta",
  "stance.children-taught.opt.undecided": "Nie mam tego rozstrzygniętego",
  "stance.children-taught.groundsPrompt": "Na czym opiera się ta odpowiedź o dziecku?",

  "stance.funeral.prompt": "Co ma się wydarzyć na twoim pogrzebie?",
  "stance.funeral.opt.full-rite": "Obrzęd mojej wiary, w całości",
  "stance.funeral.opt.simple-rite": "Nabożeństwo religijne, krótkie",
  "stance.funeral.opt.words-not-religious": "Słowa nade mną, żadne religijne",
  "stance.funeral.opt.nothing-religious": "Nic religijnego, w żadnej postaci",
  "stance.funeral.opt.whatever-comforts": "To, co pocieszy tych, którzy przyjdą",
  "stance.funeral.opt.undecided": "Nie mam tego rozstrzygniętego",
  "stance.funeral.groundsPrompt": "Na czym opiera się ta odpowiedź o pogrzebie?",

  /* ── czego to dotyka ───────────────────────────────────────────────── */
  "stance.money-use.prompt": "Gdzie twoja wiara ujawnia się w twoich pieniądzach?",
  "stance.money-use.opt.fixed-share": "Stała część dochodu idzie do innych",
  "stance.money-use.opt.give-when-asked": "Daję, gdy ktoś prosi, bez stałej części",
  "stance.money-use.opt.wont-earn": "Są pieniądze, których nie zarobię",
  "stance.money-use.opt.wont-spend": "Są pieniądze, których nie wydam",
  "stance.money-use.opt.touches-nothing": "Nie dotyka żadnych moich pieniędzy",
  "stance.money-use.opt.not-thought": "Nie mam tego przemyślanego",
  "stance.money-use.groundsPrompt": "Na czym opiera się ta odpowiedź o pieniądzach?",

  "stance.work-rest.prompt": "Czy jest czas, który twoja wiara chroni przed pracą?",
  "stance.work-rest.opt.whole-day": "Tak, cały dzień trzymany wolny",
  "stance.work-rest.opt.part-day": "Tak, część dnia",
  "stance.work-rest.opt.in-principle": "W zasadzie tak, choć mi to nie wychodzi",
  "stance.work-rest.opt.no-but-rest": "Nie, choć odpoczywam z innych powodów",
  "stance.work-rest.opt.no": "Nie",
  "stance.work-rest.groundsPrompt": "Na czym opiera się ta odpowiedź o twoim czasie?",

  /* ── krawędzie ─────────────────────────────────────────────────────── */
  "stance.non-negotiable.prompt": "Czego w sprawach wiary nie oddasz?",
  "stance.non-negotiable.opt.children": "Tego, jak wychowywane są dzieci pod moją opieką",
  "stance.non-negotiable.opt.practice": "Praktyki, także tam, gdzie jest niemile widziana",
  "stance.non-negotiable.opt.saying-so": "Mówienia, w co wierzę, kiedy ktoś pyta",
  "stance.non-negotiable.opt.belonging": "Bycia częścią ludzi, z którymi się gromadzę",
  "stance.non-negotiable.opt.left-alone": "Świętego spokoju w tej sprawie",
  "stance.non-negotiable.opt.nothing": "Nic tutaj nie jest poza dyskusją",
  "stance.non-negotiable.groundsPrompt": "Na czym opiera się ta odmowa?",

  "stance.unsettled.prompt": "Co do czego naprawdę nie masz pewności?",
  "stance.unsettled.opt.god-exists": "Czy Bóg w ogóle jest",
  "stance.unsettled.opt.after-death": "Co dzieje się po śmierci",
  "stance.unsettled.opt.suffering": "Dlaczego cierpienie jest dopuszczone",
  "stance.unsettled.opt.tradition-right": "Czy tradycja, z której pochodzę, ma rację",
  "stance.unsettled.opt.own-honesty": "Czy wierzę, czy tylko trzymam nawyk",
  "stance.unsettled.opt.nothing-unsure": "Żadna z tych spraw nie jest u mnie otwarta",
  "stance.unsettled.groundsPrompt": "Na czym opiera się ta niepewność?",

  /* ── na czym się to opiera ─────────────────────────────────────────
     Jeden słownik pod wszystkimi dwunastoma pytaniami. "Pismo" musi być tym
     samym słowem pod każdym z nich, bo inaczej dwóch odpowiedzi nie da się
     odczytać jako tej samej podstawy. */
  "stance.grounds.scripture": "Pismo",
  "stance.grounds.church": "Nauczanie mojego Kościoła",
  "stance.grounds.reason": "Rozum i argument",
  "stance.grounds.experience": "Własne doświadczenie",
  "stance.grounds.upbringing": "Wychowanie",
  "stance.grounds.people": "Ludzie, którym ufam",
  "stance.grounds.not-worked-out": "Nie mam tego przemyślanego",

  /* ── zdania do przekazania ─────────────────────────────────────────
     Druga osoba, całe zdania, gotowe do podania komuś bez poprawek. */
  /* to jest w porządku */
  "playbook.ok-call-me-on-the-day": "Możesz zadzwonić w dniu, który trzymam wolny, jeśli naprawdę coś się dzieje. Wolę taki telefon.",
  "playbook.ok-pray-around-me": "Możesz dalej rozmawiać i chodzić po pokoju, kiedy się modlę. Cisza nie jest do tego potrzebna.",
  "playbook.ok-ask-me-straight": "Możesz zapytać wprost, czy w to wierzę. Dostaniesz prostą odpowiedź i nie będzie długa.",
  "playbook.ok-say-i-dont-look-it": "Możesz powiedzieć, że nie wyglądam na kogoś, kto w to wierzy. Wiem, jak to wygląda. A jednak tak jest.",
  "playbook.ok-say-grace": "Możesz zmówić modlitwę przy swoim stole, kiedy przy nim siedzę. Będę cicho i nic mnie to nie kosztuje.",
  "playbook.ok-invite-me-anyway": "Możesz zaprosić mnie na nabożeństwo przy swoim ślubie albo chrzcie dziecka. Przyjdę.",
  "playbook.ok-ask-me-along": "Możesz zaprosić mnie ze sobą. Drugie pytanie jest w porządku, nie unikam tego celowo.",
  "playbook.ok-name-the-old-parish": "Możesz mówić o kościele mojego dzieciństwa bez ściszania głosu. To nie jest rana.",
  "playbook.ok-answer-my-kids-honestly": "Możesz szczerze odpowiadać moim dzieciom na pytania o twoją wiarę, także tam, gdzie się ze mną nie zgadzasz.",
  "playbook.ok-take-them-along": "Weź dziecko ze sobą tam, dokąd chodzisz. Chcę, żeby to widziało, zanim będzie wybierać.",
  "playbook.ok-ask-what-i-give": "Możesz zapytać, ile oddaję i kto to dostaje. Ta kwota nie jest tajemnicą.",
  "playbook.ok-call-out-the-slip": "Możesz mi wytknąć, że ten czas miał zostać wolny, a praca go zajęła. To uczciwe.",
  "playbook.ok-plain-speech-about-death": "Możesz mówić przy mnie o czyjejś śmierci bez szukania osłony w słowach. Prosta mowa jest dla mnie łatwiejsza.",
  "playbook.ok-bring-hard-questions": "Możesz przynieść mi najtrudniejsze pytanie o cierpienie, jakie masz. Nie zamierzam niczego bronić.",
  "playbook.ok-ask-in-public": "Możesz zapytać przy innych, w co wierzę. Wolę odpowiedzieć, niż żeby ktoś mnie przed tym chronił.",
  /* to nie jest w porządku */
  "playbook.no-small-work-messages": "Nie pisz do mnie w sprawach pracy w dniu, który trzymam wolny — nawet krótko.",
  "playbook.no-phase-talk": "Nie opisuj mojej modlitwy jako nastroju albo etapu, przez który przechodzę.",
  "playbook.no-praying-over-me": "Nie módl się nade mną bez pytania mnie o zgodę.",
  "playbook.no-treating-it-as-taste": "Nie traktuj tego, co uważam, jak mojego gustu, zamiast jak twierdzenia, które uważam za prawdziwe.",
  "playbook.no-fixing-the-distance": "Nie traktuj mojego dystansu do Boga jak problemu, który masz za mnie rozwiązać.",
  "playbook.no-you-will-return": "Nie mów mi, że wrócę do tego na starość. Już to znam i brzmi jak lekceważenie.",
  "playbook.no-unexamined-assumption": "Nie zakładaj braku namysłu tylko dlatego, że wychowano mnie w tej wierze.",
  "playbook.no-service-detour": "Nie zabieraj moich dzieci na nabożeństwo innej wiary bez pytania mnie o zgodę.",
  "playbook.notok-baptism-without-me": "Nie doprowadzaj do chrztu ani błogosławieństwa dziecka beze mnie w pokoju.",
  "playbook.no-filling-in-my-view": "Nie mów ludziom, co według mnie dzieje się po śmierci, kiedy ktoś umarł. Nie mam tego rozstrzygniętego.",
  "playbook.no-supplying-the-reason": "Nie podawaj mi powodu tego, co się stało. Uważam, że powód jest i że nie jest mi dany.",
  "playbook.no-raiding-the-giving": "Nie traktuj tego, co oddaję, jak pieniędzy dostępnych na coś innego.",
  "playbook.no-improvising-the-funeral": "Nie improwizuj na moim pogrzebie. Obrzęd jest spisany i chcę, żeby był odprawiony tak, jak stoi.",
  "playbook.no-doubt-as-ammunition": "Nie wyciągaj moich wątpliwości w sporze, który jest o czymś innym.",
  "playbook.no-deciding-without-me": "Nie ustalaj niczego o religijnym wychowaniu moich dzieci, kiedy nie ma mnie w pokoju.",

  /* ── kartka do wydruku ─────────────────────────────────────────────
     Sześć nagłówków na trzech kanałach. To nie są rozdziały formularza:
     rozdziały to kolejność pytań, a kartkę czyta się w środku dnia. */
  "card.holds": "Co uważam i na czym to się opiera",
  "card.belong": "Gdzie przynależę",
  "card.passed-on": "Dzieci, mój pogrzeb i moje pieniądze",
  "card.kept-clear": "Czas, który moja wiara trzyma wolny",
  "card.no-give": "Czego nie oddam",
  "card.still-open": "Czego nie mam rozstrzygniętego",

  /* ── strona wyniku ─────────────────────────────────────────────────── */
  "view.rests": "Opiera się na:",
  "view.heaviest.title": "Sprawy o największej wadze",
  "view.heaviest.note": "Pytania, przy których waga jest najwyższa. Nic tu nie jest sumowane ani z nikim porównywane — to miejsca, w których według ciebie jest najmniej luzu, a osoba czytająca tę kartkę powinna o nich wiedzieć, zanim w któreś wejdzie.",
  "view.lightest.title": "Sprawy o najmniejszej wadze",
  "view.lightest.note": "Odpowiedzi z najniższą wagą. To nie to samo co brak stanowiska: to twoje zdanie, że jest tu miejsce na ruch, a dla osoby czytającej tę kartkę jest to warte tyle samo, co lista powyżej.",
};
