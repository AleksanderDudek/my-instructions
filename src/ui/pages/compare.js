import { html, join } from "../../core/html.js";
import { decode, link } from "../../core/share.js";

/**
 * Two readings, one page.
 *
 * This is the whole network feature, built without a network: the other
 * person's answers arrive in the URL, get re-scored locally by the current
 * version of the instrument, and are never stored. When there is a server, the
 * only thing that changes is where `theirs` comes from.
 *
 * The token carries answers keyed by item id, and item ids are the same in
 * every language — so a result taken in Polish opens correctly here in German
 * and is re-scored against the reader's own copy of the instrument.
 */
async function comparePage(ctx, { id }, query) {
  const { t } = ctx;
  const spec = ctx.registry.get(id);
  if (!spec) return html`<div class="empty"><h2>${t("runner.noSuchTest")}</h2><p><a class="btn" href="#/tests">${t("common.catalogue")}</a></p></div>`;

  const it = ctx.instrument(spec).t;
  const title = it("title");

  if (!spec.compare) {
    return html`<div class="empty"><h2>${t("compare.noCompareTitle", { test: title })}</h2>
      <p class="prose">${t("compare.noCompareBody")}</p><p><a class="btn" href="#/tests">${t("common.back")}</a></p></div>`;
  }

  const mine = await ctx.store.run(id);
  const profile = await ctx.store.profile();
  const token = query.get("with");

  if (!mine) {
    return html`<div class="empty"><h2>${t("compare.takeFirstTitle")}</h2>
      <p class="prose">${t("compare.takeFirstBody", { test: title })}</p>
      <p><a class="btn primary" href="#/test/${id}">${t("compare.takeFirstAction", { test: title })}</a></p></div>`;
  }

  if (!token) {
    const body = html`<article class="compare">
      <header class="page-head"><h2>${t("compare.heading", { test: title })}</h2>
        <p class="prose">${t("compare.lead")}</p></header>
      <div class="card pad">
        <div class="share-row"><button type="button" class="btn primary" id="copy">${t("compare.copyMine")}</button></div>
        <input class="share-fallback" id="url" readonly value="${link(mine, profile.displayName)}">
        <p class="warn" id="msg" role="status"></p>
      </div>
    </article>`;
    const mount = (root) =>
      root.querySelector("#copy").addEventListener("click", async () => {
        const url = root.querySelector("#url").value;
        try { await navigator.clipboard.writeText(url); root.querySelector("#msg").textContent = t("compare.copied"); }
        catch { root.querySelector("#url").select(); root.querySelector("#msg").textContent = t("compare.selectAndCopy"); }
      });
    return { body, mount };
  }

  let theirs;
  try { theirs = decode(token, t); } catch (err) {
    return html`<div class="empty"><h2>${t("compare.badLinkTitle")}</h2><p class="prose">${err.message}</p>
      <p><a class="btn" href="#/compare/${id}">${t("compare.makeOwn")}</a></p></div>`;
  }
  if (theirs.instrumentId !== id) {
    const other = ctx.registry.get(theirs.instrumentId);
    return html`<div class="empty"><h2>${t("compare.wrongTestTitle")}</h2>
      <p class="prose">${t("compare.wrongTestBody", { theirs: other ? ctx.instrument(other).t("title") : theirs.instrumentId, mine: title })}</p>
      <p><a class="btn" href="#/compare/${theirs.instrumentId}?with=${token}">${t("compare.wrongTestAction")}</a></p></div>`;
  }

  const nameA = profile.displayName || t("compare.you");
  const nameB = theirs.name || t("compare.them");
  const theirResult = spec.score(theirs.answers);

  return html`<article class="compare">
    <header class="page-head"><h2>${t("compare.bothHeading", { a: nameA, b: nameB })}</h2>
      <p class="prose">${t("compare.bothLead", { test: title })}</p></header>
    <section class="plate">${spec.compare(mine.result, theirResult, { nameA, nameB, t: it })}</section>
    <section class="plate">
      <div class="plate-head"><h2>${t("compare.theirHeading")}</h2><span class="rule"></span><span class="label">${t("compare.theirNote")}</span></div>
      <div class="cards">
        ${join(spec.instructions(theirResult, it).map((c) => html`<div class="card pad instruction-card">
          <h4>${c.title}</h4><p class="prose">${c.body}</p></div>`))}
      </div>
    </section>
    <p class="source-note prose">${it("sourceNote")}</p>
  </article>`;
}

export { comparePage };
