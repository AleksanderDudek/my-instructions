/**
 * What you do, not what you are.
 *
 * This folder exists because the instrument it replaces should not. A visual /
 * auditory / reading / kinaesthetic style asks the reader to accept the meshing
 * hypothesis — that instruction matched to a style produces better learning —
 * and the reviews do not support it. It is also a four-way forced assignment,
 * which is ipsative in the way `love-languages/items.ts` already argues
 * against, and it is a fixed-identity claim about capability, which self-report
 * cannot make.
 *
 * What survives is the version that is true: which techniques you actually use.
 * Dunlosky, Rawson, Marsh, Nathan and Willingham (2013) rated distributed
 * practice and retrieval practice high utility, and rereading, highlighting and
 * summarisation low; Rohrer and Pashler add interleaving. Those are behaviours
 * with plain names, so no items need borrowing — only asking.
 *
 * Nothing here is scored. `repertoire` is a *count of behaviours*, which is the
 * one breadth reading in this app that needs no norms: it does not say you are
 * broader than other people, it says how many of six named things you do.
 */

/**
 * The four frequencies, least to most. The order is load-bearing twice over:
 * it is the order the options are offered in, and the index is the depth the
 * leaning arithmetic averages.
 */
export type HowOften = "never" | "rarely" | "sometimes" | "often";

export const HOW_OFTEN: HowOften[] = ["never", "rarely", "sometimes", "often"];

export type Utility = "high" | "low";

export type Technique = { id: string; utility: Utility };

/** The six techniques, and whether the evidence favours them. */
export const TECHNIQUES: Technique[] = [
  { id: "retrieval", utility: "high" },
  { id: "spacing", utility: "high" },
  { id: "interleaving", utility: "high" },
  { id: "elaboration", utility: "high" },
  { id: "rereading", utility: "low" },
  { id: "highlighting", utility: "low" },
];

/**
 * A choice field: an id, and the option values in the order they are shown.
 * The values are message-key fragments, never words — the first is the default.
 */
export type ChoiceField = { id: string; options: string[] };

export const CHOICES: ChoiceField[] = [
  { id: "check", options: ["reread", "recall", "explain", "problem"] },
  { id: "wrong", options: ["moveOn", "reread", "redo", "findWhy"] },
  { id: "start", options: ["earlySpread", "earlyOnce", "nightBefore"] },
];

/** Used at least sometimes counts as part of the repertoire. */
export const USES = (value: HowOften | undefined): boolean =>
  HOW_OFTEN.indexOf(value as HowOften) >= HOW_OFTEN.indexOf("sometimes");

/**
 * The vanilla guard with its narrowing written down: an answer that is not one
 * of the four frequencies is read as "sometimes", which is the form's default
 * and therefore what an untouched field already meant.
 */
export const asOften = (value: unknown): HowOften =>
  HOW_OFTEN.includes(value as HowOften) ? (value as HowOften) : "sometimes";
