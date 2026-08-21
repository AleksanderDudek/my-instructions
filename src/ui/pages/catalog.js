import { html, join } from "../../core/html.js";

/**
 * The catalogue.
 *
 * Two groups, because the two families genuinely differ in what they ask of
 * you: a profiler wants a fact and takes a minute, a questionnaire wants
 * forty honest answers and takes six. Conflating them makes the whole list
 * look like homework.
 */

const stateOf = (run, spec) => {
  if (!run) return { key: "new", label: "Not taken" };
  if (run.instrumentVersion !== spec.version) return { key: "stale", label: "Updated since you took it" };
  return { key: "done", label: `Taken ${new Date(run.completedAt).toLocaleDateString()}` };
};

function cardHTML(spec, run, draft) {
  const state = stateOf(run, spec);
  const resume = draft && !run ? `${Object.keys(draft.answers ?? {}).length} of ${draft.total ?? "?"} answered` : null;
  return html`<a class="test-card ${state.key}" href="#/test/${spec.id}">
    <span class="test-glyph" aria-hidden="true">${spec.glyph}</span>
    <div class="test-body">
      <h3>${spec.title}</h3>
      <p>${spec.tagline}</p>
      <div class="test-meta">
        <span class="pill">${spec.minutes} min</span>
        <span class="pill">${spec.framework}</span>
        ${run ? html`<span class="pill vis vis-${run.visibility}">${run.visibility}</span>` : ""}
      </div>
    </div>
    <span class="test-state ${state.key}">${resume ?? state.label}</span>
  </a>`;
}

async function catalogPage(ctx) {
  const { registry, store } = ctx;
  const runs = Object.fromEntries((await store.runs()).map((r) => [r.instrumentId, r]));
  const drafts = await store.drafts();

  return html`<header class="page-head">
      <h2>Tests &amp; profilers</h2>
      <p class="prose">Each one adds a page to your instructions. Take them in any order; take none of them twice unless something has changed.</p>
    </header>
    ${join(registry.groups().map((g) => html`
      <section class="plate">
        <div class="plate-head"><h2>${g.label}</h2><span class="rule"></span><span class="label">${g.note}</span></div>
        <div class="test-list">${join(g.items.map((s) => cardHTML(s, runs[s.id], drafts[s.id])))}</div>
      </section>`))}`;
}

export { catalogPage, stateOf };
