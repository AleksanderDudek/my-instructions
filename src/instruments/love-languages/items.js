/**
 * Five Languages of Love — original item bank.
 *
 * The five-category framework is Gary Chapman's and is not ours; the wording
 * below is. Chapman's own 30-item questionnaire is copyrighted and, more to
 * the point, *ipsative*: it forces a choice between two languages on every
 * question, so the five scores are constrained to sum to thirty. That makes
 * "80 for touch" impossible to express and makes two people's scores
 * incomparable, which is fatal for anything that later wants to match people.
 *
 * So: forty Likert items, eight per language, each rated on its own. Two items
 * in every block are reverse-keyed to blunt the tendency to agree with
 * everything. Scores come out independent — you can want all five, or none.
 */

const LANGUAGES = {
  words: {
    label: "Words of Affirmation",
    glyph: "✎",
    blurb: "Being told, out loud and specifically, what you are worth.",
    starved: "Silence reads as disapproval. You will fill it in with the worst available interpretation.",
    fed: "A named, specific compliment carries you for days.",
    ask: "Say the good thing out loud. Be specific — \"you handled that call well\" beats \"you're great\".",
  },
  time: {
    label: "Quality Time",
    glyph: "◷",
    blurb: "Undivided attention, with the rest of the world put down.",
    starved: "A cancelled plan lands as a verdict on how much you matter.",
    fed: "One unhurried hour resets the whole relationship.",
    ask: "Put the phone face-down and keep the plan. Presence is the gift; the activity is incidental.",
  },
  service: {
    label: "Acts of Service",
    glyph: "⚒",
    blurb: "The dreaded task, quietly taken off your hands.",
    starved: "You keep a private ledger of who does the invisible work, and it fills up.",
    fed: "Someone doing the thing without being asked reads as devotion.",
    ask: "Do the task, don't announce it. An offer that never becomes help is worse than no offer.",
  },
  touch: {
    label: "Physical Touch",
    glyph: "✋",
    blurb: "Contact — casual, constant, not only the intimate kind.",
    starved: "A day with no contact leaves you unsettled without knowing why.",
    fed: "A hand on the back does what a paragraph cannot.",
    ask: "Touch in passing, not only at the big moments. Sit closer than strictly necessary.",
  },
  gifts: {
    label: "Receiving Gifts",
    glyph: "❖",
    blurb: "Evidence, in object form, that someone was thinking of you.",
    starved: "A forgotten date is not a scheduling error to you. It is data.",
    fed: "A small thing chosen with attention outlasts its own usefulness.",
    ask: "It is never about cost. It is about proof you were being thought of while apart.",
  },
};

const ORDER = ["words", "time", "service", "touch", "gifts"];

/** kind/scale are constant across this bank, so the rows stay readable. */
const row = (id, scale, prompt, reverse = false) => ({ id, kind: "likert", scaleName: "true5", scale, prompt, reverse });

const ITEMS = [
  row("w1", "words", "Being told specifically what someone appreciates about me stays with me for days."),
  row("w2", "words", "I reread messages that said something kind about me."),
  row("w3", "words", "Being praised in front of other people means more to me than people assume."),
  row("w4", "words", "When someone I love goes quiet — no comment, no encouragement — that is the thing I notice first."),
  row("w5", "words", "I want to hear that I am loved regularly, including when nothing is wrong."),
  row("w6", "words", "Someone thanking me out loud for something small can tilt the whole day."),
  row("w7", "words", "Compliments tend to slide off me; I do not hold on to them.", true),
  row("w8", "words", "Words of encouragement do not do much for me either way.", true),

  row("t1", "time", "I feel closest to someone when the phones are down and it is just the two of us."),
  row("t2", "time", "A cancelled plan reads to me as a verdict on how much I matter."),
  row("t3", "time", "One long uninterrupted conversation does more for me than a week of quick check-ins."),
  row("t4", "time", "Running an ordinary errand together counts as real time together for me."),
  row("t5", "time", "Being interrupted during time I had set aside for someone stings more than it should."),
  row("t6", "time", "I am content simply being in the same room as someone I love, both of us doing our own thing."),
  row("t7", "time", "I do not need much undivided attention to feel secure.", true),
  row("t8", "time", "Long stretches of togetherness start to feel like a demand on me.", true),

  row("s1", "service", "Someone quietly handling a task I had been dreading lands harder than anything they could say."),
  row("s2", "service", "I notice exactly who does the invisible work, and I keep a mental note."),
  row("s3", "service", "When I am overwhelmed, what I want is for someone to take something off the list."),
  row("s4", "service", "An offer to help that never turns into help is worse than no offer at all."),
  row("s5", "service", "Being cooked for makes me feel cared for in a way I find hard to explain."),
  row("s6", "service", "Small maintenance — a full tank, a fixed shelf — reads as love in my house."),
  row("s7", "service", "Practical help from a partner feels faintly transactional to me.", true),
  row("s8", "service", "I would rather someone did nothing practical and simply sat with me.", true),

  row("p1", "touch", "A hand on my back in a difficult moment does more than any sentence."),
  row("p2", "touch", "When I am anxious I go looking for contact — a hug, a lean, a shoulder."),
  row("p3", "touch", "Sleeping next to someone is a large part of what makes a relationship feel real to me."),
  row("p4", "touch", "A day with no physical affection in it leaves me quietly unsettled."),
  row("p5", "touch", "I like being touched casually in passing, not only in intimate moments."),
  row("p6", "touch", "Holding hands in public matters to me more than it probably should."),
  row("p7", "touch", "I need more physical space than most people I have been close to.", true),
  row("p8", "touch", "Being held when I am upset makes me want to pull away.", true),

  row("g1", "gifts", "A small object that proves someone was thinking of me can carry me for weeks."),
  row("g2", "gifts", "I keep things people gave me long past their usefulness."),
  row("g3", "gifts", "A gift that shows someone was listening is the clearest evidence of love I know."),
  row("g4", "gifts", "Forgotten birthdays and anniversaries hurt me more than I let on."),
  row("g5", "gifts", "I notice when someone brings me back something from a trip."),
  row("g6", "gifts", "I put real effort into choosing gifts, and I hope for the same in return."),
  row("g7", "gifts", "Presents make me uncomfortable; I would rather people did not.", true),
  row("g8", "gifts", "The object itself means little to me — it is only an object.", true),
];

export { LANGUAGES, ORDER, ITEMS };
