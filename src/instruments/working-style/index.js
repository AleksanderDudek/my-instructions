import { html, join } from "../../core/html.js";
import { factsHTML, verdictHTML } from "../../ui/components/scorecard.js";

/**
 * Preferences, presented as preferences.
 *
 * There is no validated scale for how much notice you want before a plan
 * changes, because it is not a psychological construct — it is a fact about
 * how you would like to be treated. So this instrument measures nothing: no
 * 1–100, no bands, no percentile. It asks eight questions and hands the
 * answers back arranged.
 *
 * That is also why it is likely to be the most *useful* page on the sheet.
 * Everything else here is an inference about disposition; this is the part a
 * colleague can act on tomorrow without believing anything about personality.
 */

/**
 * Every question, with its options. Ids are stored, so they never change.
 *
 * The five added in version 2 are the ones a colleague cannot guess and would
 * otherwise learn by getting them wrong: how to hand you something, what
 * actually changes your mind, what to do after a clash, and where an objection
 * belongs. They are preferences in the same register as the rest — a fact about
 * how you would like to be treated, with no claimed benefit attached. Stating a
 * format preference does not predict better outcomes from that format, and this
 * folder does not imply that it does.
 */
const FIELDS = [
  { id: "interruption", options: ["protected", "mixed", "open"] },
  { id: "feedback", options: ["blunt", "direct", "cushioned"] },
  { id: "notice", options: ["none", "day", "week"] },
  { id: "meetings", options: ["few", "some", "many"] },
  { id: "mode", options: ["async", "mixed", "sync"] },
  { id: "decisions", options: ["fast", "gather", "consensus"] },
  { id: "brief", options: ["headline", "context", "written"] },
  { id: "prep", options: ["document", "agenda", "cold"] },
  { id: "evidence", options: ["number", "example", "user", "dissenter"] },
  { id: "repair", options: ["now", "hour", "explicit"] },
  { id: "dissent", options: ["meeting", "writing", "oneToOne"] },
];

/** Multi-select questions: several answers are a real answer here. */
const MULTI = [
  { id: "peak", options: ["earlyMorning", "morning", "afternoon", "evening", "night"], max: 2 },
  { id: "environment", options: ["silence", "quiet", "music", "bustle", "people"], max: 2 },
];

function form(t) {
  return {
    kind: "fields",
    fields: [
      ...FIELDS.map((f) => ({
        id: f.id, kind: "select", label: t(`field.${f.id}.label`), value: f.options[1] ?? f.options[0],
        options: f.options.map((value) => ({ value, label: t(`field.${f.id}.${value}`) })),
      })),
      ...MULTI.map((f) => ({
        id: f.id, kind: "multi", label: t(`field.${f.id}.label`), max: f.max,
        options: f.options.map((value) => ({ value, label: t(`field.${f.id}.${value}`) })),
      })),
    ],
    note: t("form.note"),
  };
}

function validate(answers, t = (key) => key) {
  const errors = {};
  for (const f of MULTI) {
    const picked = answers[f.id] ?? [];
    if (!picked.length) errors[f.id] = t("form.pickOne");
    else if (picked.length > f.max) errors[f.id] = t("form.tooMany", { max: f.max });
  }
  return errors;
}

/**
 * Nothing is computed. The answers are the result, normalised to the option
 * ids so that a sheet filled in Polish means the same thing read in German.
 */
function score(answers) {
  const out = { choices: {}, picks: {} };
  for (const f of FIELDS) out.choices[f.id] = f.options.includes(answers[f.id]) ? answers[f.id] : f.options[1] ?? f.options[0];
  // Multi answers are arrays, but a stored run from an older build — or a
  // half-filled draft — may hold anything at all, and a result that throws is
  // worse than one that is empty.
  for (const f of MULTI) {
    const picked = Array.isArray(answers[f.id]) ? answers[f.id] : [];
    out.picks[f.id] = picked.filter((v) => f.options.includes(v)).slice(0, f.max);
  }
  return out;
}

const listOf = (result, field, t) =>
  (result.picks[field] ?? []).map((value) => t(`field.${field}.${value}`)).join(", ");

function view(result, { t }) {
  return html`
    ${verdictHTML({
      t,
      eyebrow: t("view.eyebrow"),
      title: t("view.title"),
      body: t("view.body"),
    })}
    ${factsHTML([
      ...FIELDS.map((f) => [t(`field.${f.id}.label`), t(`answer.${f.id}.${result.choices[f.id]}`)]),
      ...MULTI.map((f) => [t(`field.${f.id}.label`), listOf(result, f.id, t) || t("view.nonePicked")]),
    ])}
    <div class="note prose"><p>${t("view.notAMeasureNote")}</p></div>
    <div class="note warn-note prose"><p>${t("view.notForDecisionsNote")}</p></div>`;
}

function instructions(result, t) {
  const pick = (field) => t(`ask.${field}.${result.choices[field]}`);
  return [
    { channel: "work", title: t("instructions.interruptionTitle"), body: pick("interruption") },
    { channel: "communication", title: t("instructions.feedbackTitle"), body: pick("feedback") },
    { channel: "work", title: t("instructions.noticeTitle"), body: pick("notice") },
    { channel: "energy", title: t("instructions.peakTitle"), body: t("instructions.peakBody", { when: listOf(result, "peak", t), where: listOf(result, "environment", t) }) },
    { channel: "work", title: t("instructions.decisionsTitle"), body: pick("decisions") },
    { channel: "communication", title: t("instructions.briefTitle"), body: t("instructions.briefBody", { brief: pick("brief"), prep: pick("prep") }) },
    { channel: "communication", title: t("instructions.evidenceTitle"), body: pick("evidence") },
    { channel: "conflict", title: t("instructions.repairTitle"), body: pick("repair") },
    { channel: "communication", title: t("instructions.dissentTitle"), body: pick("dissent") },
  ];
}

/**
 * The comparison is the point. Two people's preferences do not average — they
 * collide on specific questions, and naming which ones is worth more than any
 * overall similarity figure. So this reports the actual clashes, in order.
 */
const OPPOSED = {
  interruption: ["protected", "open"],
  feedback: ["blunt", "cushioned"],
  notice: ["none", "week"],
  meetings: ["few", "many"],
  mode: ["async", "sync"],
  decisions: ["fast", "consensus"],
  brief: ["headline", "written"],
  prep: ["document", "cold"],
  evidence: ["number", "user"],
  repair: ["now", "explicit"],
  dissent: ["meeting", "oneToOne"],
};

function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const clashes = FIELDS.filter((f) => {
    const [low, high] = OPPOSED[f.id];
    const pair = [a.choices[f.id], b.choices[f.id]];
    return pair.includes(low) && pair.includes(high);
  });
  const agreements = FIELDS.filter((f) => a.choices[f.id] === b.choices[f.id]);

  const sharedPeak = (a.picks.peak ?? []).filter((v) => (b.picks.peak ?? []).includes(v));

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: clashes.length
        ? t("compare.title", { count: clashes.length })
        : t("compare.titleNone"),
      body: clashes.length ? t("compare.body", { nameA, nameB }) : t("compare.bodyNone", { nameA, nameB }),
    })}
    ${clashes.length ? html`<div class="cards">
      ${join(clashes.map((f) => html`<div class="card pad instruction-card">
        <span class="label">${t(`field.${f.id}.label`)}</span>
        <h4>${t("compare.clashHeading", { nameA, nameB, a: t(`field.${f.id}.${a.choices[f.id]}`), b: t(`field.${f.id}.${b.choices[f.id]}`) })}</h4>
        <p class="prose">${t(`clash.${f.id}`)}</p>
      </div>`))}
    </div>` : ""}
    ${factsHTML([
      [t("compare.fact.agreed"), agreements.length
        ? agreements.map((f) => t(`field.${f.id}.label`)).join(", ")
        : t("compare.agreedNone")],
      [t("compare.fact.peak"), sharedPeak.length
        ? sharedPeak.map((v) => t(`field.peak.${v}`)).join(", ")
        : t("compare.peakNone")],
    ])}`;
}

export { FIELDS, MULTI, OPPOSED };

export default {
  id: "working-style",
  version: 2,
  family: "profiler",
  glyph: "▦",
  minutes: 3,
  channels: ["work", "communication", "energy", "conflict"],
  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
    es: () => import("./i18n/es.js"),
    de: () => import("./i18n/de.js"),
  },
  form, validate, score, view, instructions, compare,
};
