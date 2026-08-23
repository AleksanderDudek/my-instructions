/**
 * The item bank: fifty specific things, asked one at a time.
 *
 * The earlier version of this instrument asked about fourteen broad *areas*
 * and let a role axis carry the detail. That was the cautious shape, and it
 * was the wrong one for what the instrument is for: "restraint, and I would
 * rather be the one restrained" is a fact about a person, but two people
 * cannot plan an evening with it. Specific items can be matched; areas can
 * only be compared.
 *
 * Two structural decisions do most of the work here.
 *
 * **Directional acts are two items, not one item plus a role.** A role axis
 * with a "both" option cannot express "I love giving this and can take or
 * leave receiving it", which is an extremely common and entirely ordinary
 * shape. Asking each direction on its own scale can. It costs a few more
 * items and it is the difference between a worksheet and a usable answer.
 *
 * **The sides are `a` and `b` rather than `give` and `receive`.** Giving and
 * receiving is the wrong pair for being on top, meaningless for being watched
 * and misleading for taking charge. Each item carries its own wording; the
 * code only needs to know which two halves face each other. That fact — that
 * the axis has to be named per act — is the one genuinely good idea in the
 * worksheet tradition, and it is an idea rather than an expression, so it is
 * the only thing taken from it. Every line of wording here is ours.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
import type { ChoiceItem, T } from "@/core/types";

/**
 * Five points, and deliberately not a Likert agreement scale.
 *
 * "Curious" is the load-bearing one. A yes/no list produces a negotiation
 * where both people defend positions; a list with a curious option produces
 * the far more useful finding that one of you is keen and the other is open,
 * which is the only category that actually changes what a couple does next.
 * "Not now" exists so that a soft no does not have to be filed as a limit —
 * conflating "not this year" with "never" is how these lists start lying.
 */
export type Interest = "limit" | "notNow" | "curious" | "yes" | "favourite";
const INTEREST: Interest[] = ["limit", "notNow", "curious", "yes", "favourite"];

/** Index of the first level that counts as wanting it. */
const KEEN = INTEREST.indexOf("yes");
const CURIOUS = INTEREST.indexOf("curious");

export type Section = "pace" | "acts" | "positions" | "power" | "words" | "watching" | "structure";
const SECTIONS: Section[] = ["pace", "acts", "positions", "power", "words", "watching", "structure"];

/** `a` and `b` are the two halves of a facing pair; a plain act has no side. */
export type Side = "a" | "b" | null;
export type Act = { section: Section; id: string; side: Side };

/** `[section, id]`, where an id ending `.a`/`.b` is one half of a facing pair. */
const BANK: [Section, string][] = [
  ["pace", "kissing"],
  ["pace", "foreplay"],
  ["pace", "quickie"],
  ["pace", "aftercare"],

  ["acts", "oral.a"], ["acts", "oral.b"],
  ["acts", "hands.a"], ["acts", "hands.b"],
  ["acts", "penetration"],
  ["acts", "anal.a"], ["acts", "anal.b"],
  ["acts", "rimming.a"], ["acts", "rimming.b"],
  ["acts", "toys.a"], ["acts", "toys.b"],

  ["positions", "top.a"], ["positions", "top.b"],
  ["positions", "missionary"],
  ["positions", "behind.a"], ["positions", "behind.b"],
  ["positions", "standing"],
  ["positions", "spooning"],

  ["power", "lead.a"], ["power", "lead.b"],
  ["power", "restrain.a"], ["power", "restrain.b"],
  ["power", "blindfold.a"], ["power", "blindfold.b"],
  ["power", "impact.a"], ["power", "impact.b"],
  ["power", "sensation.a"], ["power", "sensation.b"],
  ["power", "orders.a"], ["power", "orders.b"],

  ["words", "talk.a"], ["words", "talk.b"],
  ["words", "praise.a"], ["words", "praise.b"],
  ["words", "degrade.a"], ["words", "degrade.b"],
  ["words", "roleplay"],

  ["watching", "watch.a"], ["watching", "watch.b"],
  ["watching", "mirrors"],
  ["watching", "filming"],
  ["watching", "sexting"],

  ["structure", "threesome"],
  ["structure", "group"],
  ["structure", "open"],
  ["structure", "risk"],
];

const ACTS: Act[] = BANK.map(([section, id]) => ({
  section,
  id,
  side: id.endsWith(".a") ? "a" : id.endsWith(".b") ? "b" : null,
}));

/**
 * The item facing this one across a couple.
 *
 * For a directional act it is the other half — your giving against their
 * receiving — because that, and not like-against-like, is the pairing that
 * decides whether an evening works. Every worksheet in this tradition rates
 * both halves and then compares each against its own twin, which answers a
 * question nobody has. For a non-directional act an item faces itself.
 */
const facing = (id: string): string =>
  id.endsWith(".a") ? `${id.slice(0, -2)}.b` : id.endsWith(".b") ? `${id.slice(0, -2)}.a` : id;

/** The form's items, in section order, with wording from the message table. */
function itemsFor(t: T): ChoiceItem[] {
  return ACTS.map(({ id, section }) => ({
    id,
    kind: "choice",
    tier: "private",
    section,
    prompt: t(`act.${id}`),
    group: t(`section.${section}`),
    options: INTEREST.map((value) => ({ value, label: t(`interest.${value}`) })),
  }));
}

export { INTEREST, KEEN, CURIOUS, SECTIONS, ACTS, facing, itemsFor };
