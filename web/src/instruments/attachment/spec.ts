import { scaleFor, scoreLikert, deviation } from "@/core/scoring";
import type { Answers, InstrumentSpec, InstructionCard, T } from "@/core/types";
import { ITEMS } from "./items";

/**
 * A position, reported as a position.
 *
 * The four attachment styles are quadrants of a plane, so this instrument
 * gives the two coordinates first and names the quadrant second. That order
 * matters more here than anywhere else in the app: "you are fearful-avoidant"
 * is a sentence people carry around for years, and the honest version is that
 * they scored 58 and 61 on two continuous scales with a boundary at 50.
 *
 * `strength` is the distance from the centre of the plane, and everything the
 * copy claims is hedged by it. Near the middle, the label means very little.
 */

const scale = scaleFor("agree7", (key) => key);
const MIDPOINT = 50;

export type AttachmentStyle = "secure" | "preoccupied" | "dismissing" | "fearful";

/** Quadrant names, in the order [low anxiety, high anxiety] × [low, high avoidance]. */
function styleOf(anxiety: number, avoidance: number): AttachmentStyle {
  const anxious = anxiety >= MIDPOINT;
  const distant = avoidance >= MIDPOINT;
  if (!anxious && !distant) return "secure";
  if (anxious && !distant) return "preoccupied";
  if (!anxious && distant) return "dismissing";
  return "fearful";
}

export type AttachmentResult = {
  scores: Record<string, number>;
  anxiety: number;
  avoidance: number;
  style: AttachmentStyle;
  strength: number;
  borderline: boolean;
  answered: number;
  total: number;
};

export function score(answers: Answers): AttachmentResult {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const anxiety = scores.anxiety;
  const avoidance = scores.avoidance;

  // How far from the middle of the plane, as a percentage of the furthest a
  // person could be. A low number means the quadrant name is close to a coin
  // toss, and the copy says so.
  const { distance: strength } = deviation(scores, MIDPOINT);

  return {
    scores, anxiety, avoidance,
    style: styleOf(anxiety, avoidance),
    strength,
    borderline: strength < 20,
    answered, total,
  };
}

export function instructions(result: AttachmentResult, t: T): InstructionCard[] {
  return [
    { channel: "conflict", title: t("instructions.conflictTitle", { style: t(`style.${result.style}.label`) }), body: t(`style.${result.style}.conflict`) },
    { channel: "affection", title: t("instructions.needTitle"), body: t(`style.${result.style}.need`) },
    { channel: "communication", title: t("instructions.repairTitle"), body: t(`style.${result.style}.repair`) },
  ];
}

/**
 * The pairing, which is the point of measuring this at all.
 *
 * One combination is worth naming outright: high anxiety meeting high
 * avoidance is the trap, because each person's instinct under stress is
 * precisely what the other cannot tolerate. Saying that plainly is more use
 * than a compatibility score.
 */
export type AttachmentComparison = {
  chase: boolean;
  bothSecure: boolean;
  same: boolean;
  bodyKey: string;
  gapAnxiety: number;
  gapAvoidance: number;
};

export function compare(a: AttachmentResult, b: AttachmentResult): AttachmentComparison {
  const chase = (a.style === "preoccupied" && b.style === "dismissing") ||
                (b.style === "preoccupied" && a.style === "dismissing");
  const bothSecure = a.style === "secure" && b.style === "secure";
  const same = a.style === b.style;

  const bodyKey = chase ? "compare.pursuitWithdrawal"
    : bothSecure ? "compare.bothSecure"
    : same ? "compare.sameStyle"
    : "compare.mixed";

  return {
    chase,
    bothSecure,
    same,
    bodyKey,
    gapAnxiety: Math.abs(a.anxiety - b.anxiety),
    gapAvoidance: Math.abs(a.avoidance - b.avoidance),
  };
}

export { styleOf, MIDPOINT };

export const spec: InstrumentSpec<AttachmentResult> = {
  id: "attachment",
  version: 1,
  family: "questionnaire",
  glyph: "⚭",
  minutes: 4,
  channels: ["conflict", "affection", "communication"],
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
    scale: scaleFor("agree7", t),
    shuffle: true,
    pageSize: 6,
  }),
  score,
  instructions,
  compare,
};

export default spec;
