/**
 * Every question, with its options. Ids are stored, so they never change.
 *
 * The five added in version 2 are the ones a colleague cannot guess and would
 * otherwise learn by getting them wrong: how to hand you something, what
 * actually changes your mind, what to do after a clash, and where an objection
 * belongs. They are preferences in the same register as the rest — a fact about
 * how you would like to be treated, with no claimed benefit attached. Stating a
 * format preference does not predict better outcomes from that format, and this
 * folder does not imply that it does.
 *
 * Nothing here is a word. Every option id below is resolved against `i18n/` at
 * render time, so a sheet filled in Polish means the same thing read in German.
 */

export type FieldDef = { readonly id: string; readonly options: readonly string[] };
export type MultiDef = FieldDef & { readonly max: number };

const FIELDS = [
  { id: "interruption", options: ["protected", "mixed", "open"] },
  { id: "feedback", options: ["blunt", "direct", "cushioned"] },
  { id: "notice", options: ["none", "day", "week"] },
  { id: "meetings", options: ["few", "some", "many"] },
  { id: "mode", options: ["async", "mixed", "sync"] },
  { id: "decisions", options: ["fast", "gather", "consensus"] },
  { id: "brief", options: ["headline", "context", "written"] },
  { id: "prep", options: ["document", "agenda", "cold"] },
  { id: "evidence", options: ["number", "example", "user", "dissenter"] },
  { id: "repair", options: ["now", "hour", "explicit"] },
  { id: "dissent", options: ["meeting", "writing", "oneToOne"] },
] as const satisfies readonly FieldDef[];

/** Multi-select questions: several answers are a real answer here. */
const MULTI = [
  { id: "peak", options: ["earlyMorning", "morning", "afternoon", "evening", "night"], max: 2 },
  { id: "environment", options: ["silence", "quiet", "music", "bustle", "people"], max: 2 },
] as const satisfies readonly MultiDef[];

export type FieldId = (typeof FIELDS)[number]["id"];
export type MultiId = (typeof MULTI)[number]["id"];

/**
 * The comparison is the point. Two people's preferences do not average — they
 * collide on specific questions, and naming which ones is worth more than any
 * overall similarity figure. So the pairs below are the ends that actually
 * clash; anything adjacent is a difference, not a collision.
 */
const OPPOSED: Record<FieldId, readonly [string, string]> = {
  interruption: ["protected", "open"],
  feedback: ["blunt", "cushioned"],
  notice: ["none", "week"],
  meetings: ["few", "many"],
  mode: ["async", "sync"],
  decisions: ["fast", "consensus"],
  brief: ["headline", "written"],
  prep: ["document", "cold"],
  evidence: ["number", "user"],
  repair: ["now", "explicit"],
  dissent: ["meeting", "oneToOne"],
};

export { FIELDS, MULTI, OPPOSED };
