import { html, join } from "../../core/html.js";
import { verdictHTML } from "../../ui/components/scorecard.js";
import { INTEREST, AREAS, itemsFor } from "./areas.js";

/**
 * A worksheet that is never written down.
 *
 * This is the one instrument in the app that declares `persistence: "session"`.
 * Its answers live in memory for as long as the tab is open and nowhere else:
 * no draft while answering, nothing in localStorage, nothing in an export,
 * and — enforced by the contract, which refuses a session instrument that
 * permits any wider audience — nothing that can be put in a link.
 *
 * That is not caution for its own sake. A link in this app carries its own
 * data, so a shared one would outlive the thing that was deliberately never
 * saved, which inverts the entire point. The output is text the person copies
 * and puts wherever they choose. The app is not the place it lives.
 *
 * Deliberately absent, each for a stated reason:
 *
 * **No image export.** A rendered PNG is the established sharing format in
 * this tradition and the worst possible artifact for this data: it lands in a
 * camera roll, auto-backs-up to a cloud photo library, is OCR-indexed by
 * on-device search, and survives every deletion control a web page could
 * offer. Text that the person pastes deliberately does none of that.
 *
 * **No counts, no completion meters, no percentages.** A progress bar per area
 * turns a short answer into fourteen near-empty bars, which is the deficiency
 * framing this project already refused when it declined to report "number of
 * conditions" in intimacy-conditions. A page of mostly-noes is a complete
 * answer, and the copy says so rather than implying a target.
 *
 * **No comparison.** Two people cannot compare lists here without something
 * being persisted or transmitted, and both are refused — so rather than a
 * weaker version of the guarantee, there is no compare() at all. The honest
 * substitute is in the copy: each person fills it in alone and brings the
 * text, which also avoids the fact pattern where one partner completes it with
 * the other in the room.
 */

/** Interest states worth surfacing, most enthusiastic first. */
const ORDER = ["favourite", "yes", "depends", "notNow", "limit"];

function score(answers) {
  const areas = {};
  for (const area of AREAS) {
    const interest = INTEREST.includes(answers[`i.${area.id}`]) ? answers[`i.${area.id}`] : null;
    const role = answers[`r.${area.id}`];
    areas[area.id] = { interest, role: role || null, axis: area.axis };
  }
  return { v: 1, areas };
}

/** Areas grouped by what the person said, in a fixed order that is not a ranking. */
const grouped = (result) =>
  ORDER.map((state) => ({
    state,
    areas: AREAS.filter((area) => result.areas[area.id].interest === state).map((area) => area.id),
  })).filter((group) => group.areas.length);

/**
 * The text a person copies out.
 *
 * Composed here rather than in the view so that what is on screen and what
 * lands on the clipboard cannot drift apart — the thing they hand over should
 * be the thing they read.
 */
function asText(result, t) {
  const lines = [t("text.heading"), ""];
  for (const group of grouped(result)) {
    lines.push(`${t(`interest.${group.state}`)}:`);
    for (const id of group.areas) {
      const { role, axis } = result.areas[id];
      const name = t(`area.${id}.label`);
      const roleWord = role && role !== "unsure" && axis ? t(`role.${axis}.${role}`) : null;
      lines.push(roleWord ? `  · ${name} — ${roleWord}` : `  · ${name}`);
    }
    lines.push("");
  }
  lines.push(t("text.footer"));
  return lines.join("\n");
}

function view(result, { t }) {
  const groups = grouped(result);
  const said = groups.some((g) => g.state === "favourite" || g.state === "yes" || g.state === "depends");

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("view.eyebrow"),
      title: t("view.title"),
      body: t(said ? "view.body" : "view.bodyQuiet"),
    })}

    <div class="cards">
      ${join(groups.map((group) => html`<div class="card pad instruction-card">
        <span class="label">${t(`interest.${group.state}`)}</span>
        <p class="prose">${t(`interest.${group.state}.means`)}</p>
        ${join(group.areas.map((id) => {
          const { role, axis } = result.areas[id];
          const roleWord = role && role !== "unsure" && axis ? t(`role.${axis}.${role}`) : null;
          return html`<p class="prose"><strong>${t(`area.${id}.label`)}</strong>${roleWord ? ` — ${roleWord}` : ""}</p>`;
        }))}
      </div>`))}
    </div>

    <section class="sub-plate">
      <h4>${t("view.takeHeading")} <span class="label">${t("view.takeNote")}</span></h4>
      <div class="card pad">
        <div class="share-row"><button type="button" class="btn primary" id="copy-map">${t("view.copy")}</button></div>
        <textarea class="share-fallback" id="map-text" readonly rows="10">${asText(result, t)}</textarea>
        <p class="warn" id="map-msg" role="status"></p>
      </div>
    </section>

    <div class="note warn-note prose"><p>${t("view.goneNote")}</p></div>
    <div class="note prose"><p>${t("view.noCountNote")}</p></div>
    <div class="note prose"><p>${t("view.bothAloneNote")}</p></div>
    <div class="note prose"><p>${t("view.limitsNote")}</p></div>`;
}

/**
 * Mounted behaviour: the copy button, and nothing that writes anything.
 *
 * Attached to the result page through the standard `mount` contract that
 * pages use; instruments do not normally get one, so this is exported on the
 * spec and called by the result page when present.
 */
function mount(root, { t }) {
  root.querySelector("#copy-map")?.addEventListener("click", async () => {
    const box = root.querySelector("#map-text");
    const msg = root.querySelector("#map-msg");
    try {
      await navigator.clipboard.writeText(box.value);
      msg.textContent = t("view.copied");
    } catch {
      box.select();
      msg.textContent = t("view.selectAndCopy");
    }
  });
}

/**
 * One card, and it is a pointer rather than a disclosure.
 *
 * The instruction sheet is a document that gets handed to people, and nothing
 * from this worksheet belongs on it. The card says only that this exists and
 * where the actual content is, which is in the reader's own hands.
 */
function instructions(result, t) {
  return [{
    channel: "affection",
    title: t("instructions.title"),
    body: t("instructions.body"),
  }];
}

export { asText, grouped, ORDER };

export default {
  id: "intimacy-map",
  version: 1,
  family: "questionnaire",
  glyph: "❋",
  minutes: 5,
  channels: ["affection"],

  sensitive: true,
  /** Never written down, and therefore never linkable. The contract enforces both. */
  persistence: "session",
  maxAudience: "private",

  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
    es: () => import("./i18n/es.js"),
    de: () => import("./i18n/de.js"),
  },
  form: (t) => ({
    kind: "items",
    items: itemsFor(t),
    shuffle: false,
    optional: true,
    pageSize: 4,
  }),
  score, view, instructions, mount,
};
