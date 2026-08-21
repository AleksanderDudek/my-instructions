import { html } from "../../core/html.js";
import { scaleFor, scoreLikert, rank } from "../../core/scoring.js";
import { barsHTML, verdictHTML, factsHTML } from "../../ui/components/scorecard.js";
import { GLYPHS, ORDER, PERCEIVING, JUDGING, OPPOSITE, EXTRAVERTED, LETTER, ITEMS } from "./items.js";

/**
 * The stack, and the code that falls out of it.
 *
 * Jung's own claim is about *function order*, not about four letters: a person
 * leads with one function, supports it with a second of the opposite kind and
 * opposite attitude, and is worst at the mirror of the first. The four-letter
 * code is a later shorthand for that arrangement, so here it is derived from
 * the stack rather than measured directly — which is also why it can be
 * reported honestly as uncertain when the top two functions are close.
 */

const scale = scaleFor("true5", (key) => key);

/** Auxiliary: the strongest function of the other job and the other attitude. */
function auxiliaryOf(dominant, scores) {
  const wantPerceiving = JUDGING.includes(dominant);
  const pool = (wantPerceiving ? PERCEIVING : JUDGING).filter((f) => EXTRAVERTED.has(f) !== EXTRAVERTED.has(dominant));
  return pool.reduce((best, f) => (scores[f] > scores[best] ? f : best), pool[0]);
}

/**
 * The four-letter code, read off the stack.
 *
 * E/I is the dominant's attitude. The middle two letters come from whichever
 * perceiving and judging functions are in the top pair. The last letter asks
 * which of the pair faces outward: an outward-facing judge reads as J, an
 * outward-facing perceiver as P.
 */
function codeFor(dominant, auxiliary) {
  const pair = [dominant, auxiliary];
  const perceiver = pair.find((f) => PERCEIVING.includes(f));
  const judge = pair.find((f) => JUDGING.includes(f));
  const outward = pair.find((f) => EXTRAVERTED.has(f));
  return [
    EXTRAVERTED.has(dominant) ? "E" : "I",
    LETTER[perceiver],
    LETTER[judge],
    JUDGING.includes(outward) ? "J" : "P",
  ].join("");
}

/**
 * Temperament — the four groupings of types, derived and not measured.
 *
 * Temperament is a coarser cut of the same information: concrete types split
 * on whether they settle or improvise, abstract types on whether they reason
 * or interpret. It is a *grouping*, so it is computed from the code rather
 * than asked about separately — a separate questionnaire for it would be four
 * more scales measuring what these eight already measured.
 *
 * The names here are our own. Keirsey's four are his.
 */
function temperamentOf(code) {
  if (code[1] === "S") return code[3] === "J" ? "steward" : "improviser";
  return code[2] === "T" ? "systematiser" : "interpreter";
}

function score(answers) {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const ranked = rank(scores);
  const dominant = ranked[0].key;
  const runnerUp = ranked[1].key;
  const margin = ranked[0].score - ranked[1].score;

  const auxiliary = auxiliaryOf(dominant, scores);
  const tertiary = OPPOSITE[auxiliary];
  const inferior = OPPOSITE[dominant];

  return {
    scores, ranked,
    stack: [dominant, auxiliary, tertiary, inferior],
    dominant, auxiliary, tertiary, inferior,
    runnerUp, margin,
    confident: margin >= 6,
    code: codeFor(dominant, auxiliary),
    temperament: temperamentOf(codeFor(dominant, auxiliary)),
    attitude: EXTRAVERTED.has(dominant) ? "outward" : "inward",
    answered, total,
  };
}

const rows = (result, t) =>
  result.ranked.map((r) => ({
    key: r.key,
    label: `${GLYPHS[r.key]} ${t(`fn.${r.key}.label`)}`,
    score: r.score,
    blurb: t(`fn.${r.key}.blurb`),
  }));

const POSITIONS = ["dominant", "auxiliary", "tertiary", "inferior"];

function view(result, { t }) {
  return html`
    ${verdictHTML({
      t,
      eyebrow: result.confident ? t("view.eyebrowConfident") : t("view.eyebrowClose"),
      title: t("view.title", { code: result.code, fn: t(`fn.${result.dominant}.label`) }),
      score: result.ranked[0].score,
      body: result.confident
        ? t("view.bodyConfident", { blurb: t(`fn.${result.dominant}.blurb`), aux: t(`fn.${result.auxiliary}.label`) })
        : t("view.bodyClose", {
            a: t(`fn.${result.dominant}.label`),
            b: t(`fn.${result.runnerUp}.label`),
            margin: result.margin,
          }),
    })}
    ${barsHTML(rows(result, t))}
    ${factsHTML([
      [t("view.position.temperament"), t("view.temperamentValue", {
        name: t(`temperament.${result.temperament}.label`),
        blurb: t(`temperament.${result.temperament}.blurb`),
      })],
      ...result.stack.map((fn, i) => [
      t(`view.position.${POSITIONS[i]}`),
      t("view.stackValue", { fn: t(`fn.${fn}.label`), score: result.scores[fn], blurb: t(`fn.${fn}.blurb`) }),
      ]),
    ])}
    <div class="note prose"><p>${t("view.inferiorNote", { fn: t(`fn.${result.inferior}.label`), grip: t(`fn.${result.inferior}.inferior`) })}</p></div>
    <div class="note prose"><p>${t("view.codeNote")}</p></div>`;
}

function instructions(result, t) {
  const out = [
    { channel: "communication", title: t("instructions.leadTitle", { fn: t(`fn.${result.dominant}.label`) }), body: t(`fn.${result.dominant}.ask`) },
    { channel: "work", title: t("instructions.supportTitle", { fn: t(`fn.${result.auxiliary}.label`) }), body: t(`fn.${result.auxiliary}.ask`) },
    { channel: "energy", title: t("instructions.inferiorTitle", { fn: t(`fn.${result.inferior}.label`) }), body: t(`fn.${result.inferior}.inferior`) },
  ];
  out.push({
    channel: "work",
    title: t("instructions.temperamentTitle", { name: t(`temperament.${result.temperament}.label`) }),
    body: t(`temperament.${result.temperament}.ask`),
  });
  if (!result.confident) {
    out.push({
      channel: "communication",
      title: t("instructions.provisionalTitle"),
      body: t("instructions.provisionalBody", {
        a: t(`fn.${result.dominant}.label`),
        b: t(`fn.${result.runnerUp}.label`),
        margin: result.margin,
      }),
    });
  }
  return out;
}

function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const shared = a.stack.filter((fn) => b.stack.includes(fn));
  const sameStack = a.dominant === b.auxiliary && a.auxiliary === b.dominant;
  const blindSpot = a.inferior === b.inferior;

  // Three genuinely different situations, three whole sentences. Which one
  // applies says more than any similarity percentage would.
  const bodyKey = sameStack ? "compare.mirrored"
    : blindSpot ? "compare.sharedBlindSpot"
    : shared.length >= 2 ? "compare.overlap"
    : "compare.different";

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: t("compare.title", { a: a.code, b: b.code }),
      body: t(bodyKey, {
        nameA, nameB,
        shared: shared.map((fn) => t(`fn.${fn}.label`)).join(", "),
        blind: t(`fn.${a.inferior}.label`),
      }),
    })}
    <div class="exchange">
      <div><span class="label">${t("compare.leadsWith", { name: nameA })}</span>
        <p class="prose">${t(`fn.${a.dominant}.ask`)}</p>
        <p class="prose">${t("compare.worstAt", { fn: t(`fn.${a.inferior}.label`), grip: t(`fn.${a.inferior}.inferior`) })}</p></div>
      <div><span class="label">${t("compare.leadsWith", { name: nameB })}</span>
        <p class="prose">${t(`fn.${b.dominant}.ask`)}</p>
        <p class="prose">${t("compare.worstAt", { fn: t(`fn.${b.inferior}.label`), grip: t(`fn.${b.inferior}.inferior`) })}</p></div>
    </div>`;
}

export { temperamentOf };

export default {
  id: "jungian",
  version: 1,
  family: "questionnaire",
  glyph: "☯",
  minutes: 6,
  channels: ["communication", "work", "energy"],
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
  score, view, instructions, compare,
};
