/**
 * Five reasons somebody opens this, and a route through the catalogue for each.
 *
 * Twenty-four instruments is a good catalogue and a bad first screen. The
 * question a reader arrives with is never "which of these twenty-four" — it is
 * "I am seeing somebody new", or "my team keeps misreading me", or "I want to
 * understand myself", and the catalogue answers none of those. A track is that
 * question, answered as an order.
 *
 * ── What a track is not ───────────────────────────────────────────────
 *
 * Not a filter. Every instrument stays reachable from the catalogue, and a
 * track that hid things would be making a decision it has no standing to make.
 *
 * Not a course. There is no completion, no percentage and no next-step nagging.
 * Somebody who takes the first two and stops has got what they came for, and an
 * app that treats that as an abandoned funnel is optimising for itself.
 *
 * Not a claim. Ordering four instruments is a claim about *reading order*, not
 * about validity. `dating` puts attachment first because it is the one whose
 * vocabulary makes the other three legible, not because it predicts anything
 * about a stranger.
 *
 * ── The one rule the orders follow ────────────────────────────────────
 *
 * Ascending cost, where cost is what answering honestly asks of you rather than
 * how long it takes. `communication-style` asks how you want bad news
 * delivered; `boundaries` asks what happens when your mother arrives
 * unannounced; `money-management` asks whether you have debts nobody knows
 * about. A reader who meets the third question first closes the tab, and they
 * are right to.
 */
import type { Preset } from "./profiles";

export const TRACKS = ["self", "dating", "couple", "work", "statement"] as const;
export type TrackId = (typeof TRACKS)[number];

export type Track = {
  id: TrackId;
  glyph: string;
  /** Instrument ids, in the order they are worth taking. */
  steps: readonly string[];
  /**
   * Where the track lands, for the two that produce something to hand over.
   *
   * `self` and `couple` have no preset on purpose. What `self` produces is an
   * instruction sheet for the person who wrote it, and offering a link at the
   * end would answer a question nobody asked. `couple` produces a conversation,
   * and the thing to do with it is have the conversation.
   */
  preset?: Preset;
};

/**
 * Order matters more than membership here, so each is written out rather than
 * derived from channels. A generated list would put `faith` in the work track
 * the day somebody added a `work` channel to it, and nothing would notice.
 */
export const TRACK_LIST: readonly Track[] = [
  {
    id: "self",
    glyph: "☐",
    // Attachment first because it is the one people recognise themselves in
    // fastest, and recognition is what makes somebody answer the next forty
    // items honestly. Big Five second because it is the one with real evidence
    // behind it, and it reads better once there is something to compare it to.
    steps: ["attachment", "big-five", "jungian", "chronotype", "good-life"],
  },
  {
    id: "dating",
    glyph: "◑",
    // For working out who you are actually sitting across from. Ends at
    // before-marriage rather than starting there: fifteen positions on
    // commitment is the wrong second date and the right eighth.
    steps: ["attachment", "communication-style", "conflict-style", "love-languages", "before-marriage"],
    preset: "partner",
  },
  {
    id: "couple",
    glyph: "⧉",
    // Conversations first, always: it is the only one that reports what the two
    // of you have never discussed, and it is the map for everything under it.
    // Money before family, because a disagreement about money is survivable and
    // one about children is the end of the conversation.
    steps: ["couple-conversations", "boundaries", "digital-life", "money-management", "family-plan"],
  },
  {
    id: "work",
    glyph: "⚒",
    // The only track whose first instrument is shareable with no ceiling, which
    // is what makes it the one to open with: something usable exists after one
    // sitting.
    steps: ["communication-style", "working-style", "conflict-style", "riasec", "study-practice"],
    preset: "team",
  },
  {
    id: "statement",
    glyph: "◈",
    // Three, deliberately. A public page assembled from five instruments is a
    // dossier; from three it is a introduction. Every one of them is something
    // the reader chose to say rather than something measured about them.
    steps: ["communication-style", "boundaries", "good-life"],
    preset: "public",
  },
] as const;

export const trackById = (id: string): Track | null => TRACK_LIST.find((track) => track.id === id) ?? null;

/** How far through a track somebody is. A count, never a percentage. */
export function progressOf(track: Track, taken: ReadonlySet<string>): { done: number; total: number; next: string | null } {
  const done = track.steps.filter((step) => taken.has(step)).length;
  // The next one they have not taken, in the track's own order — not the next
  // index, which would send somebody who skipped step two back to it forever.
  const next = track.steps.find((step) => !taken.has(step)) ?? null;
  return { done, total: track.steps.length, next };
}

/**
 * Every instrument a track names must exist.
 *
 * Called by a test rather than at import: a broken track is a bad link, not a
 * reason to refuse to start the app. But it is a bad link that would sit there
 * unnoticed, because nothing else in the app reads this file.
 */
export function unknownSteps(known: ReadonlySet<string>): { track: TrackId; step: string }[] {
  const missing: { track: TrackId; step: string }[] = [];
  for (const track of TRACK_LIST) {
    for (const step of track.steps) if (!known.has(step)) missing.push({ track: track.id, step });
  }
  return missing;
}
