import { expect, test } from "vitest";
import { IDS, LOCALES } from "../../e2e/instruments";
import { INVENTORIES } from "../../e2e/inventories";
import { registry } from "@/instruments";
import { LOCALES as DECLARED } from "@/core/types";

/**
 * The one thing about the Playwright suite that a unit test can hold.
 *
 * `e2e/coverage.spec.ts` is the test that walks every instrument in every
 * language, and its worth is entirely in the word *every*. That word used to be
 * a hand-written array, which is the failure this file exists to prevent: a
 * list that is a subset of the registry is not a smaller test, it is a green
 * suite making a claim it no longer checks, and nothing goes red when it stops
 * being true.
 *
 * Today `e2e/instruments.ts` is one line of derivation and the assertion below
 * cannot fail. That is the point. It is a fence rather than a proof — the next
 * person to pin the list to one id while chasing a flake, or to paste the array
 * back in, finds out here rather than seven instruments later. Vitest can reach
 * `e2e/instruments.ts` only because that file imports no `@playwright/test`;
 * keeping it that way is what keeps this check possible.
 */
test("the e2e coverage list is the registry, not a copy of it", () => {
  expect(IDS).toEqual(registry.ids());
  expect(IDS).toContain("communication-style");
  // The registry is the authority on how many there are, so the length is
  // asserted against it rather than against a number written down here — a
  // pinned count is the same trap one level up, and it fires on the same day.
  expect(IDS.length).toBe(registry.all().length);
});

test("the e2e locale list is the one the app declares", () => {
  expect(LOCALES).toEqual(DECLARED);
});

/**
 * The same fence, one family in.
 *
 * `e2e/inventory.spec.ts` generates its cases from `INVENTORIES` and then finds
 * each instrument's private block, open questions and section titles by asking
 * the bank. Every one of those derivations is a place where a future author in
 * a hurry could pin a value — `["money-management"]` while chasing one flake —
 * and end up with a spec that still runs, still passes, and no longer covers
 * the seven it was written for.
 *
 * So the list is checked against the registry's own answer, and against the
 * family flag rather than a count: the number eight is true today and is the
 * kind of true that goes quietly stale.
 */
test("the e2e inventory list is the registry's inventory family, not a copy of it", () => {
  expect(INVENTORIES).toEqual(registry.byFamily("inventory").map((m) => m.spec.id));
  expect(INVENTORIES.length).toBeGreaterThan(0);
  for (const id of INVENTORIES) expect(registry.get(id)?.spec.family).toBe("inventory");
  // And it is a subset of the list the rest of the suite walks, so an
  // inventory can never be in one and missing from the other.
  for (const id of INVENTORIES) expect(IDS).toContain(id);
});
