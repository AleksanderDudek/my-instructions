import { html, join } from "../../core/html.js";
import { scaleFor, scoreLikert, shares, rank, dispersion } from "../../core/scoring.js";
import { barsHTML, verdictHTML, factsHTML } from "../../ui/components/scorecard.js";
import { GLYPHS, ORDER, ITEMS } from "./items.js";

/**
 * Two numbers are reported for every language and they answer different
 * questions. The **score** (1–100) is how much that language matters to you in
 * absolute terms — comparable to anyone else's. The **share** is how much of
 * your own attention it takes relative to your other four — which is what a
 * partner actually has to budget for. A person can be 90/90/90/90/90: five
 * strong needs, evenly split. The share tells them where to start; the score
 * tells them how much is at stake.
 */

const scale = scaleFor("true5", (key) => key);

function score(answers) {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const pct = shares(scores);
  const ranked = rank(scores).map((r) => ({ ...r, share: pct[r.key] }));
  const primary = ranked[0];
  const secondary = ranked[1];
  // A language is "quiet" when it is both low in itself and small in the mix —
  // the pair of tests stops us calling a 70 a weakness just because the rest are 80s.
  const quiet = ranked.filter((r) => r.score < 40 && r.share < 18).map((r) => r.key);
  // The app's shared answer to "is this profile flat?", rather than this
  // folder's own twelve-point rule. Evenness rides along because "how many
  // channels reach you" is a genuinely different reading from "which one".
  const { concentrated, evenness } = dispersion(scores);
  return { scores, shares: pct, ranked, primary, secondary, quiet, flat: !concentrated, evenness, answered, total };
}

const rows = (result, t) =>
  result.ranked.map((x) => ({ key: x.key, label: t(`lang.${x.key}.label`), score: x.score, share: x.share, blurb: t(`lang.${x.key}.blurb`) }));

function view(result, { t }) {
  const p = result.primary.key;
  const s = result.secondary.key;
  return html`
    ${verdictHTML({
      t,
      eyebrow: t("view.eyebrow"),
      title: `${GLYPHS[p]} ${t(`lang.${p}.label`)}`,
      score: result.primary.score,
      body: `${t(`lang.${p}.fed`)} ${t(`lang.${p}.starved`)}`,
    })}
    ${barsHTML(rows(result, t), { showShare: true })}
    ${factsHTML([
      [t("view.fact.primary"), t("view.fact.primaryValue", { label: t(`lang.${p}.label`), share: result.primary.share })],
      [t("view.fact.secondary"), t("view.fact.secondaryValue", { label: t(`lang.${s}.label`), share: result.secondary.share })],
      [t("view.fact.quiet"), result.quiet.length ? result.quiet.map((k) => t(`lang.${k}.label`)).join(", ") : t("view.fact.quietNone")],
      [t("view.fact.profile"), result.flat ? t("view.fact.profileEven") : t("view.fact.profilePeaked")],
    ])}
    <div class="note prose">
      <p>${result.flat ? t("view.noteEven") : t("view.notePeaked", { language: t(`lang.${p}.inline`) })}</p>
    </div>`;
}

function instructions(result, t) {
  const p = result.primary.key;
  const s = result.secondary.key;
  const out = [
    { channel: "affection", title: t("instructions.leadWith", { language: t(`lang.${p}.inline`) }), body: t(`lang.${p}.ask`) },
    { channel: "affection", title: t("instructions.then", { language: t(`lang.${s}.inline`) }), body: t(`lang.${s}.ask`) },
    { channel: "conflict", title: t("instructions.distance"), body: t(`lang.${p}.starved`) },
  ];
  for (const key of result.quiet) {
    out.push({
      channel: "affection",
      title: t("instructions.quietTitle", { language: t(`lang.${key}.label`) }),
      body: t("instructions.quietBody"),
    });
  }
  if (result.flat) out.push({ channel: "affection", title: t("instructions.flatTitle"), body: t("instructions.flatBody") });
  return out;
}

/**
 * Two people, one reading. Mismatch is not measured as distance between
 * scores — it is measured as *what each person needs that the other does not
 * naturally give*, which is asymmetric and therefore reported twice.
 */
function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const gap = (mine, theirs) =>
    ORDER.map((k) => ({ key: k, need: mine.scores[k], theirShare: theirs.shares[k], deficit: mine.shares[k] - theirs.shares[k] }))
      .sort((x, y) => y.deficit - x.deficit);

  const aNeeds = gap(a, b), bNeeds = gap(b, a);
  const overlap = a.primary.key === b.primary.key;
  const fit = Math.round(100 - ORDER.reduce((acc, k) => acc + Math.abs(a.shares[k] - b.shares[k]), 0) / 2);

  const needsHTML = (needs) =>
    join(needs.slice(0, 2).map((g) => html`<p class="prose">${t(`lang.${g.key}.label`)} — ${t(`lang.${g.key}.ask`)}</p>`));

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: overlap
        ? t("compare.sameTitle")
        : t("compare.mixedTitle", { a: t(`lang.${a.primary.key}.label`), b: t(`lang.${b.primary.key}.label`) }),
      score: fit,
      body: overlap ? t("compare.sameBody") : t("compare.mixedBody"),
    })}
    <div class="exchange">
      <div><span class="label">${t("compare.aNeeds", { a: nameA, b: nameB })}</span>${needsHTML(aNeeds)}</div>
      <div><span class="label">${t("compare.aNeeds", { a: nameB, b: nameA })}</span>${needsHTML(bNeeds)}</div>
    </div>`;
}

export default {
  id: "love-languages",
  version: 1,
  family: "questionnaire",
  glyph: "♡",
  minutes: 6,
  channels: ["affection", "conflict"],
  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
    es: () => import("./i18n/es.js"),
    de: () => import("./i18n/de.js"),
  },
  form: (t) => ({
    kind: "items",
    items: ITEMS.map((item) => ({ ...item, prompt: t(`item.${item.id}`) })),
    scale: scaleFor("true5", t),
    shuffle: true,
    pageSize: 5,
  }),
  score,
  view,
  instructions,
  compare,
};
