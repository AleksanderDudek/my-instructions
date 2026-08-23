/**
 * Intimacy conditions — original items.
 *
 * The name is the design. A folder called `intimacy-conditions` promises what
 * it can deliver; one called `sexual-compatibility` promises what nobody can.
 *
 * What is deliberately absent is longer than what is here.
 *
 * **No compatibility score, in any form.** There is no validated
 * concordance-to-satisfaction evidence, and a percentage built by subtracting
 * one questionnaire from another is the difference-score problem the rest of
 * this codebase already refuses.
 *
 * **No typology.** No erotic types, no blueprints, no "sexual love language".
 * A type label is ipsative by construction and is also something a partner can
 * hold against a person for years.
 *
 * **No activity inventory.** A yes / no / ask-me-first checklist is the
 * highest-harm artefact this domain offers: an itemised written record of a
 * named person's sexual interests. Removing a score from it does not remove
 * the harm, because the list *is* the harm.
 *
 * **No scored excitation or inhibition axes, and no diagnostic vocabulary.**
 * The content of the dual-control model is good and belongs on a card; the two
 * 1–100 axes do not. Words like dysfunction, disorder or low libido require a
 * distress judgement and a duration this instrument does not have and should
 * not collect.
 *
 * **No frequency benchmark.** The association with satisfaction flattens at
 * about weekly and vanishes for single people. There is no target to point at.
 *
 * What is left is conditions and requests: sentences a person could hand to a
 * partner. That is the same instruction-card shape the app already produces
 * for the affection and conflict channels, and it is the only output in this
 * domain that is both defensible and useful.
 */
import type { Item, T } from "@/core/types";

/**
 * A choice field: an id, and the option values it offers in the order they are
 * shown. The values are message-key fragments, never words — every label the
 * reader sees is resolved from `i18n/` against the ids below.
 */
export type ChoiceField = { id: string; options: string[] };

/**
 * The bank carries two things the shared `Item` type has no opinion about:
 * `scaleName`, the response scale a Likert item is answered on, and `area`,
 * the block it belongs to. Both are the vanilla shape, kept rather than
 * renamed — the ids and the keying are what a score is made of.
 */
export type BankItem = Item & { scaleName?: string; area: string };

/** Comfort items. Raw answers never leave the device — see PRIVATE below. */
const COMFORT = ["asking", "declining", "hearingNo", "raisingAfter", "changing", "unhurried"];

/** Conditions, asked as choices because a condition is a fact, not a degree. */
const CONDITIONS: ChoiceField[] = [
  { id: "pace", options: ["unhurried", "either", "spontaneous"] },
  { id: "approach", options: ["words", "touch", "either"] },
  { id: "conflict", options: ["blocks", "depends", "separate"] },
  { id: "privacy", options: ["high", "some", "little"] },
  { id: "arrival", options: ["before", "during", "varies"] },
];

const PRACTICE: ChoiceField[] = [
  { id: "initiate", options: ["me", "either", "them"] },
  { id: "asking", options: ["plain", "hint", "touch"] },
  { id: "decline", options: ["plain", "soften", "hard"] },
  { id: "declineMeans", options: ["tonightOnly", "needSomething", "readIt"] },
];

/**
 * Three items on whether the reader treats this as fixed or as learnable.
 * Never reported as a trait and never shared. They choose which of two closing
 * paragraphs the page shows, which is the only honest use for them: the
 * finding that destiny beliefs predict worse outcomes when problems arise is
 * about beliefs people already hold, not about beliefs a questionnaire creates.
 */
const BELIEFS = ["learnable", "fixed", "talkHelps"];

/**
 * Everything a partner could read is composed from conditions and practice.
 * Comfort and beliefs inform the reader's own page and stop there — they are
 * the answers most easily used against somebody, and the ones a partner needs
 * least.
 */
const PRIVATE: Set<string> = new Set(
  [...COMFORT, ...BELIEFS].map((id) => `c.${id}`).concat(BELIEFS.map((id) => `b.${id}`)),
);

function itemsFor(t: T): BankItem[] {
  const items: BankItem[] = [];

  for (const id of COMFORT) {
    items.push({
      id: `c.${id}`, kind: "likert", scaleName: "agree5", scale: "comfort", area: "comfort",
      prompt: t(`comfort.${id}.prompt`), tier: "private",
    });
  }

  for (const f of CONDITIONS) {
    items.push({
      id: `n.${f.id}`, kind: "choice", area: "conditions", prompt: t(`condition.${f.id}.prompt`),
      options: f.options.map((value) => ({ value, label: t(`condition.${f.id}.${value}`) })),
    });
  }

  for (const f of PRACTICE) {
    items.push({
      id: `p.${f.id}`, kind: "choice", area: "practice", prompt: t(`practice.${f.id}.prompt`),
      options: f.options.map((value) => ({ value, label: t(`practice.${f.id}.${value}`) })),
    });
  }

  for (const id of BELIEFS) {
    items.push({
      id: `b.${id}`, kind: "likert", scaleName: "agree5", scale: "beliefs", area: "beliefs",
      prompt: t(`belief.${id}.prompt`), tier: "private",
    });
  }

  return items;
}

export { COMFORT, CONDITIONS, PRACTICE, BELIEFS, PRIVATE, itemsFor };
