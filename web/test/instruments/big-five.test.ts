import { describe, expect, test } from "vitest";
import { ITEMS, ORDER } from "@/instruments/big-five/items";
import { score } from "@/instruments/big-five/spec";
import type { Answers } from "@/core/types";

/**
 * The bank is IPIP's, keyed as IPIP publishes it. These fixtures are the key
 * page's own counts (https://ipip.ori.org/newBigFive5broadKey.htm): ten
 * items a factor, with the published split of forward and reverse items —
 * and factor IV's split mirrored, because IPIP keys Emotional Stability and
 * the app reports reactivity.
 */
describe("big-five (IPIP-50)", () => {
  test("fifty items, ten a factor, keyed as published", () => {
    expect(ITEMS).toHaveLength(50);
    const split = (f: string) => {
      const mine = ITEMS.filter((i) => i.scale === f);
      return `${mine.filter((i) => !i.reverse).length}+/${mine.filter((i) => i.reverse).length}-`;
    };
    expect(split("extraversion")).toBe("5+/5-");
    expect(split("agreeableness")).toBe("6+/4-");
    expect(split("conscientiousness")).toBe("6+/4-");
    // IPIP: Emotional Stability 2+/8−; reactivity is its mirror.
    expect(split("reactivity")).toBe("8+/2-");
    expect(split("openness")).toBe("7+/3-");
    expect(ORDER).toHaveLength(5);
  });

  test("ids are IPIP's item numbers, so the four language tables line up by number", () => {
    expect(ITEMS.map((i) => i.id)).toEqual(Array.from({ length: 50 }, (_, n) => `i${n + 1}`));
    // Item 1 "Am the life of the party" (E+), item 4 "Get stressed out easily" (ES−, so reactivity+).
    expect(ITEMS[0]).toMatchObject({ scale: "extraversion", reverse: false });
    expect(ITEMS[3]).toMatchObject({ scale: "reactivity", reverse: false });
    expect(ITEMS[8]).toMatchObject({ scale: "reactivity", reverse: true }); // 9 "Am relaxed most of the time"
  });

  test("a calm reader scores low on reactivity, a stressed one high", () => {
    const answer = (level: (item: (typeof ITEMS)[number]) => number): Answers =>
      Object.fromEntries(ITEMS.map((i) => [i.id, level(i)]));
    const calm = score(answer((i) => (i.scale === "reactivity" ? (i.reverse ? 5 : 1) : 3)));
    const stressed = score(answer((i) => (i.scale === "reactivity" ? (i.reverse ? 1 : 5) : 3)));
    expect(calm.scores.reactivity).toBe(1);
    expect(stressed.scores.reactivity).toBe(100);
    expect(calm.scores.extraversion).toBe(50);
  });
});
