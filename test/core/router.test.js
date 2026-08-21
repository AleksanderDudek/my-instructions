import { test } from "node:test";
import assert from "node:assert/strict";
import { createRouter, match, compile } from "../../src/core/router.js";

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

/* ── navigation ───────────────────────────────────────────────────
   `go` needs a window; Node has none. The fake is the smallest one
   that tells the truth about the platform: assigning `location.hash`
   fires `hashchange`, and `history.replaceState` does not.          */

function fakeWindow(initial = "#/") {
  const listeners = {};
  let hash = initial;
  return {
    location: {
      get hash() { return hash; },
      set hash(next) {
        if (next === hash) return;
        hash = next;
        for (const fn of listeners.hashchange ?? []) fn();
      },
    },
    history: { replaceState(_state, _title, url) { hash = url; } },
    addEventListener(type, fn) { (listeners[type] ??= []).push(fn); },
  };
}

function spyRouter(win) {
  const seen = [];
  const router = createRouter({
    onRoute: async (_handler, route) => { seen.push(route.path); },
    fallback: () => {},
    win,
  });
  router.add("/test/:id", () => {}).add("/test/:id/result", () => {});
  return { router, seen };
}

test("a replacing navigation renders the route it navigated to", async () => {
  const win = fakeWindow("#/test/love-languages");
  const { router, seen } = spyRouter(win);
  await router.start();
  seen.length = 0;

  await router.go("/test/love-languages/result", { replace: true });

  assert.equal(win.location.hash, "#/test/love-languages/result");
  assert.deepEqual(seen, ["/test/love-languages/result"], "replaceState fires no hashchange, so the router must resolve itself");
});

test("an ordinary navigation renders exactly once", async () => {
  const win = fakeWindow("#/test/love-languages/result");
  const { router, seen } = spyRouter(win);
  await router.start();
  seen.length = 0;

  await router.go("/test/love-languages");

  assert.deepEqual(seen, ["/test/love-languages"], "the hashchange listener renders; go must not render again");
});

test("navigating to the address already shown re-renders it", async () => {
  const win = fakeWindow("#/test/love-languages");
  const { router, seen } = spyRouter(win);
  await router.start();
  seen.length = 0;

  await router.go("/test/love-languages");

  assert.deepEqual(seen, ["/test/love-languages"]);
});
