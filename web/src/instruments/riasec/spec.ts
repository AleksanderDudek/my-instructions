import { scaleFor, scoreLikert, rank, dispersion } from "@/core/scoring";
import type { Answers, InstrumentSpec, InstructionCard, T } from "@/core/types";
import { ORDER, ITEMS, type TypeKey } from "./items";

/**
 * Six interests, and two things about the shape they make.
 *
 * The three-letter code is the familiar output, but on its own it hides the
 * two facts that decide whether it means anything.
 *
 * *Differentiation* is the gap between the highest and lowest interest. A
 * person who is 70 on everything has a code, and it is noise.
 *
 * *Consistency* is where the top two sit on Holland's hexagon. Neighbouring
 * interests share something and combine easily; opposite ones pull against
 * each other, and someone holding both is describing a genuine tension rather
 * than a contradiction to be resolved.
 */

const scale = scaleFor("agree5", (key) => key);

/** Steps around the hexagon: 1 is adjacent, 3 is opposite. */
export function separation(a: TypeKey, b: TypeKey): number {
  const gap = Math.abs(ORDER.indexOf(a) - ORDER.indexOf(b));
  return Math.min(gap, ORDER.length - gap);
}

export type Consistency = "high" | "medium" | "low";

export const consistencyOf = (a: TypeKey, b: TypeKey): Consistency =>
  separation(a, b) === 1 ? "high" : separation(a, b) === 2 ? "medium" : "low";

/** The letter for each type, which is where the acronym comes from. */
export const LETTER: Record<TypeKey, string> = {
  realistic: "R",
  investigative: "I",
  artistic: "A",
  social: "S",
  enterprising: "E",
  conventional: "C",
};

export type Ranked = { key: TypeKey; score: number; rank: number };

export type RiasecResult = {
  scores: Record<string, number>;
  ranked: Ranked[];
  top: TypeKey[];
  code: string;
  spread: number;
  /** How evenly the six interests are held, 0 concentrated to 100 even. */
  evenness: number;
  flat: boolean;
  consistency: Consistency;
  opposed: boolean;
  answered: number;
  total: number;
};

export function score(answers: Answers): RiasecResult {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const ranked = rank(scores) as Ranked[];
  const top = ranked.slice(0, 3).map((r) => r.key);

  // `dispersion` is the app's one answer to "is this profile flat?". The
  // threshold is raised from the shared default of fifteen because interests
  // spread more widely than traits do, and twenty is where Holland's own
  // differentiation guidance sits.
  const { range: spread, evenness } = dispersion(scores);
  const consistency = consistencyOf(top[0], top[1]);

  return {
    scores,
    ranked,
    top,
    code: top.map((k) => LETTER[k]).join(""),
    spread,
    evenness,
    // Under about twenty points the ordering is mostly noise, and saying so is
    // more useful than handing someone three letters they will take seriously.
    flat: spread < 20,
    consistency,
    opposed: consistency === "low",
    answered,
    total,
  };
}

export function instructions(result: RiasecResult, t: T): InstructionCard[] {
  const [first, second] = result.top;
  const lowest = result.ranked[5].key;
  const cards: InstructionCard[] = [
    { channel: "work", title: t("instructions.leadTitle", { type: t(`type.${first}.label`) }), body: t(`type.${first}.ask`) },
    { channel: "work", title: t("instructions.secondTitle", { type: t(`type.${second}.label`) }), body: t(`type.${second}.ask`) },
    { channel: "energy", title: t("instructions.drainTitle", { type: t(`type.${lowest}.label`) }), body: t(`type.${lowest}.drain`) },
  ];
  if (result.opposed) {
    cards.push({
      channel: "work",
      title: t("instructions.tensionTitle"),
      body: t("instructions.tensionBody", { a: t(`type.${first}.label`), b: t(`type.${second}.label`) }),
    });
  }
  if (result.flat) {
    cards.push({ channel: "work", title: t("instructions.flatTitle"), body: t("instructions.flatBody") });
  }
  return cards;
}

/**
 * Two codes, read against the hexagon rather than against each other's
 * numbers. What matters is how far apart the two lead interests sit and how
 * much of the top three the pair hold in common; the wording that follows from
 * that is a message key, resolved by the view.
 */
export type Comparison = { shared: TypeKey[]; gap: number; bodyKey: string };

export function compare(a: RiasecResult, b: RiasecResult): Comparison {
  const shared = a.top.filter((k) => b.top.includes(k));
  const gap = separation(a.top[0], b.top[0]);

  const bodyKey =
    a.code === b.code
      ? "compare.sameCode"
      : shared.length >= 2
        ? "compare.overlap"
        : gap >= 3
          ? "compare.opposite"
          : "compare.different";

  return { shared, gap, bodyKey };
}

export const spec: InstrumentSpec<RiasecResult> = {
  id: "riasec",
  version: 1,
  family: "questionnaire",
  glyph: "⬢",
  minutes: 5,
  channels: ["work", "energy"],
  tier: "premium",
  messages: {
    en: () => import("./i18n/en"),
    pl: () => import("./i18n/pl"),
    es: () => import("./i18n/es"),
    de: () => import("./i18n/de"),
  },
  form: (t) => ({
    kind: "items",
    items: ITEMS.map((item) => ({ ...item, prompt: t(`item.${item.id}`) })),
    scale: scaleFor("agree5", t),
    shuffle: true,
    pageSize: 6,
  }),
  score,
  instructions,
  compare,
};

export default spec;
