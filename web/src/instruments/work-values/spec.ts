import { scaleFor, scoreLikert, rank, dispersion } from "@/core/scoring";
import type { Answers, InstrumentSpec, InstructionCard, T } from "@/core/types";
import { ORDER, ITEMS, type ValueKey } from "./items";

/**
 * What to look for in a job, without naming one.
 *
 * `riasec` ends by saying it is not a career recommendation, and until now
 * nothing picked up after it. Interests say which subject holds your
 * attention; values say what a job has to give you before the subject matters
 * at all. Someone can be correctly placed by interest and still leave inside a
 * year because the thing they actually needed was never on the list.
 *
 * Two readings come out, and only one of them is an ordering.
 *
 * The ordering is the six values ranked. It is worth printing only when the
 * profile is differentiated enough for the order to mean something, which is
 * what `dispersion` decides, on the shared threshold rather than a local one.
 *
 * The other reading is a **count**: how many of the six the reader placed in
 * the high band. A count needs no norms and no population — it is not a claim
 * that you want more than other people, it is the number of things you called
 * essential. Six of six is the most common failure mode of every values
 * instrument ever sold, and it is a finding rather than a flat profile: a
 * person for whom everything is non-negotiable has not yet chosen anything.
 */

const scale = scaleFor("agree5", (key) => key);

/** The high band's floor, from `band()`. Named here so the copy can quote it. */
export const ESSENTIAL = 62;

export type Ranked = { key: ValueKey; score: number; rank: number };

export type WorkValuesResult = {
  scores: Record<string, number>;
  ranked: Ranked[];
  top: ValueKey[];
  lead: ValueKey;
  lowest: ValueKey;
  spread: number;
  /** How evenly the six are held, 0 concentrated to 100 even. */
  evenness: number;
  flat: boolean;
  mustHaves: ValueKey[];
  tradeable: ValueKey[];
  /** Everything matters, which is the same as nothing being decisive. */
  undiscriminating: boolean;
  /** Nothing reached the high band: a list of preferences, not requirements. */
  nothingEssential: boolean;
  answered: number;
  total: number;
};

export function score(answers: Answers): WorkValuesResult {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const ranked = rank(scores) as Ranked[];
  const { range: spread, evenness } = dispersion(scores);

  // Values spread less than interests do — everybody wants to be paid and
  // nobody wants a bad manager — so the shared fifteen-point floor is the
  // right one here rather than riasec's raised twenty.
  const flat = spread < 15;

  const mustHaves = ranked.filter((r) => r.score >= ESSENTIAL).map((r) => r.key);
  const tradeable = ranked.filter((r) => r.score < 39).map((r) => r.key);

  return {
    scores,
    ranked,
    top: ranked.slice(0, 3).map((r) => r.key),
    lead: ranked[0].key,
    lowest: ranked[ranked.length - 1].key,
    spread,
    evenness,
    flat,
    mustHaves,
    tradeable,
    undiscriminating: mustHaves.length >= 5,
    nothingEssential: mustHaves.length === 0,
    answered,
    total,
  };
}

export function instructions(result: WorkValuesResult, t: T): InstructionCard[] {
  const [first, second] = result.top;
  const cards: InstructionCard[] = [
    { channel: "work", title: t("instructions.leadTitle", { value: t(`value.${first}.label`) }), body: t(`value.${first}.ask`) },
    { channel: "work", title: t("instructions.secondTitle", { value: t(`value.${second}.label`) }), body: t(`value.${second}.ask`) },
  ];
  // Not when the lowest value is itself in the high band: calling something a
  // thing you do not need, on a sheet that also calls it essential, is the
  // reader's problem to explain and ours to have prevented.
  if (!result.mustHaves.includes(result.lowest)) {
    cards.push({
      channel: "energy",
      title: t("instructions.absentTitle", { value: t(`value.${result.lowest}.label`) }),
      body: t(`value.${result.lowest}.absent`),
    });
  }
  if (result.undiscriminating) {
    cards.push({
      channel: "work",
      title: t("instructions.everythingTitle"),
      body: t("instructions.everythingBody", { count: result.mustHaves.length }),
    });
  }
  // Not when everything is essential: that profile is flat and demanding, and
  // the "no standing requirements" card would contradict the card above it.
  if (result.flat && !result.undiscriminating) {
    cards.push({ channel: "work", title: t("instructions.flatTitle"), body: t("instructions.flatBody") });
  }
  return cards;
}

/**
 * Two people's values do not average, they collide — and only in one
 * direction that matters. What one person calls essential and the other calls
 * tradeable is the disagreement worth naming; two people who both shrug at
 * recognition have nothing to discuss.
 */
export type Comparison = { oneSided: ValueKey[]; shared: ValueKey[]; needsFirst: boolean[] };

export function compare(a: WorkValuesResult, b: WorkValuesResult): Comparison {
  const oneSided = ORDER.filter(
    (k) =>
      (a.mustHaves.includes(k) && b.tradeable.includes(k)) ||
      (b.mustHaves.includes(k) && a.tradeable.includes(k)),
  );
  return {
    oneSided,
    shared: ORDER.filter((k) => a.mustHaves.includes(k) && b.mustHaves.includes(k)),
    /** Per one-sided value: is it the first person who needs it? */
    needsFirst: oneSided.map((k) => a.mustHaves.includes(k)),
  };
}

export const spec: InstrumentSpec<WorkValuesResult> = {
  id: "work-values",
  version: 1,
  family: "questionnaire",
  glyph: "◇",
  minutes: 5,
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
    pageSize: 6,
  }),
  score,
  instructions,
  compare,
};

export default spec;
