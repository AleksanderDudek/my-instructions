import { scaleFor, scoreLikert, rank } from "@/core/scoring";
import type { Answers, InstrumentSpec, InstructionCard, T } from "@/core/types";
import { CENTRES, LINES, wingsOf, ITEMS, type CentreKey, type Line } from "./items";

/**
 * Typing, honestly.
 *
 * The single most common lie an Enneagram test tells is "you are a 4" when the
 * top two scores are one point apart. So the result reports a *margin*: when
 * the leader is within six points of the runner-up the reading is presented as
 * a shortlist, not a verdict, with the discriminating question that actually
 * separates the pair. Confidence is part of the answer.
 */

const scale = scaleFor("true5", (key) => key);

export type TypeRank = { key: string; score: number; rank: number; type: number };
export type Centre = { key: CentreKey; score: number };

export type EnneagramResult = {
  scores: Record<string, number>;
  ranked: TypeRank[];
  type: number;
  second: number;
  margin: number;
  confident: boolean;
  wing: number;
  wingMargin: number;
  wingClose: boolean;
  lines: Line;
  centres: Centre[];
  dominantCentre: CentreKey;
  answered: number;
  total: number;
};

export function score(answers: Answers): EnneagramResult {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const ranked: TypeRank[] = rank(scores).map((r) => ({ ...r, type: Number(r.key) }));
  const lead = ranked[0], second = ranked[1];
  const margin = lead.score - second.score;
  const confident = margin >= 6;

  const [wl, wr] = wingsOf(lead.type);
  const wing = scores[String(wl)] >= scores[String(wr)] ? wl : wr;
  const wingMargin = Math.abs(scores[String(wl)] - scores[String(wr)]);

  const centres = (Object.entries(CENTRES) as [CentreKey, { types: number[] }][]).map(([key, c]) => ({
    key,
    score: Math.round(c.types.reduce((a, t) => a + scores[String(t)], 0) / c.types.length),
  })).sort((a, b) => b.score - a.score);

  return {
    scores, ranked, type: lead.type, second: second.type, margin, confident,
    wing, wingMargin, wingClose: wingMargin < 5,
    lines: LINES[lead.type], centres, dominantCentre: centres[0].key,
    answered, total,
  };
}

export function instructions(result: EnneagramResult, t: T): InstructionCard[] {
  const n = result.type;
  const out: InstructionCard[] = [
    { channel: "communication", title: t("instructions.typeTitle", { number: n, name: t(`type.${n}.name`) }), body: t(`type.${n}.ask`) },
    { channel: "conflict", title: t("instructions.conflictTitle"), body: t(`type.${n}.conflict`) },
    { channel: "energy", title: t("instructions.stretchedTitle"), body: t("instructions.stretchedBody", { stress: t(`type.${n}.stress`), ease: t(`type.${n}.ease`) }) },
  ];
  if (!result.confident) {
    out.push({
      channel: "communication",
      title: t("instructions.provisionalTitle"),
      body: t("instructions.provisionalBody", { a: n, b: result.second, margin: result.margin }),
    });
  }
  return out;
}

/**
 * Two types, one reading. The relation between them — neighbours, line-linked,
 * or sharing a centre — decides the sentence, and the branch is decided here so
 * the view only has to resolve it.
 *
 * Each branch is a whole sentence in the message table rather than a frame
 * with a noun dropped into it. "Both of you lead from the gut centre" needs
 * that noun in the right case in Polish and the right gender in Spanish, and
 * a translator can only get that right with the sentence in front of them.
 */
export type Pairing = { sameCentre: boolean; adjacent: boolean; lineLinked: boolean; bodyKey: string };

export function compare(a: EnneagramResult, b: EnneagramResult): Pairing {
  const sameCentre = a.dominantCentre === b.dominantCentre;
  const adjacent = wingsOf(a.type).includes(b.type);
  const lineLinked = a.lines.stress === b.type || a.lines.ease === b.type || b.lines.stress === a.type || b.lines.ease === a.type;

  const bodyKey = adjacent ? "compare.adjacent"
    : lineLinked ? "compare.lineLinked"
    : sameCentre ? `compare.sameCentre.${a.dominantCentre}`
    : "compare.differentCentres";

  return { sameCentre, adjacent, lineLinked, bodyKey };
}

export const spec: InstrumentSpec<EnneagramResult> = {
  id: "enneagram",
  version: 1,
  family: "questionnaire",
  glyph: "◉",
  minutes: 7,
  channels: ["communication", "conflict", "energy"],
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
    scale: scaleFor("true5", t),
    shuffle: true,
    pageSize: 5,
  }),
  score,
  instructions,
  compare,
};

export default spec;
