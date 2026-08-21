import { html, join } from "../../core/html.js";
import { CHANNELS, CHANNEL_LABEL } from "../../core/registry.js";

/**
 * The instruction sheet — the thing the whole app is for.
 *
 * Every instrument contributes cards tagged with a channel, and this page is
 * nothing but a regroup of those cards by channel rather than by test. That
 * inversion is the product: nobody wants to read four test results, they want
 * to know how to talk to you.
 */
async function sheetPage(ctx) {
  const { registry, store } = ctx;
  const runs = await store.runs();
  const profile = await store.profile();

  const cards = runs.flatMap((run) => {
    const spec = registry.get(run.instrumentId);
    if (!spec) return [];
    return spec.instructions(run.result).map((c) => ({ ...c, from: spec.title, id: spec.id, visibility: run.visibility }));
  });

  if (!cards.length) {
    return html`<div class="empty">
      <h2>Nothing to say yet</h2>
      <p class="prose">Your instruction sheet is assembled from the tests you have taken. Take one and it starts filling in.</p>
      <p><a class="btn primary" href="#/tests">Open the catalogue</a></p></div>`;
  }

  const byChannel = {};
  for (const c of cards) (byChannel[c.channel] ??= []).push(c);
  const missing = registry.all().filter((s) => !runs.some((r) => r.instrumentId === s.id));
  const shownPublicly = cards.filter((c) => c.visibility !== "private").length;

  const body = html`<article class="sheet" id="sheet">
    <header class="page-head">
      <h2>${profile.displayName ? `Instructions for ${profile.displayName}` : "Instructions for a person"}</h2>
      ${profile.note ? html`<p class="prose lead">${profile.note}</p>` : ""}
      <p class="prose muted">${cards.length} lines from ${runs.length} instrument${runs.length > 1 ? "s" : ""}. ${shownPublicly} would be visible to others; the rest are private.</p>
      <div class="hero-actions">
        <button type="button" class="btn" id="print">Print or save as PDF</button>
        <a class="btn" href="#/profile">Edit heading</a>
      </div>
    </header>

    ${join(CHANNELS.filter((ch) => byChannel[ch]).map((ch) => html`
      <section class="plate">
        <div class="plate-head"><h2>${CHANNEL_LABEL[ch]}</h2><span class="rule"></span><span class="label">${byChannel[ch].length}</span></div>
        <div class="cards">
          ${join(byChannel[ch].map((c) => html`<div class="card pad instruction-card vis-${c.visibility}">
            <h4>${c.title}</h4>
            <p class="prose">${c.body}</p>
            <a class="from" href="#/test/${c.id}/result">${c.from}</a>
          </div>`))}
        </div>
      </section>`))}

    ${missing.length ? html`<section class="plate">
      <div class="plate-head"><h2>Still blank</h2><span class="rule"></span></div>
      <div class="test-list">
        ${join(missing.map((s) => html`<a class="test-card new" href="#/test/${s.id}">
          <span class="test-glyph">${s.glyph}</span>
          <div class="test-body"><h3>${s.title}</h3><p>${s.tagline}</p></div>
          <span class="test-state new">${s.minutes} min</span></a>`))}
      </div>
    </section>` : ""}
  </article>`;

  const mount = (root) => root.querySelector("#print")?.addEventListener("click", () => print());
  return { body, mount };
}

export { sheetPage };
