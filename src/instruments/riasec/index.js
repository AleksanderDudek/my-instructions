import { html } from "../../core/html.js";
import { scaleFor, scoreLikert, rank } from "../../core/scoring.js";
import { barsHTML, verdictHTML, factsHTML } from "../../ui/components/scorecard.js";
import { GLYPHS, ORDER, ITEMS } from "./items.js";

/**
 * Six interests, and two things about the shape they make.
 *
 * The three-letter code is the familiar output, but on its own it hides the
 * two facts that decide whether it means anything.
 *
 * *Differentiation* is the gap between the highest and lowest interest. A
 * person who is 70 on everything has a code, and it is noise.
 *
 * *Consistency* is where the top two sit on Holland's hexagon. Neighbouring
 * interests share something and combine easily; opposite ones pull against
 * each other, and someone holding both is describing a genuine tension rather
 * than a contradiction to be resolved.
 */

const scale = scaleFor("agree5", (key) => key);

/** Steps around the hexagon: 1 is adjacent, 3 is opposite. */
function separation(a, b) {
  const gap = Math.abs(ORDER.indexOf(a) - ORDER.indexOf(b));
  return Math.min(gap, ORDER.length - gap);
}

const consistencyOf = (a, b) => (separation(a, b) === 1 ? "high" : separation(a, b) === 2 ? "medium" : "low");

/** The letter for each type, which is where the acronym comes from. */
const LETTER = { realistic: "R", investigative: "I", artistic: "A", social: "S", enterprising: "E", conventional: "C" };

function score(answers) {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const ranked = rank(scores);
  const top = ranked.slice(0, 3).map((r) => r.key);

  const spread = ranked[0].score - ranked[ranked.length - 1].score;
  const consistency = consistencyOf(top[0], top[1]);

  return {
    scores, ranked, top,
    code: top.map((k) => LETTER[k]).join(""),
    spread,
    // Under about twenty points the ordering is mostly noise, and saying so is
    // more useful than handing someone three letters they will take seriously.
    flat: spread < 20,
    consistency,
    opposed: consistency === "low",
    answered, total,
  };
}

const rows = (result, t) =>
  result.ranked.map((r) => ({
    key: r.key,
    label: `${GLYPHS[r.key]} ${t(`type.${r.key}.label`)}`,
    score: r.score,
    blurb: t(`type.${r.key}.blurb`),
  }));

function view(result, { t }) {
  const [first, second, third] = result.top;
  return html`
    ${verdictHTML({
      t,
      eyebrow: result.flat ? t("view.eyebrowFlat") : t("view.eyebrow"),
      title: result.flat ? t("view.titleFlat") : t("view.title", { code: result.code, first: t(`type.${first}.label`) }),
      score: result.ranked[0].score,
      body: result.flat
        ? t("view.bodyFlat", { spread: result.spread })
        : t("view.body", { first: t(`type.${first}.label`), second: t(`type.${second}.label`), blurb: t(`type.${first}.blurb`) }),
    })}
    ${barsHTML(rows(result, t))}
    ${factsHTML([
      [t("view.fact.code"), t("view.codeValue", {
        code: result.code,
        names: [first, second, third].map((k) => t(`type.${k}.label`)).join(" · "),
      })],
      [t("view.fact.spread"), t(result.flat ? "view.spreadFlat" : "view.spreadValue", { spread: result.spread })],
      [t("view.fact.consistency"), t(`view.consistency.${result.consistency}`, {
        a: t(`type.${first}.label`), b: t(`type.${second}.label`),
      })],
    ])}
    <div class="note prose"><p>${t("view.hexagonNote")}</p></div>
    <div class="note prose"><p>${t("view.notACareerNote")}</p></div>`;
}

function instructions(result, t) {
  const [first, second] = result.top;
  const cards = [
    { channel: "work", title: t("instructions.leadTitle", { type: t(`type.${first}.label`) }), body: t(`type.${first}.ask`) },
    { channel: "work", title: t("instructions.secondTitle", { type: t(`type.${second}.label`) }), body: t(`type.${second}.ask`) },
    { channel: "energy", title: t("instructions.drainTitle", { type: t(`type.${result.ranked[5].key}.label`) }), body: t(`type.${result.ranked[5].key}.drain`) },
  ];
  if (result.opposed) {
    cards.push({ channel: "work", title: t("instructions.tensionTitle"), body: t("instructions.tensionBody", { a: t(`type.${first}.label`), b: t(`type.${second}.label`) }) });
  }
  if (result.flat) {
    cards.push({ channel: "work", title: t("instructions.flatTitle"), body: t("instructions.flatBody") });
  }
  return cards;
}

function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const shared = a.top.filter((k) => b.top.includes(k));
  const gap = separation(a.top[0], b.top[0]);

  const bodyKey = a.code === b.code ? "compare.sameCode"
    : shared.length >= 2 ? "compare.overlap"
    : gap >= 3 ? "compare.opposite"
    : "compare.different";

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: t("compare.title", { a: a.code, b: b.code }),
      body: t(bodyKey, {
        nameA, nameB,
        shared: shared.map((k) => t(`type.${k}.label`)).join(", "),
        a: t(`type.${a.top[0]}.label`), b: t(`type.${b.top[0]}.label`),
      }),
    })}
    ${factsHTML([
      [t("compare.fact.codes"), t("compare.codesValue", { nameA, nameB, a: a.code, b: b.code })],
      [t("compare.fact.shared"), shared.length ? shared.map((k) => t(`type.${k}.label`)).join(", ") : t("compare.sharedNone")],
      [t("compare.fact.distance"), t("compare.distanceValue", { steps: gap })],
    ])}
    <div class="exchange">
      <div><span class="label">${t("compare.givesEnergy", { name: nameA })}</span><p class="prose">${t(`type.${a.top[0]}.ask`)}</p></div>
      <div><span class="label">${t("compare.givesEnergy", { name: nameB })}</span><p class="prose">${t(`type.${b.top[0]}.ask`)}</p></div>
    </div>`;
}

export { separation, consistencyOf, LETTER };

export default {
  id: "riasec",
  version: 1,
  family: "questionnaire",
  glyph: "⬢",
  minutes: 5,
  channels: ["work", "energy"],
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
