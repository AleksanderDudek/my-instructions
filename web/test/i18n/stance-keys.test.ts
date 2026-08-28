import { describe, expect, test } from "vitest";
import { DEFAULT_LOCALE, loadShell } from "@/core/locales";
import { registry } from "@/instruments";
import type { Form, Item } from "@/core/types";

/**
 * An inventory's questions and its words cannot drift apart.
 *
 * The eight banks under `docs/banks/` are where these sentences were written
 * and critiqued; `src/instruments/<id>/i18n/en.ts` is the same sentences keyed
 * the way `core/stance.ts` looks them up. `scripts/bank-to-messages.mjs` makes
 * the second from the first, which is a convenience. This is the protection,
 * and it holds whether or not anybody ever runs that script — including when
 * somebody adds a block by hand, or renames an option value, or deletes a
 * question and leaves its options behind.
 *
 * Both directions are checked, and the second is the one worth explaining.
 *
 * **A key the form asks for and the table does not define** is visible: `t`
 * renders the key itself, so the reader is shown `stance.small-talk.opt.none`
 * where an answer should be. Loud, but only to whoever loads that page in that
 * language, and the console warning it also emits is on a server nobody is
 * reading. A rename lands in production looking like a typo.
 *
 * **A key the table defines and the form never asks for** is invisible, and is
 * the more expensive of the two. It is what a deleted option, a renamed block
 * or a cut question leaves behind, and nothing downstream can tell the
 * difference between a stale key and a key some other page uses — so the words
 * sit in four locale files, get translated again on the next pass, and pass
 * every test in this directory. The stray key is not the bug; it is the
 * receipt for one, and the question it belonged to is the thing that went
 * missing.
 *
 * ── Why English alone ─────────────────────────────────────────────────
 *
 * `test/i18n/parity.test.ts` already asserts that every locale defines exactly
 * the keys English defines. So English is the whole surface: a key checked here
 * is checked in Polish, Spanish and German by that test, and adding three more
 * locales to this one would re-run the same comparison against a set that is
 * already proved identical.
 *
 * ── Why `stance.*` and not every key ──────────────────────────────────
 *
 * These are the keys nobody writes by hand. `stance.<id>.prompt` and
 * `stance.<id>.opt.<value>` are derived from a declaration in `blocks.ts` and
 * exist only because `stanceItems` asked for them, so "the form asks for
 * exactly these" is a true statement about them and is the whole of their
 * contract. `title`, `card.*` and `playbook.*` are not like that: a card
 * heading is looked up by `instructions()` from a list in `spec.ts`, and a
 * playbook line is looked up only when a reader's own answers earn it, so a
 * form-driven check would report every line nobody triggered as unused. Those
 * belong to `registry.validate()` and to the instrument's own tests.
 */

const identity = (key: string) => key;

/**
 * Every message key a form asks for, at the moment it is built.
 *
 * `form()` is called with an identity translator, so each string it puts on an
 * item *is* the key. That is the same trick `readability.test.ts` uses, and it
 * is what makes this a test of the live form rather than of a list somebody
 * maintains beside it: a block added to `blocks.ts` this afternoon is in here
 * this afternoon, with no second place to remember.
 */
function keysAsked(form: Form): Set<string> {
  const keys = new Set<string>();
  const add = (value: string | undefined) => {
    if (value) keys.add(value);
  };

  if (form.kind === "items") {
    for (const item of form.items as Item[]) {
      add(item.prompt);
      // Every optional word on every item kind. A rating's end labels and a
      // text item's placeholder are looked up exactly like a prompt is, and
      // leaving either out would let a missing one through here and print it
      // at the reader.
      if (item.kind === "choice" || item.kind === "multi") for (const option of item.options) add(option.label);
      if (item.kind === "rating") {
        add(item.minLabel);
        add(item.maxLabel);
      }
      if (item.kind === "text") add(item.placeholder);
    }
  } else {
    for (const field of form.fields) {
      add(field.label);
      add(field.placeholder);
      for (const option of field.options ?? []) add(option.label);
    }
  }
  return keys;
}

const inventories = registry.all().filter((module) => module.spec.family === "inventory");

/**
 * Thrown at collection, not asserted in a test.
 *
 * With no inventories `describe.each` generates no cases, nothing is compared,
 * and the file passes — which is the one outcome a drift check must not have.
 * The eight banks are being ported one at a time, so the count this file
 * protects is going to change; that it is greater than zero is not.
 */
if (inventories.length === 0) {
  throw new Error("stance-keys: no instrument declares family \"inventory\" — this suite would compare nothing");
}

describe.each(inventories.map((module) => module.spec.id))("%s", (id) => {
  const spec = registry.get(id)!.spec;

  test("asks for no stance key that nothing defines", async () => {
    const own = (await spec.messages[DEFAULT_LOCALE]()).default as Record<string, string>;
    const shell = await loadShell(DEFAULT_LOCALE);

    const asked = [...keysAsked(spec.form(identity, DEFAULT_LOCALE))].filter((key) => key.startsWith("stance."));
    // A form that asks for no stance key at all is not an inventory that
    // happens to be quiet — it is a form that failed to build, and it would
    // satisfy both assertions below without comparing anything.
    expect(asked.length, `${id} builds a form with no stance keys in it`).toBeGreaterThan(0);

    // Own table first, then the shell — which is exactly what the scoped `t`
    // in `core/i18n.ts` does. `stance.weightPrompt` and the four beside it are
    // deliberately shell copy: eight instruments asking "how important is this
    // to you?" in eight message files is eight chances for one of them to ask
    // it differently.
    const undefinedKeys = asked.filter((key) => !(key in own) && !(key in shell));
    expect({ id, undefined: undefinedKeys }).toEqual({ id, undefined: [] });
  });

  test("defines no stance key that nothing asks for", async () => {
    const own = (await spec.messages[DEFAULT_LOCALE]()).default as Record<string, string>;
    const asked = keysAsked(spec.form(identity, DEFAULT_LOCALE));

    const unused = Object.keys(own).filter((key) => key.startsWith("stance.") && !asked.has(key));
    expect({ id, unused }).toEqual({ id, unused: [] });
  });
});
