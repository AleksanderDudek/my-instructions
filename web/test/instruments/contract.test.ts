import { describe, expect, test } from "vitest";
import { registry } from "@/instruments";
import { audiencesFor } from "@/core/audience";
import { identity } from "@/core/registry";
import type { Answers } from "@/core/types";

/**
 * What every instrument owes the platform, asserted once for all of them.
 *
 * `createRegistry` already runs `validate` at import time, so a broken module
 * cannot even reach this file. What is left here is the behaviour a type
 * cannot state: that scoring is pure, that it never returns words, and that
 * declared privacy flags actually hold.
 */
describe.each(registry.all().map((m) => [m.spec.id, m] as const))("%s", (_id, instrument) => {
  const { spec } = instrument;
  const form = spec.form(identity, "en");

  /** Answer everything, by kind, so a bank of any shape gets exercised. */
  const answers: Answers = {};
  if (form.kind === "items") {
    for (const [n, item] of form.items.entries()) {
      if (item.kind === "likert") {
        const scale = form.scale!;
        answers[item.id] = scale.min + (n % (scale.max - scale.min + 1));
      } else if (item.kind === "multi") {
        answers[item.id] = [item.options[0].value];
      } else if (item.kind === "rating") {
        answers[item.id] = item.min + (n % (item.max - item.min + 1));
      } else if (item.kind === "text") {
        // Short, and prose. If any of it reaches a result, the language-free
        // test below has something recognisable to fail on.
        answers[item.id] = "Because of how I was raised.";
      } else {
        answers[item.id] = item.options[n % item.options.length].value;
      }
    }
  } else {
    for (const field of form.fields) {
      answers[field.id] =
        field.kind === "multi" ? [field.options?.[0]?.value ?? ""] : (field.value ?? (field.kind === "text" ? "Ada" : field.min ?? 1));
    }
  }

  test("names itself in words rather than in code", () => {
    expect(spec.id).toMatch(/^[a-z0-9-]+$/);
    expect(spec.glyph.length).toBeGreaterThan(0);
    expect(spec.minutes).toBeGreaterThan(0);
    expect(["free", "premium"]).toContain(spec.tier);
  });

  test("scoring is pure and deterministic", () => {
    const once = JSON.stringify(spec.score(answers));
    const twice = JSON.stringify(spec.score(answers));
    expect(once).toBe(twice);
    // Scoring must not mutate what it was handed; a store hands it the real
    // answers object, not a copy.
    const guarded = { ...answers };
    spec.score(guarded);
    expect(guarded).toEqual(answers);
  });

  test("scoring is language-free", () => {
    // A result is stored, shared and re-read in another language. Any word in
    // it is a word that cannot be translated later.
    const result = JSON.stringify(spec.score(answers));
    const suspicious = result.match(/"[^"]* [^"]{6,}"/g) ?? [];
    expect(suspicious, "score() returned prose").toEqual([]);
  });

  test("a result survives a JSON round trip", () => {
    const result = spec.score(answers);
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });

  test("instruction cards are usable and correctly channelled", () => {
    const cards = spec.instructions(spec.score(answers), identity);
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      expect(spec.channels).toContain(card.channel);
      expect(card.title.length).toBeGreaterThan(0);
      expect(card.body.length).toBeGreaterThan(0);
    }
  });

  /**
   * A stance block expands into a question, an optional grounds list, a weight
   * and a reason — and each derived part is useless without the part it was
   * derived from. A `money.weight` whose `money` was renamed asks how important
   * nothing in particular is, and the runner will happily render it: the item
   * is well-formed, it simply no longer weighs anything.
   */
  test("every derived stance item still has the block it belongs to", () => {
    if (form.kind !== "items") return;
    const byId = new Map(form.items.map((i) => [i.id, i]));
    const orphans = form.items
      .filter((i) => /\.(weight|why|grounds)$/.test(i.id))
      .filter((i) => {
        const base = byId.get(i.id.replace(/\.(weight|why|grounds)$/, ""));
        return !base || base.group !== i.group || base.section !== i.section;
      })
      .map((i) => i.id);
    expect(orphans, "derived stance items with no block").toEqual([]);
  });

  test("a grouped question always ends up with somewhere to say why", () => {
    if (form.kind !== "items" || spec.family !== "inventory") return;
    const ids = new Set(form.items.map((i) => i.id));
    const groups = [...new Set(form.items.map((i) => i.group).filter((g): g is string => Boolean(g)))];
    expect(groups.filter((g) => !ids.has(`${g}.why`)), "stance blocks that never expanded").toEqual([]);
  });

  test("a stated reason never leaves the device", () => {
    if (form.kind !== "items") return;
    // The one rule in the item bank that an author does not get to override.
    // See the header of core/stance.ts: free text is the only answer in this
    // app whose contents nobody has reviewed.
    const leaky = form.items.filter((i) => i.id.endsWith(".why")).filter((i) => i.tier !== "private" || i.kind !== "text");
    expect(leaky.map((i) => i.id), "reasons that are shareable or not text").toEqual([]);
  });

  test("a stated position is never scored to a hundred", () => {
    if (spec.family !== "inventory") return;
    // No band(), no bars, no elevation. A 1..100 number attached to a position
    // somebody stated imports exactly the false precision the rest of the app
    // spends its copy apologising for — and unlike a questionnaire's, it would
    // be apologising for a claim nobody made.
    const result = spec.score(answers) as Record<string, unknown>;
    for (const forbidden of ["scores", "score", "band", "elevation", "percentile"]) {
      expect({ field: forbidden, present: forbidden in result }).toEqual({ field: forbidden, present: false });
    }
  });

  test("suggested lines are distinct and say something", () => {
    if (!spec.playbook) return;
    const book = spec.playbook(spec.score(answers), identity);
    const lines = [...book.ok, ...book.notOk];
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      expect(line.id.length).toBeGreaterThan(0);
      expect(line.text.length, `empty suggestion "${line.id}"`).toBeGreaterThan(0);
    }
    // Ids are what gets stored, so a duplicate is not cosmetic: ticking one of
    // the pair ticks both, and unticking either unticks both.
    const ids = lines.map((l) => l.id);
    expect(ids.length, "duplicate playbook suggestion ids").toBe(new Set(ids).size);
  });

  test("declared privacy actually holds", () => {
    if (spec.persistence === "session") {
      // Never written down, and therefore never linkable. Both halves matter:
      // a link in this app carries its own data, so a shareable session-only
      // instrument would outlive the thing deliberately never saved.
      expect(spec.maxAudience).toBe("private");
      expect(audiencesFor(spec)).toEqual(["private"]);
    }
    if (spec.sensitive) expect(spec.maxAudience).not.toBe("public");
    if (spec.pairwise) {
      expect(typeof spec.pairScore).toBe("function");
      expect(spec.persistence).toBe("session");
    }
  });
});
