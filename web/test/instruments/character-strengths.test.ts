import { describe, expect, test } from "vitest";
import { score, instructions, spec } from "@/instruments/character-strengths/spec";
import { ITEMS, ORDER } from "@/instruments/character-strengths/items";
import { reflectablesOf } from "@/core/reflect";
import { identity } from "@/core/registry";
import type { Answers } from "@/core/types";

/** Answer so that each strength's scale lands where `level` says (1..5 on its forward items). */
function answering(level: (strength: string) => number): Answers {
  const answers: Answers = {};
  for (const item of ITEMS) answers[item.id] = item.reverse ? 6 - level(item.scale) : level(item.scale);
  return answers;
}

describe("character-strengths", () => {
  test("reverse items are keyed backwards, so a consistent reader scores the ends", () => {
    const r = score(answering((s) => (s === "honesty" ? 5 : 1)));
    expect(r.scores.honesty).toBe(100);
    expect(r.scores.kindness).toBe(1);
  });

  test("the five highest are the signature, the three lowest are least used", () => {
    const top = ["humor", "hope", "kindness", "bravery", "curiosity"];
    const bottom = ["prudence", "regulation", "humility"];
    const r = score(answering((s) => (top.includes(s) ? 5 : bottom.includes(s) ? 1 : 3)));
    expect([...r.signature].sort()).toEqual([...top].sort());
    expect([...r.least].sort()).toEqual([...bottom].sort());
    expect(r.flat).toBe(false);
    expect(r.tiedAtCut).toBe(false);
  });

  test("a tie across the cut is reported, and broken by the classification's order", () => {
    const top = ["creativity", "curiosity", "judgment", "learning", "perspective", "bravery"];
    const r = score(answering((s) => (top.includes(s) ? 5 : 2)));
    expect(r.tiedAtCut).toBe(true);
    expect(r.signature).toEqual(top.slice(0, 5));
  });

  test("a tie across the bottom three is reported too", () => {
    const low = ["forgiveness", "humility", "prudence", "regulation"];
    const r = score(answering((s) => (low.includes(s) ? 1 : 4)));
    expect(r.tiedAtFloor).toBe(true);
    const clear = score(answering((s) => (low.slice(1).includes(s) ? 1 : 4)));
    expect(clear.tiedAtFloor).toBe(false);
  });

  test("a flat profile is not ranked into a false order", () => {
    const r = score(answering(() => 3));
    expect(r.flat).toBe(true);
    const cards = instructions(r, identity);
    expect(cards).toHaveLength(1);
    expect(cards[0].title).toBe("instructions.flatTitle");
  });

  test("one card per signature strength, in its own channel", () => {
    const top = ["love", "fairness", "zest", "prudence", "teamwork"];
    const r = score(answering((s) => (top.includes(s) ? 5 : 2)));
    // Tied at the top, so in the classification's order: zest (courage), love
    // (humanity), teamwork and fairness (justice), prudence (temperance).
    expect(instructions(r, identity).map((c) => c.channel)).toEqual(["energy", "affection", "work", "conflict", "rhythm"]);
  });

  test("the result page asks about the five, not all twenty-four", () => {
    const top = ["humor", "hope", "kindness", "bravery", "curiosity"];
    const r = score(answering((s) => (top.includes(s) ? 5 : 2)));
    const t = (k: string) => (k.startsWith("trait.") && k.endsWith(".label") ? `L:${k}` : k);
    expect(reflectablesOf(spec, r, t).map((row) => row.key).sort()).toEqual([...top].sort());
    // Flat: nothing to single out, so the reading is asked about as a whole.
    expect(reflectablesOf(spec, score(answering(() => 3)), t).map((row) => row.key)).toEqual(["_whole"]);
  });

  test("covers all twenty-four, three items each", () => {
    expect(ORDER).toHaveLength(24);
    expect(ITEMS).toHaveLength(72);
  });
});
