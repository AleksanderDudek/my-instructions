import { html, join } from "../../core/html.js";
import { scaleFor, scoreLikert, rank, dispersion } from "../../core/scoring.js";
import { barsHTML, verdictHTML, factsHTML } from "../../ui/components/scorecard.js";
import { GLYPHS, CONTRASTS, ORDER, ITEMS } from "./items.js";

/**
 * What the doing is made of.
 *
 * The reading that matters here is not the ranking — it is what each of the
 * four contrasts does. A contrast has four outcomes and three of them are
 * interesting:
 *
 *   `leans`  one end clearly above the other. The ordinary case.
 *   `both`   both ends high. Not a contradiction. It is a requirement with two
 *            parts, and it is the finding a forced-choice instrument destroys.
 *   `neither` both ends low. This axis does not drive you, and a job that
 *            offers it as its selling point is selling you nothing.
 *   `unclear` close together in the middle, which is the honest "no reading".
 *
 * The gap that separates `leans` from `unclear` is deliberately wide. Ten
 * points on a 1..100 rescale of five items is inside the noise, and printing a
 * direction on that is how a profile becomes a horoscope.
 */

const scale = scaleFor("agree5", (key) => key);

/** Below this, an end is not something the reader is asking for. */
const LOW = 39;
/** At or above this, an end is a real requirement. */
const HIGH = 62;
/** Points of difference before a contrast is allowed to name a direction. */
const DECISIVE = 12;

/**
 * One contrast, read. `lead` is null unless the gap clears `DECISIVE`, so no
 * caller can accidentally print a direction the numbers do not support.
 */
function readContrast(scores, [a, b]) {
  const gap = Math.abs(scores[a] - scores[b]);
  const lead = gap >= DECISIVE ? (scores[a] > scores[b] ? a : b) : null;
  const other = lead ? (lead === a ? b : a) : null;

  const kind = scores[a] >= HIGH && scores[b] >= HIGH ? "both"
    : scores[a] < LOW && scores[b] < LOW ? "neither"
    : lead ? "leans"
    : "unclear";

  return { pair: [a, b], a, b, gap, lead, other, kind };
}

function score(answers) {
  const { scores, answered, total } = scoreLikert(ITEMS, answers, scale);
  const ranked = rank(scores);
  const { range: spread, evenness } = dispersion(scores);

  const contrasts = CONTRASTS.map((pair) => readContrast(scores, pair));

  return {
    scores, ranked,
    top: ranked.slice(0, 2).map((r) => r.key),
    lowest: ranked[ranked.length - 1].key,
    contrasts,
    spread,
    /** How evenly the eight are held, 0 concentrated to 100 even. */
    evenness,
    // Eight scales spread more than six, so the shared fifteen-point floor is
    // raised here for the same reason riasec raises it: the ordering under a
    // small range is measurement error wearing a ranking's clothes.
    flat: spread < 18,
    /** Contrasts where both ends are a requirement — the reading to lead with. */
    doubled: contrasts.filter((c) => c.kind === "both").map((c) => c.pair),
    /** Contrasts that do not drive this person either way. */
    inert: contrasts.filter((c) => c.kind === "neither").map((c) => c.pair),
    answered, total,
  };
}

const rows = (result, t) =>
  result.ranked.map((r) => ({
    key: r.key,
    label: `${GLYPHS[r.key]} ${t(`shape.${r.key}.label`)}`,
    score: r.score,
    blurb: t(`shape.${r.key}.blurb`),
  }));

/** The sentence for one contrast, chosen by what the numbers actually support. */
function contrastLine(c, t) {
  const vars = {
    a: t(`shape.${c.a}.label`), b: t(`shape.${c.b}.label`),
    lead: c.lead ? t(`shape.${c.lead}.label`) : "",
    other: c.other ? t(`shape.${c.other}.label`) : "",
    gap: c.gap,
  };
  if (c.kind === "both") return t(`contrast.${c.a}.both`, vars);
  if (c.kind === "neither") return t(`contrast.${c.a}.neither`, vars);
  if (c.kind === "leans") return t(`shape.${c.lead}.leans`, vars);
  return t("contrast.unclear", vars);
}

function view(result, { t }) {
  const [first, second] = result.top;

  return html`
    ${verdictHTML({
      t,
      eyebrow: result.flat && result.doubled.length ? t("view.eyebrowFlatDoubled")
        : result.flat ? t("view.eyebrowFlat") : t("view.eyebrow"),
      title: result.flat && result.doubled.length
        ? t("view.titleFlatDoubled")
        : result.flat
        ? t("view.titleFlat")
        : t("view.title", { first: t(`shape.${first}.label`), second: t(`shape.${second}.label`) }),
      score: result.ranked[0].score,
      // Flat at the top of the range means something else entirely: not "no
      // ingredient is decisive" but "all of them are". Both are flat profiles
      // and they need opposite sentences.
      body: result.flat && result.doubled.length
        ? t("view.bodyFlatDoubled", { count: result.doubled.length })
        : result.flat
        ? t("view.bodyFlat", { spread: result.spread })
        : t("view.body", { first: t(`shape.${first}.label`), blurb: t(`shape.${first}.blurb`) }),
    })}

    <section class="sub-plate">
      <h4>${t("view.contrastHeading")} <span class="label">${t("view.contrastNote")}</span></h4>
      <div class="cards">
        ${join(result.contrasts.map((c) => html`<div class="card pad instruction-card">
          <span class="label">${t(`contrast.${c.a}.label`)}</span>
          <h4>${t(`contrast.kind.${c.kind}`)}</h4>
          <p class="prose">${contrastLine(c, t)}</p>
        </div>`))}
      </div>
    </section>

    ${barsHTML(rows(result, t))}

    ${factsHTML([
      [t("view.fact.ingredients"), t("view.ingredientsValue", {
        first: t(`shape.${first}.label`), second: t(`shape.${second}.label`),
      })],
      [t("view.fact.avoid"), t("view.avoidValue", { shape: t(`shape.${result.lowest}.label`) })],
      [t("view.fact.spread"), t(result.flat ? "view.spreadFlat" : "view.spreadValue", { spread: result.spread })],
    ])}

    ${result.doubled.length
      ? html`<div class="note prose"><p>${t("view.doubledNote", {
          pairs: result.doubled.map(([a, b]) => `${t(`shape.${a}.label`)} + ${t(`shape.${b}.label`)}`).join(" · "),
        })}</p></div>`
      : ""}
    <div class="note prose"><p>${t("view.notAJobNote")}</p></div>
    <div class="note prose"><p>${t("view.notAbilityNote")}</p></div>`;
}

function instructions(result, t) {
  const [first, second] = result.top;
  const cards = [
    { channel: "work", title: t("instructions.leadTitle", { shape: t(`shape.${first}.label`) }), body: t(`shape.${first}.ask`) },
    { channel: "work", title: t("instructions.secondTitle", { shape: t(`shape.${second}.label`) }), body: t(`shape.${second}.ask`) },
  ];
  // "What I am not asking for" has to name something the reader is not asking
  // for. On a uniformly high profile the lowest scale is still a requirement,
  // and `rank()` picks it by an arbitrary tie-break — so the card would have
  // contradicted a "I need both X and Y" card two rows below it.
  if (result.scores[result.lowest] < HIGH) {
    cards.push({ channel: "energy", title: t("instructions.drainTitle", { shape: t(`shape.${result.lowest}.label`) }), body: t(`shape.${result.lowest}.drain`) });
  }
  // A card is a line the reader hands to somebody, so it is written in the
  // first person. `contrast.<a>.both` is the result-page copy and addresses
  // the reader as "you"; reusing it here put one card on the sheet in the
  // wrong voice, which is exactly the sort of seam a colleague notices.
  for (const [a, b] of result.doubled) {
    cards.push({
      channel: "work",
      title: t("instructions.doubledTitle", { a: t(`shape.${a}.label`), b: t(`shape.${b}.label`) }),
      body: t(`instructions.doubled.${a}`, { a: t(`shape.${a}.label`), b: t(`shape.${b}.label`) }),
    });
  }
  // A flat profile that also holds both ends of a contrast has already had
  // the useful thing said about it by the cards above.
  if (result.flat && !result.doubled.length) {
    cards.push({ channel: "work", title: t("instructions.flatTitle"), body: t("instructions.flatBody") });
  }
  return cards;
}

/**
 * Two people's shapes are complementary far more often than they collide, so
 * this reports the division of labour rather than a similarity figure: what
 * each one wants that the other does not, which is the same thing as who
 * should take which half of a piece of work.
 */
function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const wants = (r, k) => r.scores[k] >= HIGH;
  const label = (k) => t(`shape.${k}.label`);

  const aOnly = ORDER.filter((k) => wants(a, k) && !wants(b, k));
  const bOnly = ORDER.filter((k) => wants(b, k) && !wants(a, k));
  const both = ORDER.filter((k) => wants(a, k) && wants(b, k));

  const names = (list) => (list.length ? list.map(label).join(", ") : t("compare.none"));

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: both.length && (aOnly.length || bOnly.length) ? t("compare.titleMixed")
        : both.length ? t("compare.titleSame")
        : aOnly.length || bOnly.length ? t("compare.titleSplit")
        : t("compare.titleNeither"),
      body: t(aOnly.length || bOnly.length ? "compare.body" : "compare.bodySame", { nameA, nameB }),
    })}
    ${factsHTML([
      [t("compare.fact.both"), names(both)],
      [t("compare.fact.aOnly", { name: nameA }), names(aOnly)],
      [t("compare.fact.bOnly", { name: nameB }), names(bOnly)],
    ])}
    <div class="exchange">
      <div><span class="label">${t("compare.givesEnergy", { name: nameA })}</span><p class="prose">${t(`shape.${a.top[0]}.ask`)}</p></div>
      <div><span class="label">${t("compare.givesEnergy", { name: nameB })}</span><p class="prose">${t(`shape.${b.top[0]}.ask`)}</p></div>
    </div>`;
}

export { readContrast, LOW, HIGH, DECISIVE };

export default {
  id: "work-shape",
  version: 1,
  family: "questionnaire",
  glyph: "◈",
  minutes: 6,
  channels: ["work", "energy"],
  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
    es: () => import("./i18n/es.js"),
    de: () => import("./i18n/de.js"),
  },
  form: (t) => ({
    kind: "items",
    items: ITEMS.map((item) => ({ ...item, prompt: t(`item.${item.id}`) })),
    scale: scaleFor("agree5", t),
    shuffle: true,
    pageSize: 8,
  }),
  score, view, instructions, compare,
};
