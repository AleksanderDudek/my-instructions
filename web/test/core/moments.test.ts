import { describe, expect, test } from "vitest";
import { momentAfter, SHEET_READY } from "@/core/moments";

describe("momentAfter", () => {
  test("the first instrument ever finished is the first moment", () => {
    expect(momentAfter([], "riasec")).toBe("first");
  });

  test("the instrument that fills the sheet is the sheet moment", () => {
    const prior = Array.from({ length: SHEET_READY - 1 }, (_, i) => `t${i}`);
    expect(momentAfter(prior, "new")).toBe("sheet");
  });

  test("a retake is never announced again", () => {
    expect(momentAfter(["riasec"], "riasec")).toBeNull();
    const prior = Array.from({ length: SHEET_READY }, (_, i) => `t${i}`);
    expect(momentAfter(prior, "t0")).toBeNull();
  });

  test("the steps between mark nothing", () => {
    expect(momentAfter(["a"], "b")).toBeNull();
    expect(momentAfter(Array.from({ length: SHEET_READY }, (_, i) => `t${i}`), "more")).toBeNull();
  });
});
