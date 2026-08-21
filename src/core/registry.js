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
 *   id           stable slug; also the storage key and the URL segment
 *   version      bump when items or scoring change; stored beside every run so
 *                an old result can be shown as stale instead of silently wrong
 *   family       "questionnaire" | "profiler"
 *   title, tagline, glyph, minutes, framework, sourceNote
 *   form()       -> { kind:"items", items:[...] } | { kind:"fields", fields:[...] }
 *   score(answers) -> result object, free-form, stored verbatim
 *   view(result, ctx) -> html`` for the result page
 *   instructions(result) -> [{ channel, title, body }]  the shareable lines
 *   compare(a, b) -> optional; two results, one reading. The seed of the
 *                    friend-to-friend feature.
 */

const FAMILIES = new Set(["questionnaire", "profiler"]);
const CHANNELS = ["communication", "affection", "work", "conflict", "energy", "rhythm"];

const CHANNEL_LABEL = {
  communication: "How to talk to me",
  affection: "How to show you care",
  work: "How to work with me",
  conflict: "When we clash",
  energy: "What drains and restores me",
  rhythm: "My grain",
};

const REQUIRED = ["id", "version", "family", "title", "tagline", "form", "score", "view", "instructions"];

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

  const form = spec.form();
  if (form.kind === "items") validateItems(spec, form.items);
  else if (form.kind === "fields") validateFields(spec, form.fields);
  else throw new TypeError(`${where}: form.kind must be "items" or "fields"`);
  return form;
}

const ITEM_KINDS = new Set(["likert", "choice", "multi"]);
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
  }
}

const FIELD_KINDS = new Set(["date", "text", "number", "select", "multi"]);
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
        { family: "profiler", label: "Profilers", note: "Facts about you, read as a pattern.", items: this.byFamily("profiler") },
        { family: "questionnaire", label: "Tests", note: "Questions you answer. Scored.", items: this.byFamily("questionnaire") },
      ].filter((g) => g.items.length);
    },
  };
}

export { createRegistry, validate, CHANNELS, CHANNEL_LABEL, FAMILIES };
