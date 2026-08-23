/**
 * Build a URL that survives being served from a subpath.
 *
 * A root-relative path silently discards the path part of Playwright's
 * `baseURL`, so `/en/tests` against `http://host/my-instructions` requests
 * `http://host/en/tests` — a 404 that looks exactly like a broken page. Since
 * a GitHub project page *is* served from a subpath, the suite has to be able
 * to run that way, so every path in the tests goes through here.
 */
const PREFIX = process.env.E2E_PREFIX ?? "";

export const path = (p: string) => `${PREFIX}${p.startsWith("/") ? p : `/${p}`}`;
