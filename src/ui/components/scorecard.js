/**
 * Result widgets shared by every scored instrument.
 *
 * These live in the UI layer and are imported *by* instruments, which inverts
 * the usual dependency direction on purpose: the alternative is each test
 * drawing its own bars, and five hand-drawn bar charts is how a product starts
 * looking like five products.
 */
import { html, join, raw } from "../../core/html.js";
import { band } from "../../core/scoring.js";

/**
 * A ranked column of 1..100 bars.
 * @param rows [{ key, label, score, blurb, share }]
 */
function barsHTML(rows, { showShare = false } = {}) {
  const top = Math.max(...rows.map((r) => r.score), 1);
  return html`<div class="bars">
    ${join(rows.map((r, i) => html`
      <div class="bar${r.score === top ? " lead" : ""}" style="--i:${i}">
        <div class="bar-head">
          <span class="bar-label">${r.label}</span>
          <span class="bar-num num">${r.score}${showShare && r.share != null ? raw(`<span class="bar-share">${r.share}%</span>`) : ""}</span>
        </div>
        <span class="track"><i data-w="${r.score}"></i></span>
        ${r.blurb ? html`<p class="bar-blurb">${r.blurb}</p>` : ""}
      </div>`))}
  </div>`;
}

/**
 * The headline: one dominant scale, named and explained.
 *
 * `t` is needed only for the verbal band beside the score, so it is optional —
 * a caller with no score to show does not have to supply one.
 */
function verdictHTML({ eyebrow, title, score, body, t = (key) => key }) {
  return html`<div class="verdict">
    <span class="label">${eyebrow}</span>
    <h3>${title}</h3>
    ${score != null ? html`<p class="verdict-score num">${score}<span> / 100 · ${t(band(score))}</span></p>` : ""}
    <p class="prose">${body}</p>
  </div>`;
}

/** A small labelled grid — centres, wings, triads, anything with 2–4 entries. */
function factsHTML(pairs) {
  return html`<dl class="facts">
    ${join(pairs.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`))}
  </dl>`;
}

export { barsHTML, verdictHTML, factsHTML };
