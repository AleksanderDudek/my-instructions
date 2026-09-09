import type { Answers, InstrumentSpec, InstructionCard, T } from "@/core/types";

/**
 * A strength you can produce a receipt for.
 *
 * The question the brief asks — what is genuinely a strength and what is not —
 * is the one question in this app that cannot be asked directly. Self-rated
 * ability correlates around r = .29 with measured performance, so a slider
 * saying "I am good at X" is the single most misleading thing this platform
 * could emit, and `docs/next-four-instruments.md` refused them on exactly that
 * ground.
 *
 * Refusing the format is not the same as refusing the question. That memo left
 * one door open: a field naming something you were the reason went well,
 * labelled as a **claim** rather than a measurement. This folder walks through
 * it and makes it the whole instrument.
 *
 * Three episodes. For each: what happened, what you specifically did, which
 * kind of work was the active ingredient, and how much of it was you. Then,
 * separately and afterwards, which kinds you would claim as strengths.
 *
 * Nothing is scored. The output is a three-way sort, and the second and third
 * entries are the ones worth the reader's time:
 *
 *   backed     you claimed it and you described an occasion that used it
 *   unbacked   you claimed it and nothing you described used it. Not a verdict
 *              that you are wrong — a statement that it is currently
 *              unevidenced, which is the only honest form the "what is not a
 *              strength" question can take
 *   unclaimed  it appeared in your own episodes and you did not list it
 *
 * Forcing an instance converts an unverifiable trait rating into a checkable
 * assertion, and it is hard to invent a receipt.
 */

/**
 * The eight kinds of work, deliberately re-declared rather than imported from
 * `work-shape`. Nothing in this app knows another instrument by name, and a
 * shared constant would make one folder's version bump silently break
 * another's stored results.
 */
export const SHAPES = [
  "depth", "variety", "structure", "openEnded",
  "making", "people", "improving", "starting",
] as const;
export type Shape = (typeof SHAPES)[number];

const EPISODES = ["ep1", "ep2", "ep3"] as const;
const SHARE = ["mostly", "large", "part"] as const;
type Share = (typeof SHARE)[number];

/** How many claims a reader may make. Three is a page; eight is a horoscope. */
export const MAX_CLAIMS = 3;

export type Episode = { id: string; what: string; did: string; shape: Shape; share: Share };

export type StrengthEvidenceResult = {
  v: 1;
  episodes: Episode[];
  claimed: Shape[];
  counts: Record<string, number>;
  evidenced: Shape[];
  /** Claimed and described. The part of the claim that stands up. */
  backed: Shape[];
  /** Claimed with nothing behind it. The honest form of "not a strength". */
  unbacked: Shape[];
  /** Turned up in the episodes and was never claimed. */
  unclaimed: Shape[];
  /** Twice or more across three episodes — the only pattern three can show. */
  repeated: Shape[];
  filled: number;
  /** One episode is an anecdote. The copy has to say so. */
  thin: boolean;
};

const isShape = (v: unknown): v is Shape => SHAPES.includes(v as Shape);

/** Trimmed, length-capped free text. Storage is not a diary. */
const textOf = (value: unknown) => String(value ?? "").trim().slice(0, 400);

export function score(answers: Answers): StrengthEvidenceResult {
  const episodes: Episode[] = [];
  for (const ep of EPISODES) {
    const what = textOf(answers[`${ep}What`]);
    const did = textOf(answers[`${ep}Did`]);
    // An episode with no story is not an episode. Half-filled ones count —
    // somebody who named the occasion and skipped the detail still told us
    // which shape was in play, and dropping that would punish brevity.
    if (!what && !did) continue;
    const rawShape = answers[`${ep}Shape`];
    const rawShare = answers[`${ep}Share`];
    episodes.push({
      id: ep,
      what,
      did,
      shape: isShape(rawShape) ? rawShape : SHAPES[0],
      share: SHARE.includes(rawShare as Share) ? (rawShare as Share) : "large",
    });
  }

  const counts: Record<string, number> = {};
  for (const e of episodes) counts[e.shape] = (counts[e.shape] ?? 0) + 1;

  const claimed = (Array.isArray(answers.claimed) ? answers.claimed : [])
    .filter(isShape)
    .slice(0, MAX_CLAIMS);

  const evidenced = SHAPES.filter((s) => counts[s]);

  return {
    v: 1,
    episodes,
    claimed,
    counts,
    evidenced,
    backed: claimed.filter((s) => counts[s]),
    unbacked: claimed.filter((s) => !counts[s]),
    unclaimed: evidenced.filter((s) => !claimed.includes(s)),
    repeated: SHAPES.filter((s) => (counts[s] ?? 0) >= 2),
    filled: episodes.length,
    thin: episodes.length < 2,
  };
}

const names = (list: readonly string[], t: T) => list.map((s) => t(`shape.${s}.label`)).join(", ");

export function instructions(result: StrengthEvidenceResult, t: T): InstructionCard[] {
  const cards: InstructionCard[] = [];
  if (result.backed.length) {
    cards.push({
      channel: "work",
      title: t("instructions.backedTitle", { names: names(result.backed, t) }),
      body: t("instructions.backedBody", { shape: t(`shape.${result.backed[0]}.label`) }),
    });
  }
  if (result.repeated.length) {
    cards.push({
      channel: "work",
      title: t("instructions.repeatedTitle", { names: names(result.repeated, t) }),
      body: t("instructions.repeatedBody"),
    });
  }
  if (result.unclaimed.length) {
    cards.push({
      channel: "work",
      title: t("instructions.unclaimedTitle", { names: names(result.unclaimed, t) }),
      // The body names no shape, but it says "this" or "these" about however
      // many there are, so it needs the count even though it needs no list.
      body: t("instructions.unclaimedBody", { count: result.unclaimed.length }),
    });
  }
  if (result.unbacked.length) {
    cards.push({
      channel: "energy",
      title: t("instructions.unbackedTitle", { names: names(result.unbacked, t) }),
      body: t("instructions.unbackedBody", { count: result.unbacked.length }),
    });
  }
  // Every branch above can be empty at once — somebody who wrote one episode,
  // claimed the shape it used, and nothing else. A card is still owed.
  if (!cards.length) {
    cards.push({ channel: "work", title: t("instructions.fallbackTitle"), body: t("instructions.fallbackBody") });
  }
  return cards;
}

export const spec: InstrumentSpec<StrengthEvidenceResult> = {
  id: "strength-evidence",
  version: 1,
  family: "profiler",
  glyph: "✓",
  minutes: 8,
  channels: ["work", "energy"],
  tier: "free",
  // Free text about your own history, in your own words. It can be handed to
  // a mentor or a friend; it has no business being posted at a stable public
  // URL, and a ceiling is a different thing from a discouraged default.
  maxAudience: "friends",
  messages: {
    en: () => import("./i18n/en"),
    pl: () => import("./i18n/pl"),
    es: () => import("./i18n/es"),
    de: () => import("./i18n/de"),
  },
  form: (t) => ({
    kind: "fields",
    fields: [
      ...EPISODES.flatMap((ep, n) => {
        const first = n === 0;
        return [
          { id: `${ep}What`, kind: "text" as const, label: t(`field.${ep}.what`), optional: !first, placeholder: t("form.whatPlaceholder") },
          { id: `${ep}Did`, kind: "text" as const, label: t(`field.${ep}.did`), optional: !first, placeholder: t("form.didPlaceholder") },
          {
            id: `${ep}Shape`, kind: "select" as const, label: t(`field.${ep}.shape`), value: SHAPES[0],
            options: SHAPES.map((value) => ({ value, label: t(`shape.${value}.label`) })),
          },
          {
            id: `${ep}Share`, kind: "select" as const, label: t(`field.${ep}.share`), value: "large",
            options: SHARE.map((value) => ({ value, label: t(`share.${value}`) })),
          },
        ];
      }),
      {
        id: "claimed", kind: "multi" as const, label: t("field.claimed.label"), max: MAX_CLAIMS,
        options: SHAPES.map((value) => ({ value, label: t(`shape.${value}.label`) })),
      },
    ],
    note: t("form.note"),
  }),
  validate: (answers, t = (key: string) => key) => {
    const errors: Record<string, string> = {};
    if (!String(answers.ep1What ?? "").trim()) errors.ep1What = t("form.needEpisode");
    if (!String(answers.ep1Did ?? "").trim()) errors.ep1Did = t("form.needAction");
    const claimed = Array.isArray(answers.claimed) ? answers.claimed : [];
    if (!claimed.length) errors.claimed = t("form.needClaim");
    else if (claimed.length > MAX_CLAIMS) errors.claimed = t("form.tooManyClaims", { max: MAX_CLAIMS });
    return errors;
  },
  score,
  instructions,
};

export default spec;
