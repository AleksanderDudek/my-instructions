# The link service

The one piece of this project that runs on somebody else's computer, and the
smallest thing that can do the job it exists for: **saying no**.

A link that carries its own data cannot be revoked. There is nobody to ask.
This is the nobody.

## What it holds

Ciphertext and an expiry. That is the whole record.

The browser encrypts before posting, and the key travels in the URL fragment —
the part after `#`, which no browser sends to any server. So this service, its
operator, its host and anybody who ever breaches it hold noise.

That matters more than a policy would. "We do not look at your data" survives
exactly as long as the person saying it owns the company. "We cannot" survives
a sale, a subpoena and a mistake.

It also keeps no record of who opened a link, deliberately. *Your partner read
this at 2am* is surveillance wearing a feature's clothes, and the cheapest way
not to ship it is to have nowhere to put it.

## What it costs

Nothing, on Cloudflare's free tier, and the shape of that tier is why this is a
Worker rather than a small database:

| | Free allowance | What uses it |
|---|---|---|
| KV reads | 100,000 / day | somebody opening a link |
| KV writes | 1,000 / day | somebody **making** or **revoking** one |
| Storage | 1 GB | 64 KB per record, capped |
| Sleeping | none | — |

The tight limit is on writes, and writes are the rare operation. Reads, the
common one, are effectively free.

A free Postgres was the obvious alternative and loses on one fact: it pauses
after about a week of inactivity. A revocation service that disappears on its
own is worse than no revocation service, because people would have been told
their links were withdrawable.

## Deploying it

Everything that could be checked without an account has been: `npm run
typecheck` passes and `npx wrangler deploy --dry-run` bundles it at 4.3 KiB with
both bindings resolved. What is left needs your Cloudflare login, which is a
browser flow and cannot be done for you.

```sh
cd worker
npm install
npx wrangler login                      # opens a browser
npx wrangler kv namespace create PROFILES
```

Put the printed namespace id into `wrangler.toml` in place of
`REPLACE_WITH_YOUR_KV_NAMESPACE_ID`, check `ALLOWED_ORIGINS` is the site's own
origin, then:

```sh
npm run deploy
```

**Then check that it does what it claims**, before anything depends on it:

```sh
npm run smoke -- https://my-instructions-links.<you>.workers.dev/p
```

That publishes a record, reads it back, tries to revoke it with the wrong token,
revokes it properly and confirms the link is dead — plus the size and expiry
ceilings. The promise this service makes is the kind that gets believed rather
than checked, and the moment to check it is the moment it goes live.

Finally, give the app the endpoint at build time:

```sh
NEXT_PUBLIC_PUBLISH_ENDPOINT="https://my-instructions-links.<you>.workers.dev/p"
```

**Without that variable the app is exactly what it was before**: self-contained
tokens, honest expiry, no server, and every other sharing feature still working.
Publishing is the only thing that appears when an endpoint exists. That is the
intended default — nothing here should ever be *required*.

## The API

```
POST   /p?ttl=<days>     body: ciphertext   ->  201 { id, manageToken }
GET    /p/<id>                              ->  200 ciphertext | 404
DELETE /p/<id>           Bearer manageToken ->  204 | 401
```

`manageToken` is the only proof of the right to withdraw a link. It is stored
**hashed** here and in the clear only on the sender's own device, so a dump of
this namespace lets nobody revoke anything they did not already have. The cost
of that is real and the app has to say it out loud: lose the device, lose the
ability to revoke. `store.exportAll` carries the tokens, which makes a backup of
the app a backup of the ability to take things back.

Revoked and expired both answer `404`. Which of the two happened is the
sender's business, not the holder's.

## What it does not do

- Read anything it stores — it cannot
- Record who opened a link, or when
- Take back a read that already happened. **Revocation ends future reads, not
  past ones**, and any wording in the app that suggests otherwise is a bug
