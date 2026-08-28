/**
 * The smallest thing that can say no.
 *
 * A link carrying its own data cannot be revoked — there is nobody to ask. This
 * is the nobody, and its entire job is to hold some bytes and later refuse to
 * hand them over. Everything about it is shaped by wanting that job to be the
 * only thing it can do.
 *
 * **It cannot read what it stores.** The client encrypts before posting and
 * the key travels in the URL fragment, which no browser sends anywhere. So this
 * holds ciphertext and an expiry and nothing else — no account, no address, no
 * record of who a link was for. If it is breached, sold, subpoenaed or simply
 * misconfigured, what leaks is noise. That is a stronger promise than any
 * policy, and it is the only one worth making about somebody's answers on the
 * subject of their faith, their money and their marriage.
 *
 * **It cannot tell you who read a link.** There is no log of opens, on purpose.
 * "Your partner read this at 2am" is surveillance wearing a feature's clothes,
 * and the cheapest way not to ship it is to have nowhere to put it.
 *
 * **Deletion is deletion.** `DELETE` removes the record. Every copy of that
 * link — saved, forwarded, screenshotted into a note — is then a 404 forever.
 * What it cannot undo is a read that already happened, and the app's copy says
 * so rather than implying otherwise.
 *
 * Free-tier arithmetic, because it decides the shape: Cloudflare's KV free
 * allowance is generous on reads (100k/day) and tight on writes (1k/day).
 * Reads are people opening links and writes are people making them, so the
 * limit binds exactly where the usage is rare. Nothing here sleeps, which is
 * the reason this is a Worker and not a free Postgres that pauses after a quiet
 * week — a revocation service that disappears on its own is worse than none.
 */

export interface Env {
  PROFILES: KVNamespace;
  /** Comma-separated origins allowed to call this. No wildcard in production. */
  ALLOWED_ORIGINS: string;
}

/** A published record is large enough for a real report and no larger. */
const MAX_BYTES = 64 * 1024;

/** Days. A link with no expiry still gets one; "forever" is not on offer. */
const DEFAULT_TTL_DAYS = 90;
const MAX_TTL_DAYS = 365;
/** KV's own floor. Asking for less is an error rather than a silent bump. */
const MIN_TTL_SECONDS = 60;

const b64url = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const randomId = (bytes: number) => b64url(crypto.getRandomValues(new Uint8Array(bytes)));

/**
 * The manage token is stored hashed, never in the clear.
 *
 * The token is what proves the right to revoke. Storing it as written would
 * mean anyone who could read the namespace could revoke anybody's link — and,
 * worse, could tell which links belonged together. A hash costs nothing here
 * and makes a dump of the store useless for anything but deletion of records
 * whose ids you already knew.
 */
async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return b64url(new Uint8Array(digest));
}

/**
 * Compare without leaking where two strings first differ.
 *
 * A `===` on a secret is a timing oracle. It is a small one over a network, and
 * it is one line to not have.
 */
function sameSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const corsHeaders = (env: Env, origin: string | null): Record<string, string> => {
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean);
  // An origin that is not on the list gets no CORS header at all, which is a
  // refusal the browser enforces. Echoing an unknown origin back would make the
  // list decorative.
  const permit = origin && allowed.includes(origin) ? origin : null;
  return {
    ...(permit ? { "access-control-allow-origin": permit, vary: "Origin" } : {}),
    "access-control-allow-methods": "GET,POST,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
    "access-control-max-age": "86400",
  };
};

const json = (body: unknown, status: number, headers: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, "content-type": "application/json" } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("origin");
    const cors = corsHeaders(env, origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    // `/p` and `/p/<id>`; anything else is not this service.
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] !== "p" || parts.length > 2) return json({ error: "not found" }, 404, cors);
    const id = parts[1];

    if (request.method === "POST" && !id) {
      const body = new Uint8Array(await request.arrayBuffer());
      if (!body.length) return json({ error: "empty" }, 400, cors);
      if (body.length > MAX_BYTES) return json({ error: "too large" }, 413, cors);

      const asked = Number(url.searchParams.get("ttl") ?? DEFAULT_TTL_DAYS);
      if (!Number.isFinite(asked) || asked <= 0 || asked > MAX_TTL_DAYS) {
        return json({ error: "ttl out of range" }, 400, cors);
      }
      const expirationTtl = Math.max(MIN_TTL_SECONDS, Math.round(asked * 86400));

      const recordId = randomId(16);
      const manageToken = randomId(32);

      /**
       * The expiry is KV's, not ours.
       *
       * `expirationTtl` means the record stops existing at the platform level.
       * An expiry we enforced in code would be a promise that lasts exactly as
       * long as this file stays correct — and the whole reason somebody sets an
       * expiry is that they do not want to depend on anybody remembering.
       */
      await env.PROFILES.put(recordId, body, {
        expirationTtl,
        metadata: { t: await hashToken(manageToken) },
      });

      return json({ id: recordId, manageToken }, 201, cors);
    }

    if (!id) return json({ error: "not found" }, 404, cors);

    if (request.method === "GET") {
      const body = await env.PROFILES.get(id, "arrayBuffer");
      // Revoked and expired answer identically, on purpose. Telling a holder
      // which one happened tells them something about the sender's recent
      // decisions, and that is the sender's business.
      if (!body) return json({ error: "gone" }, 404, cors);
      return new Response(body, {
        status: 200,
        headers: {
          ...cors,
          "content-type": "application/octet-stream",
          // Ciphertext is immutable for as long as it exists, but a cached copy
          // would outlive a revocation, which is the one thing that must not
          // happen. So: never store it anywhere between here and the reader.
          "cache-control": "no-store",
        },
      });
    }

    if (request.method === "DELETE") {
      const offered = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
      if (!offered) return json({ error: "unauthorised" }, 401, cors);

      const { metadata } = await env.PROFILES.getWithMetadata<{ t: string }>(id, "arrayBuffer");
      // Already gone is a success from the caller's side: the thing they wanted
      // deleted is deleted. Answering "no such record" would make a page tell
      // somebody their link is still live when it is not.
      if (!metadata) return new Response(null, { status: 204, headers: cors });
      if (!sameSecret(metadata.t, await hashToken(offered))) return json({ error: "unauthorised" }, 401, cors);

      await env.PROFILES.delete(id);
      return new Response(null, { status: 204, headers: cors });
    }

    return json({ error: "method not allowed" }, 405, cors);
  },
};
