import { html, raw, esc } from "../../core/html.js";
import { profile, match } from "./compute.js";
import { daysIn } from "./calendar.js";
import { ELEMENTS } from "./data.js";
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

/** Month names come from the platform, so the picker follows the reader's locale. */
function monthOptions(locale) {
  const format = new Intl.DateTimeFormat(locale, { month: "long" });
  return Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: format.format(new Date(2001, i, 1)) }));
}

function form(t, locale = "en") {
  return {
    kind: "fields",
    fields: [
      { id: "name", kind: "text", label: t("form.name"), placeholder: t("form.namePlaceholder"), optional: true },
      { id: "day", kind: "number", label: t("form.day"), min: 1, max: 31, value: 8 },
      { id: "month", kind: "select", label: t("form.month"), options: monthOptions(locale), value: 1 },
      { id: "year", kind: "number", label: t("form.year"), min: 1900, max: 2050, value: 1993 },
    ],
    note: t("form.note"),
  };
}

/** Field-level validation, run before `score`. Returns { fieldId: message }. */
function validate(answers, t = (key) => key) {
  const errors = {};
  const d = Number(answers.day), m = Number(answers.month), y = Number(answers.year);
  if (!Number.isInteger(y) || y < 1 || y > 3000) errors.year = t("form.badYear");
  if (!Number.isInteger(d) || d < 1) errors.day = t("form.badDay");
  else if (Number.isInteger(y) && Number.isInteger(m) && d > daysIn(m, y)) {
    errors.day = t("form.shortMonth", { month: new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(2001, m - 1, 1)), year: y, days: daysIn(m, y) });
  }
  return errors;
}

function score(answers) {
  const p = profile(Number(answers.day), Number(answers.month), Number(answers.year), String(answers.name ?? "").trim());
  return { ...p, outOfRange: p.y < 1900 || p.y > 2050 };
}

function view(result, { t, locale = "en" }) {
  return html`
    ${raw(identityHTML(result, t, locale))}
    <section class="sub-plate">
      <h4>${t("view.pyramidHeading")} <span class="label">${t("view.pyramidNote")}</span></h4>
      <div class="card pad">${raw(pyramidSVG(result, t, locale))}</div>
    </section>
    <section class="sub-plate">
      <h4>${t("view.squareHeading")} <span class="label">${t("view.squareNote")}</span></h4>
      <div class="card pad">${raw(squareHTML(result, t))}</div>
    </section>
    <section class="sub-plate">
      <h4>${t("view.meaningsHeading")} <span class="label">1 – 9</span></h4>
      ${raw(meaningsHTML(result, t))}
    </section>
    ${result.outOfRange ? html`<div class="note warn-note prose"><p>${t("view.outOfRange")}</p></div>` : ""}`;
}

/**
 * The instruction cards are the honest part: what a numerology chart can
 * legitimately contribute to a page about how to deal with someone is a
 * vocabulary and a self-description, not a claim. So the cards are phrased as
 * self-report — "this is the register I recognise myself in" — and filed under
 * `rhythm`, the channel reserved for things that are true because the person
 * says so.
 */
function instructions(result, t) {
  const n = result.destiny.value;
  return [
    {
      channel: "rhythm",
      title: t("instructions.destinyTitle", { number: n, name: t(`num.${n}.name`) }),
      body: t(`num.${n}.blurb`),
    },
    {
      channel: "rhythm",
      title: t("instructions.signsTitle", {
        element: t(`element.${ELEMENTS[result.elementIdx]}`),
        animal: t(`animal.${result.animalIdx}.name`),
        sign: t(`sign.${result.sign}.name`),
      }),
      body: `${t(`animal.${result.animalIdx}.blurb`)} ${t(`sign.${result.sign}.blurb`)}`,
    },
  ];
}

function compare(a, b, { nameA, nameB, t, locale = "en" }) {
  const m = match(a, b, t);
  const list = (arr) =>
    arr.length
      ? arr.map((n) => `<span class="chip on">${n} ${esc(t(`num.${n}.inline`))}</span>`).join("")
      : `<span class="chip off">${esc(t("compare.nothingToAdd"))}</span>`;
  return html`
    <div class="duel">${raw(duelCard(a, "var(--brass)", t, locale))}${raw(duelCard(b, "var(--verdigris)", t, locale))}</div>
    <div class="meter">
      <div class="meter-top">
        <div><span class="label">${t("compare.composite")}</span><br><strong class="num" id="score" data-total="${m.total}">0</strong><span class="num meter-of"> / 100</span></div>
        <div class="meter-verdict"><span class="label">${t("compare.verdict")}</span><br><span class="meter-band">${m.band}</span></div>
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
      <div><span class="label">${t("compare.supplies", { name: nameA || t("compare.first") })}</span><div class="chips">${raw(list(m.aFills))}</div></div>
      <div><span class="label">${t("compare.supplies", { name: nameB || t("compare.second") })}</span><div class="chips">${raw(list(m.bFills))}</div></div>
    </div>
    <p class="prose">${t("compare.union", { number: m.unionNum, name: t(`num.${m.unionNum}.name`), blurb: t(`num.${m.unionNum}.blurb`) })}</p>`;
}

export default {
  id: "numerology",
  version: 1,
  family: "profiler",
  glyph: "9",
  minutes: 1,
  channels: ["rhythm"],
  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
  },
  form, validate, score, view, instructions, compare,
};
