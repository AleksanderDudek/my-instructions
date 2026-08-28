import { stanceItems, scoreStances, cardable, type StanceResult, type StancePrompts } from "@/core/stance";
import type { Answers, Channel, InstructionCard, InstrumentSpec, Playbook, T } from "@/core/types";
import { BLOCKS, PLAYBOOK_OK, PLAYBOOK_NOT_OK, type Derivation } from "./blocks";

/**
 * Thirteen stated positions about children, and nothing computed from them.
 *
 * There is no scoring function of its own. `scoreStances` reads the answers
 * back as positions, weights and whether a reason exists, and that is the whole
 * reading — no intended family size, no readiness figure, no forecast. The
 * refusal matters more here than in the pilot: stated intentions about children
 * are a weak predictor of achieved family size, so a number derived from these
 * thirteen answers would be a prediction the literature does not support,
 * printed with the authority of everything around it. See the header of
 * `blocks.ts`, and `test/instruments/contract.test.ts` for the assertion that
 * keeps a 1..100 out of an inventory result.
 *
 * What this file adds to the bank is the two derivations the bank declares but
 * cannot perform: which suggested lines the reader's own answers earn, and
 * which of the thirteen go onto which instruction card.
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
 * The bank's derivation notation, parsed once.
 *
 * The bank writes what fires a line in its own words so that `blocks.ts` and
 * `docs/banks/family-plan.json` can be diffed by eye. That is worth a parser:
 * the alternative is a second machine-readable copy of the same fact, and two
 * copies of a mapping are two copies that drift.
 *
 * Four operators rather than the pilot's one, because this bank derives four
 * shapes of thing. `=` and `!=` read a `choice`; `includes` and `excludes` read
 * the one `multi`. Mixing them is refused — `if-not-natural = stop` would type
 * fine, parse fine and never fire, because a multi's answer is an array and no
 * array is equal to a string.
 *
 * Both negative operators require a stated position first. "Stop me if I ever
 * smack a child" is a sentence somebody is being asked to hand to another
 * person, and firing it off an unanswered block hands them one on the strength
 * of a blank.
 *
 * A malformed entry throws at module load rather than silently offering the
 * reader nothing. A playbook line that never fires is invisible — the page
 * simply has one fewer checkbox — so there is no later moment at which anybody
 * would notice.
 */
type Operator = "=" | "!=" | "includes" | "excludes";
type Fires = { block: string; op: Operator; values: Set<string> };

const OPERATORS: readonly Operator[] = ["=", "!=", "includes", "excludes"];
/** `=` and `!=` read a single answer; `includes` and `excludes` read a set. */
const READS: Record<Operator, "choice" | "multi"> = {
  "=": "choice",
  "!=": "choice",
  includes: "multi",
  excludes: "multi",
};

function parseFrom(from: string, id: string): Fires {
  // Split on whitespace rather than matched with a pattern. The notation is
  // three fields and a list, the fields are single words, and a regular
  // expression for it would be the kind that backtracks over its own tail.
  const [block, operator, ...rest] = from.trim().split(/\s+/);
  const op = operator as Operator;
  if (!block || !OPERATORS.includes(op) || !rest.length) {
    throw new TypeError(
      `family-plan: playbook "${id}" is not "<block> <${OPERATORS.join(" | ")}> <value | value>"`,
    );
  }
  const right = rest.join(" ");
  const declared = BLOCKS.find((b) => b.id === block);
  if (!declared) throw new TypeError(`family-plan: playbook "${id}" derives from unknown block "${block}"`);
  if (declared.kind !== READS[op]) {
    throw new TypeError(
      `family-plan: playbook "${id}" uses "${op}" on "${block}", which is a ${declared.kind} and not a ${READS[op]}`,
    );
  }
  const values = right.split("|").map((v) => v.trim()).filter(Boolean);
  if (!values.length) throw new TypeError(`family-plan: playbook "${id}" fires on no value`);
  for (const value of values) {
    if (!declared.options.includes(value)) {
      throw new TypeError(`family-plan: playbook "${id}" fires on "${block} ${op} ${value}", which is not an option`);
    }
  }
  return { block, op, values: new Set(values) };
}

const compile = (list: readonly Derivation[]) =>
  list.map((d) => ({ id: d.id, ...parseFrom(d.from, d.id) }));

const OK = compile(PLAYBOOK_OK);
const NOT_OK = compile(PLAYBOOK_NOT_OK);

/**
 * Does this reader's answer to that block fire this line.
 *
 * An unanswered block fires nothing under any of the four operators, which is
 * the mechanical form of the rule this instrument turns on: "we have not
 * decided" is an answer, not a gap to be filled with a sentence somebody would
 * then be handed. The same goes for most of the escapes, which no derivation
 * names — a reader who says "I have no number in mind" is offered no line about
 * the number, because there is none they could be held to.
 */
const holds = ({ op, values }: Fires, choice: string | string[] | null | undefined): boolean => {
  if (READS[op] === "choice") {
    if (typeof choice !== "string") return false;
    return op === "=" ? values.has(choice) : !values.has(choice);
  }
  if (!Array.isArray(choice) || choice.length === 0) return false;
  const any = choice.some((value) => values.has(value));
  return op === "includes" ? any : !any;
};

const fired = (compiled: ReturnType<typeof compile>, result: StanceResult, t: T) =>
  compiled
    .filter((rule) => holds(rule, result.stances[rule.block]?.choice))
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
 * sheet. The plan section splits in two here — the number, the timing and the
 * gap go on a communication card, while `if-not-natural` gets a card of its own
 * on `affection`, because the person reading that one is not looking up a plan.
 * And "Raising", asked last but one, lands beside the number on
 * `communication`, because both are things you say rather than things you do.
 *
 * A card's body is the reader's own chosen labels and nothing else. There is no
 * sentence here composed on their behalf, which is the same rule the result
 * page follows: this instrument reports what was said and adds nothing to it.
 */
const CARDS: { key: string; channel: Channel; blocks: string[] }[] = [
  { key: "card.number", channel: "communication", blocks: ["children-ceiling", "timing-gate", "child-spacing"] },
  { key: "card.raising", channel: "communication", blocks: ["schooling", "discipline", "screens", "grandparents"] },
  { key: "card.if-not-natural", channel: "affection", blocks: ["if-not-natural"] },
  { key: "card.care", channel: "work", blocks: ["who-steps-back", "time-at-home", "childcare"] },
  { key: "card.disagreement", channel: "conflict", blocks: ["parent-deadlock", "change-of-mind"] },
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
     * remembering to come back here, and `if-not-natural` is the one on this
     * page that could plausibly become it.
     */
    const body = cardable(BLOCKS, card.blocks)
      .map((id) => {
        const choice = result.stances[id]?.choice;
        // The label is looked up under the block that was actually answered, so
        // the id and the value are resolved together. Filtering first and
        // re-deriving the id by position is how a card ends up printing one
        // block's answer under another block's option key.
        //
        // The array branch is `if-not-natural`, the only `multi` here. Its
        // picks are joined with a comma inside the block and the blocks with a
        // middle dot between them, so a card carrying several answers still
        // reads as several answers.
        if (Array.isArray(choice)) {
          const picked = choice.map((value) => t(`stance.${id}.opt.${value}`));
          return picked.length ? picked.join(", ") : null;
        }
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
  id: "family-plan",
  version: 1,
  family: "inventory",
  glyph: "∴",
  minutes: 10,
  channels: ["communication", "affection", "work", "conflict"],
  tier: "free",
  /**
   * `sensitive`, and capped at `partner`.
   *
   * `if-not-natural` is the block that earns both. An answer to it is a
   * disclosure rather than a preference — WHO's 2023 review put lifetime
   * prevalence of infertility at roughly one adult in six, so it is not a
   * hypothetical for a large minority of the people who will read it — and a
   * share token saying somebody would stop rather than pursue treatment is not
   * a thing that should travel one hop further than its author intended. The
   * cap governs the *link* and costs nothing else: the instruction sheet is
   * local and printable, so handing this to the person it concerns needs no URL
   * at all. The reasons are private wherever they are written; that is a
   * property of the item kind and not a decision this file gets to make.
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
    // Nothing is required. A position somebody has not taken is a real answer —
    // on this page more than any other — and a form that will not advance
    // without one collects a guess about a child.
    optional: true,
    // One block — question, weight, reason — is never split across a page
    // break, and `pageSize` is then the soft ceiling that decides how many
    // blocks share a page.
    //
    // ── The arithmetic, and why it comes out at one ────────────────────
    //
    // Thirteen blocks of three items each, in four sections of 4, 3, 4 and 2
    // blocks — so 12, 9, 12 and 6 items. The pilot's four sections are three
    // blocks each and its ceiling is `3 * 3`, one section to a page. That
    // cannot be done here, and the reason is arithmetic rather than taste.
    //
    // `paginate` packs groups onto a page until the next one would not fit. A
    // page holding the four blocks of "The plan" therefore needs a ceiling of
    // at least 12; and for the three blocks of "Work and who is at home" to end
    // a page, the first block of "Raising" must not fit beside them, which
    // needs 9 + 3 > pageSize — a ceiling below 12. No number is both.
    //
    // So every ceiling from 6 upwards puts at least one page across two
    // sections, and a page that straddles two sections draws no header at all:
    // `sectionHeader` returns null rather than caption questions it does not
    // describe, so the title and the note simply vanish for that page. At 6, 7
    // and 8 two pages of thirteen questions arrive under no heading; at 9 to
    // 14 the reader never sees the note on "Work and who is at home" or the
    // one on "Raising" at all; at 15 no section copy renders anywhere.
    //
    // Three to five is the only range where no page is ever mixed, and inside
    // it the ceiling is one block. Thirteen pages rather than four is the
    // price, and on this bank it is the right way round: these are thirteen
    // questions a person answers slowly, and the section note above each of
    // them — "every question in this section has an honest answer that is «not
    // decided»" — is the sentence that keeps an undecided answer from reading
    // as a failure to answer. Losing it on any page is the expensive mistake
    // here.
    //
    // Written as `1 * 3` rather than as `3` so that adding a `grounds` list to
    // a block — which makes it four items — fails visibly here instead of
    // silently repacking the pages.
    pageBy: "group",
    pageSize: 1 * 3,
    items: stanceItems(BLOCKS, t, { id: "family-plan", prompts: promptsFrom(t) }),
  }),
  score: (answers: Answers) => scoreStances(BLOCKS, answers),
  instructions,
  playbook,
};

export default spec;
