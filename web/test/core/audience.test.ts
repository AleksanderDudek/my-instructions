import { readFileSync, readdirSync } from "node:fs";
import { expect, test } from "vitest";
import { AUDIENCE_ORDER, atLeast, SHAREABLE, audiencesFor } from "@/core/audience";
import { AUDIENCES } from "@/core/report";

test("the ladder runs narrowest to widest", () => {
  expect(AUDIENCE_ORDER).toEqual(["private", "partner", "friends", "public"]);
  expect(SHAREABLE).toEqual(["partner", "friends", "public"]);
});

test("there is one ladder, not three copies that happen to agree", () => {
  // The store, the report codec and the registry each declared their own list
  // before `audience.ts` existed. Adding a level to two of three produces a
  // setting the sharing page offers and the encoder silently drops, which from
  // the outside looks like a partner simply not being sent anything.
  expect(AUDIENCES).toBe(AUDIENCE_ORDER);

  const declared = readdirSync("src/core")
    .filter((f) => f.endsWith(".ts") && f !== "audience.ts")
    .filter((f) => /\[\s*"private"\s*,/.test(readFileSync(`src/core/${f}`, "utf8")));
  expect(declared).toEqual([]);
});

test("a narrower mark never reaches a wider report, in either direction", () => {
  for (const element of AUDIENCE_ORDER) {
    for (const reader of AUDIENCE_ORDER) {
      const expected =
        element !== "private" && AUDIENCE_ORDER.indexOf(element) >= AUDIENCE_ORDER.indexOf(reader);
      expect(atLeast(element, reader), `${element} → ${reader}`).toBe(expected);
    }
  }
});

test("private satisfies nothing, including a private report", () => {
  // Private is the absence of sharing, not the narrowest kind of it.
  for (const reader of AUDIENCE_ORDER) expect(atLeast("private", reader)).toBe(false);
});

test("a ceiling truncates the ladder rather than filtering it", () => {
  expect(audiencesFor({ maxAudience: "partner" })).toEqual(["private", "partner"]);
  expect(audiencesFor({})).toEqual(AUDIENCE_ORDER);
  // A ceiling is an option that does not exist, not one that is discouraged.
  expect(audiencesFor({ maxAudience: "partner" })).not.toContain("friends");
});
