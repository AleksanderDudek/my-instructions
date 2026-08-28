import { stanceItems, scoreStances, compareStances, cardable, type StanceComparison, type StanceResult, type StancePrompts } from "@/core/stance";
import type { Answers, Channel, InstructionCard, InstrumentSpec, Playbook, T } from "@/core/types";
import { BLOCKS, PLAYBOOK_OK, PLAYBOOK_NOT_OK, type Derivation } from "./blocks";

/**
 * Thirteen stated positions about money, and nothing computed from them.
 *
 * There is no scoring function of its own. `scoreStances` reads the answers
 * back as positions, weights and whether a reason exists, and that is the whole
 * reading — no score, no band, no ratio, no compatibility figure. The bank's
 * header says why each of those was refused and
 * `test/instruments/contract.test.ts` is what keeps them out.
 *
 * What this file adds to the bank is the three derivations the bank declares
 * but cannot perform: which suggested lines the reader's own answers earn,
 * which blocks go onto which instruction card, and how two of these results are
 * put side by side.
 */

/**
 * The prompts shared by every inventory, resolved rather than keyed.
 *
 * `t` here is the instrument's scoped translator, which falls through to the
 * shell for a key the instrument does not define — so these five come from
 * `stance.*` in `src/i18n/messages/`, are written once, and read identically in
 * every inventory. Under the identity `t` the readability gate uses they
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
 * The bank's derivation notation, parsed once.
 *
 * `docs/banks/money-management.json` writes each playbook line's trigger as
 * prose so that the bank and `blocks.ts` can be diffed by eye. That is worth a
 * parser: the alternative is a second machine-readable copy of the same fact,
 * and two copies of a mapping are two copies that drift.
 *
 * Four shapes, all of them in the bank as it stands:
 *
 *     block → value                     the answer is that value
 *     block → value / value             the answer is one of them
 *     block without value               answered, and that value is not in it
 *     clause; clause                    both have to hold
 *
 * and a parenthetical anywhere is a note to a reader of the bank rather than
 * part of the rule, so it is stripped before anything else happens.
 *
 * A malformed entry throws at module load rather than silently offering the
 * reader nothing. A playbook line that never fires is invisible — the page
 * simply has one fewer checkbox — so there is no later moment at which anybody
 * would notice it had gone.
 */
type Clause = { block: string; values: Set<string>; negated: boolean };
type Compiled = { id: string; clauses: Clause[] };

function clause(block: string, values: string[], negated: boolean, id: string): Clause {
  const declared = BLOCKS.find((b) => b.id === block);
  if (!declared) throw new TypeError(`money-management: playbook "${id}" derives from unknown block "${block}"`);
  if (!values.length) throw new TypeError(`money-management: playbook "${id}" fires on no value of "${block}"`);
  for (const value of values) {
    if (!declared.options.includes(value)) {
      throw new TypeError(`money-management: playbook "${id}" fires on "${block} = ${value}", which is not an option`);
    }
  }
  /**
   * "without" is a statement about a set, and only a `multi` has one.
   *
   * On a `choice` the same thing is already sayable — and better said — by
   * listing the values that do fire, because "not this one" over five options
   * is four positions the author did not look at one by one. Refusing it here
   * keeps the notation from growing a second way to spell the first thing.
   */
  if (negated && declared.kind !== "multi") {
    throw new TypeError(`money-management: playbook "${id}" says "${block} without …", but "${block}" is a ${declared.kind}`);
  }
  return { block, values: new Set(values), negated };
}

function parseFrom(from: string, id: string): Clause[] {
  const rule = from.replace(/\([^)]*\)/g, " ");
  const parts = rule.split(";").map((part) => part.trim()).filter(Boolean);
  if (!parts.length) throw new TypeError(`money-management: playbook "${id}" has an empty derivation`);
  return parts.map((part) => {
    const arrow = part.indexOf("→");
    if (arrow !== -1) {
      const values = part.slice(arrow + 1).split("/").map((v) => v.trim()).filter(Boolean);
      return clause(part.slice(0, arrow).trim(), values, false, id);
    }
    const negative = /^(\S+)\s+without\s+(\S+)$/.exec(part);
    if (negative) return clause(negative[1], [negative[2]], true, id);
    throw new TypeError(`money-management: playbook "${id}" has a clause this file cannot read: "${part}"`);
  });
}

const compile = (list: readonly Derivation[]): Compiled[] =>
  list.map((d) => ({ id: d.id, clauses: parseFrom(d.from, d.id) }));

const OK = compile(PLAYBOOK_OK);
const NOT_OK = compile(PLAYBOOK_NOT_OK);

/**
 * Does one clause hold for this reader.
 *
 * A `choice` answers with one value and a `multi` with several, so both are
 * read as a list of what was picked and the two kinds need no branch below.
 *
 * **An unanswered block fires nothing, including a negative clause**, and that
 * is the whole reason this reads emptiness first. "secrecy-betrayal without
 * private-pot" is true of an empty answer in set theory and false of it in
 * English: somebody who never said which secrets they would count as a
 * betrayal has not told us that a private pot is fine, and offering their
 * partner a sentence built on that reading would put words in their mouth.
 */
const holds = (c: Clause, result: StanceResult): boolean => {
  const choice = result.stances[c.block]?.choice;
  const picked = typeof choice === "string" ? [choice] : Array.isArray(choice) ? choice : [];
  if (!picked.length) return false;
  const hit = picked.some((value) => c.values.has(value));
  return c.negated ? !hit : hit;
};

const fired = (compiled: Compiled[], result: StanceResult, t: T) =>
  compiled
    .filter(({ clauses }) => clauses.every((c) => holds(c, result)))
    .map(({ id }) => ({ id, text: t(`playbook.${id}`) }));

/**
 * The lines this reader's own answers earn.
 *
 * `ok-see-my-statements` is derived from the private block and is offered here
 * deliberately. The playbook is local: it is stored beside the run, it is
 * printed on a sheet the reader hands over themselves, and §4.4 of the design
 * keeps it out of share tokens altogether. If that ever changes, this id has to
 * be excluded by name before any line is packed — whether the sentence is
 * present or absent is itself a read on the private answer, and an inference
 * channel leaks as surely as a field does.
 */
export function playbook(result: StanceResult, t: T): Playbook {
  return { ok: fired(OK, result, t), notOk: fired(NOT_OK, result, t) };
}

/**
 * Two people, side by side — and the reason this instrument declares a
 * `compare()` where the pilot does not.
 *
 * `compareStances` takes the blocks as a required third argument, and this is
 * the instrument that argument was added for. A `StanceResult` cannot say which
 * of its blocks was private: `packAnswers` strips all three of
 * `undisclosed-debt`'s items, so a partner re-scoring a share token has no
 * answers for it and produces a reading indistinguishable from a question that
 * was skipped. Handing the blocks in is what puts it in `withheld` rather than
 * in `unanswered`, which would be a lie about a question the reader answered —
 * and the most dangerous lie of the six to tell, because the one person who
 * knows it is a lie is the one who answered it.
 *
 * There is no `Compare` component. The pairing UI for inventories is not built
 * yet and a component nothing renders is worse than none; the comparison itself
 * is correct now and is what that UI will read.
 */
export function compare(a: StanceResult, b: StanceResult): StanceComparison {
  return compareStances(a, b, BLOCKS);
}

/**
 * Five cards, on the three channels this instrument declares.
 *
 * The grouping is §4 of `docs/superpowers/specs/2026-08-27-inventory-decisions.md`
 * verbatim. It tracks the sections closely here, unlike the pilot's, and that is
 * the bank's shape rather than a shortcut: how money is held and what it is
 * being built into are both things a household *runs*, so both are `work`; the
 * threshold and the debt date and what leaves the household are all things
 * somebody has to be told, so all four are `communication`; the bad month and
 * the betrayal line are what gets reached for when it has already gone wrong.
 *
 * `undisclosed-debt` is in no group. It is the disclosure section's third
 * question and it produces nothing here, because the sheet is the artefact you
 * print and hand to somebody and the whole point of the block is that the
 * reader picks the moment themselves. A card headed "Money you have not
 * mentioned" *is* the disclosure; what it goes on to say is a detail.
 *
 * A card's body is the reader's own chosen labels and nothing else. No sentence
 * is composed on their behalf, which is the same rule the result page follows.
 */
const CARDS: { key: string; channel: Channel; blocks: string[] }[] = [
  { key: "card.held", channel: "work", blocks: ["accounts", "cost-split", "money-admin"] },
  { key: "card.building", channel: "work", blocks: ["saving-rate", "risk-response", "retirement-source"] },
  { key: "card.saying", channel: "communication", blocks: ["spend-threshold", "debt-disclosure"] },
  { key: "card.outward", channel: "communication", blocks: ["giving-share", "parent-support"] },
  { key: "card.strain", channel: "conflict", blocks: ["bad-month", "secrecy-betrayal"] },
];

/**
 * What the reader picked, under the block they picked it for.
 *
 * The label is looked up under the block that was actually answered, so the id
 * and the value are resolved together. Filtering first and re-deriving the id
 * by position is how a card ends up printing one block's answer under another
 * block's option key.
 *
 * A `multi` answers with several values and they are joined here rather than
 * dropped: "A workplace or employer scheme, My own savings and investments" is
 * the answer, and printing only the first would put a position on the sheet
 * that the reader did not take.
 */
function labelFor(id: string, result: StanceResult, t: T): string | null {
  const choice = result.stances[id]?.choice;
  if (typeof choice === "string") return t(`stance.${id}.opt.${choice}`);
  if (Array.isArray(choice) && choice.length) return choice.map((value) => t(`stance.${id}.opt.${value}`)).join(", ");
  return null;
}

export function instructions(result: StanceResult, t: T): InstructionCard[] {
  const cards: InstructionCard[] = [];
  for (const card of CARDS) {
    /**
     * `cardable` rather than the id list directly.
     *
     * No card group above names `undisclosed-debt`, so today this filter
     * returns what it was given — and it is here anyway, because the guarantee
     * it makes cannot be checked downstream. An `InstructionCard` is a channel
     * and two finished strings, so by the time one exists there is nothing left
     * in it naming the block it came from, and `registry.validate()` says as
     * much where it would otherwise be tempted to guess. The one instrument in
     * the eight that has a private block is the one that must not rely on an
     * author having remembered: a block made private in a later version, or a
     * card group edited to add one, has to stop producing a card without
     * anybody coming back here. See the note on `cardable` in `core/stance.ts`.
     */
    const body = cardable(BLOCKS, card.blocks)
      .map((id) => labelFor(id, result, t))
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
  id: "money-management",
  version: 1,
  family: "inventory",
  /**
   * U+00A4, the generic currency sign — the only money glyph in Unicode that
   * names no country's money. `$`, `€` and `zł` each pick a household, in an
   * app answered in four languages.
   */
  glyph: "¤",
  /**
   * 13 blocks × 45s = 585s, plus 6 grounds multis × 15s = 90s. 675s, which is
   * eleven minutes. The unit is §6 of the decisions spec: about 22 seconds to
   * read a prompt and six options and decide, 8 for the 1–10 weight, and about
   * 15 amortised for the reason, which roughly one reader in four writes.
   *
   * Advertised as the honest total rather than as a floor. A twelve-minute
   * instrument sold as six is the one people abandon at block seven, and an
   * abandoned inventory produces nothing at all — there is no partial score to
   * fall back on.
   */
  minutes: 11,
  channels: ["work", "communication", "conflict"],
  tier: "free",
  /**
   * `sensitive`, and capped at `partner`.
   *
   * At least one block here is a disclosure rather than a preference, and the
   * cap is what stops a forwarded link carrying it one hop further than its
   * author intended. It costs nothing that matters: the instruction sheet is
   * local and printable, so handing the thing to somebody in a room is
   * untouched by it. What is capped is the URL.
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
    /**
     * One block — question, grounds, weight, reason — is never split across a
     * page break, and `pageSize` is then the soft ceiling deciding how many
     * blocks share a page. `paginate` packs whole groups until the next one
     * would not fit, so the ceiling has to be the size of the largest section
     * for a section to fit on one page, and smaller than any section plus the
     * first block of the next one for the break to land where the subject
     * changes.
     *
     * A block is three items, or four where it takes the grounds list. This
     * bank's five sections are therefore:
     *
     *     holding      4 + 4 + 3  = 11    accounts, cost-split, money-admin
     *     disclosure   4 + 3 + 3  = 10    spend-threshold, debt-disclosure, undisclosed-debt
     *     building     3 + 4 + 3  = 10    saving-rate, risk-response, retirement-source
     *     outward      4 + 4      =  8    giving-share, parent-support
     *     strain       3 + 3      =  6    bad-month, secrecy-betrayal
     *
     * so the ceiling is `holding` written out, 4 + 4 + 3. The arithmetic is
     * spelled out rather than written as 11 so that adding a grounds list to a
     * block — which makes it four items — fails visibly here instead of
     * silently repacking the pages.
     *
     * ── The one break this cannot buy, and why it is left ──────────────
     *
     * Four of the five sections land on a page of their own at this ceiling.
     * `outward` does not. Its eight items plus `bad-month`'s three come to
     * exactly eleven, which is not *over* the ceiling, so the first question of
     * "When it goes wrong" packs onto the end of "Money that leaves the
     * household" — and `sectionHeader` draws nothing on a page whose items
     * disagree about their section, so `outward`'s title and note are the copy
     * that goes missing.
     *
     * No pageSize fixes it, and that is arithmetic rather than a judgement:
     * holding needs 11 or more to stay whole, and a break before `bad-month`
     * needs 10 or less. Every value from 6 to 40 was tried and none gives five
     * single-section pages. The section shape here is uneven — 11, 10, 10, 8, 6
     * — where the pilot's was four identical nines, and a greedy ceiling cannot
     * express "break where `section` changes" for an uneven one.
     *
     * The fix is a platform one, `pageBy: "section"` or a section break inside
     * `paginate`, and it is reported rather than made here. Eleven is chosen as
     * the value that keeps four of the five headers, against six, which keeps
     * all five at the cost of eleven pages of one or two blocks each — the
     * one-group-per-page shape `paginate`'s own header records as rejected.
     */
    pageBy: "group",
    pageSize: 4 + 4 + 3,
    items: stanceItems(BLOCKS, t, { id: "money-management", prompts: promptsFrom(t) }),
  }),
  score: (answers: Answers) => scoreStances(BLOCKS, answers),
  instructions,
  compare,
  playbook,
};

export default spec;
