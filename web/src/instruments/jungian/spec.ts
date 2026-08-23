import { scaleFor, scoreLikert, rank } from "@/core/scoring";
import type { Answers, InstrumentSpec, InstructionCard, T } from "@/core/types";
import {
  PERCEIVING,
  JUDGING,
  OPPOSITE,
  EXTRAVERTED,
  LETTER,
  ITEMS,
  type FunctionKey,
} from "./items";

/**
 * The stack, and the code that falls out of it.
 *
 * Jung's own claim is about *function order*, not about four letters: a person
 * leads with one function, supports it with a second of the opposite kind and
 * opposite attitude, and is worst at the mirror of the first. The four-letter
 * code is a later shorthand for that arrangement, so here it is derived from
 * the stack rather than measured directly — which is also why it can be
 * reported honestly as uncertain when the top two functions are close.
 */

const scale = scaleFor("true5", (key) => key);

/** The four groupings of types. Names ours; the cut is Keirsey's. */
export type Temperament = "steward" | "improviser" | "interpreter" | "systematiser";

/** Auxiliary: the strongest function of the other job and the other attitude. */
function auxiliaryOf(dominant: FunctionKey, scores: Record<string, number>): FunctionKey {
  const wantPerceiving = JUDGING.includes(dominant);
  const pool = (wantPerceiving ? PERCEIVING : JUDGING).filter((f) => EXTRAVERTED.has(f) !== EXTRAVERTED.has(dominant));
  return pool.reduce((best, f) => (scores[f] > scores[best] ? f : best), pool[0]);
}

/**
 * The four-letter code, read off the stack.
 *
 * E/I is the dominant's attitude. The middle two letters come from whichever
 * perceiving and judging functions are in the top pair. The last letter asks
 * which of the pair faces outward: an outward-facing judge reads as J, an
 * outward-facing perceiver as P.
 *
 * The three lookups below always resolve: `auxiliaryOf` picks from the other
 * job and the other attitude, so the pair is guaranteed to hold one perceiver,
 * one judge, and exactly one function facing outward.
 */
function codeFor(dominant: FunctionKey, auxiliary: FunctionKey): string {
  const pair = [dominant, auxiliary];
  const perceiver = pair.find((f) => PERCEIVING.includes(f)) as FunctionKey;
  const judge = pair.find((f) => JUDGING.includes(f)) as FunctionKey;
  const outward = pair.find((f) => EXTRAVERTED.has(f)) as FunctionKey;
  return [
    EXTRAVERTED.has(dominant) ? "E" : "I",
    LETTER[perceiver],
    LETTER[judge],
    JUDGING.includes(outward) ? "J" : "P",
  ].join("");
}

/**
 * Temperament — the four groupings of types, derived and not measured.
 *
 * Temperament is a coarser cut of the same information: concrete types split
 * on whether they settle or improvise, abstract types on whether they reason
 * or interpret. It is a *grouping*, so it is computed from the code rather
 * than asked about separately — a separate questionnaire for it would be four
 * more scales measuring what these eight already measured.
 *
 * The names here are our own. Keirsey's four are his.
 */
export function temperamentOf(code: string): Temperament {
  if (code[1] === "S") return code[3] === "J" ? "steward" : "improviser";
  return code[2] === "T" ? "systematiser" : "interpreter";
}

export type FunctionRank = { key: FunctionKey; score: number; rank: number };

export type JungianResult = {
  scores: Record<string, number>;
  ranked: FunctionRank[];
  stack: FunctionKey[];
  dominant: FunctionKey;
  auxiliary: FunctionKey;
  tertiary: FunctionKey;
  inferior: FunctionKey;
  runnerUp: FunctionKey;
  margin: number;
  confident: boolean;
  code: string;
  temperament: Temperament;
  attitude: "outward" | "inward";
  answered: number;
  total: number;
};

export function score(answers: Answers): JungianResult {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const ranked = rank(scores) as FunctionRank[];
  const dominant = ranked[0].key;
  const runnerUp = ranked[1].key;
  const margin = ranked[0].score - ranked[1].score;

  const auxiliary = auxiliaryOf(dominant, scores);
  const tertiary = OPPOSITE[auxiliary];
  const inferior = OPPOSITE[dominant];
  const code = codeFor(dominant, auxiliary);

  return {
    scores, ranked,
    stack: [dominant, auxiliary, tertiary, inferior],
    dominant, auxiliary, tertiary, inferior,
    runnerUp, margin,
    confident: margin >= 6,
    code,
    temperament: temperamentOf(code),
    attitude: EXTRAVERTED.has(dominant) ? "outward" : "inward",
    answered, total,
  };
}

export function instructions(result: JungianResult, t: T): InstructionCard[] {
  const out: InstructionCard[] = [
    { channel: "communication", title: t("instructions.leadTitle", { fn: t(`fn.${result.dominant}.label`) }), body: t(`fn.${result.dominant}.ask`) },
    { channel: "work", title: t("instructions.supportTitle", { fn: t(`fn.${result.auxiliary}.label`) }), body: t(`fn.${result.auxiliary}.ask`) },
    { channel: "energy", title: t("instructions.inferiorTitle", { fn: t(`fn.${result.inferior}.label`) }), body: t(`fn.${result.inferior}.inferior`) },
  ];
  out.push({
    channel: "work",
    title: t("instructions.temperamentTitle", { name: t(`temperament.${result.temperament}.label`) }),
    body: t(`temperament.${result.temperament}.ask`),
  });
  if (!result.confident) {
    out.push({
      channel: "communication",
      title: t("instructions.provisionalTitle"),
      body: t("instructions.provisionalBody", {
        a: t(`fn.${result.dominant}.label`),
        b: t(`fn.${result.runnerUp}.label`),
        margin: result.margin,
      }),
    });
  }
  return out;
}

/**
 * Two stacks, one reading.
 *
 * Three genuinely different situations, three whole sentences. Which one
 * applies says more than any similarity percentage would — so the branch is
 * decided here and the view only has to resolve the key.
 */
export type Pairing = { shared: FunctionKey[]; sameStack: boolean; blindSpot: boolean; bodyKey: string };

export function compare(a: JungianResult, b: JungianResult): Pairing {
  const shared = a.stack.filter((fn) => b.stack.includes(fn));
  const sameStack = a.dominant === b.auxiliary && a.auxiliary === b.dominant;
  const blindSpot = a.inferior === b.inferior;

  const bodyKey = sameStack ? "compare.mirrored"
    : blindSpot ? "compare.sharedBlindSpot"
    : shared.length >= 2 ? "compare.overlap"
    : "compare.different";

  return { shared, sameStack, blindSpot, bodyKey };
}

export const spec: InstrumentSpec<JungianResult> = {
  id: "jungian",
  version: 1,
  family: "questionnaire",
  glyph: "☯",
  minutes: 6,
  channels: ["communication", "work", "energy"],
  tier: "free",
  messages: {
    en: () => import("./i18n/en"),
    pl: () => import("./i18n/pl"),
    es: () => import("./i18n/es"),
    de: () => import("./i18n/de"),
  },
  form: (t) => ({
    kind: "items",
    items: ITEMS.map((item) => ({ ...item, prompt: t(`item.${item.id}`) })),
    scale: scaleFor("true5", t),
    shuffle: true,
    pageSize: 5,
  }),
  score,
  instructions,
  compare,
};

export default spec;
