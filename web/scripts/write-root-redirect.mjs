import { writeFile } from "node:fs/promises";

/**
 * The one page a static export cannot generate.
 *
 * Every route lives under `/{locale}/`, so nothing owns `/`. On a server the
 * proxy redirects; on a static host there is no proxy, so this writes a real
 * `index.html` that chooses a language and forwards.
 *
 * Plain HTML on purpose — no framework, nothing to hydrate — and it carries a
 * visible link as well as the script, so the page still works with JavaScript
 * disabled and for a crawler that does not run scripts. A meta refresh alone
 * leaves both staring at a blank document.
 *
 * It reads the stored setting first so somebody who chose Polish by hand is
 * not sent back to English by their browser's header on the next bare link.
 */
const BASE = process.env.NEXT_BASE_PATH ?? "/my-instructions";
const OUT = process.env.NEXT_OUT_DIR ?? "out";
const TAGS = ["en", "pl", "es", "de"];

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>My Instructions</title>
<link rel="canonical" href="${BASE}/en/">
${TAGS.map((t) => `<link rel="alternate" hreflang="${t}" href="${BASE}/${t}/">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${BASE}/en/">
<meta http-equiv="refresh" content="0;url=${BASE}/en/">
<style>body{background:#0c0d13;color:#e7e0d3;font:300 17px/1.6 Georgia,serif;display:grid;place-items:center;min-height:100vh;margin:0}a{color:#d9a441}@media(prefers-color-scheme:light){body{background:#efe9dc;color:#1e1c18}a{color:#96690f}}</style>
<script>
(function () {
  var tags = ${JSON.stringify(TAGS)};
  var wanted = null;
  try {
    var stored = JSON.parse(localStorage.getItem("mi:1:settings") || "null");
    if (stored && tags.indexOf(stored.locale) !== -1) wanted = stored.locale;
  } catch (e) { /* private mode, or nothing stored yet */ }
  if (!wanted) {
    var prefs = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < prefs.length && !wanted; i++) {
      var base = String(prefs[i]).split("-")[0].toLowerCase();
      if (tags.indexOf(base) !== -1) wanted = base;
    }
  }
  location.replace(${JSON.stringify(BASE)} + "/" + (wanted || "en") + "/" + location.search + location.hash);
})();
</script>
</head>
<body><p><a href="${BASE}/en/">My Instructions</a></p></body>
</html>
`;

await writeFile(`${OUT}/index.html`, html, "utf8");
console.log(`wrote ${OUT}/index.html -> ${BASE}/{locale}/`);
