/**
 * Attraction, behaviour and identity — kept apart, because they are.
 *
 * The field settled this decades ago and consumer products keep re-merging it.
 * Of women reporting any same-gender sexuality in Laumann's 1994 survey, 88%
 * reported attraction, 41% reported behaviour and 16% reported a lesbian or
 * gay identity. Those are three overlapping populations, not three views of
 * one. Every serious survey — NSFG, Natsal, NHIS, the ONS census — asks them
 * separately, and an instrument that infers identity from attraction is
 * generating measurement error and calling it insight.
 *
 * The intensity axes are *independent*, following Storms (1980) rather than
 * Kinsey's single line. Two axes is Storms' own form: attraction to men and
 * attraction to women asked separately rather than traded off against each
 * other. A single bipolar line cannot represent low attraction at all — it
 * puts "drawn strongly to both" and "drawn to neither" in the same place,
 * because one is the midpoint of a sum and the other the midpoint of an
 * absence. Two independent axes put them at opposite corners, which is the
 * whole reason to use them and the reason four outcomes fall out of two
 * questions rather than being asked for directly.
 *
 * And nothing here assigns anybody anything. The Kinsey Institute states that
 * no official Kinsey scale test exists; AVEN states that no test determines
 * whether a person is asexual; the National Academies concluded in 2022 that
 * no attraction measure has been validated for assigning an identity. This
 * arranges what you said. It does not know what you are.
 */

export const LEVELS = ["none", "little", "some", "strong"] as const;
export type Level = (typeof LEVELS)[number];

export const TARGETS = ["men", "women"] as const;
export type Target = (typeof TARGETS)[number];

export type AxisKind = "sexual" | "romantic";
export type Axis = { id: string; kind: AxisKind; target: Target };

/** Sexual and romantic attraction are asked separately, per the split model. */
export const AXES: Axis[] = [
  ...TARGETS.map((target): Axis => ({ id: `s.${target}`, kind: "sexual", target })),
  ...TARGETS.map((target): Axis => ({ id: `r.${target}`, kind: "romantic", target })),
];

/** The answer ids carry a one-letter prefix per axis family: `s.men`, `r.women`. */
export const PREFIX: Record<AxisKind, string> = { sexual: "s", romantic: "r" };

export const IDENTITIES = ["straight", "gay", "lesbian", "bi", "ace", "ownWord", "ratherNotSay"] as const;
export type Identity = (typeof IDENTITIES)[number];

export const CERTAINTY = ["settled", "working", "noLabel"] as const;
export type Certainty = (typeof CERTAINTY)[number];

export const ASSUME = ["partnerGender", "identityFromPartner", "nothing"] as const;
export type Assume = (typeof ASSUME)[number];

/** Four steps, and the step number is all the arithmetic this instrument does. */
export const depth = (value: string): number => Math.max(0, (LEVELS as readonly string[]).indexOf(value));

/**
 * An answer, if it is one of the allowed values, else the default. Every
 * stored field goes through this: a result is written to disk and read back by
 * a later version, so nothing may assume the shape it left in.
 */
export const oneOf = <V extends string>(values: readonly V[], value: unknown, fallback: V): V =>
  typeof value === "string" && (values as readonly string[]).includes(value) ? (value as V) : fallback;
