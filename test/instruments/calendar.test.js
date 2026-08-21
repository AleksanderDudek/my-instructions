import { test } from "node:test";
import assert from "node:assert/strict";
import { ANIMALS, ELEMENTS, CNY, CUTS, FRIENDLY } from "../../src/instruments/numerology/data.js";
import { cnyOf, zodiacYear, westernSign, daysIn } from "../../src/instruments/numerology/calendar.js";
import { profile } from "../../src/instruments/numerology/compute.js";

/* profile() returns indices rather than names — the chart has to mean the same
   thing in every language — so the tests name them through the same table the
   English message file was generated from. */
const animalOf = (d, m, y) => ANIMALS[profile(d, m, y, "").animalIdx][0];
const elementOf = (d, m, y) => ELEMENTS[profile(d, m, y, "").elementIdx];
const polarityOf = (d, m, y) => profile(d, m, y, "").polarity;

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
  assert.equal(elementOf(8, 1, 1993), "Water");
  assert.equal(polarityOf(8, 1, 1993), "yang");   // lunar year 1992 is even
  assert.equal(profile(8, 1, 1993, "").zodiacYear, 1992);

  assert.equal(elementOf(14, 6, 1990), "Metal");
  assert.equal(animalOf(14, 6, 1990), "Horse");
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
