import type { Answers, Form, InstructionCard, InstrumentSpec, T } from "@/core/types";
import { DAY, chronotype, hours, toClock, toMinutes, type ChronotypeReading } from "./compute";

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

/** A draft with a time still missing. The View has to render it anyway. */
export type Incomplete = { incomplete: true };

export type ChronotypeScored = ChronotypeReading & {
  incomplete?: false;
  severeJetlag: boolean;
  shortSleep: boolean;
};

export type ChronotypeResult = Incomplete | ChronotypeScored;

export function form(t: T): Form {
  return {
    kind: "fields",
    fields: [
      { id: "workBed", kind: "time", label: t("form.workBed"), value: "23:00" },
      { id: "workWake", kind: "time", label: t("form.workWake"), value: "07:00" },
      { id: "freeBed", kind: "time", label: t("form.freeBed"), value: "00:00" },
      { id: "freeWake", kind: "time", label: t("form.freeWake"), value: "09:00" },
      { id: "workDays", kind: "number", label: t("form.workDays"), min: 0, max: 7, value: 5 },
      {
        id: "alarmOnFreeDays",
        kind: "select",
        label: t("form.alarm"),
        value: "no",
        options: [
          { value: "no", label: t("form.alarmNo") },
          { value: "yes", label: t("form.alarmYes") },
        ],
      },
    ],
    note: t("form.note"),
  };
}

export function validate(answers: Answers, t: T = (key) => key): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const id of ["workBed", "workWake", "freeBed", "freeWake"]) {
    if (toMinutes(answers[id]) === null) errors[id] = t("form.badTime");
  }
  const days = Number(answers.workDays);
  if (!Number.isInteger(days) || days < 0 || days > 7) errors.workDays = t("form.badDays");
  return errors;
}

export function score(answers: Answers): ChronotypeResult {
  const reading = chronotype({
    workBed: answers.workBed,
    workWake: answers.workWake,
    freeBed: answers.freeBed,
    freeWake: answers.freeWake,
    workDays: answers.workDays,
    alarmOnFreeDays: answers.alarmOnFreeDays === "yes",
  });
  if (!reading) return { incomplete: true };
  return {
    ...reading,
    // Stored as minutes, formatted at render time — a chart computed in Warsaw
    // has to mean the same thing when it is read in Madrid.
    severeJetlag: reading.socialJetlag >= 120,
    shortSleep: reading.sleepWeek < 7 * 60,
  };
}

export function instructions(result: ChronotypeResult, t: T): InstructionCard[] {
  if (result.incomplete) {
    return [{ channel: "rhythm", title: t("instructions.incompleteTitle"), body: t("view.incomplete") }];
  }
  const cards: InstructionCard[] = [
    {
      channel: "rhythm",
      title: t("instructions.bandTitle", { band: t(`band.${result.band}.label`) }),
      body: t(`band.${result.band}.ask`),
    },
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
      body: t("instructions.jetlagBody", {
        hours: hours(result.socialJetlag),
        wake: toClock(result.msfsc + result.sleepFree / 2),
      }),
    });
  }
  return cards;
}

/**
 * Two clocks, one reading — and no words in it.
 *
 * The band is a threshold on a number rather than a phrase, so the sentence
 * that gets said about "three hours apart" is chosen in the reader's language
 * by the component, not baked in here.
 */
export type ChronotypeComparison = {
  /** Minutes between the two corrected mid-sleeps, the short way round. */
  apart: number;
  /** Minutes of shared best hours, and the window they fall in. */
  overlap: number;
  from: number;
  to: number;
  band: "aligned" | "someApart" | "farApart";
};

export function compare(a: ChronotypeResult, b: ChronotypeResult): ChronotypeComparison | null {
  if (a.incomplete || b.incomplete) return null;

  const raw = Math.abs(a.msfsc - b.msfsc);
  const apart = Math.min(raw, DAY - raw);

  // Two people share the hours where both are awake and neither is at the
  // wrong end of their own day. Overlap of the good hours, not of the day.
  const startA = a.msfsc + 60,
    startB = b.msfsc + 60;
  const endA = a.msfsc + 5 * 60,
    endB = b.msfsc + 5 * 60;
  const from = Math.max(startA, startB);
  const to = Math.min(endA, endB);
  const overlap = Math.max(0, to - from);

  const band = apart >= 180 ? "farApart" : apart >= 90 ? "someApart" : "aligned";

  return { apart, overlap, from, to, band };
}

export const spec: InstrumentSpec<ChronotypeResult> = {
  id: "chronotype",
  version: 1,
  family: "profiler",
  glyph: "☾",
  minutes: 1,
  channels: ["rhythm", "energy", "work"],
  tier: "free",
  messages: {
    en: () => import("./i18n/en"),
    pl: () => import("./i18n/pl"),
    es: () => import("./i18n/es"),
    de: () => import("./i18n/de"),
  },
  form,
  validate,
  score,
  instructions,
  compare,
};

export default spec;
