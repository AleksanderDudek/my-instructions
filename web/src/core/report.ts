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
 * Item ids that never leave the device.
 *
 * Two rules, and the second is not a naming convention. An author may mark any
 * item `tier: "private"`. Free text is private whether or not anybody marked
 * it, because a closed option is a word we wrote and a Likert point is a
 * number, while typed prose is the only answer in this app whose contents
 * nobody has reviewed — a third party's name, a diagnosis, a confession, an
 * address. So the tier is a property of the item kind, and an item whose id
 * happens to end in `.why` was never what the rule was about.
 *
 * `registry.validate()` refuses a `text` item that does not declare the tier,
 * which makes the kind test here redundant in any instrument that was imported
 * through the registry — and that is the point. This is the codec, the last
 * thing standing between prose and a URL, and making it depend on validation
 * having run puts the reader's privacy behind an import path that a fixture, a
 * hand-built spec or a future caller can skip.
 *
 * Enforced here rather than left to each instrument, because "remember to
 * strip these" is a rule that holds until somebody adds a code path. Packing
 * writes a blank in their position, so the item order — which is what makes
 * the compact format work — is unchanged.
 */
export const privateIdsOf = (spec: InstrumentSpec): Set<string> =>
  new Set(
    (itemsOf(spec) ?? []).filter((item) => item.tier === "private" || item.kind === "text").map((item) => item.id),
  );

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
 *
 * `rating` and `text` are rejected explicitly rather than by falling off the
 * end of the expression, because both of them look packable at a glance and
 * neither is. A rating of 10 is two characters, so a bank where somebody chose
 * 10 packs one width and a bank where they chose 9 packs another — the
 * misalignment is data-dependent, which means it passes every test written with
 * small numbers. A text answer is arbitrary length and can contain the blank
 * sentinel itself.
 *
 * So an inventory drops to the JSON path in its entirety, and its tokens are
 * larger than a questionnaire's. That is the honest outcome rather than a
 * clever one; the JSON path still strips private ids, so the reader's `why` is
 * absent from the link either way, and inventories are rarer than
 * questionnaires while correctness is worth more than a shorter URL.
 */
const packable = (item: Item) => {
  if (item.kind === "rating" || item.kind === "text") return false;
  return item.kind === "likert" || (item.kind === "choice" && (item.options?.length ?? 0) <= 10);
};

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
    /**
     * The wide path is a whitelist, not a blacklist.
     *
     * Removing today's private ids would be enough if `answers` only ever held
     * today's ids, and it does not. A draft typed against last month's item
     * ids is restored into a revised run wholesale, so an id the bank has
     * since renamed survives — and a stale `origin.why` is not in the withheld
     * set, because there is no longer an `origin` item to declare a tier.
     * An answer with no item has nothing that could show it to be shareable,
     * and "absent from the link" has to mean absent for those too, or the
     * promise lasts exactly as long as the bank does.
     *
     * A fields form has no bank: a profiler's dates and names carry no tiers
     * to honour and no prose the reader did not knowingly type, so it keeps
     * the filter it had rather than acquiring a whitelist with nothing to
     * whitelist against.
     */
    const bank = itemsOf(spec);
    const shareable = bank && new Set(bank.filter((item) => !withheld.has(item.id)).map((item) => item.id));
    return JSON.stringify(
      Object.fromEntries(Object.entries(answers).filter(([id]) => (shareable ? shareable.has(id) : !withheld.has(id)))),
    );
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

/**
 * The receive side strips too, and for a reason the send side cannot cover.
 *
 * `packAnswers` decides what leaves *this* browser against *this* build's bank.
 * A token, though, was minted by some other build — possibly before an item was
 * marked private at all — and it arrives carrying whatever was shareable then.
 * Trusting it would make the promise conditional on the sender's version, which
 * is the one thing a privacy rule must not be: a link minted last month is
 * precisely the kind that can contradict a promise made this month.
 *
 * `stance.ts` refuses a privacy flag on a stored result on exactly this ground —
 * a stale record fails *open*, and open is the one direction this must not fail.
 * A stale token is the same argument one layer out. The filter is therefore
 * applied against the reader's own current bank, in both directions, and a
 * forged key nobody's bank declares is dropped along with it.
 */
export function unpackAnswers(spec: InstrumentSpec, packed: string): Answers {
  const items = codecFor(spec);
  if (!items) {
    const withheld = privateIdsOf(spec);
    const bank = itemsOf(spec);
    const shareable = bank && new Set(bank.filter((i) => !withheld.has(i.id)).map((i) => i.id));
    const raw = JSON.parse(packed) as Answers;
    return Object.fromEntries(
      Object.entries(raw).filter(([id]) => (shareable ? shareable.has(id) : !withheld.has(id))),
    );
  }
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

    /**
     * A run this build cannot load is a run this build cannot filter, so it is
     * dropped rather than shipped raw.
     *
     * The spec is where the private tier, the packing format and the audience
     * ceiling all live. Without it there is no way to strip a reason, no way
     * to honour a `maxAudience`, and nothing left to write but every answer
     * verbatim — which is the worst of the three outcomes, not the safest.
     * The sharing page cannot draw a row for an instrument it failed to load,
     * so the reader can neither see that run nor lower it; `decodeReport`
     * drops rows for unknown instruments on arrival, so the receiver would
     * never have it rendered either. The prose would sit in a URL, readable by
     * anyone who decoded it and displayed to nobody, which is the version of
     * this failure where nothing looks wrong.
     *
     * The cost is a reader whose instrument was retired between builds losing
     * one section of a report the other end was going to discard anyway.
     */
    const spec = registry.get(run.instrumentId)?.spec;
    if (!spec) continue;

    // Defence in depth. The sharing page does not offer an audience an
    // instrument forbids, but the sharing map is stored JSON and this is the
    // only place that has to be right. A ceiling enforced only in the UI is a
    // ceiling until somebody edits local storage.
    if (!atLeast(spec.maxAudience ?? "public", audience)) continue;

    payload.r.push({
      i: run.instrumentId,
      v: run.instrumentVersion,
      a: packAnswers(spec, run.answers),
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

/**
 * The token rides in the fragment, and that is not a cosmetic choice.
 *
 * A query string is sent to the server on every request. A fragment never
 * leaves the browser — no server, no proxy, no log, no referrer. For a link
 * whose whole payload *is* the query string, the difference is the difference
 * between a private answer and a published one.
 *
 * This shipped as `?d=` and the leak it opened is worth naming, because it is
 * not the obvious one. The obvious one is the host's access log. The real one
 * is that every messenger worth sending a link through fetches it to draw a
 * preview card: paste a `?d=` link into WhatsApp, Messenger, Signal, Slack,
 * Discord or iMessage and that company's crawler requests the URL, token and
 * all, before the person you sent it to has touched anything. Browser history
 * sync carries it to a vendor's cloud on the same principle.
 *
 * With the payload in the fragment, a crawler fetches a page with nothing in
 * it, which is exactly what a crawler should get.
 */
export const REPORT_KEY = "d";

/**
 * Read the token from wherever it is, preferring the fragment.
 *
 * The query form is still read, because links made before this change are in
 * other people's messages and breaking them would punish the reader for a
 * mistake that was ours. `fromQuery` says which form was used, so the page can
 * get the token out of the address bar afterwards rather than leaving it in
 * history and in the next outgoing referrer.
 *
 * Pure, and takes both strings, so it is testable without a browser.
 */
export function tokenFrom(hash: string, query: string): { token: string | null; fromQuery: boolean } {
  const fragment = new URLSearchParams(hash.replace(/^#/, ""));
  const fromHash = fragment.get(REPORT_KEY);
  if (fromHash) return { token: fromHash, fromQuery: false };
  const fromSearch = new URLSearchParams(query.replace(/^\?/, "")).get(REPORT_KEY);
  return { token: fromSearch, fromQuery: Boolean(fromSearch) };
}

/** Absolute URL for one audience's report. */
export const reportLink = (locale: string, args: EncodeArgs): string => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${location.origin}${base}/${locale}/report/#${REPORT_KEY}=${encodeReport(args)}`;
};
