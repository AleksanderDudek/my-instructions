import { html } from "../../core/html.js";
import { scaleFor, scoreLikert, band, deviation, straightlining } from "../../core/scoring.js";
import { barsHTML, verdictHTML, factsHTML } from "../../ui/components/scorecard.js";
import { GLYPHS, ORDER, ITEMS } from "./items.js";

/**
 * Six factors, and one of them is the point.
 *
 * Honesty–Humility is what HEXACO has and the five-factor model does not, so
 * the headline leads with it rather than with whichever factor happens to be
 * furthest from the middle. Everything else is reported plainly beside it.
 *
 * Like Big Five and unlike the Enneagram, nothing here is ranked: the factors
 * are meant to be independent, so "your highest factor" would be a category
 * error. Each is read on its own.
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
    honesty: profile[0],
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
  const h = result.honesty;
  return html`
    ${verdictHTML({
      t,
      eyebrow: t("view.eyebrow"),
      title: t("view.honestyTitle", { band: t(h.bandKey) }),
      score: h.score,
      body: t(`factor.honesty.${h.side}`),
    })}
    ${barsHTML(rows(result, t))}
    ${factsHTML(result.profile.map((p) => [
      t(`factor.${p.key}.label`),
      t("view.factValue", { score: p.score, band: t(p.bandKey), blurb: t(`factor.${p.key}.${p.side}`) }),
    ]))}
    ${result.suspect ? html`<div class="note warn-note prose"><p>${t("view.straightlining")}</p></div>` : ""}
    <div class="note prose"><p>${t("view.sixthFactorNote")}</p></div>`;
}

/** Which channel of the instruction sheet a factor speaks to. */
const CHANNEL = {
  honesty: "work",
  emotionality: "energy",
  extraversion: "energy",
  agreeableness: "conflict",
  conscientiousness: "work",
  openness: "communication",
};

function instructions(result, t) {
  const cards = [
    // Honesty–Humility always gets a card, marked or not. It is the reason to
    // take this rather than Big Five, and a middling score on it still says
    // something a colleague can act on.
    {
      channel: "work",
      title: t("instructions.honestyTitle", { band: t(result.honesty.bandKey) }),
      body: t(`factor.honesty.ask.${result.honesty.side}`),
    },
  ];
  for (const p of result.marked) {
    if (p.key === "honesty") continue;
    cards.push({
      channel: CHANNEL[p.key],
      title: t(`instructions.title.${p.side}`, { factor: t(`factor.${p.key}.inline`) }),
      body: t(`factor.${p.key}.ask.${p.side}`),
    });
  }
  if (cards.length === 1) cards.push({ channel: "rhythm", title: t("instructions.flatTitle"), body: t("instructions.flatBody") });
  return cards;
}

function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const gaps = ORDER.map((k) => ({ key: k, a: a.scores[k], b: b.scores[k], gap: Math.abs(a.scores[k] - b.scores[k]) }))
    .sort((x, y) => y.gap - x.gap);
  const widest = gaps[0];
  const honesty = gaps.find((g) => g.key === "honesty");
  const mean = Math.round(gaps.reduce((s, g) => s + g.gap, 0) / gaps.length);

  // A large gap on Honesty–Humility is not the same kind of news as a large
  // gap on openness, and saying so is most of this instrument's value.
  const bodyKey = honesty.gap >= 25 ? "compare.honestySplit" : "compare.body";

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: t("compare.title", { mean }),
      body: t(bodyKey, {
        widest: t(`factor.${widest.key}.inline`),
        nameA, nameB,
        widestA: widest.a, widestB: widest.b,
        honestyA: honesty.a, honestyB: honesty.b,
      }),
    })}
    ${factsHTML(gaps.map((g) => [
      t(`factor.${g.key}.label`),
      t("compare.factValue", { nameA, nameB, a: g.a, b: g.b, gap: g.gap }),
    ]))}`;
}

export default {
  id: "hexaco",
  version: 1,
  family: "questionnaire",
  glyph: "⬡",
  minutes: 5,
  channels: ["work", "conflict", "communication", "energy"],
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
