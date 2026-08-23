import { html, join, str, raw } from "../../core/html.js";
import { itemHTML, fieldHTML, readControl } from "../components/fields.js";

/**
 * The form runner. One module drives every instrument in the app.
 *
 * Questionnaires are paged rather than presented as one long scroll. The
 * reason is not aesthetic: a forty-item page invites pattern-answering down
 * the column, and five items at a time forces each one to be read. The order
 * is shuffled so that the eight consecutive items measuring the same thing do
 * not announce themselves — but shuffled *once*, with the order stored in the
 * draft, so that leaving and coming back does not re-deal the deck.
 */

/* A tiny seeded PRNG. Deterministic shuffles need a seed we can persist. */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(ids, seed) {
  const rnd = mulberry32(seed), out = [...ids];
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}

/**
 * `?who=b` is the second person of a pair, answering on the same device.
 *
 * Anything other than the literal "b" is treated as the first person rather
 * than as an error, so a mangled link answers the ordinary questionnaire
 * instead of opening a half-state nobody asked for.
 */
const slotOf = (query) => (query?.get?.("who") === "b" ? "b" : null);

async function runnerPage(ctx, { id }, query) {
  const spec = ctx.registry.get(id);
  if (!spec) {
    return { body: html`<div class="empty"><h2>${ctx.t("runner.noSuchTest")}</h2>
      <p><a class="btn" href="#/tests">${ctx.t("runner.backToCatalogue")}</a></p></div>` };
  }
  const slot = spec.pairwise ? slotOf(query) : null;
  const scoped = ctx.instrument(spec);
  const form = spec.form(scoped.t, ctx.locale);
  return form.kind === "items"
    ? questionnaire(ctx, scoped, spec, form, slot)
    : profiler(ctx, scoped, spec, form);
}

/* ══ questionnaire ════════════════════════════════════════════════ */

async function questionnaire(ctx, scoped, spec, form, slot = null) {
  const { store, router, t } = ctx;
  const it = scoped.t;
  const existing = await store.run(spec.id);
  const draft = (await store.draft(spec.id)) ?? null;

  const byId = new Map(form.items.map((i) => [i.id, i]));
  const seed = draft?.seed ?? ((Math.random() * 2 ** 31) | 0);
  const order = draft?.order?.length ? draft.order.filter((x) => byId.has(x)) : form.shuffle ? shuffled([...byId.keys()], seed) : [...byId.keys()];
  // A new item added in a later version joins the end rather than reshuffling.
  for (const key of byId.keys()) if (!order.includes(key)) order.push(key);

  const state = {
    answers: { ...(draft?.answers ?? (existing?.instrumentVersion === spec.version ? existing.answers : {})) },
    page: 0,
    pageSize: form.pageSize ?? 5,
  };
  const pages = Math.ceil(order.length / state.pageSize);
  state.page = Math.min(draft?.page ?? 0, pages - 1);

  const body = html`<article class="runner" id="runner" data-instrument="${spec.id}">
    <header class="runner-head">
      <a class="back" href="#/tests">${t("common.allTests")}</a>
      <h2>${it("title")}</h2>
      <p class="prose">${it("tagline")}</p>
    </header>
    <div id="runner-body"></div>
  </article>`;

  function pageHTML() {
    const slice = order.slice(state.page * state.pageSize, (state.page + 1) * state.pageSize);
    const answered = order.filter((k) => state.answers[k] !== undefined).length;
    const last = state.page === pages - 1;
    // An optional form never blocks. Requiring an answer is right for a scored
    // scale, where a gap is a hole in the arithmetic, and wrong for anything
    // asking about a marriage or a body — where "I would rather not" is a real
    // answer and forcing one produces a false one.
    const pageDone = form.optional || slice.every((k) => state.answers[k] !== undefined);
    const canFinish = form.optional || answered === order.length;
    return str(html`
      <div class="runner-progress">
        <div class="rp-bar"><i style="width:${Math.round((answered / order.length) * 100)}%"></i></div>
        <span class="rp-count num">${t("runner.count", { answered, total: order.length })}</span>
      </div>
      <form class="items" id="item-form">
        ${join(slice.map((key, i) => itemHTML(byId.get(key), state.answers[key], form.scale, state.page * state.pageSize + i, t)))}
      </form>
      <nav class="runner-nav">
        <button type="button" class="btn" id="prev" ${raw(state.page === 0 ? "disabled" : "")}>${t("common.back")}</button>
        <span class="rp-page label">${t("runner.page", { page: state.page + 1, pages })}</span>
        ${last
          ? html`<button type="button" class="btn primary" id="finish" ${raw(canFinish ? "" : "disabled")}>
              ${canFinish ? t("runner.finish") : t("runner.remaining", { count: order.length - answered })}</button>`
          : html`<button type="button" class="btn primary" id="next" ${raw(pageDone ? "" : "disabled")}>${t("runner.next")}</button>`}
      </nav>`);
  }

  function mount(root) {
    const host = root.querySelector("#runner-body");
    const paint = (opts) => repaint(host, pageHTML, opts);

    // A session-only instrument writes no draft. Leaving the page loses the
    // answers, which is the deal the page makes before the first question.
    const save = () => (spec.persistence === "session"
      ? Promise.resolve()
      : store.saveDraft(spec.id, { answers: state.answers, order, seed, page: state.page, total: order.length }));

    host.addEventListener("change", (e) => {
      const field = e.target.closest("[data-item]");
      if (!field) return;
      const item = byId.get(field.dataset.item);
      state.answers[item.id] = readControl(field, item);
      // Re-paint rather than patch: the nav's enabled state depends on the
      // whole page, and one source of truth beats three targeted updates.
      paint();
      save();
    });

    host.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.id === "prev") { state.page--; paint({ scroll: true }); save(); }
      if (btn.id === "next") { state.page++; paint({ scroll: true }); save(); }
      if (btn.id === "finish") {
        btn.disabled = true;
        await store.saveRun({
          instrumentId: spec.id,
          instrumentVersion: spec.version,
          answers: state.answers,
          result: spec.score(state.answers),
        }, { session: spec.persistence === "session", slot });
        router.go(`/test/${spec.id}/result${slot ? `?who=${slot}` : ""}`, { replace: true });
      }
    });

    // Number keys answer the first unanswered item on the page — fast for
    // anyone taking three of these in a row, invisible to everyone else.
    root.addEventListener("keydown", (e) => {
      if (e.target.matches("input,select,textarea") && e.target.type !== "radio") return;
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < form.scale.min || n > form.scale.max) return;
      const slice = order.slice(state.page * state.pageSize, (state.page + 1) * state.pageSize);
      const next = slice.find((k) => state.answers[k] === undefined);
      if (!next) return;
      state.answers[next] = n;
      e.preventDefault();
      paint(); save();
    });

    paint();
  }

  return { body, mount };
}

/* ══ profiler ═════════════════════════════════════════════════════ */

async function profiler(ctx, scoped, spec, form) {
  const { store, router, t } = ctx;
  const it = scoped.t;
  const existing = await store.run(spec.id);
  const state = { values: { ...(existing?.answers ?? {}) }, errors: {} };

  const body = html`<article class="runner" id="runner" data-instrument="${spec.id}">
    <header class="runner-head">
      <a class="back" href="#/tests">${t("common.allTests")}</a>
      <h2>${it("title")}</h2>
      <p class="prose">${it("tagline")}</p>
    </header>
    <div id="runner-body"></div>
  </article>`;

  function pageHTML() {
    return str(html`
      <form class="fields" id="field-form">
        ${join(form.fields.map((f) => fieldHTML(f, state.values[f.id], state.errors[f.id], t)))}
      </form>
      ${form.note ? html`<p class="note prose">${form.note}</p>` : ""}
      <nav class="runner-nav"><span></span><span></span>
        <button type="button" class="btn primary" id="finish">${t("runner.finish")}</button></nav>`);
  }

  function read(root) {
    const out = {};
    for (const f of form.fields) out[f.id] = readControl(root, f) ?? f.value ?? "";
    return out;
  }

  function mount(root) {
    const host = root.querySelector("#runner-body");
    const paint = () => repaint(host, pageHTML);

    host.addEventListener("click", async (e) => {
      if (!e.target.closest("#finish")) return;
      state.values = read(host);
      state.errors = spec.validate ? spec.validate(state.values, it) : {};
      if (Object.keys(state.errors).length) { paint(); return; }
      await store.saveRun({
        instrumentId: spec.id,
        instrumentVersion: spec.version,
        answers: state.values,
        result: spec.score(state.values),
      });
      router.go(`/test/${spec.id}/result`, { replace: true });
    });

    paint();
  }

  return { body, mount };
}

/**
 * Replace a region's markup without dropping the control the reader is using.
 *
 * The runner repaints the whole page on every answer, because the state of the
 * navigation depends on the whole page and one source of truth beats three
 * targeted updates. That reasoning holds for the markup and fails for the
 * person: `innerHTML =` destroys the element being interacted with, so focus
 * falls back to the document, tab order restarts from the top, and an open
 * native `<select>` is torn out from under the pointer mid-choice — which
 * reads, correctly, as the control not working.
 *
 * So the focused control is identified before the swap and re-focused after
 * it. Identity is the item it belongs to plus its name and value, which is
 * stable across a repaint in a way that a node reference is not.
 *
 * Scrolling is now opt-in. Doing it on every answer yanked the page under
 * somebody who was simply working down a list.
 */
function repaint(host, render, { scroll = false } = {}) {
  const active = host.ownerDocument.activeElement;
  const mark = active && host.contains(active)
    ? {
      item: active.closest("[data-item]")?.dataset.item ?? null,
      name: active.getAttribute?.("name") ?? null,
      value: active.getAttribute?.("value") ?? null,
      tag: active.tagName.toLowerCase(),
    }
    : null;

  host.innerHTML = render();

  if (mark) {
    const esc = (v) => (host.ownerDocument.defaultView?.CSS?.escape?.(v) ?? v);
    const scope = mark.item ? host.querySelector(`[data-item="${esc(mark.item)}"]`) : host;
    const selector = mark.name && mark.value !== null
      ? `[name="${esc(mark.name)}"][value="${esc(mark.value)}"]`
      : mark.name ? `[name="${esc(mark.name)}"]` : mark.tag;
    (scope ?? host).querySelector(selector)?.focus({ preventScroll: true });
  }
  if (scroll) host.querySelector(".item")?.scrollIntoView({ block: "nearest" });
}

export { runnerPage, shuffled, mulberry32, repaint };
