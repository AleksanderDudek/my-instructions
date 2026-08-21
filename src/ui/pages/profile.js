import { html, join } from "../../core/html.js";
import { VISIBILITY } from "../../core/store.js";
import { LOCALES } from "../../core/locales.js";
import { stateOf } from "./catalog.js";

/**
 * The user panel.
 *
 * Today this is an account with no server behind it, which is the honest state
 * of the thing and is said plainly on the page. The parts that will survive
 * the arrival of a backend — a display name, per-result visibility, export and
 * import — are built now; the parts that cannot exist yet are absent rather
 * than faked.
 */
async function profilePage(ctx) {
  const { store, registry, t, locale } = ctx;
  const profile = await store.profile();
  const runs = await store.runs();

  const body = html`<article class="profile" id="profile">
    <header class="page-head"><h2>${t("profile.heading")}</h2>
      <p class="prose">${t("profile.lead")}</p>
    </header>

    <section class="plate">
      <div class="plate-head"><h2>${t("profile.languageSection")}</h2><span class="rule"></span><span class="label">${t("profile.languageNote")}</span></div>
      <div class="card pad">
        <div class="vis-row" id="lang" role="group" aria-label="${t("app.language")}">
          ${join(LOCALES.map((l) => html`<button type="button" class="vis-btn${l.tag === locale ? " on" : ""}" data-locale="${l.tag}" lang="${l.tag}">${l.endonym}</button>`))}
        </div>
      </div>
    </section>

    <section class="plate">
      <div class="plate-head"><h2>${t("profile.headingSection")}</h2><span class="rule"></span><span class="label">${t("profile.headingNote")}</span></div>
      <form class="card pad fields" id="profile-form">
        <div class="field"><label class="label" for="p-name">${t("profile.displayName")}</label>
          <input id="p-name" name="displayName" type="text" value="${profile.displayName}" placeholder="${t("profile.displayNamePlaceholder")}" autocomplete="off"></div>
        <div class="field"><label class="label" for="p-pron">${t("profile.pronouns")}</label>
          <input id="p-pron" name="pronouns" type="text" value="${profile.pronouns}" placeholder="${t("profile.pronounsPlaceholder")}" autocomplete="off"></div>
        <div class="field wide"><label class="label" for="p-note">${t("profile.opening")}</label>
          <textarea id="p-note" name="note" rows="3" placeholder="${t("profile.openingPlaceholder")}">${profile.note}</textarea></div>
        <div class="field wide"><button type="button" class="btn primary" id="save-profile">${t("profile.save")}</button>
          <span class="warn" id="profile-msg" role="status"></span></div>
      </form>
    </section>

    <section class="plate">
      <div class="plate-head"><h2>${t("profile.resultsSection")}</h2><span class="rule"></span><span class="label">${t("profile.resultsCount", { count: runs.length })}</span></div>
      ${runs.length ? html`<div class="run-table">
        ${join(runs.map((r) => {
          const spec = registry.get(r.instrumentId);
          if (!spec) return html`<div class="run-row orphan"><span>${r.instrumentId}</span><span class="label">${t("profile.orphan")}</span></div>`;
          const it = ctx.instrument(spec).t;
          const state = stateOf(r, spec, locale);
          return html`<div class="run-row" data-id="${spec.id}">
            <a class="run-name" href="#/test/${spec.id}/result"><span class="test-glyph">${spec.glyph}</span>${it("title")}</a>
            <span class="label ${state.key}">${t(state.messageKey, state.vars)}</span>
            <span class="vis-row small" role="group" aria-label="${t("profile.visFor", { test: it("title") })}">
              ${join(VISIBILITY.map((v) => html`<button type="button" class="vis-btn${r.visibility === v ? " on" : ""}" data-vis="${v}" data-id="${spec.id}">${t(`vis.${v}`)}</button>`))}
            </span>
          </div>`;
        }))}
      </div>` : html`<p class="prose muted">${t("profile.noResults")} <a href="#/tests">${t("profile.noResultsAction")}</a></p>`}
    </section>

    <section class="plate">
      <div class="plate-head"><h2>${t("profile.dataSection")}</h2><span class="rule"></span></div>
      <div class="card pad">
        <p class="prose">${store.durable ? t("profile.storageOk") : t("profile.storageBad")}</p>
        <div class="share-row">
          <button type="button" class="btn" id="export">${t("profile.export")}</button>
          <label class="btn" for="import-file">${t("profile.import")}<input type="file" id="import-file" accept="application/json" hidden></label>
          <button type="button" class="btn danger" id="wipe">${t("profile.wipe")}</button>
        </div>
        <p class="warn" id="data-msg" role="status"></p>
      </div>
    </section>
  </article>`;

  function mount(root) {
    // Changing language reloads rather than re-rendering in place. Every page
    // holds strings resolved at render time, and a reload is one honest line
    // against a re-render pass that would have to reach into seven of them.
    root.querySelector("#lang").addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-locale]");
      if (!btn || btn.dataset.locale === locale) return;
      await store.saveSettings({ locale: btn.dataset.locale });
      location.reload();
    });

    root.querySelector("#save-profile").addEventListener("click", async () => {
      const form = root.querySelector("#profile-form");
      await store.saveProfile({
        displayName: form.displayName.value.trim(),
        pronouns: form.pronouns.value.trim(),
        note: form.note.value.trim(),
      });
      root.querySelector("#profile-msg").textContent = t("profile.saved");
    });

    root.querySelector(".run-table")?.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-vis]");
      if (!btn) return;
      await store.setVisibility(btn.dataset.id, btn.dataset.vis);
      btn.parentElement.querySelectorAll(".vis-btn").forEach((b) => b.classList.toggle("on", b === btn));
    });

    root.querySelector("#export").addEventListener("click", async () => {
      const dump = await store.exportAll();
      const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `my-instructions-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    });

    root.querySelector("#import-file").addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      const msg = root.querySelector("#data-msg");
      if (!file) return;
      try {
        await store.importAll(JSON.parse(await file.text()));
        msg.textContent = t("profile.imported");
        ctx.router.go("/profile", { replace: true });
        location.reload();
      } catch (err) {
        msg.textContent = err.message;
      }
    });

    root.querySelector("#wipe").addEventListener("click", async (e) => {
      if (e.target.dataset.armed !== "1") {
        e.target.dataset.armed = "1";
        e.target.textContent = t("profile.wipeConfirm");
        return;
      }
      await store.wipe();
      location.hash = "#/";
      location.reload();
    });
  }

  return { body, mount };
}

export { profilePage };
