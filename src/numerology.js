import { ANIMALS, ELEMENTS, WEST, NUM, MONTHS, DAYS, TRIAD, HARMONY, FRIENDLY, ELEM_PAIR } from "./data.js";
import { zodiacYear, westernSign } from "./calendar.js";

/**
 * Reduction. Every number in a chart is a digital root: 18 becomes 9, never 0.
 * The one exception is an absolute difference of equal operands, which is a
 * true 0 and is kept as one.
 */
/* ══ arithmetic ═══════════════════════════════════════════════════ */
const pad2 = n => String(n).padStart(2,"0");
const digits = s => [...String(s)].map(Number);
const sumd = s => digits(s).reduce((a,b)=>a+b,0);
/* digital root: 18 → 9, never 0. A true 0 (from a subtraction) stays 0. */
const dr = n => n === 0 ? 0 : (n % 9 === 0 ? 9 : n % 9);
function reduceMaster(n){
  const steps = [n];
  while (n > 9 && n !== 11 && n !== 22 && n !== 33){ n = sumd(n); steps.push(n); }
  return {value:n, steps};
}

function profile(d,m,y,name){
  const DD = pad2(d), MM = pad2(m), YYYY = String(y);
  const A = dr(sumd(MM)), B = dr(sumd(DD)), C = dr(sumd(YYYY));
  const rise1 = dr(A+B), rise2 = dr(B+C);
  const spire = dr(rise1+rise2);
  const crown = dr(A+C);
  const root1 = dr(Math.abs(A-B)), root2 = dr(Math.abs(B-C));
  const base  = dr(Math.abs(root1-root2));

  const total = sumd(DD+MM+YYYY);
  const destiny = reduceMaster(total);

  const counts = {}; for (let i=1;i<=9;i++) counts[i]=0;
  for (const g of digits(DD+MM+YYYY)) if (g > 0) counts[g]++;

  const zy = zodiacYear(y,m,d);
  const animal = ANIMALS[((zy.year-1900)%12+12)%12];
  const element = ELEMENTS[((zy.year-1900)%10+10)%10];
  const polarity = zy.year % 2 === 0 ? "Yang" : "Yin";
  const sign = westernSign(m,d);

  const chartNums = [A,B,C,rise1,rise2,spire,crown,root1,root2,base,destiny.value];

  return {name:name||"", d,m,y, DD,MM,YYYY,
    weekday: DAYS[new Date(y,m-1,d).getDay()],
    pretty: d+" "+MONTHS[m-1]+" "+y,
    A,B,C, rise1,rise2, spire, crown, root1,root2, base,
    total, destiny, counts, chartNums,
    animalIdx: ((zy.year-1900)%12+12)%12, animal, element, polarity,
    zodiacYear: zy.year, cnyExact: zy.exact, cny: zy.cny,
    sign, signGlyph: WEST[sign][0], signElement: WEST[sign][1], signBlurb: WEST[sign][2]};
}

function match(a,b){
  const na = a.destiny.value > 9 ? sumd(a.destiny.value) : a.destiny.value;
  const nb = b.destiny.value > 9 ? sumd(b.destiny.value) : b.destiny.value;
  let nScore, nNote;
  if (FRIENDLY[na].includes(nb)){ nScore = 32; nNote = `${na} and ${nb} run on compatible fuel — ${NUM[na][0].toLowerCase().replace("the ","")} meets ${NUM[nb][0].toLowerCase().replace("the ","")}.`; }
  else if (na === nb){ nScore = 26; nNote = `Both ${na}. Instant recognition, and the same blind spot twice.`; }
  else { nScore = 14; nNote = `${na} and ${nb} want different things from a day. Not fatal; not automatic.`; }

  const ia = a.animalIdx, ib = b.animalIdx, gap = Math.abs(ia-ib);
  const cyc = Math.min(gap, 12-gap);
  let cScore, cNote;
  if (TRIAD.some(t => t.includes(ia) && t.includes(ib))){ cScore = 28; cNote = `${a.animal[0]} and ${b.animal[0]} sit in the same triangle of affinity — the classic alliance.`; }
  else if (HARMONY.some(h => h.includes(ia) && h.includes(ib))){ cScore = 26; cNote = `${a.animal[0]} and ${b.animal[0]} are a six-harmony pair — quiet, durable, unglamorous.`; }
  else if (cyc === 6){ cScore = 4; cNote = `${a.animal[0]} directly opposes ${b.animal[0]} across the wheel. The traditional clash: real heat, real cost.`; }
  else if (cyc === 3){ cScore = 12; cNote = `${a.animal[0]} and ${b.animal[0]} stand a quarter apart — old texts call this the abrasive angle.`; }
  else { cScore = 18; cNote = `${a.animal[0]} and ${b.animal[0]} neither ally nor collide. Neutral ground.`; }

  const ea = a.signElement, eb = b.signElement;
  let wScore, wNote;
  if (ea === eb){ wScore = 22; wNote = `Two ${ea.toLowerCase()} signs — same instincts, same excesses.`; }
  else { wScore = ELEM_PAIR[ea+"|"+eb] ?? ELEM_PAIR[eb+"|"+ea] ?? 15;
    wNote = wScore >= 20 ? `${ea} and ${eb} feed each other.` : wScore >= 14 ? `${ea} and ${eb} coexist with effort.` : `${ea} and ${eb} dampen each other — one wants heat, the other doesn't.`; }

  const pa = new Set([1,2,3,4,5,6,7,8,9].filter(n=>a.counts[n]>0));
  const pb = new Set([1,2,3,4,5,6,7,8,9].filter(n=>b.counts[n]>0));
  const union = new Set([...pa,...pb]), inter = [...pa].filter(n=>pb.has(n));
  const gScore = Math.round(11*(union.size/9) + 7*(inter.length/Math.max(1,union.size)));
  const aFills = [...pa].filter(n=>!pb.has(n)), bFills = [...pb].filter(n=>!pa.has(n));
  const gNote = `Together the two squares light ${union.size} of 9 cells, sharing ${inter.length}.`;

  const total = nScore + cScore + wScore + gScore;
  const band = total >= 85 ? "Rare" : total >= 70 ? "Strong" : total >= 55 ? "Workable" : total >= 40 ? "Effortful" : "Frictional";
  const unionNum = dr(na + nb);
  return {total, band, unionNum, aFills, bFills, inter,
    parts:[{t:"Destiny numbers",v:nScore,max:32,note:nNote},
           {t:"Chinese zodiac",v:cScore,max:28,note:cNote},
           {t:"Western elements",v:wScore,max:22,note:wNote},
           {t:"Squares of nine",v:gScore,max:18,note:gNote}]};
}

export { pad2, digits, sumd, dr, reduceMaster, profile, match };
