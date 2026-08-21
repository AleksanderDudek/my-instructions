import { html, join } from "../../core/html.js";
import { VISIBILITY } from "../../core/store.js";
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
  const { store, registry } = ctx;
  const profile = await store.profile();
  const runs = await store.runs();

  const body = html`<article class="profile" id="profile">
    <header class="page-head"><h2>Your panel</h2>
      <p class="prose">Everything below lives in this browser. Clearing site data deletes it; there is no copy anywhere else.</p>
    </header>

    <section class="plate">
      <div class="plate-head"><h2>Heading</h2><span class="rule"></span><span class="label">what appears above your instructions</span></div>
      <form class="card pad fields" id="profile-form">
        <div class="field"><label class="label" for="p-name">Display name</label>
          <input id="p-name" name="displayName" type="text" value="${profile.displayName}" placeholder="How you want to be addressed" autocomplete="off"></div>
        <div class="field"><label class="label" for="p-pron">Pronouns</label>
          <input id="p-pron" name="pronouns" type="text" value="${profile.pronouns}" placeholder="Optional" autocomplete="off"></div>
        <div class="field wide"><label class="label" for="p-note">Opening line</label>
          <textarea id="p-note" name="note" rows="3" placeholder="One sentence at the top of your sheet. Optional.">${profile.note}</textarea></div>
        <div class="field wide"><button type="button" class="btn primary" id="save-profile">Save</button>
          <span class="warn" id="profile-msg" role="status"></span></div>
      </form>
    </section>

    <section class="plate">
      <div class="plate-head"><h2>Results</h2><span class="rule"></span><span class="label">${runs.length} recorded</span></div>
      ${runs.length ? html`<div class="run-table">
        ${join(runs.map((r) => {
          const spec = registry.get(r.instrumentId);
          if (!spec) return html`<div class="run-row orphan"><span>${r.instrumentId}</span><span class="label">instrument no longer installed</span></div>`;
          const state = stateOf(r, spec);
          return html`<div class="run-row" data-id="${spec.id}">
            <a class="run-name" href="#/test/${spec.id}/result"><span class="test-glyph">${spec.glyph}</span>${spec.title}</a>
            <span class="label ${state.key}">${state.label}</span>
            <span class="vis-row small" role="group" aria-label="Visibility for ${spec.title}">
              ${join(VISIBILITY.map((v) => html`<button type="button" class="vis-btn${r.visibility === v ? " on" : ""}" data-vis="${v}" data-id="${spec.id}">${v}</button>`))}
            </span>
          </div>`;
        }))}
      </div>` : html`<p class="prose muted">Nothing yet. <a href="#/tests">Take something.</a></p>`}
    </section>

    <section class="plate">
      <div class="plate-head"><h2>Your data</h2><span class="rule"></span></div>
      <div class="card pad">
        <p class="prose">${store.durable
          ? "Storage is working. Answers survive a reload."
          : "This browser is refusing to store data — private mode, or storage disabled. The app still runs, but everything vanishes on reload."}</p>
        <div class="share-row">
          <button type="button" class="btn" id="export">Export everything</button>
          <label class="btn" for="import-file">Import a file<input type="file" id="import-file" accept="application/json" hidden></label>
          <button type="button" class="btn danger" id="wipe">Delete everything</button>
        </div>
        <p class="warn" id="data-msg" role="status"></p>
      </div>
    </section>
  </article>`;

  function mount(root) {
    root.querySelector("#save-profile").addEventListener("click", async () => {
      const form = root.querySelector("#profile-form");
      await store.saveProfile({
        displayName: form.displayName.value.trim(),
        pronouns: form.pronouns.value.trim(),
        note: form.note.value.trim(),
      });
      root.querySelector("#profile-msg").textContent = "Saved.";
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
        msg.textContent = "Imported.";
        ctx.router.go("/profile", { replace: true });
        location.reload();
      } catch (err) {
        msg.textContent = err.message;
      }
    });

    root.querySelector("#wipe").addEventListener("click", async (e) => {
      if (e.target.dataset.armed !== "1") {
        e.target.dataset.armed = "1";
        e.target.textContent = "Delete everything — click again";
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
