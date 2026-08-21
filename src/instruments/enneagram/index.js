import { html } from "../../core/html.js";
import { SCALES, scoreLikert, rank } from "../../core/scoring.js";
import { barsHTML, verdictHTML, factsHTML } from "../../ui/components/scorecard.js";
import { TYPES, CENTRES, LINES, wingsOf, ITEMS } from "./items.js";

/**
 * Typing, honestly.
 *
 * The single most common lie an Enneagram test tells is "you are a 4" when the
 * top two scores are one point apart. So the result reports a *margin*: when
 * the leader is within six points of the runner-up the reading is presented as
 * a shortlist, not a verdict, with the discriminating question that actually
 * separates the pair. Confidence is part of the answer.
 */

const scale = SCALES.true5;
const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function score(answers) {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const ranked = rank(scores).map((r) => ({ ...r, type: Number(r.key) }));
  const lead = ranked[0], second = ranked[1];
  const margin = lead.score - second.score;
  const confident = margin >= 6;

  const [wl, wr] = wingsOf(lead.type);
  const wing = scores[String(wl)] >= scores[String(wr)] ? wl : wr;
  const wingMargin = Math.abs(scores[String(wl)] - scores[String(wr)]);

  const centres = Object.entries(CENTRES).map(([key, c]) => ({
    key, ...c,
    score: Math.round(c.types.reduce((a, t) => a + scores[String(t)], 0) / c.types.length),
  })).sort((a, b) => b.score - a.score);

  return {
    scores, ranked, type: lead.type, second: second.type, margin, confident,
    wing, wingMargin, wingClose: wingMargin < 5,
    lines: LINES[lead.type], centres, dominantCentre: centres[0].key,
    answered, total,
  };
}

const rows = (r) => r.ranked.map((x) => ({ key: x.key, label: `${x.type} · ${TYPES[x.type].name}`, score: x.score, blurb: TYPES[x.type].core }));

function view(result) {
  const t = TYPES[result.type];
  const s = TYPES[result.second];
  const c = CENTRES[result.dominantCentre];
  return html`
    ${verdictHTML({
      eyebrow: result.confident ? "Most likely type" : "Shortlist — two types are close",
      title: result.confident ? `${result.type}w${result.wing} · ${t.name}` : `${result.type} or ${result.second}`,
      score: result.ranked[0].score,
      body: result.confident
        ? `${t.blurb} Core motive: ${t.core.toLowerCase()}.`
        : `Type ${result.type} (${t.name}) and type ${result.second} (${s.name}) are within ${result.margin} points. Both fit the behaviour; the motive decides it. Ask yourself which fear is the older one — "${t.fear}" or "${s.fear}"`,
    })}
    ${barsHTML(rows(result))}
    ${factsHTML([
      ["Core fear", t.fear],
      ["Core desire", t.want],
      ["Wing", result.wingClose
        ? `${result.type}w${wingsOf(result.type)[0]} and ${result.type}w${wingsOf(result.type)[1]} score within ${result.wingMargin} — the wing is not settled.`
        : `${result.type}w${result.wing} — ${TYPES[result.wing].core.toLowerCase()} colours the main type.`],
      ["Centre", `${c.label} — ${c.blurb}`],
      ["Under stress", `Moves toward ${result.lines.stress}: ${t.stress}`],
      ["In growth", `Moves toward ${result.lines.ease}: ${t.ease}`],
    ])}
    <div class="note prose">
      <p>Type is a claim about <em>motive</em>, not behaviour. Two people tidy the same kitchen for opposite reasons, and only the reason is diagnostic — which is why a questionnaire can narrow the field but cannot close it. Read the top two descriptions and pick the one that describes something you would rather not admit.</p>
    </div>`;
}

function instructions(result) {
  const t = TYPES[result.type];
  const out = [
    { channel: "communication", title: `Type ${result.type} — ${t.name}`, body: t.ask },
    { channel: "conflict", title: "What I do when it goes wrong", body: t.conflict },
    { channel: "energy", title: "When I am stretched thin", body: `${t.stress} If you see that, the fix is not pressure — it is ${t.ease.toLowerCase()}` },
  ];
  if (!result.confident) {
    out.push({
      channel: "communication",
      title: "Provisional",
      body: `My top two types (${result.type} and ${result.second}) are ${result.margin} points apart. Treat this as a lead, not a label.`,
    });
  }
  return out;
}

function compare(a, b, { nameA = "A", nameB = "B" } = {}) {
  const ta = TYPES[a.type], tb = TYPES[b.type];
  const sameCentre = a.dominantCentre === b.dominantCentre;
  const adjacent = wingsOf(a.type).includes(b.type);
  const lineLinked = a.lines.stress === b.type || a.lines.ease === b.type || b.lines.stress === a.type || b.lines.ease === a.type;
  return html`
    ${verdictHTML({
      eyebrow: "Type pairing",
      title: `${a.type} · ${ta.name} and ${b.type} · ${tb.name}`,
      body: adjacent
        ? "Neighbours on the circle. You share a border, which means you share a language and misread each other's version of the same instinct."
        : lineLinked
        ? "You sit on each other's stress or growth line. Each of you has already lived the other's worst week, which is either enormous empathy or enormous impatience."
        : sameCentre
        ? `Both of you lead from the ${CENTRES[a.dominantCentre].label.toLowerCase()} centre — the same underlying charge, ${CENTRES[a.dominantCentre].emotion}, handled two different ways.`
        : "Different centres, different first move. One of you feels it, one of you thinks it, and the gap between those two is where the arguments start.",
    })}
    <div class="exchange">
      <div><span class="label">${nameA} needs from ${nameB}</span><p class="prose">${ta.ask}</p><p class="prose">${ta.conflict}</p></div>
      <div><span class="label">${nameB} needs from ${nameA}</span><p class="prose">${tb.ask}</p><p class="prose">${tb.conflict}</p></div>
    </div>`;
}

export default {
  id: "enneagram",
  version: 1,
  family: "questionnaire",
  title: "Enneagram",
  tagline: "Nine motives. Which fear organises everything you do.",
  glyph: "◉",
  minutes: 7,
  framework: "Nine-type Enneagram",
  sourceNote:
    "The nine-type model is public. The RHETI's forced-choice items are copyrighted and are not used here — these are original Likert items, so the nine scores are independent and the result reports how close the top two are.",
  channels: ["communication", "conflict", "energy"],
  form: () => ({ kind: "items", items: ITEMS, scale, shuffle: true, pageSize: 5 }),
  score, view, instructions, compare,
};
