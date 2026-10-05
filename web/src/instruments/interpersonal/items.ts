/**
 * Interpersonal style — the IPIP Interpersonal Circumplex (IPIP-IPC), public
 * domain (Markey & Markey 2009), thirty-two items as IPIP publishes them at
 * https://ipip.ori.org/newIPIP-IPCSurvey.htm with the key at
 * https://ipip.ori.org/newIPIP-IPCScoringKey.htm.
 *
 * Eight octants of four items each, every item keyed forward to its octant:
 * PA assured-dominant, BC arrogant-calculating, DE cold-hearted, FG
 * aloof-introverted, HI unassured-submissive, JK unassuming-ingenuous, LM
 * warm-agreeable, NO gregarious-extraverted. The two axes the circle is built
 * on, dominance and warmth, are computed from the octants in spec.ts.
 *
 * Ids are IPIP's item numbers. The Polish adaptation (UKSW, CC BY) numbers
 * its items differently; the i18n tables carry each Polish item under the
 * English number it corresponds to, matched octant by octant.
 */

export type OctantKey = "pa" | "bc" | "de" | "fg" | "hi" | "jk" | "lm" | "no";

/** Clockwise from the top of the circle, as the model draws it. */
export const ORDER: OctantKey[] = ["pa", "bc", "de", "fg", "hi", "jk", "lm", "no"];

const row = (n: number, scale: OctantKey) => ({ id: `c${n}`, kind: "likert" as const, scale });

export const ITEMS = [
  row(1, "fg"),
  row(2, "hi"),
  row(3, "jk"),
  row(4, "lm"),
  row(5, "no"),
  row(6, "pa"),
  row(7, "bc"),
  row(8, "de"),
  row(9, "fg"),
  row(10, "hi"),
  row(11, "jk"),
  row(12, "lm"),
  row(13, "no"),
  row(14, "pa"),
  row(15, "bc"),
  row(16, "de"),
  row(17, "fg"),
  row(18, "hi"),
  row(19, "jk"),
  row(20, "lm"),
  row(21, "no"),
  row(22, "pa"),
  row(23, "bc"),
  row(24, "de"),
  row(25, "fg"),
  row(26, "hi"),
  row(27, "jk"),
  row(28, "lm"),
  row(29, "no"),
  row(30, "pa"),
  row(31, "bc"),
  row(32, "de"),
];
