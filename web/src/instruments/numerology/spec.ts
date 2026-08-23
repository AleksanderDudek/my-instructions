import { profile, match, type Chart } from "./compute";
import { daysIn } from "./calendar";
import { ELEMENTS } from "./data";
import type { Answers, InstrumentSpec, InstructionCard, Locale, T } from "@/core/types";

/**
 * The profiler family, and the reason it exists.
 *
 * This instrument asks for facts, not opinions — a birth date and a name — and
 * derives rather than scores. It shares nothing with the questionnaires except
 * the contract. That is the whole argument for the plugin shape: adding a test
 * that works nothing like the others cost one folder.
 *
 * It is also the one instrument in the app with no empirical support
 * whatsoever, and the copy says so rather than hedging.
 */

/** Month names come from the platform, so the picker follows the reader's locale. */
function monthOptions(locale: string) {
  const format = new Intl.DateTimeFormat(locale, { month: "long" });
  return Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: format.format(new Date(2001, i, 1)),
  }));
}

export type NumerologyResult = Chart & { outOfRange: boolean };

export function score(answers: Answers): NumerologyResult {
  const p = profile(
    Number(answers.day),
    Number(answers.month),
    Number(answers.year),
    String(answers.name ?? "").trim(),
  );
  return { ...p, outOfRange: p.y < 1900 || p.y > 2050 };
}

/** Field-level validation, run before `score`. */
export function validate(answers: Answers, t: T = (key) => key): Record<string, string> {
  const errors: Record<string, string> = {};
  const d = Number(answers.day);
  const m = Number(answers.month);
  const y = Number(answers.year);
  if (!Number.isInteger(y) || y < 1 || y > 3000) errors.year = t("form.badYear");
  if (!Number.isInteger(d) || d < 1) errors.day = t("form.badDay");
  else if (Number.isInteger(y) && Number.isInteger(m) && d > daysIn(m, y)) {
    errors.day = t("form.shortMonth", {
      month: new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(2001, m - 1, 1)),
      year: y,
      days: daysIn(m, y),
    });
  }
  return errors;
}

/**
 * The instruction cards are the honest part.
 *
 * What a chart can legitimately contribute to a page about how to deal with
 * somebody is a vocabulary and a self-description, not a claim. So the cards
 * are phrased as self-report — this is the register I recognise myself in —
 * and filed under `rhythm`, the channel reserved for things that are true
 * because the person says so.
 */
export function instructions(result: NumerologyResult, t: T): InstructionCard[] {
  const n = result.destiny.value;
  return [
    {
      channel: "rhythm",
      title: t("instructions.destinyTitle", { number: n, name: t(`num.${n}.name`) }),
      body: t(`num.${n}.blurb`),
    },
    {
      channel: "rhythm",
      title: t("instructions.signsTitle", {
        element: t(`element.${ELEMENTS[result.elementIdx]}`),
        animal: t(`animal.${result.animalIdx}.name`),
        sign: t(`sign.${result.sign}.name`),
      }),
      body: `${t(`animal.${result.animalIdx}.blurb`)} ${t(`sign.${result.sign}.blurb`)}`,
    },
  ];
}

export const compare = (a: NumerologyResult, b: NumerologyResult, t: T) => match(a, b, t);

export const spec: InstrumentSpec<NumerologyResult> = {
  id: "numerology",
  version: 1,
  family: "profiler",
  glyph: "9",
  minutes: 1,
  channels: ["rhythm"],
  tier: "free",
  messages: {
    en: () => import("./i18n/en"),
    pl: () => import("./i18n/pl"),
    es: () => import("./i18n/es"),
    de: () => import("./i18n/de"),
  },
  form: (t, locale: Locale = "en") => ({
    kind: "fields",
    fields: [
      { id: "name", kind: "text", label: t("form.name"), placeholder: t("form.namePlaceholder"), optional: true },
      { id: "day", kind: "number", label: t("form.day"), min: 1, max: 31, value: 8 },
      { id: "month", kind: "select", label: t("form.month"), options: monthOptions(locale), value: "1" },
      { id: "year", kind: "number", label: t("form.year"), min: 1900, max: 2050, value: 1993 },
    ],
    note: t("form.note"),
  }),
  score,
  validate,
  instructions,
};

export default spec;
