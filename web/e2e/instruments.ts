import { registry } from "@/instruments";
import { LOCALES } from "@/core/types";

/**
 * What "every instrument" means, asked rather than remembered.
 *
 * A hand-written array of ids is the one shape of coverage test that fails
 * silently: register an instrument, forget the array, and the suite stays green
 * while proving nothing whatsoever about the thing that was added — which is
 * the moment it was most worth proving something. The list looks like coverage
 * from the outside, and it is wrong exactly once per new instrument.
 *
 * So it is derived, the way `test/instruments/contract.test.ts` derives its
 * cases from `registry.all()`. Importing the registry here is cheap: this is
 * Node, not a bundle, and the specs it validates at import time are the same
 * ones the app runs.
 *
 * Locales come from the same place for the same reason — a fifth language
 * added to `core/types` would otherwise be a fifth language nothing renders in
 * until somebody notices.
 *
 * Keep this file free of `@playwright/test` so it can be read by a unit test;
 * `test/e2e/coverage-list.test.ts` is what holds the derivation in place.
 */
export const IDS: string[] = registry.ids();

export { LOCALES };
