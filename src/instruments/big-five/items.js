/**
 * Big Five — original item bank, Likert.
 *
 * The five-factor model is the one instrument here with real research behind
 * it, and its canonical item pools (IPIP) are genuinely public domain. These
 * items are nonetheless written fresh, in the same voice as the rest of the
 * app, and the scoring engine takes items as data — so dropping in the IPIP
 * fifty-item markers later is a change to this file and nothing else.
 *
 * Eight items per factor, four forward and four reverse. The even split
 * matters more here than anywhere else in the app: the factors are meant to be
 * orthogonal, and an all-forward scale quietly correlates every factor with
 * agreeableness.
 */

const FACTORS = {
  openness: {
    label: "Openness", glyph: "◇",
    high: "Curious, abstract, drawn to the unfamiliar. Ideas are entertainment.",
    low: "Practical, concrete, loyal to what already works. Novelty has to justify itself.",
    ask: { high: "Bring me the strange idea before it is finished. I would rather explore it than be handed a conclusion.", low: "Give me the concrete version. If it works, I do not need it reinvented." },
  },
  conscientiousness: {
    label: "Conscientiousness", glyph: "▤",
    high: "Organised, early, follows through. Structure is comfort rather than constraint.",
    low: "Flexible, improvisational, allergic to premature planning. Deadlines do the motivating.",
    ask: { high: "Tell me the deadline honestly, not padded. I will hit it and I will resent the padding.", low: "Do not micro-schedule me. Give me the outcome and the real deadline and leave the middle alone." },
  },
  extraversion: {
    label: "Extraversion", glyph: "◈",
    high: "Gains energy from people and motion. Thinks out loud.",
    low: "Gains energy from quiet. Thinks first, speaks once.",
    ask: { high: "Let me talk it through — the thinking happens in the talking, so an unfinished sentence is not a position.", low: "Give me the agenda in advance and a pause before I answer. My first silence is processing, not disagreement." },
  },
  agreeableness: {
    label: "Agreeableness", glyph: "◍",
    high: "Trusting, accommodating, quick to forgive. Harmony is worth paying for.",
    low: "Sceptical, direct, comfortable with friction. Will say the unwelcome thing.",
    ask: { high: "Check that my yes is a real yes. I will agree to keep the peace and only notice the cost later.", low: "Take my bluntness at face value. It is information, not hostility, and I expect the same back." },
  },
  reactivity: {
    label: "Emotional Reactivity", glyph: "◐",
    high: "Feels events strongly and for longer. Early warning system, expensively calibrated.",
    low: "Steady under load. Recovers fast; sometimes misses that others have not.",
    ask: { high: "Do not tell me it is fine — tell me what specifically happens next. Detail settles me; reassurance does not.", low: "If I seem unbothered I probably am. Say plainly when something matters to you; I will not infer it." },
  },
};

const ORDER = ["openness", "conscientiousness", "extraversion", "agreeableness", "reactivity"];

const row = (id, scale, prompt, reverse = false) => ({ id, kind: "likert", scaleName: "agree5", scale, prompt, reverse });

const ITEMS = [
  row("o1", "openness", "I am pulled toward ideas that have no obvious use."),
  row("o2", "openness", "A piece of art or music has genuinely changed how I see something."),
  row("o3", "openness", "Given the choice I take the unfamiliar route over the known one."),
  row("o4", "openness", "I enjoy questions that do not resolve."),
  row("o5", "openness", "I prefer the tried and tested to the novel.", true),
  row("o6", "openness", "Abstract discussion loses me quickly.", true),
  row("o7", "openness", "I have little interest in art, poetry or theatre.", true),
  row("o8", "openness", "Imagination is not something I would say I have much of.", true),

  row("c1", "conscientiousness", "I finish things well before they are due."),
  row("c2", "conscientiousness", "My space stays in order without me having to think about it."),
  row("c3", "conscientiousness", "Once I commit to a plan I follow it through."),
  row("c4", "conscientiousness", "I make lists and I actually use them."),
  row("c5", "conscientiousness", "I leave things until the pressure forces me.", true),
  row("c6", "conscientiousness", "My belongings end up scattered.", true),
  row("c7", "conscientiousness", "I lose interest partway through and move on to something else.", true),
  row("c8", "conscientiousness", "I am careless with details.", true),

  row("e1", "extraversion", "I start conversations with people I do not know."),
  row("e2", "extraversion", "A crowded room energises me."),
  row("e3", "extraversion", "I am comfortable being the centre of attention."),
  row("e4", "extraversion", "At a gathering I end up talking to a lot of different people."),
  row("e5", "extraversion", "I need a long quiet stretch to recover after socialising.", true),
  row("e6", "extraversion", "I keep to the background.", true),
  row("e7", "extraversion", "Small talk exhausts me.", true),
  row("e8", "extraversion", "Given the option I would usually rather stay in.", true),

  row("a1", "agreeableness", "I take a real interest in other people's problems."),
  row("a2", "agreeableness", "I give people the benefit of the doubt."),
  row("a3", "agreeableness", "I go out of my way to put people at ease."),
  row("a4", "agreeableness", "I find it easy to forgive."),
  row("a5", "agreeableness", "I am quick to point out where someone is wrong.", true),
  row("a6", "agreeableness", "Other people's difficulties are not especially my concern.", true),
  row("a7", "agreeableness", "I can be cutting when I am annoyed.", true),
  row("a8", "agreeableness", "I tend to suspect people's motives.", true),

  row("n1", "reactivity", "Small setbacks stay with me longer than they should."),
  row("n2", "reactivity", "I worry about things that have not happened."),
  row("n3", "reactivity", "My mood can turn on very little."),
  row("n4", "reactivity", "Several things going wrong at once overwhelms me."),
  row("n5", "reactivity", "I stay level under pressure.", true),
  row("n6", "reactivity", "I rarely feel anxious.", true),
  row("n7", "reactivity", "I recover quickly from a bad moment.", true),
  row("n8", "reactivity", "I am hard to rattle.", true),
];

export { FACTORS, ORDER, ITEMS };
