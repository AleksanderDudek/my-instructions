import { describe, expect, test } from "vitest";
import { compare, instructions, quadrantOf, score } from "@/instruments/interpersonal/spec";
import { ITEMS, ORDER } from "@/instruments/interpersonal/items";
import { identity } from "@/core/registry";
import type { Answers } from "@/core/types";

/** Answer so that each octant lands where `level` says (1..5, all items forward). */
function answering(level: (octant: string) => number): Answers {
  return Object.fromEntries(ITEMS.map((i) => [i.id, level(i.scale)]));
}

describe("interpersonal", () => {
  test("eight octants of four forward-keyed items, in the circle's order", () => {
    expect(ORDER).toEqual(["pa", "bc", "de", "fg", "hi", "jk", "lm", "no"]);
    for (const key of ORDER) expect(ITEMS.filter((i) => i.scale === key)).toHaveLength(4);
    expect(ITEMS.some((i) => "reverse" in i && i.reverse)).toBe(false);
  });

  test("a neutral reader sits at the centre of both axes", () => {
    const r = score(answering(() => 3));
    expect(r.dominance).toBe(50);
    expect(r.warmth).toBe(50);
    expect(r.quadrant).toBe("centred");
    expect(r.leading).toHaveLength(8);
  });

  test("the axes follow the octants that load on them", () => {
    const dominant = score(answering((o) => (o === "pa" ? 5 : o === "hi" ? 1 : 3)));
    // One pure octant at the top and its opposite at the bottom reach about
    // 71: the axis also counts the two diagonals, so 100 needs all three.
    expect(dominant.dominance).toBeGreaterThan(65);
    expect(dominant.warmth).toBe(50);
    const warm = score(answering((o) => (o === "lm" ? 5 : o === "de" ? 1 : 3)));
    expect(warm.warmth).toBeGreaterThan(65);
    expect(warm.dominance).toBe(50);
    // A diagonal octant moves both axes, each by cos 45° of a pure one.
    const gregarious = score(answering((o) => (o === "no" ? 5 : 3)));
    expect(gregarious.dominance).toBeGreaterThan(50);
    expect(gregarious.warmth).toBeGreaterThan(50);
    expect(gregarious.dominance).toBeLessThan(dominant.dominance);
  });

  test("quadrants need distance from the centre", () => {
    expect(quadrantOf(55, 55)).toBe("centred");
    expect(quadrantOf(70, 70)).toBe("warmDominant");
    expect(quadrantOf(30, 70)).toBe("warmYielding");
    expect(quadrantOf(70, 30)).toBe("coolDominant");
    expect(quadrantOf(30, 30)).toBe("coolYielding");
    // One axis far out is enough to leave the centre.
    expect(quadrantOf(75, 50)).toBe("warmDominant");
  });

  test("two cards, one per channel, in the quadrant's voice", () => {
    const r = score(answering((o) => (o === "bc" || o === "pa" ? 5 : 2)));
    const cards = instructions(r, identity);
    expect(cards.map((c) => c.channel)).toEqual(["communication", "conflict"]);
    expect(cards[0].body).toBe(`quadrant.${r.quadrant}.talk`);
  });

  test("a comparison reports two levels per axis and the widest octant gap, never a similarity", () => {
    const a = score(answering((o) => (o === "pa" ? 5 : 3)));
    const b = score(answering((o) => (o === "hi" ? 5 : 3)));
    const c = compare(a, b);
    expect(c.axes.map((g) => g.key)).toEqual(["dominance", "warmth"]);
    expect(c.axes[0].gap).toBeGreaterThan(15);
    expect(c.axes[1].gap).toBe(0);
    expect(["pa", "hi"]).toContain(c.widest.key);
    expect(Object.keys(c)).not.toContain("similarity");
  });
});
