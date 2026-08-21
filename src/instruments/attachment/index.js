import { html } from "../../core/html.js";
import { scaleFor, scoreLikert } from "../../core/scoring.js";
import { barsHTML, verdictHTML, factsHTML } from "../../ui/components/scorecard.js";
import { ITEMS } from "./items.js";

/**
 * A position, reported as a position.
 *
 * The four attachment styles are quadrants of a plane, so this instrument
 * gives the two coordinates first and names the quadrant second. That order
 * matters more here than anywhere else in the app: "you are fearful-avoidant"
 * is a sentence people carry around for years, and the honest version is that
 * they scored 58 and 61 on two continuous scales with a boundary at 50.
 *
 * `strength` is the distance from the centre of the plane, and everything the
 * copy claims is hedged by it. Near the middle, the label means very little.
 */

const scale = scaleFor("agree7", (key) => key);
const MIDPOINT = 50;

/** Quadrant names, in the order [low anxiety, high anxiety] × [low, high avoidance]. */
function styleOf(anxiety, avoidance) {
  const anxious = anxiety >= MIDPOINT;
  const distant = avoidance >= MIDPOINT;
  if (!anxious && !distant) return "secure";
  if (anxious && !distant) return "preoccupied";
  if (!anxious && distant) return "dismissing";
  return "fearful";
}

function score(answers) {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const anxiety = scores.anxiety;
  const avoidance = scores.avoidance;

  // How far from the middle of the plane, as a percentage of the furthest a
  // person could be. A low number means the quadrant name is close to a
  // coin toss and the copy says so.
  const reach = Math.hypot(anxiety - MIDPOINT, avoidance - MIDPOINT);
  const strength = Math.round((reach / Math.hypot(MIDPOINT, MIDPOINT)) * 100);

  return {
    scores, anxiety, avoidance,
    style: styleOf(anxiety, avoidance),
    strength,
    borderline: strength < 20,
    answered, total,
  };
}

const rows = (result, t) => [
  { key: "anxiety", label: t("dim.anxiety.label"), score: result.anxiety, blurb: t("dim.anxiety.blurb") },
  { key: "avoidance", label: t("dim.avoidance.label"), score: result.avoidance, blurb: t("dim.avoidance.blurb") },
];

function view(result, { t }) {
  return html`
    ${verdictHTML({
      t,
      eyebrow: result.borderline ? t("view.eyebrowBorderline") : t("view.eyebrow"),
      title: t(`style.${result.style}.label`),
      body: result.borderline
        ? t("view.bodyBorderline", { style: t(`style.${result.style}.label`), anxiety: result.anxiety, avoidance: result.avoidance })
        : t(`style.${result.style}.blurb`),
    })}
    ${barsHTML(rows(result, t))}
    ${factsHTML([
      [t("dim.anxiety.label"), t("view.dimValue", { score: result.anxiety, blurb: t(`dim.anxiety.${result.anxiety >= MIDPOINT ? "high" : "low"}`) })],
      [t("dim.avoidance.label"), t("view.dimValue", { score: result.avoidance, blurb: t(`dim.avoidance.${result.avoidance >= MIDPOINT ? "high" : "low"}`) })],
      [t("view.fact.position"), t("view.positionValue", { strength: result.strength })],
      [t("view.fact.underStress"), t(`style.${result.style}.stress`)],
    ])}
    <div class="note prose"><p>${t("view.notCategoriesNote")}</p></div>
    <div class="note prose"><p>${t("view.changeNote")}</p></div>`;
}

function instructions(result, t) {
  return [
    { channel: "conflict", title: t("instructions.conflictTitle", { style: t(`style.${result.style}.label`) }), body: t(`style.${result.style}.conflict`) },
    { channel: "affection", title: t("instructions.needTitle"), body: t(`style.${result.style}.need`) },
    { channel: "communication", title: t("instructions.repairTitle"), body: t(`style.${result.style}.repair`) },
  ];
}

/**
 * The pairing, which is the point of measuring this at all.
 *
 * One combination is worth naming outright: high anxiety meeting high
 * avoidance is the trap, because each person's instinct under stress is
 * precisely what the other cannot tolerate. Saying that plainly is more use
 * than a compatibility score.
 */
function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const chase = (a.style === "preoccupied" && b.style === "dismissing") ||
                (b.style === "preoccupied" && a.style === "dismissing");
  const bothSecure = a.style === "secure" && b.style === "secure";
  const same = a.style === b.style;

  const bodyKey = chase ? "compare.pursuitWithdrawal"
    : bothSecure ? "compare.bothSecure"
    : same ? "compare.sameStyle"
    : "compare.mixed";

  const gapAnxiety = Math.abs(a.anxiety - b.anxiety);
  const gapAvoidance = Math.abs(a.avoidance - b.avoidance);

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: t("compare.title", { a: t(`style.${a.style}.label`), b: t(`style.${b.style}.label`) }),
      body: t(bodyKey, { nameA, nameB, style: t(`style.${a.style}.label`) }),
    })}
    ${factsHTML([
      [t("dim.anxiety.label"), t("compare.dimValue", { nameA, nameB, a: a.anxiety, b: b.anxiety, gap: gapAnxiety })],
      [t("dim.avoidance.label"), t("compare.dimValue", { nameA, nameB, a: a.avoidance, b: b.avoidance, gap: gapAvoidance })],
    ])}
    <div class="exchange">
      <div><span class="label">${t("compare.needsFrom", { a: nameA, b: nameB })}</span>
        <p class="prose">${t(`style.${a.style}.need`)}</p></div>
      <div><span class="label">${t("compare.needsFrom", { a: nameB, b: nameA })}</span>
        <p class="prose">${t(`style.${b.style}.need`)}</p></div>
    </div>`;
}

export { styleOf, MIDPOINT };

export default {
  id: "attachment",
  version: 1,
  family: "questionnaire",
  glyph: "⚭",
  minutes: 4,
  channels: ["conflict", "affection", "communication"],
  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
    es: () => import("./i18n/es.js"),
    de: () => import("./i18n/de.js"),
  },
  form: (t) => ({
    kind: "items",
    items: ITEMS.map((item) => ({ ...item, prompt: t(`item.${item.id}`) })),
    scale: scaleFor("agree7", t),
    shuffle: true,
    pageSize: 6,
  }),
  score, view, instructions, compare,
};
