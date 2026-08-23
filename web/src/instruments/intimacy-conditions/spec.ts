import { scaleFor } from "@/core/scoring";
import type { Answers, InstructionCard, InstrumentSpec, T } from "@/core/types";
import { COMFORT, CONDITIONS, PRACTICE, BELIEFS, itemsFor } from "./items";

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

/** Which of the two closing paragraphs the reader's own page shows. */
export type BeliefLean = "growth" | "destiny" | "mixed";

export type IntimacyResult = {
  v: number;
  conditions: Record<string, string | null>;
  practice: Record<string, string | null>;
  /** Raw comfort responses, for the reader's own page. Never a scale. */
  comfort: Record<string, number>;
  beliefs: BeliefLean | null;
  /** The whole shareable surface: message keys, in order. */
  cards: string[];
  hardest: string | null;
  answered: number;
  total: number;
};

/**
 * `Number.isFinite` does not coerce, so a string answer was already excluded
 * in the vanilla implementation. This is that test with the narrowing written
 * down, and it accepts exactly the same values.
 */
const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

/** An identity `t`: item counting needs the bank's shape, not its words. */
const identity: T = (key) => key;

export function score(answers: Answers): IntimacyResult {
  const conditions: Record<string, string | null> = {};
  for (const f of CONDITIONS) {
    const given = answers[`n.${f.id}`];
    conditions[f.id] = typeof given === "string" && f.options.includes(given) ? given : null;
  }

  const practice: Record<string, string | null> = {};
  for (const f of PRACTICE) {
    const given = answers[`p.${f.id}`];
    practice[f.id] = typeof given === "string" && f.options.includes(given) ? given : null;
  }

  // Comfort stays as raw responses and never becomes a scale. A "comfort
  // score" would rank people on how good they are at talking about sex, which
  // is a thing to help with and not a thing to grade.
  const comfort: Record<string, number> = {};
  for (const id of COMFORT) {
    const given = answers[`c.${id}`];
    if (isNumber(given)) comfort[id] = given;
  }

  const beliefValues = BELIEFS.map((id) => answers[`b.${id}`]).filter(isNumber);
  const beliefMean = beliefValues.length ? beliefValues.reduce((a, b) => a + b, 0) / beliefValues.length : null;
  const beliefs: BeliefLean | null =
    beliefMean === null ? null : beliefMean >= 3.5 ? "growth" : beliefMean <= 2.5 ? "destiny" : "mixed";

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
    total: itemsFor(identity).length,
  };
}

export function instructions(result: IntimacyResult, t: T): InstructionCard[] {
  // A card's heading names the field it came from rather than the option, so
  // the sheet reads "How I would rather be approached" instead of repeating
  // the answer twice.
  const headingFor = (key: string) => `${key.split(".").slice(0, 2).join(".")}.title`;

  const cards: InstructionCard[] = result.cards.slice(0, 3).map((key) => ({
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
 * mismatched" is a sentence that will be used in an argument. So the
 * comparison computes set membership and stops: three lists of message keys,
 * and not one number for anybody to quote at anybody.
 */
export type CardLists = { shared: string[]; aOnly: string[]; bOnly: string[] };

export function compare(a: IntimacyResult, b: IntimacyResult): CardLists {
  return {
    shared: a.cards.filter((key) => b.cards.includes(key)),
    aOnly: a.cards.filter((key) => !b.cards.includes(key)),
    bOnly: b.cards.filter((key) => !a.cards.includes(key)),
  };
}

export const spec: InstrumentSpec<IntimacyResult> = {
  id: "intimacy-conditions",
  version: 1,
  family: "questionnaire",
  glyph: "◡",
  minutes: 6,
  channels: ["affection", "communication"],
  tier: "premium",

  /** Private by default, and public is not on the menu at all. */
  adult: true,
  sensitive: true,
  maxAudience: "partner",

  messages: {
    en: () => import("./i18n/en"),
    pl: () => import("./i18n/pl"),
    es: () => import("./i18n/es"),
    de: () => import("./i18n/de"),
  },
  form: (t) => ({
    kind: "items",
    items: itemsFor(t),
    scale: scaleFor("agree5", t),
    shuffle: false,
    optional: true,
    pageSize: 4,
  }),
  score,
  instructions,
  compare,
};

export default spec;
