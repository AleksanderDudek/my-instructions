/**
 * The moments Uriel marks.
 *
 * Uriel never explains a result — the plates do that. He marks a step: the
 * first test finished, the sheet ready to read. Both are decided here, from
 * the runs that existed before the one being saved, so that a retake of a
 * test already taken is never announced as an achievement a second time.
 */

/** How many instruments fill the sheet enough to read. The onboarding rail's step two. */
export const SHEET_READY = 3;

export type Moment = "first" | "sheet";

export const isMoment = (value: unknown): value is Moment => value === "first" || value === "sheet";

/** What finishing `instrumentId` marks, given the instruments that already had a run. */
export function momentAfter(priorIds: readonly string[], instrumentId: string): Moment | null {
  if (priorIds.includes(instrumentId)) return null;
  const count = priorIds.length + 1;
  if (count === 1) return "first";
  if (count === SHEET_READY) return "sheet";
  return null;
}
