/**
 * Work shape — original items, Likert.
 *
 * `riasec` sorts work by subject matter. This sorts it by what the doing is
 * actually made of, which is the axis that decides whether somebody lasts.
 * Two Investigative jobs can be opposite in every way that matters: one is a
 * six-month problem held alone, the other is forty small questions a day
 * answered in a room full of people.
 *
 * Eight scales, arranged as four contrasts:
 *
 *   depth     ⟷ variety      one long thing, or many short ones
 *   structure ⟷ openEnded    a defined problem, or one nobody has framed
 *   making    ⟷ people       producing an artifact, or working through others
 *   improving ⟷ starting     sharpening what exists, or the first version
 *
 * The two ends of a contrast are scored **independently**, and that is the
 * whole design. Every consumer instrument in this space forces a choice, which
 * is the ipsative trap `love-languages/items.ts` argues against at length.
 * Here both ends can be high — and someone high on `depth` and high on
 * `variety` is not confused, they need variety *between* long projects, and a
 * forced choice would have deleted them.
 *
 * Five items per scale, four forward and one reverse-keyed.
 */

export type ShapeKey =
  | "depth" | "variety" | "structure" | "openEnded"
  | "making" | "people" | "improving" | "starting";

const GLYPHS: Record<ShapeKey, string> = {
  depth: "⌖", variety: "⁘", structure: "▤", openEnded: "◌",
  making: "⚒", people: "☍", improving: "↻", starting: "✦",
};

/** The four contrasts, each as [a, b]. Order is presentation order. */
const CONTRASTS: [ShapeKey, ShapeKey][] = [
  ["depth", "variety"],
  ["structure", "openEnded"],
  ["making", "people"],
  ["improving", "starting"],
];

const ORDER: ShapeKey[] = CONTRASTS.flat();

const row = (id: string, scale: ShapeKey, reverse = false) =>
  ({ id, kind: "likert" as const, scaleName: "agree5", scale, reverse });

const ITEMS = [
  row("dep1", "depth"), row("dep2", "depth"), row("dep3", "depth"), row("dep4", "depth"), row("dep5", "depth", true),
  row("var1", "variety"), row("var2", "variety"), row("var3", "variety"), row("var4", "variety"), row("var5", "variety", true),
  row("str1", "structure"), row("str2", "structure"), row("str3", "structure"), row("str4", "structure"), row("str5", "structure", true),
  row("opn1", "openEnded"), row("opn2", "openEnded"), row("opn3", "openEnded"), row("opn4", "openEnded"), row("opn5", "openEnded", true),
  row("mak1", "making"), row("mak2", "making"), row("mak3", "making"), row("mak4", "making"), row("mak5", "making", true),
  row("peo1", "people"), row("peo2", "people"), row("peo3", "people"), row("peo4", "people"), row("peo5", "people", true),
  row("imp1", "improving"), row("imp2", "improving"), row("imp3", "improving"), row("imp4", "improving"), row("imp5", "improving", true),
  row("sta1", "starting"), row("sta2", "starting"), row("sta3", "starting"), row("sta4", "starting"), row("sta5", "starting", true),
];

export { GLYPHS, CONTRASTS, ORDER, ITEMS };
