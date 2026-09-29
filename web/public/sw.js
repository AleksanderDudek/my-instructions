/*
 * The service worker: what lets My Instructions open without a connection.
 *
 * Everything a reader writes lives in their browser's storage already; what
 * a connection was still needed for is the app itself. This keeps the app's
 * own files and nothing else:
 *
 *   - Built assets (`/_next/static/…`, content-hashed) and the brand art are
 *     immutable, so they are served from cache first and fetched only once.
 *   - Pages and the payloads client navigation fetches are network-first: a
 *     reader online always gets the current deploy, and the copy kept is what
 *     they see when they are not.
 *   - Other origins (the publish endpoint) and anything but GET pass straight
 *     through. Nothing a reader answered is ever in a request this touches.
 *
 * Bump VERSION to drop every cache on the next visit.
 */
const VERSION = "v1";
const STATIC = `mi-static-${VERSION}`;
const PAGES = `mi-pages-${VERSION}`;
const PAGE_LIMIT = 200;

const SCOPE = new URL(self.registration.scope).pathname; // "/" or "/my-instructions/"

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([STATIC, PAGES]);
      for (const name of await caches.keys()) if (name.startsWith("mi-") && !keep.has(name)) await caches.delete(name);
      await self.clients.claim();
    })(),
  );
});

const isImmutable = (url) =>
  url.pathname.startsWith(`${SCOPE}_next/static/`) || url.pathname.startsWith(`${SCOPE}brand/`);

/** Only complete, same-origin, unredirected answers are worth keeping. */
const keepable = (response) => response && response.ok && response.type === "basic" && !response.redirected;

async function trim(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - PAGE_LIMIT; i++) await cache.delete(keys[i]);
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (keepable(response)) await cache.put(request, response.clone());
  return response;
}

async function networkFirst(request, navigation) {
  const cache = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    if (keepable(response)) {
      await cache.put(request, response.clone());
      await trim(cache);
    }
    return response;
  } catch (error) {
    const hit = await cache.match(request, { ignoreVary: navigation });
    if (hit) return hit;
    if (navigation) return offline(request);
    throw error;
  }
}

/**
 * A page never opened while online. Its language's home is kept if any page
 * of that language was, so the reader lands somewhere that works; failing
 * that, a plain page that says what happened in all four languages.
 */
async function offline(request) {
  const locale = new URL(request.url).pathname.slice(SCOPE.length).split("/")[0];
  const cache = await caches.open(PAGES);
  for (const candidate of [`${SCOPE}${locale}/`, `${SCOPE}${locale}`]) {
    const hit = await cache.match(new URL(candidate, self.location.origin).href, { ignoreVary: true });
    if (hit) return hit;
  }
  const body = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline</title></head>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#130c0b;color:#f3ead3;font:16px/1.6 Georgia,serif;text-align:center;padding:24px">
<main><p>You are offline, and this page has not been opened on this device yet.</p>
<p lang="pl">Jesteś offline, a ta strona nie była jeszcze otwierana na tym urządzeniu.</p>
<p lang="es">Estás sin conexión y esta página aún no se ha abierto en este dispositivo.</p>
<p lang="de">Du bist offline, und diese Seite wurde auf diesem Gerät noch nicht geöffnet.</p></main></body></html>`;
  return new Response(body, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

/*
 * The first visit loads before this worker controls anything, so none of it
 * went through the handlers below. The page sends the URLs it already has
 * once the worker is ready, and they are kept here as though they had.
 */
self.addEventListener("message", (event) => {
  if (event.data?.type !== "keep" || !Array.isArray(event.data.urls)) return;
  event.waitUntil(
    (async () => {
      for (const href of event.data.urls.slice(0, 100)) {
        const url = new URL(href, self.location.origin);
        if (url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE)) continue;
        const cache = await caches.open(isImmutable(url) ? STATIC : PAGES);
        if (await cache.match(url.href)) continue;
        try {
          const response = await fetch(url.href, { credentials: "same-origin" });
          if (keepable(response)) await cache.put(url.href, response);
        } catch {
          // Offline already, or gone: nothing to keep, nothing to report.
        }
      }
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE)) return;
  if (url.pathname === `${SCOPE}sw.js`) return;

  if (isImmutable(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  event.respondWith(networkFirst(request, request.mode === "navigate"));
});
