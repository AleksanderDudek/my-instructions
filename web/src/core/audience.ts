/**
 * Who a thing is for. One ladder, narrowest first.
 *
 * Every level is a superset of the one before it: an element marked for
 * partners appears in a partner report and in nothing wider, because wider
 * audiences sit further along the list, not further in.
 */
import type { Audience } from "./types";

export const AUDIENCE_ORDER: readonly Audience[] = ["private", "partner", "friends", "public"] as const;

/**
 * Is an element marked `elementAudience` visible in a report for `audience`?
 *
 * Private is excluded explicitly rather than by arithmetic. It is not the
 * narrowest sharing level; it is the absence of sharing, and it must never
 * satisfy a comparison, including against itself.
 */
export const atLeast = (elementAudience: Audience, audience: Audience): boolean =>
  AUDIENCE_ORDER.indexOf(elementAudience) >= AUDIENCE_ORDER.indexOf(audience) && elementAudience !== "private";

/** The audiences a link can actually be made for — everything except private. */
export const SHAREABLE = AUDIENCE_ORDER.filter((a) => a !== "private");

/**
 * What the sharing page may offer for one instrument.
 *
 * A declared ceiling is a different thing from a default. A default is where a
 * setting starts and can be moved; a ceiling is an option that never appears.
 */
export function audiencesFor(spec: { maxAudience?: Audience } | null | undefined): Audience[] {
  const ceiling = AUDIENCE_ORDER.indexOf(spec?.maxAudience ?? "public");
  return AUDIENCE_ORDER.slice(0, (ceiling < 0 ? AUDIENCE_ORDER.length - 1 : ceiling) + 1);
}
