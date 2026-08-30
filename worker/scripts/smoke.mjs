/**
 * Does the deployed service actually keep its promise?
 *
 * One round trip against a real deployment: publish some bytes, read them
 * back, revoke, and confirm they are gone. It exists because the promise this
 * thing makes — *a withdrawn link is a dead page* — is the sort that is
 * believed rather than checked, and the moment to check it is the moment it
 * goes live rather than the first time somebody needs it to be true.
 *
 * It also probes the two refusals that matter. Revoking with the wrong token
 * must fail, or the manage token is decoration. And a revoked record must
 * answer exactly as an expired one does, because which of the two happened is
 * the sender's business.
 *
 *   node scripts/smoke.mjs https://my-instructions-links.<you>.workers.dev/p
 */

const endpoint = (process.argv[2] ?? "").replace(/\/$/, "");
if (!endpoint) {
  console.error("usage: node scripts/smoke.mjs <endpoint, ending in /p>");
  process.exit(2);
}

const line = (ok, what, detail = "") =>
  console.log(`${ok ? "  ok  " : "FAIL  "}${what}${detail ? `  — ${detail}` : ""}`);

let failures = 0;
const check = (ok, what, detail) => {
  if (!ok) failures++;
  line(ok, what, detail);
};

// Ciphertext, as far as this service is concerned: bytes it cannot read.
const payload = crypto.getRandomValues(new Uint8Array(256));

console.log(`\n${endpoint}\n`);

/* ── publish ──────────────────────────────────────────────────────── */
const created = await fetch(`${endpoint}?ttl=1`, {
  method: "POST",
  headers: { "content-type": "application/octet-stream" },
  body: payload,
});
check(created.status === 201, "publish answers 201", `got ${created.status}`);
const handle = created.ok ? await created.json() : {};
check(Boolean(handle.id && handle.manageToken), "publish returns an id and a manage token");

/* ── read back ────────────────────────────────────────────────────── */
const fetched = await fetch(`${endpoint}/${handle.id}`);
check(fetched.status === 200, "the record reads back", `got ${fetched.status}`);
const back = new Uint8Array(await fetched.arrayBuffer());
check(
  back.length === payload.length && back.every((byte, i) => byte === payload[i]),
  "the bytes come back unchanged",
);
check(
  (fetched.headers.get("cache-control") ?? "").includes("no-store"),
  "the response refuses to be cached",
  "a cached copy would outlive a revocation",
);

/* ── the wrong token must not work ────────────────────────────────── */
const forged = await fetch(`${endpoint}/${handle.id}`, {
  method: "DELETE",
  headers: { authorization: "Bearer not-the-token" },
});
check(forged.status === 401, "a forged manage token is refused", `got ${forged.status}`);
check((await fetch(`${endpoint}/${handle.id}`)).status === 200, "and the record survived the attempt");

/* ── revoke ───────────────────────────────────────────────────────── */
const revoked = await fetch(`${endpoint}/${handle.id}`, {
  method: "DELETE",
  headers: { authorization: `Bearer ${handle.manageToken}` },
});
check(revoked.status === 204, "revoking answers 204", `got ${revoked.status}`);

const afterwards = await fetch(`${endpoint}/${handle.id}`);
check(afterwards.status === 404, "the link is dead afterwards", `got ${afterwards.status}`);

// Deleting something already gone is a success from the caller's side: the
// thing they wanted gone is gone.
const again = await fetch(`${endpoint}/${handle.id}`, {
  method: "DELETE",
  headers: { authorization: `Bearer ${handle.manageToken}` },
});
check(again.status === 204, "revoking twice is not an error");

/* ── limits ───────────────────────────────────────────────────────── */
const huge = await fetch(endpoint, {
  method: "POST",
  headers: { "content-type": "application/octet-stream" },
  body: new Uint8Array(65 * 1024),
});
check(huge.status === 413, "an oversized record is refused", `got ${huge.status}`);

const silly = await fetch(`${endpoint}?ttl=9999`, {
  method: "POST",
  headers: { "content-type": "application/octet-stream" },
  body: payload,
});
check(silly.status === 400, "a ttl past the ceiling is refused", `got ${silly.status}`);

console.log(failures ? `\n${failures} failed\n` : "\nall good\n");
process.exit(failures ? 1 : 0);
