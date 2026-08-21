/**
 * The one place HTML is escaped.
 *
 * Every view in this app returns a string, so the only defence against a name
 * like `<img onerror=...>` is disciplined escaping. The `html` tagged template
 * escapes interpolations by default; anything already trusted must be wrapped
 * in `raw()` to opt out. That inversion is the point — forgetting to escape is
 * impossible, forgetting to *un*-escape is merely ugly.
 */

const RAW = Symbol("raw");

/** Mark a string as pre-escaped HTML so `html` will not re-escape it. */
const raw = (s) => ({ [RAW]: String(s) });

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function render(v) {
  if (v == null || v === false) return "";
  if (Array.isArray(v)) return v.map(render).join("");
  if (typeof v === "object" && RAW in v) return v[RAW];
  return esc(v);
}

/** Tagged template: `html`<p>${untrusted}</p>`` — interpolations are escaped. */
function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return raw(out);
}

/** Collapse a tagged-template result (or plain string) down to a string. */
const str = (v) => render(v);

/** Join an array of html`` results without escaping them again. */
const join = (arr, sep = "") => raw(arr.map(render).join(sep));

export { html, raw, esc, str, join };
