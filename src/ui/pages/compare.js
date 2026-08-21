import { html, join } from "../../core/html.js";
import { decode, link } from "../../core/share.js";

/**
 * Two readings, one page.
 *
 * This is the whole network feature, built without a network: the other
 * person's answers arrive in the URL, get re-scored locally by the current
 * version of the instrument, and are never stored. When there is a server, the
 * only thing that changes is where `theirs` comes from.
 */
async function comparePage(ctx, { id }, query) {
  const spec = ctx.registry.get(id);
  if (!spec) return html`<div class="empty"><h2>No such test</h2><p><a class="btn" href="#/tests">Catalogue</a></p></div>`;
  if (!spec.compare) return html`<div class="empty"><h2>${spec.title} does not compare</h2>
    <p class="prose">This instrument has no two-person reading.</p><p><a class="btn" href="#/tests">Back</a></p></div>`;

  const mine = await ctx.store.run(id);
  const profile = await ctx.store.profile();
  const token = query.get("with");

  if (!mine) {
    return html`<div class="empty"><h2>Take it first</h2>
      <p class="prose">You need your own ${spec.title} result before the comparison means anything.</p>
      <p><a class="btn primary" href="#/test/${id}">Take ${spec.title}</a></p></div>`;
  }

  if (!token) {
    const body = html`<article class="compare">
      <header class="page-head"><h2>Compare — ${spec.title}</h2>
        <p class="prose">Send this link to someone who has also taken it. When they open it they will see both readings; when you open theirs, so will you. Nothing is uploaded either way.</p></header>
      <div class="card pad">
        <div class="share-row"><button type="button" class="btn primary" id="copy">Copy my link</button></div>
        <input class="share-fallback" id="url" readonly value="${link(mine, profile.displayName)}">
        <p class="warn" id="msg" role="status"></p>
      </div>
    </article>`;
    const mount = (root) =>
      root.querySelector("#copy").addEventListener("click", async () => {
        const url = root.querySelector("#url").value;
        try { await navigator.clipboard.writeText(url); root.querySelector("#msg").textContent = "Copied."; }
        catch { root.querySelector("#url").select(); root.querySelector("#msg").textContent = "Select and copy."; }
      });
    return { body, mount };
  }

  let theirs;
  try { theirs = decode(token); } catch (err) {
    return html`<div class="empty"><h2>That link did not open</h2><p class="prose">${err.message}</p>
      <p><a class="btn" href="#/compare/${id}">Make your own link instead</a></p></div>`;
  }
  if (theirs.instrumentId !== id) {
    return html`<div class="empty"><h2>Wrong test</h2>
      <p class="prose">That link is a ${ctx.registry.get(theirs.instrumentId)?.title ?? theirs.instrumentId} result, not ${spec.title}.</p>
      <p><a class="btn" href="#/compare/${theirs.instrumentId}?with=${token}">Compare that one instead</a></p></div>`;
  }

  const nameA = profile.displayName || "You";
  const nameB = theirs.name || "Them";
  const theirResult = spec.score(theirs.answers);

  return html`<article class="compare">
    <header class="page-head"><h2>${nameA} &amp; ${nameB}</h2>
      <p class="prose">${spec.title}. Their answers were re-scored here against the current version — nothing was stored.</p></header>
    <section class="plate">${spec.compare(mine.result, theirResult, { nameA, nameB })}</section>
    <section class="plate">
      <div class="plate-head"><h2>Their instructions</h2><span class="rule"></span><span class="label">from this test only</span></div>
      <div class="cards">
        ${join(spec.instructions(theirResult).map((c) => html`<div class="card pad instruction-card">
          <h4>${c.title}</h4><p class="prose">${c.body}</p></div>`))}
      </div>
    </section>
    <p class="source-note prose">${spec.sourceNote}</p>
  </article>`;
}

export { comparePage };
