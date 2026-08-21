import { html, join } from "../../core/html.js";
import { VISIBILITY } from "../../core/store.js";
import { channelKey } from "../../core/registry.js";
import { link } from "../../core/share.js";

/**
 * A result page is the instrument's own view wrapped in the three things every
 * result needs and no instrument should have to implement: who may see it, how
 * to hand it to someone, and what it contributed to the instruction sheet.
 */

const VIS_NOTE = {
  private: "result.visPrivate",
  friends: "result.visFriends",
  public: "result.visPublic",
};

async function resultPage(ctx, { id }) {
  const { t, locale } = ctx;
  const spec = ctx.registry.get(id);
  const run = spec ? await ctx.store.run(id) : null;
  if (!spec || !run) {
    return { body: html`<div class="empty"><h2>${t("result.emptyTitle")}</h2>
      <p class="prose">${t("result.emptyBody")}</p>
      <p><a class="btn primary" href="#/test/${id}">${t("result.emptyAction")}</a></p></div>` };
  }

  const scoped = ctx.instrument(spec);
  const it = scoped.t;
  const stale = run.instrumentVersion !== spec.version;
  const cards = spec.instructions(run.result, it);
  const profile = await ctx.store.profile();
  // One source of truth for audiences: the sharing map. The run still carries
  // a `visibility` field for older data, and setAudience keeps it in step.
  const audience = (await ctx.store.sharing())[`run.${id}`] ?? "private";
  const retaken = run.firstCompletedAt !== run.completedAt;
  const when = new Date(run.completedAt).toLocaleString(locale);

  const body = html`<article class="result" id="result">
    <header class="runner-head">
      <a class="back" href="#/tests">${t("common.allTests")}</a>
      <h2>${it("title")}</h2>
      <p class="prose">${t(retaken ? "result.takenRetaken" : "result.taken", { when })}</p>
    </header>

    ${stale ? html`<div class="note warn-note prose"><p>${t("result.stale", { had: run.instrumentVersion, now: spec.version })}</p></div>` : ""}

    <section class="plate">${spec.view(run.result, scoped)}</section>

    <section class="plate">
      <div class="plate-head"><h2>${t("result.addedHeading")}</h2><span class="rule"></span><span class="label">${t("result.addedNote")}</span></div>
      <div class="cards">
        ${join(cards.map((c) => html`<div class="card pad instruction-card">
          <span class="label">${t(channelKey(c.channel))}</span>
          <h4>${c.title}</h4><p class="prose">${c.body}</p></div>`))}
      </div>
    </section>

    <section class="plate">
      <div class="plate-head"><h2>${t("result.visHeading")}</h2><span class="rule"></span></div>
      <div class="card pad">
        <div class="vis-row" id="vis" role="group" aria-label="${t("result.visGroupLabel")}">
          ${join(VISIBILITY.map((v) => html`<button type="button" class="vis-btn${audience === v ? " on" : ""}" data-vis="${v}">${t(`vis.${v}`)}</button>`))}
        </div>
        <p class="prose muted" id="vis-note">${t(VIS_NOTE[audience])}</p>
        <p class="prose muted"><a href="#/sharing">${t("result.manageSharing")}</a></p>
        <div class="share-row">
          <button type="button" class="btn" id="copy-link">${t("result.copyLink")}</button>
          <button type="button" class="btn" id="retake">${t("result.retake")}</button>
          <button type="button" class="btn danger" id="clear">${t("result.delete")}</button>
        </div>
        <p class="prose muted">${t("result.shareNote")}</p>
        <p class="warn" id="share-msg" role="status"></p>
      </div>
    </section>

    <p class="source-note prose">${it("sourceNote")}</p>
    ${spec.family === "questionnaire" ? html`<p class="source-note prose">${t("app.noValidation")}</p>` : ""}
  </article>`;

  function mount(root) {
    root.querySelector("#vis").addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-vis]");
      if (!btn) return;
      await ctx.store.setAudience(`run.${id}`, btn.dataset.vis);
      root.querySelectorAll(".vis-btn").forEach((b) => b.classList.toggle("on", b === btn));
      root.querySelector("#vis-note").textContent = t(VIS_NOTE[btn.dataset.vis]);
    });

    root.querySelector("#copy-link").addEventListener("click", async () => {
      const msg = root.querySelector("#share-msg");
      const url = link(run, profile.displayName);
      try {
        await navigator.clipboard.writeText(url);
        msg.textContent = t("result.copied");
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
        e.target.textContent = t("result.deleteConfirm");
        return;
      }
      await ctx.store.clearRun(id);
      ctx.router.go("/tests");
    });
  }

  return { body, mount };
}

export { resultPage };
