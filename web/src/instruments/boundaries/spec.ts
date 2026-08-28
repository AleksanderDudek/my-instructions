import { stanceItems, scoreStances, cardable, type StanceReading, type StanceResult, type StancePrompts } from "@/core/stance";
import type { Answers, Channel, InstructionCard, InstrumentSpec, Playbook, T } from "@/core/types";
import { BLOCKS, PLAYBOOK_OK, PLAYBOOK_NOT_OK, type Derivation } from "./blocks";

/**
 * Twelve stated positions, and nothing computed from them.
 *
 * There is no scoring function of its own: `scoreStances` reads the answers
 * back as positions, weights and whether a reason exists, and that is the
 * whole reading. No band, no tally, no flag — least of all a flag. See the
 * header of `blocks.ts` for what this bank refuses to collect and why.
 *
 * What this file adds to the bank is the two derivations the bank declares
 * but cannot perform: which suggested lines the reader's own answers earn,
 * and which of the twelve go onto which instruction card.
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
 * `docs/banks/boundaries.json` can be diffed by eye. That is worth a parser:
 * the alternative is a second machine-readable copy of the same fact, and two
 * copies of a mapping are two copies that drift.
 *
 * A malformed entry throws at module load rather than silently offering the
 * reader nothing. A playbook line that never fires is invisible — the page
 * simply has one fewer checkbox — so there is no later moment at which
 * anybody would notice. That matters more here than in the pilot: this bank's
 * `notMine` and `doIt` answers are deliberately uncovered, so "this option
 * fires nothing" is a state somebody reading the page cannot distinguish from
 * a typo in an id.
 */
type Fires = { block: string; values: Set<string> };

function parseFrom(from: string, id: string): Fires {
  const [left, right] = from.split("=");
  if (!left || !right) throw new TypeError(`boundaries: playbook "${id}" has no "=" in its derivation`);
  const block = left.trim();
  if (!BLOCKS.some((b) => b.id === block)) {
    throw new TypeError(`boundaries: playbook "${id}" derives from unknown block "${block}"`);
  }
  const values = right.split("|").map((v) => v.trim()).filter(Boolean);
  const options = BLOCKS.find((b) => b.id === block)!.options;
  for (const value of values) {
    if (!options.includes(value)) {
      throw new TypeError(`boundaries: playbook "${id}" fires on "${block} = ${value}", which is not an option`);
    }
  }
  if (!values.length) throw new TypeError(`boundaries: playbook "${id}" fires on no value`);
  return { block, values: new Set(values) };
}

const compile = (list: readonly Derivation[]) =>
  list.map((d) => ({ id: d.id, ...parseFrom(d.from, d.id) }));

const OK = compile(PLAYBOOK_OK);
const NOT_OK = compile(PLAYBOOK_NOT_OK);

/**
 * What was actually picked, whichever kind of block it was.
 *
 * `scoreStances` returns a string for a `choice` and an array for a `multi`,
 * and both have to answer the same question here: is one of the values this
 * line fires on among the ones the reader chose. Eleven blocks take the first
 * branch and `friend-rude` takes the second. The array is already filtered to
 * declared values by the scorer, so a stale option from a revised bank cannot
 * fire a line that was written about something else.
 */
const picked = (choice: StanceReading["choice"]): readonly string[] =>
  typeof choice === "string" ? [choice] : Array.isArray(choice) ? choice : [];

/**
 * The lines this reader's own answers earn.
 *
 * A line fires when any value it names was picked; an unanswered block fires
 * nothing on either side. One line fires once however many of its values were
 * ticked — a reader who says something there and then *and* tells the person
 * it was about has made one request of the people around them, not two copies
 * of it, and the id is what a tick is stored against besides.
 *
 * Several options fire no line at all. That is the bank's list of honest
 * escapes plus the two `notMine` answers, and the second group is the reason
 * this function is worth reading twice: there is no sentence anybody may be
 * handed on the strength of «Not something I decide», because the sentence
 * would be an arrangement the reader did not agree to, written in their voice
 * and printed for the person who imposed it.
 */
const fired = (compiled: ReturnType<typeof compile>, result: StanceResult, t: T) =>
  compiled
    .filter(({ block, values }) => picked(result.stances[block]?.choice ?? null).some((value) => values.has(value)))
    .map(({ id }) => ({ id, text: t(`playbook.${id}`) }));

export function playbook(result: StanceResult, t: T): Playbook {
  return { ok: fired(OK, result, t), notOk: fired(NOT_OK, result, t) };
}

/**
 * Five cards, on the four channels this instrument declares.
 *
 * The grouping is §4 of `docs/superpowers/specs/2026-08-27-inventory-decisions.md`
 * and is deliberately not the section grouping: the sections are the order the
 * questions are *asked* in, and a card is what somebody reads off a printed
 * sheet. `things-read` is asked last, under "Yours to give", and lands on the
 * first card, because the person holding the sheet is looking up what they may
 * walk into rather than working through it in the order it was answered.
 *
 * A card's body is the reader's own chosen labels and nothing else. There is
 * no sentence here composed on their behalf, which is the same rule the result
 * page follows: this instrument reports what was said and adds nothing to it.
 * That rule is what makes the sheet safe to print. «Not something I decide»
 * appears on it as those five words and is never restated as a rule, an
 * instruction or a preference — a card that turned it into either would hand
 * the reader's own compliance to whoever the sheet is for.
 */
const CARDS: { key: string; channel: Channel; blocks: string[] }[] = [
  { key: "card.arriving", channel: "communication", blocks: ["unannounced-visit", "closed-door", "things-read"] },
  { key: "card.committing", channel: "communication", blocks: ["volunteered", "money-family"] },
  { key: "card.clock", channel: "rhythm", blocks: ["lateness", "woken"] },
  { key: "card.touch", channel: "affection", blocks: ["public-touch"] },
  { key: "card.repeating", channel: "conflict", blocks: ["partner-ex-friend", "own-ex-contact", "told-outside", "friend-rude"] },
];

export function instructions(result: StanceResult, t: T): InstructionCard[] {
  const cards: InstructionCard[] = [];
  for (const card of CARDS) {
    /**
     * `cardable` rather than the id list directly.
     *
     * Nothing in this bank is `private`, so today the filter returns what it
     * was given. It is here because the guarantee it makes cannot be checked
     * downstream — an `InstructionCard` is a channel and two finished
     * strings, so by the time one exists there is nothing left in it naming
     * the block it came from. See the note on `cardable` in `core/stance.ts`.
     * A block made private in a later version has to stop producing a card
     * without anybody remembering to come back here.
     */
    const body = cardable(BLOCKS, card.blocks)
      .map((id) => {
        // The label is looked up under the block that was actually answered,
        // so the id and the value are resolved together. Filtering first and
        // re-deriving the id by position is how a card ends up printing one
        // block's answer under another block's option key.
        const chosen = picked(result.stances[id]?.choice ?? null);
        // A multi's picks are one answer to one question, so they are joined
        // into one entry rather than strung through the card as though the
        // reader had answered twice.
        return chosen.length ? chosen.map((value) => t(`stance.${id}.opt.${value}`)).join(", ") : null;
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
  id: "boundaries",
  version: 1,
  family: "inventory",
  glyph: "⌂",
  minutes: 9,
  channels: ["communication", "conflict", "affection", "rhythm"],
  tier: "free",
  /**
   * Sensitive, and capped at one person.
   *
   * §3 of the decisions spec puts every inventory but the pilot here, and
   * names the block that earns it for this one: `told-outside` records how
   * wide the circle of people who hear about the arguments already is, which
   * is a fact about a household rather than a preference about a household.
   * The cap governs the share *token* and costs nothing else — the
   * instruction sheet is local and printable, so a boundaries sheet handed to
   * a flatmate is not a URL. What the cap prevents is the forwarded link.
   */
  sensitive: true,
  maxAudience: "partner",
  messages: {
    en: () => import("./i18n/en"),
    pl: () => import("./i18n/pl"),
    es: () => import("./i18n/es"),
    de: () => import("./i18n/de"),
  },
  form: (t) => ({
    kind: "items",
    // Declared, not defaulted: `validate()` refuses an inventory that leaves
    // it open, because a weight shuffled away from the question it weighs
    // asks how important nothing in particular is and the page would look
    // fine.
    shuffle: false,
    // Nothing is required. A position somebody has not taken is a real
    // answer, and a form that will not advance without one collects a guess.
    optional: true,
    // One block — question, weight, reason — is never split across a page
    // break, and `pageSize` is then the soft ceiling that decides how many
    // blocks share a page.
    //
    // One block per page: `1 * 3` is one block of three items, and it is the
    // only ceiling this bank can have. The pilot writes `3 * 3` because its
    // four sections are three blocks each, so a ceiling of nine packs one
    // section onto one page and stops. These four are **3, 4, 2 and 3**
    // blocks long, and `paginate` knows about groups and not about sections:
    // it fills a page until the next block would not fit, wherever the
    // section changed. A ceiling of 12 puts `partner-ex-friend` on the end of
    // the door page; a ceiling of 9 pushes `friend-rude` onto the body page.
    // Both of those pages then mix two sections, `sectionHeader` returns null
    // for a mixed page, and the section's title and note vanish silently —
    // which is the failure this arithmetic exists to prevent. With runs of
    // three items and boundaries after blocks 3, 7, 9 and 12, one block is
    // the only page size that never straddles.
    //
    // The cost is twelve pages where the pilot has four, and the reader meets
    // a repeated header rather than a missing one: three pages under "The
    // door and the evening", four under "Everyone else in it". A heading
    // repeated is true every time it is drawn. The alternative is a heading
    // that is simply absent over two questions about a friend and a body.
    pageBy: "group",
    pageSize: 1 * 3,
    items: stanceItems(BLOCKS, t, { id: "boundaries", prompts: promptsFrom(t) }),
  }),
  score: (answers: Answers) => scoreStances(BLOCKS, answers),
  instructions,
  playbook,
};

export default spec;
