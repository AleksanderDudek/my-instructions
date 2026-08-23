import { CNY, CUTS } from "./data";

/**
 * Calendar boundaries. The Chinese animal turns at Chinese New Year, not on
 * 1 January — the single most common error in birth-chart software.
 */
const daysIn = (m: number, y: number) => [31,(y%4===0&&y%100!==0)||y%400===0?29:28,31,30,31,30,31,31,30,31,30,31][m-1];

function cnyOf(y: number) {
  const s = CNY[y - 1900] as string | undefined;
  return s ? {m:+s[0], d:+s.slice(1), exact:true} : {m:2, d:4, exact:false};
}
function zodiacYear(y: number, m: number, d: number) {
  const c = cnyOf(y);
  const before = m < c.m || (m === c.m && d < c.d);
  return {year: before ? y-1 : y, exact: c.exact, cny: c};
}
function westernSign(m: number, d: number) {
  for (const [cm, cd, name] of CUTS) if (m < cm || (m === cm && d <= cd)) return name;
  return "Capricorn";
}

export { daysIn, cnyOf, zodiacYear, westernSign };
