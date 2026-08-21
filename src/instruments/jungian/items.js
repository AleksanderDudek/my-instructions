/**
 * Jungian functions — original item bank, Likert.
 *
 * Jung's *Psychological Types* (1921) is public domain; the four-letter
 * instrument built on top of it is a trademark with copyrighted items, and
 * none of it is reproduced here.
 *
 * The design departs from the usual four-dichotomy questionnaire on purpose,
 * for the reason written into love-languages/items.js and enneagram/items.js:
 * a bipolar axis locks two scores to a constant sum, so a person who genuinely
 * runs both inner and outer orientation hard has to donate one to the other.
 * Here each of the eight functions is scored on its own 1–100, and the type is
 * *derived* from the stack rather than asked for directly.
 *
 * Five items per function, four forward and one reverse-keyed.
 */

/* Structure only. Every word lives in i18n/, keyed by function id. */
const GLYPHS = {
  ne: "◇", ni: "◆",
  se: "○", si: "●",
  te: "△", ti: "▲",
  fe: "♡", fi: "♥",
};

/** Perceiving functions gather; judging functions decide. */
const PERCEIVING = ["ne", "ni", "se", "si"];
const JUDGING = ["te", "ti", "fe", "fi"];
const ORDER = ["ne", "ni", "se", "si", "te", "ti", "fe", "fi"];

/** Every function's opposite: same job, other attitude and other pole. */
const OPPOSITE = { ne: "si", si: "ne", ni: "se", se: "ni", te: "fi", fi: "te", ti: "fe", fe: "ti" };

/** Outward-facing functions. The rest run inward. */
const EXTRAVERTED = new Set(["ne", "se", "te", "fe"]);

/** Which letter of the code each function contributes as a perceiver or judge. */
const LETTER = { ne: "N", ni: "N", se: "S", si: "S", te: "T", ti: "T", fe: "F", fi: "F" };

const row = (id, scale, reverse = false) => ({ id, kind: "likert", scaleName: "true5", scale, reverse });

const ITEMS = [
  row("ne1", "ne"), row("ne2", "ne"), row("ne3", "ne"), row("ne4", "ne"), row("ne5", "ne", true),
  row("ni1", "ni"), row("ni2", "ni"), row("ni3", "ni"), row("ni4", "ni"), row("ni5", "ni", true),
  row("se1", "se"), row("se2", "se"), row("se3", "se"), row("se4", "se"), row("se5", "se", true),
  row("si1", "si"), row("si2", "si"), row("si3", "si"), row("si4", "si"), row("si5", "si", true),
  row("te1", "te"), row("te2", "te"), row("te3", "te"), row("te4", "te"), row("te5", "te", true),
  row("ti1", "ti"), row("ti2", "ti"), row("ti3", "ti"), row("ti4", "ti"), row("ti5", "ti", true),
  row("fe1", "fe"), row("fe2", "fe"), row("fe3", "fe"), row("fe4", "fe"), row("fe5", "fe", true),
  row("fi1", "fi"), row("fi2", "fi"), row("fi3", "fi"), row("fi4", "fi"), row("fi5", "fi", true),
];

export { GLYPHS, ORDER, PERCEIVING, JUDGING, OPPOSITE, EXTRAVERTED, LETTER, ITEMS };
