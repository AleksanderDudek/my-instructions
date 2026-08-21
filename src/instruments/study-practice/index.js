import { html, join } from "../../core/html.js";
import { factsHTML, verdictHTML } from "../../ui/components/scorecard.js";

/**
 * What you do, not what you are.
 *
 * This folder exists because the instrument it replaces should not. A visual /
 * auditory / reading / kinaesthetic style asks the reader to accept the meshing
 * hypothesis — that instruction matched to a style produces better learning —
 * and the reviews do not support it. It is also a four-way forced assignment,
 * which is ipsative in the way `love-languages/items.js` already argues
 * against, and it is a fixed-identity claim about capability, which self-report
 * cannot make.
 *
 * What survives is the version that is true: which techniques you actually use.
 * Dunlosky, Rawson, Marsh, Nathan and Willingham (2013) rated distributed
 * practice and retrieval practice high utility, and rereading, highlighting and
 * summarisation low; Rohrer and Pashler add interleaving. Those are behaviours
 * with plain names, so no items need borrowing — only asking.
 *
 * Nothing here is scored. `repertoire` is a *count of behaviours*, which is the
 * one breadth reading in this app that needs no norms: it does not say you are
 * broader than other people, it says how many of six named things you do.
 */

const HOW_OFTEN = ["never", "rarely", "sometimes", "often"];

/** The six techniques, and whether the evidence favours them. */
const TECHNIQUES = [
  { id: "retrieval", utility: "high" },
  { id: "spacing", utility: "high" },
  { id: "interleaving", utility: "high" },
  { id: "elaboration", utility: "high" },
  { id: "rereading", utility: "low" },
  { id: "highlighting", utility: "low" },
];

const CHOICES = [
  { id: "check", options: ["reread", "recall", "explain", "problem"] },
  { id: "wrong", options: ["moveOn", "reread", "redo", "findWhy"] },
  { id: "start", options: ["earlySpread", "earlyOnce", "nightBefore"] },
];

/** Used at least sometimes counts as part of the repertoire. */
const USES = (value) => HOW_OFTEN.indexOf(value) >= HOW_OFTEN.indexOf("sometimes");

function form(t) {
  return {
    kind: "fields",
    fields: [
      ...TECHNIQUES.map((tech) => ({
        id: tech.id, kind: "select", label: t(`technique.${tech.id}.label`), value: "sometimes",
        options: HOW_OFTEN.map((value) => ({ value, label: t(`often.${value}`) })),
      })),
      ...CHOICES.map((f) => ({
        id: f.id, kind: "select", label: t(`field.${f.id}.label`), value: f.options[0],
        options: f.options.map((value) => ({ value, label: t(`field.${f.id}.${value}`) })),
      })),
    ],
    note: t("form.note"),
  };
}

function score(answers) {
  const uses = {};
  for (const tech of TECHNIQUES) {
    uses[tech.id] = HOW_OFTEN.includes(answers[tech.id]) ? answers[tech.id] : "sometimes";
  }

  const high = TECHNIQUES.filter((tech) => tech.utility === "high");
  const low = TECHNIQUES.filter((tech) => tech.utility === "low");
  const depth = (tech) => HOW_OFTEN.indexOf(uses[tech.id]);

  const repertoire = high.filter((tech) => USES(uses[tech.id])).length;
  const missing = high.filter((tech) => !USES(uses[tech.id])).map((tech) => tech.id);

  // Which way the person's habits lean, as a coarse three-state summary. Not a
  // score: the two groups have different sizes and the arithmetic below is a
  // comparison of averages, which is worth exactly one word of output.
  const highMean = high.reduce((a, tech) => a + depth(tech), 0) / high.length;
  const lowMean = low.reduce((a, tech) => a + depth(tech), 0) / low.length;
  const gap = highMean - lowMean;
  const leaning = gap > 0.5 ? "retrieval" : gap < -0.5 ? "restudy" : "mixed";

  const choices = {};
  for (const f of CHOICES) choices[f.id] = f.options.includes(answers[f.id]) ? answers[f.id] : f.options[0];

  return { v: 1, uses, choices, repertoire, missing, leaning, total: high.length };
}

function view(result, { t }) {
  return html`
    ${verdictHTML({
      t,
      eyebrow: t("view.eyebrow"),
      title: t("view.title", { count: result.repertoire, total: result.total }),
      body: t(`view.leaning.${result.leaning}`),
    })}
    ${factsHTML(TECHNIQUES.map((tech) => [
      t(`technique.${tech.id}.label`),
      t("view.techniqueValue", { often: t(`often.${result.uses[tech.id]}`), what: t(`technique.${tech.id}.what`) }),
    ]))}

    <section class="sub-plate">
      <h4>${t("view.adviceHeading")} <span class="label">${t("view.adviceNote")}</span></h4>
      <div class="cards">
        ${result.missing.length
          ? join(result.missing.map((id) => html`<div class="card pad instruction-card">
              <span class="label">${t("view.adviceLabel")}</span>
              <h4>${t(`technique.${id}.label`)}</h4>
              <p class="prose">${t(`technique.${id}.advice`)}</p>
            </div>`))
          : html`<div class="card pad"><p class="prose">${t("view.adviceNoneMissing")}</p></div>`}
      </div>
    </section>

    ${factsHTML(CHOICES.map((f) => [t(`field.${f.id}.label`), t(`answer.${f.id}.${result.choices[f.id]}`)]))}
    <div class="note prose"><p>${t("view.notAStyleNote")}</p></div>
    <div class="note prose"><p>${t("view.countNote")}</p></div>`;
}

function instructions(result, t) {
  const cards = [
    { channel: "work", title: t("instructions.repertoireTitle", { count: result.repertoire, total: result.total }), body: t(`instructions.leaning.${result.leaning}`) },
    { channel: "work", title: t("instructions.checkTitle"), body: t(`ask.check.${result.choices.check}`) },
  ];
  if (result.missing.length) {
    cards.push({
      channel: "work",
      title: t("instructions.missingTitle"),
      body: t("instructions.missingBody", { techniques: result.missing.map((id) => t(`technique.${id}.label`)).join(", ") }),
    });
  }
  return cards;
}

/**
 * Two people's study habits do not collide the way their working preferences
 * do — there is no version of "you revise differently" that is a problem to be
 * managed. So the comparison is a swap rather than a diagnosis: what each does
 * that the other does not.
 */
function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const aOnly = TECHNIQUES.filter((tech) => USES(a.uses[tech.id]) && !USES(b.uses[tech.id]));
  const bOnly = TECHNIQUES.filter((tech) => USES(b.uses[tech.id]) && !USES(a.uses[tech.id]));
  const both = TECHNIQUES.filter((tech) => USES(a.uses[tech.id]) && USES(b.uses[tech.id]));

  const names = (list) => list.map((tech) => t(`technique.${tech.id}.label`)).join(", ");

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: t("compare.title", { a: a.repertoire, b: b.repertoire, total: a.total }),
      body: t(aOnly.length || bOnly.length ? "compare.body" : "compare.bodySame", { nameA, nameB }),
    })}
    ${factsHTML([
      [t("compare.fact.shared"), both.length ? names(both) : t("compare.none")],
      [t("compare.fact.aOnly", { name: nameA }), aOnly.length ? names(aOnly) : t("compare.none")],
      [t("compare.fact.bOnly", { name: nameB }), bOnly.length ? names(bOnly) : t("compare.none")],
    ])}`;
}

export { TECHNIQUES, HOW_OFTEN, USES };

export default {
  id: "study-practice",
  version: 1,
  family: "profiler",
  glyph: "✍",
  minutes: 3,
  channels: ["work"],
  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
    es: () => import("./i18n/es.js"),
    de: () => import("./i18n/de.js"),
  },
  form, score, view, instructions, compare,
};
