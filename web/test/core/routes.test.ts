import { describe, expect, test } from "vitest";
import { isFocusFlow, parentOf } from "@/components/shell/routes";

describe("parentOf", () => {
  test.each(["/en", "/en/", "/pl/tests", "/de/paths", "/es/instructions", "/en/sharing", "/en/panel"])(
    "%s is a top-level destination",
    (path) => expect(parentOf(path)).toBeNull(),
  );

  test("a test's page goes up to the catalogue", () => {
    expect(parentOf("/pl/tests/big-five")).toEqual({ href: "/pl/tests", label: "tests" });
    expect(parentOf("/pl/tests/big-five/")).toEqual({ href: "/pl/tests", label: "tests" });
  });

  test("taking and reading a test go up to that test", () => {
    expect(parentOf("/en/tests/riasec/take")).toEqual({ href: "/en/tests/riasec", label: "back" });
    expect(parentOf("/en/tests/riasec/result/")).toEqual({ href: "/en/tests/riasec", label: "back" });
  });

  test("a received link goes up to the app", () => {
    expect(parentOf("/de/p")).toEqual({ href: "/de", label: "home" });
    expect(parentOf("/de/report/")).toEqual({ href: "/de", label: "home" });
  });
});

describe("isFocusFlow", () => {
  test("only taking a test", () => {
    expect(isFocusFlow("/en/tests/big-five/take")).toBe(true);
    expect(isFocusFlow("/en/tests/big-five/take/")).toBe(true);
    expect(isFocusFlow("/en/tests/big-five")).toBe(false);
    expect(isFocusFlow("/en/tests/big-five/result")).toBe(false);
    expect(isFocusFlow("/en/tests")).toBe(false);
  });
});
