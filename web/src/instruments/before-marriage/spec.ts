import { stanceItems, scoreStances, cardable, type StanceReading, type StanceResult, type StancePrompts } from "@/core/stance";
import type { Answers, Channel, InstructionCard, InstrumentSpec, Playbook, T } from "@/core/types";
import { BLOCKS, PLAYBOOK_OK, PLAYBOOK_NOT_OK, type Derivation } from "./blocks";

/**
 * Fifteen stated positions, and nothing computed from them.
 *
 * There is no scoring function of its own: `scoreStances` reads the answers
 * back as positions, weights and whether a reason exists, and that is the whole
 * reading. No band, no readiness number, no verdict on whether two people
 * should marry — least of all that. See the header of `blocks.ts` for what this
 * bank refuses to collect and why.
 *
 * What this file adds to the bank is the two derivations the bank declares but
 * cannot perform: which suggested lines the reader's own answers earn, and
 * which of the fifteen go onto which instruction card.
 */

/**
 * The prompts shared by every inventory, resolved rather than keyed.
 *
 * `t` here is the instrument's scoped translator, which falls through to the
 * shell for a key the instrument does not define — so these five come from
 * `stance.*` in `src/i18n/messages/`, are written once, and read identically in
 * all eight inventories. Under the identity `t` the readability gate uses they
 * resolve to their own keys, which is what lets that gate measure them.
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
 * A malformed entry throws at module load rather than silently offering the
 * reader nothing. A playbook line that never fires is invisible — the page
 * simply has one fewer checkbox — so there is no later moment at which anybody
 * would notice.
 *
 * That matters more here than in the pilot. This bank writes its derivations in
 * reader-facing labels rather than in option values, so every `from` in
 * `blocks.ts` was transposed by hand; and this bank deliberately leaves several
 * options firing nothing, so "this option produces no line" is a state a
 * reviewer cannot tell apart from a mistranscribed value. The parser is where
 * the transposition is checked, block id and option value both, against the
 * declaration this build is running.
 */
type Fires = { block: string; values: Set<string> };

function parseFrom(from: string, id: string): Fires {
  const [left, right] = from.split("=");
  if (!left || !right) throw new TypeError(`before-marriage: playbook "${id}" has no "=" in its derivation`);
  const block = left.trim();
  if (!BLOCKS.some((b) => b.id === block)) {
    throw new TypeError(`before-marriage: playbook "${id}" derives from unknown block "${block}"`);
  }
  const values = right.split("|").map((v) => v.trim()).filter(Boolean);
  const options = BLOCKS.find((b) => b.id === block)!.options;
  for (const value of values) {
    if (!options.includes(value)) {
      throw new TypeError(`before-marriage: playbook "${id}" fires on "${block} = ${value}", which is not an option`);
    }
  }
  if (!values.length) throw new TypeError(`before-marriage: playbook "${id}" fires on no value`);
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
 * line fires on among the ones the reader chose. Twelve blocks take the first
 * branch and `grounds-to-end`, `kept-to-myself` and `household-who` take the
 * second. The array is already filtered to declared values by the scorer, so a
 * stale option from a revised bank cannot fire a line written about something
 * else.
 */
const picked = (choice: StanceReading["choice"]): readonly string[] =>
  typeof choice === "string" ? [choice] : Array.isArray(choice) ? choice : [];

/**
 * The lines this reader's own answers earn.
 *
 * A line fires when any value it names was picked; an unanswered block fires
 * nothing on either side. One line fires once however many of its values were
 * ticked — a reader who wants both most of a day alone and more than a day has
 * made one request, not two copies of it, and the id is what a tick is stored
 * against besides.
 *
 * Many options fire no line at all. Most are the bank's honest escapes, where
 * there is no sentence anybody could be held to. One is not: `final-say =
 * husband` is a real position really held, and it is silent because the only
 * sentence it yields is a rule for somebody else's behaviour, where every line
 * on this sheet is a first-person claim.
 */
const fired = (compiled: ReturnType<typeof compile>, result: StanceResult, t: T) =>
  compiled
    .filter(({ block, values }) => picked(result.stances[block]?.choice ?? null).some((value) => values.has(value)))
    .map(({ id }) => ({ id, text: t(`playbook.${id}`) }));

export function playbook(result: StanceResult, t: T): Playbook {
  return { ok: fired(OK, result, t), notOk: fired(NOT_OK, result, t) };
}

/**
 * Six cards, on the four channels this instrument declares.
 *
 * The grouping is §4 of `docs/superpowers/specs/2026-08-27-inventory-decisions.md`
 * and is deliberately not the section grouping: the sections are the order the
 * questions are *asked* in, and a card is what somebody reads off a printed
 * sheet. `who-knows` is asked under friendships and lands beside what stays
 * mine; `marriage-means` gets a card of its own because the word is the thing
 * two people most often agree on while meaning four different things by it.
 *
 * No `affection` channel, though this is the marriage instrument. The bank
 * leaves the couple's intimate life to the instruments that own it, so
 * declaring the channel anyway is how a sheet gets an empty heading.
 *
 * A card's body is the reader's own chosen labels and nothing else. There is no
 * sentence here composed on their behalf, which is the same rule the result
 * page follows: this instrument reports what was said and adds nothing to it.
 */
const CARDS: { key: string; channel: Channel; blocks: string[] }[] = [
  { key: "card.word", channel: "communication", blocks: ["marriage-means"] },
  { key: "card.mine", channel: "communication", blocks: ["who-knows", "closest-friend", "kept-to-myself"] },
  { key: "card.roof", channel: "communication", blocks: ["place-type", "parents-distance", "household-who"] },
  { key: "card.breaking", channel: "conflict", blocks: ["grounds-to-end", "final-say"] },
  { key: "card.week", channel: "rhythm", blocks: ["evenings-together", "alone-time", "holiday-apart"] },
  { key: "card.careers", channel: "work", blocks: ["career-lead", "relocation", "nights-away"] },
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
     * so by the time one exists there is nothing left in it naming the block it
     * came from. See the note on `cardable` in `core/stance.ts`. A block made
     * private in a later version has to stop producing a card without anybody
     * remembering to come back here.
     */
    const body = cardable(BLOCKS, card.blocks)
      .map((id) => {
        // The label is looked up under the block that was actually answered, so
        // the id and the value are resolved together. Filtering first and
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
  id: "before-marriage",
  version: 1,
  family: "inventory",
  /**
   * ⋈ (U+22C8), the join operator: two shapes meeting at a single point. The
   * two ring glyphs a marriage instrument would reach for first are taken —
   * `attachment` has ⚭ and `couple-conversations` ⚯ — and §7 of the decisions
   * spec picks this one rather than crowding them.
   */
  glyph: "⋈",
  /**
   * Fifteen blocks at 45 seconds each is 675 seconds, and 675 seconds is 11
   * minutes rather than 10. §6 of the decisions spec sets the unit: about 22
   * seconds to read a prompt and six options and decide, 8 for the 1–10 weight,
   * and about 15 amortised over the reasons — roughly one in four is written,
   * at roughly 45 seconds each. No grounds and no open items here, so there is
   * nothing to add to it.
   *
   * Rounded up, not down. A twelve-minute instrument advertised as six is the
   * one people abandon at block seven, and an abandoned inventory produces
   * nothing at all: there is no partial score to fall back on.
   */
  minutes: 11,
  channels: ["communication", "conflict", "rhythm", "work"],
  tier: "free",
  /**
   * Sensitive, and capped at one person.
   *
   * §3 of the decisions spec puts every inventory but the pilot here, and names
   * the block that earns it for this one: `grounds-to-end` records which broken
   * agreements a person would treat as the end of a marriage, which is a
   * disclosure rather than a preference. `who-knows` is the same shape — it
   * records who has already heard the honest version of a bad month, a fact
   * about a household rather than a wish about one.
   *
   * The cap governs the share *token* and costs nothing else: the instruction
   * sheet is local and printable, so a sheet read aloud to the person you are
   * marrying is not a URL. What the cap prevents is the forwarded link.
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
    // One block — question, weight, reason — is never split across a page
    // break, and `pageSize` is then the soft ceiling that decides how many
    // blocks share a page.
    //
    // Three blocks of three items is one section, which is the size this bank
    // was written to. `SECTIONS` is five, and the fifteen blocks fall 3, 3, 3,
    // 3, 3 across them — commitment, time, independence, careers, settling —
    // so a ceiling of nine packs exactly one section onto one page and stops.
    // No block declares `grounds`, so every block is three items and the runs
    // are even.
    //
    // The arithmetic is what makes the section copy appear at all. `paginate`
    // knows about groups and not about sections: it fills a page until the next
    // block would not fit, wherever the section changed. A ceiling of twelve
    // would put `evenings-together` on the end of the commitment page and every
    // page after it would straddle two sections; `sectionHeader` returns null
    // for a mixed page, and the section's title and the note under it would
    // vanish without anything failing. Written as `3 * 3` rather than as 9 so
    // that adding a `grounds` list to a block — which makes it four items —
    // fails visibly here instead of silently repacking the pages.
    pageBy: "group",
    pageSize: 3 * 3,
    items: stanceItems(BLOCKS, t, { id: "before-marriage", prompts: promptsFrom(t) }),
  }),
  score: (answers: Answers) => scoreStances(BLOCKS, answers),
  instructions,
  playbook,
};

export default spec;
