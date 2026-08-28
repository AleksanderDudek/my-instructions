import { registry } from "@/instruments";
import { createI18n, type Messages } from "@/core/i18n";
import type { Item, ItemsForm, Locale } from "@/core/types";

import en from "@/i18n/messages/en";
import pl from "@/i18n/messages/pl";
import es from "@/i18n/messages/es";
import de from "@/i18n/messages/de";

/**
 * The shell's own words, imported rather than fetched.
 *
 * `core/locales.ts` does this with `import()` behind a literal specifier, which
 * is right for the app: the shell is code-split per language. Here the four are
 * taken statically, for a reason that is entirely about the runner and is worth
 * writing down — see `table` below.
 */
const SHELL: Record<Locale, Messages> = { en, pl, es, de };

/**
 * `(await import(…)).default`, however many layers of interop are in the way.
 *
 * The app reads `.default` exactly once and is correct everywhere it runs.
 * Playwright's runner transpiles these modules to CommonJS and then wraps the
 * result again for `import()`, so the identical call lands on
 * `{ default: { …the table } }` and every lookup misses. The symptom is not a
 * crash: `t` renders a key it cannot find *as the key*, so the shape comes back
 * fully formed with `"title"` where the title should be, and every assertion
 * that compares the page against it fails somewhere else entirely.
 *
 * A static `import x from` is unwrapped correctly by the same interop, which is
 * why `SHELL` above is static and this is only needed for `spec.messages`,
 * where the app wants a dynamic import and should keep it. Unwrapping until the
 * object is no longer a lone `default` makes the two loaders agree. A message
 * table has no key called `default`, so the loop cannot eat one.
 */
function table(module: unknown): Messages {
  let value = module;
  while (value && typeof value === "object" && "default" in (value as object)) {
    value = (value as { default: unknown }).default;
  }
  return (value ?? {}) as Messages;
}

/**
 * What "every inventory" means, and what each one is *shaped* like — asked of
 * the registry rather than remembered.
 *
 * `./instruments` argues the general case: a hand-written array of ids is the
 * one shape of coverage test that fails silently, because it looks like
 * coverage from the outside and is wrong exactly once per new instrument.
 * `coverage.spec.ts` was fixed for precisely that, and an inventory spec that
 * then pasted eight ids of its own back in would have reintroduced it one file
 * later.
 *
 * This file goes one step further than a list of ids, and it has to. The
 * assertions the inventories need are about *structure* — which items belong to
 * one block, which page a section owns, which block is private, which questions
 * have no options at all — and every one of those is knowable only from the
 * instrument's own `form()`. Writing them down here would be the same mistake
 * in a longer form: `money-management` would still be the only bank with a
 * private block on the day somebody marked a second one, and nothing would go
 * red.
 *
 * So the shape is *computed*, from the same `form(t)` the take page calls, with
 * the same translator, in the same language. What the tests then assert is that
 * the page agrees with it.
 *
 * Keep this file free of `@playwright/test`, for the reason `./instruments`
 * gives: `test/e2e/coverage-list.test.ts` reads it from Vitest, and that fence
 * is what stops the derivation being quietly replaced by a copy of its output.
 */

/** The inventories, in catalogue order, from the registry that files them. */
export const INVENTORIES: string[] = registry.byFamily("inventory").map((m) => m.spec.id);

/** One block: the question, and every item the expansion derived from it. */
export type Block = {
  /** The block id, which is also the id of the item asking the question. */
  id: string;
  /** Every derived id, the lead item included, in declared order. */
  items: string[];
  /** `<id>.weight`, where the block asks for one. */
  weight: string | null;
  /** `<id>.why`, which every block has and which is private in all of them. */
  why: string | null;
  section: string | undefined;
  /** The whole block is withheld — question, grounds, weight and reason. */
  private: boolean;
};

export type Shape = {
  id: string;
  /** The instrument's own name, as the catalogue prints it. */
  title: string;
  items: Item[];
  byId: Map<string, Item>;
  blocks: Block[];
  /**
   * `text` items that are not part of a block.
   *
   * `good-life` is the only bank in the eight with any, and they are found by
   * their shape rather than by its name: a question with no options, no weight
   * beside it and no group around it. A second bank that grew some would be
   * covered on the day it did.
   */
  openItems: string[];
  /** The section title a page of this section must show, or null if it wrote none. */
  sectionTitle(section: string | undefined): string | null;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

/**
 * The instrument as the take page builds it.
 *
 * `form(scoped.t, locale)` is copied from `app/[locale]/tests/[id]/take/page.tsx`
 * verbatim — same translator, same locale — so a prompt resolved here is the
 * string the reader is looking at rather than an approximation of it.
 */
export async function shapeOf(id: string, locale: Locale = "en"): Promise<Shape> {
  // Not `module`: Next's lint refuses that name outright, because assigning to
  // it inside a file the bundler may treat as CommonJS shadows the real one.
  const instrument = registry.get(id);
  if (!instrument) throw new Error(`no instrument registered as "${id}"`);
  const { spec } = instrument;
  // `getInstrumentI18n` assembled the same four tables and is not used, only
  // because it reaches `spec.messages` through the dynamic import this runner
  // double-wraps. Everything else here is that function, inlined.
  const own = (tag: Locale) =>
    spec.messages[tag]().then((m) => Object.fromEntries(Object.entries(table(m)).map(([k, v]) => [`${spec.id}.${k}`, v])));
  const messages = { ...SHELL[locale], ...(await own(locale)) };
  const fallbackMessages = locale === "en" ? messages : { ...SHELL.en, ...(await own("en")) };
  const scoped = createI18n({ locale, messages, fallbackMessages }).scope(spec.id);
  const form = spec.form(scoped.t, locale);
  if (form.kind !== "items") throw new Error(`"${id}" is not an item form`);
  const items = (form as ItemsForm).items;
  const byId = new Map(items.map((item) => [item.id, item]));

  const blocks: Block[] = [];
  for (const item of items) {
    // The lead item of a block is the one whose id *is* its group. Everything
    // else with that group was derived from it. An item with no group is not
    // part of a block at all — see `openItems`.
    if (!item.group || item.group !== item.id) continue;
    const members = items.filter((i) => i.group === item.id);
    blocks.push({
      id: item.id,
      items: members.map((i) => i.id),
      weight: members.find((i) => i.id === `${item.id}.weight`)?.id ?? null,
      why: members.find((i) => i.id === `${item.id}.why`)?.id ?? null,
      section: item.section,
      // The tier of the item asking the question is the only one that can tell
      // a private block from an ordinary one: `<id>.why` is private in every
      // block by construction. `core/registry.ts` says the same thing where it
      // validates the rule.
      private: item.tier === "private",
    });
  }

  const openItems = items.filter((item) => item.kind === "text" && !item.group).map((item) => item.id);

  return {
    id,
    title: scoped.t("title"),
    items,
    byId,
    blocks,
    openItems,
    // The runner's own question, asked the runner's own way: `sectionHeader`
    // draws a title only for a section whose bank wrote one, so a test that
    // demanded one from every section would fail on a decision rather than on
    // a defect.
    sectionTitle: (section) =>
      section && scoped.defines(`section.${section}.title`) ? scoped.t(`section.${section}.title`) : null,
    t: scoped.t,
  };
}
