/**
 * How much does this matter to you, and why — asked of every instrument.
 *
 * The inventories ask it per question, because each of their questions is about
 * something. A scored questionnaire's items are not: nobody can say how
 * important item 17 of the Big Five is to them, because item 17 is not about
 * anything on its own. Asking there would have tripled forty questions into a
 * hundred and twenty and collected noise for the extra eighty.
 *
 * But the *scale* is about something. "Openness — 78" is a claim a person can
 * hold an opinion about, and "how much does this matter to you" is a real
 * question at that level and a meaningless one a layer down. So this asks it
 * where the instrument is actually saying something.
 *
 * ── After the reading, not before it ──────────────────────────────────
 *
 * The weight is collected on the result page rather than in the runner, and
 * that ordering is the point. Weighing "openness" before seeing your own is
 * weighing an abstraction; weighing it after is the moment reflection is
 * possible at all. It costs an anchoring effect, which would matter if this
 * were a measurement — and it is not one. It is the reader's stated view of
 * their own reading, which is exactly the thing anchoring cannot spoil.
 *
 * ── Where the words come from ─────────────────────────────────────────
 *
 * Every instrument names its scales under `<prefix>.<key>.label`, and the
 * prefixes differ: `factor` in Big Five and HEXACO, `dim` in attachment and
 * conflict style, `lang` in love languages, `type` in RIASEC. Rather than
 * making sixteen folders declare a resolver, the prefixes are tried in turn.
 *
 * That is a sniff, and a sniff that silently misses would render a message key
 * at the reader — the exact failure this codebase hit once before, when the
 * runner passed an identity translator and printed its own validation keys. So
 * `test/core/reflect.test.ts` walks the whole registry and fails on any label
 * that resolves to itself. The sniff is a convenience; the test is the
 * contract.
 */
import type { InstrumentSpec, T } from "./types";

/** The key used when an instrument has no scales to speak of. */
export const WHOLE = "_whole";

/**
 * Tried in order. Longest-standing conventions first, so a new instrument
 * inheriting an old prefix resolves on the first attempt.
 */
const PREFIXES = ["factor", "dim", "lang", "type", "mode", "trait", "interest", "scale", "style"] as const;
const SUFFIXES = ["label", "name"] as const;

/**
 * A missing key resolves to itself, which is what makes the sniff decidable.
 * `createI18n` returns the key when it has nothing, so `t(k) !== k` is a hit.
 */
export function labelFor(scaleKey: string, t: T): string | null {
  for (const prefix of PREFIXES) {
    for (const suffix of SUFFIXES) {
      const key = `${prefix}.${scaleKey}.${suffix}`;
      const found = t(key);
      if (found && found !== key) return found;
    }
  }
  return null;
}

export type Reflectable = { key: string; label: string };

type Scored = { scores?: Record<string, number> };

/**
 * What this instrument can be asked about.
 *
 * Three cases, and the first is a refusal rather than an omission. An inventory
 * already asks for a weight and a reason on every block it has; asking again on
 * the result would be the same question twice with the second one worse, since
 * by then the reader has answered it once already.
 */
export function reflectablesOf(spec: InstrumentSpec, result: unknown, t: T): Reflectable[] {
  if (spec.family === "inventory") return [];

  const scores = (result as Scored)?.scores;
  if (scores && typeof scores === "object") {
    const rows: Reflectable[] = [];
    for (const key of Object.keys(scores)) {
      const label = labelFor(key, t);
      // A scale whose name cannot be found is skipped rather than shown under
      // its own key. The test is what stops that being a silent hole.
      if (label) rows.push({ key, label });
    }
    if (rows.length) return rows;
  }

  // A profiler has no scales — a date is not a factor. One question about the
  // reading as a whole is the honest shape, and it is still worth asking.
  return [{ key: WHOLE, label: t("title") }];
}

export type Reflection = { weight?: number; why?: string; updatedAt?: string };
export type Reflections = Record<string, Reflection>;

export const WEIGHT_MIN = 1;
export const WEIGHT_MAX = 10;

/** A weight the control never offered is not a weight. */
export const cleanWeight = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isInteger(value) && value >= WEIGHT_MIN && value <= WEIGHT_MAX
    ? value
    : undefined;

/**
 * What the reader said mattered most here, heaviest first.
 *
 * Only weighted entries, and only ones still offered by the instrument: a
 * reflection written against a scale a later version dropped is a sentence
 * about something that no longer exists, and printing it would be worse than
 * losing it.
 */
export function ranked(rows: readonly Reflectable[], reflections: Reflections): (Reflectable & { weight: number })[] {
  return rows
    .map((row) => ({ ...row, weight: cleanWeight(reflections[row.key]?.weight) }))
    .filter((row): row is Reflectable & { weight: number } => row.weight !== undefined)
    .sort((a, b) => b.weight - a.weight);
}

/** Did the reader say anything here at all? Used to decide whether to print. */
export const said = (reflections: Reflections): boolean =>
  Object.values(reflections).some((one) => cleanWeight(one.weight) !== undefined || Boolean(one.why?.trim()));
