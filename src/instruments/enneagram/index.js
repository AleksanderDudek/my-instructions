import { html } from "../../core/html.js";
import { scaleFor, scoreLikert, rank } from "../../core/scoring.js";
import { barsHTML, verdictHTML, factsHTML } from "../../ui/components/scorecard.js";
import { CENTRES, LINES, wingsOf, ITEMS } from "./items.js";

/**
 * Typing, honestly.
 *
 * The single most common lie an Enneagram test tells is "you are a 4" when the
 * top two scores are one point apart. So the result reports a *margin*: when
 * the leader is within six points of the runner-up the reading is presented as
 * a shortlist, not a verdict, with the discriminating question that actually
 * separates the pair. Confidence is part of the answer.
 */

const scale = scaleFor("true5", (key) => key);

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
    key,
    score: Math.round(c.types.reduce((a, t) => a + scores[String(t)], 0) / c.types.length),
  })).sort((a, b) => b.score - a.score);

  return {
    scores, ranked, type: lead.type, second: second.type, margin, confident,
    wing, wingMargin, wingClose: wingMargin < 5,
    lines: LINES[lead.type], centres, dominantCentre: centres[0].key,
    answered, total,
  };
}

const rows = (result, t) =>
  result.ranked.map((x) => ({
    key: x.key,
    label: t("view.typeLabel", { number: x.type, name: t(`type.${x.type}.name`) }),
    score: x.score,
    blurb: t(`type.${x.type}.core`),
  }));

function view(result, { t }) {
  const n = result.type;
  const c = result.dominantCentre;
  return html`
    ${verdictHTML({
      t,
      eyebrow: result.confident ? t("view.eyebrowConfident") : t("view.eyebrowShortlist"),
      title: result.confident
        ? t("view.titleConfident", { number: n, wing: result.wing, name: t(`type.${n}.name`) })
        : t("view.titleShortlist", { a: n, b: result.second }),
      score: result.ranked[0].score,
      body: result.confident
        ? t("view.bodyConfident", { blurb: t(`type.${n}.blurb`), motive: t(`type.${n}.core`) })
        : t("view.bodyShortlist", {
            a: n, b: result.second,
            nameA: t(`type.${n}.name`), nameB: t(`type.${result.second}.name`),
            margin: result.margin,
            fearA: t(`type.${n}.fear`), fearB: t(`type.${result.second}.fear`),
          }),
    })}
    ${barsHTML(rows(result, t))}
    ${factsHTML([
      [t("view.fact.fear"), t(`type.${n}.fear`)],
      [t("view.fact.desire"), t(`type.${n}.want`)],
      [t("view.fact.wing"), result.wingClose
        ? t("view.wingUnsettled", { number: n, a: wingsOf(n)[0], b: wingsOf(n)[1], margin: result.wingMargin })
        : t("view.wingSettled", { number: n, wing: result.wing, motive: t(`type.${result.wing}.core`) })],
      [t("view.fact.centre"), t("view.centreValue", { label: t(`centre.${c}.label`), blurb: t(`centre.${c}.blurb`) })],
      [t("view.fact.stress"), t("view.lineValue", { to: result.lines.stress, body: t(`type.${n}.stress`) })],
      [t("view.fact.growth"), t("view.lineValue", { to: result.lines.ease, body: t(`type.${n}.ease`) })],
    ])}
    <div class="note prose"><p>${t("view.motiveNote")}</p></div>`;
}

function instructions(result, t) {
  const n = result.type;
  const out = [
    { channel: "communication", title: t("instructions.typeTitle", { number: n, name: t(`type.${n}.name`) }), body: t(`type.${n}.ask`) },
    { channel: "conflict", title: t("instructions.conflictTitle"), body: t(`type.${n}.conflict`) },
    { channel: "energy", title: t("instructions.stretchedTitle"), body: t("instructions.stretchedBody", { stress: t(`type.${n}.stress`), ease: t(`type.${n}.ease`) }) },
  ];
  if (!result.confident) {
    out.push({
      channel: "communication",
      title: t("instructions.provisionalTitle"),
      body: t("instructions.provisionalBody", { a: n, b: result.second, margin: result.margin }),
    });
  }
  return out;
}

function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const sameCentre = a.dominantCentre === b.dominantCentre;
  const adjacent = wingsOf(a.type).includes(b.type);
  const lineLinked = a.lines.stress === b.type || a.lines.ease === b.type || b.lines.stress === a.type || b.lines.ease === a.type;

  // Each branch is a whole sentence in the message table rather than a frame
  // with a noun dropped into it. "Both of you lead from the gut centre" needs
  // that noun in the right case in Polish and the right gender in Spanish, and
  // a translator can only get that right with the sentence in front of them.
  const bodyKey = adjacent ? "compare.adjacent"
    : lineLinked ? "compare.lineLinked"
    : sameCentre ? `compare.sameCentre.${a.dominantCentre}`
    : "compare.differentCentres";

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: t("compare.title", {
        a: a.type, b: b.type,
        nameA: t(`type.${a.type}.name`), nameB: t(`type.${b.type}.name`),
      }),
      body: t(bodyKey),
    })}
    <div class="exchange">
      <div><span class="label">${t("compare.needsFrom", { a: nameA, b: nameB })}</span>
        <p class="prose">${t(`type.${a.type}.ask`)}</p><p class="prose">${t(`type.${a.type}.conflict`)}</p></div>
      <div><span class="label">${t("compare.needsFrom", { a: nameB, b: nameA })}</span>
        <p class="prose">${t(`type.${b.type}.ask`)}</p><p class="prose">${t(`type.${b.type}.conflict`)}</p></div>
    </div>`;
}

export default {
  id: "enneagram",
  version: 1,
  family: "questionnaire",
  glyph: "◉",
  minutes: 7,
  channels: ["communication", "conflict", "energy"],
  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
  },
  form: (t) => ({
    kind: "items",
    items: ITEMS.map((item) => ({ ...item, prompt: t(`item.${item.id}`) })),
    scale: scaleFor("true5", t),
    shuffle: true,
    pageSize: 5,
  }),
  score, view, instructions, compare,
};
