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

async function runnerPage(ctx, { id }) {
  const spec = ctx.registry.get(id);
  if (!spec) return { body: html`<div class="empty"><h2>No such test</h2><p><a class="btn" href="#/tests">Back to the catalogue</a></p></div>` };
  const form = spec.form();
  return form.kind === "items" ? questionnaire(ctx, spec, form) : profiler(ctx, spec, form);
}

/* ══ questionnaire ════════════════════════════════════════════════ */

async function questionnaire(ctx, spec, form) {
  const { store, router } = ctx;
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
      <a class="back" href="#/tests">← All tests</a>
      <h2>${spec.title}</h2>
      <p class="prose">${spec.tagline}</p>
    </header>
    <div id="runner-body"></div>
  </article>`;

  function pageHTML() {
    const slice = order.slice(state.page * state.pageSize, (state.page + 1) * state.pageSize);
    const answered = order.filter((k) => state.answers[k] !== undefined).length;
    const last = state.page === pages - 1;
    const pageDone = slice.every((k) => state.answers[k] !== undefined);
    return str(html`
      <div class="runner-progress">
        <div class="rp-bar"><i style="width:${Math.round((answered / order.length) * 100)}%"></i></div>
        <span class="rp-count num">${answered} / ${order.length}</span>
      </div>
      <form class="items" id="item-form">
        ${join(slice.map((key, i) => itemHTML(byId.get(key), state.answers[key], form.scale, state.page * state.pageSize + i)))}
      </form>
      <nav class="runner-nav">
        <button type="button" class="btn" id="prev" ${raw(state.page === 0 ? "disabled" : "")}>Back</button>
        <span class="rp-page label">Page ${state.page + 1} of ${pages}</span>
        ${last
          ? html`<button type="button" class="btn primary" id="finish" ${raw(answered < order.length ? "disabled" : "")}>
              ${answered < order.length ? `${order.length - answered} left` : "See my result"}</button>`
          : html`<button type="button" class="btn primary" id="next" ${raw(pageDone ? "" : "disabled")}>Next</button>`}
      </nav>`);
  }

  function mount(root) {
    const host = root.querySelector("#runner-body");
    const paint = () => { host.innerHTML = pageHTML(); host.querySelector(".item")?.scrollIntoView({ block: "nearest" }); };

    const save = () => store.saveDraft(spec.id, { answers: state.answers, order, seed, page: state.page, total: order.length });

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
      if (btn.id === "prev") { state.page--; paint(); save(); }
      if (btn.id === "next") { state.page++; paint(); save(); }
      if (btn.id === "finish") {
        btn.disabled = true;
        await store.saveRun({
          instrumentId: spec.id,
          instrumentVersion: spec.version,
          answers: state.answers,
          result: spec.score(state.answers),
        });
        router.go(`/test/${spec.id}/result`, { replace: true });
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

async function profiler(ctx, spec, form) {
  const { store, router } = ctx;
  const existing = await store.run(spec.id);
  const state = { values: { ...(existing?.answers ?? {}) }, errors: {} };

  const body = html`<article class="runner" id="runner" data-instrument="${spec.id}">
    <header class="runner-head">
      <a class="back" href="#/tests">← All tests</a>
      <h2>${spec.title}</h2>
      <p class="prose">${spec.tagline}</p>
    </header>
    <div id="runner-body"></div>
  </article>`;

  function pageHTML() {
    return str(html`
      <form class="fields" id="field-form">
        ${join(form.fields.map((f) => fieldHTML(f, state.values[f.id], state.errors[f.id])))}
      </form>
      ${form.note ? html`<p class="note prose">${form.note}</p>` : ""}
      <nav class="runner-nav"><span></span><span></span>
        <button type="button" class="btn primary" id="finish">See my result</button></nav>`);
  }

  function read(root) {
    const out = {};
    for (const f of form.fields) out[f.id] = readControl(root, f) ?? f.value ?? "";
    return out;
  }

  function mount(root) {
    const host = root.querySelector("#runner-body");
    const paint = () => { host.innerHTML = pageHTML(); };

    host.addEventListener("click", async (e) => {
      if (!e.target.closest("#finish")) return;
      state.values = read(host);
      state.errors = spec.validate ? spec.validate(state.values) : {};
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

export { runnerPage, shuffled, mulberry32 };
