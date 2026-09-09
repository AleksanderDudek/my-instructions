import { scaleFor, scoreLikert, rank, dispersion } from "@/core/scoring";
import type { Answers, InstrumentSpec, InstructionCard, T } from "@/core/types";
import { CONTRASTS, ORDER, ITEMS, type ShapeKey } from "./items";

/**
 * What the doing is made of.
 *
 * The reading that matters here is not the ranking — it is what each of the
 * four contrasts does. A contrast has four outcomes and three of them are
 * interesting:
 *
 *   `leans`  one end clearly above the other. The ordinary case.
 *   `both`   both ends high. Not a contradiction. It is a requirement with two
 *            parts, and it is the finding a forced-choice instrument destroys.
 *   `neither` both ends low. This axis does not drive you, and a job that
 *            offers it as its selling point is selling you nothing.
 *   `unclear` close together in the middle, which is the honest "no reading".
 *
 * The gap that separates `leans` from `unclear` is deliberately wide. Ten
 * points on a 1..100 rescale of five items is inside the noise, and printing a
 * direction on that is how a profile becomes a horoscope.
 */

const scale = scaleFor("agree5", (key) => key);

/** Below this, an end is not something the reader is asking for. */
export const LOW = 39;
/** At or above this, an end is a real requirement. */
export const HIGH = 62;
/** Points of difference before a contrast is allowed to name a direction. */
export const DECISIVE = 12;

export type ContrastKind = "both" | "neither" | "leans" | "unclear";

export type Contrast = {
  pair: [ShapeKey, ShapeKey];
  a: ShapeKey;
  b: ShapeKey;
  gap: number;
  lead: ShapeKey | null;
  other: ShapeKey | null;
  kind: ContrastKind;
};

/**
 * One contrast, read. `lead` is null unless the gap clears `DECISIVE`, so no
 * caller can accidentally print a direction the numbers do not support.
 */
export function readContrast(scores: Record<string, number>, [a, b]: [ShapeKey, ShapeKey]): Contrast {
  const gap = Math.abs(scores[a] - scores[b]);
  const lead = gap >= DECISIVE ? (scores[a] > scores[b] ? a : b) : null;
  const other = lead ? (lead === a ? b : a) : null;

  const kind: ContrastKind =
    scores[a] >= HIGH && scores[b] >= HIGH
      ? "both"
      : scores[a] < LOW && scores[b] < LOW
        ? "neither"
        : lead
          ? "leans"
          : "unclear";

  return { pair: [a, b], a, b, gap, lead, other, kind };
}

export type Ranked = { key: ShapeKey; score: number; rank: number };

export type WorkShapeResult = {
  scores: Record<string, number>;
  ranked: Ranked[];
  top: ShapeKey[];
  lowest: ShapeKey;
  contrasts: Contrast[];
  spread: number;
  /** How evenly the eight are held, 0 concentrated to 100 even. */
  evenness: number;
  flat: boolean;
  /** Contrasts where both ends are a requirement — the reading to lead with. */
  doubled: [ShapeKey, ShapeKey][];
  /** Contrasts that do not drive this person either way. */
  inert: [ShapeKey, ShapeKey][];
  answered: number;
  total: number;
};

export function score(answers: Answers): WorkShapeResult {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const ranked = rank(scores) as Ranked[];
  const { range: spread, evenness } = dispersion(scores);

  const contrasts = CONTRASTS.map((pair) => readContrast(scores, pair));

  return {
    scores,
    ranked,
    top: ranked.slice(0, 2).map((r) => r.key),
    lowest: ranked[ranked.length - 1].key,
    contrasts,
    spread,
    evenness,
    // Eight scales spread more than six, so the shared fifteen-point floor is
    // raised here for the same reason riasec raises it: the ordering under a
    // small range is measurement error wearing a ranking's clothes.
    flat: spread < 18,
    doubled: contrasts.filter((c) => c.kind === "both").map((c) => c.pair),
    inert: contrasts.filter((c) => c.kind === "neither").map((c) => c.pair),
    answered,
    total,
  };
}

export function instructions(result: WorkShapeResult, t: T): InstructionCard[] {
  const [first, second] = result.top;
  const cards: InstructionCard[] = [
    { channel: "work", title: t("instructions.leadTitle", { shape: t(`shape.${first}.label`) }), body: t(`shape.${first}.ask`) },
    { channel: "work", title: t("instructions.secondTitle", { shape: t(`shape.${second}.label`) }), body: t(`shape.${second}.ask`) },
  ];
  // "What I am not asking for" has to name something the reader is not asking
  // for. On a uniformly high profile the lowest scale is still a requirement,
  // and `rank()` picks it by an arbitrary tie-break — so the card would have
  // contradicted a "I need both X and Y" card two rows below it.
  if (result.scores[result.lowest] < HIGH) {
    cards.push({
      channel: "energy",
      title: t("instructions.drainTitle", { shape: t(`shape.${result.lowest}.label`) }),
      body: t(`shape.${result.lowest}.drain`),
    });
  }
  // A card is a line the reader hands to somebody, so it is written in the
  // first person. `contrast.<a>.both` is the result-page copy and addresses
  // the reader as "you"; reusing it here put one card on the sheet in the
  // wrong voice, which is exactly the sort of seam a colleague notices.
  for (const [a, b] of result.doubled) {
    cards.push({
      channel: "work",
      title: t("instructions.doubledTitle", { a: t(`shape.${a}.label`), b: t(`shape.${b}.label`) }),
      body: t(`instructions.doubled.${a}`, { a: t(`shape.${a}.label`), b: t(`shape.${b}.label`) }),
    });
  }
  // A flat profile that also holds both ends of a contrast has already had
  // the useful thing said about it by the cards above.
  if (result.flat && !result.doubled.length) {
    cards.push({ channel: "work", title: t("instructions.flatTitle"), body: t("instructions.flatBody") });
  }
  return cards;
}

/**
 * Two people's shapes are complementary far more often than they collide, so
 * this reports the division of labour rather than a similarity figure: what
 * each one wants that the other does not, which is the same thing as who
 * should take which half of a piece of work.
 */
export type Comparison = { both: ShapeKey[]; aOnly: ShapeKey[]; bOnly: ShapeKey[] };

export function compare(a: WorkShapeResult, b: WorkShapeResult): Comparison {
  const wants = (r: WorkShapeResult, k: ShapeKey) => r.scores[k] >= HIGH;
  return {
    both: ORDER.filter((k) => wants(a, k) && wants(b, k)),
    aOnly: ORDER.filter((k) => wants(a, k) && !wants(b, k)),
    bOnly: ORDER.filter((k) => wants(b, k) && !wants(a, k)),
  };
}

export const spec: InstrumentSpec<WorkShapeResult> = {
  id: "work-shape",
  version: 1,
  family: "questionnaire",
  glyph: "◈",
  minutes: 6,
  channels: ["work", "energy"],
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
    scale: scaleFor("agree5", t),
    shuffle: true,
    pageSize: 8,
  }),
  score,
  instructions,
  compare,
};

export default spec;
