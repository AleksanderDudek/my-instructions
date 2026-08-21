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

/**
 * Item ids the instrument has marked as never leaving the device.
 *
 * Enforced here rather than left to each instrument, because "remember to
 * strip these" is a rule that holds until somebody adds a code path. Packing
 * writes a blank in their position, so the item order — which is what makes
 * the compact format work — is unchanged.
 */
const privateIdsOf = (spec) =>
  new Set((spec.form((key) => key).items ?? []).filter((item) => item.tier === "private").map((item) => item.id));

/** An unanswered item, so that a gap round-trips as a gap rather than a guess. */
const BLANK = "-";

/**
 * Whether an instrument's answers fit the one-character-per-item format.
 *
 * The packing assumes every answer is a single character, which is true of a
 * Likert point and false of a choice whose value is a word. A `choice` still
 * packs if its options are indexable in one digit — the index is stable
 * because it comes from the instrument's own option order — and a `multi`
 * does not pack at all, because one item holds several answers.
 *
 * When anything in the bank fails that test the whole instrument falls back to
 * JSON. A partly packed string would misalign every item after the first wide
 * one, which is the kind of bug that produces a plausible wrong result rather
 * than an error.
 */
const packable = (item) =>
  item.kind === "likert" || (item.kind === "choice" && (item.options?.length ?? 0) <= 10);

const codecFor = (spec) => {
  const items = spec.form((key) => key).items;
  if (!items || !items.every(packable)) return null;
  return items;
};

/**
 * Likert answers as one character each, in the instrument's own item order.
 * A profiler has no items — dates and names do not pack — so its answers stay
 * JSON, which is the honest fallback rather than a clever one.
 */
function packAnswers(spec, answers) {
  const items = codecFor(spec);
  if (!items) {
    // The wide path still has to honour the private tier.
    const withheld = privateIdsOf(spec);
    return JSON.stringify(Object.fromEntries(
      Object.entries(answers).filter(([id]) => !withheld.has(id))));
  }

  const withheld = privateIdsOf(spec);
  return items.map((item) => {
    if (withheld.has(item.id) || answers[item.id] == null) return BLANK;
    if (item.kind === "likert") return String(answers[item.id]);
    const index = item.options.findIndex((o) => o.value === answers[item.id]);
    return index < 0 ? BLANK : String(index);
  }).join("");
}

function unpackAnswers(spec, packed) {
  const items = codecFor(spec);
  if (!items) return JSON.parse(packed);
  const out = {};
  items.forEach((item, i) => {
    const ch = packed[i];
    if (!ch || ch === BLANK) return;
    out[item.id] = item.kind === "likert" ? Number(ch) : item.options[Number(ch)]?.value;
    if (out[item.id] === undefined) delete out[item.id];
  });
  return out;
}

/**
 * Build the token for one audience.
 *
 * Everything here is a filter: a field or a run that is not in `elements` is
 * never read, so it cannot end up in the output by accident.
 */
/**
 * Days since the epoch, which is all the precision an expiry needs and small
 * enough not to bloat the token.
 */
const today = (now) => Math.floor(now / 86400000);

/**
 * A note on what expiry is and is not.
 *
 * A link that carries its own data cannot be revoked. There is no server to
 * ask, and the bytes are already in the other person's hands the moment they
 * open it — anyone who saved the URL, or the page, holds a copy that no
 * subsequent action here can reach. Expiry makes the app refuse to render an
 * old link, which stops a forwarded link working in six months and does not
 * stop a determined reader who kept it.
 *
 * That is worth having and it is worth saying, so the copy says it. Promising
 * revocation for a self-contained token would be the kind of security claim
 * that is worse than no claim at all.
 */
function encodeReport({ registry, profile = {}, runs = [], sharing = {}, audience = "public", expiresInDays = null, now = null }) {
  const allowed = new Set(elementsFor(sharing, audience));

  const payload = { v: VERSION, w: audience, r: [] };
  if (expiresInDays && now) payload.x = today(now) + expiresInDays;
  if (allowed.has("profile.name") && profile.displayName) payload.n = profile.displayName;
  if (allowed.has("profile.pronouns") && profile.pronouns) payload.p = profile.pronouns;
  if (allowed.has("profile.note") && profile.note) payload.o = profile.note;

  for (const run of runs) {
    if (!allowed.has(`run.${run.instrumentId}`)) continue;
    const spec = registry.get(run.instrumentId);

    // Defence in depth. The sharing page does not offer an audience an
    // instrument forbids, but the sharing map is just stored JSON and this is
    // the only place that has to be right. A ceiling enforced only in the UI
    // is a ceiling until somebody edits localStorage.
    if (spec && !atLeast(spec.maxAudience ?? "public", audience)) continue;

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
function decodeReport(token, registry, t = (key) => key, now = null) {
  let data;
  try { data = JSON.parse(fromB64Url(token)); } catch { throw new Error(t("report.unreadable")); }
  if (data?.v !== VERSION) throw new Error(t("report.version", { version: data?.v }));
  if (data.x != null && now != null && today(now) > data.x) throw new Error(t("report.expired"));

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
  AUDIENCES, VERSION, atLeast, elementsFor, privateIdsOf,
  packAnswers, unpackAnswers, encodeReport, decodeReport, reportLink,
};
