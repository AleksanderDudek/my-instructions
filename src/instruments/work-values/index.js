import { html, join } from "../../core/html.js";
import { scaleFor, scoreLikert, rank, dispersion, band } from "../../core/scoring.js";
import { barsHTML, verdictHTML, factsHTML } from "../../ui/components/scorecard.js";
import { GLYPHS, ORDER, ITEMS } from "./items.js";

/**
 * What to look for in a job, without naming one.
 *
 * `riasec` ends by saying it is not a career recommendation, and until now
 * nothing picked up after it. Interests say which subject holds your
 * attention; values say what a job has to give you before the subject matters
 * at all. Someone can be correctly placed by interest and still leave inside a
 * year because the thing they actually needed was never on the list.
 *
 * Two readings come out, and only one of them is an ordering.
 *
 * The ordering is the six values ranked. It is worth printing only when the
 * profile is differentiated enough for the order to mean something, which is
 * what `dispersion` decides, on the shared threshold rather than a local one.
 *
 * The other reading is a **count**: how many of the six the reader placed in
 * the high band. A count needs no norms and no population — it is not a claim
 * that you want more than other people, it is the number of things you called
 * essential. Six of six is the most common failure mode of every values
 * instrument ever sold, and it is a finding rather than a flat profile: a
 * person for whom everything is non-negotiable has not yet chosen anything.
 */

const scale = scaleFor("agree5", (key) => key);

/** The high band's floor, from `band()`. Named here so the copy can quote it. */
const ESSENTIAL = 62;

function score(answers) {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const ranked = rank(scores);
  const { range: spread, evenness } = dispersion(scores);

  // Values spread less than interests do — everybody wants to be paid and
  // nobody wants a bad manager — so the shared fifteen-point floor is the
  // right one here rather than riasec's raised twenty.
  const flat = spread < 15;

  const mustHaves = ranked.filter((r) => r.score >= ESSENTIAL).map((r) => r.key);
  const tradeable = ranked.filter((r) => r.score < 39).map((r) => r.key);

  return {
    scores, ranked,
    top: ranked.slice(0, 3).map((r) => r.key),
    lead: ranked[0].key,
    lowest: ranked[ranked.length - 1].key,
    spread,
    /** How evenly the six are held, 0 concentrated to 100 even. */
    evenness,
    flat,
    mustHaves,
    tradeable,
    /** Everything matters, which is the same as nothing being decisive. */
    undiscriminating: mustHaves.length >= 5,
    /** Nothing reached the high band: a list of preferences, not requirements. */
    nothingEssential: mustHaves.length === 0,
    answered, total,
  };
}

const rows = (result, t) =>
  result.ranked.map((r) => ({
    key: r.key,
    label: `${GLYPHS[r.key]} ${t(`value.${r.key}.label`)}`,
    score: r.score,
    blurb: t(`value.${r.key}.blurb`),
  }));

function view(result, { t }) {
  const [first, second] = result.top;
  const names = (keys) => keys.map((k) => t(`value.${k}.label`)).join(", ");

  return html`
    ${verdictHTML({
      t,
      // A flat profile at the *top* of the range is not the flat profile the
      // "no value stands out" copy describes. Someone who called all six
      // essential has a very definite list; what they lack is a way to choose
      // between its items, and telling them they carry no checklist into a job
      // would be the exact opposite of true. Elevation decides which sentence
      // a flat profile gets, so the two readings can never both be printed.
      eyebrow: result.undiscriminating ? t("view.eyebrowEverything")
        : result.flat ? t("view.eyebrowFlat") : t("view.eyebrow"),
      title: result.undiscriminating ? t("view.titleEverything")
        : result.flat ? t("view.titleFlat") : t("view.title", { first: t(`value.${first}.label`) }),
      score: result.ranked[0].score,
      body: result.undiscriminating
        ? t("view.bodyEverything", { count: result.mustHaves.length, first: t(`value.${first}.label`), second: t(`value.${second}.label`) })
        : result.flat
        ? t("view.bodyFlat", { spread: result.spread })
        : t("view.body", {
            first: t(`value.${first}.label`), second: t(`value.${second}.label`),
            blurb: t(`value.${first}.blurb`),
          }),
    })}
    ${barsHTML(rows(result, t))}

    <section class="sub-plate">
      <h4>${t("view.askHeading")} <span class="label">${t("view.askNote")}</span></h4>
      <div class="cards">
        ${join(result.top.map((key) => html`<div class="card pad instruction-card">
          <span class="label">${t(`value.${key}.label`)}</span>
          <h4>${t(`value.${key}.lookFor`)}</h4>
          <p class="prose">${t(`value.${key}.ask`)}</p>
        </div>`))}
      </div>
    </section>

    ${factsHTML([
      [t("view.fact.essential"), result.nothingEssential
        ? t("view.essentialNone")
        : t("view.essentialValue", { count: result.mustHaves.length, names: names(result.mustHaves) })],
      [t("view.fact.tradeable"), result.tradeable.length
        ? t("view.tradeableValue", { names: names(result.tradeable) })
        : t("view.tradeableNone")],
      [t("view.fact.spread"), t(result.flat ? "view.spreadFlat" : "view.spreadValue", { spread: result.spread })],
    ])}

    ${result.undiscriminating
      ? html`<div class="note prose"><p>${t("view.undiscriminatingNote", { count: result.mustHaves.length })}</p></div>`
      : ""}
    <div class="note prose"><p>${t("view.notAbilityNote")}</p></div>
    <div class="note warn-note prose"><p>${t("view.fitNote")}</p></div>`;
}

function instructions(result, t) {
  const [first, second] = result.top;
  const cards = [
    { channel: "work", title: t("instructions.leadTitle", { value: t(`value.${first}.label`) }), body: t(`value.${first}.ask`) },
    { channel: "work", title: t("instructions.secondTitle", { value: t(`value.${second}.label`) }), body: t(`value.${second}.ask`) },
  ];
  // Not when the lowest value is itself in the high band: calling something a
  // thing you do not need, on a sheet that also calls it essential, is the
  // reader's problem to explain and ours to have prevented.
  if (!result.mustHaves.includes(result.lowest)) {
    cards.push({ channel: "energy", title: t("instructions.absentTitle", { value: t(`value.${result.lowest}.label`) }), body: t(`value.${result.lowest}.absent`) });
  }
  if (result.undiscriminating) {
    cards.push({ channel: "work", title: t("instructions.everythingTitle"), body: t("instructions.everythingBody", { count: result.mustHaves.length }) });
  }
  // Not when everything is essential: that profile is flat and demanding, and
  // the "no standing requirements" card would contradict the card above it.
  if (result.flat && !result.undiscriminating) {
    cards.push({ channel: "work", title: t("instructions.flatTitle"), body: t("instructions.flatBody") });
  }
  return cards;
}

/**
 * Two people's values do not average, they collide — and only in one
 * direction that matters. What one person calls essential and the other calls
 * tradeable is the disagreement worth naming; two people who both shrug at
 * recognition have nothing to discuss.
 */
function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const oneSided = ORDER.filter((k) =>
    (a.mustHaves.includes(k) && b.tradeable.includes(k)) ||
    (b.mustHaves.includes(k) && a.tradeable.includes(k)));
  const shared = ORDER.filter((k) => a.mustHaves.includes(k) && b.mustHaves.includes(k));
  const label = (k) => t(`value.${k}.label`);

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: oneSided.length ? t("compare.title", { count: oneSided.length }) : t("compare.titleNone"),
      body: t(oneSided.length ? "compare.body" : "compare.bodyNone", { nameA, nameB }),
    })}
    ${oneSided.length ? html`<div class="cards">
      ${join(oneSided.map((k) => {
        const needs = a.mustHaves.includes(k) ? nameA : nameB;
        const shrugs = a.mustHaves.includes(k) ? nameB : nameA;
        return html`<div class="card pad instruction-card">
          <span class="label">${label(k)}</span>
          <h4>${t("compare.clashHeading", { needs, shrugs })}</h4>
          <p class="prose">${t(`value.${k}.clash`)}</p>
        </div>`;
      }))}
    </div>` : ""}
    ${factsHTML([
      [t("compare.fact.shared"), shared.length ? shared.map(label).join(", ") : t("compare.sharedNone")],
      [t("compare.fact.leads"), t("compare.leadsValue", { nameA, nameB, a: label(a.lead), b: label(b.lead) })],
    ])}`;
}

export { ESSENTIAL };

export default {
  id: "work-values",
  version: 1,
  family: "questionnaire",
  glyph: "◇",
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
