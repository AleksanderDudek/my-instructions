import { test } from "node:test";
import assert from "node:assert/strict";
import { match, compile } from "../../src/core/router.js";

test("static segments must match exactly", () => {
  assert.deepEqual(match(compile("/tests"), "/tests"), {});
  assert.equal(match(compile("/tests"), "/test"), null);
});

test("parameters are captured and URL-decoded", () => {
  assert.deepEqual(match(compile("/test/:id"), "/test/big-five"), { id: "big-five" });
  assert.deepEqual(match(compile("/test/:id/result"), "/test/love-languages/result"), { id: "love-languages" });
  assert.deepEqual(match(compile("/test/:id"), "/test/a%2Fb"), { id: "a/b" });
});

test("segment count is part of the match, so routes cannot swallow each other", () => {
  assert.equal(match(compile("/test/:id"), "/test/x/result"), null);
  assert.equal(match(compile("/test/:id/result"), "/test/x"), null);
});

test("the root route matches only the root", () => {
  assert.deepEqual(match(compile("/"), "/"), {});
  assert.equal(match(compile("/"), "/tests"), null);
});
