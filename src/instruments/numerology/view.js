import { NUM, MONTHS } from "./data.js";
import { digits, sumd } from "./compute.js";
import { esc } from "../../core/html.js";

/**
 * Rendering. Every function here returns an HTML string and touches no state.
 */
/* ══ the pyramid, drawn ═══════════════════════════════════════════ */
function pyramidSVG(p){
  const X = {l:200, c:380, r:560, ml:290, mr:470}, Y = {crown:50, spire:145, rise:240, core:335, root:430, base:520};
  const node = (x,y,v,kind,cap,tip,delay) => `
    <g class="node reveal" style="animation-delay:${delay}ms">
      <title>${esc(tip)}</title>
      <circle class="disc ${kind}" cx="${x}" cy="${y}" r="30"/>
      <text class="val${v===0?" zero":""}" x="${x}" y="${y}">${v}</text>
      <text class="cap" x="${x}" y="${y+47}">${esc(cap)}</text>
    </g>`;
  const edge = (x1,y1,x2,y2,k) => `<line class="edge ${k}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  const rowLab = (y,t) => `<text class="row-label" x="14" y="${y+4}">${t}</text>`;

  return `<div class="scroller"><svg class="pyramid" viewBox="0 0 900 585" role="img"
      aria-label="Reduction pyramid for ${esc(p.pretty)}: core ${p.A}, ${p.B}, ${p.C}; crown ${p.crown}; base ${p.base}.">
    ${rowLab(Y.crown,"Crown")}${rowLab(Y.spire,"Spire")}${rowLab(Y.rise,"Rise")}
    ${rowLab(Y.core,"Core")}${rowLab(Y.root,"Root")}${rowLab(Y.base,"Base")}

    ${edge(X.l,Y.core,X.ml,Y.rise,"sum")}${edge(X.c,Y.core,X.ml,Y.rise,"sum")}
    ${edge(X.c,Y.core,X.mr,Y.rise,"sum")}${edge(X.r,Y.core,X.mr,Y.rise,"sum")}
    ${edge(X.ml,Y.rise,X.c,Y.spire,"sum")}${edge(X.mr,Y.rise,X.c,Y.spire,"sum")}
    ${edge(X.l,Y.core,X.ml,Y.root,"diff")}${edge(X.c,Y.core,X.ml,Y.root,"diff")}
    ${edge(X.c,Y.core,X.mr,Y.root,"diff")}${edge(X.r,Y.core,X.mr,Y.root,"diff")}
    ${edge(X.ml,Y.root,X.c,Y.base,"diff")}${edge(X.mr,Y.root,X.c,Y.base,"diff")}
    <path class="edge axis" d="M ${X.l} ${Y.core} Q 90 170 ${X.c} ${Y.crown}"/>
    <path class="edge axis" d="M ${X.r} ${Y.core} Q 660 170 ${X.c} ${Y.crown}"/>
    <line class="edge axis" x1="${X.r+32}" y1="${Y.core}" x2="650" y2="${Y.core}" stroke-dasharray="0"/>
    <polygon points="658,335 646,330 646,340" fill="var(--brass)"/>

    <rect class="badge" x="658" y="298" width="222" height="74" rx="3"/>
    <text class="badge-k" x="678" y="322">ALL DIGITS ${p.total} ${"→"} DESTINY</text>
    <text class="badge-v" x="678" y="357">${p.destiny.value}${p.destiny.value>9?'<tspan class="badge-k" dx="10">master</tspan>':""}</text>

    ${node(X.c,Y.crown,p.crown,"axis","M+Y",`Month ${p.A} + Year ${p.C} = ${p.A+p.C} → ${p.crown}`,560)}
    ${node(X.c,Y.spire,p.spire,"sum","SUM",`${p.rise1} + ${p.rise2} = ${p.rise1+p.rise2} → ${p.spire}`,420)}
    ${node(X.ml,Y.rise,p.rise1,"sum","M+D",`Month ${p.A} + Day ${p.B} = ${p.A+p.B} → ${p.rise1}`,280)}
    ${node(X.mr,Y.rise,p.rise2,"sum","D+Y",`Day ${p.B} + Year ${p.C} = ${p.B+p.C} → ${p.rise2}`,280)}
    ${node(X.l,Y.core,p.A,"core","MONTH",`MM ${p.MM}: ${digits(p.MM).join(" + ")} = ${sumd(p.MM)} → ${p.A}`,0)}
    ${node(X.c,Y.core,p.B,"core","DAY",`DD ${p.DD}: ${digits(p.DD).join(" + ")} = ${sumd(p.DD)} → ${p.B}`,90)}
    ${node(X.r,Y.core,p.C,"core","YEAR",`YYYY ${p.YYYY}: ${digits(p.YYYY).join(" + ")} = ${sumd(p.YYYY)} → ${p.C}`,180)}
    ${node(X.ml,Y.root,p.root1,"diff","|M−D|",`|${p.A} − ${p.B}| = ${Math.abs(p.A-p.B)} → ${p.root1}`,280)}
    ${node(X.mr,Y.root,p.root2,"diff","|D−Y|",`|${p.B} − ${p.C}| = ${Math.abs(p.B-p.C)} → ${p.root2}`,280)}
    ${node(X.c,Y.base,p.base,"diff","DIFF",`|${p.root1} − ${p.root2}| = ${Math.abs(p.root1-p.root2)} → ${p.base}`,420)}
  </svg></div>
  <div class="legend">
    <span class="k-sum"><i></i>Rising — each pair added, then reduced</span>
    <span class="k-diff"><i></i>Falling — each pair subtracted, absolute, reduced</span>
    <span class="k-axis"><i></i>Crown axis — month and year, skipping the day</span>
  </div>`;
}

/* ══ square of nine ═══════════════════════════════════════════════ */
const SQUARE = [[3,6,9],[2,4,8],[1,5,7]];
function squareHTML(p){
  let cells = "";
  SQUARE.forEach((row,ri) => row.forEach((n,ci) => {
    const c = p.counts[n];
    cells += `<div class="cell" data-n="${Math.min(c,4)}" style="animation-delay:${(ri*3+ci)*45}ms">
      <span class="d num">${n}</span>
      ${c ? `<span class="ct num">${c}×</span>` : ""}
      <span class="pips">${"<b></b>".repeat(c)}</span></div>`;
  }));

  const present = [1,2,3,4,5,6,7,8,9].filter(n => p.counts[n] > 0);
  const missing = [1,2,3,4,5,6,7,8,9].filter(n => p.counts[n] === 0);
  const max = Math.max(...Object.values(p.counts));
  const strongest = present.filter(n => p.counts[n] === max);

  /* lines complete in THIS arrangement (3 6 9 / 2 4 8 / 1 5 7) */
  const lines = [];
  const has = n => p.counts[n] > 0;
  const named = [["Top row",[3,6,9]],["Middle row",[2,4,8]],["Bottom row",[1,5,7]],
    ["Left column",[3,2,1]],["Centre column",[6,4,5]],["Right column",[9,8,7]],
    ["Diagonal ╲",[3,4,7]],["Diagonal ╱",[9,4,1]]];
  for (const [nm,set] of named) if (set.every(has)) lines.push(nm);

  return `<div class="square-wrap">
    <div class="square">${cells}</div>
    <div class="readout prose">
      <dl>
        <dt>Digits read</dt><dd class="num">${digits(p.DD+p.MM+p.YYYY).join(" · ")} <span style="color:var(--muted)">(zeros are not placed)</span></dd>
        <dt>Present</dt><dd class="chips">${present.map(n=>`<span class="chip on">${n}<span style="color:var(--muted)"> ×${p.counts[n]}</span></span>`).join("")||"—"}</dd>
        <dt>Absent</dt><dd class="chips">${missing.map(n=>`<span class="chip off">${n}</span>`).join("")||"<span style='color:var(--muted)'>none — every digit appears</span>"}</dd>
        <dt>Heaviest</dt><dd>${strongest.map(n=>`<strong>${n} — ${NUM[n][0]}</strong>`).join(", ")} <span style="color:var(--muted)">at ${max}×</span></dd>
        <dt>Full lines</dt><dd>${lines.length ? lines.join(", ") : "<span style='color:var(--muted)'>none complete</span>"}</dd>
      </dl>
      <p style="margin-top:18px;color:var(--muted);font-size:.88rem">Each occurrence of a digit in <span class="num">DDMMYYYY</span> drops a pip into its cell. Density is emphasis; an empty cell is a gap the chart never fills on its own.</p>
    </div>
  </div>`;
}

/* ══ identity strip ═══════════════════════════════════════════════ */
function identityHTML(p){
  const approx = p.cnyExact ? "" : " <span style='color:var(--madder)'>(boundary estimated)</span>";
  const cnyStr = p.cny.d+" "+MONTHS[p.cny.m-1];
  return `<div class="identity reveal">
    <div class="ident">
      <span class="label">${p.name ? "Whose chart" : "The date"}</span>
      <span class="big">${p.name ? esc(p.name) : esc(p.pretty)}</span>
      <span class="sub">${p.name ? esc(p.pretty)+" · " : ""}${p.weekday} · written <span class="num">${p.DD}·${p.MM}·${p.YYYY}</span></span>
    </div>
    <div class="ident">
      <span class="glyph">${p.animal[1]}</span>
      <span class="big">${p.element} ${p.animal[0]}</span>
      <span class="sub">${p.polarity} · lunar year ${p.zodiacYear}, opened ${cnyStr}${approx}. ${esc(p.animal[2])}</span>
    </div>
    <div class="ident">
      <span class="glyph">${p.signGlyph}</span>
      <span class="big">${p.sign}</span>
      <span class="sub">${p.signElement} sign. ${esc(p.signBlurb)}</span>
    </div>
    <div class="ident destiny">
      <span class="label">Destiny number</span>
      <span class="big">${p.destiny.value}<small> ← ${p.destiny.steps.join(" ← ")}</small></span>
      <span class="sub"><strong style="color:var(--ink)">${NUM[p.destiny.value][0]}.</strong> ${esc(NUM[p.destiny.value][1])}</span>
    </div>
  </div>`;
}

function meaningsHTML(p){
  const set = new Set(p.chartNums);
  return `<div class="meanings reveal">${[1,2,3,4,5,6,7,8,9].map(n => `
    <div class="mean${set.has(n)?" present":""}">
      <span class="n">${n}</span>
      <div><h3>${NUM[n][0]}</h3><p>${esc(NUM[n][1])}</p></div>
    </div>`).join("")}</div>
   <p style="color:var(--muted);font-size:.87rem;margin-top:14px">Lit numbers are the ones this chart actually produced${p.destiny.value>9?`, plus the master ${p.destiny.value} — ${NUM[p.destiny.value][0]}`:""}.</p>`;
}

function duelCard(p,accent){
  return `<div style="--accent:${accent}">
    <h3>${p.name ? esc(p.name) : p.pretty}</h3>
    <p class="when">${p.name ? esc(p.pretty)+" · " : ""}${p.weekday}</p>
    <div class="row"><span>Chinese</span><span>${p.animal[1]} ${p.element} ${p.animal[0]} <span style="color:var(--muted)">(${p.polarity})</span></span></div>
    <div class="row"><span>Western</span><span>${p.signGlyph} ${p.sign} <span style="color:var(--muted)">(${p.signElement})</span></span></div>
    <div class="row"><span>Destiny</span><span class="num" style="color:var(--brass);font-size:1.15rem">${p.destiny.value}</span></div>
    <div class="row"><span>Core</span><span class="num">${p.A} · ${p.B} · ${p.C}</span></div>
    <div class="row"><span>Crown / Base</span><span class="num">${p.crown} / ${p.base}</span></div>
  </div>`;
}

export { pyramidSVG, squareHTML, identityHTML, meaningsHTML, duelCard };
