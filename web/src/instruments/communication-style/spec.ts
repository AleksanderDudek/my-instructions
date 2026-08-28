import { stanceItems, scoreStances, cardable, type StanceResult, type StancePrompts } from "@/core/stance";
import type { Answers, InstructionCard, InstrumentSpec, Playbook, T } from "@/core/types";
import { BLOCKS, PLAYBOOK_OK, PLAYBOOK_NOT_OK, type Derivation } from "./blocks";

/**
 * Twelve stated requests, and nothing computed from them.
 *
 * The first inventory in the app, so it is worth saying what this file does
 * *not* contain. There is no scoring function of its own: `scoreStances` reads
 * the answers back as positions, weights and whether a reason exists, and that
 * is the whole reading. There is no band, no axis, no tally and no colour —
 * see the header of `blocks.ts` for why each of those was refused, and
 * `test/instruments/contract.test.ts` for the assertion that keeps them out.
 *
 * What this file adds to the bank is the two derivations the bank declares but
 * cannot perform: which suggested lines the reader's own answers earn, and
 * which of the twelve go onto which instruction card.
 */

/**
 * The prompts shared by every inventory, resolved rather than keyed.
 *
 * `t` here is the instrument's scoped translator, which falls through to the
 * shell for a key the instrument does not define — so these five come from
 * `stance.*` in `src/i18n/messages/`, are written once, and read identically
 * in all eight inventories. Under the identity `t` the readability gate uses
 * they resolve to their own keys, which is what lets that gate measure them.
 */
const promptsFrom = (t: T): StancePrompts => ({
  weight: t("stance.weightPrompt"),
  why: t("stance.whyPrompt"),
  weightLow: t("stance.weightLow"),
  weightHigh: t("stance.weightHigh"),
  whyPlaceholder: t("stance.whyPlaceholder"),
});

/**
 * `block = value | value`, parsed once.
 *
 * The bank writes its derivations in its own notation so that `blocks.ts` and
 * `docs/banks/communication-style.json` can be diffed by eye. That is worth a
 * parser: the alternative is a second machine-readable copy of the same fact,
 * and two copies of a mapping are two copies that drift.
 *
 * A malformed entry throws at module load rather than silently offering the
 * reader nothing. A playbook line that never fires is invisible — the page
 * simply has one fewer checkbox — so there is no later moment at which anybody
 * would notice.
 */
type Fires = { block: string; values: Set<string> };

function parseFrom(from: string, id: string): Fires {
  const [left, right] = from.split("=");
  if (!left || !right) throw new TypeError(`communication-style: playbook "${id}" has no "=" in its derivation`);
  const block = left.trim();
  if (!BLOCKS.some((b) => b.id === block)) {
    throw new TypeError(`communication-style: playbook "${id}" derives from unknown block "${block}"`);
  }
  const values = right.split("|").map((v) => v.trim()).filter(Boolean);
  const options = BLOCKS.find((b) => b.id === block)!.options;
  for (const value of values) {
    if (!options.includes(value)) {
      throw new TypeError(`communication-style: playbook "${id}" fires on "${block} = ${value}", which is not an option`);
    }
  }
  if (!values.length) throw new TypeError(`communication-style: playbook "${id}" fires on no value`);
  return { block, values: new Set(values) };
}

const compile = (list: readonly Derivation[]) =>
  list.map((d) => ({ id: d.id, ...parseFrom(d.from, d.id) }));

const OK = compile(PLAYBOOK_OK);
const NOT_OK = compile(PLAYBOOK_NOT_OK);

/**
 * The lines this reader's own answers earn.
 *
 * Every block is a `choice`, so a stance's `choice` is a single value or null.
 * A line fires when the value it names is the one that was picked; an
 * unanswered block fires nothing on either side. Nine of the sixty-five
 * options fire no line at all, which is deliberate and is the bank's list of
 * honest escapes — there is no sentence anybody could be held to behind "I do
 * not know what settles it".
 */
const fired = (compiled: ReturnType<typeof compile>, result: StanceResult, t: T) =>
  compiled
    .filter(({ block, values }) => {
      const choice = result.stances[block]?.choice;
      return typeof choice === "string" && values.has(choice);
    })
    .map(({ id }) => ({ id, text: t(`playbook.${id}`) }));

export function playbook(result: StanceResult, t: T): Playbook {
  return { ok: fired(OK, result, t), notOk: fired(NOT_OK, result, t) };
}

/**
 * Six cards, on the two channels this instrument declares.
 *
 * The grouping is §4 of `docs/superpowers/specs/2026-08-27-inventory-decisions.md`
 * and is deliberately not the section grouping: the sections are the order the
 * questions are *asked* in, and a card is what somebody reads off a printed
 * sheet. `apology` is asked under "when something is wrong" and lands on the
 * conflict card, because the person reading the sheet is looking it up in the
 * middle of an argument rather than in the order it was answered.
 *
 * A card's body is the reader's own chosen labels and nothing else. There is no
 * sentence here composed on their behalf, which is the same rule the result
 * page follows: this instrument reports what was said and adds nothing to it.
 */
const CARDS: { key: string; channel: "communication" | "conflict"; blocks: string[] }[] = [
  { key: "card.reaching", channel: "communication", blocks: ["small-talk", "interrupting", "no-reply"] },
  { key: "card.bad-news", channel: "communication", blocks: ["bad-news", "unfinished"] },
  { key: "card.quiet", channel: "communication", blocks: ["going-quiet", "asked-if-wrong"] },
  { key: "card.praise", channel: "communication", blocks: ["praise"] },
  { key: "card.correction", channel: "conflict", blocks: ["public-correction", "upset-with-me"] },
  { key: "card.repair", channel: "conflict", blocks: ["drop-it", "apology"] },
];

export function instructions(result: StanceResult, t: T): InstructionCard[] {
  const cards: InstructionCard[] = [];
  for (const card of CARDS) {
    /**
     * `cardable` rather than the id list directly.
     *
     * Nothing in this bank is `private`, so today the filter returns what it
     * was given. It is here because the guarantee it makes cannot be checked
     * downstream — an `InstructionCard` is a channel and two finished strings,
     * so by the time one exists there is nothing left in it naming the block
     * it came from. See the note on `cardable` in `core/stance.ts`. A block
     * made private in a later version has to stop producing a card without
     * anybody remembering to come back here.
     */
    const body = cardable(BLOCKS, card.blocks)
      .map((id) => {
        const choice = result.stances[id]?.choice;
        // The label is looked up under the block that was actually answered,
        // so the id and the value are resolved together. Filtering first and
        // re-deriving the id by position is how a card ends up printing one
        // block's answer under another block's option key.
        return typeof choice === "string" ? t(`stance.${id}.opt.${choice}`) : null;
      })
      .filter((label): label is string => label !== null)
      .join(" · ");
    // A card with nothing in it is a heading on somebody's sheet with a blank
    // under it, which reads as a thing they failed to do rather than a thing
    // they declined to say.
    if (body) cards.push({ channel: card.channel, title: t(card.key), body });
  }
  return cards;
}

export const spec: InstrumentSpec<StanceResult> = {
  id: "communication-style",
  version: 1,
  family: "inventory",
  glyph: "❝",
  minutes: 9,
  channels: ["communication", "conflict"],
  tier: "free",
  /**
   * No `sensitive`, and no `maxAudience`, alone among the eight inventories.
   *
   * Nothing here is a fact about the reader's history. It records how they have
   * asked to be addressed, its audience is a team, and a link to it in an email
   * signature is precisely its use — so a default of "nobody's business" would
   * be a bug rather than a courtesy. §3 of the decisions spec makes the case at
   * length. The reasons are still private, as they are everywhere: that is a
   * property of the item kind and not a decision this file gets to make.
   */
  messages: {
    en: () => import("./i18n/en"),
    pl: () => import("./i18n/pl"),
    es: () => import("./i18n/es"),
    de: () => import("./i18n/de"),
  },
  form: (t) => ({
    kind: "items",
    // Declared, not defaulted: `validate()` refuses an inventory that leaves it
    // open, because a weight shuffled away from the question it weighs asks how
    // important nothing in particular is and the page would look fine.
    shuffle: false,
    // Nothing is required. A position somebody has not taken is a real answer,
    // and a form that will not advance without one collects a guess.
    optional: true,
    // One block — question, weight, reason — is never split across a page
    // break, and `pageSize` is then the soft ceiling that decides how many
    // blocks share a page.
    //
    // Three blocks of three items is one section, which is the size the bank
    // was written to: `SECTIONS` is four communication events, each with its
    // own title and the note under it, and a page that ends halfway through
    // "when something is wrong" asks the last two questions of it under the
    // heading of the next one. The arithmetic is spelled out rather than
    // written as 9 so that adding a `grounds` list to a block — which makes it
    // four items — fails visibly here instead of silently repacking the pages.
    pageBy: "group",
    pageSize: 3 * 3,
    items: stanceItems(BLOCKS, t, { id: "communication-style", prompts: promptsFrom(t) }),
  }),
  score: (answers: Answers) => scoreStances(BLOCKS, answers),
  instructions,
  playbook,
};

export default spec;
