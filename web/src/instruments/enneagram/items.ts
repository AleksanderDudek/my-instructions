/**
 * Enneagram — original item bank, Likert.
 *
 * The nine-type model is public; the RHETI's 144 forced-choice pairs are Riso
 * and Hudson's copyrighted expression of it and are not reproduced here. The
 * forced-choice format has the same defect as Chapman's quiz — the nine scores
 * are locked to a constant sum, so a person who genuinely runs on two types
 * has to donate one to the other.
 *
 * Forty-five items, five per type, one reverse-keyed in each block. Types are
 * described by their *motive*, not their behaviour: two people can both tidy
 * the kitchen, and only the reason tells you which type did it.
 */

/* Structure only. Type names, motives and prose live in i18n/, keyed by
   type number — which is the one part of the Enneagram that is language-free. */
export type CentreKey = "body" | "heart" | "head";
export type Line = { stress: number; ease: number };

const NUMBERS: number[] = [1,2,3,4,5,6,7,8,9];

const CENTRES: Record<CentreKey, { types: number[] }> = {
  body: { types: [8,9,1] },
  heart: { types: [2,3,4] },
  head: { types: [5,6,7] },
};

const LINES: Record<number, Line> = {"1":{"stress":4,"ease":7},"2":{"stress":8,"ease":4},"3":{"stress":9,"ease":6},"4":{"stress":2,"ease":1},"5":{"stress":7,"ease":8},"6":{"stress":3,"ease":9},"7":{"stress":1,"ease":5},"8":{"stress":5,"ease":2},"9":{"stress":6,"ease":3}};

/** The two types either side of the given number on the circle. */
function wingsOf(n: number): [number, number] { return [n === 1 ? 9 : n - 1, n === 9 ? 1 : n + 1]; }

/** kind/scale name are constant across this bank, so the rows stay readable. */
const row = (id: string, scale: string, reverse = false) =>
  ({ id, kind: "likert" as const, scaleName: "true5", scale, reverse });

const ITEMS = [
  row("e1a", "1"),
  row("e1b", "1"),
  row("e1c", "1"),
  row("e1d", "1"),
  row("e1e", "1", true),

  row("e2a", "2"),
  row("e2b", "2"),
  row("e2c", "2"),
  row("e2d", "2"),
  row("e2e", "2", true),

  row("e3a", "3"),
  row("e3b", "3"),
  row("e3c", "3"),
  row("e3d", "3"),
  row("e3e", "3", true),

  row("e4a", "4"),
  row("e4b", "4"),
  row("e4c", "4"),
  row("e4d", "4"),
  row("e4e", "4", true),

  row("e5a", "5"),
  row("e5b", "5"),
  row("e5c", "5"),
  row("e5d", "5"),
  row("e5e", "5", true),

  row("e6a", "6"),
  row("e6b", "6"),
  row("e6c", "6"),
  row("e6d", "6"),
  row("e6e", "6", true),

  row("e7a", "7"),
  row("e7b", "7"),
  row("e7c", "7"),
  row("e7d", "7"),
  row("e7e", "7", true),

  row("e8a", "8"),
  row("e8b", "8"),
  row("e8c", "8"),
  row("e8d", "8"),
  row("e8e", "8", true),

  row("e9a", "9"),
  row("e9b", "9"),
  row("e9c", "9"),
  row("e9d", "9"),
  row("e9e", "9", true),
];

export { NUMBERS, CENTRES, LINES, wingsOf, ITEMS };
