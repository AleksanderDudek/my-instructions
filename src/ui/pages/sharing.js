import { html, join } from "../../core/html.js";
import { AUDIENCES, elementsFor, reportLink } from "../../core/report.js";
import { audiencesFor } from "../../core/registry.js";

/**
 * One place to decide who sees what.
 *
 * Every shareable thing is a row, every row carries one audience, and the two
 * links at the bottom are built from those rows. The important property is not
 * on this page at all: a link for an audience is *built from* that audience's
 * elements, so whatever is withheld is missing from the link rather than
 * hidden by whatever renders it.
 *
 * Audiences widen rather than nest arbitrarily — anything public is also in
 * the friends report, and private is in neither. That is why each row is one
 * setting rather than a grid of checkboxes: a matrix would let someone say
 * "public but not friends", which is not a thing a link can mean.
 */

/** The rows, in the order they are worth deciding about. */
async function rowsFor(ctx) {
  const { store, registry, t } = ctx;
  const profile = await store.profile();
  const runs = await store.runs();

  const rows = [
    { id: "profile.name", label: t("sharing.row.name"), value: profile.displayName || t("sharing.unset") },
    { id: "profile.pronouns", label: t("sharing.row.pronouns"), value: profile.pronouns || t("sharing.unset") },
    { id: "profile.note", label: t("sharing.row.note"), value: profile.note || t("sharing.unset") },
  ];

  for (const run of runs) {
    const spec = registry.get(run.instrumentId);
    if (!spec) continue;
    const it = ctx.instrument(spec).t;
    rows.push({
      id: `run.${spec.id}`,
      label: it("title"),
      value: t("sharing.cardCount", { count: spec.instructions(run.result, it).length }),
      glyph: spec.glyph,
      // An instrument may narrow what the page is allowed to offer for it.
      // The buttons that are missing here are missing on purpose.
      audiences: audiencesFor(spec),
      sensitive: Boolean(spec.sensitive),
    });
  }
  return rows;
}

async function sharingPage(ctx) {
  const { store, t } = ctx;
  const sharing = await store.sharing();
  const rows = await rowsFor(ctx);
  const profile = await store.profile();
  const runs = await store.runs();

  const counts = Object.fromEntries(
    AUDIENCES.filter((a) => a !== "private").map((a) => [a, elementsFor(sharing, a).length]));

  const linkFor = (audience) =>
    reportLink({ registry: ctx.registry, profile, runs, sharing, audience });

  const body = html`<article class="sharing" id="sharing">
    <header class="page-head">
      <h2>${t("sharing.heading")}</h2>
      <p class="prose">${t("sharing.lead")}</p>
    </header>

    <section class="plate">
      <div class="plate-head"><h2>${t("sharing.tableHeading")}</h2><span class="rule"></span>
        <span class="label">${t("sharing.tableNote")}</span></div>
      <div class="run-table">
        ${join(rows.map((row) => html`<div class="run-row" data-element="${row.id}">
          <span class="run-name">${row.glyph ? html`<span class="test-glyph">${row.glyph}</span>` : ""}${row.label}
            <span class="label muted"> ${row.value}</span>
            ${row.sensitive ? html`<span class="label muted"> · ${t("sharing.sensitiveNote")}</span>` : ""}</span>
          <span class="vis-row small" role="group" aria-label="${t("sharing.audienceFor", { element: row.label })}">
            ${join((row.audiences ?? AUDIENCES).map((audience) => html`<button type="button"
              class="vis-btn${(sharing[row.id] ?? "private") === audience ? " on" : ""}"
              data-element="${row.id}" data-audience="${audience}">${t(`audience.${audience}`)}</button>`))}
          </span>
        </div>`))}
      </div>
    </section>

    <section class="plate">
      <div class="plate-head"><h2>${t("sharing.linksHeading")}</h2><span class="rule"></span></div>
      <div class="cards">
        ${join(["friends", "public"].map((audience) => html`<div class="card pad">
          <span class="label">${t(`audience.${audience}`)}</span>
          <h4>${t("sharing.linkCount", { count: counts[audience] })}</h4>
          <p class="prose muted">${t(`sharing.explain.${audience}`)}</p>
          <div class="share-row">
            <button type="button" class="btn primary" data-copy="${audience}">${t("sharing.copyLink")}</button>
            <a class="btn" href="#/report?d=${encodeURIComponent(linkFor(audience).split("d=")[1])}">${t("sharing.preview")}</a>
          </div>
          <input class="share-fallback" data-url="${audience}" readonly value="${linkFor(audience)}">
        </div>`))}
      </div>
      <p class="warn" id="sharing-msg" role="status"></p>
      <p class="prose muted">${t("sharing.absentNote")}</p>
      <p class="prose muted">${t("sharing.expiryNote")}</p>
    </section>
  </article>`;

  function mount(root) {
    root.querySelector(".run-table").addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-audience]");
      if (!btn) return;
      await store.setAudience(btn.dataset.element, btn.dataset.audience);
      // The links below are now stale, and rebuilding them by hand from here
      // would duplicate the filter. Re-render the route instead.
      ctx.router.go("/sharing", { replace: true });
    });

    root.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      const input = root.querySelector(`[data-url="${btn.dataset.copy}"]`);
      const msg = root.querySelector("#sharing-msg");
      try { await navigator.clipboard.writeText(input.value); msg.textContent = t("sharing.copied"); }
      catch { input.select(); msg.textContent = t("sharing.selectAndCopy"); }
    });
  }

  return { body, mount };
}

export { sharingPage, rowsFor };
