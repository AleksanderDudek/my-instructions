/**
 * Inlines the whole app into dist/ninefold.html.
 *
 * Claude Artifacts (and any single-file host) need one self-contained document,
 * so the module graph is concatenated in dependency order and the import/export
 * lines are stripped — every module then shares one scope, which is why every
 * top-level name in src/ is unique. This is deliberately not a bundler: five
 * modules with a linear dependency chain do not need one.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const ORDER = ["src/data.js", "src/calendar.js", "src/numerology.js", "src/views.js", "src/main.js"];

const read = (rel) => readFile(join(ROOT, rel), "utf8");

/** Remove module syntax; single-line `import`/`export {}` forms are all this project uses. */
function stripModuleSyntax(code) {
  return code
    .replace(/^import\s+[^;]*?;\s*$/gm, "")
    .replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm, "")
    .replace(/^export\s+(const|function|class|let)\b/gm, "$1")
    .trim();
}

const [html, css] = await Promise.all([read("index.html"), read("styles.css")]);
const modules = await Promise.all(ORDER.map(read));

const script = modules
  .map((code, i) => `/* ── ${ORDER[i]} ${"─".repeat(Math.max(0, 56 - ORDER[i].length))} */\n${stripModuleSyntax(code)}`)
  .join("\n\n");

// The Artifact host supplies <!doctype>, <html>, <head> and <body>; emit only the contents.
const inner = html.split("<body>")[1].split("</body>")[0]
  .replace(/<script type="module"[^>]*><\/script>/, "");
const fontLink = html.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]*">/)[0];

const out = `<title>Ninefold Almanac</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontLink}
<style>
${css}
</style>
${inner.trim()}

<script>
(() => {
"use strict";

${script}

})();
</script>
`;

await mkdir(join(ROOT, "dist"), { recursive: true });
await writeFile(join(ROOT, "dist/ninefold.html"), out);
console.log(`dist/ninefold.html — ${(out.length / 1024).toFixed(1)} kB, ${ORDER.length} modules inlined`);
