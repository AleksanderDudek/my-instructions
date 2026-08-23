import type { Answers, Form, InstructionCard, InstrumentSpec, T } from "@/core/types";
import { CHOICES, HOW_OFTEN, TECHNIQUES, USES, asOften, type HowOften, type Technique } from "./techniques";

/**
 * A profiler that measures nothing.
 *
 * Every number this file produces is a count of named behaviours the reader
 * said they perform — no norms, no percentage, no comparison to a population.
 * `leaning` is the only inference, and it is deliberately three coarse states
 * rather than a scale, because the two groups of techniques have different
 * sizes and the arithmetic behind it is worth exactly one word of output.
 */

/** Which way the habits lean, as a coarse three-state summary. */
export type Leaning = "retrieval" | "mixed" | "restudy";

export type StudyResult = {
  v: number;
  uses: Record<string, HowOften>;
  choices: Record<string, string>;
  repertoire: number;
  missing: string[];
  leaning: Leaning;
  total: number;
};

export function form(t: T): Form {
  return {
    kind: "fields",
    fields: [
      ...TECHNIQUES.map((tech) => ({
        id: tech.id,
        kind: "select" as const,
        label: t(`technique.${tech.id}.label`),
        value: "sometimes",
        options: HOW_OFTEN.map((value) => ({ value, label: t(`often.${value}`) })),
      })),
      ...CHOICES.map((f) => ({
        id: f.id,
        kind: "select" as const,
        label: t(`field.${f.id}.label`),
        value: f.options[0],
        options: f.options.map((value) => ({ value, label: t(`field.${f.id}.${value}`) })),
      })),
    ],
    note: t("form.note"),
  };
}

export function score(answers: Answers): StudyResult {
  const uses: Record<string, HowOften> = {};
  for (const tech of TECHNIQUES) {
    uses[tech.id] = asOften(answers[tech.id]);
  }

  const high = TECHNIQUES.filter((tech) => tech.utility === "high");
  const low = TECHNIQUES.filter((tech) => tech.utility === "low");
  const depth = (tech: Technique) => HOW_OFTEN.indexOf(uses[tech.id]);

  const repertoire = high.filter((tech) => USES(uses[tech.id])).length;
  const missing = high.filter((tech) => !USES(uses[tech.id])).map((tech) => tech.id);

  // Which way the person's habits lean, as a coarse three-state summary. Not a
  // score: the two groups have different sizes and the arithmetic below is a
  // comparison of averages, which is worth exactly one word of output.
  const highMean = high.reduce((a, tech) => a + depth(tech), 0) / high.length;
  const lowMean = low.reduce((a, tech) => a + depth(tech), 0) / low.length;
  const gap = highMean - lowMean;
  const leaning: Leaning = gap > 0.5 ? "retrieval" : gap < -0.5 ? "restudy" : "mixed";

  const choices: Record<string, string> = {};
  for (const f of CHOICES) {
    const given = answers[f.id];
    choices[f.id] = typeof given === "string" && f.options.includes(given) ? given : f.options[0];
  }

  return { v: 1, uses, choices, repertoire, missing, leaning, total: high.length };
}

export function instructions(result: StudyResult, t: T): InstructionCard[] {
  const cards: InstructionCard[] = [
    {
      channel: "work",
      title: t("instructions.repertoireTitle", { count: result.repertoire, total: result.total }),
      body: t(`instructions.leaning.${result.leaning}`),
    },
    { channel: "work", title: t("instructions.checkTitle"), body: t(`ask.check.${result.choices.check}`) },
  ];
  if (result.missing.length) {
    cards.push({
      channel: "work",
      title: t("instructions.missingTitle"),
      body: t("instructions.missingBody", {
        techniques: result.missing.map((id) => t(`technique.${id}.label`)).join(", "),
      }),
    });
  }
  return cards;
}

/**
 * Two people's study habits do not collide the way their working preferences
 * do — there is no version of "you revise differently" that is a problem to be
 * managed. So the comparison is a swap rather than a diagnosis: what each does
 * that the other does not.
 *
 * Technique ids come back rather than labels, because the words belong to the
 * reader's language and this file does not know which one that is.
 */
export type StudySwap = {
  shared: string[];
  aOnly: string[];
  bOnly: string[];
  /** Neither has a technique the other lacks: nothing to trade. */
  same: boolean;
};

export function compare(a: StudyResult, b: StudyResult): StudySwap {
  const aOnly = TECHNIQUES.filter((tech) => USES(a.uses[tech.id]) && !USES(b.uses[tech.id]));
  const bOnly = TECHNIQUES.filter((tech) => USES(b.uses[tech.id]) && !USES(a.uses[tech.id]));
  const both = TECHNIQUES.filter((tech) => USES(a.uses[tech.id]) && USES(b.uses[tech.id]));
  const ids = (list: Technique[]) => list.map((tech) => tech.id);

  return {
    shared: ids(both),
    aOnly: ids(aOnly),
    bOnly: ids(bOnly),
    same: !aOnly.length && !bOnly.length,
  };
}

export const spec: InstrumentSpec<StudyResult> = {
  id: "study-practice",
  version: 1,
  family: "profiler",
  glyph: "✍",
  minutes: 3,
  channels: ["work"],
  tier: "free",
  messages: {
    en: () => import("./i18n/en"),
    pl: () => import("./i18n/pl"),
    es: () => import("./i18n/es"),
    de: () => import("./i18n/de"),
  },
  form,
  score,
  instructions,
  compare,
};

export default spec;
