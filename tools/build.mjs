/**
 * Bundles the whole app into dist/my-instructions.html.
 *
 * The previous version of this file concatenated five modules and deleted the
 * import lines, which works exactly as long as no two modules declare the same
 * top-level name. At twenty-odd modules that assumption is a time bomb, so
 * each module now gets wrapped in its own function and a four-line registry
 * resolves the graph at runtime. That is a real module system, and it is still
 * small enough to read in one sitting — which is the reason not to install a
 * bundler for a project that installs nothing.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ENTRY = "src/main.js";

/* ── module graph ─────────────────────────────────────────────────
   Depth-first from the entry, following relative specifiers only.  */

const IMPORT_RE = /^\s*import\s+(?:([\s\S]*?)\s+from\s+)?["']([^"']+)["'];?\s*$/gm;
const EXPORT_FROM_RE = /^\s*export\s+\{[\s\S]*?\}\s+from\s+["']([^"']+)["'];?\s*$/gm;
/* Locales load lazily, so the graph has to follow `import("./i18n/pl.js")`
   as well. Only literal specifiers are followed — a computed path cannot be
   resolved by reading the source, and src/core/locales.js is written as a
   table of literals for exactly that reason. */
const DYNAMIC_IMPORT_RE = /\bimport\(\s*["']([^"']+)["']\s*\)/g;

async function collect(entry) {
  const modules = new Map(); // path -> { code, deps: Map<specifier, path> }
  const order = [];

  async function visit(rel) {
    if (modules.has(rel)) return;
    const code = await readFile(join(ROOT, rel), "utf8");
    const deps = new Map();
    for (const spec of specifiers(code)) {
      if (!spec.startsWith(".")) throw new Error(`${rel}: bare import "${spec}" — this build has no node_modules to resolve it from.`);
      const target = relative(ROOT, resolve(dirname(join(ROOT, rel)), spec)).replaceAll("\\", "/");
      deps.set(spec, target);
    }
    modules.set(rel, { code, deps });
    for (const target of deps.values()) await visit(target);
    order.push(rel);
  }

  /* Block comments come out first. src/core/registry.js documents the plugin
     contract with a worked `import("./i18n/en.js")` in its header, and a
     scanner that cannot tell code from prose goes looking for that file. */
  const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, "");

  function specifiers(code) {
    const out = new Set();
    const source = stripComments(code);
    for (const m of source.matchAll(IMPORT_RE)) out.add(m[2]);
    for (const m of source.matchAll(EXPORT_FROM_RE)) out.add(m[1]);
    for (const m of source.matchAll(DYNAMIC_IMPORT_RE)) out.add(m[1]);
    return out;
  }

  await visit(entry);
  return { modules, order };
}

/* ── transform ────────────────────────────────────────────────────
   Rewrites the handful of module forms this codebase actually uses.
   It is not a general ES-module parser and does not pretend to be:
   an unsupported form throws rather than silently mis-compiling.   */

function transform(rel, { code, deps }) {
  let out = code;

  // A dynamic import stays a promise so the call sites keep their `await`;
  // the module itself is already in the bundle, so nothing is fetched.
  out = out.replace(DYNAMIC_IMPORT_RE, (whole, spec) =>
    deps.has(spec) ? `Promise.resolve(__require(${JSON.stringify(deps.get(spec))}))` : whole);

  out = out.replace(IMPORT_RE, (line, clause, spec) => {
    if (!clause) return `__require(${JSON.stringify(deps.get(spec))});`;
    const path = JSON.stringify(deps.get(spec));
    const named = clause.match(/^\{([\s\S]*)\}$/);
    if (named) {
      const bindings = named[1].split(",").map((s) => s.trim()).filter(Boolean)
        .map((b) => { const [from, to] = b.split(/\s+as\s+/); return to ? `${from}: ${to}` : from; });
      return `const { ${bindings.join(", ")} } = __require(${path});`;
    }
    const star = clause.match(/^\*\s+as\s+(\w+)$/);
    if (star) return `const ${star[1]} = __require(${path});`;
    if (/^\w+$/.test(clause)) return `const ${clause} = __require(${path}).default;`;
    throw new Error(`${rel}: unsupported import form — ${line.trim()}`);
  });

  out = out.replace(/^\s*export\s+default\s+/gm, "__exports.default = ");
  out = out.replace(/^\s*export\s+(const|let|function|class)\b/gm, "$1");
  out = out.replace(/^\s*export\s*\{([\s\S]*?)\}\s*;?\s*$/gm, (_, list) =>
    list.split(",").map((s) => s.trim()).filter(Boolean)
      .map((b) => { const [from, to] = b.split(/\s+as\s+/); return `__exports.${(to ?? from).trim()} = ${from.trim()};`; })
      .join(" "));

  if (/^\s*export\b/m.test(out)) throw new Error(`${rel}: an export form survived the transform.`);
  return out;
}

/* ── emit ─────────────────────────────────────────────────────────*/

const [html, css] = await Promise.all([readFile(join(ROOT, "index.html"), "utf8"), readFile(join(ROOT, "styles.css"), "utf8")]);
const { modules, order } = await collect(ENTRY);

const registry = order
  .map((rel) => `  ${JSON.stringify(rel)}: function (__exports) {\n${transform(rel, modules.get(rel))}\n  },`)
  .join("\n\n");

// The Artifact host supplies <!doctype>, <html>, <head> and <body>; emit only
// what goes inside, so the same file works pasted into a single-file host.
const inner = html.split("<body>")[1].split("</body>")[0].replace(/<script type="module"[^>]*><\/script>/, "");
const fontLink = html.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]*">/)[0];

const out = `<title>My Instructions</title>
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
const __defs = {
${registry}
};
const __cache = Object.create(null);
function __require(path){
  if (path in __cache) return __cache[path];
  const exports = __cache[path] = {};
  const def = __defs[path];
  if (!def) throw new Error("module not bundled: " + path);
  def(exports);
  return exports;
}
__require(${JSON.stringify(ENTRY)});
})();
</script>
`;

await mkdir(join(ROOT, "dist"), { recursive: true });
await writeFile(join(ROOT, "dist/my-instructions.html"), out);
console.log(`dist/my-instructions.html — ${(out.length / 1024).toFixed(1)} kB, ${order.length} modules`);
