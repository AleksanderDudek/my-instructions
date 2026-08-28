import { stanceItems, scoreStances, cardable, type StanceReading, type StanceResult, type StancePrompts } from "@/core/stance";
import type { Answers, Channel, InstructionCard, InstrumentSpec, Item, Playbook, T } from "@/core/types";
import { BLOCKS, OPEN_ITEMS, OPEN_SECTION, PLAYBOOK_OK, PLAYBOOK_NOT_OK, type Derivation } from "./blocks";

/**
 * Twelve stated positions, four open questions, and nothing computed from any
 * of them.
 *
 * There is no scoring function of its own: `scoreStances` reads the answers
 * back as positions, weights and whether a reason exists, and that is the whole
 * reading. No band, no wellbeing number, no percentage of a good life achieved.
 * See the header of `blocks.ts` for why the one output this subject invites is
 * the one it cannot survive.
 *
 * What this file adds to the bank is three things the bank declares but cannot
 * perform: which suggested lines the reader's own answers earn, which of the
 * twelve go onto which instruction card, and the concatenation below.
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
 * The four `text` items, written out rather than expanded.
 *
 * `stanceItems` grows a `choice` or a `multi` into a triad and knows how to do
 * nothing else, so the one instrument in the eight with questions that have no
 * closed answer concatenates. `docs/banks/OUTSTANDING.md` §3 is the record that
 * this needs no platform change and that nobody should go looking for a
 * mechanism: the only rule these items have to obey is one `validate()` already
 * enforces on every `text` item in the app.
 *
 * `tier: "private"` is therefore not a decision made here. It is the property
 * of the kind — free text is the only answer in this app whose contents nobody
 * has reviewed, and a letter to yourself at seventy is the clearest case of it
 * in the catalogue. `packAnswers` strips on the tier, so these four are absent
 * from a share token rather than hidden by the page that renders them, and
 * `registry.validate()` refuses the item outright if the tier is ever dropped.
 *
 * No `group`, and that is load-bearing rather than tidy. Each is one question
 * with one answer and nothing derived from it, so `paginate` keys it on its own
 * id and treats it as a run of one. A `group` would be a claim that the item is
 * part of a block — and `test/instruments/contract.test.ts` reads it as exactly
 * that, requiring a `<group>.why` for every group in an inventory's form. There
 * is no reason box under a letter to yourself at seventy, because the letter is
 * the reason.
 *
 * The prompt key is `item.<id>` rather than `stance.<id>.prompt`, which is the
 * shape every other instrument uses for a bare item and is what keeps a letter
 * to yourself at seventy from reading, to a drift check, as a stray block whose
 * block went missing.
 */
const openItems = (t: T): Item[] =>
  OPEN_ITEMS.map((item) => ({
    id: item.id,
    kind: "text",
    section: OPEN_SECTION,
    tier: "private",
    prompt: t(`item.${item.id}`),
    rows: item.rows,
  }));

/**
 * `block = value | value`, parsed once.
 *
 * The bank writes its derivations in its own notation so that `blocks.ts` and
 * `docs/banks/good-life.json` can be diffed by eye. That is worth a parser: the
 * alternative is a second machine-readable copy of the same fact, and two
 * copies of a mapping are two copies that drift.
 *
 * A malformed entry throws at module load rather than silently offering the
 * reader nothing. A playbook line that never fires is invisible — the page
 * simply has one fewer checkbox — so there is no later moment at which anybody
 * would notice.
 */
type Fires = { block: string; values: Set<string> };

function parseFrom(from: string, id: string): Fires {
  const [left, right] = from.split("=");
  if (!left || !right) throw new TypeError(`good-life: playbook "${id}" has no "=" in its derivation`);
  const block = left.trim();
  if (!BLOCKS.some((b) => b.id === block)) {
    throw new TypeError(`good-life: playbook "${id}" derives from unknown block "${block}"`);
  }
  const values = right.split("|").map((v) => v.trim()).filter(Boolean);
  const options = BLOCKS.find((b) => b.id === block)!.options;
  for (const value of values) {
    if (!options.includes(value)) {
      throw new TypeError(`good-life: playbook "${id}" fires on "${block} = ${value}", which is not an option`);
    }
  }
  if (!values.length) throw new TypeError(`good-life: playbook "${id}" fires on no value`);
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
 * line fires on among the ones the reader chose. Eight blocks take the first
 * branch and four take the second. The array is already filtered to declared
 * values by the scorer, so a stale option from a revised bank cannot fire a
 * line that was written about something else.
 */
const picked = (choice: StanceReading["choice"] | undefined): readonly string[] =>
  typeof choice === "string" ? [choice] : Array.isArray(choice) ? choice : [];

/**
 * The lines this reader's own answers earn.
 *
 * A line fires when any value it names was picked; an unanswered block fires
 * nothing on either side. One line fires once however many of its values were
 * ticked, and the id is what a tick is stored against besides.
 *
 * The four open items reach none of this. They are not blocks, they are not in
 * the result, and there is no derivation that could name one — which is the
 * point: a suggested sentence built out of what somebody wrote in a letter to
 * themselves at seventy would be the app quoting a private answer onto a page
 * whose whole purpose is to be handed to somebody else.
 */
const fired = (compiled: ReturnType<typeof compile>, result: StanceResult, t: T) =>
  compiled
    .filter(({ block, values }) => picked(result.stances[block]?.choice).some((value) => values.has(value)))
    .map(({ id }) => ({ id, text: t(`playbook.${id}`) }));

export function playbook(result: StanceResult, t: T): Playbook {
  return { ok: fired(OK, result, t), notOk: fired(NOT_OK, result, t) };
}

/**
 * Six cards, on the four channels this instrument declares.
 *
 * The grouping is §4 of `docs/superpowers/specs/2026-08-27-inventory-decisions.md`
 * verbatim, and it is deliberately not the section grouping: the sections are
 * the order the questions are *asked* in, and a card is what somebody reads off
 * a printed sheet. `regret-most` is asked last, under "Looking back from
 * seventy", and lands beside `keep-one` and `owe-others` on one card, because
 * the person holding the sheet is looking up what this person will not trade
 * rather than working through it in the order it was answered.
 *
 * This is the only instrument in the eight to use `energy`, which is the honest
 * outcome for a family of instruments about positions rather than states: one
 * block asks what is already being given up to stay healthy, and there is no
 * second question in the catalogue about what a week costs a body.
 *
 * The four open items produce nothing here, and the mechanism is that they were
 * never candidates — `instructions()` builds from block ids, and they are not
 * blocks. §4 spends one clause on it («`openItems` produce no cards») because
 * the sheet is the artefact you print and hand over, and «What are you
 * avoiding?» is a question whose answer belongs to the person who wrote it.
 *
 * A card's body is the reader's own chosen labels and nothing else. There is no
 * sentence here composed on their behalf, which is the same rule the result
 * page follows: this instrument reports what was said and adds nothing to it.
 */
const CARDS: { key: string; channel: Channel; blocks: string[] }[] = [
  { key: "card.work", channel: "work", blocks: ["work-purpose", "learn-next"] },
  { key: "card.money", channel: "work", blocks: ["money-for", "enough-point", "risk-appetite"] },
  { key: "card.health", channel: "energy", blocks: ["health-effort"] },
  { key: "card.less", channel: "rhythm", blocks: ["less-of"] },
  { key: "card.place", channel: "communication", blocks: ["live-where", "who-near"] },
  { key: "card.keep", channel: "communication", blocks: ["keep-one", "owe-others", "regret-most"] },
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
        const chosen = picked(result.stances[id]?.choice);
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
  id: "good-life",
  version: 1,
  family: "inventory",
  glyph: "△",
  /**
   * Twelve minutes, which is the honest total and not a floor.
   *
   * §6 of the decisions spec: 45 seconds a stance block — 22 to read a prompt
   * and six options and decide, 8 for the weight, and about 15 amortised for
   * the `why`, which is optional and mostly left empty — plus 45 for each open
   * text box, which is the point of the instrument that has them. So
   * 12 × 45 + 4 × 45 = 720 seconds. A twelve-minute instrument advertised as
   * six is the one people abandon at block seven, and an abandoned inventory
   * produces nothing at all: there is no partial score to fall back on.
   */
  minutes: 12,
  channels: ["work", "energy", "rhythm", "communication"],
  tier: "free",
  /**
   * Sensitive, and capped at one person — and the block that earns it is not a
   * block.
   *
   * §3 of the decisions spec puts every inventory but the pilot here and names
   * what does it for each. For this one it is `open-avoid`: «What are you
   * avoiding?» is the one question in the eight banks whose answer is an
   * admission the reader is making to themselves. It is already private by its
   * kind, so the flag is not what protects it — the flag is about the closed
   * twelve, which describe where somebody wants to live, what they would risk,
   * and who they would stay for.
   *
   * The cap governs the share *token* and costs nothing else: the instruction
   * sheet is local and printable, so a good-life sheet read to a spouse is not
   * a URL. What the cap prevents is the forwarded link.
   *
   * `maxAudience: "private"` was the candidate and is refused, because the
   * finer instrument already exists. The four open items carry `tier: "private"`
   * per item, so the letter to yourself at seventy never enters a token
   * whatever the audience is, while "In ten years, where do you want to be
   * living?" stays shareable with the person you would be living with.
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
    // and a form that will not advance without one collects a guess. The four
    // open items would not block in any case: `text` never does, item by item,
    // whatever this flag says.
    optional: true,
    /**
     * One block — question, weight, reason — is never split across a page
     * break, and `pageSize` is then the soft ceiling deciding how many blocks
     * share a page. `paginate` packs whole groups until the next one would not
     * fit, wherever the section happened to change, and `sectionHeader` returns
     * null for a page whose items disagree about their section. So a ceiling
     * chosen wrongly here does not misalign anything — it silently deletes a
     * section's title and the sentence under it.
     *
     * A block is three items and an open question is one, so the seven sections
     * are:
     *
     *     work    3 + 3          =  6    work-purpose, learn-next
     *     money   3 + 3 + 3      =  9    money-for, enough-point, risk-appetite
     *     place   3 + 3          =  6    live-where, who-near
     *     week    3 + 3          =  6    health-effort, less-of
     *     keep    3 + 3          =  6    keep-one, owe-others
     *     later   3              =  3    regret-most
     *     open    1 + 1 + 1 + 1  =  4    the four with no options
     *
     * and one block per page is the only ceiling that never straddles. The
     * arithmetic is spelled out as `1 * 3` rather than written as 3 so that
     * adding a `grounds` list to a block — which makes it four items — fails
     * visibly here instead of silently repacking the pages.
     *
     * Every larger value was tried and each breaks in a different place. Nine
     * or more puts `money-for` on the end of the work page, because 6 + 3 is
     * exactly 9. Six, seven or eight leaves `risk-appetite` alone on a page
     * with 3 items and then packs `live-where` beside it. Four or five gives
     * every block its own page — two blocks are 6, which overruns them both —
     * but then finds room for one more item at the end of the `later` page, and
     * the item is the letter to yourself at seventy: the reader would meet it
     * under no heading at all, immediately after being asked what they would
     * regret. Below three the ceiling is a fiction, because a run of three
     * overruns it and takes a page of its own anyway.
     *
     * The cost is fourteen pages where the pilot has four, and the reader meets
     * a repeated heading rather than a missing one — three pages under "Money,
     * and where enough is", two under "Open space", which is where the four
     * one-item groups fall as 3 + 1. A heading repeated is true every time it
     * is drawn.
     */
    pageBy: "group",
    pageSize: 1 * 3,
    /**
     * The concatenation this instrument exists to demonstrate.
     *
     * `stanceItems` expands the twelve; the four open questions are written out
     * by hand above and follow them. Order is load-bearing rather than
     * cosmetic: `paginate` walks the array as given, so the open items have to
     * arrive after every block for the closing section to be a closing section.
     */
    items: [...stanceItems(BLOCKS, t, { id: "good-life", prompts: promptsFrom(t) }), ...openItems(t)],
  }),
  /**
   * The blocks, and only the blocks.
   *
   * The four open answers are not filtered out of the result — they were never
   * candidates for it, because `scoreStances` walks the declaration it is
   * handed and `BLOCKS` does not contain them. That is the first of the three
   * promises the copy makes about them: never scored, never compared, never
   * shared. The second is `compareStances`, which walks the same list. The
   * third is `tier: "private"` and `packAnswers`.
   *
   * The sentences stay in `answers`, which is local, and `View.tsx` is the one
   * component that reads them.
   */
  score: (answers: Answers) => scoreStances(BLOCKS, answers),
  instructions,
  playbook,
};

export default spec;
