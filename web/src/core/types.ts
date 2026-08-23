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

export type Family = "questionnaire" | "profiler";

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
export type MultiItem = ItemBase & { kind: "multi"; options: Option[]; max?: number };
export type Item = LikertItem | ChoiceItem | MultiItem;

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
};
export type FieldsForm = { kind: "fields"; fields: Field[]; note?: string };
export type Form = ItemsForm | FieldsForm;

export type Answers = Record<string, string | number | string[] | undefined>;

export type InstructionCard = { channel: Channel; title: string; body: string };

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
