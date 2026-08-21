/**
 * The plugin contract.
 *
 * An instrument — a test or a profiler — is a plain object. The registry does
 * nothing but validate the shape and hand back a frozen copy, which is the
 * whole point: adding a test is writing one folder, never editing the shell.
 *
 * Two families exist and they differ only in how answers are gathered:
 *
 *   questionnaire — many items, one screen at a time, scored psychometrically
 *   profiler      — a short form of facts (a birth date, a set of choices),
 *                   answered in one pass and transformed rather than scored
 *
 * The contract:
 *
 *   id           stable slug; also the storage key, the URL segment, and the
 *                namespace its messages are loaded under
 *   version      bump when items or scoring change; stored beside every run so
 *                an old result can be shown as stale instead of silently wrong
 *   family       "questionnaire" | "profiler"
 *   glyph, minutes   presentation facts that carry no words
 *   messages     { en: () => import("./i18n/en.js"), ... } one loader per
 *                locale. Title, tagline, framework and source note live in
 *                there with everything else the reader sees.
 *   form(t, locale) -> { kind:"items", items:[...] } | { kind:"fields", fields:[...] }
 *                An item may carry tier:"private", which keeps its answer out
 *                of every token; a form may carry optional:true, which lets a
 *                reader move on without answering.
 *   score(answers) -> result object, free-form, stored verbatim. Takes no `t`
 *                and returns no words: a result computed in Polish must be
 *                identical to the same answers computed in English, or
 *                comparing two people across languages is meaningless.
 *   view(result, ctx) -> html`` for the result page; ctx.t is scoped to this
 *                instrument
 *   instructions(result, t) -> [{ channel, title, body }]  the shareable lines
 *   compare(a, b) -> optional; two results, one reading. The seed of the
 *                    friend-to-friend feature.
 *   sensitive    optional; marks an instrument whose result is nobody's
 *                business by default. Forces a private default that no
 *                migration can override, and makes the app warn once before
 *                a first share.
 *   maxAudience  optional; the widest audience the sharing page may offer.
 *                "friends" means public is not on the menu at all, rather
 *                than being on the menu and discouraged.
 *   persistence  optional; "session" keeps a run in memory and nowhere else.
 *                No draft is written while answering, nothing reaches storage
 *                or an export, and a reload loses it. For answers that are
 *                worth having on screen and not worth keeping.
 */

const FAMILIES = new Set(["questionnaire", "profiler"]);
const CHANNELS = ["communication", "affection", "work", "conflict", "energy", "rhythm"];

/** Message key for a channel's heading. */
const channelKey = (channel) => `channel.${channel}`;

const REQUIRED = ["id", "version", "family", "glyph", "minutes", "messages", "form", "score", "view", "instructions"];

/** Widest audience an instrument permits, narrowest first. */
const AUDIENCE_ORDER = ["private", "friends", "public"];

/**
 * What the sharing page is allowed to offer for one instrument.
 *
 * A declared ceiling is a different thing from a default. A default is where
 * a setting starts and can be moved; a ceiling is an option that never
 * appears. For an instrument about somebody's sex life, "public" should not
 * be a button that exists and is discouraged.
 */
function audiencesFor(spec) {
  const ceiling = AUDIENCE_ORDER.indexOf(spec?.maxAudience ?? "public");
  return AUDIENCE_ORDER.slice(0, (ceiling < 0 ? AUDIENCE_ORDER.length - 1 : ceiling) + 1);
}

/**
 * Validation renders no words, so it needs no language. An identity `t`
 * returns its own key, which is enough to check that every item has *a*
 * prompt without asserting anything about what the prompt says.
 */
const identity = (key) => key;

function validate(spec) {
  const where = spec?.id ? `instrument "${spec.id}"` : "instrument";
  for (const k of REQUIRED) if (spec?.[k] == null) throw new TypeError(`${where}: missing "${k}"`);
  if (!/^[a-z][a-z0-9-]*$/.test(spec.id)) throw new TypeError(`${where}: id must be a lowercase slug`);
  if (!FAMILIES.has(spec.family)) throw new TypeError(`${where}: family must be one of ${[...FAMILIES].join(", ")}`);
  if (!Number.isInteger(spec.version) || spec.version < 1) throw new TypeError(`${where}: version must be a positive integer`);
  for (const k of ["form", "score", "view", "instructions"]) {
    if (typeof spec[k] !== "function") throw new TypeError(`${where}: "${k}" must be a function`);
  }
  if (spec.compare != null && typeof spec.compare !== "function") throw new TypeError(`${where}: "compare" must be a function`);
  if (spec.maxAudience != null && !AUDIENCE_ORDER.includes(spec.maxAudience)) {
    throw new TypeError(`${where}: maxAudience must be one of ${AUDIENCE_ORDER.join(", ")}`);
  }
  if (spec.sensitive && spec.maxAudience === "public") {
    throw new TypeError(`${where}: a sensitive instrument must not permit a public audience`);
  }
  if (spec.persistence != null && spec.persistence !== "session") {
    throw new TypeError(`${where}: persistence, if set, must be "session"`);
  }
  // A run that is never written down cannot be put in a link either: the link
  // would outlive the thing it came from, which is the opposite of the point.
  if (spec.persistence === "session" && (spec.maxAudience ?? "public") !== "private") {
    throw new TypeError(`${where}: a session-only instrument must set maxAudience to "private"`);
  }

  if (typeof spec.messages?.en !== "function") throw new TypeError(`${where}: messages.en must be a loader function`);

  const form = spec.form(identity, "en");
  if (form.kind === "items") validateItems(spec, form.items);
  else if (form.kind === "fields") validateFields(spec, form.fields);
  else throw new TypeError(`${where}: form.kind must be "items" or "fields"`);
  return form;
}

const ITEM_KINDS = new Set(["likert", "choice", "multi"]);

/**
 * Where an item's answer is allowed to travel.
 *
 * `shared` is the default and behaves as every item did before this existed.
 * `private` means the answer informs the reader's own page and nothing else:
 * it is stripped before any token is built, so it cannot reach a partner, a
 * report or a link. Some questions are worth asking and not worth sending —
 * whether someone has hidden a purchase, whether an argument has ever
 * frightened them — and the honest way to ask them is to guarantee where the
 * answer stops.
 */
const ITEM_TIERS = new Set(["shared", "private"]);
function validateItems(spec, items) {
  if (!Array.isArray(items) || !items.length) throw new TypeError(`instrument "${spec.id}": form.items must be a non-empty array`);
  const seen = new Set();
  for (const it of items) {
    if (!it.id) throw new TypeError(`instrument "${spec.id}": every item needs an id`);
    if (seen.has(it.id)) throw new TypeError(`instrument "${spec.id}": duplicate item id "${it.id}"`);
    seen.add(it.id);
    if (!ITEM_KINDS.has(it.kind)) throw new TypeError(`instrument "${spec.id}": item "${it.id}" has unknown kind "${it.kind}"`);
    if (!it.prompt) throw new TypeError(`instrument "${spec.id}": item "${it.id}" has no prompt`);
    if (it.kind === "likert" && !it.scale) throw new TypeError(`instrument "${spec.id}": likert item "${it.id}" needs a scale name`);
    if (it.kind !== "likert" && !Array.isArray(it.options)) throw new TypeError(`instrument "${spec.id}": item "${it.id}" needs options`);
    if (it.tier != null && !ITEM_TIERS.has(it.tier)) throw new TypeError(`instrument "${spec.id}": item "${it.id}" has unknown tier "${it.tier}"`);
  }
}

const FIELD_KINDS = new Set(["date", "time", "text", "number", "select", "multi"]);
function validateFields(spec, fields) {
  if (!Array.isArray(fields) || !fields.length) throw new TypeError(`instrument "${spec.id}": form.fields must be a non-empty array`);
  const seen = new Set();
  for (const f of fields) {
    if (!f.id || seen.has(f.id)) throw new TypeError(`instrument "${spec.id}": field ids must exist and be unique`);
    seen.add(f.id);
    if (!FIELD_KINDS.has(f.kind)) throw new TypeError(`instrument "${spec.id}": field "${f.id}" has unknown kind "${f.kind}"`);
  }
}

function createRegistry() {
  const byId = new Map();
  return {
    register(spec) {
      validate(spec);
      if (byId.has(spec.id)) throw new Error(`instrument "${spec.id}" is already registered`);
      byId.set(spec.id, Object.freeze(spec));
      return spec;
    },
    get(id) { return byId.get(id) ?? null; },
    has(id) { return byId.has(id); },
    all() { return [...byId.values()]; },
    byFamily(family) { return this.all().filter((s) => s.family === family); },
    /** Grouped for the catalogue page, in registration order within each group. */
    groups() {
      return [
        { family: "profiler", labelKey: "catalog.group.profilers", noteKey: "catalog.group.profilersNote", items: this.byFamily("profiler") },
        { family: "questionnaire", labelKey: "catalog.group.tests", noteKey: "catalog.group.testsNote", items: this.byFamily("questionnaire") },
      ].filter((g) => g.items.length);
    },
  };
}

export { createRegistry, validate, CHANNELS, channelKey, FAMILIES, ITEM_TIERS, audiencesFor, identity };
