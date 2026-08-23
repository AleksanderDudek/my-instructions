import { scaleFor, scoreLikert, shares, rank, dispersion } from "@/core/scoring";
import type { Answers, InstrumentSpec, InstructionCard, T } from "@/core/types";
import { ORDER, ITEMS, type LanguageKey } from "./items";

/**
 * Two numbers are reported for every language and they answer different
 * questions. The **score** (1–100) is how much that language matters to you in
 * absolute terms — comparable to anyone else's. The **share** is how much of
 * your own attention it takes relative to your other four — which is what a
 * partner actually has to budget for. A person can be 90/90/90/90/90: five
 * strong needs, evenly split. The share tells them where to start; the score
 * tells them how much is at stake.
 */

const scale = scaleFor("true5", (key) => key);

export type Ranked = { key: LanguageKey; score: number; rank: number; share: number };

export type LoveResult = {
  scores: Record<string, number>;
  shares: Record<string, number>;
  ranked: Ranked[];
  primary: Ranked;
  secondary: Ranked;
  quiet: LanguageKey[];
  flat: boolean;
  evenness: number;
  answered: number;
  total: number;
};

export function score(answers: Answers): LoveResult {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const pct = shares(scores);
  const ranked = rank(scores).map((r) => ({ ...r, share: pct[r.key] })) as Ranked[];
  const [primary, secondary] = ranked;
  // A language is "quiet" when it is both low in itself and small in the mix —
  // the pair of tests stops us calling a 70 a weakness just because the rest
  // are 80s.
  const quiet = ranked.filter((r) => r.score < 40 && r.share < 18).map((r) => r.key);
  // The app's shared answer to "is this profile flat?", rather than this
  // folder's own twelve-point rule. Evenness rides along because "how many
  // channels reach you" is a genuinely different reading from "which one".
  const { concentrated, evenness } = dispersion(scores);
  return { scores, shares: pct, ranked, primary, secondary, quiet, flat: !concentrated, evenness, answered, total };
}

export function instructions(result: LoveResult, t: T): InstructionCard[] {
  const p = result.primary.key;
  const s = result.secondary.key;
  const out: InstructionCard[] = [
    { channel: "affection", title: t("instructions.leadWith", { language: t(`lang.${p}.inline`) }), body: t(`lang.${p}.ask`) },
    { channel: "affection", title: t("instructions.then", { language: t(`lang.${s}.inline`) }), body: t(`lang.${s}.ask`) },
    { channel: "conflict", title: t("instructions.distance"), body: t(`lang.${p}.starved`) },
  ];
  for (const key of result.quiet) {
    out.push({
      channel: "affection",
      title: t("instructions.quietTitle", { language: t(`lang.${key}.label`) }),
      body: t("instructions.quietBody"),
    });
  }
  if (result.flat) out.push({ channel: "affection", title: t("instructions.flatTitle"), body: t("instructions.flatBody") });
  return out;
}

/**
 * Two people, one reading. Mismatch is not measured as distance between
 * scores — it is measured as *what each person needs that the other does not
 * naturally give*, which is asymmetric and therefore reported twice.
 */
export type Exchange = { key: LanguageKey; need: number; theirShare: number; deficit: number };

export function compare(a: LoveResult, b: LoveResult) {
  const gap = (mine: LoveResult, theirs: LoveResult): Exchange[] =>
    ORDER.map((k) => ({
      key: k,
      need: mine.scores[k],
      theirShare: theirs.shares[k],
      deficit: mine.shares[k] - theirs.shares[k],
    })).sort((x, y) => y.deficit - x.deficit);

  return {
    aNeeds: gap(a, b),
    bNeeds: gap(b, a),
    overlap: a.primary.key === b.primary.key,
    fit: Math.round(100 - ORDER.reduce((acc, k) => acc + Math.abs(a.shares[k] - b.shares[k]), 0) / 2),
  };
}

export const spec: InstrumentSpec<LoveResult> = {
  id: "love-languages",
  version: 1,
  family: "questionnaire",
  glyph: "♡",
  minutes: 6,
  channels: ["affection", "conflict"],
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
