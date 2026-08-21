import { html } from "../../core/html.js";
import { scaleFor, scoreLikert } from "../../core/scoring.js";
import { barsHTML, verdictHTML, factsHTML } from "../../ui/components/scorecard.js";
import { ITEMS } from "./items.js";

/**
 * Five modes, as regions of a plane rather than as five boxes.
 *
 * Compromising is not a fifth direction — it is the middle, and treating it as
 * a separate corner is the most common error in presentations of this model.
 * So the middle is defined explicitly: within `MIDDLE` points of centre on
 * both axes and the answer is compromising, because that is what being in the
 * middle of both concerns actually means.
 *
 * The second thing reported is the fallback: what happens when the first mode
 * does not work. That is usually more useful than the primary, because the
 * primary is how someone opens and the fallback is how the argument ends.
 */

const scale = scaleFor("agree5", (key) => key);
const MIDPOINT = 50;
const MIDDLE = 12;

function modeOf(assertiveness, cooperativeness) {
  const nearCentre = Math.abs(assertiveness - MIDPOINT) <= MIDDLE && Math.abs(cooperativeness - MIDPOINT) <= MIDDLE;
  if (nearCentre) return "compromising";
  // Strictly greater, not greater-or-equal. Sitting exactly on the midpoint of
  // a concern is not holding that concern — someone at 95 and 50 is competing,
  // because they are not actively trying to satisfy the other side, and
  // calling that collaborating would flatter it.
  const pushes = assertiveness > MIDPOINT;
  const yields = cooperativeness > MIDPOINT;
  if (pushes && yields) return "collaborating";
  if (pushes && !yields) return "competing";
  if (!pushes && yields) return "accommodating";
  return "avoiding";
}

/**
 * Where someone goes when the first move fails. Under pressure the weaker of
 * the two concerns is the one that gives, so the fallback is the mode you
 * reach by dropping it further.
 */
function fallbackOf(mode, assertiveness, cooperativeness) {
  if (mode === "collaborating") return assertiveness >= cooperativeness ? "competing" : "accommodating";
  if (mode === "compromising") return assertiveness >= cooperativeness ? "competing" : "avoiding";
  if (mode === "competing") return "avoiding";
  if (mode === "accommodating") return "avoiding";
  return "avoiding";
}

function score(answers) {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const assertiveness = scores.assertiveness;
  const cooperativeness = scores.cooperativeness;
  const mode = modeOf(assertiveness, cooperativeness);
  return {
    scores, assertiveness, cooperativeness, mode,
    fallback: fallbackOf(mode, assertiveness, cooperativeness),
    // How far from the centre, so the copy can hedge when the mode is a
    // near-run thing rather than a settled habit.
    reach: Math.round(Math.hypot(assertiveness - MIDPOINT, cooperativeness - MIDPOINT)),
    answered, total,
  };
}

const rows = (result, t) => [
  { key: "assertiveness", label: t("dim.assertiveness.label"), score: result.assertiveness, blurb: t("dim.assertiveness.blurb") },
  { key: "cooperativeness", label: t("dim.cooperativeness.label"), score: result.cooperativeness, blurb: t("dim.cooperativeness.blurb") },
];

function view(result, { t }) {
  return html`
    ${verdictHTML({
      t,
      eyebrow: t("view.eyebrow"),
      title: t(`mode.${result.mode}.label`),
      body: t(`mode.${result.mode}.blurb`),
    })}
    ${barsHTML(rows(result, t))}
    ${factsHTML([
      [t("view.fact.opening"), t("view.openingValue", { mode: t(`mode.${result.mode}.label`), cost: t(`mode.${result.mode}.cost`) })],
      [t("view.fact.fallback"), t("view.fallbackValue", { mode: t(`mode.${result.fallback}.label`), blurb: t(`mode.${result.fallback}.blurb`) })],
      [t("dim.assertiveness.label"), t("view.dimValue", { score: result.assertiveness, blurb: t(`dim.assertiveness.${result.assertiveness >= MIDPOINT ? "high" : "low"}`) })],
      [t("dim.cooperativeness.label"), t("view.dimValue", { score: result.cooperativeness, blurb: t(`dim.cooperativeness.${result.cooperativeness >= MIDPOINT ? "high" : "low"}`) })],
    ])}
    <div class="note prose"><p>${t("view.noBestModeNote")}</p></div>
    <div class="note prose"><p>${t("view.middleNote")}</p></div>`;
}

function instructions(result, t) {
  return [
    { channel: "conflict", title: t("instructions.openingTitle", { mode: t(`mode.${result.mode}.label`) }), body: t(`mode.${result.mode}.ask`) },
    { channel: "conflict", title: t("instructions.fallbackTitle"), body: t(`mode.${result.fallback}.fallbackAsk`) },
    { channel: "communication", title: t("instructions.repairTitle"), body: t(`mode.${result.mode}.repair`) },
  ];
}

function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const bothCompete = a.mode === "competing" && b.mode === "competing";
  const bothAvoid = a.mode === "avoiding" && b.mode === "avoiding";
  const pushMeetsYield = (a.mode === "competing" && b.mode === "accommodating") ||
                         (b.mode === "competing" && a.mode === "accommodating");

  const bodyKey = bothCompete ? "compare.bothCompete"
    : bothAvoid ? "compare.bothAvoid"
    : pushMeetsYield ? "compare.pushMeetsYield"
    : a.mode === b.mode ? "compare.sameMode"
    : "compare.mixed";

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: t("compare.title", { a: t(`mode.${a.mode}.label`), b: t(`mode.${b.mode}.label`) }),
      body: t(bodyKey, { nameA, nameB, mode: t(`mode.${a.mode}.label`) }),
    })}
    ${factsHTML([
      [t("dim.assertiveness.label"), t("compare.dimValue", { nameA, nameB, a: a.assertiveness, b: b.assertiveness })],
      [t("dim.cooperativeness.label"), t("compare.dimValue", { nameA, nameB, a: a.cooperativeness, b: b.cooperativeness })],
      [t("compare.fact.fallbacks"), t("compare.fallbackValue", { nameA, nameB, a: t(`mode.${a.fallback}.label`), b: t(`mode.${b.fallback}.label`) })],
    ])}
    <div class="exchange">
      <div><span class="label">${t("compare.worksWith", { name: nameA })}</span><p class="prose">${t(`mode.${a.mode}.ask`)}</p></div>
      <div><span class="label">${t("compare.worksWith", { name: nameB })}</span><p class="prose">${t(`mode.${b.mode}.ask`)}</p></div>
    </div>`;
}

export { modeOf, fallbackOf, MIDPOINT, MIDDLE };

export default {
  id: "conflict-style",
  version: 1,
  family: "questionnaire",
  glyph: "⚔",
  minutes: 4,
  channels: ["conflict", "communication"],
  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
    es: () => import("./i18n/es.js"),
    de: () => import("./i18n/de.js"),
  },
  form: (t) => ({
    kind: "items",
    items: ITEMS.map((item) => ({ ...item, prompt: t(`item.${item.id}`) })),
    scale: scaleFor("agree5", t),
    shuffle: true,
    pageSize: 6,
  }),
  score, view, instructions, compare,
};
