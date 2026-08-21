import { test } from "node:test";
import assert from "node:assert/strict";

// The browser globals `share.js` relies on. Node has Buffer instead.
globalThis.btoa ??= (s) => Buffer.from(s, "binary").toString("base64");
globalThis.atob ??= (s) => Buffer.from(s, "base64").toString("binary");

const { encode, decode } = await import("../../src/core/share.js");
const { registry } = await import("../../src/instruments/index.js");

test("a token round-trips, including non-ASCII names", () => {
  const run = { instrumentId: "big-five", instrumentVersion: 1, answers: { o1: 5, c1: 2 } };
  const back = decode(encode(run, "Zoë Ćwikła 中文"));
  assert.equal(back.instrumentId, "big-five");
  assert.equal(back.name, "Zoë Ćwikła 中文");
  assert.deepEqual(back.answers, { o1: 5, c1: 2 });
});

test("tokens are URL-safe — no characters that need escaping in a fragment", () => {
  const answers = Object.fromEntries(Array.from({ length: 45 }, (_, i) => [`e${i}`, (i % 5) + 1]));
  const token = encode({ instrumentId: "enneagram", instrumentVersion: 1, answers }, "A Name");
  assert.match(token, /^[A-Za-z0-9_-]+$/);
});

test("a corrupt or foreign token is refused with a readable message", () => {
  assert.throws(() => decode("not-base64!!"), /not readable/);
  assert.throws(() => decode(btoa(JSON.stringify({ v: 99 }))), /different version/);
  assert.throws(() => decode(btoa(JSON.stringify({ v: 1, i: "big-five" }))), /missing its answers/);
});

test("sharing carries answers, so a token re-scores under the current version", () => {
  // The guarantee that makes versioned instruments safe to share: the receiver
  // scores with their own copy of the instrument rather than trusting numbers.
  const spec = registry.get("love-languages");
  const answers = Object.fromEntries(spec.form().items.map((i) => [i.id, 4]));
  const back = decode(encode({ instrumentId: spec.id, instrumentVersion: 1, answers }, ""));
  assert.deepEqual(spec.score(back.answers).scores, spec.score(answers).scores);
});
