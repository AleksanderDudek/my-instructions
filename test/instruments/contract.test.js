import { test } from "node:test";
import assert from "node:assert/strict";
import { CHANNELS, validate } from "../../src/core/registry.js";
import { str } from "../../src/core/html.js";
import { mulberry32 } from "../../src/ui/pages/runner.js";
import { registry, i18nFor } from "../helpers/harness.js";

/**
 * One suite, every instrument. Anything added to src/instruments is tested by
 * this file the moment it is registered — which is the point of having a
 * contract at all. A new test that violates it fails here rather than in a
 * user's browser.
 *
 * Everything renders through the real English message tables. Asserting
 * against an identity `t` would pass on a page that shows a reader `view.lead`
 * where a sentence belongs.
 */

const ALL = registry.all();
const i18n = await i18nFor("en");
const scoped = (spec) => i18n.scope(spec.id).t;
/** The render context an instrument sees: a scoped `t` and a locale. */
const ctxFor = (spec) => ({ t: scoped(spec), locale: "en" });

/** Plausible answers for any form shape, seeded so a failure is reproducible. */
function answersFor(spec, seed = 1) {
  const rnd = mulberry32(seed);
  const form = spec.form(scoped(spec), "en");
  if (form.kind === "fields") {
    const out = {};
    for (const f of form.fields) {
      if (f.kind === "number") out[f.id] = f.min ?? 1;
      else if (f.kind === "select") out[f.id] = f.options[0].value;
      else if (f.kind === "multi") out[f.id] = [f.options[0].value];
      else out[f.id] = "Test Person";
    }
    return out;
  }
  const out = {};
  for (const item of form.items) {
    if (item.kind === "likert") out[item.id] = form.scale.min + Math.floor(rnd() * (form.scale.max - form.scale.min + 1));
    else if (item.kind === "choice") out[item.id] = item.options[0].value;
    else out[item.id] = [item.options[0].value];
  }
  return out;
}

test("at least one instrument of each family is installed", () => {
  assert.ok(registry.byFamily("questionnaire").length >= 1);
  assert.ok(registry.byFamily("profiler").length >= 1);
});

for (const spec of ALL) {
  test(`${spec.id}: satisfies the plugin contract`, () => {
    assert.doesNotThrow(() => validate(spec));
  });

  test(`${spec.id}: names itself in words rather than in code`, () => {
    // Title, tagline, framework and source note live in the message table with
    // everything else the reader sees. A spec that still carries them as
    // properties would render English to a Polish reader.
    for (const field of ["title", "tagline", "framework", "sourceNote"]) {
      assert.equal(spec[field], undefined, `${field} belongs in i18n/, not on the spec`);
      assert.ok(scoped(spec)(field).trim().length > 1, `${field} is missing from the message table`);
    }
  });

  test(`${spec.id}: form is well formed and self-consistent`, () => {
    const form = spec.form(scoped(spec), "en");
    const ids = form.kind === "items" ? form.items.map((i) => i.id) : form.fields.map((f) => f.id);
    assert.equal(new Set(ids).size, ids.length, "duplicate ids");
    if (form.kind === "items") {
      assert.ok(form.scale, "an items form needs a scale");
      assert.equal(form.scale.labels.length, form.scale.max - form.scale.min + 1, "a scale needs one label per point");
      for (const item of form.items) {
        assert.ok(item.prompt.trim().length > 10, `item ${item.id} has a stub prompt`);
        assert.ok(item.prompt.trim().endsWith("."), `item ${item.id} should read as a statement`);
        assert.ok(!item.prompt.startsWith("item."), `item ${item.id} rendered its own key`);
      }
    }
  });

  test(`${spec.id}: scoring is pure, deterministic and language-free`, () => {
    const answers = answersFor(spec);
    const frozen = JSON.stringify(answers);
    const a = spec.score(answers);
    const b = spec.score(answers);
    assert.equal(JSON.stringify(answers), frozen, "score() mutated its input");
    assert.deepEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)));
    // score() takes no `t` at all, so this is structural rather than a check
    // on wording — but the result is what gets stored and compared, and it
    // must mean the same thing to two people reading different languages.
    assert.equal(spec.score.length, 1, "score() must take answers and nothing else");
  });

  test(`${spec.id}: a result survives a JSON round trip`, () => {
    // Everything score() returns is written to storage as JSON, so anything
    // that does not survive the trip is a bug that only shows up after reload.
    const result = spec.score(answersFor(spec));
    const revived = JSON.parse(JSON.stringify(result));
    assert.doesNotThrow(() => str(spec.view(revived, ctxFor(spec))));
    assert.doesNotThrow(() => spec.instructions(revived, scoped(spec)));
  });

  test(`${spec.id}: renders without leaking objects into the markup`, () => {
    const html = str(spec.view(spec.score(answersFor(spec)), ctxFor(spec)));
    assert.ok(html.length > 200, "suspiciously short view");
    assert.ok(!html.includes("[object Object]"), "an object reached the markup");
    assert.ok(!html.includes("undefined<"), "an undefined reached the markup");
  });

  test(`${spec.id}: instruction cards are usable and correctly channelled`, () => {
    for (let seed = 1; seed <= 8; seed++) {
      const cards = spec.instructions(spec.score(answersFor(spec, seed)), scoped(spec));
      assert.ok(cards.length >= 1, "no instruction cards produced");
      for (const c of cards) {
        assert.ok(CHANNELS.includes(c.channel), `unknown channel "${c.channel}"`);
        assert.ok(c.title?.trim(), "card without a title");
        assert.ok(c.body?.trim().length > 20, "card without a usable body");
      }
      assert.deepEqual(
        spec.channels?.filter((ch) => !CHANNELS.includes(ch)) ?? [],
        [], "declared a channel that does not exist");
    }
  });

  if (spec.compare) {
    test(`${spec.id}: compares two results without blowing up`, () => {
      const a = spec.score(answersFor(spec, 3));
      const b = spec.score(answersFor(spec, 9));
      const html = str(spec.compare(a, b, { nameA: "Ada", nameB: "Bo", t: scoped(spec), locale: "en" }));
      assert.ok(html.includes("Ada") || html.includes("Bo"), "names never appear");
      assert.ok(!html.includes("[object Object]"));
    });
  }
}

test("questionnaire scores all land inside 1..100", () => {
  for (const spec of registry.byFamily("questionnaire")) {
    for (let seed = 1; seed <= 25; seed++) {
      const { scores } = spec.score(answersFor(spec, seed));
      for (const [key, value] of Object.entries(scores)) {
        assert.ok(Number.isInteger(value) && value >= 1 && value <= 100, `${spec.id}.${key} = ${value}`);
      }
    }
  }
});

test("questionnaire banks are balanced — equal items per scale, reverse items in every block", () => {
  for (const spec of registry.byFamily("questionnaire")) {
    const { items } = spec.form(scoped(spec), "en");
    const per = {}, rev = {};
    for (const i of items) { per[i.scale] = (per[i.scale] ?? 0) + 1; if (i.reverse) rev[i.scale] = (rev[i.scale] ?? 0) + 1; }
    const counts = new Set(Object.values(per));
    assert.equal(counts.size, 1, `${spec.id}: uneven scale lengths ${JSON.stringify(per)}`);
    for (const scale of Object.keys(per)) {
      assert.ok(rev[scale] >= 1, `${spec.id}: scale "${scale}" has no reverse-keyed item`);
    }
  }
});

test("an empty answer set still scores rather than throwing", () => {
  for (const spec of registry.byFamily("questionnaire")) {
    assert.doesNotThrow(() => str(spec.view(spec.score({}), ctxFor(spec))), spec.id);
  }
});

test("a hostile name is escaped everywhere it is rendered", () => {
  const spec = registry.get("numerology");
  const t = scoped(spec);
  const evil = '"><img src=x onerror=alert(1)>';
  const result = spec.score({ name: evil, day: 8, month: 1, year: 1993 });
  const rendered = [
    str(spec.view(result, ctxFor(spec))),
    str(spec.compare(result, result, { nameA: evil, nameB: evil, t, locale: "en" })),
  ];
  for (const html of rendered) {
    assert.ok(!html.includes("<img src=x"), "raw markup survived escaping");
    assert.ok(html.includes("&lt;img") || html.includes("&quot;&gt;"), "the name was dropped instead of escaped");
  }
});

test("ids are stable slugs — they are storage keys and URL segments", () => {
  for (const spec of ALL) assert.match(spec.id, /^[a-z][a-z0-9-]*$/);
  assert.equal(new Set(ALL.map((s) => s.id)).size, ALL.length);
});
