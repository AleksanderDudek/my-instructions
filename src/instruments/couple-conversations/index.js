import { html, join } from "../../core/html.js";
import { scaleFor, straightlining } from "../../core/scoring.js";
import { factsHTML, verdictHTML } from "../../ui/components/scorecard.js";
import { STATUS, LEANS, TOPICS, CHILD_FACTS, itemsFor } from "./items.js";

/**
 * An agenda, not a verdict.
 *
 * Every consumer premarital product computes a compatibility percentage, and
 * the arithmetic behind it does not survive inspection. Actual similarity
 * predicts attraction at first meeting and stops predicting once a
 * relationship exists; averaging two people into one number destroys the only
 * information a two-person instrument has; and the prediction claims in the
 * field come from samples that failed to cross-validate.
 *
 * So this produces a list of conversations two people have not had, ordered by
 * how little they have had them. That is a claim about a self-reported event
 * rather than an inference about a mental state, and it is the one thing here
 * that is reliable enough to put at the top of a page.
 *
 * The plugin contract does more work than it looks like it should. `score()`
 * takes one person's answers and `compare()` takes two results, which makes it
 * *structurally impossible* to average a couple into a single figure. The
 * signature was written for share links and languages; it turns out to be the
 * right psychometrics too.
 */

const scale = scaleFor("agree5", (key) => key);
const midpoint = (scale.min + scale.max) / 2;

/**
 * Three states from three answers, and deliberately no more precision than
 * that. A three-item topic bank has unknown reliability, and a decimal here
 * would be a lie about how much we know.
 */
function leanOf(values) {
  const given = values.filter(Number.isFinite);
  if (!given.length) return null;
  const mean = given.reduce((a, b) => a + b, 0) / given.length;
  if (mean <= midpoint - 0.75) return "a";
  if (mean >= midpoint + 0.75) return "b";
  return "middle";
}

function score(answers) {
  const topics = {};
  for (const topic of TOPICS) {
    const items = {};
    for (const id of topic.positions) {
      // Unanswered items are omitted rather than substituted. The midpoint
      // substitution in scoreLikert is right for a scored scale and wrong
      // here: "I didn't answer" is its own state and it means something.
      const given = answers[id];
      if (given !== undefined && given !== null && given !== "") items[id] = given;
    }

    const status = STATUS.includes(answers[`${topic.id}.status`]) ? answers[`${topic.id}.status`] : null;
    const predicted = LEANS.includes(answers[`${topic.id}.predict`]) ? answers[`${topic.id}.predict`] : null;

    topics[topic.id] = topic.facts
      ? { items, facts: true, status, predicted, lean: leanOfFacts(items) }
      : { items, status, predicted, lean: leanOf(topic.positions.map((id) => items[id])) };
  }

  const answered = Object.values(topics).reduce((n, t) => n + Object.keys(t.items).length + (t.status ? 1 : 0) + (t.predicted ? 1 : 0), 0);
  const items = itemsFor((key) => key);

  return {
    v: 1,
    topics,
    /** How many topics this person considers settled — a count, not a score. */
    decided: Object.values(topics).filter((t) => t.status === "decided").length,
    unspoken: Object.values(topics).filter((t) => t.status === "never").length,
    answered,
    total: items.length,
    careless: straightlining(items.filter((i) => i.kind === "likert"), answers),
  };
}

/** The children topic has facts rather than positions; its lean is its answer. */
function leanOfFacts(items) {
  const want = items.k1;
  if (want === "yes" || want === "probably") return "b";
  if (want === "no") return "a";
  return want ? "middle" : null;
}

const ORDER = { never: 0, passing: 1, talked: 2, decided: 3 };
const byLeastDiscussed = (a, b) => (ORDER[a.status] ?? -1) - (ORDER[b.status] ?? -1);

function view(result, { t }) {
  const rows = TOPICS.map((topic) => ({ id: topic.id, ...result.topics[topic.id] })).sort(byLeastDiscussed);

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("view.eyebrow"),
      title: t("view.title", { count: result.unspoken }),
      body: t(result.unspoken ? "view.body" : "view.bodyNoneUnspoken"),
    })}

    ${factsHTML(rows.map((row) => [
      t(`topic.${row.id}.label`),
      t("view.rowValue", {
        status: t(`status.${row.status ?? "never"}`),
        lean: row.lean ? t(`lean.${row.id}.${row.lean}`) : t("view.noPosition"),
      }),
    ]))}

    <div class="note prose"><p>${t("view.childrenPrompt")}</p></div>
    <div class="note prose"><p>${t("view.notAPredictionNote")}</p></div>
    <div class="note prose"><p>${t("view.agreementNote")}</p></div>
    ${result.careless ? html`<div class="note warn-note prose"><p>${t("view.carelessNote")}</p></div>` : ""}`;
}

function instructions(result, t) {
  const rows = TOPICS.map((topic) => ({ id: topic.id, ...result.topics[topic.id] })).sort(byLeastDiscussed);
  const unspoken = rows.filter((row) => row.status === "never" || row.status === "passing");

  const cards = [{
    channel: "communication",
    title: t("instructions.agendaTitle"),
    body: unspoken.length
      ? t("instructions.agendaBody", { topics: unspoken.map((row) => t(`topic.${row.id}.label`)).join(", ") })
      : t("instructions.agendaNone"),
  }];

  if (result.decided) {
    cards.push({
      channel: "communication",
      title: t("instructions.decidedTitle"),
      body: t("instructions.decidedBody", { count: result.decided, total: TOPICS.length }),
    });
  }
  return cards;
}

/**
 * Two people, side by side, and nothing averaged.
 *
 * Rows are ordered by how little the pair has discussed the topic, not by how
 * far apart their positions are. Ordering by distance would put the noisiest
 * measurement at the top of the page and would frame the document as a list of
 * problems; ordering by discussion status frames it as a list of conversations,
 * which is what it is.
 *
 * The surprise flag is pair-level and unattributed by design. "You were wrong
 * about your partner" is the line one person reads aloud in an argument, and a
 * per-item prediction accuracy has near-zero reliability besides — so the flag
 * says only that something has not been talked through clearly enough for
 * either of them to be sure.
 */
function compare(a, b, { nameA = "A", nameB = "B", t }) {
  const rows = TOPICS.map((topic) => {
    const mine = a.topics[topic.id] ?? {};
    const theirs = b.topics[topic.id] ?? {};

    const bothLeans = [mine.lean, theirs.lean];
    const apart = bothLeans.every(Boolean) && ((bothLeans.includes("a") && bothLeans.includes("b")));
    const misread = apart && (mine.predicted === mine.lean || theirs.predicted === theirs.lean);

    return {
      id: topic.id, mine, theirs, apart, surprise: apart && misread,
      status: [mine.status, theirs.status].sort((x, y) => (ORDER[x] ?? -1) - (ORDER[y] ?? -1))[0],
      statusDiffers: Boolean(mine.status && theirs.status && mine.status !== theirs.status),
    };
  }).sort(byLeastDiscussed);

  const unspoken = rows.filter((row) => row.status === "never" || row.status === "passing");

  return html`
    ${verdictHTML({
      t,
      eyebrow: t("compare.eyebrow"),
      title: t("compare.title", { count: unspoken.length }),
      body: t(unspoken.length ? "compare.body" : "compare.bodyAllDiscussed", { nameA, nameB }),
    })}

    <div class="cards">
      ${join(rows.map((row) => html`<div class="card pad instruction-card">
        <span class="label">${t(`topic.${row.id}.label`)} · ${t(`status.${row.status ?? "never"}`)}</span>
        <h4>${t("compare.positions", {
          nameA, nameB,
          a: row.mine.lean ? t(`lean.${row.id}.${row.mine.lean}`) : t("view.noPosition"),
          b: row.theirs.lean ? t(`lean.${row.id}.${row.theirs.lean}`) : t("view.noPosition"),
        })}</h4>
        ${row.statusDiffers ? html`<p class="prose">${t("compare.statusDiffers")}</p>` : ""}
        ${row.surprise ? html`<p class="prose">${t("compare.surprise")}</p>` : ""}
        <p class="prose">${t(`topic.${row.id}.opener`)}</p>
      </div>`))}
    </div>

    <div class="note prose"><p>${t("compare.notAScoreNote")}</p></div>`;
}

export { leanOf, byLeastDiscussed };

export default {
  id: "couple-conversations",
  version: 1,
  family: "questionnaire",
  glyph: "⚯",
  minutes: 9,
  channels: ["communication", "conflict"],
  messages: {
    en: () => import("./i18n/en.js"),
    pl: () => import("./i18n/pl.js"),
    es: () => import("./i18n/es.js"),
    de: () => import("./i18n/de.js"),
  },
  form: (t) => ({
    kind: "items",
    items: itemsFor(t),
    scale: scaleFor("agree5", t),
    // Grouped by topic rather than shuffled, and never blocking: a question
    // about somebody's marriage that cannot be skipped produces a false answer
    // rather than no answer.
    shuffle: false,
    optional: true,
    pageSize: 5,
  }),
  score, view, instructions, compare,
};
