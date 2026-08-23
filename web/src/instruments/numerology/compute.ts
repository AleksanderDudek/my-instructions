import { WEST, TRIAD, HARMONY, FRIENDLY, ELEM_PAIR } from "./data";
import { zodiacYear, westernSign } from "./calendar";

/** Whatever `profile()` returns — the chart every other function here reads. */
export type Chart = ReturnType<typeof profile>;

/**
 * Reduction. Every number in a chart is a digital root: 18 becomes 9, never 0.
 * The one exception is an absolute difference of equal operands, which is a
 * true 0 and is kept as one.
 */
/* ══ arithmetic ═══════════════════════════════════════════════════ */
const pad2 = (n: number | string) => String(n).padStart(2, "0");
const digits = (s: number | string) => [...String(s)].map(Number);
const sumd = (s: number | string) => digits(s).reduce((a: number, b: number) => a + b, 0);
/* digital root: 18 → 9, never 0. A true 0 (from a subtraction) stays 0. */
const dr = (n: number) => (n === 0 ? 0 : n % 9 === 0 ? 9 : n % 9);
function reduceMaster(n: number) {
  const steps: number[] = [n];
  while (n > 9 && n !== 11 && n !== 22 && n !== 33){ n = sumd(n); steps.push(n); }
  return {value:n, steps};
}

function profile(d: number, m: number, y: number, name: string) {
  const DD = pad2(d), MM = pad2(m), YYYY = String(y);
  const A = dr(sumd(MM)), B = dr(sumd(DD)), C = dr(sumd(YYYY));
  const rise1 = dr(A+B), rise2 = dr(B+C);
  const spire = dr(rise1+rise2);
  const crown = dr(A+C);
  const root1 = dr(Math.abs(A-B)), root2 = dr(Math.abs(B-C));
  const base  = dr(Math.abs(root1-root2));

  const total = sumd(DD+MM+YYYY);
  const destiny = reduceMaster(total);

  const counts: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) counts[i] = 0;
  for (const g of digits(DD+MM+YYYY)) if (g > 0) counts[g]++;

  const zy = zodiacYear(y,m,d);
  const sign = westernSign(m,d);

  const chartNums = [A,B,C,rise1,rise2,spire,crown,root1,root2,base,destiny.value];

  /* Indices and identifiers, never words. A chart computed by a Polish reader
     has to be byte-identical to the same date computed by a German one, or the
     two of them cannot be compared — and the result is what gets stored. */
  return {name:name||"", d,m,y, DD,MM,YYYY,
    weekdayIndex: new Date(y,m-1,d).getDay(),
    A,B,C, rise1,rise2, spire, crown, root1,root2, base,
    total, destiny, counts, chartNums,
    animalIdx: ((zy.year-1900)%12+12)%12,
    elementIdx: ((zy.year-1900)%10+10)%10,
    polarity: zy.year % 2 === 0 ? "yang" : "yin",
    zodiacYear: zy.year, cnyExact: zy.exact, cny: zy.cny,
    sign, signElement: WEST[sign][1]};
}

/**
 * Two charts, one composite. `t` renders the notes; every score above them is
 * computed from numbers alone, so the verdict is the same in every language.
 */
function match(a: Chart, b: Chart, t: (k: string, v?: Record<string, string | number>) => string) {
  const na = a.destiny.value > 9 ? sumd(a.destiny.value) : a.destiny.value;
  const nb = b.destiny.value > 9 ? sumd(b.destiny.value) : b.destiny.value;
  let nScore, nNote;
  if (FRIENDLY[na].includes(nb)){ nScore = 32; nNote = t("match.numbersFriendly", {a:na, b:nb, nameA:t(`num.${na}.inline`), nameB:t(`num.${nb}.inline`)}); }
  else if (na === nb){ nScore = 26; nNote = t("match.numbersSame", {n:na}); }
  else { nScore = 14; nNote = t("match.numbersApart", {a:na, b:nb}); }

  const ia = a.animalIdx, ib = b.animalIdx, gap = Math.abs(ia-ib);
  const cyc = Math.min(gap, 12-gap);
  let cScore, cNote;
  const animals = {a: t(`animal.${ia}.name`), b: t(`animal.${ib}.name`)};
  if (TRIAD.some(tri => tri.includes(ia) && tri.includes(ib))){ cScore = 28; cNote = t("match.zodiacTriad", animals); }
  else if (HARMONY.some(h => h.includes(ia) && h.includes(ib))){ cScore = 26; cNote = t("match.zodiacHarmony", animals); }
  else if (cyc === 6){ cScore = 4; cNote = t("match.zodiacOpposed", animals); }
  else if (cyc === 3){ cScore = 12; cNote = t("match.zodiacAbrasive", animals); }
  else { cScore = 18; cNote = t("match.zodiacNeutral", animals); }

  const ea = a.signElement, eb = b.signElement;
  let wScore, wNote;
  if (ea === eb){ wScore = 22; wNote = t(`match.elementsSame.${ea}`); }
  else {
    wScore = ELEM_PAIR[ea+"|"+eb] ?? ELEM_PAIR[eb+"|"+ea] ?? 15;
    const pair = {a: t(`element.${ea}`), b: t(`element.${eb}`)};
    wNote = wScore >= 20 ? t("match.elementsFeed", pair) : wScore >= 14 ? t("match.elementsEffort", pair) : t("match.elementsDampen", pair);
  }

  const pa = new Set([1,2,3,4,5,6,7,8,9].filter(n=>a.counts[n]>0));
  const pb = new Set([1,2,3,4,5,6,7,8,9].filter(n=>b.counts[n]>0));
  const union = new Set([...pa,...pb]), inter = [...pa].filter(n=>pb.has(n));
  const gScore = Math.round(11*(union.size/9) + 7*(inter.length/Math.max(1,union.size)));
  const aFills = [...pa].filter(n=>!pb.has(n)), bFills = [...pb].filter(n=>!pa.has(n));
  const gNote = t("match.squares", {lit: union.size, shared: inter.length});

  const total = nScore + cScore + wScore + gScore;
  const bandKey = total >= 85 ? "match.band.rare" : total >= 70 ? "match.band.strong"
    : total >= 55 ? "match.band.workable" : total >= 40 ? "match.band.effortful" : "match.band.frictional";
  const unionNum = dr(na + nb);
  return {total, band: t(bandKey), unionNum, aFills, bFills, inter,
    parts:[{t:t("match.part.numbers"),v:nScore,max:32,note:nNote},
           {t:t("match.part.zodiac"),v:cScore,max:28,note:cNote},
           {t:t("match.part.elements"),v:wScore,max:22,note:wNote},
           {t:t("match.part.squares"),v:gScore,max:18,note:gNote}]};
}

export { pad2, digits, sumd, dr, reduceMaster, profile, match };
