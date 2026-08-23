/**
 * Audience-scoped reports.
 *
 * The rule the whole feature rests on is that **withheld content is absent
 * from the link rather than hidden by the page that renders it**. A token that
 * carried everything and left the filtering to the viewer would be a UI
 * convention, not a permission — anyone could decode it and read what was
 * withheld. So each audience gets a token built from only its own elements,
 * and private content never leaves the browser at all.
 *
 * Answers pack to one character per item. A six-instrument report written as
 * `{"w1":4,"w2":3,…}` is several kilobytes of URL, which chat clients truncate
 * and mail clients wrap; the same answers in item order are a few hundred
 * bytes. The item order comes from the instrument itself, so the receiver
 * reconstructs the keys from their own copy rather than being told them.
 */
import { AUDIENCE_ORDER, atLeast } from "./audience";
import type { Answers, Audience, InstrumentSpec, Item, T } from "./types";
import type { Registry } from "./registry";
import type { Profile, Sharing } from "./store";

export const VERSION = 2;

/** Narrowest first. An element is visible to its own audience and wider ones. */
export const AUDIENCES = AUDIENCE_ORDER;
export { atLeast };

/** Every element id a report for `audience` may contain. */
export function elementsFor(sharing: Sharing | undefined, audience: Audience): string[] {
  return Object.entries(sharing ?? {})
    .filter(([, level]) => atLeast(level, audience))
    .map(([id]) => id);
}

const toB64Url = (s: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(s)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromB64Url = (s: string) =>
  new TextDecoder().decode(
    Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)),
  );

const itemsOf = (spec: InstrumentSpec): Item[] | null => {
  const form = spec.form((key) => key, "en");
  return form.kind === "items" ? form.items : null;
};

/**
 * Item ids the instrument has marked as never leaving the device.
 *
 * Enforced here rather than left to each instrument, because "remember to
 * strip these" is a rule that holds until somebody adds a code path. Packing
 * writes a blank in their position, so the item order — which is what makes
 * the compact format work — is unchanged.
 */
export const privateIdsOf = (spec: InstrumentSpec): Set<string> =>
  new Set((itemsOf(spec) ?? []).filter((item) => item.tier === "private").map((item) => item.id));

/** An unanswered item, so a gap round-trips as a gap rather than as a guess. */
const BLANK = "-";

/**
 * Whether an instrument's answers fit the one-character-per-item format.
 *
 * The packing assumes every answer is a single character, which is true of a
 * Likert point and false of a choice whose value is a word. A `choice` still
 * packs if its options are indexable in one digit — the index is stable
 * because it comes from the instrument's own option order — and a `multi` does
 * not pack at all, because one item holds several answers.
 *
 * When anything in the bank fails that test the whole instrument falls back to
 * JSON. A partly packed string would misalign every item after the first wide
 * one, which is the kind of bug that produces a plausible wrong result rather
 * than an error — and it shipped once already, before this check existed.
 */
const packable = (item: Item) =>
  item.kind === "likert" || (item.kind === "choice" && (item.options?.length ?? 0) <= 10);

const codecFor = (spec: InstrumentSpec): Item[] | null => {
  const items = itemsOf(spec);
  if (!items || !items.every(packable)) return null;
  return items;
};

/**
 * Likert answers as one character each, in the instrument's own item order.
 * A profiler has no items — dates and names do not pack — so its answers stay
 * JSON, which is the honest fallback rather than a clever one.
 */
export function packAnswers(spec: InstrumentSpec, answers: Answers): string {
  const withheld = privateIdsOf(spec);
  const items = codecFor(spec);
  if (!items) {
    // The wide path still has to honour the private tier.
    return JSON.stringify(Object.fromEntries(Object.entries(answers).filter(([id]) => !withheld.has(id))));
  }

  return items
    .map((item) => {
      if (withheld.has(item.id) || answers[item.id] == null) return BLANK;
      if (item.kind === "likert") return String(answers[item.id]);
      const index = item.kind === "choice" ? item.options.findIndex((o) => o.value === answers[item.id]) : -1;
      return index < 0 ? BLANK : String(index);
    })
    .join("");
}

export function unpackAnswers(spec: InstrumentSpec, packed: string): Answers {
  const items = codecFor(spec);
  if (!items) return JSON.parse(packed) as Answers;
  const out: Answers = {};
  items.forEach((item, i) => {
    const ch = packed[i];
    if (!ch || ch === BLANK) return;
    const value = item.kind === "likert" ? Number(ch) : item.kind === "choice" ? item.options[Number(ch)]?.value : undefined;
    if (value !== undefined) out[item.id] = value;
  });
  return out;
}

/** Days since the epoch — all the precision an expiry needs, and small. */
const today = (now: number) => Math.floor(now / 86400000);

export type EncodeArgs = {
  registry: Pick<Registry, "get">;
  profile?: Partial<Profile>;
  runs?: { instrumentId: string; instrumentVersion: number; answers: Answers }[];
  sharing?: Sharing;
  audience?: Audience;
  expiresInDays?: number | null;
  now?: number | null;
};

/**
 * A note on what expiry is and is not.
 *
 * A link that carries its own data cannot be revoked. There is no server to
 * ask, and the bytes are in the other person's hands the moment they open it —
 * anyone who saved the URL, or the page, holds a copy no subsequent action
 * here can reach. Expiry makes the app refuse to render an old link, which
 * stops a forwarded link working in six months and does not stop a determined
 * reader who kept it.
 *
 * That is worth having and worth saying, so the copy says it. Promising
 * revocation for a self-contained token would be a security claim that is
 * worse than no claim at all.
 */
export function encodeReport({
  registry,
  profile = {},
  runs = [],
  sharing = {},
  audience = "public",
  expiresInDays = null,
  now = null,
}: EncodeArgs): string {
  const allowed = new Set(elementsFor(sharing, audience));

  const payload: Record<string, unknown> & { r: unknown[] } = { v: VERSION, w: audience, r: [] };
  if (expiresInDays && now) payload.x = today(now) + expiresInDays;
  if (allowed.has("profile.name") && profile.displayName) payload.n = profile.displayName;
  if (allowed.has("profile.pronouns") && profile.pronouns) payload.p = profile.pronouns;
  if (allowed.has("profile.note") && profile.note) payload.o = profile.note;

  for (const run of runs) {
    if (!allowed.has(`run.${run.instrumentId}`)) continue;
    const spec = registry.get(run.instrumentId)?.spec;

    // Defence in depth. The sharing page does not offer an audience an
    // instrument forbids, but the sharing map is stored JSON and this is the
    // only place that has to be right. A ceiling enforced only in the UI is a
    // ceiling until somebody edits local storage.
    if (spec && !atLeast(spec.maxAudience ?? "public", audience)) continue;

    payload.r.push({
      i: run.instrumentId,
      v: run.instrumentVersion,
      a: spec ? packAnswers(spec, run.answers) : JSON.stringify(run.answers),
    });
  }
  return toB64Url(JSON.stringify(payload));
}

export type DecodedReport = {
  audience: Audience;
  profile: Partial<Profile>;
  runs: { instrumentId: string; instrumentVersion: number | null; answers: Answers }[];
};

/**
 * Read a token back. `t` renders the diagnosis, so a broken link explains
 * itself in the language of whoever is holding it.
 */
export function decodeReport(
  token: string,
  registry: Pick<Registry, "get">,
  t: T = (key) => key,
  now: number | null = null,
): DecodedReport {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(fromB64Url(token));
  } catch {
    throw new Error(t("report.unreadable"));
  }
  if (data?.v !== VERSION) throw new Error(t("report.version", { version: String(data?.v) }));
  if (data.x != null && now != null && today(now) > (data.x as number)) throw new Error(t("report.expired"));

  const profile: Partial<Profile> = {};
  if (data.n) profile.displayName = data.n as string;
  if (data.p) profile.pronouns = data.p as string;
  if (data.o) profile.note = data.o as string;

  const runs: DecodedReport["runs"] = [];
  for (const row of (data.r ?? []) as { i: string; v?: number; a: string }[]) {
    // An instrument this browser has never heard of is dropped rather than
    // thrown on: the sender may simply be running a newer build.
    const spec = registry.get(row.i)?.spec;
    if (!spec) continue;
    runs.push({ instrumentId: row.i, instrumentVersion: row.v ?? null, answers: unpackAnswers(spec, row.a) });
  }

  return { audience: (data.w as Audience) ?? "public", profile, runs };
}

/** Absolute URL for one audience's report. */
export const reportLink = (locale: string, args: EncodeArgs): string => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${location.origin}${base}/${locale}/report/?d=${encodeReport(args)}`;
};
