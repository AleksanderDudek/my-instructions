import { html, join } from "../../core/html.js";

/**
 * The catalogue.
 *
 * Two groups, because the two families genuinely differ in what they ask of
 * you: a profiler wants a fact and takes a minute, a questionnaire wants
 * forty honest answers and takes six. Conflating them makes the whole list
 * look like homework.
 */

/** Where a reader stands with one instrument, as a key and its variables. */
const stateOf = (run, spec, locale = "en") => {
  if (!run) return { key: "new", messageKey: "catalog.stateNew", vars: {} };
  if (run.instrumentVersion !== spec.version) return { key: "stale", messageKey: "catalog.stateStale", vars: {} };
  return {
    key: "done",
    messageKey: "catalog.stateDone",
    vars: { date: new Date(run.completedAt).toLocaleDateString(locale) },
  };
};

function cardHTML(ctx, spec, run, draft) {
  const { t, locale } = ctx;
  const it = ctx.instrument(spec).t;
  const state = stateOf(run, spec, locale);
  const resume = draft && !run
    ? t("catalog.stateResume", { answered: Object.keys(draft.answers ?? {}).length, total: draft.total ?? "?" })
    : null;
  return html`<a class="test-card ${state.key}" href="#/test/${spec.id}">
    <span class="test-glyph" aria-hidden="true">${spec.glyph}</span>
    <div class="test-body">
      <h3>${it("title")}</h3>
      <p>${it("tagline")}</p>
      <div class="test-meta">
        <span class="pill">${t("common.minutes", { count: spec.minutes })}</span>
        <span class="pill">${it("framework")}</span>
        ${run ? html`<span class="pill vis vis-${run.visibility}">${t(`vis.${run.visibility}`)}</span>` : ""}
      </div>
    </div>
    <span class="test-state ${state.key}">${resume ?? t(state.messageKey, state.vars)}</span>
  </a>`;
}

async function catalogPage(ctx) {
  const { registry, store, t } = ctx;
  const runs = Object.fromEntries((await store.runs()).map((r) => [r.instrumentId, r]));
  const drafts = await store.drafts();

  return html`<header class="page-head">
      <h2>${t("catalog.heading")}</h2>
      <p class="prose">${t("catalog.lead")}</p>
    </header>
    ${join(registry.groups().map((g) => html`
      <section class="plate">
        <div class="plate-head"><h2>${t(g.labelKey)}</h2><span class="rule"></span><span class="label">${t(g.noteKey)}</span></div>
        <div class="test-list">${join(g.items.map((s) => cardHTML(ctx, s, runs[s.id], drafts[s.id])))}</div>
      </section>`))}`;
}

export { catalogPage, stateOf };
