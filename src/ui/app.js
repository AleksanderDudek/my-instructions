import { html, join, str } from "../core/html.js";
import { createRouter } from "../core/router.js";
import { makeStore, LocalAdapter } from "../core/store.js";
import { registry } from "../instruments/index.js";
import { homePage } from "./pages/home.js";
import { catalogPage } from "./pages/catalog.js";
import { runnerPage } from "./pages/runner.js";
import { resultPage } from "./pages/result.js";
import { sheetPage } from "./pages/sheet.js";
import { profilePage } from "./pages/profile.js";
import { comparePage } from "./pages/compare.js";

/**
 * The shell.
 *
 * A page is an async function of (ctx, params, query) returning either an
 * `html` result or `{ body, mount }`. That is the entire framework. Anything
 * needing behaviour after the HTML lands gets `mount(root)`; anything static
 * does not implement it. There is no virtual DOM because there is no shared
 * mutable view state — each route owns its subtree and replaces it wholesale.
 */

const NAV = [
  ["/", "Home"],
  ["/tests", "Tests"],
  ["/instructions", "My instructions"],
  ["/profile", "Panel"],
];

function boot() {
  const store = makeStore(new LocalAdapter(globalThis.localStorage ?? {}));
  const root = document.getElementById("view");
  const nav = document.getElementById("nav");
  const ctx = { store, registry };

  let seq = 0;
  const router = createRouter({
    async onRoute(handler, route) {
      const mine = ++seq;
      const out = await handler(ctx, route.params, route.query);
      if (mine !== seq) return; // a faster navigation won; drop this render
      const { body, mount } = typeof out === "object" && "body" in out ? out : { body: out, mount: null };
      root.innerHTML = str(body);
      paintNav(route.path);
      mount?.(root);
      animate(root);
      if (!route.path.startsWith("/test/") || route.path.endsWith("/result")) scrollTo({ top: 0, behavior: "instant" });
    },
    fallback: async () => html`<div class="empty"><h2>Nothing here</h2>
      <p class="prose">That address does not correspond to a page.</p>
      <p><a class="btn primary" href="#/">Go home</a></p></div>`,
  });
  ctx.router = router;

  function paintNav(path) {
    nav.innerHTML = str(join(NAV.map(([href, label]) => {
      const on = href === "/" ? path === "/" : path.startsWith(href);
      return html`<a href="#${href}" class="${on ? "on" : ""}" ${on ? html`aria-current="page"` : ""}>${label}</a>`;
    })));
  }

  /**
   * One animation pass for the whole app. Any element carrying `data-w` is a
   * bar that should grow to that percentage on the next frame; `#score` is a
   * number that counts up. Both are skipped under prefers-reduced-motion,
   * which is checked once here rather than in seven views.
   */
  function animate(scope) {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bars = scope.querySelectorAll("[data-w]");
    if (still) { bars.forEach((b) => (b.style.width = b.dataset.w + "%")); }
    else requestAnimationFrame(() => bars.forEach((b) => (b.style.width = b.dataset.w + "%")));

    const score = scope.querySelector("#score");
    if (!score) return;
    const total = Number(score.dataset.total) || 0;
    if (still) { score.textContent = total; return; }
    let n = 0;
    const step = () => {
      n += Math.max(1, Math.round(total / 28));
      if (n >= total) { score.textContent = total; return; }
      score.textContent = n;
      requestAnimationFrame(step);
    };
    step();
  }

  router
    .add("/", homePage)
    .add("/tests", catalogPage)
    .add("/test/:id", runnerPage)
    .add("/test/:id/result", resultPage)
    .add("/compare/:id", comparePage)
    .add("/instructions", sheetPage)
    .add("/profile", profilePage);

  if (!store.durable) document.body.classList.add("ephemeral");
  return router.start();
}

export { boot, NAV };
