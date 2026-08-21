import { html } from "../../core/html.js";
import { factsHTML, verdictHTML } from "../../ui/components/scorecard.js";
import { toClock, toMinutes, chronotype, DAY } from "./compute.js";

/**
 * A profiler, not a questionnaire.
 *
 * Nobody needs to be asked twenty times whether they are a morning person.
 * Four clock times and a count of working days give a better answer than an
 * opinion survey would, because they describe what actually happens rather
 * than how someone likes to think of themselves.
 *
 * The two numbers worth carrying away are the corrected mid-sleep — the clock
 * underneath, as far as it can be seen from the outside — and social jetlag,
 * the distance between that clock and the one the week imposes. The second is
 * the actionable one: it is measured in hours, it is nobody's personality, and
 * it moves when the schedule moves.
 */

const hours = (minutes) => Math.round((minutes / 60) * 10) / 10;

function form(t) {
  return {
    kind: "fields",
    fields: [
      { id: "workBed", kind: "time", label: t("form.workBed"), value: "23:00" },
      { id: "workWake", kind: "time", label: t("form.workWake"), value: "07:00" },
      { id: "freeBed", kind: "time", label: t("form.freeBed"), value: "00:00" },
      { id: "freeWake", kind: "time", label: t("form.freeWake"), value: "09:00" },
      { id: "workDays", kind: "number", label: t("form.workDays"), min: 0, max: 7, value: 5 },
      {
        id: "alarmOnFreeDays", kind: "select", label: t("form.alarm"), value: "no",
        options: [{ value: "no", label: t("form.alarmNo") }, { value: "yes", label: t("form.alarmYes") }],
      },
    ],
    note: t("form.note"),
  };
}

function validate(answers, t = (key) => key) {
  const errors = {};
  for (const id of ["workBed", "workWake", "freeBed", "freeWake"]) {
    if (toMinutes(answers[id]) === null) errors[id] = t("form.badTime");
  }
  const days = Number(answers.workDays);
  if (!Number.isInteger(days) || days < 0 || days > 7) errors.workDays = t("form.badDays");
  return errors;
}

function score(answers) {
  const reading = chronotype({ ...answers, alarmOnFreeDays: answers.alarmOnFreeDays === "yes" });
  if (!reading) return { incomplete: true };
  return {
    ...reading,
    // Stored as minutes, formatted at render time — a chart computed in Warsaw
    // has to mean the same thing when it is read in Madrid.
    severeJetlag: reading.socialJetlag >= 120,
    shortSleep: reading.sleepWeek < 7 * 60,
  };
}

function view(result, { t }) {
  if (result.incomplete) return html`<p class="prose">${t("view.incomplete")}</p>`;
  return html`
    ${verdictHTML({
      t,
      eyebrow: t("view.eyebrow"),
      title: t(`band.${result.band}.label`),
      body: t("view.body", { blurb: t(`band.${result.band}.blurb`), mid: toClock(result.msfsc) }),
    })}
    ${factsHTML([
      [t("view.fact.midSleep"), t("view.midSleepValue", { corrected: toClock(result.msfsc), raw: toClock(result.msf) })],
      [t("view.fact.jetlag"), t("view.jetlagValue", { hours: hours(result.socialJetlag) })],
      [t("view.fact.weekSleep"), t("view.weekSleepValue", { hours: hours(result.sleepWeek), work: hours(result.sleepWork), free: hours(result.sleepFree) })],
      [t("view.fact.debt"), result.debt ? t("view.debtValue", { hours: hours(result.debt) }) : t("view.debtNone")],
      [t("view.fact.window"), t("view.windowValue", { from: toClock(result.msfsc - 60), to: toClock(result.msfsc + 4 * 60) })],
    ])}
    ${result.severeJetlag ? html`<div class="note warn-note prose"><p>${t("view.jetlagNote", { hours: hours(result.socialJetlag) })}</p></div>` : ""}
    ${result.shortSleep ? html`<div class="note warn-note prose"><p>${t("view.shortSleepNote", { hours: hours(result.sleepWeek) })}</p></div>` : ""}
    <div class="note prose"><p>${t("view.methodNote")}</p></div>`;
}

function instructions(result, t) {
  if (result.incomplete) return [{ channel: "rhythm", title: t("instructions.incompleteTitle"), body: t("view.incomplete") }];
  const cards = [
    { channel: "rhythm", title: t("instructions.bandTitle", { band: t(`band.${result.band}.label`) }), body: t(`band.${result.band}.ask`) },
    {
      channel: "energy",
      title: t("instructions.peakTitle"),
      body: t("instructions.peakBody", { from: toClock(result.msfsc + 60), to: toClock(result.msfsc + 5 * 60) }),
    },
  ];
  if (result.severeJetlag) {
    cards.push({
      channel: "work",
      title: t("instructions.jetlagTitle"),
      body: t("instructions.jetlagBody", { hours: hours(result.socialJetlag), wake: toClock(result.msfsc + result.sleepFree / 2) }),
    });
  }
  return cards;
}

function compare(a, b, { nameA = "A", nameB = "B", t }) {
  if (a.incomplete || b.incomplete) return html`<p class="prose">${t("view.incomplete")}</p>`;

  const raw = Math.abs(a.msfsc - b.msfsc);
  const apart = Math.min(raw, DAY - raw);

  // Two people share the hours where both are awake and neither is at the
  // wrong end of their own day. Overlap of the good hours, not of the day.
  const startA = a.msfsc + 60, startB = b.msfsc + 60;
  const endA = a.msfsc + 5 * 60, endB = b.msfsc + 5 * 60;
  const overlap = Math.max(0, Math.min(endA, endB) - Math.max(startA, startB));

  const bodyKey = apart >= 180 ? "compare.farApart" : apart >= 90 ? "compare.someApart" : "compare.aligned";

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: t("compare.title", { hours: hours(apart) }),
      body: t(bodyKey, { nameA, nameB, hours: hours(apart), overlap: hours(overlap) }),
    })}
    ${factsHTML([
      [t("compare.fact.mid"), t("compare.midValue", { nameA, nameB, a: toClock(a.msfsc), b: toClock(b.msfsc) })],
      [t("compare.fact.overlap"), overlap > 0
        ? t("compare.overlapValue", { hours: hours(overlap), from: toClock(Math.max(startA, startB)), to: toClock(Math.min(endA, endB)) })
        : t("compare.overlapNone")],
      [t("compare.fact.jetlag"), t("compare.jetlagValue", { nameA, nameB, a: hours(a.socialJetlag), b: hours(b.socialJetlag) })],
    ])}`;
}

export default {
  id: "chronotype",
  version: 1,
  family: "profiler",
  glyph: "☾",
  minutes: 1,
  channels: ["rhythm", "energy", "work"],
  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
    es: () => import("./i18n/es.js"),
    de: () => import("./i18n/de.js"),
  },
  form, validate, score, view, instructions, compare,
};
