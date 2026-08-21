import { html, join } from "../../core/html.js";
import { CHANNELS, channelKey } from "../../core/registry.js";
import { decodeReport } from "../../core/report.js";

/**
 * Somebody else's sheet, as they chose to show it.
 *
 * Everything on this page came out of the link. There is no filtering here
 * and there deliberately cannot be: what the sender withheld is not in the
 * token, so this page could not display it even if it tried.
 *
 * Results are re-scored from the sender's answers against *this* browser's
 * copy of each instrument, which is what lets a sheet written in Polish be
 * read in German.
 */
async function reportPage(ctx, _params, query) {
  const { t, registry } = ctx;
  const token = query.get("d");

  if (!token) {
    return html`<div class="empty"><h2>${t("report.noTokenTitle")}</h2>
      <p class="prose">${t("report.noTokenBody")}</p>
      <p><a class="btn primary" href="#/sharing">${t("report.noTokenAction")}</a></p></div>`;
  }

  let report;
  try { report = decodeReport(token, registry, t); } catch (err) {
    return html`<div class="empty"><h2>${t("report.badTitle")}</h2>
      <p class="prose">${err.message}</p>
      <p><a class="btn" href="#/">${t("common.goHome")}</a></p></div>`;
  }

  const sections = report.runs.map((run) => {
    const spec = registry.get(run.instrumentId);
    const scoped = ctx.instrument(spec);
    const result = spec.score(run.answers);
    return { spec, scoped, result, stale: run.instrumentVersion !== spec.version };
  });

  const cards = sections.flatMap(({ spec, scoped, result }) =>
    spec.instructions(result, scoped.t).map((c) => ({ ...c, from: scoped.t("title"), id: spec.id })));
  const byChannel = {};
  for (const c of cards) (byChannel[c.channel] ??= []).push(c);

  const name = report.profile.displayName;

  return html`<article class="report" id="report">
    <header class="page-head">
      <h2>${name ? t("report.titleNamed", { name }) : t("report.titleAnon")}</h2>
      ${report.profile.pronouns ? html`<p class="label">${report.profile.pronouns}</p>` : ""}
      ${report.profile.note ? html`<p class="prose lead">${report.profile.note}</p>` : ""}
      <p class="prose muted">${t(`report.audienceNote.${report.audience}`)}</p>
    </header>

    ${cards.length ? join(CHANNELS.filter((ch) => byChannel[ch]).map((ch) => html`
      <section class="plate">
        <div class="plate-head"><h2>${t(channelKey(ch))}</h2><span class="rule"></span>
          <span class="label">${byChannel[ch].length}</span></div>
        <div class="cards">
          ${join(byChannel[ch].map((c) => html`<div class="card pad instruction-card">
            <h4>${c.title}</h4><p class="prose">${c.body}</p>
            <span class="from">${c.from}</span>
          </div>`))}
        </div>
      </section>`)) : ""}

    ${join(sections.map(({ spec, scoped, result, stale }) => html`
      <section class="plate">
        <div class="plate-head"><h2>${scoped.t("title")}</h2><span class="rule"></span>
          <span class="label">${scoped.t("framework")}</span></div>
        ${stale ? html`<div class="note warn-note prose"><p>${t("report.stale")}</p></div>` : ""}
        ${spec.view(result, scoped)}
      </section>`))}

    ${!sections.length && !cards.length
      ? html`<div class="empty"><h2>${t("report.emptyTitle")}</h2>
          <p class="prose">${t("report.emptyBody")}</p></div>`
      : ""}

    ${sections.some(({ spec }) => spec.family === "questionnaire")
      ? html`<p class="source-note prose">${t("app.noValidation")}</p>` : ""}
    <p class="source-note prose">${t("report.footer")}</p>
  </article>`;
}

export { reportPage };
