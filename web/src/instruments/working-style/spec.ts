import type { Answers, Form, InstructionCard, InstrumentSpec, T } from "@/core/types";
import { FIELDS, MULTI, OPPOSED, type FieldId, type MultiId } from "./fields";

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

/** Ids in, ids out. Every word on the page is resolved from these by the View. */
export type WorkingStyleResult = {
  choices: Record<FieldId, string>;
  picks: Record<MultiId, string[]>;
};

export function form(t: T): Form {
  return {
    kind: "fields",
    fields: [
      ...FIELDS.map((f) => ({
        id: f.id,
        kind: "select" as const,
        label: t(`field.${f.id}.label`),
        value: f.options[1] ?? f.options[0],
        options: f.options.map((value) => ({ value, label: t(`field.${f.id}.${value}`) })),
      })),
      ...MULTI.map((f) => ({
        id: f.id,
        kind: "multi" as const,
        label: t(`field.${f.id}.label`),
        max: f.max,
        options: f.options.map((value) => ({ value, label: t(`field.${f.id}.${value}`) })),
      })),
    ],
    note: t("form.note"),
  };
}

export function validate(answers: Answers, t: T = (key) => key): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of MULTI) {
    const given = answers[f.id];
    const picked = Array.isArray(given) || typeof given === "string" ? given : [];
    if (!picked.length) errors[f.id] = t("form.pickOne");
    else if (picked.length > f.max) errors[f.id] = t("form.tooMany", { max: f.max });
  }
  return errors;
}

/**
 * Nothing is computed. The answers are the result, normalised to the option
 * ids so that a sheet filled in Polish means the same thing read in German.
 */
export function score(answers: Answers): WorkingStyleResult {
  const choices = {} as Record<FieldId, string>;
  for (const f of FIELDS) {
    const given = answers[f.id];
    const options: readonly string[] = f.options;
    choices[f.id] = typeof given === "string" && options.includes(given) ? given : (options[1] ?? options[0]);
  }
  // Multi answers are arrays, but a stored run from an older build — or a
  // half-filled draft — may hold anything at all, and a result that throws is
  // worse than one that is empty.
  const picks = {} as Record<MultiId, string[]>;
  for (const f of MULTI) {
    const given = answers[f.id];
    const picked = Array.isArray(given) ? given : [];
    const options: readonly string[] = f.options;
    picks[f.id] = picked.filter((v) => options.includes(v)).slice(0, f.max);
  }
  return { choices, picks };
}

/** The chosen hours or conditions, in the reader's language, as one phrase. */
export const listOf = (result: WorkingStyleResult, field: MultiId, t: T) =>
  (result.picks[field] ?? []).map((value) => t(`field.${field}.${value}`)).join(", ");

export function instructions(result: WorkingStyleResult, t: T): InstructionCard[] {
  const pick = (field: FieldId) => t(`ask.${field}.${result.choices[field]}`);
  return [
    { channel: "work", title: t("instructions.interruptionTitle"), body: pick("interruption") },
    { channel: "communication", title: t("instructions.feedbackTitle"), body: pick("feedback") },
    { channel: "work", title: t("instructions.noticeTitle"), body: pick("notice") },
    {
      channel: "energy",
      title: t("instructions.peakTitle"),
      body: t("instructions.peakBody", { when: listOf(result, "peak", t), where: listOf(result, "environment", t) }),
    },
    { channel: "work", title: t("instructions.decisionsTitle"), body: pick("decisions") },
    {
      channel: "communication",
      title: t("instructions.briefTitle"),
      body: t("instructions.briefBody", { brief: pick("brief"), prep: pick("prep") }),
    },
    { channel: "communication", title: t("instructions.evidenceTitle"), body: pick("evidence") },
    { channel: "conflict", title: t("instructions.repairTitle"), body: pick("repair") },
    { channel: "communication", title: t("instructions.dissentTitle"), body: pick("dissent") },
  ];
}

/**
 * Two people, and no similarity figure between them.
 *
 * The reading is a list of the questions where their answers sit at opposite
 * ends, in the order the questions are asked — a clash is a specific thing to
 * agree about, and averaging eleven of them into a percentage would throw away
 * the only part either of them can act on.
 */
export type WorkingStyleComparison = {
  clashes: FieldId[];
  agreements: FieldId[];
  sharedPeak: string[];
};

export function compare(a: WorkingStyleResult, b: WorkingStyleResult): WorkingStyleComparison {
  const clashes = FIELDS.filter((f) => {
    const [low, high] = OPPOSED[f.id];
    const pair = [a.choices[f.id], b.choices[f.id]];
    return pair.includes(low) && pair.includes(high);
  }).map((f) => f.id);

  const agreements = FIELDS.filter((f) => a.choices[f.id] === b.choices[f.id]).map((f) => f.id);

  const sharedPeak = (a.picks.peak ?? []).filter((v) => (b.picks.peak ?? []).includes(v));

  return { clashes, agreements, sharedPeak };
}

export const spec: InstrumentSpec<WorkingStyleResult> = {
  id: "working-style",
  version: 2,
  family: "profiler",
  glyph: "▦",
  minutes: 3,
  channels: ["work", "communication", "energy", "conflict"],
  tier: "premium",
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
