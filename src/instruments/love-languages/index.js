import { html, join } from "../../core/html.js";
import { SCALES, scoreLikert, shares, rank } from "../../core/scoring.js";
import { barsHTML, verdictHTML, factsHTML } from "../../ui/components/scorecard.js";
import { LANGUAGES, ORDER, ITEMS } from "./items.js";

/**
 * Two numbers are reported for every language and they answer different
 * questions. The **score** (1–100) is how much that language matters to you in
 * absolute terms — comparable to anyone else's. The **share** is how much of
 * your own attention it takes relative to your other four — which is what a
 * partner actually has to budget for. A person can be 90/90/90/90/90: five
 * strong needs, evenly split. The share tells them where to start; the score
 * tells them how much is at stake.
 */

const scale = SCALES.true5;

function score(answers) {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const pct = shares(scores);
  const ranked = rank(scores).map((r) => ({ ...r, share: pct[r.key] }));
  const primary = ranked[0];
  const secondary = ranked[1];
  // A language is "quiet" when it is both low in itself and small in the mix —
  // the pair of tests stops us calling a 70 a weakness just because the rest are 80s.
  const quiet = ranked.filter((r) => r.score < 40 && r.share < 18).map((r) => r.key);
  const flat = ranked[0].score - ranked[ranked.length - 1].score < 12;
  return { scores, shares: pct, ranked, primary, secondary, quiet, flat, answered, total };
}

const rows = (r) =>
  r.ranked.map((x) => ({ key: x.key, label: LANGUAGES[x.key].label, score: x.score, share: x.share, blurb: LANGUAGES[x.key].blurb }));

function view(result) {
  const p = LANGUAGES[result.primary.key];
  const s = LANGUAGES[result.secondary.key];
  return html`
    ${verdictHTML({
      eyebrow: "Primary language",
      title: `${p.glyph} ${p.label}`,
      score: result.primary.score,
      body: `${p.fed} ${p.starved}`,
    })}
    ${barsHTML(rows(result), { showShare: true })}
    ${factsHTML([
      ["Primary", `${p.label} — ${result.primary.share}% of the mix`],
      ["Secondary", `${s.label} — ${result.secondary.share}%`],
      ["Quiet", result.quiet.length ? result.quiet.map((k) => LANGUAGES[k].label).join(", ") : "none — every language registers"],
      ["Profile", result.flat ? "Even. No single channel dominates; consistency matters more than choosing right." : "Peaked. One channel carries most of the weight."],
    ])}
    <div class="note prose">
      <p>${result.flat
        ? "Your five scores sit close together. That is not indecision — it means you read affection through several channels at once, and a partner who only ever uses one of them will feel like they are trying, and you will feel unmet. Both of you will be right."
        : `Most of what reaches you comes through ${p.label.toLowerCase()}. Effort spent in the other four is not wasted, but it does not substitute.`}</p>
    </div>`;
}

function instructions(result) {
  const p = LANGUAGES[result.primary.key];
  const s = LANGUAGES[result.secondary.key];
  const out = [
    { channel: "affection", title: `Lead with ${p.label.toLowerCase()}`, body: p.ask },
    { channel: "affection", title: `Then ${s.label.toLowerCase()}`, body: s.ask },
    { channel: "conflict", title: "How I read distance", body: p.starved },
  ];
  for (const key of result.quiet) {
    out.push({
      channel: "affection",
      title: `${LANGUAGES[key].label} lands lightly`,
      body: `Not an insult — just a channel I barely receive on. Effort here reads as effort, not as love. Spend it elsewhere.`,
    });
  }
  if (result.flat) {
    out.push({ channel: "affection", title: "No shortcuts", body: "My channels are evenly weighted. Consistency across all five beats intensity in one." });
  }
  return out;
}

/**
 * Two people, one reading. Mismatch is not measured as distance between
 * scores — it is measured as *what each person needs that the other does not
 * naturally give*, which is asymmetric and therefore reported twice.
 */
function compare(a, b, { nameA = "A", nameB = "B" } = {}) {
  const gap = (mine, theirs) =>
    ORDER.map((k) => ({ key: k, need: mine.scores[k], theirShare: theirs.shares[k], deficit: mine.shares[k] - theirs.shares[k] }))
      .sort((x, y) => y.deficit - x.deficit);

  const aNeeds = gap(a, b), bNeeds = gap(b, a);
  const overlap = a.primary.key === b.primary.key;
  const fit = Math.round(100 - ORDER.reduce((acc, k) => acc + Math.abs(a.shares[k] - b.shares[k]), 0) / 2);

  return html`
    ${verdictHTML({
      eyebrow: "Language fit",
      title: overlap ? "Same primary language" : `${LANGUAGES[a.primary.key].label} meets ${LANGUAGES[b.primary.key].label}`,
      score: fit,
      body: overlap
        ? "You want the same currency. That makes fluency easy and blind spots identical — whatever you both under-use will simply never happen."
        : "You do not natively speak each other's first language. This is the ordinary case and it is learnable; what it is not is automatic.",
    })}
    <div class="exchange">
      <div><span class="label">${nameA} most needs, and ${nameB} least offers</span>
        ${join(aNeeds.slice(0, 2).map((g) => html`<p class="prose">${LANGUAGES[g.key].label} — ${LANGUAGES[g.key].ask}</p>`))}</div>
      <div><span class="label">${nameB} most needs, and ${nameA} least offers</span>
        ${join(bNeeds.slice(0, 2).map((g) => html`<p class="prose">${LANGUAGES[g.key].label} — ${LANGUAGES[g.key].ask}</p>`))}</div>
    </div>`;
}

export default {
  id: "love-languages",
  version: 1,
  family: "questionnaire",
  title: "Five Languages of Love",
  tagline: "Which channel affection has to arrive on before it registers.",
  glyph: "♡",
  minutes: 6,
  framework: "Chapman's five-category model",
  sourceNote:
    "The five categories are Gary Chapman's. The items are ours and are scored independently on 1–100, not forced against each other — so all five can be high, or none.",
  channels: ["affection", "conflict"],
  form: () => ({ kind: "items", items: ITEMS, scale, shuffle: true, pageSize: 5 }),
  score,
  view,
  instructions,
  compare,
};
