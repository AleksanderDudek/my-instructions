import { describe, expect, test } from "vitest";
import { resolveTheme, THEME_KEY, THEME_SCRIPT } from "@/core/theme";

describe("resolveTheme", () => {
  test("a stored choice wins over the OS", () => {
    expect(resolveTheme("white", false)).toBe("white");
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("light", false)).toBe("light");
  });

  test("system, nothing or junk follows the OS", () => {
    expect(resolveTheme(null, true)).toBe("light");
    expect(resolveTheme("system", false)).toBe("dark");
    expect(resolveTheme("sepia", true)).toBe("light");
  });
});

/**
 * The pre-paint script is a string, so nothing type-checks it. Run it against
 * a fake document and require it to agree with `resolveTheme` in every case.
 */
describe("THEME_SCRIPT", () => {
  function run(stored: string | null, prefersLight: boolean, throwing = false) {
    const root = { dataset: {} as Record<string, string> };
    const env = {
      document: { documentElement: root },
      matchMedia: () => ({ matches: prefersLight, addEventListener: () => {} }),
      localStorage: {
        getItem: (k: string) => {
          if (throwing) throw new Error("denied");
          return k === THEME_KEY ? stored : null;
        },
      },
    };
    new Function("document", "matchMedia", "localStorage", THEME_SCRIPT)(env.document, env.matchMedia, env.localStorage);
    return root.dataset.theme;
  }

  test.each([
    [null, true],
    [null, false],
    ["white", false],
    ["dark", true],
    ["light", false],
    ["junk", true],
  ] as const)("stored %s, prefers light %s", (stored, light) => {
    expect(run(stored, light)).toBe(resolveTheme(stored, light));
  });

  test("storage that throws still resolves from the OS", () => {
    expect(run("white", true, true)).toBe("light");
  });
});
