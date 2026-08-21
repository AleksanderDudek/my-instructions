import { html, join } from "../../core/html.js";
import { VISIBILITY } from "../../core/store.js";
import { CHANNEL_LABEL } from "../../core/registry.js";
import { link } from "../../core/share.js";

/**
 * A result page is the instrument's own view wrapped in the three things every
 * result needs and no instrument should have to implement: who may see it, how
 * to hand it to someone, and what it contributed to the instruction sheet.
 */

const VIS_NOTE = {
  private: "Only you. Share links still work — sharing is an explicit act, not a setting.",
  friends: "Visible to people you have connected with, once the network exists.",
  public: "Visible on your public page, once the network exists.",
};

async function resultPage(ctx, { id }) {
  const spec = ctx.registry.get(id);
  const run = spec ? await ctx.store.run(id) : null;
  if (!spec || !run) {
    return { body: html`<div class="empty"><h2>Nothing recorded yet</h2>
      <p class="prose">You have not taken this one.</p>
      <p><a class="btn primary" href="#/test/${id}">Take it</a></p></div>` };
  }

  const stale = run.instrumentVersion !== spec.version;
  const cards = spec.instructions(run.result);
  const profile = await ctx.store.profile();

  const body = html`<article class="result" id="result">
    <header class="runner-head">
      <a class="back" href="#/tests">← All tests</a>
      <h2>${spec.title}</h2>
      <p class="prose">Taken ${new Date(run.completedAt).toLocaleString()}${run.firstCompletedAt !== run.completedAt ? " · retaken" : ""}.</p>
    </header>

    ${stale ? html`<div class="note warn-note prose"><p>This instrument has been revised since you took it (you have version ${run.instrumentVersion}, current is ${spec.version}). The scores below are the ones you got; retake to score against the current items.</p></div>` : ""}

    <section class="plate">${spec.view(run.result, ctx)}</section>

    <section class="plate">
      <div class="plate-head"><h2>What this added</h2><span class="rule"></span><span class="label">to your instructions</span></div>
      <div class="cards">
        ${join(cards.map((c) => html`<div class="card pad instruction-card">
          <span class="label">${CHANNEL_LABEL[c.channel] ?? c.channel}</span>
          <h4>${c.title}</h4><p class="prose">${c.body}</p></div>`))}
      </div>
    </section>

    <section class="plate">
      <div class="plate-head"><h2>Visibility &amp; sharing</h2><span class="rule"></span></div>
      <div class="card pad">
        <div class="vis-row" id="vis" role="group" aria-label="Who can see this result">
          ${join(VISIBILITY.map((v) => html`<button type="button" class="vis-btn${run.visibility === v ? " on" : ""}" data-vis="${v}">${v}</button>`))}
        </div>
        <p class="prose muted" id="vis-note">${VIS_NOTE[run.visibility]}</p>
        <div class="share-row">
          <button type="button" class="btn" id="copy-link">Copy a compare link</button>
          <button type="button" class="btn" id="retake">Retake</button>
          <button type="button" class="btn danger" id="clear">Delete this result</button>
        </div>
        <p class="prose muted">A compare link carries your answers, not your name unless you have set one. Whoever opens it sees the two readings side by side; nothing is uploaded.</p>
        <p class="warn" id="share-msg" role="status"></p>
      </div>
    </section>

    <p class="source-note prose">${spec.sourceNote}</p>
  </article>`;

  function mount(root) {
    root.querySelector("#vis").addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-vis]");
      if (!btn) return;
      await ctx.store.setVisibility(id, btn.dataset.vis);
      root.querySelectorAll(".vis-btn").forEach((b) => b.classList.toggle("on", b === btn));
      root.querySelector("#vis-note").textContent = VIS_NOTE[btn.dataset.vis];
    });

    root.querySelector("#copy-link").addEventListener("click", async (e) => {
      const msg = root.querySelector("#share-msg");
      const url = link(run, profile.displayName);
      try {
        await navigator.clipboard.writeText(url);
        msg.textContent = "Link copied.";
      } catch {
        // Clipboard access is denied in sandboxed frames; show the link instead
        // of failing silently, so the feature degrades to select-and-copy.
        msg.innerHTML = "";
        const input = document.createElement("input");
        input.className = "share-fallback"; input.value = url; input.readOnly = true;
        msg.append(input); input.select();
      }
    });

    root.querySelector("#retake").addEventListener("click", () => ctx.router.go(`/test/${id}`));
    root.querySelector("#clear").addEventListener("click", async (e) => {
      if (e.target.dataset.armed !== "1") {
        e.target.dataset.armed = "1";
        e.target.textContent = "Delete — click again to confirm";
        return;
      }
      await ctx.store.clearRun(id);
      ctx.router.go("/tests");
    });
  }

  return { body, mount };
}

export { resultPage };
