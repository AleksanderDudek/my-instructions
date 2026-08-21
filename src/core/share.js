/**
 * Portable results.
 *
 * Everything lives in one browser today, so the only way two people compare
 * charts is to hand one to the other. A share token is the answers — not the
 * scores — encoded into a URL fragment: the receiving app re-scores them with
 * its own current version of the instrument, so a token made last month
 * against version 1 still produces a correct reading under version 2.
 *
 * When the server arrives this becomes the payload of a share record, not a
 * blob in a link, and `decode` keeps working unchanged.
 */

const VERSION = 1;

const toB64Url = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64Url = (s) => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/")))); // eslint-disable-line

/** @param run {{instrumentId, instrumentVersion, answers}} @param name display name */
function encode(run, name = "") {
  return toB64Url(JSON.stringify({ v: VERSION, i: run.instrumentId, r: run.instrumentVersion, n: name, a: run.answers }));
}

function decode(token) {
  let data;
  try { data = JSON.parse(fromB64Url(token)); } catch { throw new Error("That share link is not readable."); }
  if (data?.v !== VERSION) throw new Error(`That link was made by a different version of the app (${data?.v}).`);
  if (!data.i || typeof data.a !== "object") throw new Error("That share link is missing its answers.");
  return { instrumentId: data.i, instrumentVersion: data.r ?? null, name: data.n ?? "", answers: data.a };
}

/** Absolute URL a friend can open. */
const link = (run, name) => `${location.origin}${location.pathname}#/compare/${run.instrumentId}?with=${encode(run, name)}`;

export { encode, decode, link, VERSION };
