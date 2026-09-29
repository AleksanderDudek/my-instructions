/**
 * Character strengths — original item bank, Likert.
 *
 * The twenty-four strengths of Peterson and Seligman's classification (2004),
 * under its six virtues. The names are ordinary words and the classification
 * is published scholarship; every item here is written for this app.
 *
 * Three items a strength, two forward and one reverse, which is seventy-two
 * questions and about ten minutes. Three is thin. At that length a scale can
 * put somebody's strengths in an order; it cannot measure any one of them, and
 * the View says so rather than printing a bar that implies otherwise.
 *
 * Not used, and not present: the VIA Institute's inventories, and the
 * public-domain IPIP-VIA scales. The provenance note says why the second is a
 * choice rather than an obstacle.
 */

export type StrengthKey =
  | "creativity" | "curiosity" | "judgment" | "learning" | "perspective"
  | "bravery" | "perseverance" | "honesty" | "zest"
  | "love" | "kindness" | "social"
  | "teamwork" | "fairness" | "leadership"
  | "forgiveness" | "humility" | "prudence" | "regulation"
  | "beauty" | "gratitude" | "hope" | "humor" | "spirituality";

export type VirtueKey = "wisdom" | "courage" | "humanity" | "justice" | "temperance" | "transcendence";

/** The classification's own grouping, in its own order. */
export const VIRTUES: Record<VirtueKey, StrengthKey[]> = {
  wisdom: ["creativity", "curiosity", "judgment", "learning", "perspective"],
  courage: ["bravery", "perseverance", "honesty", "zest"],
  humanity: ["love", "kindness", "social"],
  justice: ["teamwork", "fairness", "leadership"],
  temperance: ["forgiveness", "humility", "prudence", "regulation"],
  transcendence: ["beauty", "gratitude", "hope", "humor", "spirituality"],
};

export const ORDER = Object.values(VIRTUES).flat();

/** Item-id prefix per strength. Two letters, unique, so an id says whose it is. */
const PREFIX: Record<StrengthKey, string> = {
  creativity: "cr", curiosity: "cu", judgment: "ju", learning: "le", perspective: "pe",
  bravery: "br", perseverance: "ps", honesty: "ho", zest: "ze",
  love: "lo", kindness: "ki", social: "so",
  teamwork: "te", fairness: "fa", leadership: "ld",
  forgiveness: "fo", humility: "hu", prudence: "pr", regulation: "re",
  beauty: "be", gratitude: "gr", hope: "hp", humor: "hm", spirituality: "sp",
};

/** Two forward, one reverse, for every strength alike. */
export const ITEMS = ORDER.flatMap((scale) => {
  const p = PREFIX[scale];
  return [
    { id: `${p}1`, kind: "likert" as const, scaleName: "true5", scale, reverse: false },
    { id: `${p}2`, kind: "likert" as const, scaleName: "true5", scale, reverse: false },
    { id: `${p}3`, kind: "likert" as const, scaleName: "true5", scale, reverse: true },
  ];
});
