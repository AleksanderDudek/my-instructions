/**
 * The plugin contract, typed.
 *
 * One difference from the vanilla app, and it is the whole reason the rewrite
 * is worth doing: `view` is gone from the spec. A spec is now pure data and
 * pure functions — it computes, it never renders — and the React component
 * that draws a result lives beside it in `View.tsx`. That split is what makes
 * an instrument testable without a DOM and renderable on a server.
 */

export const LOCALES = ["en", "pl", "es", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const CHANNELS = ["communication", "affection", "work", "conflict", "energy", "rhythm"] as const;
export type Channel = (typeof CHANNELS)[number];

/**
 * What kind of thing an instrument is — and the reason there are three.
 *
 * A questionnaire and a profiler both *estimate* something about a person from
 * behind an item bank with no norms, and every line of their copy is hedged
 * accordingly. An `inventory` estimates nothing: it records a position the
 * person states, the weight they put on it, and the reason they give. Nothing
 * is inferred, so nothing has to be defended — and nothing may be scored to
 * 1..100 either, because a number attached to a stated position would import
 * exactly the false precision the rest of the app spends its copy apologising
 * for.
 *
 * That difference is a flag here rather than a habit, because the catalogue,
 * the result page, the sheet and the registry all treat stated and scored
 * content differently, and one flag in the right place is cheaper than
 * remembering the difference in six places.
 */
export type Family = "questionnaire" | "profiler" | "inventory";

/**
 * Free or paid, declared by the instrument itself.
 *
 * Present from the first commit of the rewrite rather than added later.
 * Retrofitting a paywall means finding every place a result can be reached —
 * the runner, the result page, the shared report, the printed sheet, the
 * comparison — and each one missed is a way to read a paid result for nothing.
 * Declaring it on the spec means there is one list to enforce against.
 */
export type Tier = "free" | "premium";

/** Translate: a key and its interpolations, resolved in the reader's language. */
export type T = (key: string, vars?: Record<string, string | number>) => string;

export type Option = { value: string; label: string };

export type ItemTier = "shared" | "private";

type ItemBase = { id: string; prompt: string; tier?: ItemTier; section?: string; group?: string };
export type LikertItem = ItemBase & { kind: "likert"; scale: string; reverse?: boolean };
export type ChoiceItem = ItemBase & { kind: "choice"; options: Option[] };
/**
 * Tick as many as apply — including the one that means none of them.
 *
 * Every option set in this app is required to carry an honest escape: "none of
 * these", "I have not thought about it", "it touches none of my money". In a
 * `choice` that escape clears the others for free, because picking one is
 * picking one. In a `multi` nothing clears anything, so without a declaration
 * here a reader ticks "Nothing at the moment" beside "Two or three hours a week
 * of training" and the contradiction is stored, scored, and printed back at
 * them as a position they stated. Writing the label to read as terminal is a
 * mitigation; naming the option is the fix.
 *
 * `exclusive` names option values that cannot coexist with any other. Ticking
 * one replaces the selection; ticking anything else drops them. `max` caps the
 * ordinary picks and has no authority over an escape — a reader who has spent
 * every pick and then decides none of them are true must still be able to say
 * so, which is the same argument that stops a limit disabling a box you already
 * ticked.
 */
export type MultiItem = ItemBase & {
  kind: "multi";
  options: Option[];
  max?: number;
  /** Option values that cannot be held together with any other. */
  exclusive?: string[];
};

/**
 * A number on a labelled continuum, with words only at the ends.
 *
 * Deliberately *not* a Likert item with more points. A Likert point is a
 * verbal anchor — "Rarely me", "Often me" — and the whole scale machinery in
 * `core/scoring.ts` exists to keep those anchors dividing the range identically
 * in four languages. Rendering a rating through `scaleFor` would demand ten
 * translated anchors per locale that nobody would read, and it would let a
 * rating be reverse-keyed and summed into a scale score, which is precisely
 * what must never happen to a weight somebody assigned to their own position.
 */
export type RatingItem = ItemBase & {
  kind: "rating";
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
};

/**
 * Free text, which never blocks progress — see the runner.
 *
 * "I would rather not explain" is a real answer, and a form that will not
 * advance until a reason is typed collects reasons that were typed to advance
 * the form. The item kind carries that rule rather than each instrument
 * remembering it.
 */
export type TextItem = ItemBase & { kind: "text"; placeholder?: string; rows?: number };

export type Item = LikertItem | ChoiceItem | MultiItem | RatingItem | TextItem;

export type ScaleDef = { name: string; min: number; max: number; short: string[]; labels: string[] };

export type FieldKind = "date" | "time" | "text" | "number" | "select" | "multi";
export type Field = {
  id: string;
  kind: FieldKind;
  label: string;
  value?: string | number;
  options?: Option[];
  min?: number;
  max?: number;
  placeholder?: string;
  optional?: boolean;
  hint?: string;
};

export type ItemsForm = {
  kind: "items";
  items: Item[];
  scale?: ScaleDef;
  shuffle?: boolean;
  optional?: boolean;
  pageSize?: number;
  /**
   * Break pages where `group` changes rather than every `pageSize` items.
   *
   * A stance block is one question, one weight and one reason, and splitting it
   * across a page break asks somebody to rate the importance of a question that
   * scrolled off the screen. With this set, `pageSize` becomes a soft ceiling:
   * a group is never split to honour it.
   */
  pageBy?: "group";
};
export type FieldsForm = { kind: "fields"; fields: Field[]; note?: string };
export type Form = ItemsForm | FieldsForm;

export type Answers = Record<string, string | number | string[] | undefined>;

export type InstructionCard = { channel: Channel; title: string; body: string };

/**
 * One line the reader might endorse — or might not.
 *
 * A suggestion is a complete, second-person, actionable sentence: something
 * that could be handed to another human unedited. Not "consider my need for
 * space" but "give me an hour before we finish the conversation". The Barnum
 * test applies — a line that could not plausibly be false of somebody is not
 * worth offering, because ticking it tells the reader nothing about themselves
 * and tells the person holding the sheet nothing about them either.
 *
 * The id is what gets stored; the text is regenerated from the result in
 * whatever language the reader is in today.
 */
export type PlaybookSuggestion = { id: string; text: string };
export type Playbook = { ok: PlaybookSuggestion[]; notOk: PlaybookSuggestion[] };

export type MessageLoader = () => Promise<{ default: Record<string, string> }>;

export interface InstrumentSpec<R = unknown> {
  id: string;
  version: number;
  family: Family;
  glyph: string;
  minutes: number;
  channels: Channel[];
  tier: Tier;

  /** Behind the age confirmation on the catalogue. */
  adult?: boolean;
  /** The result is nobody's business by default; caps what sharing may offer. */
  sensitive?: boolean;
  /** "session" keeps a run in memory and nowhere else. */
  persistence?: "session";
  maxAudience?: Audience;
  /** Answered twice in one tab and compared in memory. */
  pairwise?: boolean;

  messages: Record<Locale, MessageLoader>;
  form(t: T, locale?: Locale): Form;
  score(answers: Answers): R;
  instructions(result: R, t: T): InstructionCard[];
  validate?(values: Answers, t: T): Record<string, string>;
  compare?(a: R, b: R, opts?: unknown): unknown;
  pairScore?(a: R, b: R): unknown;

  /**
   * Suggested "this is fine" and "this is not" lines, derived from the result.
   *
   * Derived, not fixed: somebody who scored high on avoidance is offered
   * different sentences from somebody who did not, and the whole value of the
   * feature is that the reader recognises a sentence rather than composing one
   * from nothing. What they tick, and what they add themselves, is theirs and
   * is stored separately from the run.
   */
  playbook?(result: R, t: T): Playbook;
}

export type Audience = "private" | "partner" | "friends" | "public";

export type Run<R = unknown> = {
  instrumentId: string;
  instrumentVersion: number;
  answers: Answers;
  result: R;
  visibility?: Audience;
  completedAt: string;
  firstCompletedAt?: string;
  session?: boolean;
  slot?: string | null;
};
