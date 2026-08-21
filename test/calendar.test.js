import { test } from "node:test";
import assert from "node:assert/strict";
import { CNY, CUTS, FRIENDLY } from "../src/data.js";
import { cnyOf, zodiacYear, westernSign, daysIn } from "../src/calendar.js";
import { profile } from "../src/numerology.js";

const animalOf = (d, m, y) => profile(d, m, y, "").animal[0];

test("the Chinese New Year table covers 1900–2050 with plausible dates", () => {
  assert.equal(CNY.length, 151);
  CNY.forEach((entry, i) => {
    const year = 1900 + i;
    const { m, d } = cnyOf(year);
    assert.match(entry, /^[12]\d\d$/, `${year} is malformed`);
    // Chinese New Year always falls between 21 January and 21 February.
    const dayOfYear = m === 1 ? d : 31 + d;
    assert.ok(dayOfYear >= 21 && dayOfYear <= 52, `${year} falls outside the valid window`);
  });
});

test("the animal turns at Chinese New Year, not on 1 January", () => {
  // 1993 opened on 23 January, so early January 1993 is still the Monkey year.
  assert.equal(animalOf(22, 1, 1993), "Monkey");
  assert.equal(animalOf(23, 1, 1993), "Rooster");
  assert.equal(animalOf(8, 1, 1993), "Monkey");

  assert.equal(animalOf(31, 12, 2023), "Rabbit");
  assert.equal(animalOf(9, 2, 2024), "Rabbit");
  assert.equal(animalOf(10, 2, 2024), "Dragon");

  assert.equal(animalOf(1, 1, 2000), "Rabbit");
  assert.equal(animalOf(5, 2, 2000), "Dragon");
});

test("stem element and polarity follow the ten-year cycle", () => {
  const p = profile(8, 1, 1993, "");
  assert.equal(p.element, "Water");
  assert.equal(p.polarity, "Yang");        // lunar year 1992 is even
  assert.equal(p.zodiacYear, 1992);

  assert.equal(profile(14, 6, 1990, "").element, "Metal");
  assert.equal(profile(14, 6, 1990, "").animal[0], "Horse");
});

test("years outside the table fall back to an estimated boundary and say so", () => {
  assert.equal(cnyOf(2051).exact, false);
  assert.equal(zodiacYear(2051, 1, 1).exact, false);   // zodiacYear takes (year, month, day)
  assert.equal(zodiacYear(1993, 1, 8).exact, true);
});

test("western signs switch on the documented cusp days", () => {
  const cusps = [
    [19, 1, "Capricorn"], [20, 1, "Aquarius"], [18, 2, "Aquarius"], [19, 2, "Pisces"],
    [20, 3, "Pisces"], [21, 3, "Aries"], [19, 4, "Aries"], [20, 4, "Taurus"],
    [20, 5, "Taurus"], [21, 5, "Gemini"], [20, 6, "Gemini"], [21, 6, "Cancer"],
    [22, 7, "Cancer"], [23, 7, "Leo"], [22, 8, "Leo"], [23, 8, "Virgo"],
    [22, 9, "Virgo"], [23, 9, "Libra"], [22, 10, "Libra"], [23, 10, "Scorpio"],
    [21, 11, "Scorpio"], [22, 11, "Sagittarius"], [21, 12, "Sagittarius"], [22, 12, "Capricorn"],
    [31, 12, "Capricorn"], [1, 1, "Capricorn"],
  ];
  for (const [d, m, expected] of cusps) {
    assert.equal(westernSign(m, d), expected, `${d}/${m}`);
  }
});

test("every day of every month resolves to exactly one sign", () => {
  const seen = new Set();
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= daysIn(m, 2001); d++) seen.add(westernSign(m, d));
  }
  assert.equal(seen.size, 12);
});

test("daysIn knows the leap-year rules, including the century exceptions", () => {
  assert.equal(daysIn(2, 2024), 29);
  assert.equal(daysIn(2, 2023), 28);
  assert.equal(daysIn(2, 1900), 28);   // divisible by 100, not by 400
  assert.equal(daysIn(2, 2000), 29);   // divisible by 400
  assert.equal(daysIn(4, 2024), 30);
});

test("the numerological affinity table is symmetric", () => {
  for (const [a, partners] of Object.entries(FRIENDLY)) {
    for (const b of partners) {
      assert.ok(FRIENDLY[b].includes(Number(a)), `${a}→${b} is not returned`);
    }
  }
});
