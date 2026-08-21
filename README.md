# Ninefold Almanac

A birth date, reduced. Enter a date and the page returns its Chinese zodiac
animal, its Western sign, its numerological destiny number, a pyramid of sums
and differences, and a square of nine counting the digits of the date itself.
Two dates can be read against each other.

No dependencies, no build tooling, no framework. Vanilla ES modules, served
static.

```
npm run dev     # http://localhost:5173
npm test        # 16 unit tests, node:test
npm run build   # dist/ninefold.html — the whole app as one file
```

## What it computes

**The core row** takes each part of the date on its own — `MM`, `DD`, `YYYY` —
sums its digits and reduces:

```
8 January 1993   →   MM 01 → 1     DD 08 → 8     YYYY 1993 → 22 → 4
```

**Rising rows** add adjacent pairs and reduce; **falling rows** subtract them,
take the absolute value, and reduce. The **crown** joins month and year
directly, skipping the day:

```
CROWN                    5              |  1 + 4
SPIRE                    3              |  9 + 3 → 12
RISE               9          3         |  1+8 ;  8+4 → 12
CORE           1       8       4        |  month, day, year        → 31 → 4
ROOT               7          4         |  |1−8| ;  |8−4|
BASE                     3              |  |7−4|
```

**The destiny number** sums every digit of `DDMMYYYY` and reduces: 31 → 4.

**The square of nine** drops a pip into a cell for each occurrence of a digit
in the date. The arrangement is fixed:

```
3 6 9
2 4 8
1 5 7
```

## Three decisions worth knowing

**The Chinese animal turns at Chinese New Year, not on 1 January.** This is the
most common bug in birth-chart software, and it is why `src/data.js` carries a
table of 151 real Chinese New Year dates rather than a `(year - 1900) % 12`.
8 January 1993 falls before the 23 January boundary, so it reads Monkey — not
Rooster. Outside 1900–2050 the boundary is estimated at 4 February and the page
says so.

**"Modulo 9" means the digital root.** In numerology 18 reduces to 9, never 0.
The one exception is a subtraction of two equal values, which is a genuine 0 and
is kept as one — those cells render dimmed.

**Master numbers survive.** A digit total of 11, 22, or 33 is not reduced
further.

## Layout

```
index.html          markup and the font link
styles.css          tokens first; light and dark are both designed
src/data.js         tables — CNY dates, animals, signs, number meanings
src/calendar.js     zodiac-year and sign boundaries, leap years
src/numerology.js   digital root, profile(), match()
src/views.js        pure functions returning HTML strings
src/main.js         input wiring and URL-hash state
tools/serve.mjs     static server (ES modules need an origin)
tools/build.mjs     inlines everything into dist/ninefold.html
test/               node:test, no runner to install
```

`src/views.js` never reads the DOM and `src/numerology.js` never writes it, so
the tests import exactly the code the page runs.

State lives in the URL hash — `#1993-01-08~Ada_1990-06-14~Grace` — so any chart
is a link.

## Accuracy, honestly

The calendar and the arithmetic are exact and tested. The interpretations are
traditional readings, not claims. For amusement and pattern-hunting.

MIT.
