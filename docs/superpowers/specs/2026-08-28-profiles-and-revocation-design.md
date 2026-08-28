# Profiles, reach, and a link you can take back — design

Date: 2026-08-28. Status: implementation contract.

## What was asked for

Three things, and only the third is hard.

1. **Reach.** A link should be sendable wherever people actually talk —
   Messenger, WhatsApp, SMS, email, a post, a QR code across a table. This is
   about *media*, not about loosening anything: the audience settings already
   made stay exactly as they are.
2. **Three profiles.** A public one for a friend network. A team one, where
   things colleagues have no business knowing are held back. A romantic one,
   for exactly one person.
3. **Taking it back.** *"What if they break up, or fall out, or change jobs?"*
   A person should be able to give temporary access, withdraw it, and feel that
   their answers are safe over years rather than over an afternoon.

## 0. The leak that had to be fixed first, and was

The token travelled in a **query string**: `/en/report/?d=<everything>`.

A query string is sent to the server on every request. A fragment never leaves
the browser. When the entire payload *is* that string, the difference is the
whole privacy claim — and the serious exposure is not the host's access log.

**Every messenger worth sending a link through fetches it to draw a preview
card.** Paste a `?d=` link into WhatsApp, Messenger, Signal, Slack, Discord or
iMessage and that company's crawler requests the URL, token and all, before the
person it was sent to has touched anything. Browser history sync carries it to
a vendor's cloud on the same principle, and it goes out again in the next
referrer.

This mattered *before* anyone asked for share buttons. Adding them without
fixing it would have industrialised it.

Fixed: `reportLink` emits `#d=`, `tokenFrom` prefers the fragment, links made
under the old form still open, and a legacy token is moved out of the address
bar by `history.replaceState` once read — which recovers nothing already spent
on the way in, but stops the onward travel that a URL sitting in the bar
invites. `test/core/report-token.test.ts` is the record.

## 1. Why revocation needs a server, said plainly

`core/report.ts` has always been honest about this:

> A link that carries its own data cannot be revoked. There is no server to
> ask, and the bytes are in the other person's hands the moment they open it.

Expiry, today, means *this app declines to render an old token*. That stops a
forwarded link working in six months. It does not stop anyone who kept it. No
amount of client cleverness changes that, because revocation requires a party
able to **refuse**, and a static site has none.

So the requirement cannot be met without somewhere to say no. The question is
only how little that somewhere has to know.

### 1.1 What was compared

| | Supabase free | Cloudflare Workers + KV free |
|---|---|---|
| Sleeps | **Yes — one week of inactivity** | No |
| Free ceiling | 500 MB db, 5 GB egress | 100k reads/day, **1k writes/day**, 1 GB |
| At the ceiling | — | hard failure, no queueing |

Supabase loses on shape, not on size. A service whose job is to keep answering
"is this link still allowed?" cannot itself vanish after a quiet week — and the
usual fix, a cron job pinging your own database to look busy, is a workaround
holding up a safety promise.

Cloudflare's free tier has the right asymmetry: reads (someone opening a link)
are plentiful, writes (making one, revoking one) are rare, and nothing sleeps.
1000 writes a day is the binding limit and it is a long way off.

### 1.2 The shape chosen: the host holds bytes it cannot read

```
Making a link
    key        = crypto.getRandomValues()          // never leaves the browser
    ciphertext = AES-GCM(profile, key)             // WebCrypto, no dependency
    POST /p    -> { id, manageToken }
    link       = https://…/p/<id>#<key>

Opening it
    GET /p/<id> -> ciphertext                      // the fragment is not sent
    decrypt with the key from the fragment

Taking it back
    DELETE /p/<id>  with the manageToken
    -> every copy of that link is now 404, forever
```

Three properties fall out, and each answers something that was asked:

- **Revocation is real.** Not "the app declines to render it" — the bytes are
  gone. A saved URL, a forwarded URL, a screenshotted URL: all dead.
- **The host cannot read a profile.** The key is in the fragment, which never
  reaches it. This is what makes putting somebody's faith, money and boundaries
  on a server survivable at all. The promise moves from *we do not look* to
  *we cannot*, and only the second one survives a change of ownership.
- **Preview crawlers get nothing.** WhatsApp fetches `/p/<id>` without the
  fragment, so it receives ciphertext and a generic card. The preview says a
  page exists; it cannot say what is in it.

This is the Firefox Send / PrivateBin pattern and it is well understood. It is
not novel and should not be.

### 1.3 What it still does not do, and the copy must say so

A person who opens a link before it is revoked has read it. They can screenshot
it, copy it, remember it. **Revocation ends future reads, not past ones.** Any
sharing system that claims otherwise is lying, and this one will not.

Second: the `manageToken` is what proves the right to revoke, and it lives in
the sender's own storage. Lose the device, lose the ability to revoke. That is
the price of no accounts, and the mitigation already exists — `store.exportAll`
carries the tokens, so a backup is a backup of the ability to take things back.
The copy has to make that consequence visible where the backup is offered, not
in a help page nobody opens.

Third: **expiry stays on, and stays the default.** A server that can be asked is
not a reason to stop links dying on their own. Most links should never need
revoking because they should already be gone.

## 2. Profiles

### 2.1 Why the ladder was not extended

`Audience` is ordinal — `private → partner → friends → public` — and `atLeast`
is an index comparison. That is a good model for a *ceiling* and the wrong one
for what was asked, because a team does not sit anywhere on it.

A colleague should see how you want to be corrected and nothing about your
faith. A close friend is the other way round. Team is not narrower than friends
and not wider; it is **sideways**. Forcing it onto the ladder means picking a
rung and then working around the pick forever.

### 2.2 What a profile is

```ts
type Profile = {
  id: string;
  name: string;             // the reader's own word for it
  audience: Audience;       // the ceiling this profile is built under
  elements: string[];       // exactly what is in it — nothing implied
  expiresInDays: number | null;
  remote?: { id: string; manageToken: string };  // present once published
};
```

A profile is a **named selection**, not a level. The ladder keeps its job: an
instrument's `maxAudience` still caps what may be offered, so `run.faith`
(capped at `partner`) can never be added to a team profile — not by intent, not
by a bug, not by hand-editing storage, because `encodeReport` checks the ceiling
again when it builds the token.

Presets seed a selection and are then trimmed by hand, which is exactly the
"certain things colleagues do not need to know can be hidden" that was asked
for:

| Preset | Ceiling | Seeded from |
|---|---|---|
| **Public** | `public` | every element whose instrument is not `sensitive` |
| **Team** | `friends` | the `work`, `communication` and `conflict` channels |
| **Partner** | `partner` | everything the ceilings allow |

The presets are a starting point and the copy says so. A preset that silently
decided what a colleague sees would be the same mistake as a ladder.

## 3. Reach — the media, and what each one costs

Everything here is free and none of it is a third-party SDK. No Facebook share
button, no platform pixel: those are trackers, and this app has spent its whole
existence not having any.

| Surface | How | Why this one |
|---|---|---|
| **Web Share API** | `navigator.share()` | One native sheet, on mobile, covering WhatsApp, Messenger, SMS, mail and everything else installed. No SDK, no per-network code, nothing observed by us. The right default where it exists. |
| **Copy link** | clipboard | The fallback that always works, and the only one some people will use. |
| **Direct intents** | `https://wa.me/?text=`, `mailto:`, `sms:`, Telegram, X, LinkedIn | Plain URLs, no scripts. For desktop, where `navigator.share` is thin. |
| **QR code** | drawn client-side | The partner case, and the best of them: handing a phone across a table sends the link through no company at all. |
| **A card image** | Canvas → PNG | For posting. Carries *only what is visible* — no token, no answers, nothing decodable. A picture is the honest medium for a statement. |

### 3.1 The card image is not an export

The statement case — "here is who I am, here is how to treat me" — is served by
an image built from lines the reader **ticked in their own playbook**, plus a
link if they want one. It is not a rendering of a result.

That distinction is the whole safety of it. A result image invites a screenshot
of somebody's money or faith answers into a feed. A card of chosen sentences is
a thing the person composed on purpose, and it is the only artefact here that
should ever be easy to post.

## 4. Build order

1. ~~Fragment fix~~ — done, with tests.
2. Profile model in `core`: type, presets, the ceiling check, storage.
3. The sharing page rebuilt around profiles rather than one row per element.
4. Reach: Web Share, copy, intents, QR.
5. The card image.
6. The Worker, plus the publish/revoke client. Ships behind a config flag: with
   no endpoint configured the app is exactly what it is today, self-contained
   tokens and honest expiry, and every other feature above still works.

Six is last on purpose. Everything before it is useful with no server at all,
and the app must never *require* one.

## 5. Deliberately not built

| Not built | Why |
|---|---|
| Accounts | Nothing here needs identity. A profile is proven by a token in the sender's own storage, and that is a smaller thing to lose than a password |
| A share SDK from any platform | Every one is a tracker. Intent URLs do the same job with no script |
| Server-side rendering of a profile's content | The host would then be able to read it, and the whole argument in §1.2 collapses |
| Analytics on opens | "Your partner read this at 2am" is surveillance wearing a feature's clothes. The Worker logs nothing beyond what it needs to serve |
| A result image | §3.1 |
| `team` as a new rung on the audience ladder | §2.1 |
