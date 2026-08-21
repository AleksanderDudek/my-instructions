import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const run = promisify(execFile);

/**
 * The single-file build is a second, independent way of loading the same code,
 * and it is the one nobody exercises during development. These tests are the
 * only thing standing between a working dev server and a broken artifact.
 */
const built = await run(process.execPath, ["tools/build.mjs"], { cwd: ROOT })
  .then(() => readFile(new URL("../dist/my-instructions.html", import.meta.url), "utf8"));

const script = built.match(/<script>\n([\s\S]*)<\/script>/)[1];

test("the bundle is syntactically valid JavaScript", () => {
  assert.doesNotThrow(() => new Function(script));
});

test("no module syntax survives the transform", () => {
  assert.equal(script.match(/^\s*import\s/gm), null);
  assert.equal(script.match(/^\s*export\s/gm), null);
  assert.ok(!script.includes("import.meta"));
});

test("every module the entry needs is present in the registry", () => {
  const declared = new Set([...script.matchAll(/^  "([^"]+\.js)": function/gm)].map((m) => m[1]));
  const required = new Set([...script.matchAll(/__require\("([^"]+)"\)/g)].map((m) => m[1]));
  for (const path of required) assert.ok(declared.has(path), `__require("${path}") has no definition`);
  assert.ok(declared.size >= 20, `only ${declared.size} modules bundled`);
});

test("lazily loaded locales are bundled, not left to be fetched", () => {
  // In the browser a locale arrives by dynamic import, which is what keeps an
  // English reader from downloading Polish. The single-file artifact has no
  // server to fetch from, so the bundler follows those imports too and the
  // call sites keep their `await` against an already-resolved promise.
  const declared = new Set([...script.matchAll(/^  "([^"]+\.js)": function/gm)].map((m) => m[1]));
  const locales = [...declared].filter((path) => /i18n\/[a-z]{2}\.js$/.test(path));
  assert.ok(locales.length >= 2, `expected message files in the bundle, found ${locales.length}`);
  // Comments come out first: registry.js documents the plugin contract with a
  // worked import() in its header, and the bundler leaves prose alone.
  const code = script.replace(/\/\*[\s\S]*?\*\//g, "");
  assert.ok(!/\bimport\(/.test(code), "a dynamic import survived the transform");
});

test("dependencies are defined before the entry runs them", () => {
  // The registry is emitted in post-order, so a module's dependencies always
  // appear above it. That is what makes the four-line `__require` sufficient.
  const order = [...script.matchAll(/^  "([^"]+\.js)": function/gm)].map((m) => m[1]);
  assert.equal(order.at(-1), "src/main.js");
});

test("the page carries its own styles and markup, not links to them", () => {
  assert.ok(built.includes("<style>"), "styles were not inlined");
  assert.ok(!built.includes('href="./styles.css"'), "a relative stylesheet link survived");
  assert.ok(!built.includes('src="./src/main.js"'), "a relative script link survived");
  assert.ok(built.includes('id="view"'), "the mount point is missing");
  assert.ok(built.includes('id="nav"'), "the nav is missing");
});

test("only the font CDN is referenced — the artifact must not need anything else", () => {
  const hosts = new Set([...built.matchAll(/https?:\/\/([^/"')\s]+)/g)].map((m) => m[1]));
  hosts.delete("fonts.googleapis.com");
  hosts.delete("fonts.gstatic.com");
  hosts.delete("www.w3.org"); // SVG namespaces, not a network request
  assert.deepEqual([...hosts], []);
});
