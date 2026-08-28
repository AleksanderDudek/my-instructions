import { stanceItems, scoreStances, cardable, type StanceReading, type StanceResult, type StancePrompts } from "@/core/stance";
import type { Answers, Channel, InstructionCard, InstrumentSpec, Playbook, T } from "@/core/types";
import { BLOCKS, PLAYBOOK_OK, PLAYBOOK_NOT_OK, type Derivation } from "./blocks";

/**
 * Twelve stated positions about phones, publication and what is kept — and
 * nothing computed from them.
 *
 * There is no scoring function of its own: `scoreStances` reads the answers
 * back as positions, grounds, weights and whether a reason exists, and that is
 * the whole reading. No band, no tally, no screen-time figure, no judgement
 * about anybody's phone. See the header of `blocks.ts` for what the research
 * behind this bank does and does not support, at the sizes it actually
 * supports it.
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
 * `docs/banks/digital-life.json` can be diffed by eye. That is worth a parser:
 * the alternative is a second machine-readable copy of the same fact, and two
 * copies of a mapping are two copies that drift.
 *
 * A malformed entry throws at module load rather than silently offering the
 * reader nothing. A playbook line that never fires is invisible — the page
 * simply has one fewer checkbox — so there is no later moment at which anybody
 * would notice. On this bank the invisible failure is worse than usual: the
 * three restrictive multis derive prohibitions from ticks, so a line dropped
 * by a mistyped value is a *not-OK* line missing from a list whose whole
 * purpose is to be complete, and the reader has no way to see the gap.
 */
type Fires = { block: string; values: Set<string> };

function parseFrom(from: string, id: string): Fires {
  const [left, right] = from.split("=");
  if (!left || !right) throw new TypeError(`digital-life: playbook "${id}" has no "=" in its derivation`);
  const block = left.trim();
  if (!BLOCKS.some((b) => b.id === block)) {
    throw new TypeError(`digital-life: playbook "${id}" derives from unknown block "${block}"`);
  }
  const values = right.split("|").map((v) => v.trim()).filter(Boolean);
  const options = BLOCKS.find((b) => b.id === block)!.options;
  for (const value of values) {
    if (!options.includes(value)) {
      throw new TypeError(`digital-life: playbook "${id}" fires on "${block} = ${value}", which is not an option`);
    }
  }
  if (!values.length) throw new TypeError(`digital-life: playbook "${id}" fires on no value`);
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
 * line fires on among the ones the reader chose. Nine blocks take the first
 * branch and the three restrictive multis take the second. The array is
 * already filtered to declared values by the scorer, so a stale option from a
 * revised bank cannot fire a line that was written about something else.
 */
const picked = (choice: StanceReading["choice"]): readonly string[] =>
  typeof choice === "string" ? [choice] : Array.isArray(choice) ? choice : [];

/**
 * The lines this reader's own answers earn.
 *
 * A line fires when any value it names was picked; an unanswered block fires
 * nothing on either side. One line fires once however many of its values were
 * ticked, and the id is what a tick is stored against besides.
 *
 * The direction is the thing to keep hold of. On the three multis the question
 * is restrictive — *what may not be posted*, *what should stay out of a group
 * chat*, *which of these should never arrive as a message* — so a ticked value
 * fires a **prohibition** and the floor value `none` fires the **permission**.
 * `no-post-where-i-am` fires on `posted-about-me = whereabouts` and says do not
 * post where I am; `ok-post-me-unasked` fires on `posted-about-me = none` and
 * says post the photograph if you like it. Flip either prompt towards
 * permission and every line under it means its opposite while this function
 * goes on behaving correctly. The bank's `rejected` list records that this
 * happened once.
 */
const fired = (compiled: ReturnType<typeof compile>, result: StanceResult, t: T) =>
  compiled
    .filter(({ block, values }) => picked(result.stances[block]?.choice ?? null).some((value) => values.has(value)))
    .map(({ id }) => ({ id, text: t(`playbook.${id}`) }));

export function playbook(result: StanceResult, t: T): Playbook {
  return { ok: fired(OK, result, t), notOk: fired(NOT_OK, result, t) };
}

/**
 * Seven cards, on the four channels this instrument declares.
 *
 * The grouping is §4 of `docs/superpowers/specs/2026-08-27-inventory-decisions.md`
 * and is deliberately not the section grouping: the sections are the order the
 * questions are *asked* in, and a card is what somebody reads off a printed
 * sheet. `phone-at-meals` is asked first, under "Attention", and lands on an
 * **affection** card with the intimate photographs, because the person holding
 * the sheet is looking up how to be in a room with someone rather than working
 * through the questions in the order they were answered. `intimate-images` has
 * a card of its own on that channel rather than sharing one, because a heading
 * covering both would print a dinner-table rule and a rule about photographs
 * under one line of type.
 *
 * A card's body is the reader's own chosen labels and nothing else. There is
 * no sentence here composed on their behalf, which is the same rule the result
 * page follows: this instrument reports what was said and adds nothing to it.
 * That matters most on the three restrictive multis, whose bodies are lists of
 * things that may **not** happen — the card's title says so and the labels are
 * printed unaltered under it, because a body that reworded "Screenshots of my
 * messages" into an instruction would be this file writing a sentence the
 * reader did not.
 */
const CARDS: { key: string; channel: Channel; blocks: string[] }[] = [
  { key: "card.answering", channel: "rhythm", blocks: ["reply-window", "work-after-hours"] },
  { key: "card.together", channel: "affection", blocks: ["phone-at-meals"] },
  { key: "card.photographs", channel: "affection", blocks: ["intimate-images"] },
  { key: "card.posting", channel: "communication", blocks: ["posted-about-me", "children-online", "group-chats"] },
  { key: "card.open", channel: "communication", blocks: ["passwords", "location", "reading-messages"] },
  { key: "card.afterwards", channel: "communication", blocks: ["accounts-after-death"] },
  { key: "card.spoken", channel: "conflict", blocks: ["not-in-writing"] },
];

export function instructions(result: StanceResult, t: T): InstructionCard[] {
  const cards: InstructionCard[] = [];
  for (const card of CARDS) {
    /**
     * `cardable` rather than the id list directly.
     *
     * Nothing in this bank is `private`, so today the filter returns what it
     * was given — `intimate-images` was considered for the tier and refused in
     * §3.1 of the decisions spec, on the ground that it asks for a rule about
     * handling rather than an admission about conduct. It is here because the
     * guarantee it makes cannot be checked downstream: an `InstructionCard` is
     * a channel and two finished strings, so by the time one exists there is
     * nothing left in it naming the block it came from. See the note on
     * `cardable` in `core/stance.ts`. If that decision is ever revisited, the
     * block has to stop producing a card without anybody remembering to come
     * back here.
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
        // reader had answered three times.
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
  id: "digital-life",
  version: 1,
  family: "inventory",
  /**
   * ✆ (U+2706), a telephone, in the same pictographic register as `attachment`'s
   * ⚭ and `working-style`'s ▦ — one monochrome character, no emoji, no
   * variation selector, from a block the app already renders. §7 of the
   * decisions spec.
   */
  glyph: "✆",
  /**
   * Twelve blocks at 45 seconds, plus 15 seconds for each of the five grounds
   * lists: 12 × 45 + 5 × 15 = 615s. §6 of the decisions spec, rounded up to the
   * honest total rather than down to a floor — a twelve-minute instrument
   * advertised as six is the one people abandon at block seven, and an
   * abandoned inventory produces nothing at all.
   */
  minutes: 10,
  channels: ["rhythm", "communication", "affection", "conflict"],
  tier: "free",
  /**
   * Sensitive, and capped at one person.
   *
   * §3 of the decisions spec puts every inventory but the pilot here and names
   * the block that earns it for this one: `intimate-images` records what may
   * exist and where it may be stored, which is a fact about a household rather
   * than a preference about one. The cap governs the share *token* and costs
   * nothing else — the instruction sheet is local and printable, so a sheet
   * about phones at the table handed to a flatmate is not a URL. What the cap
   * prevents is the forwarded link.
   *
   * Not `adult`, and the same spec says why: this bank's only candidate asks
   * what may *happen* to photographs, which is a handling rule rather than a
   * description of anything. Gating on it would put "where should phones be
   * during a shared meal" behind an age confirmation, which is how a gate
   * stops meaning anything.
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
    // Declared, not defaulted: `validate()` refuses an inventory that leaves it
    // open, because a weight shuffled away from the question it weighs asks how
    // important nothing in particular is and the page would look fine.
    shuffle: false,
    // Nothing is required. A position somebody has not taken is a real answer,
    // and a form that will not advance without one collects a guess.
    optional: true,
    // One block — question, grounds, weight, reason — is never split across a
    // page break, and `pageSize` is then the soft ceiling that decides how many
    // blocks share a page.
    //
    // A block is three items, or four where it takes the grounds list. The four
    // sections are three blocks each, and the grounds fall unevenly across
    // them, so they are *not* four identical pages the way the pilot's are:
    //
    //     attention    3 + 3 + 4  = 10    phone-at-meals, reply-window, work-after-hours
    //     visibility   3 + 4 + 3  = 10    posted-about-me, children-online, group-chats
    //     access       3 + 4 + 4  = 11    passwords, location, reading-messages
    //     permanence   4 + 3 + 3  = 10    intimate-images, not-in-writing, accounts-after-death
    //
    // so the ceiling is `access` written out, 3 + 4 + 4. The arithmetic is
    // spelled out rather than written as 11 so that adding a grounds list to a
    // block — which makes it four items — fails visibly here instead of
    // silently repacking the pages.
    //
    // Eleven gives four pages of exactly one section each, which is what the
    // bank was written for and is not a coincidence worth leaving unchecked.
    // Two conditions have to hold together. Every section must fit: 10, 10, 11,
    // 10 are all at or under 11. And every boundary must break, which needs the
    // section plus the *first block of the next one* to overrun the ceiling —
    // 10 + 3 = 13, 10 + 3 = 13, 11 + 4 = 15, each above 11. Ten fails the first
    // test (`access` splits after `location`, leaving `reading-messages` on the
    // permanence page); thirteen fails the second (`posted-about-me` packs onto
    // the end of the attention page). `sectionHeader` returns null for a page
    // whose items disagree about their section, so either failure deletes a
    // section's title and note in silence rather than drawing them wrongly.
    pageBy: "group",
    pageSize: 3 + 4 + 4,
    items: stanceItems(BLOCKS, t, { id: "digital-life", prompts: promptsFrom(t) }),
  }),
  score: (answers: Answers) => scoreStances(BLOCKS, answers),
  instructions,
  playbook,
};

export default spec;
