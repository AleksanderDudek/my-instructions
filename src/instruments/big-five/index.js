import { html, join } from "../../core/html.js";
import { SCALES, scoreLikert, band, straightlining } from "../../core/scoring.js";
import { barsHTML, verdictHTML, factsHTML } from "../../ui/components/scorecard.js";
import { FACTORS, ORDER, ITEMS } from "./items.js";

/**
 * Unlike the other two questionnaires, nothing here is ranked. The five
 * factors are meant to be independent, so "your highest factor" is a category
 * error — a person is not *mostly* open the way they are mostly a 5. Each
 * factor is reported on its own, and the summary picks out only the ones far
 * enough from the middle to be worth telling someone about.
 */

const scale = SCALES.agree5;
const MARKED = 22; // distance from 50 at which a factor stops being unremarkable

function score(answers) {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const profile = ORDER.map((key) => {
    const s = scores[key];
    const side = s >= 50 ? "high" : "low";
    return { key, score: s, side, band: band(s), marked: Math.abs(s - 50) >= MARKED, ...FACTORS[key] };
  });
  return {
    scores, profile,
    marked: profile.filter((p) => p.marked),
    flat: !profile.some((p) => p.marked),
    suspect: straightlining(ITEMS, answers),
    answered, total,
  };
}

const rows = (r) =>
  r.profile.map((p) => ({ key: p.key, label: `${p.glyph} ${p.label}`, score: p.score, blurb: p.score >= 50 ? p.high : p.low }));

function view(result) {
  const headline = result.marked.length
    ? result.marked.map((p) => `${p.band} ${p.label.toLowerCase()}`).join(", ")
    : "no factor far from the middle";
  return html`
    ${verdictHTML({
      eyebrow: "Five factors",
      title: headline,
      body: result.flat
        ? "Every factor lands near the centre. That is a real result and a common one — it describes someone whose behaviour is set more by situation than by disposition, and it makes you harder to predict from a profile than most people."
        : "These five are designed to be independent, so read each on its own. A high score is not a better score; each end buys something and costs something.",
    })}
    ${barsHTML(rows(result))}
    ${factsHTML(result.profile.map((p) => [p.label, `${p.score} — ${p.band}. ${p.score >= 50 ? p.high : p.low}`]))}
    ${result.suspect ? html`<div class="note warn-note prose"><p>Every item got the same answer. Half of these questions are worded backwards on purpose, so an identical response to all forty produces a profile of five near-identical middling scores regardless of who you are. Worth retaking.</p></div>` : ""}
    <div class="note prose">
      <p>Of everything in this app, this is the part with actual research behind it — the five-factor structure replicates across languages and predicts real outcomes at modest effect sizes. Modest is the operative word. It describes tendencies over years, not what you will do on Thursday.</p>
    </div>`;
}

function instructions(result) {
  const cards = [];
  for (const p of result.marked) {
    cards.push({
      channel: p.key === "extraversion" || p.key === "reactivity" ? "energy" : p.key === "conscientiousness" ? "work" : "communication",
      title: `${p.band === "very high" || p.band === "very low" ? "Strongly " : ""}${p.side} ${p.label.toLowerCase()}`,
      body: p.ask[p.side],
    });
  }
  if (!cards.length) {
    cards.push({ channel: "rhythm", title: "Centre-weighted", body: "No factor of mine sits far from average. Read the situation rather than the profile — context moves me more than disposition does." });
  }
  return cards;
}

function compare(a, b, { nameA = "A", nameB = "B" } = {}) {
  const gaps = ORDER.map((k) => ({ key: k, ...FACTORS[k], a: a.scores[k], b: b.scores[k], gap: Math.abs(a.scores[k] - b.scores[k]) }))
    .sort((x, y) => y.gap - x.gap);
  const widest = gaps[0], closest = gaps[gaps.length - 1];
  const mean = Math.round(gaps.reduce((s, g) => s + g.gap, 0) / gaps.length);
  return html`
    ${verdictHTML({
      eyebrow: "Trait distance",
      title: `${mean} points apart on average`,
      body: `The widest gap is ${widest.label.toLowerCase()} — ${nameA} at ${widest.a}, ${nameB} at ${widest.b}. That is the difference most likely to be experienced as a character flaw rather than a difference. The closest is ${closest.label.toLowerCase()}, where you will barely notice you agree.`,
    })}
    ${factsHTML(gaps.map((g) => [g.label, `${nameA} ${g.a} · ${nameB} ${g.b} — ${g.gap} apart`]))}`;
}

export default {
  id: "big-five",
  version: 1,
  family: "questionnaire",
  title: "Big Five",
  tagline: "The five dimensions that survived a century of factor analysis.",
  glyph: "✦",
  minutes: 6,
  framework: "Five-factor model (OCEAN)",
  sourceNote:
    "Original items on the public five-factor structure, half of them reverse-keyed. The IPIP public-domain markers can be substituted as pure data if you want the validated wording.",
  channels: ["communication", "work", "energy"],
  form: () => ({ kind: "items", items: ITEMS, scale, shuffle: true, pageSize: 5 }),
  score, view, instructions, compare,
};
