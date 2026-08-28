/**
 * A link you can take back, and a host that cannot read what it holds.
 *
 * A self-contained token cannot be revoked. `core/report.ts` has always said
 * so: there is nobody to ask, and the bytes are in the other person's hands the
 * moment they open it. Revocation needs a party able to **refuse**, and a
 * static site has none — so this is the one feature in the app that needs
 * somewhere to say no.
 *
 * The shape is chosen so that the somewhere knows as little as possible.
 *
 *     making      key        = random, generated here, never sent
 *                 ciphertext = AES-GCM(report token, key)
 *                 POST       -> { id, manageToken }
 *                 link       = …/p/<id>#<key>
 *
 *     opening     GET /p/<id> -> ciphertext        (the fragment is not sent)
 *                 decrypt with the key from the fragment
 *
 *     revoking    DELETE /p/<id> with the manageToken
 *                 -> every copy of that link is 404, permanently
 *
 * Three things follow, and each answers something that was actually asked.
 *
 * **Revocation is real.** Not "the app declines to render it" — the bytes are
 * gone. A saved URL, a forwarded URL, a screenshotted URL: all dead.
 *
 * **The host cannot read a profile.** The key rides in the fragment, which no
 * browser sends. That is what makes putting somebody's faith, money and
 * boundaries on a server survivable at all: the promise is *we cannot* rather
 * than *we do not*, and only the first survives a change of ownership, a
 * subpoena, or a breach.
 *
 * **A preview crawler gets nothing.** Every messenger fetches a pasted link to
 * draw a card, and what it fetches here is ciphertext.
 *
 * ── What this still does not do ───────────────────────────────────────
 *
 * Somebody who opened the link before it was revoked has read it, and can have
 * kept it. **Revocation ends future reads, not past ones.** Any system claiming
 * otherwise is lying, and the copy that surrounds this must not.
 */

/** Present only where the app has been given somewhere to publish to. */
export const publishEndpoint = (): string | null => process.env.NEXT_PUBLIC_PUBLISH_ENDPOINT || null;

export type Published = { id: string; manageToken: string };

const b64url = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const unb64url = (text: string): Uint8Array =>
  Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

/**
 * A copy whose backing store is a plain `ArrayBuffer`.
 *
 * WebCrypto's types want `ArrayBufferView<ArrayBuffer>`, and a `Uint8Array`
 * produced by `subarray` or by `atob` carries `ArrayBufferLike` — which admits
 * `SharedArrayBuffer` and so does not satisfy it. Copying is a few bytes and
 * removes a class of `as unknown as` that would have to be re-justified every
 * time somebody read this file.
 */
const bytes = (view: Uint8Array): Uint8Array<ArrayBuffer> => {
  const copy = new Uint8Array(new ArrayBuffer(view.byteLength));
  copy.set(view);
  return copy;
};

/**
 * AES-GCM, 256-bit, a fresh key per link.
 *
 * Per link rather than per person: two links to two people must not share a
 * key, or revoking one would leave the other's bytes decryptable by whoever
 * held the first. GCM rather than CBC because it authenticates — a host that
 * cannot read the ciphertext should also not be able to alter it undetected.
 */
const ALGORITHM = "AES-GCM";
const IV_BYTES = 12;

export async function encryptToken(token: string): Promise<{ body: Uint8Array; key: string }> {
  const key = await crypto.subtle.generateKey({ name: ALGORITHM, length: 256 }, true, ["encrypt", "decrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const sealed = new Uint8Array(
    await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, bytes(new TextEncoder().encode(token))),
  );

  // The IV rides in front of the ciphertext rather than in the fragment beside
  // the key. It is not a secret, it must never repeat under one key, and
  // keeping it next to the bytes it belongs to means a stored record is
  // self-describing — there is no way to pair the wrong IV with a ciphertext.
  const body = new Uint8Array(IV_BYTES + sealed.length);
  body.set(iv, 0);
  body.set(sealed, IV_BYTES);

  const raw = new Uint8Array(await crypto.subtle.exportKey("raw", key));
  return { body, key: b64url(raw) };
}

export async function decryptToken(body: Uint8Array, key: string): Promise<string> {
  const material = await crypto.subtle.importKey("raw", bytes(unb64url(key)), { name: ALGORITHM }, false, ["decrypt"]);
  const iv = bytes(body.subarray(0, IV_BYTES));
  const sealed = bytes(body.subarray(IV_BYTES));
  const plain = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, material, sealed);
  return new TextDecoder().decode(plain);
}

/**
 * Publish, and get back the two strings that matter.
 *
 * `manageToken` is the only proof of the right to withdraw this link, and it is
 * stored on the sender's device and nowhere else. That is the price of having
 * no accounts: lose the device and you lose the ability to revoke. It is also
 * why `store.exportAll` matters more than it looks — a backup of this app is a
 * backup of the ability to take things back, and the copy beside the export has
 * to say so.
 */
export async function publish(endpoint: string, body: Uint8Array, expiresInDays: number | null): Promise<Published> {
  const url = new URL(endpoint);
  if (expiresInDays != null) url.searchParams.set("ttl", String(expiresInDays));

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/octet-stream" },
    body: bytes(body) as BodyInit,
  });
  if (!response.ok) throw new Error(`publish failed: ${response.status}`);
  const data = (await response.json()) as Partial<Published>;
  if (!data.id || !data.manageToken) throw new Error("publish returned no handle");
  return { id: data.id, manageToken: data.manageToken };
}

export async function fetchPublished(endpoint: string, id: string): Promise<Uint8Array | null> {
  const response = await fetch(`${endpoint.replace(/\/$/, "")}/${encodeURIComponent(id)}`);
  // 404 is the answer to "was this revoked or has it expired?", and the two are
  // deliberately indistinguishable from outside. Telling a holder which one
  // happened tells them something about the sender's recent decisions.
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return new Uint8Array(await response.arrayBuffer());
}

/** Returns true when it is gone, including when it was already gone. */
export async function revoke(endpoint: string, id: string, manageToken: string): Promise<boolean> {
  const response = await fetch(`${endpoint.replace(/\/$/, "")}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${manageToken}` },
  });
  // An already-deleted record answering 404 is a success from where the caller
  // stands: the thing they wanted gone is gone. Treating it as a failure makes
  // a page tell somebody their link is still live when it is not.
  return response.ok || response.status === 404;
}

/**
 * `…/p/#i=<id>&k=<key>` — both halves in the fragment, and for two reasons.
 *
 * The practical one: this app is a static export, so there is no server able to
 * answer `/p/<id>` for an id that did not exist when the site was built. One
 * page reading its own fragment is the shape that works.
 *
 * The better one is that it did not have to be a compromise. With the id in the
 * path, the host serving the page learns which record is being opened, every
 * time, in its access log — and a log of "this record was opened from this
 * address at this hour" is most of what a log of readers would be. Put the id
 * in the fragment and the only party that learns it is the one that has to: the
 * service holding the bytes, which cannot read them.
 */
export const publishedLink = (base: string, id: string, key: string): string =>
  `${base.replace(/\/$/, "")}/#i=${encodeURIComponent(id)}&k=${key}`;

/** The two halves of a published link, read out of a fragment. */
export function handleFromFragment(hash: string): { id: string; key: string } | null {
  const parts = new URLSearchParams(hash.replace(/^#/, ""));
  const id = parts.get("i");
  const key = parts.get("k");
  // Half a handle is not a handle: an id with no key fetches bytes nobody can
  // read, and a key with no id has nothing to open. Both are the same failure
  // to the reader — a link that does not work — and saying so once is honest.
  return id && key ? { id, key } : null;
}
