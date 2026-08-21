import { html, raw, esc } from "../../core/html.js";
import { profile, match } from "./compute.js";
import { daysIn } from "./calendar.js";
import { NUM, MONTHS } from "./data.js";
import { pyramidSVG, squareHTML, identityHTML, meaningsHTML, duelCard } from "./view.js";

/**
 * The profiler family, and the reason it exists.
 *
 * This instrument asks for facts, not opinions — a birth date and a name — and
 * derives rather than scores. It shares nothing with the questionnaires except
 * the contract: a form, a scoring function, a view, and a set of instruction
 * cards. That is the whole argument for the plugin shape. Adding a test that
 * works nothing like the others cost one folder.
 *
 * It is also the one instrument in the app with no empirical support
 * whatsoever, and the copy says so rather than hedging.
 */

const MONTH_OPTIONS = MONTHS.map((label, i) => ({ value: i + 1, label }));

function form() {
  return {
    kind: "fields",
    fields: [
      { id: "name", kind: "text", label: "Name", placeholder: "Optional", optional: true },
      { id: "day", kind: "number", label: "Day", min: 1, max: 31, value: 8 },
      { id: "month", kind: "select", label: "Month", options: MONTH_OPTIONS, value: 1 },
      { id: "year", kind: "number", label: "Year", min: 1900, max: 2050, value: 1993 },
    ],
    note: "The Chinese animal turns at Chinese New Year, not on 1 January — outside 1900–2050 that boundary is estimated at 4 February.",
  };
}

/** Field-level validation, run before `score`. Returns { fieldId: message }. */
function validate(answers) {
  const errors = {};
  const d = Number(answers.day), m = Number(answers.month), y = Number(answers.year);
  if (!Number.isInteger(y) || y < 1 || y > 3000) errors.year = "Enter a four-digit year.";
  if (!Number.isInteger(d) || d < 1) errors.day = "Enter a day.";
  else if (Number.isInteger(y) && Number.isInteger(m) && d > daysIn(m, y)) errors.day = `${MONTHS[m - 1]} ${y} has ${daysIn(m, y)} days.`;
  return errors;
}

function score(answers) {
  const p = profile(Number(answers.day), Number(answers.month), Number(answers.year), String(answers.name ?? "").trim());
  return { ...p, outOfRange: p.y < 1900 || p.y > 2050 };
}

function view(result) {
  return html`
    ${raw(identityHTML(result))}
    <section class="sub-plate">
      <h4>The pyramid <span class="label">sums rise · differences fall</span></h4>
      <div class="card pad">${raw(pyramidSVG(result))}</div>
    </section>
    <section class="sub-plate">
      <h4>Square of nine <span class="label">occurrences in the date</span></h4>
      <div class="card pad">${raw(squareHTML(result))}</div>
    </section>
    <section class="sub-plate">
      <h4>What the numbers carry <span class="label">1 – 9</span></h4>
      ${raw(meaningsHTML(result))}
    </section>
    ${result.outOfRange ? html`<div class="note warn-note prose"><p>This date falls outside 1900–2050, so the Chinese New Year boundary is estimated at 4 February and the animal may be wrong by a few weeks.</p></div>` : ""}`;
}

/**
 * The instruction cards are the honest part: what a numerology chart can
 * legitimately contribute to a page about how to deal with someone is a
 * vocabulary and a self-description, not a claim. So the cards are phrased as
 * self-report — "this is the register I recognise myself in" — and filed under
 * `rhythm`, the channel reserved for things that are true because the person
 * says so.
 */
function instructions(result) {
  const d = NUM[result.destiny.value];
  return [
    { channel: "rhythm", title: `Destiny ${result.destiny.value} — ${d[0]}`, body: d[1] },
    { channel: "rhythm", title: `${result.element} ${result.animal[0]}, ${result.sign}`, body: `${result.animal[2]} ${result.signBlurb}` },
  ];
}

function compare(a, b, { nameA, nameB } = {}) {
  const m = match(a, b);
  const list = (arr) =>
    arr.length ? arr.map((n) => `<span class="chip on">${n} ${esc(NUM[n][0].replace("The ", ""))}</span>`).join("") : `<span class="chip off">nothing the other lacks</span>`;
  return html`
    <div class="duel">${raw(duelCard(a, "var(--brass)"))}${raw(duelCard(b, "var(--verdigris)"))}</div>
    <div class="meter">
      <div class="meter-top">
        <div><span class="label">Composite</span><br><strong class="num" id="score" data-total="${m.total}">0</strong><span class="num meter-of"> / 100</span></div>
        <div class="meter-verdict"><span class="label">Verdict</span><br><span class="meter-band">${m.band}</span></div>
      </div>
      <div class="meter-bar"><div class="meter-fill" id="fill" data-w="${m.total}"></div></div>
    </div>
    <div class="breakdown">
      ${raw(m.parts.map((pt) => `<div class="bd">
          <span class="t">${esc(pt.t)}</span>
          <span class="track"><i data-w="${(pt.v / pt.max * 100).toFixed(1)}"></i></span>
          <span class="v">${pt.v}<span class="of">/${pt.max}</span></span>
          <span class="bd-note">${esc(pt.note)}</span>
        </div>`).join(""))}
    </div>
    <div class="exchange">
      <div><span class="label">${nameA || "First"} supplies</span><div class="chips">${raw(list(m.aFills))}</div></div>
      <div><span class="label">${nameB || "Second"} supplies</span><div class="chips">${raw(list(m.bFills))}</div></div>
    </div>
    <p class="prose">Their destiny numbers combine to <strong class="num accent">${m.unionNum}</strong> — <strong>${NUM[m.unionNum][0]}</strong>. ${NUM[m.unionNum][1]}</p>`;
}

export default {
  id: "numerology",
  version: 1,
  family: "profiler",
  title: "Ninefold Almanac",
  tagline: "A birth date, reduced. Zodiacs east and west, the destiny number, the pyramid, the square of nine.",
  glyph: "9",
  minutes: 1,
  framework: "Pythagorean numerology, Chinese and Western zodiac",
  sourceNote:
    "Traditional systems, computed exactly as the traditions specify — including the Chinese New Year boundary that most software gets wrong. No part of it is empirically supported. It is here for the vocabulary, not the prediction.",
  channels: ["rhythm"],
  form, validate, score, view, instructions, compare,
};
