/**
 * Stated positions: the question, its weight, and the reason.
 *
 * Every scored instrument in this app estimates something about a person from
 * behind an item bank with no norms, and says so at length in its
 * `sourceNote`. An inventory does not estimate anything. It records a position
 * the person states, how much weight they put on it, and the reason they give
 * — so nothing is inferred, and nothing has to be defended. That makes it the
 * strongest thing in the app epistemically and the weakest psychometrically,
 * and this module is where both facts are cashed out in code.
 *
 * One declared block expands into three or four items. The declaration lives
 * in the instrument; the shape of the expansion lives here, so that a triad is
 * assembled identically in eight folders and cannot drift into seven variants
 * of nearly the same thing.
 *
 * ── Why the free text is private, always, without an opt-out ──────────
 *
 * The report layer already has `tier: "private"`, which keeps an item out of
 * every share token (`core/report.ts`, `privateIdsOf`). The `why` uses it and
 * the instrument author does not get to choose.
 *
 * Free text is the only answer in this app whose contents nobody has reviewed.
 * A closed option is a word we wrote; a rating is a number. A `why` can contain
 * a third party's name, a diagnosis, a confession or an address, and the person
 * writing it is thinking about the question rather than about who might read
 * the URL in a year. The rule the codebase already lives by is that withheld
 * content is *absent from the link* rather than hidden by the page that renders
 * it — so this is not a setting, it is a property of the item kind. The words
 * come back on the reader's own result page and their own instruction sheet,
 * both of which are local. They never enter a token.
 *
 * ── And why one whole block can be private too ────────────────────────
 *
 * `why` is private in every block. A block that declares `private` is private
 * *entire* — question, grounds, weight and reason — because a block whose
 * subject makes the question itself an admission cannot be half-withheld. The
 * argument is on the field, and it is the reason the field is not called
 * `privateAnswer`. Two things follow it out of this module: `compareStances`
 * files such a block under `withheld` and nowhere else, and `cardable` keeps it
 * off the instruction sheet.
 *
 * ── Why the weight question earns its place ───────────────────────────
 *
 * It is not decoration and it is not engagement. It is the only field in the
 * block that makes a two-person comparison say something neither person could
 * have worked out alone.
 *
 * Two people who answer a question differently and both rate it 9 have found
 * the thing worth an evening. Two who answer differently and rate it 2 and 3
 * have found nothing. One at 10 and one at 2 have found an asymmetry, which is
 * a different and often more useful discovery than a disagreement — it means
 * one of them has been conceding something the other did not know was being
 * conceded. Without the weight, a stated-position inventory produces two lists
 * side by side and leaves the reader to do the work. With it, it produces an
 * agenda ordered by stakes.
 */
import type { Answers, Item, Option, T } from "./types";

export type StanceBlock = {
  id: string;
  kind: "choice" | "multi";
  /** Option value ids. Every word lives in the message table, never here. */
  options: string[];
  /** `multi` only: how many may be picked. */
  max?: number;
  /**
   * `multi` only: the option values that mean *none of the others*.
   *
   * Rule 6 of the item-writing rules asks every option set for an honest way
   * out — "nothing at the moment", "I have not thought about it", "it touches
   * none of my money". A `choice` gives that away for free; a `multi` does not,
   * and a reader who can hold "nothing at the moment" alongside three
   * commitments has been handed a contradiction to state about themselves. The
   * block names the escape and the control enforces it. See `MultiItem`.
   */
  exclusive?: string[];
  /**
   * The optional fourth part: what the position *rests on*.
   *
   * "Why does this matter to you" is about weight and biography. "What does it
   * rest on" is about authority — scripture, the teaching of the church, reason,
   * personal experience, upbringing, the people you trust. Closed options
   * rather than more free text, because the whole point is that a person can
   * hold two positions of equal strength on completely different grounds, and
   * that pattern is legible only if the grounds are comparable across
   * questions.
   */
  grounds?: string[];
  /**
   * The same escape, for the grounds multi.
   *
   * It is a second field rather than a shared one because the two option sets
   * are unrelated: the question's escape is a value of `options`, the grounds'
   * is a value of `grounds`, and one list that had to serve both would be
   * checked against neither. "I have not worked that out" is the ground this
   * exists for — a real answer given by a great many people who hold the belief
   * anyway, and one that cannot be true beside "scripture".
   */
  groundsExclusive?: string[];
  section?: string;
  /** Rare. An item that genuinely carries no weight question. */
  skipWeight?: boolean;
  /**
   * The whole block is withheld — not the answer, the *block*.
   *
   * For the one kind of question where the asking is itself an admission.
   * `money-management.undisclosed-debt` is the only one in the eight banks, and
   * its `sourceNote` makes the reader a promise: the answer never leaves this
   * device, is never in a share link, and is never asked for as an amount. All
   * four derived items therefore carry `tier: "private"`, which is what
   * `packAnswers` strips against, so nothing about the block travels.
   *
   * It is `private` and not `privateAnswer` because half-privacy is worse than
   * none, and this is the whole reason the field is shaped this way. A token
   * that omits the answer and carries `undisclosed-debt.weight = 9` has told
   * the reader exactly what the omission was withholding: nobody rates a
   * question they have nothing to declare at nine, so the number announces the
   * one thing the person meant to keep back — and announces it to somebody who
   * now knows there is something to ask about. The grounds leak the same way,
   * only in words. Redaction that leaves the weight behind is a black bar with
   * the shape of the word still legible through it, and the person who drew it
   * believed they had said nothing.
   *
   * Because the whole block is absent from a share token, the fact that it is
   * private is unrecoverable from a `StanceResult` on the receiving side. That
   * is why `compareStances` takes the blocks; see `withheld`.
   */
  private?: true;
};

/**
 * The two most-read sentences in the feature, already resolved.
 *
 * They are shell copy — `stance.weightPrompt` and `stance.whyPrompt` — because
 * eight instruments asking "how important is this to you?" in eight message
 * files is eight chances for one of them to ask it slightly differently, and a
 * reader who notices the difference will look for a meaning in it.
 *
 * They arrive here as *resolved strings* rather than as keys, and the choice is
 * deliberate. The `t` an instrument's `form()` receives is scoped to that
 * instrument, and whether a scoped `t` falls through to the shell table for an
 * unclaimed key is a property of `core/i18n.ts` that this module has no
 * business knowing. Taking finished strings means `stance.ts` holds no opinion
 * about scoping at all: the caller resolves what it wants, from wherever it
 * wants, and the readability gate still sees a message key when `form()` is
 * called with an identity translator.
 */
export type StancePrompts = {
  weight: string;
  why: string;
  weightLow: string;
  weightHigh: string;
  whyPlaceholder: string;
};

export const WEIGHT_MIN = 1;
export const WEIGHT_MAX = 10;

/** Message keys a block's own words are looked up under. */
const promptKey = (block: StanceBlock) => `stance.${block.id}.prompt`;
const optionKey = (block: StanceBlock, value: string) => `stance.${block.id}.opt.${value}`;
const groundsPromptKey = (block: StanceBlock) => `stance.${block.id}.groundsPrompt`;
/**
 * Grounds are looked up under one flat key per value, *not* per block. That is
 * the point of them: "scripture" has to be the same word in every block, or
 * two answers cannot be read as the same ground.
 */
const groundsOptionKey = (value: string) => `stance.grounds.${value}`;

/**
 * Expand blocks into a bank.
 *
 * Order within a block is question, grounds, weight, reason — the order a
 * person actually thinks in. Every item carries `group: block.id`, which is
 * what lets the runner keep a triad on one screen and lets a test find the
 * parts of a block without knowing what the block declared.
 *
 * `opts.id` names the instrument and is used only in diagnostics. A thrown
 * message that says which of eight folders declared a duplicate block is worth
 * the parameter; deriving item ids from it is not, because the ids have to
 * match the message keys an author writes by hand.
 */
export function stanceItems(
  blocks: readonly StanceBlock[],
  t: T,
  opts: { id: string; prompts: StancePrompts },
): Item[] {
  const { id: where, prompts } = opts;
  const items: Item[] = [];
  const seen = new Set<string>();

  for (const block of blocks) {
    if (!block.id) throw new TypeError(`${where}: every stance block needs an id`);
    if (block.id.includes(".")) {
      // A dot is how a derived id is spelled. A block called "money.joint"
      // would produce "money.joint.why", which reads as the reason for a block
      // called "money" and would be stripped or grouped as one.
      throw new TypeError(`${where}: stance block "${block.id}" must not contain a dot`);
    }
    if (seen.has(block.id)) throw new TypeError(`${where}: duplicate stance block "${block.id}"`);
    seen.add(block.id);
    if (!block.options?.length) throw new TypeError(`${where}: stance block "${block.id}" has no options`);
    /**
     * An escape only escapes on the item that carries it, and only a `multi`
     * carries one. Declared on a `choice` block, or on a block with no grounds,
     * the field would reach no item at all: the expansion would drop it in
     * silence and the author would go on believing a restriction was in force.
     * That is the exact failure the flag exists to end, so it is refused here
     * rather than reproduced one level up.
     */
    if (block.exclusive?.length && block.kind !== "multi") {
      throw new TypeError(`${where}: stance block "${block.id}" is a ${block.kind} and cannot declare exclusive options`);
    }
    if (block.groundsExclusive?.length && !block.grounds?.length) {
      throw new TypeError(`${where}: stance block "${block.id}" declares groundsExclusive with no grounds`);
    }

    /**
     * The tier every derived item starts from, and for a private block that is
     * where it ends too. See `StanceBlock.private`: a block whose question is
     * an admission cannot be half-withheld, so the weight and the grounds go
     * with it rather than travelling on their own to describe the gap.
     */
    const tier = block.private ? "private" : "shared";
    const shared = { group: block.id, section: block.section, tier } as const;
    const asked = {
      ...shared,
      id: block.id,
      prompt: t(promptKey(block)),
      options: block.options.map<Option>((value) => ({ value, label: t(optionKey(block, value)) })),
    };

    // Written as a branch rather than a `kind: block.kind` spread with a cast:
    // the union is what makes every consumer's switch exhaustive, and a cast
    // here would be the one place it was asserted rather than proved.
    items.push(
      block.kind === "multi"
        ? {
            ...asked,
            kind: "multi",
            ...(block.max != null ? { max: block.max } : {}),
            ...(block.exclusive?.length ? { exclusive: block.exclusive } : {}),
          }
        : { ...asked, kind: "choice" },
    );

    if (block.grounds?.length) {
      items.push({
        ...shared,
        id: `${block.id}.grounds`,
        kind: "multi",
        prompt: t(groundsPromptKey(block)),
        options: block.grounds.map<Option>((value) => ({ value, label: t(groundsOptionKey(value)) })),
        ...(block.groundsExclusive?.length ? { exclusive: block.groundsExclusive } : {}),
      });
    }

    if (!block.skipWeight) {
      items.push({
        ...shared,
        id: `${block.id}.weight`,
        kind: "rating",
        prompt: prompts.weight,
        min: WEIGHT_MIN,
        max: WEIGHT_MAX,
        minLabel: prompts.weightLow,
        maxLabel: prompts.weightHigh,
      });
    }

    items.push({
      ...shared,
      // Not `shared`. See the header: this is the one tier the author cannot
      // set. A private block has already arrived here private; this is what
      // makes the reason private in every other block too.
      tier: "private",
      id: `${block.id}.why`,
      kind: "text",
      prompt: prompts.why,
      placeholder: prompts.whyPlaceholder,
      rows: 3,
    });
  }

  return items;
}

/**
 * The block ids an instruction card may be built from.
 *
 * The sheet is the artefact you print and hand to somebody. A private block is
 * the one thing in an inventory whose whole point is that the reader chooses
 * the moment themselves, so it produces no card — not a redacted card, not a
 * card with the answer left out, none. A card headed "Money you have not
 * mentioned" is the disclosure; what it goes on to say is a detail.
 *
 * It is a helper rather than a rule in eight `instructions()` bodies because
 * the rule cannot be checked downstream. An `InstructionCard` is a channel and
 * two finished strings, so by the time one exists there is nothing left in it
 * that says which block it came from, and `registry.validate()` says as much
 * where it would otherwise be tempted to guess. The guarantee has to be made
 * *before* the card is written, which is here.
 *
 * `ids` is what the caller was about to build from — `result.ranked`, or
 * `settled`, or a comparison list — and comes back filtered, in the order it
 * was given. Omitted, the answer is every open block in declared order. An id
 * that is not a declared block is dropped rather than passed through: a helper
 * whose job is to withhold has to fail towards withholding, and the caller who
 * hands it something it cannot vouch for gets nothing rather than a shrug.
 */
export function cardable(blocks: readonly StanceBlock[], ids?: readonly string[]): string[] {
  const open = new Set(blocks.filter((block) => !block.private).map((block) => block.id));
  return (ids ?? blocks.map((block) => block.id)).filter((id) => open.has(id));
}

export type StanceReading = {
  id: string;
  /** Option identifiers, never prose. */
  choice: string | string[] | null;
  /** 1..10, or null if not given. */
  weight: number | null;
  /** Did they write anything at all. Not *what* they wrote. */
  reasoned: boolean;
  grounds: string[];
};

export type StanceResult = {
  v: 1;
  stances: Record<string, StanceReading>;
  /** Block ids, heaviest first; ties keep declared order, unweighted last. */
  ranked: string[];
  /** Answered, weight >= 8 — the ones with no give in them. */
  settled: string[];
  /** Answered, weight <= 3 — where there is room to move. */
  open: string[];
  /** Answered, asked for a weight, and none given. Never a `skipWeight` block. */
  unweighted: string[];
  answered: number;
  total: number;
};

const SETTLED_AT = 8;
const OPEN_AT = 3;

/** An answer that is not one of the options the block declared is not an answer. */
const declared = (value: unknown, options: readonly string[]): boolean =>
  typeof value === "string" && options.includes(value);

/**
 * Read a set of answers back as positions, weights and whether a reason exists.
 *
 * Identifiers and numbers only. The text of `why` is not in the result and must
 * never be: a result is stored, shared and re-read in another language, so a
 * word inside it is a word that cannot be translated later — and
 * `test/instruments/contract.test.ts` fails any `score()` that returns prose.
 * `reasoned` is what the result carries; the sentence stays in `answers`, where
 * the View reads it and no token can reach it.
 *
 * Nothing here produces a 1..100 number, and nothing here should ever learn
 * how. See `Family` in `core/types.ts` for why.
 */
export function scoreStances(blocks: readonly StanceBlock[], answers: Answers): StanceResult {
  const stances: Record<string, StanceReading> = {};
  let answered = 0;
  // Two facts the weight lists below need which a `StanceReading` cannot carry:
  // whether a position was actually stated, and whether the block asked for a
  // weight at all. The second is a property of the declaration rather than of
  // the answers and is unrecoverable afterwards — a `skipWeight` block and a
  // rating left blank both read as `weight: null`.
  const stated = new Set<string>();
  const asksWeight = new Set<string>();

  for (const block of blocks) {
    const given = answers[block.id];
    // A revised instrument can drop an option somebody had already picked.
    // Filtering against the current declaration here means a stale value never
    // reaches the View, which would render it through a message key that no
    // longer exists and print the key at the reader.
    const choice: string | string[] | null =
      block.kind === "multi"
        ? Array.isArray(given)
          ? given.filter((v) => declared(v, block.options))
          : []
        : declared(given, block.options)
          ? (given as string)
          : null;

    // A weight the block never offered is not a weight, for the same reason an
    // undeclared choice is not an answer. The rating declares ten integer
    // targets and nothing between or beyond them, so anything else becomes
    // null rather than the nearest legal value. The runner can only produce
    // one of the ten, but the runner is not the only way in: the result page
    // re-scores from a share token and `store.importAll` re-scores from a
    // pasted file, and an inventory always takes the codec's JSON path, so
    // whatever number is in the document is the number scored. Clamping turned
    // a 999 into a 10 and filed the block under `settled` — an impossible
    // answer laundered into the strongest possible reading of it.
    const rawWeight = answers[`${block.id}.weight`];
    const weight =
      typeof rawWeight === "number" && Number.isInteger(rawWeight) && rawWeight >= WEIGHT_MIN && rawWeight <= WEIGHT_MAX
        ? rawWeight
        : null;

    const why = answers[`${block.id}.why`];
    const grounds = block.grounds?.length
      ? (Array.isArray(answers[`${block.id}.grounds`]) ? (answers[`${block.id}.grounds`] as string[]) : []).filter((v) =>
          declared(v, block.grounds!),
        )
      : [];

    const isAnswered = Array.isArray(choice) ? choice.length > 0 : choice !== null;
    if (isAnswered) {
      answered++;
      stated.add(block.id);
    }
    if (!block.skipWeight) asksWeight.add(block.id);

    stances[block.id] = {
      id: block.id,
      choice,
      weight,
      reasoned: typeof why === "string" && why.trim().length > 0,
      grounds,
    };
  }

  const order = blocks.map((b) => b.id);
  // Array.prototype.sort has been stable since ES2019, which is what makes
  // "ties keep declared order" a property of the sort rather than a tiebreak
  // this function has to spell out.
  const ranked = [...order].sort((a, b) => (stances[b].weight ?? -Infinity) - (stances[a].weight ?? -Infinity));

  /**
   * `settled`, `open` and `unweighted` are three states of one question, so a
   * block is in them only if the question was put and a position was stated.
   *
   * Both halves of that are load-bearing, and each was got wrong once. A weight
   * with nothing behind it is not a position with no give in it: the rating and
   * the question sit on one page of a form whose items are optional, so rating
   * the importance and skipping the answer is one click apart, and such a block
   * used to head the agenda under `settled` with no answer under it. And a
   * `skipWeight` block was never asked how much it matters, so reporting it as
   * `unweighted` — which a View renders as "you did not say how much these
   * matter" — sends the reader back to a question the block does not have.
   */
  const weighable = order.filter((id) => stated.has(id) && asksWeight.has(id));
  const weightOf = (id: string) => stances[id].weight;

  return {
    v: 1,
    stances,
    ranked,
    settled: weighable.filter((id) => (weightOf(id) ?? 0) >= SETTLED_AT),
    open: weighable.filter((id) => (weightOf(id) ?? Infinity) <= OPEN_AT),
    unweighted: weighable.filter((id) => weightOf(id) === null),
    answered,
    total: blocks.length,
  };
}

export type StanceComparison = {
  /** Both weights >= 7, different answers. The evening's agenda. */
  collisions: string[];
  /** |weightA - weightB| >= 5. One of you has been conceding something. */
  asymmetries: string[];
  /** Same answer, both weights >= 7. Worth knowing you agree on. */
  aligned: string[];
  /** Different answers, both weights <= 4. A difference nobody is spending on. */
  quiet: string[];
  /**
   * Both stated a position, but there is no pair of weights to compare — a
   * `skipWeight` block, or a rating one of them left blank.
   *
   * It is its own list rather than a sixth entry in `unanswered` because the
   * two are different facts about the reader. `unanswered` means somebody did
   * not say where they stand; this means both of them did, and the instrument
   * cannot say how hard either would hold it. Filing an answered block under a
   * heading a couple will read as "neither of you said" is a lie about a
   * question they did answer, and it is the one kind of lie an instrument that
   * infers nothing has no excuse for.
   */
  weightless: string[];
  /** At least one of them did not state a position. */
  unanswered: string[];
  /**
   * Declared private, by either of them, and therefore compared by neither.
   *
   * The sixth list exists on exactly the reasoning that produced `weightless`,
   * one cause further back. `unanswered` says somebody did not say where they
   * stand, and a couple reads it as "neither of us said". A private block was
   * answered — probably carefully — and withheld by construction, and filing it
   * under that heading is the same lie about the same question with a different
   * cause. It is also the more dangerous of the two lies to tell, because the
   * one person who knows it is a lie is the one who answered.
   *
   * The list carries block ids and nothing else, in declared order. It is
   * deliberately not sorted by weight the way the other five are: the sort key
   * would be the private weight, and a `withheld` list ordered heaviest-first
   * is the ranking that the tier was set to prevent — the same disclosure
   * wearing a sort.
   */
  withheld: string[];
};

const HEAVY = 7;
const LIGHT = 4;
const ASYMMETRY = 5;

const answeredIn = (reading: StanceReading | undefined): boolean =>
  reading != null && (Array.isArray(reading.choice) ? reading.choice.length > 0 : reading.choice !== null);

/** Multi answers arrive in click order, so the same two picks are the same answer. */
const same = (a: StanceReading["choice"], b: StanceReading["choice"]): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    const left = [...a].sort();
    const right = [...b].sort();
    return left.every((v, i) => v === right[i]);
  }
  return a === b;
};

/**
 * Two people, side by side.
 *
 * Ordered by weight, never averaged, never a percentage. Averaging two people
 * into one number destroys the only information a two-person instrument has:
 * a 71% tells neither of them which evening to spend, and the lists below do
 * nothing else.
 *
 * A block is in every one of the four weight findings it qualifies for. An
 * asymmetry is not a milder collision — it is a different finding about the
 * same question, and a pair that reads only one of the two lists is better
 * served by seeing the block twice than by the code deciding which discovery
 * they were allowed to have.
 *
 * `withheld`, `unanswered` and `weightless` are the three exits from the loop,
 * and between them they make the return total: every block the two people share
 * comes back in at least one list. It did not always. A block either of them
 * had left unweighted matched no finding and fell out of the comparison
 * entirely — two people who answered a `skipWeight` question differently got
 * every list back empty, and an inventory built only from `skipWeight` blocks
 * compared to nothing at all.
 *
 * ── Why this takes the blocks and not two results ─────────────────────
 *
 * A `StanceResult` cannot say which of its blocks was private, and the honest
 * fix is the third parameter rather than a seventh field on `StanceReading`.
 *
 * The field was the obvious move and it is the wrong one, for two reasons that
 * both bite in production rather than in a test. The first is that a private
 * block is *absent* — `packAnswers` strips all four of its items, so a partner
 * re-scoring a share token has no answers for it and produces a reading
 * indistinguishable from a question that was skipped. A flag would have to
 * survive that journey to be worth anything, which means either shipping the
 * flag in the token (metadata about the omission, on the wrong side of the
 * promise the bank made) or setting it locally from the blocks — which is this
 * parameter, taking the scenic route.
 *
 * The second is staleness, and it decides it. A result is `v: 1` and is stored,
 * exported and pasted back months later; a flag inside one is a copy of a fact
 * that lives in the bank, and the copy is what a reader has when the bank
 * changes. Make a block private today and every result already on disk says
 * `false`, so the comparison files it in an ordinary list and prints exactly
 * what the change was made to stop printing. A missing field is falsy, which is
 * to say a stale result fails *open*, which is the one direction a privacy
 * feature must not fail. The blocks are the declaration this build is running,
 * the parameter is required so no caller can omit it, and an instrument's
 * `compare()` has them in scope already.
 *
 * The blocks also fix the loop's order and its membership: a block missing from
 * them is not compared at all, because a block the caller did not declare is a
 * block whose privacy the caller cannot vouch for.
 */
export function compareStances(a: StanceResult, b: StanceResult, blocks: readonly StanceBlock[]): StanceComparison {
  const out: StanceComparison = {
    collisions: [],
    asymmetries: [],
    aligned: [],
    quiet: [],
    weightless: [],
    unanswered: [],
    withheld: [],
  };
  // Declared order. Every list but `withheld` is re-sorted by weight below;
  // this is only what breaks the ties.
  const ids = blocks.map((block) => block.id).filter((id) => id in a.stances && id in b.stances);
  const sealed = new Set(blocks.filter((block) => block.private).map((block) => block.id));
  const heaviest = new Map<string, number>();

  for (const id of ids) {
    // First, and before anything reads a choice or a weight. Every list below
    // this line is a statement about what the two of them answered, and there
    // is no version of such a statement that a private block belongs in.
    if (sealed.has(id)) {
      out.withheld.push(id);
      continue;
    }
    const mine = a.stances[id];
    const theirs = b.stances[id];
    if (!answeredIn(mine) || !answeredIn(theirs)) {
      out.unanswered.push(id);
      continue;
    }

    const wa = mine.weight;
    const wb = theirs.weight;
    heaviest.set(id, Math.max(wa ?? 0, wb ?? 0));
    // Each of the four findings is a claim about two weights, so with one of
    // them missing there is no claim to make — but there is still a block, and
    // a block both of them answered has to come back to them somewhere.
    if (wa === null || wb === null) {
      out.weightless.push(id);
      continue;
    }

    const agree = same(mine.choice, theirs.choice);
    if (Math.abs(wa - wb) >= ASYMMETRY) out.asymmetries.push(id);
    if (!agree && wa >= HEAVY && wb >= HEAVY) out.collisions.push(id);
    if (agree && wa >= HEAVY && wb >= HEAVY) out.aligned.push(id);
    if (!agree && wa <= LIGHT && wb <= LIGHT) out.quiet.push(id);
  }

  const byWeight = (x: string, y: string) => (heaviest.get(y) ?? 0) - (heaviest.get(x) ?? 0);
  out.collisions.sort(byWeight);
  out.asymmetries.sort(byWeight);
  out.aligned.sort(byWeight);
  out.quiet.sort(byWeight);
  // Sorted on the one weight that exists, where one does: a question she rates
  // 10 and he was never asked about belongs above a pair of blanks.
  out.weightless.sort(byWeight);
  // `withheld` is not sorted, and `heaviest` was never told about it. Ordering
  // it would mean ranking the two people's private weights, which is the thing
  // the tier exists to keep off the page.
  return out;
}
