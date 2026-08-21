import { html, join } from "../../core/html.js";
import { CHANNEL_LABEL } from "../../core/registry.js";

/**
 * The landing page has one job: make the *output* legible before anyone spends
 * six minutes on input. So it shows the instruction sheet's channels as empty
 * slots waiting to be filled, rather than a pitch.
 */
async function homePage(ctx) {
  const { registry, store } = ctx;
  const runs = await store.runs();
  const profile = await store.profile();
  const done = runs.length;
  const totalTests = registry.all().length;
  const cards = runs.flatMap((r) => {
    const spec = registry.get(r.instrumentId);
    return spec ? spec.instructions(r.result).map((c) => ({ ...c, from: spec.title })) : [];
  });
  const byChannel = {};
  for (const c of cards) (byChannel[c.channel] ??= []).push(c);

  return html`<section class="hero">
      <h2>${profile.displayName ? `${profile.displayName}'s instructions` : "Instructions for a person"}</h2>
      <p class="prose lead">Most of what goes wrong between two people is a documentation problem. You are running undocumented and so is everyone you know. Take a few tests, get one page that says how you work — what lands, what drains you, what to do when it goes badly — and hand it over.</p>
      <div class="hero-actions">
        <a class="btn primary" href="#/tests">${done ? "Take another" : "Start with a test"}</a>
        ${done ? html`<a class="btn" href="#/instructions">Read my instructions</a>` : ""}
      </div>
      <p class="progress-line"><span class="num">${done}</span> of <span class="num">${totalTests}</span> completed${done ? "" : " — the sheet fills in as you go"}.</p>
    </section>

    <section class="plate">
      <div class="plate-head"><h2>The sheet</h2><span class="rule"></span><span class="label">six channels</span></div>
      <div class="channel-grid">
        ${join(Object.entries(CHANNEL_LABEL).map(([key, label]) => {
          const got = byChannel[key] ?? [];
          return html`<div class="channel-slot${got.length ? " filled" : ""}">
            <span class="label">${label}</span>
            ${got.length
              ? html`<p class="prose">${got[0].body}</p><span class="slot-count">${got.length} line${got.length > 1 ? "s" : ""}</span>`
              : html`<p class="prose muted">Empty. A test will fill this in.</p>`}
          </div>`;
        }))}
      </div>
    </section>

    <section class="plate">
      <div class="plate-head"><h2>How it works</h2><span class="rule"></span></div>
      <div class="how">
        <div><span class="how-n num">1</span><h4>Take what applies</h4><p class="prose">Four instruments today, each a self-contained plugin. New ones appear in the catalogue without anything else changing.</p></div>
        <div><span class="how-n num">2</span><h4>Everything stays local</h4><p class="prose">Your answers are in this browser and nowhere else. No account, no server, no analytics. Export the lot as a file whenever you want.</p></div>
        <div><span class="how-n num">3</span><h4>Choose what to share</h4><p class="prose">Every result carries its own visibility — private, friends, public. Today that governs what a share link contains. Later it governs what the network can see.</p></div>
      </div>
    </section>`;
}

export { homePage };
