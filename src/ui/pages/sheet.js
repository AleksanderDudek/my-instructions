import { html, join } from "../../core/html.js";
import { CHANNELS, channelKey } from "../../core/registry.js";

/**
 * The instruction sheet — the thing the whole app is for.
 *
 * Every instrument contributes cards tagged with a channel, and this page is
 * nothing but a regroup of those cards by channel rather than by test. That
 * inversion is the product: nobody wants to read four test results, they want
 * to know how to talk to you.
 */
async function sheetPage(ctx) {
  const { registry, store, t } = ctx;
  const runs = await store.runs();
  const profile = await store.profile();

  const cards = runs.flatMap((run) => {
    const spec = registry.get(run.instrumentId);
    if (!spec) return [];
    const it = ctx.instrument(spec).t;
    return spec.instructions(run.result, it).map((c) => ({ ...c, from: it("title"), id: spec.id, visibility: run.visibility }));
  });

  if (!cards.length) {
    return html`<div class="empty">
      <h2>${t("sheet.emptyTitle")}</h2>
      <p class="prose">${t("sheet.emptyBody")}</p>
      <p><a class="btn primary" href="#/tests">${t("sheet.emptyAction")}</a></p></div>`;
  }

  const byChannel = {};
  for (const c of cards) (byChannel[c.channel] ??= []).push(c);
  const missing = registry.all().filter((s) => !runs.some((r) => r.instrumentId === s.id));
  const shownPublicly = cards.filter((c) => c.visibility !== "private").length;

  const body = html`<article class="sheet" id="sheet">
    <header class="page-head">
      <h2>${profile.displayName ? t("sheet.titleNamed", { name: profile.displayName }) : t("sheet.titleAnon")}</h2>
      ${profile.note ? html`<p class="prose lead">${profile.note}</p>` : ""}
      <p class="prose muted">${t("sheet.summary", { lines: cards.length, instruments: runs.length, shown: shownPublicly })}</p>
      <div class="hero-actions">
        <button type="button" class="btn" id="print">${t("sheet.print")}</button>
        <a class="btn" href="#/profile">${t("sheet.editHeading")}</a>
      </div>
    </header>

    ${join(CHANNELS.filter((ch) => byChannel[ch]).map((ch) => html`
      <section class="plate">
        <div class="plate-head"><h2>${t(channelKey(ch))}</h2><span class="rule"></span><span class="label">${byChannel[ch].length}</span></div>
        <div class="cards">
          ${join(byChannel[ch].map((c) => html`<div class="card pad instruction-card vis-${c.visibility}">
            <h4>${c.title}</h4>
            <p class="prose">${c.body}</p>
            <a class="from" href="#/test/${c.id}/result">${c.from}</a>
          </div>`))}
        </div>
      </section>`))}

    ${missing.length ? html`<section class="plate">
      <div class="plate-head"><h2>${t("sheet.blankHeading")}</h2><span class="rule"></span></div>
      <div class="test-list">
        ${join(missing.map((s) => {
          const it = ctx.instrument(s).t;
          return html`<a class="test-card new" href="#/test/${s.id}">
            <span class="test-glyph">${s.glyph}</span>
            <div class="test-body"><h3>${it("title")}</h3><p>${it("tagline")}</p></div>
            <span class="test-state new">${t("common.minutes", { count: s.minutes })}</span></a>`;
        }))}
      </div>
    </section>` : ""}
  </article>`;

  const mount = (root) => root.querySelector("#print")?.addEventListener("click", () => print());
  return { body, mount };
}

export { sheetPage };
