import { stanceItems, scoreStances, cardable, type StanceResult, type StancePrompts } from "@/core/stance";
import type { Answers, InstructionCard, InstrumentSpec, Playbook, T } from "@/core/types";
import { BLOCKS, PLAYBOOK_OK, PLAYBOOK_NOT_OK, type Derivation } from "./blocks";

/**
 * Twelve stated positions, and nothing computed from them.
 *
 * There is no scoring function of its own: `scoreStances` reads the answers
 * back as positions, weights, grounds and whether a reason exists, and that is
 * the whole reading. There is no band, no axis, no tally, no devoutness figure
 * and no orthodoxy figure — see the header of `blocks.ts` for why each was
 * refused, and `test/instruments/contract.test.ts` for the assertion that keeps
 * a 1..100 number out of an inventory entirely.
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
 * `block = value | value`, or `block ≠ value`, parsed once.
 *
 * The bank writes its derivations in its own notation so that `blocks.ts` and
 * `docs/banks/faith.json` can be diffed by eye. That is worth a parser: the
 * alternative is a second machine-readable copy of the same fact, and two
 * copies of a mapping are two copies that drift.
 *
 * The negation is the bank's, not an embellishment. `notok-baptism-without-me`
 * arrives here from `family-plan` under §1.2 of the inventory decisions, where
 * it was scoped to "any answer but the undecided one" — a line every reader who
 * has taken a position on a child's formation should get, and that the reader
 * who has not taken one should not. Writing it as five positive alternatives
 * would say the same thing today and quietly stop saying it the day an option
 * is added to the block.
 *
 * A malformed entry throws at module load rather than silently offering the
 * reader nothing. A playbook line that never fires is invisible — the page
 * simply has one fewer checkbox — so there is no later moment at which anybody
 * would notice.
 */
type Fires = { block: string; values: Set<string>; negated: boolean };

function parseFrom(from: string, id: string): Fires {
  const negated = from.includes("≠");
  const [left, right] = from.split(negated ? "≠" : "=");
  if (!left || !right) throw new TypeError(`faith: playbook "${id}" has no "=" or "≠" in its derivation`);
  const block = left.trim();
  const declared = BLOCKS.find((b) => b.id === block);
  if (!declared) throw new TypeError(`faith: playbook "${id}" derives from unknown block "${block}"`);
  const values = right.split("|").map((v) => v.trim()).filter(Boolean);
  for (const value of values) {
    if (!declared.options.includes(value)) {
      throw new TypeError(`faith: playbook "${id}" fires on "${block} ${negated ? "≠" : "="} ${value}", which is not an option`);
    }
  }
  if (!values.length) throw new TypeError(`faith: playbook "${id}" fires on no value`);
  return { block, values: new Set(values), negated };
}

const compile = (list: readonly Derivation[]) =>
  list.map((d) => ({ id: d.id, ...parseFrom(d.from, d.id) }));

const OK = compile(PLAYBOOK_OK);
const NOT_OK = compile(PLAYBOOK_NOT_OK);

/**
 * What this reader actually picked, as a list, whichever kind the block is.
 *
 * Three of the twelve are `multi`, so a stance's `choice` is a string on nine
 * blocks and an array on three. Reading only the string kind would have dropped
 * four playbook lines and three instruction cards without anything failing.
 */
const picked = (result: StanceResult, id: string): string[] => {
  const choice = result.stances[id]?.choice;
  if (typeof choice === "string") return [choice];
  return Array.isArray(choice) ? choice : [];
};

/**
 * The lines this reader's own answers earn.
 *
 * An unanswered block fires nothing on either side, and that is true of the
 * negation too: "any answer but undecided" is a statement about an answer, and
 * a reader who skipped the question has not made it. A line handed to somebody
 * who declined the question is a line derived from nothing, which is the one
 * thing §4.1 says a suggestion may not be.
 */
const fired = (compiled: ReturnType<typeof compile>, result: StanceResult, t: T) =>
  compiled
    .filter(({ block, values, negated }) => {
      const chosen = picked(result, block);
      if (!chosen.length) return false;
      const hit = chosen.some((value) => values.has(value));
      return negated ? !hit : hit;
    })
    .map(({ id }) => ({ id, text: t(`playbook.${id}`) }));

export function playbook(result: StanceResult, t: T): Playbook {
  return { ok: fired(OK, result, t), notOk: fired(NOT_OK, result, t) };
}

/**
 * Six cards, on the three channels this instrument declares.
 *
 * The grouping is §4 of `docs/superpowers/specs/2026-08-27-inventory-decisions.md`
 * and is deliberately not the section grouping: the sections are the order the
 * questions are *asked* in, and a card is what somebody reads off a printed
 * sheet. `prayer-last` is asked under practice and lands on the rhythm card
 * beside `work-rest`, because the person holding the sheet is looking up what
 * of this person's week is already spoken for.
 *
 * A card's body is the reader's own chosen labels and nothing else — the
 * position, and the grounds under it in brackets. There is no sentence here
 * composed on their behalf and nothing added up, which is the same rule the
 * result page follows.
 */
const CARDS: { key: string; channel: "communication" | "rhythm" | "conflict"; blocks: string[] }[] = [
  { key: "card.holds", channel: "communication", blocks: ["god", "after-death", "suffering"] },
  { key: "card.belong", channel: "communication", blocks: ["belonging", "raised-vs-now"] },
  { key: "card.passed-on", channel: "communication", blocks: ["children-taught", "funeral", "money-use"] },
  { key: "card.kept-clear", channel: "rhythm", blocks: ["work-rest", "prayer-last"] },
  { key: "card.no-give", channel: "conflict", blocks: ["non-negotiable"] },
  { key: "card.still-open", channel: "conflict", blocks: ["unsettled"] },
];

/**
 * One block on a sheet: what was answered, and what the reader said it rests on.
 *
 * The grounds are on the card rather than only on the result page because they
 * are half of what the person holding the sheet needs. "Nothing religious of
 * any kind" resting on `upbringing` and the same answer resting on `reason` are
 * two different people to stand next to at a funeral, and the sheet is what
 * somebody has in their hand on the day.
 */
const said = (result: StanceResult, id: string, t: T): string | null => {
  const chosen = picked(result, id);
  if (!chosen.length) return null;
  // The labels are looked up under the block that was actually answered, so
  // the id and the value are resolved together. Re-deriving the id by position
  // is how a card ends up printing one block's answer under another's key.
  const answer = chosen.map((value) => t(`stance.${id}.opt.${value}`)).join(", ");
  const grounds = result.stances[id]?.grounds ?? [];
  if (!grounds.length) return answer;
  // Flat by value, never by block: "scripture" has to be the same word under
  // every question or two answers cannot be read as the same ground.
  return `${answer} (${grounds.map((value) => t(`stance.grounds.${value}`)).join(", ")})`;
};

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
      .map((id) => said(result, id, t))
      .filter((line): line is string => line !== null)
      .join(" · ");
    // A card with nothing in it is a heading on somebody's sheet with a blank
    // under it, which reads as a thing they failed to do rather than a thing
    // they declined to say.
    if (body) cards.push({ channel: card.channel, title: t(card.key), body });
  }
  return cards;
}

export const spec: InstrumentSpec<StanceResult> = {
  id: "faith",
  version: 1,
  family: "inventory",
  /**
   * ☼, U+263C, and the argument is in §7 of the decisions spec.
   *
   * Every obvious glyph for faith names a religion — ✝, ☪, ✡, ☸ — and this
   * instrument has to be answerable without insult by somebody who has never
   * held one. A sun is the least sectarian mark in a block the app already
   * renders, and it is one monochrome character with no variation selector,
   * which is the register the other twenty-three are in.
   */
  glyph: "☼",
  /**
   * Twelve, and the arithmetic is §6's: 12 blocks × 45s = 540s, plus 15s for
   * each block's grounds multi = 720s. The honest total rather than a floor. A
   * twelve-minute instrument advertised as six is the one people abandon at
   * block seven, and an abandoned inventory produces nothing at all — there is
   * no partial score to fall back on, because there is no score.
   */
  minutes: 12,
  channels: ["communication", "rhythm", "conflict"],
  tier: "free",
  /**
   * `sensitive`, capped at `partner`, per §3 of the decisions spec.
   *
   * `unsettled` is the block that earns it: a reader ticking "whether I believe
   * it or only keep the habit" has made a disclosure, and the cap is what stops
   * a forwarded link carrying it one hop further than its author intended. The
   * cap costs nothing the instrument is for — the instruction sheet is local
   * and printable, so handing this to the person who would have to arrange the
   * funeral is not a URL.
   *
   * Nothing is capped tighter and nothing is `private`. A private block costs
   * the two-person comparison a `withheld` case, and they are spent one at a
   * time; the one across the eight banks went to `money-management`.
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
    // and a form that will not advance without one collects a guess. It matters
    // more here than anywhere: three of these twelve are the questions a person
    // is most often asked to have an answer to and most often does not.
    optional: true,
    /**
     * One block is one page, and the arithmetic is `1 * 4`.
     *
     * A block here is four items — the question, the grounds, the weight and
     * the reason — because every one of the twelve carries grounds. The pilot
     * writes `3 * 3` for three three-item blocks, which is one of its sections;
     * the same trick does not survive this bank's shape, and the reason is
     * worth writing down rather than rediscovering.
     *
     * `pageSize` is a soft ceiling: groups are packed onto a page until the
     * next one would not fit. The sections here are 3, 2, 3, 2 and 2 blocks —
     * 12, 8, 12, 8 and 8 items. For a three-block section to survive whole the
     * ceiling must be at least 12; at 12 a two-block section has 4 items of
     * room left and swallows the first block of the *next* section, which is a
     * page straddling two sections, which renders no header at all. So the
     * section copy — five paragraphs, written and critiqued in the bank —
     * disappears from exactly the pages that most need it, silently. No single
     * ceiling can hold sections of two and three blocks apart, and 4 is the
     * largest that never straddles: every page is one block, every page is
     * inside one section, and every page keeps its heading.
     *
     * The cost is honest and small. Twelve pages rather than five, each of
     * which is a real screenful — six options, seven grounds, a ten-point
     * rating and a text box — and a section's heading and note stand over each
     * of its blocks instead of over the group. What is bought is that no
     * question is ever asked under the wrong heading or under none.
     */
    pageBy: "group",
    pageSize: 1 * 4,
    items: stanceItems(BLOCKS, t, { id: "faith", prompts: promptsFrom(t) }),
  }),
  score: (answers: Answers) => scoreStances(BLOCKS, answers),
  instructions,
  playbook,
};

export default spec;
