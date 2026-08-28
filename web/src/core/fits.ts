/**
 * Dates kept, searched and paged — and what is kept is the date, not the reading.
 *
 * The comparison could be stored. It is a few numbers and it would render
 * without recomputing. It is not stored, for the same reason a share link in
 * this app carries answers rather than scores: the chart is derived, the
 * traditions it is derived through are code, and code gets corrected. A stored
 * total would go quietly wrong the first time a boundary or a table was fixed,
 * and nothing downstream could tell. A stored date cannot go wrong; it is what
 * the reader typed.
 *
 * ── What changed about the promise ────────────────────────────────────
 *
 * This screen used to keep nothing at all, and said so. Keeping a list is a
 * different act and the copy had to change with it, because a sentence
 * promising nothing is saved, printed above a saved list, is worse than never
 * having promised.
 *
 * What is still true, and is now what the copy says: these are other people's
 * dates of birth, they stay on this device, they are in no share link and on no
 * instruction sheet, and each one can be deleted on its own. They are in a
 * local export, because an export is a copy of this device made by the person
 * holding it — and `store.wipe()` removes them with everything else.
 */

/**
 * A reading kept beside the date it came from.
 *
 * Storing a derived value is a decision with one failure mode, and `stamp` is
 * the whole answer to it. A saved comparison is only trusted while everything
 * it was derived *from* is unchanged: the version of the instrument that
 * computed it, the language its sentences are in, the reader's own date, and
 * the other person's. Any of those moves and the stamp stops matching, so the
 * reading is recomputed and rewritten rather than shown.
 *
 * The language is in there because `match()` renders its notes through `t`, so
 * a cached reading is not language-free — one computed in Polish and shown to a
 * German reader would be four correct numbers under four Polish sentences.
 * That is the failure this field exists to make impossible.
 */
export type CachedReading<R = unknown, C = unknown> = {
  stamp: string;
  reading: R;
  theirs: C;
};

export type Fit<R = unknown, C = unknown> = {
  id: string;
  /** Optional. A date with nobody's name on it is a legitimate thing to keep. */
  name: string;
  day: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
  /** Absent until the reading has been computed once. */
  cache?: CachedReading<R, C>;
};

/**
 * Everything a stored reading depends on, in one string.
 *
 * Built here rather than at the call site so that the thing which decides
 * whether a cache is fresh and the thing which writes it cannot drift apart —
 * which is the ordinary way a cache starts serving something it should not.
 */
export const stampFor = (args: {
  version: number;
  locale: string;
  mine: { d: number; m: number; y: number };
  theirs: Pick<Fit, "day" | "month" | "year">;
}): string =>
  [
    args.version,
    args.locale,
    `${args.mine.d}.${args.mine.m}.${args.mine.y}`,
    `${args.theirs.day}.${args.theirs.month}.${args.theirs.year}`,
  ].join("|");

/** Is what was stored still an answer to the question being asked? */
export const isFresh = (fit: Fit, stamp: string): boolean => fit.cache?.stamp === stamp;

/**
 * Fold case and strip diacritics before comparing.
 *
 * Searching a list of names in an app that ships in Polish, Spanish and German
 * without this means "Zosia" does not find "Zośka" and "Muller" does not find
 * "Müller" — which reads as a broken search rather than as a strict one. NFD
 * splits a letter from its accent and the range strips what is left.
 */
export const fold = (text: string): string =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** `8.1.1993`, the way the row is labelled and therefore the way it is searched. */
export const dateLabel = (fit: Pick<Fit, "day" | "month" | "year">): string =>
  `${fit.day}.${fit.month}.${fit.year}`;

/**
 * Search over what the reader can see.
 *
 * Name and date only. Searching the *readings* would let a query match a number
 * nobody typed and cannot see on the collapsed row, which is the kind of result
 * that reads as a bug — and it would mean computing every comparison on every
 * keystroke, which is the thing this page is built to avoid.
 */
export function search(fits: readonly Fit[], query: string): Fit[] {
  const needle = fold(query.trim());
  if (!needle) return [...fits];
  return fits.filter((fit) => fold(fit.name).includes(needle) || dateLabel(fit).includes(needle));
}

/** Newest first. A date just added is the one being looked at. */
export const byNewest = (fits: readonly Fit[]): Fit[] =>
  [...fits].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

export const PAGE_SIZE = 10;

export type Paged<T> = { rows: T[]; page: number; pages: number; total: number };

/**
 * One page of ten, and a page number that cannot point past the end.
 *
 * Clamped rather than trusted, because the page index outlives the list it
 * indexes: delete the last row of page four and the reader is standing on a
 * page that no longer exists. Clamping shows them page three instead of an
 * empty screen with no way back.
 */
export function paginate<T>(rows: readonly T[], page: number, size = PAGE_SIZE): Paged<T> {
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const clamped = Math.min(Math.max(0, Math.trunc(page) || 0), pages - 1);
  return {
    rows: rows.slice(clamped * size, clamped * size + size),
    page: clamped,
    pages,
    total: rows.length,
  };
}

/**
 * The whole read, in the order the page needs it.
 *
 * Search, then sort, then cut. Sorting before searching would be work thrown
 * away, and cutting before either would page over the wrong list — the bug that
 * makes a search appear to return nothing because its matches were on page two.
 */
export const view = (fits: readonly Fit[], query: string, page: number): Paged<Fit> =>
  paginate(byNewest(search(fits, query)), page);

export function validateFit(fit: Fit): void {
  if (!fit.id) throw new TypeError("a kept date needs an id");
  for (const key of ["day", "month", "year"] as const) {
    if (!Number.isInteger(fit[key])) throw new TypeError(`kept date "${fit.id}": ${key} must be a whole number`);
  }
  // The instrument's own validator owns whether a date exists — 31 September is
  // its business, not this module's. What is checked here is the shape that
  // reaches storage, so a record that could never render cannot be written.
  if (fit.month < 1 || fit.month > 12) throw new TypeError(`kept date "${fit.id}": month out of range`);
  if (fit.day < 1 || fit.day > 31) throw new TypeError(`kept date "${fit.id}": day out of range`);
}
