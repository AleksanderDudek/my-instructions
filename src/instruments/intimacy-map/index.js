import { html, join } from "../../core/html.js";
import { verdictHTML } from "../../ui/components/scorecard.js";
import { INTEREST, KEEN, CURIOUS, SECTIONS, ACTS, facing, itemsFor } from "./acts.js";

/**
 * A worksheet that is never written down, answered by two people in one room.
 *
 * This is the one instrument in the app that declares `persistence: "session"`.
 * Its answers live in memory for as long as the tab is open and nowhere else:
 * no draft while answering, nothing in localStorage, nothing in an export,
 * and — enforced by the contract, which refuses a session instrument that
 * permits any wider audience — nothing that can be put in a link.
 *
 * That is not caution for its own sake. A link in this app carries its own
 * data, so a shared one would outlive the thing that was deliberately never
 * saved, which inverts the entire point.
 *
 * The comparison is what the instrument is for, and the slot mechanism is what
 * makes it possible without a server: both people answer on the same device,
 * one after the other, and the two sets meet in memory. That constrains the
 * feature to the situation where it is a good idea anyway — the two of you,
 * together, deciding to do this — and closing the tab ends it. There is
 * nothing to revoke because there is nothing to revoke.
 *
 * Deliberately absent, each for a stated reason:
 *
 * **No image export, and no copy button on the comparison.** A rendered PNG is
 * the established sharing format in this tradition and the worst possible
 * artifact for this data: it lands in a camera roll, auto-backs-up to a cloud
 * photo library, is OCR-indexed by on-device search, and survives every
 * deletion control a web page could offer. The single-person page offers text
 * the reader copies deliberately, because those are their own answers to do as
 * they like with. The comparison offers nothing, because a document of two
 * people's answers is a different and much worse object than either half, and
 * only one of the two would be choosing to create it.
 *
 * **No like-for-like matching.** Every worksheet in this tradition rates
 * "giving" and "receiving" separately and then compares each against its own
 * twin, which answers a question nobody has. Here your giving faces their
 * receiving. See `facing()`.
 */

/** Everything the reader said, as level indices, with unanswered simply absent. */
function picksOf(answers) {
  const picks = {};
  for (const { id } of ACTS) {
    const level = INTEREST.indexOf(answers?.[id]);
    if (level >= 0) picks[id] = level;
  }
  return picks;
}

/**
 * Which half of the facing pairs this person leans toward, 0..100 each side.
 *
 * A single number per side rather than per pair, because the useful finding is
 * the general one: whether somebody mostly wants to be the one doing or the
 * one being done to, and how strongly. `null` when nothing on that side was
 * answered — an absent lean is not a neutral lean, and reporting 50 would be
 * inventing an answer.
 */
function leanOf(picks) {
  const meanOf = (side) => {
    const values = ACTS.filter((a) => a.side === side && picks[a.id] !== undefined).map((a) => picks[a.id]);
    if (!values.length) return null;
    const mean = values.reduce((x, y) => x + y, 0) / values.length;
    return Math.round((mean / (INTEREST.length - 1)) * 100);
  };
  const a = meanOf("a");
  const b = meanOf("b");
  if (a === null || b === null) return { a, b, gap: null, side: "unknown" };
  const gap = a - b;
  // Under a quarter on both sides is a quiet appetite, not a lean, and calling
  // it one would put somebody on a side they did not pick. Fifteen points is
  // the same threshold `dispersion` uses before it will call an ordering real.
  if (a < 25 && b < 25) return { a, b, gap, side: "neither" };
  if (Math.abs(gap) < 15) return { a, b, gap, side: "both" };
  return { a, b, gap, side: gap > 0 ? "a" : "b" };
}

function score(answers) {
  const picks = picksOf(answers);

  const sections = {};
  for (const name of SECTIONS) sections[name] = { total: 0, answered: 0, keen: 0, curious: 0, limits: 0 };
  for (const { id, section } of ACTS) {
    const bucket = sections[section];
    bucket.total++;
    const level = picks[id];
    if (level === undefined) continue;
    bucket.answered++;
    if (level >= KEEN) bucket.keen++;
    else if (level === CURIOUS) bucket.curious++;
    else if (level === 0) bucket.limits++;
  }

  return {
    v: 2,
    picks,
    sections,
    lean: leanOf(picks),
    answered: Object.keys(picks).length,
    total: ACTS.length,
  };
}

/* ══ one person ═══════════════════════════════════════════════════ */

/** Item ids in a section at or above a level, in bank order. */
const at = (result, section, test) =>
  ACTS.filter((a) => a.section === section && result.picks[a.id] !== undefined && test(result.picks[a.id]))
    .map((a) => a.id);

/**
 * The text a person copies out.
 *
 * Composed here rather than in the view so that what is on screen and what
 * lands on the clipboard cannot drift apart — the thing they hand over should
 * be the thing they read.
 */
function asText(result, t) {
  const lines = [t("text.heading"), ""];
  for (const section of SECTIONS) {
    const rows = [
      ["keen", at(result, section, (v) => v >= KEEN)],
      ["curious", at(result, section, (v) => v === CURIOUS)],
      ["limits", at(result, section, (v) => v === 0)],
    ].filter(([, ids]) => ids.length);
    if (!rows.length) continue;
    lines.push(`${t(`section.${section}`)}:`);
    for (const [kind, ids] of rows) {
      lines.push(`  ${t(`band.${kind}`)}: ${ids.map((id) => t(`act.${id}`)).join(", ")}`);
    }
    lines.push("");
  }
  lines.push(t("text.footer"));
  return lines.join("\n");
}

function sectionCard(result, t, section) {
  const rows = [
    ["keen", at(result, section, (v) => v >= KEEN)],
    ["curious", at(result, section, (v) => v === CURIOUS)],
    ["limits", at(result, section, (v) => v === 0)],
  ].filter(([, ids]) => ids.length);
  if (!rows.length) return "";
  return html`<div class="card pad instruction-card">
    <span class="label">${t(`section.${section}`)}</span>
    ${join(rows.map(([kind, ids]) => html`<p class="prose">
      <strong>${t(`band.${kind}`)}</strong> — ${ids.map((id) => t(`act.${id}`)).join(", ")}
    </p>`))}
  </div>`;
}

function view(result, { t }) {
  const { lean } = result;
  const said = result.answered > 0;

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("view.eyebrow"),
      title: t(said ? `lean.${lean.side}.title` : "lean.none.title"),
      body: t(said ? `lean.${lean.side}.body` : "lean.none.body"),
    })}

    ${said && lean.side !== "unknown" ? html`<div class="card pad">
      <p class="prose">${t("view.leanNumbers", { a: lean.a, b: lean.b })}</p>
      <p class="prose muted">${t("view.leanNote")}</p>
    </div>` : ""}

    <div class="cards">${join(SECTIONS.map((s) => sectionCard(result, t, s)))}</div>

    <section class="sub-plate">
      <h4>${t("view.takeHeading")} <span class="label">${t("view.takeNote")}</span></h4>
      <div class="card pad">
        <div class="share-row"><button type="button" class="btn primary" id="copy-map">${t("view.copy")}</button></div>
        <textarea class="share-fallback" id="map-text" readonly rows="10">${asText(result, t)}</textarea>
        <p class="warn" id="map-msg" role="status"></p>
      </div>
    </section>

    <div class="note warn-note prose"><p>${t("view.goneNote")}</p></div>
    <div class="note prose"><p>${t("view.limitsNote")}</p></div>`;
}

/* ══ two people ═══════════════════════════════════════════════════ */

/**
 * Five ways two answers can meet, and the middle one is the point.
 *
 * `shared` is what you already agree on and `closed` is settled; neither
 * changes what anybody does next. `spark` — one of you keen, the other
 * curious — is the only category that does, and it is the category a yes/no
 * list cannot produce at all. It is deliberately named for what it is rather
 * than as "negotiable", because nothing here is owed to anyone.
 */
function pairScore(mine, theirs) {
  const out = { shared: [], spark: [], bothCurious: [], oneWay: [], closed: [] };

  for (const { id } of ACTS) {
    const m = mine?.picks?.[id];
    const o = theirs?.picks?.[facing(id)];
    if (m === undefined || o === undefined) continue;

    const mineKeen = m >= KEEN;
    const theirsKeen = o >= KEEN;
    if (mineKeen && theirsKeen) { out.shared.push({ id, keen: "both" }); continue; }
    if (m === CURIOUS && o === CURIOUS) { out.bothCurious.push({ id, keen: "both" }); continue; }
    if (!mineKeen && !theirsKeen) continue;

    // Name the act as the keen person's own, so "they are keen on being tied"
    // does not print under the item that describes tying somebody else.
    const keen = mineKeen ? "mine" : "theirs";
    const other = mineKeen ? o : m;
    const entry = { id: keen === "mine" ? id : facing(id), keen };
    if (other === CURIOUS) out.spark.push(entry);
    else if (other === 1) out.oneWay.push(entry);
    else if (other === 0) out.closed.push(entry);
  }

  return { v: 2, ...out, roles: roleFit(mine?.lean, theirs?.lean), overlap: out.shared.length + out.spark.length };
}

function roleFit(mine, theirs) {
  const a = mine?.side;
  const b = theirs?.side;
  if (!a || !b || a === "unknown" || b === "unknown") return "unknown";
  if (a === "neither" || b === "neither") return "quiet";
  if (a === "both" && b === "both") return "flexible";
  if (a === "both" || b === "both") return "oneFlexible";
  // Both leaning the same half of the facing pairs is a real finding: you both
  // want to be the one doing, or you both want to be the one done to.
  return a === b ? "sameSide" : "complement";
}

const BUCKETS = ["shared", "spark", "bothCurious", "oneWay", "closed"];

function bucketCard(cmp, t, name) {
  const rows = cmp[name];
  if (!rows.length) return "";
  return html`<div class="card pad instruction-card">
    <span class="label">${t(`pair.${name}`)}</span>
    <p class="prose muted">${t(`pair.${name}.means`)}</p>
    ${join(rows.map(({ id, keen }) => html`<p class="prose">
      <strong>${t(`act.${id}`)}</strong>${keen === "both" ? "" : ` — ${t(`pair.keen.${keen}`)}`}
    </p>`))}
  </div>`;
}

/**
 * The comparison, rendered from the perspective of whoever's page this is.
 *
 * The result page always passes the page owner first, so "you" and "they"
 * stay correct on both people's screens without either set of answers being
 * labelled with a name.
 */
function pairView(cmp, { t }) {
  return html`
    ${verdictHTML({
      t,
      eyebrow: t("pair.eyebrow"),
      title: t(`roles.${cmp.roles}.title`),
      body: t(`roles.${cmp.roles}.body`),
    })}
    ${cmp.spark.length ? html`<div class="note prose"><p>${t("pair.sparkLead", { count: cmp.spark.length })}</p></div>` : ""}
    <div class="cards">${join(BUCKETS.map((b) => bucketCard(cmp, t, b)))}</div>
    ${cmp.overlap === 0 ? html`<div class="note prose"><p>${t("pair.noOverlap")}</p></div>` : ""}
    <div class="note warn-note prose"><p>${t("pair.goneNote")}</p></div>
    <div class="note prose"><p>${t("pair.limitsNote")}</p></div>`;
}

/**
 * Mounted behaviour: the copy button, and nothing that writes anything.
 *
 * There is deliberately no equivalent on the comparison — see the module note.
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
  return [{ channel: "affection", title: t("instructions.title"), body: t("instructions.body") }];
}

export { asText, leanOf, pairScore, roleFit, at, BUCKETS };

export default {
  id: "intimacy-map",
  version: 2,
  family: "questionnaire",
  glyph: "❋",
  minutes: 8,
  channels: ["affection"],

  adult: true,
  sensitive: true,
  /** Never written down, and therefore never linkable. The contract enforces both. */
  persistence: "session",
  maxAudience: "private",
  /** Answered twice in one tab; the two sets meet in memory and nowhere else. */
  pairwise: true,

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
    pageSize: 6,
  }),
  score, view, instructions, mount, pairScore, pairView,
};
