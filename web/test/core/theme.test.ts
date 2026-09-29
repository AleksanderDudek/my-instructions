import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { GROUND, resolveTheme, THEME_KEY, THEME_SCRIPT } from "@/core/theme";

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
    const meta = { name: "", content: "" };
    const env = {
      document: {
        documentElement: root,
        head: { appendChild: () => {} },
        querySelector: () => null,
        createElement: () => meta,
      },
      matchMedia: () => ({ matches: prefersLight, addEventListener: () => {} }),
      localStorage: {
        getItem: (k: string) => {
          if (throwing) throw new Error("denied");
          return k === THEME_KEY ? stored : null;
        },
      },
    };
    new Function("document", "matchMedia", "localStorage", THEME_SCRIPT)(env.document, env.matchMedia, env.localStorage);
    lastChrome = meta.content;
    return root.dataset.theme;
  }
  let lastChrome = "";

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

  test("the browser chrome is painted in the resolved theme's ground", () => {
    run("white", false);
    expect(lastChrome).toBe(GROUND.white);
    run(null, false);
    expect(lastChrome).toBe(GROUND.dark);
  });

  test("storage that throws still resolves from the OS", () => {
    expect(run("white", true, true)).toBe("light");
  });
});

/** GROUND is a copy of the stylesheet's grounds; a copy that drifts paints the wrong bar. */
test("GROUND matches --color-ground in globals.css for every theme", () => {
  const css = readFileSync(join(__dirname, "../../src/app/globals.css"), "utf8");
  const ground = (block: string) => block.match(/--color-ground:\s*(#[0-9a-f]{6})/i)?.[1];
  const theme = (sel: string) => css.slice(css.indexOf(sel));
  expect(ground(css.slice(css.indexOf("@theme")))).toBe(GROUND.dark);
  expect(ground(theme(':root[data-theme="light"]'))).toBe(GROUND.light);
  expect(ground(theme(':root[data-theme="white"]'))).toBe(GROUND.white);
});
