import { describe, expect, test } from "vitest";
import { score, instructions } from "@/instruments/under-pressure/spec";
import { ITEMS } from "@/instruments/under-pressure/items";
import { identity } from "@/core/registry";
import type { Answers } from "@/core/types";

function answering(level: (scale: string) => number): Answers {
  const answers: Answers = {};
  for (const item of ITEMS) answers[item.id] = item.reverse ? 6 - level(item.scale) : level(item.scale);
  return answers;
}

describe("under-pressure", () => {
  test("four scales, eight items each, half reverse-keyed", () => {
    for (const s of ["control", "commitment", "challenge", "confidence"]) {
      const mine = ITEMS.filter((i) => i.scale === s);
      expect(mine).toHaveLength(8);
      expect(mine.filter((i) => i.reverse)).toHaveLength(4);
    }
  });

  test("overall is the average, because all four scales point the same way", () => {
    const r = score(answering((s) => (s === "challenge" ? 5 : s === "confidence" ? 1 : 3)));
    expect(r.scores.challenge).toBe(100);
    expect(r.scores.confidence).toBe(1);
    expect(r.overall).toBe(Math.round((100 + 1 + r.scores.control + r.scores.commitment) / 4));
    expect(r.marked.map((m) => m.key).sort()).toEqual(["challenge", "confidence"]);
  });

  test("marked scales become cards in their channels; a flat profile gets one", () => {
    const r = score(answering((s) => (s === "challenge" ? 5 : s === "confidence" ? 1 : 3)));
    expect(instructions(r, identity).map((c) => [c.channel, c.body])).toEqual([
      ["work", "trait.challenge.ask.high"],
      ["communication", "trait.confidence.ask.low"],
    ]);
    const flat = score(answering(() => 3));
    expect(flat.flat).toBe(true);
    expect(instructions(flat, identity).map((c) => c.title)).toEqual(["instructions.flatTitle"]);
  });

  test("the same box all the way down is flagged", () => {
    const answers: Answers = Object.fromEntries(ITEMS.map((i) => [i.id, 4]));
    expect(score(answers).suspect).toBe(true);
  });
});
