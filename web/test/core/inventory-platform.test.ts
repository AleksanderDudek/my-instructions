import { expect, test } from "vitest";
import { validate, identity, type InstrumentModule } from "@/core/registry";
import { stanceItems, scoreStances, type StanceBlock, type StancePrompts } from "@/core/stance";
import { packAnswers, privateIdsOf } from "@/core/report";
import { paginate } from "@/components/runner/runner";
import { nextSelection, selectionAtCap } from "@/components/form/item-controls";
import type { InstrumentSpec, Item, T } from "@/core/types";

/**
 * The seams between a stance block and the rest of the platform.
 *
 * `core/stance.ts` and `core/playbook.ts` each have their own unit tests, and
 * both pass with a registry that would refuse every instrument built on them.
 * The pieces that have to agree live in four files that never import one
 * another: `stanceItems` emits an item kind, `validate` decides whether that
 * kind is legal, `packAnswers` decides whether it can be shared, and the runner
 * decides where the page breaks fall. Each is correct alone; the failure worth
 * a test is the one where they disagree.
 *
 * So this builds a minimal inventory out of the real expansion and puts it
 * through all four. The fixture is deliberately not an instrument: it exists to
 * hold the seam still, and it will keep holding it while eight real folders are
 * written against it.
 */

const prompts: StancePrompts = { weight: "w", why: "y", weightLow: "lo", weightHigh: "hi", whyPlaceholder: "p" };

const BLOCKS: StanceBlock[] = [
  { id: "a", kind: "choice", options: ["x", "y"], section: "s1" },
  { id: "b", kind: "multi", options: ["p", "q"], max: 1, section: "s1", grounds: ["scripture", "reason"] },
  { id: "c", kind: "choice", options: ["m", "n"], section: "s2", skipWeight: true },
];

const spec: InstrumentSpec<unknown> = {
  id: "fixture",
  version: 1,
  family: "inventory",
  glyph: "◆",
  minutes: 5,
  channels: ["communication"],
  tier: "free",
  messages: {} as never,
  form: (t: T) => ({
    kind: "items",
    shuffle: false,
    optional: true,
    pageBy: "group",
    pageSize: 5,
    items: stanceItems(BLOCKS, t, { id: "fixture", prompts }),
  }),
  score: (answers) => scoreStances(BLOCKS, answers),
  instructions: () => [{ channel: "communication", title: "t", body: "b" }],
  playbook: () => ({ ok: [{ id: "o1", text: "one" }], notOk: [{ id: "n1", text: "two" }] }),
};

const asModule = (override: Partial<InstrumentSpec<unknown>> = {}) =>
  ({ spec: { ...spec, ...override }, View: () => null, provenance: {} }) as unknown as InstrumentModule;

/** A one-item bank, for the checks that are about the item and nothing else. */
const withItems = (items: unknown[]) =>
  asModule({ form: () => ({ kind: "items", shuffle: false, items: items as Item[] }) });

test("an inventory assembled from stance blocks is a legal instrument", () => {
  expect(() => validate(asModule())).not.toThrow();
});

test("an inventory that forgot to turn the shuffle off is refused", () => {
  // A weight question shuffled away from the question it weighs asks how
  // important nothing in particular is, and the page would look fine.
  expect(() =>
    validate(asModule({ form: (t: T) => ({ kind: "items", items: stanceItems(BLOCKS, t, { id: "fixture", prompts }) }) })),
  ).toThrow(/shuffle/);
});

test("a hand-written reason cannot be made shareable", () => {
  expect(() =>
    validate(
      asModule({
        form: () => ({
          kind: "items",
          shuffle: false,
          items: [
            { id: "a", kind: "choice", prompt: "p", options: [{ value: "x", label: "X" }] },
            { id: "a.why", kind: "text", prompt: "w" },
          ],
        }),
      }),
    ),
  ).toThrow(/private/);
});

/* ══ the private block ════════════════════════════════════════════ */

test("a private block reaches the token as an absence, all four items of it", () => {
  // The seam the flag exists for. `privateIdsOf` is what `packAnswers` strips
  // against, so a tier that did not make it onto the weight is a weight in a
  // share link — and `debt.weight = 9` beside no answer tells the reader
  // exactly what the omission was withholding.
  const blocks: StanceBlock[] = [...BLOCKS, { id: "d", kind: "choice", options: ["x", "y"], private: true, grounds: ["mine"] }];
  const withDebt = asModule({
    form: (t: T) => ({ kind: "items", shuffle: false, optional: true, pageBy: "group", items: stanceItems(blocks, t, { id: "fixture", prompts }) }),
    score: (answers) => scoreStances(blocks, answers),
  });
  expect(() => validate(withDebt)).not.toThrow();
  expect([...privateIdsOf(withDebt.spec)]).toEqual(["a.why", "b.why", "c.why", "d", "d.grounds", "d.weight", "d.why"]);
  const packed = packAnswers(withDebt.spec, { a: "x", d: "y", "d.weight": 9, "d.grounds": ["mine"] });
  expect(packed).toContain('"a":"x"');
  for (const leak of ['"d"', '"d.weight"', '"d.grounds"']) expect(packed).not.toContain(leak);
});

test("a block that is private in one part and shared in another is refused at import", () => {
  // Half a redaction is worse than none: the shape of the word is still
  // legible through it and the person who drew it believed they had said
  // nothing. `stanceItems` cannot produce this, which is the point — the check
  // catches the hand-written bank that imitates the expansion badly.
  expect(() =>
    validate(
      withItems([
        { id: "d", group: "d", kind: "choice", tier: "private", prompt: "p", options: opts("x", "y") },
        { id: "d.weight", group: "d", kind: "rating", tier: "shared", prompt: "w", min: 1, max: 10 },
        { id: "d.why", group: "d", kind: "text", tier: "private", prompt: "y" },
      ]),
    ),
  ).toThrow(/private entire/);

  // And the ordinary block, whose reason is private beside a shared question,
  // is exactly what the check must not refuse.
  expect(() =>
    validate(
      withItems([
        { id: "a", group: "a", kind: "choice", prompt: "p", options: opts("x", "y") },
        { id: "a.why", group: "a", kind: "text", tier: "private", prompt: "y" },
      ]),
    ),
  ).not.toThrow();
});

test("a rating with no range to render is refused at import", () => {
  expect(() =>
    validate(
      asModule({
        form: () => ({ kind: "items", shuffle: false, items: [{ id: "r", kind: "rating", prompt: "p", min: 10, max: 1 }] }),
      }),
    ),
  ).toThrow(/finite min/);
});

/* ══ the honest escape ════════════════════════════════════════════ */

/**
 * Every option set is required to carry a way out, and in a multi the way out
 * has to clear the others or it is a lie the reader told about themselves with
 * the app's help. Three declarations would break that, all three render as a
 * perfectly ordinary checkbox, and none of them can be told apart downstream
 * from a reader who meant both — so import is the only place they can be
 * caught, which is what these three assert.
 */

const opts = (...values: string[]) => values.map((value) => ({ value, label: value.toUpperCase() }));

test("an escape naming an option that does not exist is refused at import", () => {
  expect(() =>
    validate(withItems([{ id: "m", kind: "multi", prompt: "p", options: opts("hours", "none"), exclusive: ["non"] }])),
  ).toThrow(/not one of its options/);
});

test("a multi whose every option is exclusive is a choice wearing the wrong kind", () => {
  // Checkboxes that behave like radios: the reader can never pick two of
  // anything, and the kind is what is wrong rather than the flag.
  expect(() =>
    validate(
      withItems([{ id: "m", kind: "multi", prompt: "p", options: opts("a", "b"), exclusive: ["a", "b"] }]),
    ),
  ).toThrow(/fewer than two/);
});

test("one ordinary option beside two escapes collapses in exactly the same way", () => {
  // The refusal above is not about the word "every". An exclusive value cannot
  // be held beside anything, another exclusive value included, so the only pair
  // a reader can ever hold is a pair of ordinary options — and this leaves one.
  // Every pair the reader reaches for here collapses to a single tick.
  expect(() =>
    validate(
      withItems([
        { id: "m", kind: "multi", prompt: "p", options: opts("a", "none", "unsure"), exclusive: ["none", "unsure"] },
      ]),
    ),
  ).toThrow(/fewer than two/);

  // Two ordinary options beside the same two escapes is a real multi.
  expect(() =>
    validate(
      withItems([
        { id: "m", kind: "multi", prompt: "p", options: opts("a", "b", "none", "unsure"), exclusive: ["none", "unsure"] },
      ]),
    ),
  ).not.toThrow();
});

test("an escape on a kind with nothing to clear is refused", () => {
  // A choice is exclusive by construction and a rating has no options at all,
  // so the field would be read by nobody while the author believed otherwise.
  expect(() =>
    validate(withItems([{ id: "c", kind: "choice", prompt: "p", options: opts("a", "b"), exclusive: ["a"] }])),
  ).toThrow(/cannot declare exclusive options/);
  expect(() =>
    validate(withItems([{ id: "r", kind: "rating", prompt: "p", min: 1, max: 10, exclusive: ["a"] }])),
  ).toThrow(/cannot declare exclusive options/);
});

test("a well-formed escape passes, and so does a multi that declares none", () => {
  // Two ordinary options is the floor: `[hours, none]` reads like a well-formed
  // escape and is not one, because "hours" has nothing it can be held beside.
  expect(() =>
    validate(
      withItems([{ id: "m", kind: "multi", prompt: "p", options: opts("hours", "money", "none"), exclusive: ["none"] }]),
    ),
  ).not.toThrow();
  expect(() => validate(withItems([{ id: "m", kind: "multi", prompt: "p", options: opts("a", "b") }]))).not.toThrow();
});

test("a cap nobody could satisfy is refused at import", () => {
  // `max: 0` is not a limit, it is a question withdrawn while still being
  // asked: every real option renders greyed out at first paint and only the
  // escape can be ticked. A fraction is the same fault wearing arithmetic —
  // `selectionAtCap` compares a count to it, so 1.5 quietly means one.
  const capped = (max: unknown) => [
    { id: "m", kind: "multi", prompt: "p", options: opts("a", "b", "none"), exclusive: ["none"], max },
  ];
  expect(() => validate(withItems(capped(0)))).toThrow(/max/);
  expect(() => validate(withItems(capped(-1)))).toThrow(/max/);
  expect(() => validate(withItems(capped(1.5)))).toThrow(/max/);
  expect(() => validate(withItems(capped(Number.NaN)))).toThrow(/max/);

  // One is the smallest honest cap, and declaring none stays legal.
  expect(() => validate(withItems(capped(1)))).not.toThrow();
  expect(() => validate(withItems(capped(undefined)))).not.toThrow();
});

test("the control does what the declaration promised", () => {
  const escape = ["none"];
  // Ticking the escape replaces the selection; ticking anything else drops it.
  expect(nextSelection(["hours", "money"], "none", true, escape)).toEqual(["none"]);
  expect(nextSelection(["none"], "hours", true, escape)).toEqual(["hours"]);
  // Unticking is untouched, and an item with no escape is the old behaviour.
  expect(nextSelection(["none", "hours"], "none", false, escape)).toEqual(["hours"]);
  expect(nextSelection(["a"], "b", true)).toEqual(["a", "b"]);
});

test("the cap counts positions taken, and none of these is not one", () => {
  const escape = ["none"];
  // Two picks against a cap of two is full — but the escape is still open, and
  // a reader who used both picks and then decided neither was true says so in
  // one click rather than working out that they must untick first.
  expect(selectionAtCap(["hours", "money"], 2, escape)).toBe(true);
  expect(selectionAtCap(["none"], 1, escape)).toBe(false);
  expect(selectionAtCap(["hours"], 1)).toBe(true);
  expect(selectionAtCap(["hours", "money"], undefined, escape)).toBe(false);
});

test("the whole instrument drops to JSON, and the reason is absent rather than hidden", () => {
  expect([...privateIdsOf(spec)]).toEqual(["a.why", "b.why", "c.why"]);
  const packed = packAnswers(spec, { a: "x", "a.weight": 10, "a.why": "a third party's name", b: ["p"] });
  expect(packed.startsWith("{"), "a rating or a text item must not pack to one character").toBe(true);
  expect(packed).not.toContain("third party");
});

test("a page break never falls inside a block", () => {
  const form = spec.form(identity, "en");
  if (form.kind !== "items") throw new Error("the fixture is an items form");
  const byId = new Map(form.items.map((i) => [i.id, i]));
  const order = form.items.map((i) => i.id);

  expect(paginate(order, (id) => byId.get(id), 5, "group")).toEqual([
    ["a", "a.weight", "a.why"],
    ["b", "b.grounds", "b.weight", "b.why"],
    ["c", "c.why"],
  ]);
  // A group larger than the ceiling overruns it rather than being cut in half.
  expect(paginate(order, (id) => byId.get(id), 2, "group")[1]).toEqual(["b", "b.grounds", "b.weight", "b.why"]);
  // Without the flag, paging is the arithmetic it always was.
  expect(paginate(["1", "2", "3"], () => undefined, 2)).toEqual([["1", "2"], ["3"]]);
});
