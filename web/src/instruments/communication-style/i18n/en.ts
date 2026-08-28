/**
 * Communication style — English, and the source of truth for the other three.
 *
 * Every word the reader sees comes from here. The bank in
 * `docs/banks/communication-style.json` is where these sentences were written
 * and critiqued; this file is that bank keyed the way `core/stance.ts` looks
 * words up, so a prompt has exactly one home and the two cannot drift.
 *
 * The `sourceNote` is load-bearing rather than boilerplate. The catalogue
 * promises the four-colour vocabulary, and this instrument declines to compute
 * a colour — so the note is where that promise is met honestly: it names the
 * lineage, names the products it takes nothing from, and says in the reader's
 * own copy that no colour is put on them at the end.
 *
 * Item bank © the author, all rights reserved. See LICENSE.
 */
export default {
  "title": "Communication style",
  "tagline": "Twelve requests about how you want to be addressed, each with the weight you put on it.",
  "framework": "Twelve stated requests — no type, no colour",
  "sourceNote": "The four-colour vocabulary is a great deal older than any of the products sold under it. The four-temperament scheme descends from Galen, the function pairs are Jung's, and the two axes usually drawn underneath — how fast and how hard a person pushes, and whether they attend first to the task or to the people in the room — are published openly and belong to nobody. What does belong to somebody is every commercial version: Insights Discovery and its wheel are The Insights Group's, DiSC is John Wiley & Sons', SOCIAL STYLE is TRACOM's, True Colors is True Colors International's, and not one item, adjective, colour name or report page from any of them appears here or was worked backwards from. Every question below was written for this app. It is worth being exact about what that leaves, because the colours are the reason you are reading this note and they are not in the instrument: nothing you answer is tallied, you are not placed on either axis, and no colour is put on you at the end. Twelve questions are asked and the answers are handed back arranged. What comes out is not a type and not a measurement — it is a record of how you have asked to be addressed, and a request needs no evidence behind it. Which is as well, because there is none: no independent peer-reviewed finding shows that addressing someone in their stated preferred style improves anything, and the nearest properly designed literature, on matching teaching to stated learning preference, found the effect absent once it was tested for. The answers are worth having anyway. They are a request rather than a prediction, and the person reading them can act on a request without having to believe a theory.",

  /* ── the four sections ─────────────────────────────────────────── */
  "section.reaching.title": "Getting hold of me",
  "section.reaching.note": "The mechanics of contact: how a conversation opens, whether it can be interrupted, and what to do when it stops. None of it is about what you say. All of it is about how you arrive.",
  "section.hard.title": "When something is wrong",
  "section.hard.note": "The order bad news should arrive in, how finished a problem has to be before you want to hear about it, and what an apology has to contain before it counts.",
  "section.friction.title": "When we are at odds",
  "section.friction.note": "Being corrected, being told someone is angry with you, and what it takes for you to let an argument go. Three things usually settled in the moment by whoever moves first.",
  "section.reading.title": "Reading me",
  "section.reading.note": "What your silence means, how you want to be asked, and where praise has to land. Three blanks the other person has to fill in for themselves if you have not said.",

  /* ── the twelve questions ──────────────────────────────────────── */
  "stance.small-talk.prompt": "How much small talk before someone gets to the point?",
  "stance.interrupting.prompt": "When may someone interrupt you mid-sentence?",
  "stance.no-reply.prompt": "What should someone do if you have not replied in two days?",
  "stance.bad-news.prompt": "How should someone give you bad news?",
  "stance.unfinished.prompt": "When should someone tell you about an unsolved problem?",
  "stance.apology.prompt": "How should someone apologise to you?",
  "stance.public-correction.prompt": "How should someone correct you in front of others?",
  "stance.upset-with-me.prompt": "How should someone tell you they are upset with you?",
  "stance.drop-it.prompt": "What do you need before you drop a disagreement?",
  "stance.going-quiet.prompt": "You go quiet mid-conversation. What is happening?",
  "stance.asked-if-wrong.prompt": "How should someone ask whether something is wrong?",
  "stance.praise.prompt": "How should someone tell you that you did well?",

  /* ── what may be answered ──────────────────────────────────────── */
  /* small-talk */
  "stance.small-talk.opt.none": "Straight to the point, no preamble",
  "stance.small-talk.opt.aLine": "A line of greeting, then the point",
  "stance.small-talk.opt.fewMinutes": "A few minutes of ordinary talk first",
  "stance.small-talk.opt.depends": "It depends who it is",
  /* interrupting */
  "stance.interrupting.opt.anyTime": "Any time — I do not lose my place",
  "stance.interrupting.opt.toBuild": "Only to add to the point",
  "stance.interrupting.opt.askFirst": "Only after they say my name",
  "stance.interrupting.opt.wait": "Not until I have finished",
  "stance.interrupting.opt.depends": "It depends on the subject",
  /* no-reply */
  "stance.no-reply.opt.nudge": "Send it again — I have lost it",
  "stance.no-reply.opt.call": "Ring me instead",
  "stance.no-reply.opt.escalate": "Say it is urgent, if it is",
  "stance.no-reply.opt.wait": "Wait — I will get to it",
  "stance.no-reply.opt.assumeNo": "Take the silence as a no",
  "stance.no-reply.opt.depends": "It depends who is asking",
  /* bad-news */
  "stance.bad-news.opt.firstSentence": "The worst part in the first sentence",
  "stance.bad-news.opt.shortWarning": "A short warning, then the worst part",
  "stance.bad-news.opt.contextFirst": "The background first, the worst last",
  "stance.bad-news.opt.writtenFirst": "In writing, so I read it alone",
  "stance.bad-news.opt.depends": "It depends what the news is",
  /* unfinished */
  "stance.unfinished.opt.atOnce": "The moment anyone suspects it",
  "stance.unfinished.opt.onceReal": "Once someone is sure it is real",
  "stance.unfinished.opt.withOptions": "Once there is at least one option",
  "stance.unfinished.opt.onceStuck": "Only when it cannot be fixed without me",
  "stance.unfinished.opt.depends": "It depends how big it is",
  /* apology */
  "stance.apology.opt.named": "By naming exactly what they did",
  "stance.apology.opt.said": "Once, plainly, then let it go",
  "stance.apology.opt.changed": "By saying what changes now",
  "stance.apology.opt.shown": "By doing something about it",
  "stance.apology.opt.later": "Not at once — give me a day",
  "stance.apology.opt.depends": "It depends what they did",
  /* public-correction */
  "stance.public-correction.opt.onTheSpot": "Out loud, straight away",
  "stance.public-correction.opt.withReason": "Out loud, with the reason",
  "stance.public-correction.opt.afterwards": "Not there — afterwards, in private",
  "stance.public-correction.opt.signal": "A signal now, the detail later",
  "stance.public-correction.opt.depends": "It depends how much it matters",
  /* upset-with-me */
  "stance.upset-with-me.opt.named": "Said outright, in the first sentence",
  "stance.upset-with-me.opt.atOnce": "In the moment, before it cools",
  "stance.upset-with-me.opt.nextDay": "The next day, once it has cooled",
  "stance.upset-with-me.opt.inWriting": "In writing, so I can read it twice",
  "stance.upset-with-me.opt.askFirst": "By asking if now is a good time",
  "stance.upset-with-me.opt.depends": "It depends what it is about",
  /* drop-it */
  "stance.drop-it.opt.heard": "To have said the whole thing once",
  "stance.drop-it.opt.reason": "The reasoning, not just the decision",
  "stance.drop-it.opt.decided": "Someone to say plainly it is decided",
  "stance.drop-it.opt.revisit": "A date to look at it again",
  "stance.drop-it.opt.time": "An hour alone, then nothing",
  "stance.drop-it.opt.unsure": "I do not know what settles it",
  /* going-quiet */
  "stance.going-quiet.opt.thinking": "I am working out what I think",
  "stance.going-quiet.opt.tooMuch": "It is more than I can take at once",
  "stance.going-quiet.opt.upset": "I am upset and not ready to say it",
  "stance.going-quiet.opt.finished": "I have said what I had to say",
  "stance.going-quiet.opt.yourTurn": "I am waiting for the other person",
  "stance.going-quiet.opt.varies": "It varies — ask me",
  /* asked-if-wrong */
  "stance.asked-if-wrong.opt.straight": "Straight out, in the moment",
  "stance.asked-if-wrong.opt.named": "By naming what they noticed",
  "stance.asked-if-wrong.opt.later": "Later on, once only",
  "stance.asked-if-wrong.opt.alongside": "Alongside something else, like a walk",
  "stance.asked-if-wrong.opt.notAtAll": "Not at all — I will raise it",
  /* praise */
  "stance.praise.opt.public": "Out loud, in front of other people",
  "stance.praise.opt.private": "Quietly, one to one",
  "stance.praise.opt.written": "In writing, so I can keep it",
  "stance.praise.opt.passedOn": "Passed to whoever it matters to",
  "stance.praise.opt.lightly": "Briefly — do not make a thing of it",
  "stance.praise.opt.unsure": "I have not thought about it",

  /* ── the playbook ──────────────────────────────────────────────────
     Second person, complete, handable to somebody unedited. The id is what a
     reader's tick is stored against, so it is the bank's id unchanged. */
  /* this is fine */
  "playbook.ok.talk.straight": "Open with what you need. One line of hello is plenty, and a missing one is not rudeness to me.",
  "playbook.ok.talk.warmup": "Spend a few minutes on ordinary talk before the ask. That is the way in, not a delay.",
  "playbook.ok.talk.ask": "Ask me whether this is a conversation to warm up first. It changes with who is asking and I will tell you.",
  "playbook.ok.cutin.add": "Cut in the moment you have something to add. I do not lose my thread and I would rather have your half now.",
  "playbook.ok.cutin.name": "Say my name and then cut in. One word hands the conversation over without dropping it.",
  "playbook.ok.quiet.again": "Send it again if two days go by. A second message is not nagging, it is usually the thing that gets it done.",
  "playbook.ok.quiet.ring": "Ring me, or say plainly that it is urgent. I will not spot urgency in a message that looks like the others.",
  "playbook.ok.quiet.silence": "If two days pass with nothing, read it as a no. It is not an oversight and asking again will not move it.",
  "playbook.ok.news.worst": "Lead with the worst part, one line of warning at most. The build-up is the part I actually find hard.",
  "playbook.ok.news.context": "Give me the background before the worst part. Arriving at it is easier for me than being met with it.",
  "playbook.ok.news.written": "Put bad news in writing and let me read it on my own. I will come and find you once I have.",
  "playbook.ok.problem.early": "Tell me about a problem before it is solved. Half a picture on Tuesday is worth more to me than a whole one on Friday.",
  "playbook.ok.problem.option": "Bring the problem with one possible answer attached. I am much better at choosing than at being handed it raw.",
  "playbook.ok.problem.first": "Fix what you can fix and tell me afterwards. Bring me the ones that genuinely cannot be done without me.",
  "playbook.ok.sorry.name": "When you apologise, say what you did. Naming the thing is the part that lands with me.",
  "playbook.ok.sorry.after": "Tell me what will be different, or just do it. What comes after an apology counts for more with me than the apology.",
  "playbook.ok.sorry.once": "Say it once, plainly, and then let it go. One apology is enough and I would rather we both put it down.",
  "playbook.ok.correct.room": "Correct me in front of people if I have it wrong. It costs me nothing and it saves the second conversation.",
  "playbook.ok.correct.why": "Correct me in the room as long as you say why. A bare contradiction is the only part I will argue with.",
  "playbook.ok.correct.signal": "Catch my eye rather than saying it out loud. A signal now and the detail afterwards is all I need.",
  "playbook.ok.angry.plain": "Tell me you are annoyed in the first sentence, while it is still live. I will not get there from your tone.",
  "playbook.ok.angry.write": "Write it down and send it. I read a hard thing twice and I answer the second reading much better.",
  "playbook.ok.angry.ask": "Ask whether now is a good time before you start. Being asked is the part that lets me listen to the rest.",
  "playbook.ok.drop.said": "Let me make the whole argument once without interruption. Having said it I can put it down.",
  "playbook.ok.drop.reason": "Give me the reasoning and not only the decision. With the reasoning I stop, and without it I keep pulling.",
  "playbook.ok.drop.hour": "Give me an hour on my own and then leave it there. I do not need it resolved, I need it quiet.",
  "playbook.ok.pause.think": "Let my pauses run. I am composing an answer rather than withholding one.",
  "playbook.ok.pause.done": "When I stop, I have finished. The silence is your turn rather than a gap you have to fill.",
  "playbook.ok.pause.ask": "If I go quiet, ask me what the silence is. It is not the same thing twice.",
  "playbook.ok.ask.named": "Ask me straight out and say what you noticed. «Are you all right» only ever gets a reflex out of me.",
  "playbook.ok.ask.walk": "Ask me while we are doing something else. Side by side I will say things I cannot say across a table.",
  "playbook.ok.ask.later": "Ask me later, and only once. If I say it is nothing, take that, and I will come back when it is not.",
  "playbook.ok.praise.public": "Say it in front of the others. Public credit lands differently for me, whatever my face is doing at the time.",
  "playbook.ok.praise.quiet": "Say it quietly and keep it short. A word on the way out is worth more to me than an announcement.",
  "playbook.ok.praise.write": "Put it in writing, even one line. I keep those and read them again in a bad week.",
  "playbook.ok.praise.pass": "Tell whoever it matters to rather than telling me. That is the version of it I can actually use.",
  /* this is not */
  "playbook.no.talk.warmup": "Do not warm me up for five minutes. I am not being cold, I am waiting for the actual sentence.",
  "playbook.no.talk.cold": "Do not open with the ask. Cold-opened, the same question gets my worst answer.",
  "playbook.no.cutin.across": "Do not cut in with no warning. If you take the thread without one I lose it and we start the point again.",
  "playbook.no.cutin.hold": "Do not sit on something until I stop talking. I would much rather be interrupted than told it afterwards.",
  "playbook.no.quiet.chase": "Do not chase me after two days. A second message makes it less likely I answer rather than more.",
  "playbook.no.quiet.assume": "Do not read my silence as a no. If you have not heard from me the thing is still open.",
  "playbook.no.news.buildup": "Do not build up to it. Once I can tell something bad is coming I stop listening and start bracing.",
  "playbook.no.news.headline": "Do not open with the headline. Cold, in one sentence, is the version of bad news I take worst.",
  "playbook.no.news.room": "Do not tell me in the room. Send it first and let me read it before we talk about it.",
  "playbook.no.problem.rumour": "Do not bring me a rumour. Wait until you know what is actually true and then tell me all of it in one go.",
  "playbook.no.problem.late": "Do not sit on a problem until it is certain. I would rather hear it early and be wrong than late and right.",
  "playbook.no.sorry.word": "Do not leave it at the word. «Sorry» with nothing attached to it gives me nothing to put down.",
  "playbook.no.sorry.now": "Do not apologise in the first ten minutes. Give it a day and I can actually take it.",
  "playbook.no.correct.public": "Do not correct me out loud in front of other people. Tell me afterwards and I will fix it in the next sentence.",
  "playbook.no.correct.aloud": "Do not say it out loud in the room. A look now is enough and the rest can wait until we are alone.",
  "playbook.no.correct.later": "Do not save it for afterwards. A correction in private later means I said the wrong thing twice.",
  "playbook.no.angry.hint": "Do not hint. If you are annoyed and do not say so, I will either miss it entirely or invent a worse reason.",
  "playbook.no.angry.hot": "Do not raise it while it is still hot. Cornered in the moment I defend myself instead of listening to you.",
  "playbook.no.angry.spot": "Do not do it out loud on the spot. I answer a hard thing far better on the second reading than in the room.",
  "playbook.no.drop.open": "Do not leave it ambiguous. Say plainly that it is settled and I will stop pushing at it.",
  "playbook.no.drop.closed": "Do not tell me it is closed. Tell me when we look at it again and I will genuinely leave it alone until then.",
  "playbook.no.pause.fill": "Do not talk into my silence. If I have gone quiet there is already more in the room than I can answer.",
  "playbook.no.pause.read": "Do not read my quiet as sulking. Ask me what the silence is rather than deciding for yourself.",
  "playbook.no.ask.twice": "Do not ask me twice whether something is wrong. I will bring it when I have the words, and asking again moves that further off.",
  "playbook.no.ask.leave": "Do not decide to leave me alone with it. I would far rather be asked badly than not asked.",
  "playbook.no.praise.public": "Do not praise me in front of a room. In public I spend the whole thing managing my face.",
  "playbook.no.praise.quiet": "Do not save it for a quiet word. Said where other people can hear it, the same sentence counts for more.",
  "playbook.no.praise.tome": "Do not stop at telling me. It counts once the person it actually matters to has heard it.",

  /* ── the instruction sheet ─────────────────────────────────────
     Six headings, on the two channels the spec declares. Not the four
     sections: those are the order the questions are asked in, and a card is
     what somebody looks up in the middle of an argument. */
  "card.reaching": "Getting hold of me",
  "card.bad-news": "Bad news and unfinished problems",
  "card.quiet": "When I go quiet, and how to ask",
  "card.praise": "Praise",
  "card.correction": "Correcting me, and telling me you are upset",
  "card.repair": "What I need before I drop it, and how to apologise",
};
