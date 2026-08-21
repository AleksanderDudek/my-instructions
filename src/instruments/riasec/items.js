/**
 * RIASEC — original interest items, Likert.
 *
 * Holland's six interest types and the hexagon they sit on are public, and
 * public-domain item pools exist (the Liao, Armstrong & Rounds markers, and
 * the US Department of Labor's Interest Profiler). These items are written
 * fresh in the app's voice against the same six definitions.
 *
 * Interests are asked about as activities rather than as job titles. A job
 * title carries a salary, a status and a stereotype along with the work, and
 * people answer about those instead.
 *
 * Six items per type, five forward and one reverse-keyed.
 */

const GLYPHS = {
  realistic: "⚒", investigative: "⌕", artistic: "✎",
  social: "♁", enterprising: "◈", conventional: "▤",
};

/**
 * The hexagon, in order. Adjacency is not decoration: neighbouring types
 * share something real, and opposite types genuinely pull against each other,
 * which is what makes a code's consistency worth reporting.
 */
const ORDER = ["realistic", "investigative", "artistic", "social", "enterprising", "conventional"];

const row = (id, scale, reverse = false) => ({ id, kind: "likert", scaleName: "agree5", scale, reverse });

const ITEMS = [
  row("r1", "realistic"), row("r2", "realistic"), row("r3", "realistic"),
  row("r4", "realistic"), row("r5", "realistic"), row("r6", "realistic", true),

  row("i1", "investigative"), row("i2", "investigative"), row("i3", "investigative"),
  row("i4", "investigative"), row("i5", "investigative"), row("i6", "investigative", true),

  row("a1", "artistic"), row("a2", "artistic"), row("a3", "artistic"),
  row("a4", "artistic"), row("a5", "artistic"), row("a6", "artistic", true),

  row("s1", "social"), row("s2", "social"), row("s3", "social"),
  row("s4", "social"), row("s5", "social"), row("s6", "social", true),

  row("e1", "enterprising"), row("e2", "enterprising"), row("e3", "enterprising"),
  row("e4", "enterprising"), row("e5", "enterprising"), row("e6", "enterprising", true),

  row("c1", "conventional"), row("c2", "conventional"), row("c3", "conventional"),
  row("c4", "conventional"), row("c5", "conventional"), row("c6", "conventional", true),
];

export { GLYPHS, ORDER, ITEMS };
