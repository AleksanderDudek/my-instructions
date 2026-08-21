/**
 * Couple conversations — original items.
 *
 * This is not a compatibility test and the structure is what stops it becoming
 * one. There is no scale here, nothing is summed to 1–100, and no number
 * describes the pair. What is recorded is each person's position on five
 * topics, and — the load-bearing part — whether the two of them have actually
 * talked about it.
 *
 * Three design decisions are worth stating because they each depart from the
 * house default.
 *
 * **Shuffle is off.** The runner shuffles so that consecutive items measuring
 * one scale do not announce themselves and inflate it. There is no scale here
 * to inflate, and the discussion-status question is meaningless away from the
 * topic it refers to. So items stay grouped by topic, one topic per page.
 *
 * **Status comes first within each topic.** Stating your position on joint
 * accounts primes you to believe you have discussed joint accounts. Since
 * discussion status is the output and the positions are not scored, priming
 * the position is the cheaper error.
 *
 * **Topics escalate.** Roles, then money, then conflict, then children, then
 * religion — easiest first in the form. The report orders them differently,
 * by what the couple has least discussed, because the form and the report
 * solve different problems.
 */

/** Four states, because "we mentioned it once" is not the same as deciding. */
const STATUS = ["never", "passing", "talked", "decided"];

/** The coarse three-state summary each topic reduces to. Never a score. */
const LEANS = ["a", "middle", "b"];

const TOPICS = [
  { id: "roles", positions: ["r1", "r2", "r3"] },
  { id: "money", positions: ["m1", "m2", "m3"] },
  { id: "conflict", positions: ["c1", "c2", "c3"] },
  { id: "children", positions: ["k1", "k2", "k3"], facts: true },
  { id: "religion", positions: ["f1", "f2", "f3"] },
];

/**
 * Two answers never leave the device, whatever anybody later sets their
 * sharing to. Both are questions worth asking and not worth sending: an
 * answer that could be read as an admission belongs to the person who gave it.
 */
const PRIVATE = new Set(["m3", "c3"]);

/** The children topic asks for facts rather than positions. */
const CHILD_FACTS = {
  k1: ["no", "unsure", "probably", "yes"],
  k2: ["none", "one", "two", "threePlus", "unsure"],
  k3: ["notYet", "twoToFive", "fivePlus", "unsure"],
};

/**
 * The form, built per topic. Every item carries its topic so the runner can
 * page by it and `score()` can group without a second table.
 */
function itemsFor(t) {
  const items = [];
  for (const topic of TOPICS) {
    items.push({
      id: `${topic.id}.status`, kind: "choice", topic: topic.id,
      prompt: t(`topic.${topic.id}.statusPrompt`),
      options: STATUS.map((value) => ({ value, label: t(`status.${value}`) })),
    });

    for (const id of topic.positions) {
      if (topic.facts) {
        items.push({
          id, kind: "choice", topic: topic.id, prompt: t(`item.${id}`),
          options: CHILD_FACTS[id].map((value) => ({ value, label: t(`fact.${id}.${value}`) })),
        });
      } else {
        items.push({
          id, kind: "likert", scaleName: "agree5", scale: topic.id, topic: topic.id,
          prompt: t(`item.${id}`),
          ...(PRIVATE.has(id) ? { tier: "private" } : {}),
        });
      }
    }

    items.push({
      id: `${topic.id}.predict`, kind: "choice", topic: topic.id,
      prompt: t(`topic.${topic.id}.predictPrompt`),
      options: LEANS.map((value) => ({ value, label: t(`lean.${topic.id}.${value}`) })),
    });
  }
  return items;
}

export { STATUS, LEANS, TOPICS, PRIVATE, CHILD_FACTS, itemsFor };
