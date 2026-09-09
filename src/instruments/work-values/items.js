/**
 * Work values — original items, Likert.
 *
 * The six values are Dawis and Lofquist's, reduced from the Minnesota
 * Importance Questionnaire's twenty needs by factor analysis, and adopted
 * under these names by the US Department of Labor for the O*NET Work
 * Importance Locator. The taxonomy is a federal work product released under
 * CC BY 4.0; the questions below are written fresh.
 *
 * Every item asks what the reader *wants*, never what they are good at and
 * never what a job is worth. A value is a preference, and a preference is the
 * one thing in this app that self-report gets right by construction.
 *
 * Six items per value, five forward and one reverse-keyed.
 */

const GLYPHS = {
  achievement: "◆", independence: "⌁", recognition: "★",
  relationships: "◎", support: "⛨", conditions: "▤",
};

/** Registration order, which is also the order of the O*NET six. */
const ORDER = ["achievement", "independence", "recognition", "relationships", "support", "conditions"];

const row = (id, scale, reverse = false) => ({ id, kind: "likert", scale, reverse });

const ITEMS = [
  row("ach1", "achievement"), row("ach2", "achievement"), row("ach3", "achievement"),
  row("ach4", "achievement"), row("ach5", "achievement"), row("ach6", "achievement", true),

  row("ind1", "independence"), row("ind2", "independence"), row("ind3", "independence"),
  row("ind4", "independence"), row("ind5", "independence"), row("ind6", "independence", true),

  row("rec1", "recognition"), row("rec2", "recognition"), row("rec3", "recognition"),
  row("rec4", "recognition"), row("rec5", "recognition"), row("rec6", "recognition", true),

  row("rel1", "relationships"), row("rel2", "relationships"), row("rel3", "relationships"),
  row("rel4", "relationships"), row("rel5", "relationships"), row("rel6", "relationships", true),

  row("sup1", "support"), row("sup2", "support"), row("sup3", "support"),
  row("sup4", "support"), row("sup5", "support"), row("sup6", "support", true),

  row("con1", "conditions"), row("con2", "conditions"), row("con3", "conditions"),
  row("con4", "conditions"), row("con5", "conditions"), row("con6", "conditions", true),
];

export { GLYPHS, ORDER, ITEMS };
