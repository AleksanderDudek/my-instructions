/**
 * Enneagram — original item bank, Likert.
 *
 * The nine-type model is public; the RHETI's 144 forced-choice pairs are Riso
 * and Hudson's copyrighted expression of it and are not reproduced here. The
 * forced-choice format has the same defect as Chapman's quiz — the nine scores
 * are locked to a constant sum, so a person who genuinely runs on two types
 * has to donate one to the other.
 *
 * Forty-five items, five per type, one reverse-keyed in each block. Types are
 * described by their *motive*, not their behaviour: two people can both tidy
 * the kitchen, and only the reason tells you which type did it.
 */

const TYPES = {
  1: {
    name: "The Reformer", core: "Correctness",
    blurb: "Driven by an inner standard that never quite signs off. Improvement as a moral duty.",
    fear: "Being corrupt, wrong, or irredeemably flawed.",
    want: "To be good, and to have integrity that holds up under inspection.",
    stress: "Turns rigid and critical; the commentary gets louder and leaks outward.",
    ease: "Relaxes into spontaneity and lets good-enough be good enough.",
    ask: "Criticise the work, not the character, and say what is right before what is wrong. I have already found the flaw; what I need is permission to stop.",
    conflict: "I go cold and precise rather than loud. Do not mistake the calm for agreement.",
  },
  2: {
    name: "The Helper", core: "Being needed",
    blurb: "Reads the room's needs before its own. Gives, and quietly expects a return that is never named.",
    fear: "Being unwanted, or loved only conditionally.",
    want: "To be genuinely needed and freely loved.",
    stress: "Becomes possessive and keeps score; the giving turns into leverage.",
    ease: "Turns the care inward and finally states a need outright.",
    ask: "Ask me what I need and do not accept 'nothing' the first time. I will not volunteer it.",
    conflict: "I withdraw the warmth rather than raise the issue. Notice the temperature drop and ask.",
  },
  3: {
    name: "The Achiever", core: "Value through performance",
    blurb: "Shape-shifts to succeed in whatever room it is standing in. Worth measured in output.",
    fear: "Being worthless apart from what is accomplished.",
    want: "To be admired, and to feel genuinely valuable.",
    stress: "Disengages and goes through the motions; image maintenance replaces the work.",
    ease: "Stops performing, becomes loyal and cooperative for its own sake.",
    ask: "Tell me you value me when I have produced nothing. That is the version I do not believe yet.",
    conflict: "I will try to win the argument rather than resolve it. Slow me down and ask what I actually feel.",
  },
  4: {
    name: "The Individualist", core: "Identity and depth",
    blurb: "Attuned to what is missing. Finds meaning in feeling, and difference preferable to belonging.",
    fear: "Having no identity, or no significance of one's own.",
    want: "To find a self that is authentically theirs.",
    stress: "Overextends for others while resenting it; envy sharpens.",
    ease: "Becomes disciplined and productive; makes something of the feeling.",
    ask: "Do not try to cheer me up. Sit in it with me and take the feeling seriously; that is what fixes it.",
    conflict: "I will make it about what it means, not about the facts. Both matter — start with the meaning.",
  },
  5: {
    name: "The Investigator", core: "Capability through knowing",
    blurb: "Conserves energy and attention like a finite fuel. Understands from a distance before joining.",
    fear: "Being useless, depleted, or overwhelmed by demands.",
    want: "To be competent and self-sufficient.",
    stress: "Scatters and grows frantic; the hoarded knowledge stops translating into action.",
    ease: "Grows confident and decisive; acts without a complete map.",
    ask: "Give me warning and a way out. Ambush is the fastest way to lose me for the evening.",
    conflict: "I go quiet and disappear to think. It is not punishment; expect me back with an answer.",
  },
  6: {
    name: "The Loyalist", core: "Security",
    blurb: "Scans for what could go wrong, then commits hard to what survives the scan.",
    fear: "Being without support or guidance when it counts.",
    want: "Security, and something worth being loyal to.",
    stress: "Becomes competitive and image-driven; certainty is faked to cover the doubt.",
    ease: "Settles, relaxes, and trusts its own read of a situation.",
    ask: "Be consistent and tell me the plan. Surprises, even good ones, cost me more than they give.",
    conflict: "I will test whether you mean it. Answer the question underneath the question.",
  },
  7: {
    name: "The Enthusiast", core: "Options",
    blurb: "Keeps the exits open and the calendar full. Moves toward stimulation and away from pain.",
    fear: "Being trapped in deprivation or emotional pain.",
    want: "To be satisfied and free.",
    stress: "Turns perfectionistic and critical; the fun curdles into fault-finding.",
    ease: "Slows down, goes deep, becomes genuinely present.",
    ask: "Do not corner me into a single option. Give me a choice and I will choose the same thing willingly.",
    conflict: "I will joke, reframe, and change the subject. Hold the subject gently and I will come back to it.",
  },
  8: {
    name: "The Challenger", core: "Control and protection",
    blurb: "Takes up space so that no one else can take it from them. Direct to the point of impact.",
    fear: "Being controlled, harmed, or made vulnerable to someone else.",
    want: "To protect themselves and the people under their cover.",
    stress: "Withdraws and hoards; the intensity turns secretive.",
    ease: "Softens into openness and lets people see the underside.",
    ask: "Be direct. Hints and diplomacy read as manipulation to me; bluntness reads as respect.",
    conflict: "I escalate fast and let it go faster. Do not treat the volume as the end of the relationship.",
  },
  9: {
    name: "The Peacemaker", core: "Comfort and connection",
    blurb: "Merges with what is around it. Keeps the peace, sometimes at the cost of having a position.",
    fear: "Loss, separation, and being pulled apart by conflict.",
    want: "Inner stability and peace of mind.",
    stress: "Grows anxious and reactive; the calm cracks into worry.",
    ease: "Finds its own edge and acts on its own behalf.",
    ask: "Ask me directly what I want and wait through the pause. My first answer is usually yours.",
    conflict: "I go passive and agree in the room, then quietly do not. Push past the first yes.",
  },
};

/** The three centres of intelligence — where each type's core emotion sits. */
const CENTRES = {
  body: { types: [8, 9, 1], label: "Body", emotion: "anger", blurb: "Instinct first. The underlying charge is anger — expressed, forgotten, or held in." },
  heart: { types: [2, 3, 4], label: "Heart", emotion: "shame", blurb: "Image first. The underlying charge is shame about being seen as you are." },
  head: { types: [5, 6, 7], label: "Head", emotion: "fear", blurb: "Analysis first. The underlying charge is fear, met by planning, doubting, or escaping." },
};

/** Wings are the adjacent numbers on the circle — 9 and 1 are neighbours. */
const wingsOf = (t) => [t === 1 ? 9 : t - 1, t === 9 ? 1 : t + 1];

/** Stress and growth lines, the classic arrows. */
const LINES = { 1: { stress: 4, ease: 7 }, 2: { stress: 8, ease: 4 }, 3: { stress: 9, ease: 6 }, 4: { stress: 2, ease: 1 }, 5: { stress: 7, ease: 8 }, 6: { stress: 3, ease: 9 }, 7: { stress: 1, ease: 5 }, 8: { stress: 5, ease: 2 }, 9: { stress: 6, ease: 3 } };

const row = (id, scale, prompt, reverse = false) => ({ id, kind: "likert", scaleName: "true5", scale: String(scale), prompt, reverse });

const ITEMS = [
  row("e1a", 1, "There is a running commentary in my head about how things ought to be done."),
  row("e1b", 1, "An error I notice becomes hard to leave alone, even when it is not mine to fix."),
  row("e1c", 1, "I hold myself to a standard I would never impose on anyone else."),
  row("e1d", 1, "Carelessness in the world around me produces a low, constant irritation."),
  row("e1e", 1, "Doing something sloppily on purpose is a relief I let myself have often.", true),

  row("e2a", 2, "I know what the people around me need before they say it."),
  row("e2b", 2, "It is far easier for me to give help than to ask for it."),
  row("e2c", 2, "Some part of me keeps a quiet account of what I have done for people."),
  row("e2d", 2, "I would rather be needed than admired."),
  row("e2e", 2, "I have no trouble saying no when someone asks something of me.", true),

  row("e3a", 3, "I adjust how I come across depending on who is in the room."),
  row("e3b", 3, "Failing at something publicly is close to my worst outcome."),
  row("e3c", 3, "I measure a week by what I got done in it."),
  row("e3d", 3, "I want to be the one people point to as the example."),
  row("e3e", 3, "I find it easy to stop working and simply be.", true),

  row("e4a", 4, "I have never quite felt like I belong to the group I am standing in."),
  row("e4b", 4, "I am drawn to what is melancholy — it feels more honest than cheerfulness."),
  row("e4c", 4, "Something essential seems to be missing in me that other people were given."),
  row("e4d", 4, "Being ordinary is the thing I most want to avoid."),
  row("e4e", 4, "My feelings are usually mild and fairly even.", true),

  row("e5a", 5, "I keep a private reserve of time and energy that I do not let people draw on."),
  row("e5b", 5, "I would rather understand something thoroughly than take part in it."),
  row("e5c", 5, "Unexpected demands on me feel like an intrusion."),
  row("e5d", 5, "I collect knowledge partly as a defence; I do not like being caught unprepared."),
  row("e5e", 5, "I share what is going on with me freely and early.", true),

  row("e6a", 6, "I run through what could go wrong before I commit to anything."),
  row("e6b", 6, "I test people for a long time before I trust them — and then I am loyal for years."),
  row("e6c", 6, "Certainty makes me suspicious; I look for the catch."),
  row("e6d", 6, "I feel safer with a clear plan and someone reliable beside me."),
  row("e6e", 6, "I rarely second-guess a decision once it is made.", true),

  row("e7a", 7, "I keep several good options open so that I never feel trapped."),
  row("e7b", 7, "When a feeling turns heavy I instinctively reach for the next interesting thing."),
  row("e7c", 7, "Planning the trip is often better than taking it."),
  row("e7d", 7, "Boredom feels less like dullness and more like a threat."),
  row("e7e", 7, "I am comfortable sitting still with nothing at all scheduled.", true),

  row("e8a", 8, "I say the blunt thing while everyone else is deciding whether to."),
  row("e8b", 8, "I would rather be in charge than be managed by someone less competent."),
  row("e8c", 8, "I do not show weakness to people who have not earned it."),
  row("e8d", 8, "I step in when I see someone being pushed around."),
  row("e8e", 8, "I back down easily to keep things smooth.", true),

  row("e9a", 9, "I can see everyone's side so clearly that my own preference goes quiet."),
  row("e9b", 9, "I will agree to something to avoid a scene, and then quietly not do it."),
  row("e9c", 9, "Being pushed to decide quickly makes me dig in and slow down."),
  row("e9d", 9, "Comfort and routine matter to me more than people realise."),
  row("e9e", 9, "I raise disagreements as soon as I notice them.", true),
];

export { TYPES, CENTRES, LINES, wingsOf, ITEMS };
