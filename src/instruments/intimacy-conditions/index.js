import { html, join } from "../../core/html.js";
import { scaleFor } from "../../core/scoring.js";
import { factsHTML, verdictHTML } from "../../ui/components/scorecard.js";
import { COMFORT, CONDITIONS, PRACTICE, BELIEFS, itemsFor } from "./items.js";

/**
 * Cards a person could hand over, and nothing else.
 *
 * The single most useful thing the evidence says about this domain is that
 * communication about sex has the largest reliable association with sexual and
 * relationship satisfaction of anything measured — larger than frequency,
 * larger than any matching. That association is cross-sectional and
 * same-source, so it is not a promise; it is enough to decide what the content
 * should be. The content is therefore the sentences, not a score about the
 * person saying them.
 *
 * `score()` produces no numbers at all. It produces message keys, which keeps
 * it language-free as the contract requires and makes the shareable surface
 * literally a list of things the person chose to say.
 */

const scale = scaleFor("agree5", (key) => key);

function score(answers) {
  const conditions = {};
  for (const f of CONDITIONS) {
    conditions[f.id] = f.options.includes(answers[`n.${f.id}`]) ? answers[`n.${f.id}`] : null;
  }

  const practice = {};
  for (const f of PRACTICE) {
    practice[f.id] = f.options.includes(answers[`p.${f.id}`]) ? answers[`p.${f.id}`] : null;
  }

  // Comfort stays as raw responses and never becomes a scale. A "comfort
  // score" would rank people on how good they are at talking about sex, which
  // is a thing to help with and not a thing to grade.
  const comfort = {};
  for (const id of COMFORT) {
    const given = answers[`c.${id}`];
    if (Number.isFinite(given)) comfort[id] = given;
  }

  const beliefValues = BELIEFS.map((id) => answers[`b.${id}`]).filter(Number.isFinite);
  const beliefMean = beliefValues.length ? beliefValues.reduce((a, b) => a + b, 0) / beliefValues.length : null;
  const beliefs = beliefMean === null ? null : beliefMean >= 3.5 ? "growth" : beliefMean <= 2.5 ? "destiny" : "mixed";

  // The shareable surface, composed once here so that every consumer — the
  // result page, the instruction sheet, a comparison — is working from the
  // same list and none of them can reach past it.
  const cards = [
    ...CONDITIONS.filter((f) => conditions[f.id]).map((f) => `condition.${f.id}.${conditions[f.id]}`),
    ...PRACTICE.filter((f) => practice[f.id]).map((f) => `practice.${f.id}.${practice[f.id]}`),
  ];

  return {
    v: 1,
    conditions, practice, comfort, beliefs, cards,
    /** Where comfort is lowest, for the reader's own page only. */
    hardest: Object.entries(comfort).sort((a, b) => a[1] - b[1])[0]?.[0] ?? null,
    answered: Object.keys(comfort).length + cards.length + beliefValues.length,
    total: itemsFor((key) => key).length,
  };
}

function view(result, { t }) {
  return html`
    ${verdictHTML({
      t,
      eyebrow: t("view.eyebrow"),
      title: t("view.title"),
      body: t("view.body"),
    })}

    <section class="sub-plate">
      <h4>${t("view.cardsHeading")} <span class="label">${t("view.cardsNote")}</span></h4>
      <div class="cards">
        ${result.cards.length
          ? join(result.cards.map((key) => html`<div class="card pad instruction-card">
              <p class="prose">${t(`${key}.card`)}</p>
            </div>`))
          : html`<div class="card pad"><p class="prose">${t("view.noCards")}</p></div>`}
      </div>
    </section>

    ${result.hardest ? factsHTML([
      [t("view.fact.hardest"), t(`comfort.${result.hardest}.support`)],
    ]) : ""}

    <div class="note prose"><p>${t("view.healthNote")}</p></div>
    <div class="note prose"><p>${t("view.noNormNote")}</p></div>
    <div class="note prose"><p>${t(result.beliefs === "destiny" ? "view.closing.destiny" : "view.closing.growth")}</p></div>
    <div class="note prose"><p>${t("view.supportNote")}</p></div>`;
}

function instructions(result, t) {
  // A card's heading names the field it came from rather than the option, so
  // the sheet reads "How I would rather be approached" instead of repeating
  // the answer twice.
  const headingFor = (key) => `${key.split(".").slice(0, 2).join(".")}.title`;

  const cards = result.cards.slice(0, 3).map((key) => ({
    channel: "affection",
    title: t(headingFor(key)),
    body: t(`${key}.card`),
  }));

  if (result.hardest) {
    // The one card drawn from a private answer. It is a request for help
    // rather than a disclosure of a score, which is the difference that makes
    // it safe to put on a sheet.
    cards.push({
      channel: "communication",
      title: t("instructions.hardestTitle"),
      body: t(`comfort.${result.hardest}.ask`),
    });
  }
  return cards;
}

/**
 * Two lists of requests, side by side, and the overlap.
 *
 * No gap metric, no compatibility figure, and above all no desire-discrepancy
 * number to either party. Discrepancy is normative and dyadic, its meaning
 * lives in the components rather than the difference, and "the app says we're
 * mismatched" is a sentence that will be used in an argument.
 */
function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const shared = a.cards.filter((key) => b.cards.includes(key));
  const aOnly = a.cards.filter((key) => !b.cards.includes(key));
  const bOnly = b.cards.filter((key) => !a.cards.includes(key));

  const column = (keys) => keys.length
    ? join(keys.map((key) => html`<p class="prose">${t(`${key}.card`)}</p>`))
    : html`<p class="prose muted">${t("compare.nothingHere")}</p>`;

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: t("compare.title"),
      body: t("compare.body"),
    })}

    ${shared.length ? html`<section class="sub-plate">
      <h4>${t("compare.sharedHeading")}</h4>
      <div class="cards">
        ${join(shared.map((key) => html`<div class="card pad instruction-card"><p class="prose">${t(`${key}.card`)}</p></div>`))}
      </div>
    </section>` : ""}

    <div class="exchange">
      <div><span class="label">${t("compare.asks", { name: nameA })}</span>${column(aOnly)}</div>
      <div><span class="label">${t("compare.asks", { name: nameB })}</span>${column(bOnly)}</div>
    </div>

    <div class="note prose"><p>${t("compare.noScoreNote")}</p></div>`;
}

export default {
  id: "intimacy-conditions",
  version: 1,
  family: "questionnaire",
  glyph: "◡",
  minutes: 6,
  channels: ["affection", "communication"],

  /** Private by default, and public is not on the menu at all. */
  adult: true,
  sensitive: true,
  maxAudience: "partner",

  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
    es: () => import("./i18n/es.js"),
    de: () => import("./i18n/de.js"),
  },
  form: (t) => ({
    kind: "items",
    items: itemsFor(t),
    scale: scaleFor("agree5", t),
    shuffle: false,
    optional: true,
    pageSize: 4,
  }),
  score, view, instructions, compare,
};
