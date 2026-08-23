import { scaleFor, scoreLikert, deviation } from "@/core/scoring";
import type { Answers, InstrumentSpec, InstructionCard, T } from "@/core/types";
import { ITEMS } from "./items";

/**
 * Five modes, as regions of a plane rather than as five boxes.
 *
 * Compromising is not a fifth direction — it is the middle, and treating it as
 * a separate corner is the most common error in presentations of this model.
 * So the middle is defined explicitly: within `MIDDLE` points of centre on
 * both axes and the answer is compromising, because that is what being in the
 * middle of both concerns actually means.
 *
 * The second thing reported is the fallback: what happens when the first mode
 * does not work. That is usually more useful than the primary, because the
 * primary is how someone opens and the fallback is how the argument ends.
 */

const scale = scaleFor("agree5", (key) => key);
export const MIDPOINT = 50;
export const MIDDLE = 12;

export type Mode = "competing" | "collaborating" | "compromising" | "accommodating" | "avoiding";

export function modeOf(assertiveness: number, cooperativeness: number): Mode {
  const nearCentre = Math.abs(assertiveness - MIDPOINT) <= MIDDLE && Math.abs(cooperativeness - MIDPOINT) <= MIDDLE;
  if (nearCentre) return "compromising";
  // Strictly greater, not greater-or-equal. Sitting exactly on the midpoint of
  // a concern is not holding that concern — someone at 95 and 50 is competing,
  // because they are not actively trying to satisfy the other side, and
  // calling that collaborating would flatter it.
  const pushes = assertiveness > MIDPOINT;
  const yields = cooperativeness > MIDPOINT;
  if (pushes && yields) return "collaborating";
  if (pushes && !yields) return "competing";
  if (!pushes && yields) return "accommodating";
  return "avoiding";
}

/**
 * Where someone goes when the first move fails. Under pressure the weaker of
 * the two concerns is the one that gives, so the fallback is the mode you
 * reach by dropping it further.
 */
export function fallbackOf(mode: Mode, assertiveness: number, cooperativeness: number): Mode {
  if (mode === "collaborating") return assertiveness >= cooperativeness ? "competing" : "accommodating";
  if (mode === "compromising") return assertiveness >= cooperativeness ? "competing" : "avoiding";
  if (mode === "competing") return "avoiding";
  if (mode === "accommodating") return "avoiding";
  return "avoiding";
}

export type ConflictResult = {
  scores: Record<string, number>;
  assertiveness: number;
  cooperativeness: number;
  mode: Mode;
  fallback: Mode;
  reach: number;
  answered: number;
  total: number;
};

export function score(answers: Answers): ConflictResult {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const assertiveness = scores.assertiveness;
  const cooperativeness = scores.cooperativeness;
  const mode = modeOf(assertiveness, cooperativeness);
  return {
    scores, assertiveness, cooperativeness, mode,
    fallback: fallbackOf(mode, assertiveness, cooperativeness),
    // How far from the centre, so the copy can hedge when the mode is a
    // near-run thing rather than a settled habit. Normalised, so it means the
    // same here as it does on the attachment plane.
    reach: deviation(scores, MIDPOINT).distance,
    answered, total,
  };
}

export function instructions(result: ConflictResult, t: T): InstructionCard[] {
  return [
    { channel: "conflict", title: t("instructions.openingTitle", { mode: t(`mode.${result.mode}.label`) }), body: t(`mode.${result.mode}.ask`) },
    { channel: "conflict", title: t("instructions.fallbackTitle"), body: t(`mode.${result.fallback}.fallbackAsk`) },
    { channel: "communication", title: t("instructions.repairTitle"), body: t(`mode.${result.mode}.repair`) },
  ];
}

/**
 * Two styles, one reading. The pairing is named by which of the four failure
 * shapes it falls into, and the shape is returned as a message key rather than
 * as a sentence — the words belong to the reader's language, not to the maths.
 */
export type ConflictComparison = {
  bodyKey: string;
  bothCompete: boolean;
  bothAvoid: boolean;
  pushMeetsYield: boolean;
  sameMode: boolean;
};

export function compare(a: ConflictResult, b: ConflictResult): ConflictComparison {
  const bothCompete = a.mode === "competing" && b.mode === "competing";
  const bothAvoid = a.mode === "avoiding" && b.mode === "avoiding";
  const pushMeetsYield = (a.mode === "competing" && b.mode === "accommodating") ||
                         (b.mode === "competing" && a.mode === "accommodating");

  const bodyKey = bothCompete ? "compare.bothCompete"
    : bothAvoid ? "compare.bothAvoid"
    : pushMeetsYield ? "compare.pushMeetsYield"
    : a.mode === b.mode ? "compare.sameMode"
    : "compare.mixed";

  return { bodyKey, bothCompete, bothAvoid, pushMeetsYield, sameMode: a.mode === b.mode };
}

export const spec: InstrumentSpec<ConflictResult> = {
  id: "conflict-style",
  version: 1,
  family: "questionnaire",
  glyph: "⚔",
  minutes: 4,
  channels: ["conflict", "communication"],
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
