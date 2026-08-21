/**
 * Conflict style — original item bank, Likert.
 *
 * The dual-concern model is public theory: how hard you push for your own
 * outcome, and how much weight you give the other person's, produce the five
 * familiar modes as regions of a plane. The Thomas–Kilmann instrument that
 * operationalises it is commercially licensed and is not reproduced here.
 *
 * Measuring the two concerns and deriving the mode, rather than asking which
 * mode you are, matters for the same reason it does in the Jungian folder:
 * a forced choice between "I compete" and "I accommodate" cannot express
 * somebody who does a great deal of both.
 *
 * Nine items per concern, six forward and three reverse-keyed.
 */

const ORDER = ["assertiveness", "cooperativeness"];

const row = (id, scale, reverse = false) => ({ id, kind: "likert", scaleName: "agree5", scale, reverse });

const ITEMS = [
  row("as1", "assertiveness"),
  row("as2", "assertiveness"),
  row("as3", "assertiveness"),
  row("as4", "assertiveness"),
  row("as5", "assertiveness"),
  row("as6", "assertiveness"),
  row("as7", "assertiveness", true),
  row("as8", "assertiveness", true),
  row("as9", "assertiveness", true),

  row("co1", "cooperativeness"),
  row("co2", "cooperativeness"),
  row("co3", "cooperativeness"),
  row("co4", "cooperativeness"),
  row("co5", "cooperativeness"),
  row("co6", "cooperativeness"),
  row("co7", "cooperativeness", true),
  row("co8", "cooperativeness", true),
  row("co9", "cooperativeness", true),
];

export { ORDER, ITEMS };
