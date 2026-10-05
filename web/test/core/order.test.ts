import { describe, expect, test } from "vitest";
import { isSpaced, spaced } from "@/core/order";

describe("spaced", () => {
  const scaleOf = (id: string) => id[0];

  test("separates siblings a shuffle put together, keeping every item", () => {
    const order = ["a1", "a2", "b1", "a3", "b2", "c1", "c2", "b3"];
    const out = spaced(order, scaleOf);
    expect([...out].sort()).toEqual([...order].sort());
    expect(isSpaced(out, scaleOf)).toBe(true);
  });

  test("is deterministic and leaves an already-spaced order alone", () => {
    const order = ["a1", "b1", "a2", "b2"];
    expect(spaced(order, scaleOf)).toEqual(order);
    expect(spaced(["a1", "a2", "b1"], scaleOf)).toEqual(spaced(["a1", "a2", "b1"], scaleOf));
  });

  test("gives up gracefully when the bank cannot be spaced", () => {
    const out = spaced(["a1", "a2", "a3"], scaleOf);
    expect([...out].sort()).toEqual(["a1", "a2", "a3"]);
  });

  test("ignores items without a scale", () => {
    const out = spaced(["a1", "a2", "t1", "a3"], (id) => (id[0] === "t" ? undefined : id[0]));
    expect([...out].sort()).toEqual(["a1", "a2", "a3", "t1"]);
  });
});
