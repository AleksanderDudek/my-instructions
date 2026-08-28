import { describe, expect, test } from "vitest";
import { stanceItems, scoreStances, compareStances, cardable, type StanceBlock, type StancePrompts } from "@/core/stance";
import type { Answers } from "@/core/types";

/**
 * The expansion is the contract eight instruments depend on.
 *
 * An author writes one line — a block — and gets four items with derived ids,
 * a shared group and a tier they did not set. Every one of those is load-bearing
 * somewhere else: the runner pages on `group`, the report strips on `tier`, and
 * `scoreStances` finds the weight by appending `.weight` to a block id. A change
 * to any of them is invisible in the folder that declares the block and shows up
 * three layers away, which is why they are asserted here rather than reviewed.
 */

const prompts: StancePrompts = {
  weight: "How important is this to you?",
  why: "Why is it, or is it not, important to you?",
  weightLow: "Barely matters",
  weightHigh: "Could not matter more",
  whyPlaceholder: "In your own words.",
};

const t = (key: string) => key;
const expand = (blocks: StanceBlock[]) => stanceItems(blocks, t, { id: "test-instrument", prompts });

const money: StanceBlock = { id: "money", kind: "choice", options: ["joint", "split", "mixed"], section: "money" };
const faith: StanceBlock = {
  id: "belief",
  kind: "choice",
  options: ["hold", "left", "never"],
  grounds: ["scripture", "church", "reason", "unworked"],
};
const chores: StanceBlock = { id: "chores", kind: "multi", options: ["cook", "clean", "drive"], max: 2 };
/**
 * The one block in the eight banks whose question is itself an admission:
 * `money-management.undisclosed-debt`. It declares grounds so that all four
 * derived items exist and every one of them can be checked.
 */
const debt: StanceBlock = {
  id: "debt",
  kind: "choice",
  options: ["none", "some", "rather-not"],
  grounds: ["mine", "ours", "unworked"],
  private: true,
};

describe("expansion", () => {
  test("one block becomes question, weight and reason, in that order", () => {
    expect(expand([money]).map((i) => `${i.id}:${i.kind}`)).toEqual([
      "money:choice",
      "money.weight:rating",
      "money.why:text",
    ]);
  });

  test("grounds arrive between the question and its weight", () => {
    expect(expand([faith]).map((i) => i.id)).toEqual(["belief", "belief.grounds", "belief.weight", "belief.why"]);
    const grounds = expand([faith])[1];
    expect(grounds.kind).toBe("multi");
    // One flat key per ground, not one per block. Two beliefs held on
    // scripture are only legible as the same ground if they say the same word.
    expect(grounds.kind === "multi" ? grounds.options.map((o) => o.label) : []).toEqual([
      "stance.grounds.scripture",
      "stance.grounds.church",
      "stance.grounds.reason",
      "stance.grounds.unworked",
    ]);
  });

  test("skipWeight drops the weight and nothing else", () => {
    expect(expand([{ ...money, skipWeight: true }]).map((i) => i.id)).toEqual(["money", "money.why"]);
  });

  test("every part of a block carries the block's group and section", () => {
    for (const item of expand([money])) {
      expect({ id: item.id, group: item.group, section: item.section }).toEqual({
        id: item.id,
        group: "money",
        section: "money",
      });
    }
  });

  test("the reason is private and the author is not asked", () => {
    const items = expand([money, faith, chores]);
    expect(items.filter((i) => i.id.endsWith(".why")).map((i) => i.tier)).toEqual(["private", "private", "private"]);
    expect(items.filter((i) => !i.id.endsWith(".why")).every((i) => i.tier === "shared")).toBe(true);
  });

  test("a private block is private entire, in all four of its parts", () => {
    // The argument is on the field and it is short: a token that omits the
    // answer and carries `debt.weight = 9` has told the reader exactly what the
    // omission was withholding. `packAnswers` strips on the tier and nothing
    // else, so a tier missed here is an answer in a share link.
    const items = expand([debt]);
    expect(items.map((i) => `${i.id}:${i.tier}`)).toEqual([
      "debt:private",
      "debt.grounds:private",
      "debt.weight:private",
      "debt.why:private",
    ]);
    // And the flag is per block: the block declared beside it is untouched.
    expect(expand([debt, money]).filter((i) => i.id.startsWith("money")).map((i) => i.tier)).toEqual([
      "shared",
      "shared",
      "private",
    ]);
  });

  test("the weight is a one-to-ten rating with words only at the ends", () => {
    const weight = expand([money])[1];
    expect(weight.kind).toBe("rating");
    if (weight.kind !== "rating") throw new Error("unreachable");
    expect({ min: weight.min, max: weight.max }).toEqual({ min: 1, max: 10 });
    expect({ lo: weight.minLabel, hi: weight.maxLabel }).toEqual({
      lo: prompts.weightLow,
      hi: prompts.weightHigh,
    });
  });

  test("the shared prompts come in resolved and are not re-derived", () => {
    const [, weight, why] = expand([money]);
    expect(weight.prompt).toBe(prompts.weight);
    expect(why.prompt).toBe(prompts.why);
  });

  test("a multi block keeps its cap", () => {
    const asked = expand([chores])[0];
    expect(asked.kind === "multi" ? asked.max : null).toBe(2);
  });

  test("the escape reaches the one item that can enforce it", () => {
    // The block declares which option means "none of the others"; the control
    // is the only thing that can act on it, and it can only act on what the
    // expansion hands it. A passthrough that quietly dropped the field would
    // leave a reader ticking "none" beside two commitments, which is the whole
    // defect the flag exists to close.
    const escape: StanceBlock = { ...chores, options: ["cook", "clean", "none"], exclusive: ["none"] };
    const asked = expand([escape])[0];
    expect(asked.kind === "multi" ? asked.exclusive : null).toEqual(["none"]);
    // Absent rather than empty where nothing was declared, so a bank that has
    // not thought about its escape looks different from one that has.
    const plain = expand([chores])[0];
    expect(plain.kind === "multi" ? plain.exclusive : "not a multi").toBeUndefined();
  });

  test("the grounds carry an escape of their own", () => {
    // "I have not worked that out" is a real ground, given by a great many
    // people who hold the belief anyway — and it cannot be true beside
    // scripture.
    const grounds = expand([{ ...faith, groundsExclusive: ["unworked"] }])[1];
    expect(grounds.kind === "multi" ? grounds.exclusive : null).toEqual(["unworked"]);
  });

  test("an escape declared where nothing would enforce it is refused", () => {
    // A choice is exclusive by construction, so the field would reach no item
    // and the author would believe a restriction was in force.
    expect(() => expand([{ ...money, exclusive: ["joint"] }])).toThrow(/exclusive/);
    expect(() => expand([{ ...chores, groundsExclusive: ["unworked"] }])).toThrow(/groundsExclusive/);
  });

  test("a block that would collide with a derived id is refused", () => {
    // "money.joint" expands to "money.joint.why", which reads as the reason
    // for a block called "money" to everything downstream that splits on a dot.
    expect(() => expand([{ ...money, id: "money.joint" }])).toThrow(/dot/);
    expect(() => expand([money, money])).toThrow(/duplicate/);
    expect(() => expand([{ ...money, options: [] }])).toThrow(/options/);
  });
});

describe("the instruction sheet", () => {
  /**
   * The sheet is the artefact you print and hand to somebody, so the rule is
   * not "no card names the answer" — it is that a private block produces no
   * card at all. A card headed "Money you have not mentioned" is the
   * disclosure; what it goes on to say is a detail.
   *
   * The guarantee lives here rather than in `registry.validate()` because an
   * `InstructionCard` is a channel and two finished strings: by the time a card
   * exists, nothing in it says which block it came from. So the check has to be
   * made before the card is written, and this is what eight `instructions()`
   * bodies are meant to call instead of remembering the rule.
   */
  const blocks = [money, debt, chores];

  test("a private block is not among the ids a card may be built from", () => {
    expect(cardable(blocks)).toEqual(["money", "chores"]);
    expect(cardable([debt])).toEqual([]);
  });

  test("a list to build from comes back filtered, in the order it was given", () => {
    // The realistic call: an instrument takes its heaviest few blocks and makes
    // a card of each. The order is the caller's, because it is the agenda.
    const ranked = scoreStances(blocks, {
      money: "joint",
      "money.weight": 4,
      debt: "some",
      "debt.weight": 10,
      chores: ["cook"],
      "chores.weight": 7,
    }).ranked;
    expect(ranked).toEqual(["debt", "chores", "money"]);
    expect(cardable(blocks, ranked)).toEqual(["chores", "money"]);
  });

  test("an id the blocks do not account for is dropped rather than passed through", () => {
    // A helper whose job is to withhold has to fail towards withholding. An id
    // with no block behind it is one whose privacy nothing here can vouch for
    // — a derived id, a renamed block, a hand-written item — and the caller
    // gets nothing rather than the benefit of the doubt.
    expect(cardable(blocks, ["money", "debt", "debt.why", "kittens"])).toEqual(["money"]);
  });
});

describe("scoring", () => {
  const answers: Answers = {
    money: "joint",
    "money.weight": 9,
    "money.why": "  Because I watched my parents do it the other way.  ",
    belief: "hold",
    "belief.grounds": ["scripture", "unworked", "astrology"],
    "belief.weight": 2,
    chores: ["cook", "drive"],
  };
  const blocks = [money, faith, chores];

  test("the result carries identifiers and numbers, never the sentence", () => {
    const result = scoreStances(blocks, answers);
    expect(result.stances.money).toEqual({
      id: "money",
      choice: "joint",
      weight: 9,
      reasoned: true,
      grounds: [],
    });
    // The whole rule in one assertion: a result is stored, shared and re-read
    // in another language, so a word inside it is a word nobody can translate.
    expect(JSON.stringify(result)).not.toContain("parents");
  });

  test("scoring is pure and does not touch what it was handed", () => {
    const guarded = structuredClone(answers);
    const once = JSON.stringify(scoreStances(blocks, answers));
    expect(JSON.stringify(scoreStances(blocks, answers))).toBe(once);
    expect(answers).toEqual(guarded);
  });

  test("an option the block no longer declares is not an answer", () => {
    const result = scoreStances(blocks, answers);
    expect(result.stances.belief.grounds).toEqual(["scripture", "unworked"]);
    expect(scoreStances(blocks, { money: "crypto" }).stances.money.choice).toBeNull();
  });

  test("whitespace is not a reason", () => {
    expect(scoreStances([money], { "money.why": "   " }).stances.money.reasoned).toBe(false);
    expect(scoreStances([money], {}).stances.money.reasoned).toBe(false);
  });

  test("heaviest first, and ties keep the order they were declared in", () => {
    const three: StanceBlock[] = [
      { id: "a", kind: "choice", options: ["x"] },
      { id: "b", kind: "choice", options: ["x"] },
      { id: "c", kind: "choice", options: ["x"] },
    ];
    const ranked = scoreStances(three, { "a.weight": 5, "b.weight": 9, "c.weight": 5 }).ranked;
    expect(ranked).toEqual(["b", "a", "c"]);
    // Unweighted blocks fall to the end rather than being read as a zero.
    expect(scoreStances(three, { "b.weight": 1 }).ranked).toEqual(["b", "a", "c"]);
  });

  test("settled, open and unweighted are three different states", () => {
    const four: StanceBlock[] = ["a", "b", "c", "d"].map((id) => ({ id, kind: "choice", options: ["x"] }));
    const result = scoreStances(four, {
      a: "x",
      "a.weight": 8,
      b: "x",
      "b.weight": 3,
      c: "x",
      d: "x",
      "d.weight": 5,
    });
    expect({ settled: result.settled, open: result.open, unweighted: result.unweighted }).toEqual({
      settled: ["a"],
      open: ["b"],
      unweighted: ["c"],
    });
    // An unanswered block is not "unweighted"; it is simply not answered.
    expect(scoreStances(four, {}).unweighted).toEqual([]);
    expect({ answered: result.answered, total: result.total }).toEqual({ answered: 4, total: 4 });
  });

  test("all three states are about a position, not just about a number", () => {
    // The rating and the question sit on one page of an optional form, so
    // rating the importance and skipping the answer is a click apart. A weight
    // with nothing behind it is not a position with no give in it.
    const four: StanceBlock[] = ["a", "b", "c", "d"].map((id) => ({ id, kind: "choice", options: ["x"] }));
    const result = scoreStances(four, { "a.weight": 9, "b.weight": 2, "c.weight": 5 });
    expect({ settled: result.settled, open: result.open, unweighted: result.unweighted, answered: result.answered }).toEqual(
      { settled: [], open: [], unweighted: [], answered: 0 },
    );
  });

  test("a block that carries no weight question is not reported as unweighted", () => {
    // `unweighted` reads to a reader as "you did not say how much these
    // matter", which sends them back to a question a skipWeight block does not
    // have. It was answered and it is complete.
    const blocks: StanceBlock[] = [
      { id: "letter", kind: "choice", options: ["x"], skipWeight: true },
      { id: "money", kind: "choice", options: ["x"] },
    ];
    const result = scoreStances(blocks, { letter: "x", money: "x" });
    expect(result.unweighted).toEqual(["money"]);
    expect({ settled: result.settled, open: result.open }).toEqual({ settled: [], open: [] });
  });

  test("a weight the rating never offered is not a weight", () => {
    // Every other field here refuses an undeclared answer, and the same way in
    // is open: the result page re-scores from a share token and `importAll`
    // from a pasted file, both of which carry whatever number is written down.
    // Clamped, a 999 became a 10 and the block was reported as settled.
    const one: StanceBlock[] = [{ id: "m", kind: "choice", options: ["x"] }];
    const weightFor = (w: unknown) => scoreStances(one, { m: "x", "m.weight": w as number }).stances.m.weight;
    expect([weightFor(999), weightFor(0), weightFor(-4), weightFor(7.5), weightFor("9")]).toEqual([
      null,
      null,
      null,
      null,
      null,
    ]);
    expect([weightFor(1), weightFor(10)]).toEqual([1, 10]);
    expect(scoreStances(one, { m: "x", "m.weight": 999 }).settled).toEqual([]);
  });

  test("nothing in the result is a score out of a hundred", () => {
    const result = scoreStances(blocks, answers) as unknown as Record<string, unknown>;
    for (const forbidden of ["scores", "score", "band", "elevation"]) expect(forbidden in result).toBe(false);
  });
});

describe("comparing two people", () => {
  const blocks: StanceBlock[] = [
    { id: "children", kind: "choice", options: ["yes", "no"] },
    { id: "money", kind: "choice", options: ["joint", "split"] },
    { id: "sunday", kind: "choice", options: ["church", "lie-in"] },
    { id: "chores", kind: "multi", options: ["cook", "clean"] },
    { id: "moving", kind: "choice", options: ["stay", "go"] },
  ];

  const a = scoreStances(blocks, {
    children: "yes",
    "children.weight": 10,
    money: "joint",
    "money.weight": 9,
    sunday: "church",
    "sunday.weight": 2,
    chores: ["cook", "clean"],
    "chores.weight": 8,
  });
  const b = scoreStances(blocks, {
    children: "no",
    "children.weight": 9,
    money: "joint",
    "money.weight": 8,
    sunday: "lie-in",
    "sunday.weight": 1,
    chores: ["clean", "cook"],
    "chores.weight": 3,
  });

  const seen = compareStances(a, b, blocks);

  test("a disagreement both people are heavy on is the evening's agenda", () => {
    expect(seen.collisions).toEqual(["children"]);
  });

  test("the same answer held heavily by both is worth saying out loud", () => {
    expect(seen.aligned).toEqual(["money"]);
  });

  test("a difference neither is spending on is filed as quiet, not as a problem", () => {
    expect(seen.quiet).toEqual(["sunday"]);
  });

  test("an asymmetry is its own finding, on the same answer", () => {
    // Both picked cooking and cleaning; one rates it 8 and the other 3. That is
    // one of them conceding something the other did not know was conceded, and
    // it never shows up as a disagreement because there is not one.
    expect(seen.asymmetries).toEqual(["chores"]);
    expect(seen.collisions).not.toContain("chores");
  });

  test("a multi answer is the same answer whatever order it was clicked in", () => {
    expect(seen.aligned.concat(seen.collisions)).not.toContain("chores");
  });

  test("a block one of them skipped is unanswered rather than agreed", () => {
    expect(seen.unanswered).toEqual(["moving"]);
    for (const list of [seen.collisions, seen.aligned, seen.quiet, seen.asymmetries, seen.weightless]) {
      expect(list).not.toContain("moving");
    }
  });

  test("a block both answered and neither can be weighed on comes back anyway", () => {
    // Every finding is a claim about two weights, so one missing weight leaves
    // nothing to claim — which is not the same as nothing to say. These two
    // disagree outright and one of them rates it 10; the pair are owed the
    // block, and before `weightless` existed they got five empty lists.
    const one: StanceBlock[] = [{ id: "children", kind: "choice", options: ["yes", "no"] }];
    const out = compareStances(
      scoreStances(one, { children: "yes", "children.weight": 10 }),
      scoreStances(one, { children: "no" }),
      one,
    );
    expect(out.weightless).toEqual(["children"]);
    expect({ ...out, weightless: [] }).toEqual({
      collisions: [],
      asymmetries: [],
      aligned: [],
      quiet: [],
      weightless: [],
      unanswered: [],
      withheld: [],
    });
  });

  test("a skipWeight block is weightless, and never filed as unanswered", () => {
    // They both said where they stand. Filing that under a heading the two of
    // them will read as "neither of you said" is a lie about a question they
    // answered — and an inventory made only of these blocks used to compare to
    // nothing at all.
    const letters: StanceBlock[] = [{ id: "letter", kind: "choice", options: ["x", "y"], skipWeight: true }];
    const out = compareStances(scoreStances(letters, { letter: "x" }), scoreStances(letters, { letter: "y" }), letters);
    expect({ weightless: out.weightless, unanswered: out.unanswered }).toEqual({
      weightless: ["letter"],
      unanswered: [],
    });
  });

  test("the weightless list leads with the one weight there is", () => {
    const three: StanceBlock[] = [
      { id: "a", kind: "choice", options: ["x"] },
      { id: "b", kind: "choice", options: ["x"] },
      { id: "c", kind: "choice", options: ["x"] },
    ];
    const rated = scoreStances(three, { a: "x", "a.weight": 4, b: "x", "b.weight": 9, c: "x" });
    const blank = scoreStances(three, { a: "x", b: "x", c: "x" });
    expect(compareStances(rated, blank, three).weightless).toEqual(["b", "a", "c"]);
  });

  test("the lists come back heaviest first, on the heavier of the two weights", () => {
    // Ordered on the maximum rather than on either person's own number: a
    // question one of them rates 10 is on the agenda whatever the other put,
    // and sorting by the first person's weight would bury it.
    const heavy = scoreStances(blocks, {
      children: "yes",
      "children.weight": 7,
      money: "joint",
      "money.weight": 10,
      sunday: "church",
      "sunday.weight": 7,
    });
    const light = scoreStances(blocks, {
      children: "no",
      "children.weight": 8,
      money: "split",
      "money.weight": 9,
      sunday: "lie-in",
      "sunday.weight": 7,
    });
    expect(compareStances(heavy, light, blocks).collisions).toEqual(["money", "children", "sunday"]);
  });

  test("blocks of equal weight keep the order they were declared in", () => {
    const flat = (choice: string) =>
      scoreStances(blocks, {
        children: choice === "a" ? "yes" : "no",
        "children.weight": 9,
        money: choice === "a" ? "joint" : "split",
        "money.weight": 9,
        sunday: choice === "a" ? "church" : "lie-in",
        "sunday.weight": 9,
      });
    expect(compareStances(flat("a"), flat("b"), blocks).collisions).toEqual(["children", "money", "sunday"]);
  });

  test("a private block is withheld, and reaches none of the other five lists", () => {
    /**
     * The sixth list, and the whole of it: whatever the two of them answered,
     * a block declared private leaves the comparison under `withheld` and
     * nowhere else. Each of the three cases below would otherwise have landed
     * it somewhere — an outright disagreement both rate 9 is a collision, a
     * blank from one of them is unanswered, and a block with no weight
     * question is weightless — and each of those headings is read by a couple
     * as a claim about what they said to each other.
     */
    const withPrivate: StanceBlock[] = [{ id: "children", kind: "choice", options: ["yes", "no"] }, debt];
    const cases: Array<[string, Answers, Answers]> = [
      [
        "a disagreement they would both fight for",
        { children: "yes", "children.weight": 9, debt: "some", "debt.weight": 9 },
        { children: "no", "children.weight": 9, debt: "none", "debt.weight": 9 },
      ],
      [
        "one of them left it blank",
        { children: "yes", "children.weight": 9, debt: "some", "debt.weight": 9 },
        { children: "no", "children.weight": 9 },
      ],
      [
        "neither of them answered it at all",
        { children: "yes", "children.weight": 9 },
        { children: "no", "children.weight": 9 },
      ],
    ];

    for (const [what, mine, theirs] of cases) {
      const out = compareStances(scoreStances(withPrivate, mine), scoreStances(withPrivate, theirs), withPrivate);
      expect(out.withheld, what).toEqual(["debt"]);
      for (const list of [out.collisions, out.asymmetries, out.aligned, out.quiet, out.weightless, out.unanswered]) {
        expect(list, what).not.toContain("debt");
      }
      // The block beside it is compared exactly as it was before.
      expect(out.collisions, what).toEqual(["children"]);
    }
  });

  test("a private block with no weight question is still withheld, not weightless", () => {
    // `weightless` is the list every uncomparable block used to fall into, and
    // it is not a synonym for "we said nothing about this one". It says both of
    // them stated a position and only the stakes are unknown, which is a claim
    // about an answer nobody may look at.
    const quiet: StanceBlock[] = [{ ...debt, skipWeight: true }];
    const out = compareStances(scoreStances(quiet, { debt: "some" }), scoreStances(quiet, { debt: "none" }), quiet);
    expect({ withheld: out.withheld, weightless: out.weightless, unanswered: out.unanswered }).toEqual({
      withheld: ["debt"],
      weightless: [],
      unanswered: [],
    });
  });

  test("the same two results compare differently once the block is declared private", () => {
    // The reason this takes the blocks rather than reading a flag off the
    // result: the declaration is the only copy of the fact that is current. A
    // flag inside a stored `v: 1` result is a copy made when it was scored, and
    // a result scored before the block was made private would say `false` —
    // fail-open, on the one feature that must fail closed.
    const open: StanceBlock[] = [{ id: "debt", kind: "choice", options: ["none", "some"] }];
    const shut: StanceBlock[] = [{ ...open[0], private: true }];
    const mine = scoreStances(open, { debt: "some", "debt.weight": 9 });
    const theirs = scoreStances(open, { debt: "none", "debt.weight": 9 });
    expect(compareStances(mine, theirs, open).collisions).toEqual(["debt"]);
    const out = compareStances(mine, theirs, shut);
    expect({ collisions: out.collisions, withheld: out.withheld }).toEqual({ collisions: [], withheld: ["debt"] });
  });

  test("no average, no percentage, no single number", () => {
    // Averaging two people into one figure destroys the only information a
    // two-person instrument has, so the shape has nowhere to put one.
    expect(Object.values(seen).every(Array.isArray)).toBe(true);
  });
});
