import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { validate } from "../../src/core/provenance.js";
import { registry } from "../helpers/harness.js";

/**
 * Every folder declares where its content came from.
 *
 * The practice of writing original items has been followed since the first
 * instrument and recorded only in prose at the top of each item bank — the kind
 * of record that is complete until somebody adds a folder in a hurry. This
 * enumerates the folders on disk rather than the registry, so a folder that
 * exists without provenance fails here even before it is registered.
 */

const DIR = fileURLToPath(new URL("../../src/instruments/", import.meta.url));
const folders = (await readdir(DIR, { withFileTypes: true }))
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

test("there is an instrument folder for every registered instrument and vice versa", () => {
  assert.deepEqual(folders.sort(), registry.all().map((s) => s.id).sort());
});

for (const folder of folders) {
  test(`${folder}: declares provenance, and it is well formed`, async () => {
    const mod = await import(`../../src/instruments/${folder}/provenance.js`);
    assert.doesNotThrow(() => validate(mod.default, folder));
  });

  test(`${folder}: reproduces nothing copyrighted and says what it avoided`, async () => {
    const p = (await import(`../../src/instruments/${folder}/provenance.js`)).default;
    assert.deepEqual(p.reproduces, [], "an instrument that must reproduce something is one we do not ship");
    assert.ok(Array.isArray(p.avoided), "list the named instruments deliberately not used, even if empty");
    assert.ok(p.construct.note.length > 40, "say in a sentence what was taken and what was not");
  });

  test(`${folder}: claims no inherited evidence`, async () => {
    const p = (await import(`../../src/instruments/${folder}/provenance.js`)).default;
    // The rule this file exists to enforce. Writing fresh items inherits the
    // idea of a construct and none of the evidence attached to the instrument
    // that established it, and every folder here writes fresh items.
    if (p.items.origin === "original") {
      assert.equal(p.evidence.reliability, "none");
      assert.equal(p.evidence.factorStructure, "none");
      assert.equal(p.evidence.criterion, "none");
    }
  });
}

test("the licence separates the code from the item banks", async () => {
  // The reason every folder writes its own items is that the published
  // instruments they are modelled on are protected. Taking that position
  // seriously means taking it in both directions.
  const licence = await readFile(new URL("../../LICENSE", import.meta.url), "utf8");
  assert.match(licence, /MIT/);
  assert.match(licence, /all rights reserved/i);
  assert.match(licence, /i18n/, "the licence must name what is not covered by the MIT grant");
});

test("provenance is not shipped to the browser", async () => {
  // It is documentation for maintainers and a test fixture, not runtime data.
  // Importing it from an index.js would put eleven files of prose into the
  // bundle for no reader's benefit.
  for (const folder of folders) {
    const index = await readFile(new URL(`../../src/instruments/${folder}/index.js`, import.meta.url), "utf8");
    assert.ok(!index.includes("provenance"), `${folder}/index.js imports provenance`);
  }
});
