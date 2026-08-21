/**
 * Hash routing.
 *
 * The hash, not the History API, because this app has to keep working when it
 * is opened as a bare file or pasted into a sandboxed frame — both of which
 * refuse `pushState`. The cost is an ugly `#/`; the benefit is that a saved
 * page still routes.
 *
 * Routes are patterns with `:params`: "/test/:id/result".
 */

function compile(pattern) {
  const parts = pattern.split("/").filter(Boolean);
  return { parts, pattern };
}

function match(route, path) {
  const got = path.split("/").filter(Boolean);
  if (got.length !== route.parts.length) return null;
  const params = {};
  for (let i = 0; i < route.parts.length; i++) {
    const want = route.parts[i];
    if (want.startsWith(":")) params[want.slice(1)] = decodeURIComponent(got[i]);
    else if (want !== got[i]) return null;
  }
  return params;
}

function createRouter({ onRoute, fallback, win = globalThis }) {
  const routes = [];
  let current = null;

  function parse() {
    const raw = win.location.hash.replace(/^#/, "");
    const [path, query = ""] = raw.split("?");
    return { path: path || "/", query: new URLSearchParams(query) };
  }

  async function resolve() {
    const { path, query } = parse();
    for (const r of routes) {
      const params = match(r, path);
      if (params) {
        current = { path, params, query, pattern: r.pattern };
        await onRoute(r.handler, current);
        return;
      }
    }
    current = { path, params: {}, query, pattern: null };
    await onRoute(fallback, current);
  }

  return {
    add(pattern, handler) { const r = compile(pattern); r.handler = handler; routes.push(r); return this; },
    start() { win.addEventListener("hashchange", resolve); return resolve(); },
    get current() { return current; },
    /**
     * Navigate. `replace` keeps the back button from filling with wizard steps.
     *
     * The two branches are not symmetric and the asymmetry is the whole point:
     * assigning `location.hash` fires `hashchange`, so the listener renders.
     * `history.replaceState` fires nothing at all, so this has to resolve for
     * itself — without that call the address bar changes and the page does not.
     */
    go(path, { replace = false } = {}) {
      const next = "#" + path;
      if (win.location.hash === next) return resolve();
      if (replace) {
        win.history.replaceState(null, "", next);
        return resolve();
      }
      win.location.hash = next;
    },
    href: (path) => "#" + path,
  };
}

export { createRouter, match, compile };
