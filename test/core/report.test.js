import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.btoa ??= (s) => Buffer.from(s, "binary").toString("base64");
globalThis.atob ??= (s) => Buffer.from(s, "base64").toString("binary");
globalThis.location ??= { origin: "http://localhost:5173", pathname: "/", hash: "" };

const { AUDIENCES, atLeast, elementsFor, packAnswers, unpackAnswers, encodeReport, decodeReport } =
  await import("../../src/core/report.js");
const { registry } = await import("../helpers/harness.js");

/**
 * Audience-scoped reports.
 *
 * The property the whole feature rests on: a link built for one audience
 * contains only what that audience may see. Withheld content is *absent from
 * the payload*, not hidden by the page that renders it — otherwise anyone
 * could decode the link and read what was withheld.
 */

const spec = registry.get("love-languages");
const items = spec.form((key) => key).items;
const answers = Object.fromEntries(items.map((item, i) => [item.id, (i % 5) + 1]));

test("audiences widen: public is visible to everyone, private to no one else", () => {
  assert.deepEqual(AUDIENCES, ["private", "friends", "public"]);
  assert.equal(atLeast("public", "friends"), true, "a public element shows in a friends report");
  assert.equal(atLeast("friends", "public"), false, "a friends element must not show in a public report");
  assert.equal(atLeast("private", "friends"), false);
  assert.equal(atLeast("friends", "friends"), true);
});

test("answers pack to one character each and come back unchanged", () => {
  const packed = packAnswers(spec, answers);
  assert.equal(packed.length, items.length, "one character per item");
  assert.match(packed, /^[1-5]+$/);
  assert.deepEqual(unpackAnswers(spec, packed), answers);
});

test("an unanswered item survives the round trip as absent, not as a guess", () => {
  const partial = { ...answers };
  delete partial[items[3].id];
  const back = unpackAnswers(spec, packAnswers(spec, partial));
  assert.equal(back[items[3].id], undefined);
  assert.equal(Object.keys(back).length, items.length - 1);
});

test("packing beats JSON by enough to matter in a URL", () => {
  const json = JSON.stringify(answers).length;
  const packed = packAnswers(spec, answers).length;
  assert.ok(packed * 5 < json, `packed ${packed} vs json ${json} — not worth the format change`);
});

/* ── what a report contains ───────────────────────────────────────*/

const sharing = {
  "profile.name": "public",
  "profile.pronouns": "friends",
  "profile.note": "private",
  "run.love-languages": "friends",
  "run.big-five": "public",
};

test("elementsFor returns what an audience may see and nothing above it", () => {
  assert.deepEqual(elementsFor(sharing, "public").sort(), ["profile.name", "run.big-five"]);
  assert.deepEqual(
    elementsFor(sharing, "friends").sort(),
    ["profile.name", "profile.pronouns", "run.big-five", "run.love-languages"]);
});

test("a private element appears in no report at all", () => {
  for (const audience of AUDIENCES) {
    assert.equal(elementsFor(sharing, audience).includes("profile.note"), false, `leaked into ${audience}`);
  }
});

/* ── the token ────────────────────────────────────────────────────*/

const profile = { displayName: "Ada", pronouns: "she/her", note: "A private note." };
const runs = [{ instrumentId: "love-languages", instrumentVersion: 1, answers }];

test("a public token carries no friends-only content", () => {
  const token = encodeReport({ registry, profile, runs, sharing, audience: "public" });
  const report = decodeReport(token, registry);

  assert.equal(report.audience, "public");
  assert.equal(report.profile.displayName, "Ada");
  assert.equal(report.profile.pronouns, undefined, "a friends-only field reached a public link");
  assert.equal(report.profile.note, undefined, "a private field reached a link");
  assert.deepEqual(report.runs, [], "a friends-only run reached a public link");

  // The strongest form of the check: the withheld words are not in the bytes.
  assert.equal(token.includes(btoa("she/her").slice(0, 6)), false);
});

test("a friends token carries the friends-only run, re-scored from packed answers", () => {
  const token = encodeReport({ registry, profile, runs, sharing, audience: "friends" });
  const report = decodeReport(token, registry);

  assert.equal(report.profile.pronouns, "she/her");
  assert.equal(report.runs.length, 1);
  assert.equal(report.runs[0].instrumentId, "love-languages");
  assert.deepEqual(report.runs[0].answers, answers, "answers did not survive the round trip");
});

test("a report token is dramatically shorter than the same content as JSON", () => {
  const token = encodeReport({ registry, profile, runs, sharing, audience: "friends" });
  const naive = JSON.stringify({ profile, runs }).length;
  assert.ok(token.length < naive / 2, `token ${token.length} vs naive ${naive}`);
});

test("a corrupt or foreign token is refused with a translatable message", () => {
  const t = (key) => key;
  assert.throws(() => decodeReport("not-base64!!", registry, t), /report\.unreadable/);
  assert.throws(() => decodeReport(btoa(JSON.stringify({ v: 99 })), registry, t), /report\.version/);
});

test("a run for an instrument this browser does not have is dropped, not fatal", () => {
  const token = encodeReport({
    registry, profile, sharing: { "run.ghost": "public" }, audience: "public",
    runs: [{ instrumentId: "ghost", instrumentVersion: 1, answers: { a: 1 } }],
  });
  assert.deepEqual(decodeReport(token, registry).runs, []);
});

/* ── private-tier items ───────────────────────────────────────────
   Some questions are worth asking and not worth sending. The
   guarantee is enforced at the encoder, not left to each folder.   */

test("an item marked private is stripped from every token", async () => {
  const { privateIdsOf } = await import("../../src/core/report.js");

  // A stand-in instrument rather than a real one, so the test states the rule
  // instead of depending on which folder happens to use it today.
  const withPrivate = {
    id: "sensitive",
    form: () => ({
      kind: "items",
      items: [
        { id: "a", kind: "likert", scale: "x", prompt: "a" },
        { id: "secret", kind: "likert", scale: "x", prompt: "secret", tier: "private" },
        { id: "b", kind: "likert", scale: "x", prompt: "b" },
      ],
    }),
  };
  const fakeRegistry = { get: (id) => (id === "sensitive" ? withPrivate : null) };

  assert.deepEqual([...privateIdsOf(withPrivate)], ["secret"]);

  const token = encodeReport({
    registry: fakeRegistry,
    profile: {},
    runs: [{ instrumentId: "sensitive", instrumentVersion: 1, answers: { a: 3, secret: 5, b: 2 } }],
    sharing: { "run.sensitive": "friends" },
    audience: "friends",
  });

  const back = decodeReport(token, fakeRegistry);
  assert.equal(back.runs[0].answers.a, 3, "shared answers still travel");
  assert.equal(back.runs[0].answers.b, 2);
  assert.equal(back.runs[0].answers.secret, undefined, "a private answer reached a token");

  // The position is held rather than removed, so the compact packing still
  // lines up with the instrument's item order on the receiving side.
  assert.equal(back.runs[0].answers.b, 2, "the item after the private one did not shift");
});

test("an expired token is refused, and one with no expiry never expires", () => {
  const t = (key) => key;
  const day = 86400000;
  const made = Date.UTC(2026, 0, 1);

  const dated = encodeReport({ registry, profile, runs, sharing, audience: "friends", expiresInDays: 30, now: made });
  assert.doesNotThrow(() => decodeReport(dated, registry, t, made + 29 * day));
  assert.throws(() => decodeReport(dated, registry, t, made + 31 * day), /report\.expired/);

  // Expiry is opt-in: every link built before this existed still opens.
  const undated = encodeReport({ registry, profile, runs, sharing, audience: "friends" });
  assert.doesNotThrow(() => decodeReport(undated, registry, t, made + 3650 * day));
});

test("an instrument's audience ceiling is enforced at the encoder, not just the page", async () => {
  const { encodeReport, decodeReport } = await import("../../src/core/report.js");

  const sensitive = {
    id: "tender",
    maxAudience: "friends",
    form: () => ({ kind: "items", items: [{ id: "a", kind: "likert", scale: "x", prompt: "a" }] }),
  };
  const fakeRegistry = { get: (id) => (id === "tender" ? sensitive : null) };
  const args = {
    registry: fakeRegistry,
    profile: {},
    runs: [{ instrumentId: "tender", instrumentVersion: 1, answers: { a: 4 } }],
    // A sharing map that says public — as it would if somebody edited storage,
    // or if it were migrated from a build before the ceiling existed.
    sharing: { "run.tender": "public" },
  };

  assert.deepEqual(
    decodeReport(encodeReport({ ...args, audience: "public" }), fakeRegistry).runs, [],
    "a friends-ceiling instrument reached a public link");

  assert.equal(
    decodeReport(encodeReport({ ...args, audience: "friends" }), fakeRegistry).runs.length, 1,
    "and it should still travel to the audience it does permit");
});

test("choice answers survive packing, and a wide bank falls back rather than misaligning", async () => {
  // The packing assumed one character per answer, which is true of a Likert
  // point and false of a choice whose value is a word. Packing "unhurried"
  // into one slot shifted every item after it, so the receiver decoded a
  // plausible wrong result rather than an error — the worst failure shape
  // available. Both instruments with choice items were affected.
  const couple = registry.get("couple-conversations");
  const items = couple.form((key) => key).items;
  const given = Object.fromEntries(items.map((item, n) => [
    item.id,
    item.kind === "likert" ? (n % 5) + 1 : item.options[n % item.options.length].value,
  ]));

  const back = unpackAnswers(couple, packAnswers(couple, given));

  const shareable = items.filter((item) => item.tier !== "private");
  for (const item of shareable) {
    assert.equal(back[item.id], given[item.id], `${item.id} did not survive the round trip`);
  }
  assert.equal(Object.keys(back).length, shareable.length, "an item was lost or invented");
});

test("a multi-answer bank is packed as JSON rather than badly", () => {
  const wide = {
    id: "wide",
    form: () => ({
      kind: "items",
      items: [
        { id: "a", kind: "likert", scale: "x", prompt: "a" },
        { id: "m", kind: "multi", prompt: "m", options: [{ value: "x", label: "x" }, { value: "y", label: "y" }] },
      ],
    }),
  };
  const given = { a: 3, m: ["x", "y"] };
  assert.deepEqual(unpackAnswers(wide, packAnswers(wide, given)), given);
});
