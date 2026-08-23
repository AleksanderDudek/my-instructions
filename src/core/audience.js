/**
 * Who a thing is for.
 *
 * One ladder, narrowest first, and every level is a superset of the one before
 * it: an element marked for partners appears in a partner report and in
 * nothing wider, because wider audiences are further along the list, not
 * further in.
 *
 * This list existed in three places before it existed here — `VISIBILITY` in
 * the store, `AUDIENCE_ORDER` in the registry, `AUDIENCES` in the report codec
 * — which was survivable only while the three copies happened to agree.
 * Adding a level to two of three would have produced a setting the store
 * accepts, the sharing page offers and the encoder silently drops, and the
 * failure would have looked like a partner simply not being sent anything.
 *
 * `partner` sits between `private` and `friends` deliberately. There is a real
 * category of thing a person will tell one other person and not a group of
 * friends — how they argue, what they need after a bad day, what they want in
 * bed — and before this level existed the only home for it was `private`,
 * which is to say nowhere.
 */
const AUDIENCE_ORDER = ["private", "partner", "friends", "public"];

/**
 * Is an element marked `elementAudience` visible in a report for `audience`?
 *
 * Private is excluded explicitly rather than by arithmetic. It is not the
 * narrowest sharing level; it is the absence of sharing, and it must never
 * satisfy a comparison, including against itself.
 */
const atLeast = (elementAudience, audience) =>
  AUDIENCE_ORDER.indexOf(elementAudience) >= AUDIENCE_ORDER.indexOf(audience) && elementAudience !== "private";

/** The audiences a link can actually be made for — everything except private. */
const SHAREABLE = AUDIENCE_ORDER.filter((a) => a !== "private");

export { AUDIENCE_ORDER, atLeast, SHAREABLE };
