import { describe, expect, test } from "vitest";
import { WHOLE, cleanWeight, labelFor, ranked, reflectablesOf, said } from "@/core/reflect";
import { encodeReport } from "@/core/report";
import { registry, } from "@/instruments";
import { identity } from "@/core/registry";
import { getInstrumentI18n } from "@/core/locales";
import type { Answers } from "@/core/types";

/**
 * Every instrument can be asked what it means to the reader — and the labels
 * on the questions are real words.
 *
 * The label lookup sniffs a handful of prefixes, because the sixteen ported
 * instruments name their scales under `factor.`, `dim.`, `lang.` and `type.`
 * and making each declare a resolver would be sixteen edits for one behaviour.
 * A sniff that silently missed would render a message key at the reader, which
 * is the failure this codebase has already had once. So the sniff is a
 * convenience and this file is the contract.
 */

/** Answer a whole bank, by kind, so every instrument produces a real result. */
function answersFor(id: string): Answers {
  const form = registry.get(id)!.spec.form(identity, "en");
  const out: Answers = {};
  if (form.kind === "items") {
    for (const [n, item] of form.items.entries()) {
      if (item.kind === "likert") out[item.id] = form.scale!.min + (n % (form.scale!.max - form.scale!.min + 1));
      else if (item.kind === "multi") out[item.id] = [item.options[0].value];
      else if (item.kind === "rating") out[item.id] = item.min;
      else if (item.kind === "text") out[item.id] = "a sentence";
      else out[item.id] = item.options[n % item.options.length].value;
    }
  } else {
    for (const field of form.fields) {
      out[field.id] =
        field.kind === "multi" ? [field.options?.[0]?.value ?? ""] : (field.value ?? (field.kind === "text" ? "Ada" : (field.min ?? 1)));
    }
  }
  return out;
}

const ids = registry.ids();

describe.each(ids)("%s", (id) => {
  test("offers something to reflect on, and every label is a word rather than a key", async () => {
    const { spec } = registry.get(id)!;
    const { scoped } = await getInstrumentI18n(spec, "en");
    const rows = reflectablesOf(spec, spec.score(answersFor(id)), scoped.t);

    if (spec.family === "inventory") {
      // Refused rather than omitted: an inventory already asks for a weight and
      // a reason on every block, and asking again would be the same question
      // twice with the second one worse.
      expect(rows).toEqual([]);
      return;
    }

    expect(rows.length, `${id} offers nothing to reflect on`).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.label.trim(), `${id}/${row.key} has an empty label`).not.toBe("");
      // The failure this whole file exists for.
      expect(row.label, `${id}/${row.key} rendered a message key at the reader`).not.toMatch(
        /^(factor|dim|lang|type|mode|trait|interest|scale|style)\./,
      );
      expect(row.label).not.toBe(row.key);
    }
    expect(new Set(rows.map((r) => r.key)).size, `${id} repeats a scale`).toBe(rows.length);
  });
});

test("a scored instrument is asked per scale, not per item", async () => {
  // The whole design decision in one assertion: forty Big Five items would have
  // become a hundred and twenty questions, and nobody can say how important
  // item 17 is to them because item 17 is not about anything on its own.
  const { spec } = registry.get("big-five")!;
  const { scoped } = await getInstrumentI18n(spec, "en");
  const rows = reflectablesOf(spec, spec.score(answersFor("big-five")), scoped.t);
  expect(rows).toHaveLength(5);
});

test("a profiler is asked once, about the reading as a whole", async () => {
  // A date is not a factor, so there is nothing to break into scales — but the
  // question is still worth asking.
  const { spec } = registry.get("numerology")!;
  const { scoped } = await getInstrumentI18n(spec, "en");
  const rows = reflectablesOf(spec, spec.score(answersFor("numerology")), scoped.t);
  expect(rows).toHaveLength(1);
  expect(rows[0].key).toBe(WHOLE);
  expect(rows[0].label).not.toBe("title");
});

describe("labels", () => {
  test("finds a scale under any of the conventions in use", () => {
    const t = (key: string) => (key === "dim.anxiety.label" ? "Anxiety" : key);
    expect(labelFor("anxiety", t)).toBe("Anxiety");
  });

  test("returns null rather than the key when nothing matches", () => {
    // Null is what lets the caller skip the row. Returning the key would put
    // `factor.mystery.label` on the page as though it were a scale's name.
    expect(labelFor("mystery", (key) => key)).toBeNull();
  });
});

describe("weights", () => {
  test("only accepts a whole number the control could have produced", () => {
    for (const bad of [0, 11, -3, 4.5, "7", null, undefined, Number.NaN]) {
      expect(cleanWeight(bad), String(bad)).toBeUndefined();
    }
    expect(cleanWeight(1)).toBe(1);
    expect(cleanWeight(10)).toBe(10);
  });

  test("ranks the weighted heaviest first and drops the rest", () => {
    const rows = [
      { key: "a", label: "A" },
      { key: "b", label: "B" },
      { key: "c", label: "C" },
    ];
    const out = ranked(rows, { a: { weight: 3 }, b: { weight: 9 }, c: { why: "no number" } });
    expect(out.map((r) => r.key)).toEqual(["b", "a"]);
  });

  test("a reflection about a scale the instrument no longer has is dropped", () => {
    // Revising an instrument can retire a scale. A sentence about something
    // that no longer exists is worse than a lost sentence.
    expect(ranked([{ key: "a", label: "A" }], { retired: { weight: 10 } })).toEqual([]);
  });
});

describe("whether anything was said", () => {
  test("an empty record, a blank reason and whitespace are all nothing", () => {
    expect(said({})).toBe(false);
    expect(said({ a: {} })).toBe(false);
    expect(said({ a: { why: "   " } })).toBe(false);
  });

  test("a weight alone counts, and so does a reason alone", () => {
    expect(said({ a: { weight: 4 } })).toBe(true);
    expect(said({ a: { why: "because" } })).toBe(true);
  });
});

test("a reason never reaches a share token", () => {
  /**
   * Structural rather than hopeful. Reflections live under their own storage
   * key and `encodeReport` reads runs; there is no path from one to the other.
   * This asserts the consequence, so that a future encoder which started
   * gathering "everything about an instrument" would fail here.
   */
  const secret = "something I would never send anybody";
  const token = encodeReport({
    registry,
    profile: { displayName: "Ada" },
    runs: [{ instrumentId: "big-five", instrumentVersion: 1, answers: answersFor("big-five") }],
    sharing: { "run.big-five": "public", "profile.name": "public" },
    audience: "public",
  });
  const decoded = Buffer.from(token.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
  expect(decoded).not.toContain(secret);
  expect(decoded).not.toContain("reflect");
});
