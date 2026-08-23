/**
 * Attachment — original item bank, Likert.
 *
 * Two dimensions, not four types. Anxiety is how much the possibility of
 * being left occupies you; avoidance is how much closeness itself costs. The
 * four familiar styles are quadrants of that plane, and a person three points
 * from a boundary is not a different kind of person from someone three points
 * the other side of it — which is why the result reports the position and
 * treats the label as shorthand.
 *
 * The items are ours. Fraley's ECR-R is freely used in research and is not
 * reproduced here; the two-dimensional structure it measures is the public
 * part and is what these items are written against.
 *
 * Nine items per dimension, six forward and three reverse-keyed. The scale is
 * seven points rather than five: this is the one instrument in the app where
 * people cluster near the middle and the extra resolution earns its keep.
 */

/* The two axes of the plane. Words for them live in i18n/, keyed by these. */
export type DimensionKey = "anxiety" | "avoidance";

const ORDER: DimensionKey[] = ["anxiety", "avoidance"];

/** kind/scale are constant across this bank, so the rows stay readable. */
const row = (id: string, scale: DimensionKey, reverse = false) =>
  ({ id, kind: "likert" as const, scaleName: "agree7", scale, reverse });

const ITEMS = [
  row("ax1", "anxiety"),
  row("ax2", "anxiety"),
  row("ax3", "anxiety"),
  row("ax4", "anxiety"),
  row("ax5", "anxiety"),
  row("ax6", "anxiety"),
  row("ax7", "anxiety", true),
  row("ax8", "anxiety", true),
  row("ax9", "anxiety", true),

  row("av1", "avoidance"),
  row("av2", "avoidance"),
  row("av3", "avoidance"),
  row("av4", "avoidance"),
  row("av5", "avoidance"),
  row("av6", "avoidance"),
  row("av7", "avoidance", true),
  row("av8", "avoidance", true),
  row("av9", "avoidance", true),
];

export { ORDER, ITEMS };
