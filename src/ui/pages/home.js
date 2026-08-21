import { html, join } from "../../core/html.js";
import { CHANNELS, channelKey } from "../../core/registry.js";

/**
 * The landing page has one job: make the *output* legible before anyone spends
 * six minutes on input. So it shows the instruction sheet's channels as empty
 * slots waiting to be filled, rather than a pitch.
 */
async function homePage(ctx) {
  const { registry, store, t } = ctx;
  const runs = await store.runs();
  const profile = await store.profile();
  const done = runs.length;
  const totalTests = registry.all().length;
  const cards = runs.flatMap((r) => {
    const spec = registry.get(r.instrumentId);
    return spec ? spec.instructions(r.result, ctx.instrument(spec).t).map((c) => ({ ...c, from: spec.id })) : [];
  });
  const byChannel = {};
  for (const c of cards) (byChannel[c.channel] ??= []).push(c);

  return html`<section class="hero">
      <h2>${profile.displayName ? t("home.titleNamed", { name: profile.displayName }) : t("home.titleAnon")}</h2>
      <p class="prose lead">${t("home.lead")}</p>
      <div class="hero-actions">
        <a class="btn primary" href="#/tests">${done ? t("home.startAgain") : t("home.startFirst")}</a>
        ${done ? html`<a class="btn" href="#/instructions">${t("home.readSheet")}</a>` : ""}
      </div>
      <p class="progress-line">${t(done ? "home.progress" : "home.progressEmpty", { done, total: totalTests })}</p>
    </section>

    <section class="plate">
      <div class="plate-head"><h2>${t("home.sheetHeading")}</h2><span class="rule"></span><span class="label">${t("home.sheetNote")}</span></div>
      <div class="channel-grid">
        ${join(CHANNELS.map((key) => {
          const got = byChannel[key] ?? [];
          return html`<div class="channel-slot${got.length ? " filled" : ""}">
            <span class="label">${t(channelKey(key))}</span>
            ${got.length
              ? html`<p class="prose">${got[0].body}</p><span class="slot-count">${t("home.slotCount", { count: got.length })}</span>`
              : html`<p class="prose muted">${t("home.slotEmpty")}</p>`}
          </div>`;
        }))}
      </div>
    </section>

    <section class="plate">
      <div class="plate-head"><h2>${t("home.howHeading")}</h2><span class="rule"></span></div>
      <div class="how">
        <div><span class="how-n num">1</span><h4>${t("home.how1Title")}</h4><p class="prose">${t("home.how1Body", { count: totalTests })}</p></div>
        <div><span class="how-n num">2</span><h4>${t("home.how2Title")}</h4><p class="prose">${t("home.how2Body")}</p></div>
        <div><span class="how-n num">3</span><h4>${t("home.how3Title")}</h4><p class="prose">${t("home.how3Body")}</p></div>
      </div>
    </section>`;
}

export { homePage };
