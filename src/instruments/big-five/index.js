import { html } from "../../core/html.js";
import { scaleFor, scoreLikert, band, deviation, straightlining } from "../../core/scoring.js";
import { barsHTML, verdictHTML, factsHTML } from "../../ui/components/scorecard.js";
import { GLYPHS, ORDER, ITEMS } from "./items.js";

/**
 * Unlike the other two questionnaires, nothing here is ranked. The five
 * factors are meant to be independent, so "your highest factor" is a category
 * error — a person is not *mostly* open the way they are mostly a 5. Each
 * factor is reported on its own, and the summary picks out only the ones far
 * enough from the middle to be worth telling someone about.
 */

const scale = scaleFor("agree5", (key) => key);
const MARKED = 22; // distance from 50 at which a factor stops being unremarkable

function score(answers) {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const profile = ORDER.map((key) => {
    const s = scores[key];
    return { key, score: s, side: s >= 50 ? "high" : "low", bandKey: band(s), marked: Math.abs(s - 50) >= MARKED };
  });
  return {
    scores, profile,
    marked: profile.filter((p) => p.marked),
    // Deviation from the middle, not spread between the scales: a person at 70
    // on everything has no spread and plenty to say, and calling that flat
    // would be wrong.
    flat: deviation(scores).furthest < MARKED,
    suspect: straightlining(ITEMS, answers),
    answered, total,
  };
}

const rows = (result, t) =>
  result.profile.map((p) => ({
    key: p.key,
    label: `${GLYPHS[p.key]} ${t(`factor.${p.key}.label`)}`,
    score: p.score,
    blurb: t(`factor.${p.key}.${p.side}`),
  }));

function view(result, { t }) {
  const headline = result.marked.length
    ? result.marked.map((p) => t("view.headlineItem", { band: t(p.bandKey), factor: t(`factor.${p.key}.inline`) })).join(", ")
    : t("view.headlineFlat");
  return html`
    ${verdictHTML({
      t,
      eyebrow: t("view.eyebrow"),
      title: headline,
      body: result.flat ? t("view.bodyFlat") : t("view.bodyMarked"),
    })}
    ${barsHTML(rows(result, t))}
    ${factsHTML(result.profile.map((p) => [
      t(`factor.${p.key}.label`),
      t("view.factValue", { score: p.score, band: t(p.bandKey), blurb: t(`factor.${p.key}.${p.side}`) }),
    ]))}
    ${result.suspect ? html`<div class="note warn-note prose"><p>${t("view.straightlining")}</p></div>` : ""}
    <div class="note prose"><p>${t("view.researchNote")}</p></div>`;
}

/** Which channel of the instruction sheet a factor speaks to. */
const CHANNEL = {
  openness: "communication",
  conscientiousness: "work",
  extraversion: "energy",
  agreeableness: "communication",
  reactivity: "energy",
};

function instructions(result, t) {
  const cards = [];
  for (const p of result.marked) {
    // Four whole titles rather than an assembled one: "Strongly high" is not
    // "strongly" plus "high" in every language, and a title is short enough
    // that four keys cost less than one that has to be built.
    const strong = p.bandKey === "band.veryHigh" || p.bandKey === "band.veryLow";
    const titleKey = strong
      ? `instructions.title.very${p.side === "high" ? "High" : "Low"}`
      : `instructions.title.${p.side}`;
    cards.push({
      channel: CHANNEL[p.key],
      title: t(titleKey, { factor: t(`factor.${p.key}.inline`) }),
      body: t(`factor.${p.key}.ask.${p.side}`),
    });
  }
  if (!cards.length) cards.push({ channel: "rhythm", title: t("instructions.flatTitle"), body: t("instructions.flatBody") });
  return cards;
}

function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const gaps = ORDER.map((k) => ({ key: k, a: a.scores[k], b: b.scores[k], gap: Math.abs(a.scores[k] - b.scores[k]) }))
    .sort((x, y) => y.gap - x.gap);
  const widest = gaps[0], closest = gaps[gaps.length - 1];
  const mean = Math.round(gaps.reduce((s, g) => s + g.gap, 0) / gaps.length);
  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: t("compare.title", { mean }),
      body: t("compare.body", {
        widest: t(`factor.${widest.key}.inline`),
        closest: t(`factor.${closest.key}.inline`),
        nameA, nameB, widestA: widest.a, widestB: widest.b,
      }),
    })}
    ${factsHTML(gaps.map((g) => [
      t(`factor.${g.key}.label`),
      t("compare.factValue", { nameA, nameB, a: g.a, b: g.b, gap: g.gap }),
    ]))}`;
}

export default {
  id: "big-five",
  version: 1,
  family: "questionnaire",
  glyph: "✦",
  minutes: 6,
  channels: ["communication", "work", "energy"],
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
    pageSize: 5,
  }),
  score, view, instructions, compare,
};
