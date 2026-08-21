import { ANIMALS, ELEMENTS, WEST } from "./data.js";
import { digits, sumd } from "./compute.js";
import { esc } from "../../core/html.js";

/**
 * Rendering. Every function here returns an HTML string and touches no state.
 *
 * Dates are formatted by `Intl.DateTimeFormat` rather than from a table of
 * month names. Twelve months and seven weekdays per language is exactly the
 * kind of list that drifts, and the platform already knows them — including
 * that Polish wants "8 stycznia" and not "8 styczeń".
 */

const dateOf = (p) => new Date(p.y, p.m - 1, p.d);
const longDate = (p, locale) =>
  new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(dateOf(p));
const weekdayOf = (p, locale) =>
  new Intl.DateTimeFormat(locale, { weekday: "long" }).format(dateOf(p));
/** A day and month with no year — the Chinese New Year boundary. */
const dayMonth = (m, d, locale) =>
  new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(new Date(2001, m - 1, d));

const animalName = (p, t) => t(`animal.${p.animalIdx}.name`);
const animalGlyph = (p) => ANIMALS[p.animalIdx][1];
const elementName = (p, t) => t(`element.${ELEMENTS[p.elementIdx]}`);

/* ══ the pyramid, drawn ═══════════════════════════════════════════ */
function pyramidSVG(p, t, locale){
  const X = {l:200, c:380, r:560, ml:290, mr:470}, Y = {crown:50, spire:145, rise:240, core:335, root:430, base:520};
  const node = (x,y,v,kind,cap,tip,delay) => `
    <g class="node reveal" style="animation-delay:${delay}ms">
      <title>${esc(tip)}</title>
      <circle class="disc ${kind}" cx="${x}" cy="${y}" r="30"/>
      <text class="val${v===0?" zero":""}" x="${x}" y="${y}">${v}</text>
      <text class="cap" x="${x}" y="${y+47}">${esc(cap)}</text>
    </g>`;
  const edge = (x1,y1,x2,y2,k) => `<line class="edge ${k}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  const rowLab = (y,key) => `<text class="row-label" x="14" y="${y+4}">${esc(t(key))}</text>`;

  return `<div class="scroller"><svg class="pyramid" viewBox="0 0 900 585" role="img"
      aria-label="${esc(t("pyramid.alt", {date: longDate(p, locale), a: p.A, b: p.B, c: p.C, crown: p.crown, base: p.base}))}">
    ${rowLab(Y.crown,"pyramid.row.crown")}${rowLab(Y.spire,"pyramid.row.spire")}${rowLab(Y.rise,"pyramid.row.rise")}
    ${rowLab(Y.core,"pyramid.row.core")}${rowLab(Y.root,"pyramid.row.root")}${rowLab(Y.base,"pyramid.row.base")}

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
    <text class="badge-k" x="678" y="322">${esc(t("pyramid.allDigits", {total: p.total}))}</text>
    <text class="badge-v" x="678" y="357">${p.destiny.value}${p.destiny.value>9?`<tspan class="badge-k" dx="10">${esc(t("pyramid.master"))}</tspan>`:""}</text>

    ${node(X.c,Y.crown,p.crown,"axis",t("pyramid.cap.crown"),t("pyramid.tip.crown",{a:p.A,c:p.C,sum:p.A+p.C,out:p.crown}),560)}
    ${node(X.c,Y.spire,p.spire,"sum",t("pyramid.cap.sum"),t("pyramid.tip.plain",{x:p.rise1,y:p.rise2,sum:p.rise1+p.rise2,out:p.spire}),420)}
    ${node(X.ml,Y.rise,p.rise1,"sum",t("pyramid.cap.md"),t("pyramid.tip.monthDay",{a:p.A,b:p.B,sum:p.A+p.B,out:p.rise1}),280)}
    ${node(X.mr,Y.rise,p.rise2,"sum",t("pyramid.cap.dy"),t("pyramid.tip.dayYear",{b:p.B,c:p.C,sum:p.B+p.C,out:p.rise2}),280)}
    ${node(X.l,Y.core,p.A,"core",t("pyramid.cap.month"),t("pyramid.tip.digits",{field:"MM",value:p.MM,sum:digits(p.MM).join(" + "),total:sumd(p.MM),out:p.A}),0)}
    ${node(X.c,Y.core,p.B,"core",t("pyramid.cap.day"),t("pyramid.tip.digits",{field:"DD",value:p.DD,sum:digits(p.DD).join(" + "),total:sumd(p.DD),out:p.B}),90)}
    ${node(X.r,Y.core,p.C,"core",t("pyramid.cap.year"),t("pyramid.tip.digits",{field:"YYYY",value:p.YYYY,sum:digits(p.YYYY).join(" + "),total:sumd(p.YYYY),out:p.C}),180)}
    ${node(X.ml,Y.root,p.root1,"diff",t("pyramid.cap.mdDiff"),t("pyramid.tip.diff",{x:p.A,y:p.B,abs:Math.abs(p.A-p.B),out:p.root1}),280)}
    ${node(X.mr,Y.root,p.root2,"diff",t("pyramid.cap.dyDiff"),t("pyramid.tip.diff",{x:p.B,y:p.C,abs:Math.abs(p.B-p.C),out:p.root2}),280)}
    ${node(X.c,Y.base,p.base,"diff",t("pyramid.cap.diff"),t("pyramid.tip.diff",{x:p.root1,y:p.root2,abs:Math.abs(p.root1-p.root2),out:p.base}),420)}
  </svg></div>
  <div class="legend">
    <span class="k-sum"><i></i>${esc(t("pyramid.legend.rising"))}</span>
    <span class="k-diff"><i></i>${esc(t("pyramid.legend.falling"))}</span>
    <span class="k-axis"><i></i>${esc(t("pyramid.legend.axis"))}</span>
  </div>`;
}

/* ══ square of nine ═══════════════════════════════════════════════ */
const SQUARE = [[3,6,9],[2,4,8],[1,5,7]];
const LINES = [["square.line.topRow",[3,6,9]],["square.line.middleRow",[2,4,8]],["square.line.bottomRow",[1,5,7]],
  ["square.line.leftColumn",[3,2,1]],["square.line.centreColumn",[6,4,5]],["square.line.rightColumn",[9,8,7]],
  ["square.line.diagonalDown",[3,4,7]],["square.line.diagonalUp",[9,4,1]]];

function squareHTML(p, t){
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
  const has = n => p.counts[n] > 0;
  const lines = LINES.filter(([, set]) => set.every(has)).map(([key]) => t(key));

  return `<div class="square-wrap">
    <div class="square">${cells}</div>
    <div class="readout prose">
      <dl>
        <dt>${esc(t("square.digitsRead"))}</dt><dd class="num">${digits(p.DD+p.MM+p.YYYY).join(" · ")} <span style="color:var(--muted)">(${esc(t("square.zerosNote"))})</span></dd>
        <dt>${esc(t("square.present"))}</dt><dd class="chips">${present.map(n=>`<span class="chip on">${n}<span style="color:var(--muted)"> ×${p.counts[n]}</span></span>`).join("")||"—"}</dd>
        <dt>${esc(t("square.absent"))}</dt><dd class="chips">${missing.map(n=>`<span class="chip off">${n}</span>`).join("")||`<span style='color:var(--muted)'>${esc(t("square.noneAbsent"))}</span>`}</dd>
        <dt>${esc(t("square.heaviest"))}</dt><dd>${strongest.map(n=>`<strong>${n} — ${esc(t(`num.${n}.name`))}</strong>`).join(", ")} <span style="color:var(--muted)">${esc(t("square.atTimes", {count: max}))}</span></dd>
        <dt>${esc(t("square.fullLines"))}</dt><dd>${lines.length ? esc(lines.join(", ")) : `<span style='color:var(--muted)'>${esc(t("square.noLines"))}</span>`}</dd>
      </dl>
      <p style="margin-top:18px;color:var(--muted);font-size:.88rem">${esc(t("square.note"))}</p>
    </div>
  </div>`;
}

/* ══ identity strip ═══════════════════════════════════════════════ */
function identityHTML(p, t, locale){
  const approx = p.cnyExact ? "" : ` <span style='color:var(--madder)'>(${esc(t("identity.estimated"))})</span>`;
  const pretty = longDate(p, locale);
  const weekday = weekdayOf(p, locale);
  return `<div class="identity reveal">
    <div class="ident">
      <span class="label">${esc(t(p.name ? "identity.whose" : "identity.theDate"))}</span>
      <span class="big">${p.name ? esc(p.name) : esc(pretty)}</span>
      <span class="sub">${p.name ? esc(pretty)+" · " : ""}${esc(weekday)} · ${esc(t("identity.written"))} <span class="num">${p.DD}·${p.MM}·${p.YYYY}</span></span>
    </div>
    <div class="ident">
      <span class="glyph">${animalGlyph(p)}</span>
      <span class="big">${esc(elementName(p, t))} ${esc(animalName(p, t))}</span>
      <span class="sub">${esc(t(`polarity.${p.polarity}`))} · ${esc(t("identity.lunarYear", {year: p.zodiacYear, opened: dayMonth(p.cny.m, p.cny.d, locale)}))}${approx} ${esc(t(`animal.${p.animalIdx}.blurb`))}</span>
    </div>
    <div class="ident">
      <span class="glyph">${WEST[p.sign][0]}</span>
      <span class="big">${esc(t(`sign.${p.sign}.name`))}</span>
      <span class="sub">${esc(t("identity.signElement", {element: t(`element.${p.signElement}`)}))} ${esc(t(`sign.${p.sign}.blurb`))}</span>
    </div>
    <div class="ident destiny">
      <span class="label">${esc(t("identity.destiny"))}</span>
      <span class="big">${p.destiny.value}<small> ← ${p.destiny.steps.join(" ← ")}</small></span>
      <span class="sub"><strong style="color:var(--ink)">${esc(t(`num.${p.destiny.value}.name`))}.</strong> ${esc(t(`num.${p.destiny.value}.blurb`))}</span>
    </div>
  </div>`;
}

function meaningsHTML(p, t){
  const set = new Set(p.chartNums);
  const master = p.destiny.value > 9
    ? t("meanings.plusMaster", {number: p.destiny.value, name: t(`num.${p.destiny.value}.name`)})
    : "";
  return `<div class="meanings reveal">${[1,2,3,4,5,6,7,8,9].map(n => `
    <div class="mean${set.has(n)?" present":""}">
      <span class="n">${n}</span>
      <div><h3>${esc(t(`num.${n}.name`))}</h3><p>${esc(t(`num.${n}.blurb`))}</p></div>
    </div>`).join("")}</div>
   <p style="color:var(--muted);font-size:.87rem;margin-top:14px">${esc(t("meanings.note"))}${esc(master)}</p>`;
}

function duelCard(p, accent, t, locale){
  const pretty = longDate(p, locale);
  return `<div style="--accent:${accent}">
    <h3>${p.name ? esc(p.name) : esc(pretty)}</h3>
    <p class="when">${p.name ? esc(pretty)+" · " : ""}${esc(weekdayOf(p, locale))}</p>
    <div class="row"><span>${esc(t("duel.chinese"))}</span><span>${animalGlyph(p)} ${esc(elementName(p, t))} ${esc(animalName(p, t))} <span style="color:var(--muted)">(${esc(t(`polarity.${p.polarity}`))})</span></span></div>
    <div class="row"><span>${esc(t("duel.western"))}</span><span>${WEST[p.sign][0]} ${esc(t(`sign.${p.sign}.name`))} <span style="color:var(--muted)">(${esc(t(`element.${p.signElement}`))})</span></span></div>
    <div class="row"><span>${esc(t("duel.destiny"))}</span><span class="num" style="color:var(--brass);font-size:1.15rem">${p.destiny.value}</span></div>
    <div class="row"><span>${esc(t("duel.core"))}</span><span class="num">${p.A} · ${p.B} · ${p.C}</span></div>
    <div class="row"><span>${esc(t("duel.crownBase"))}</span><span class="num">${p.crown} / ${p.base}</span></div>
  </div>`;
}

export { pyramidSVG, squareHTML, identityHTML, meaningsHTML, duelCard, longDate };
