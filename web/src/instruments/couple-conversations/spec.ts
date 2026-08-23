import { scaleFor, straightlining } from "@/core/scoring";
import type { Answers, InstructionCard, InstrumentSpec, T } from "@/core/types";
import { STATUS, LEANS, TOPICS, itemsFor, type Lean, type Status, type TopicId } from "./items";

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

/** One topic's reading: what was answered, how far it was discussed, and a lean. */
export type TopicResult = {
  items: Record<string, string | number>;
  facts?: boolean;
  status: Status | null;
  predicted: Lean | null;
  lean: Lean | null;
};

export type ConversationsResult = {
  v: number;
  topics: Record<string, TopicResult>;
  /** How many topics this person considers settled — a count, not a score. */
  decided: number;
  unspoken: number;
  answered: number;
  total: number;
  careless: boolean;
};

/**
 * Three states from three answers, and deliberately no more precision than
 * that. A three-item topic bank has unknown reliability, and a decimal here
 * would be a lie about how much we know.
 */
export function leanOf(values: (string | number | undefined)[]): Lean | null {
  const given = values.filter((v): v is number => Number.isFinite(v));
  if (!given.length) return null;
  const mean = given.reduce((a, b) => a + b, 0) / given.length;
  if (mean <= midpoint - 0.75) return "a";
  if (mean >= midpoint + 0.75) return "b";
  return "middle";
}

/** The children topic has facts rather than positions; its lean is its answer. */
function leanOfFacts(items: Record<string, string | number>): Lean | null {
  const want = items.k1;
  if (want === "yes" || want === "probably") return "b";
  if (want === "no") return "a";
  return want ? "middle" : null;
}

const oneOf = <V extends string>(allowed: readonly V[], given: unknown): V | null =>
  typeof given === "string" && (allowed as readonly string[]).includes(given) ? (given as V) : null;

export function score(answers: Answers): ConversationsResult {
  const topics: Record<string, TopicResult> = {};
  for (const topic of TOPICS) {
    const items: Record<string, string | number> = {};
    for (const id of topic.positions) {
      // Unanswered items are omitted rather than substituted. The midpoint
      // substitution in scoreLikert is right for a scored scale and wrong
      // here: "I didn't answer" is its own state and it means something.
      const given = answers[id];
      if (given !== undefined && given !== null && given !== "") items[id] = given as string | number;
    }

    const status = oneOf(STATUS, answers[`${topic.id}.status`]);
    const predicted = oneOf(LEANS, answers[`${topic.id}.predict`]);

    topics[topic.id] = topic.facts
      ? { items, facts: true, status, predicted, lean: leanOfFacts(items) }
      : { items, status, predicted, lean: leanOf(topic.positions.map((id) => items[id])) };
  }

  const answered = Object.values(topics).reduce(
    (n, entry) => n + Object.keys(entry.items).length + (entry.status ? 1 : 0) + (entry.predicted ? 1 : 0),
    0,
  );
  const items = itemsFor((key) => key);

  return {
    v: 1,
    topics,
    decided: Object.values(topics).filter((entry) => entry.status === "decided").length,
    unspoken: Object.values(topics).filter((entry) => entry.status === "never").length,
    answered,
    total: items.length,
    careless: straightlining(
      items.filter((i) => i.kind === "likert"),
      answers,
    ),
  };
}

const ORDER: Record<string, number | undefined> = { never: 0, passing: 1, talked: 2, decided: 3 };

export const byLeastDiscussed = (a: { status?: Status | null }, b: { status?: Status | null }) =>
  (ORDER[a.status ?? ""] ?? -1) - (ORDER[b.status ?? ""] ?? -1);

/** Topics in report order — least discussed first, which is where the work is. */
export const agenda = (result: ConversationsResult) =>
  TOPICS.map((topic) => ({ id: topic.id, ...result.topics[topic.id] })).sort(byLeastDiscussed);

export function instructions(result: ConversationsResult, t: T): InstructionCard[] {
  const rows = agenda(result);
  const unspoken = rows.filter((row) => row.status === "never" || row.status === "passing");

  const cards: InstructionCard[] = [
    {
      channel: "communication",
      title: t("instructions.agendaTitle"),
      body: unspoken.length
        ? t("instructions.agendaBody", { topics: unspoken.map((row) => t(`topic.${row.id}.label`)).join(", ") })
        : t("instructions.agendaNone"),
    },
  ];

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
export type CompareRow = {
  id: TopicId;
  mine: Partial<TopicResult>;
  theirs: Partial<TopicResult>;
  apart: boolean;
  surprise: boolean;
  status: Status | null;
  statusDiffers: boolean;
};

export type Comparison = { rows: CompareRow[]; unspoken: number };

export function compare(a: ConversationsResult, b: ConversationsResult): Comparison {
  const rows: CompareRow[] = TOPICS.map((topic) => {
    const mine: Partial<TopicResult> = a.topics[topic.id] ?? {};
    const theirs: Partial<TopicResult> = b.topics[topic.id] ?? {};

    const bothLeans = [mine.lean, theirs.lean];
    const apart = bothLeans.every(Boolean) && bothLeans.includes("a") && bothLeans.includes("b");
    const misread = apart && (mine.predicted === mine.lean || theirs.predicted === theirs.lean);

    return {
      id: topic.id,
      mine,
      theirs,
      apart,
      surprise: apart && misread,
      status:
        [mine.status ?? null, theirs.status ?? null].sort((x, y) => (ORDER[x ?? ""] ?? -1) - (ORDER[y ?? ""] ?? -1))[0] ??
        null,
      statusDiffers: Boolean(mine.status && theirs.status && mine.status !== theirs.status),
    };
  }).sort(byLeastDiscussed);

  const unspoken = rows.filter((row) => row.status === "never" || row.status === "passing");
  return { rows, unspoken: unspoken.length };
}

export const spec: InstrumentSpec<ConversationsResult> = {
  id: "couple-conversations",
  version: 1,
  family: "questionnaire",
  glyph: "⚯",
  minutes: 9,
  channels: ["communication", "conflict"],
  tier: "premium",
  messages: {
    en: () => import("./i18n/en"),
    pl: () => import("./i18n/pl"),
    es: () => import("./i18n/es"),
    de: () => import("./i18n/de"),
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
  score,
  instructions,
  compare,
};

export default spec;
