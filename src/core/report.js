/**
 * Audience-scoped reports.
 *
 * The existing share link hands one instrument to one person. This is the
 * general case: a whole sheet, built for an audience, containing exactly the
 * elements that audience is allowed to see.
 *
 * The rule the whole feature rests on is that **withheld content is absent
 * from the link rather than hidden by the page that renders it**. A token that
 * carried everything and left the filtering to the viewer would be a UI
 * convention, not a permission — anyone could decode it and read what was
 * withheld. So each audience gets a token built from only its own elements,
 * and private content never leaves the browser at all.
 *
 * Answers pack to one character per item. A six-instrument report as
 * `{"w1":4,"w2":3,…}` is several kilobytes of URL, which chat clients truncate
 * and mail clients wrap; the same answers in item order are a few hundred
 * bytes. The item order comes from the instrument itself, so the receiver
 * reconstructs the keys from their own copy rather than being told them.
 */

const VERSION = 2;

/** Narrowest first. An element is visible to its own audience and wider ones. */
const AUDIENCES = ["private", "friends", "public"];

/** Is an element marked `elementAudience` visible in a report for `audience`? */
const atLeast = (elementAudience, audience) =>
  AUDIENCES.indexOf(elementAudience) >= AUDIENCES.indexOf(audience) && elementAudience !== "private";

/** Every element id a report for `audience` may contain. */
function elementsFor(sharing, audience) {
  return Object.entries(sharing ?? {})
    .filter(([, level]) => atLeast(level, audience))
    .map(([id]) => id);
}

const toB64Url = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64Url = (s) => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/")))); // eslint-disable-line

/** The canonical item order for an instrument, taken from the instrument. */
const orderOf = (spec) => spec.form((key) => key).items?.map((item) => item.id) ?? null;

/** An unanswered item, so that a gap round-trips as a gap rather than a guess. */
const BLANK = "-";

/**
 * Likert answers as one character each, in the instrument's own item order.
 * A profiler has no items — dates and names do not pack — so its answers stay
 * JSON, which is the honest fallback rather than a clever one.
 */
function packAnswers(spec, answers) {
  const order = orderOf(spec);
  if (!order) return JSON.stringify(answers);
  return order.map((id) => (answers[id] == null ? BLANK : String(answers[id]))).join("");
}

function unpackAnswers(spec, packed) {
  const order = orderOf(spec);
  if (!order) return JSON.parse(packed);
  const out = {};
  order.forEach((id, i) => {
    const ch = packed[i];
    if (ch && ch !== BLANK) out[id] = Number(ch);
  });
  return out;
}

/**
 * Build the token for one audience.
 *
 * Everything here is a filter: a field or a run that is not in `elements` is
 * never read, so it cannot end up in the output by accident.
 */
function encodeReport({ registry, profile = {}, runs = [], sharing = {}, audience = "public" }) {
  const allowed = new Set(elementsFor(sharing, audience));

  const payload = { v: VERSION, w: audience, r: [] };
  if (allowed.has("profile.name") && profile.displayName) payload.n = profile.displayName;
  if (allowed.has("profile.pronouns") && profile.pronouns) payload.p = profile.pronouns;
  if (allowed.has("profile.note") && profile.note) payload.o = profile.note;

  for (const run of runs) {
    if (!allowed.has(`run.${run.instrumentId}`)) continue;
    const spec = registry.get(run.instrumentId);
    payload.r.push({
      i: run.instrumentId,
      v: run.instrumentVersion,
      a: spec ? packAnswers(spec, run.answers) : JSON.stringify(run.answers),
    });
  }
  return toB64Url(JSON.stringify(payload));
}

/**
 * Read a token back. `t` renders the diagnosis, so a broken link explains
 * itself in the language of whoever is holding it.
 */
function decodeReport(token, registry, t = (key) => key) {
  let data;
  try { data = JSON.parse(fromB64Url(token)); } catch { throw new Error(t("report.unreadable")); }
  if (data?.v !== VERSION) throw new Error(t("report.version", { version: data?.v }));

  const profile = {};
  if (data.n) profile.displayName = data.n;
  if (data.p) profile.pronouns = data.p;
  if (data.o) profile.note = data.o;

  const runs = [];
  for (const row of data.r ?? []) {
    // An instrument this browser has never heard of is dropped rather than
    // thrown on: the sender may simply be running a newer build.
    const spec = registry.get(row.i);
    if (!spec) continue;
    runs.push({ instrumentId: row.i, instrumentVersion: row.v ?? null, answers: unpackAnswers(spec, row.a) });
  }

  return { audience: data.w ?? "public", profile, runs };
}

/** Absolute URL for one audience's report. */
const reportLink = (args) =>
  `${location.origin}${location.pathname}#/report?d=${encodeReport(args)}`;

export {
  AUDIENCES, VERSION, atLeast, elementsFor,
  packAnswers, unpackAnswers, encodeReport, decodeReport, reportLink,
};
