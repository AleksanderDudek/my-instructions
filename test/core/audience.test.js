import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { AUDIENCE_ORDER, atLeast, SHAREABLE } from "../../src/core/audience.js";
import { AUDIENCES } from "../../src/core/report.js";
import { VISIBILITY } from "../../src/core/store.js";
import { audiencesFor } from "../../src/core/registry.js";

test("the ladder runs narrowest to widest and every level is a real one", () => {
  assert.deepEqual(AUDIENCE_ORDER, ["private", "partner", "friends", "public"]);
  assert.deepEqual(SHAREABLE, ["partner", "friends", "public"], "private is not a link you can make");
});

test("there is one ladder, not three copies that happen to agree", () => {
  // The store, the report codec and the registry each declared their own list
  // before this module existed. Adding a level to two of the three produces a
  // setting the sharing page offers and the encoder silently drops, which
  // looks from the outside like a partner just not being sent anything.
  assert.equal(AUDIENCES, AUDIENCE_ORDER);
  assert.equal(VISIBILITY, AUDIENCE_ORDER);

  const declared = [];
  for (const file of readdirSync("src/core")) {
    if (!file.endsWith(".js") || file === "audience.js") continue;
    const src = readFileSync(`src/core/${file}`, "utf8");
    if (/\[\s*"private"\s*,/.test(src)) declared.push(file);
  }
  assert.deepEqual(declared, [], "a second copy of the audience ladder has appeared");
});

test("a narrower mark never reaches a wider report, in either direction", () => {
  for (const element of AUDIENCE_ORDER) {
    for (const reader of AUDIENCE_ORDER) {
      const expected = element !== "private"
        && AUDIENCE_ORDER.indexOf(element) >= AUDIENCE_ORDER.indexOf(reader);
      assert.equal(atLeast(element, reader), expected, `${element} → ${reader}`);
    }
  }
});

test("private satisfies nothing, including a private report", () => {
  // Private is the absence of sharing rather than the narrowest kind of it.
  // A "private report" is a page the reader looks at themselves, and it is
  // built from their own store, not from a token.
  for (const reader of AUDIENCE_ORDER) assert.equal(atLeast("private", reader), false);
});

test("a ceiling truncates the ladder rather than filtering it", () => {
  assert.deepEqual(audiencesFor({ maxAudience: "partner" }), ["private", "partner"]);
  assert.deepEqual(audiencesFor({ maxAudience: "friends" }), ["private", "partner", "friends"]);
  assert.deepEqual(audiencesFor({}), AUDIENCE_ORDER, "no ceiling means the whole ladder");
  // An instrument capped at partner must not offer friends as a discouraged
  // button. A ceiling is an option that does not exist.
  assert.equal(audiencesFor({ maxAudience: "partner" }).includes("friends"), false);
});
