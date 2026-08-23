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
