import { html, join, str } from "../core/html.js";
import { createRouter } from "../core/router.js";
import { createI18n } from "../core/i18n.js";
import { DEFAULT_LOCALE, resolveLocale, loadMessages } from "../core/locales.js";
import { makeStore, LocalAdapter } from "../core/store.js";
import { makeContext } from "./context.js";
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
  ["/", "nav.home"],
  ["/tests", "nav.tests"],
  ["/instructions", "nav.instructions"],
  ["/profile", "nav.panel"],
];

/**
 * English is loaded alongside the reader's language and stands behind it. A
 * key a translator has not reached yet then renders in English rather than
 * leaving a hole in the page — a safety net, not a workflow: the parity test
 * fails on any gap before a locale ships.
 */
async function loadLocale(store) {
  const settings = await store.settings();
  const preferred = globalThis.navigator?.languages ?? [globalThis.navigator?.language].filter(Boolean);
  const locale = resolveLocale(settings.locale, preferred);
  const instruments = registry.all();
  const messages = await loadMessages(instruments, locale);
  const fallbackMessages = locale === DEFAULT_LOCALE ? messages : await loadMessages(instruments, DEFAULT_LOCALE);
  return createI18n({ locale, messages, fallbackMessages });
}

async function boot() {
  const store = makeStore(new LocalAdapter(globalThis.localStorage ?? {}));
  const i18n = await loadLocale(store);
  const root = document.getElementById("view");
  const nav = document.getElementById("nav");
  const ctx = makeContext({ store, registry, i18n });

  document.documentElement.lang = i18n.locale;
  document.title = i18n.t("app.title");

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
    fallback: async () => html`<div class="empty"><h2>${i18n.t("error.notFoundTitle")}</h2>
      <p class="prose">${i18n.t("error.notFoundBody")}</p>
      <p><a class="btn primary" href="#/">${i18n.t("common.goHome")}</a></p></div>`,
  });
  ctx.router = router;

  function paintNav(path) {
    nav.innerHTML = str(join(NAV.map(([href, key]) => {
      const on = href === "/" ? path === "/" : path.startsWith(href);
      return html`<a href="#${href}" class="${on ? "on" : ""}" ${on ? html`aria-current="page"` : ""}>${i18n.t(key)}</a>`;
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
