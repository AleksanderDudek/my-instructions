import type { NextConfig } from "next";

/**
 * One codebase, two deployment shapes.
 *
 * `NEXT_OUTPUT=export` produces a folder of HTML that any static host serves.
 * Without it the app builds as an ordinary Next server. Both stay buildable
 * from the same source because the move between them is coming: GitHub Pages
 * forbids "providing commercial software as a service" and says a site should
 * not handle "sensitive transactions like sending passwords", so the day this
 * grows accounts and a paid tier is the day it has to live somewhere else.
 * Keeping both shapes working now makes that a change of variable rather than
 * a rewrite under time pressure.
 *
 * What the static shape gives up, and how each is covered:
 *
 *   - No proxy, so no locale redirect at the edge. `scripts/write-root-
 *     redirect.mjs` writes a real `out/index.html` that picks a language in
 *     the browser and forwards.
 *   - No server `searchParams`. The one route that reads one — `?who=b`, the
 *     second person of a pair — reads it on the client, where the runner
 *     already lives.
 *   - No image optimiser.
 *
 * Both shapes write to `.next`, and their artifacts are not interchangeable —
 * an export build leaves files that `next start` will serve as though they
 * were a server build, and it fails looking like a broken page rather than a
 * stale one. Hence `rm -rf .next out` at the head of both build scripts.
 */
const isExport = process.env.NEXT_OUTPUT === "export";

/**
 * A GitHub project page is served from `/<repo>/`, so every asset URL and
 * internal link needs that prefix compiled in. A custom domain, a user page or
 * Cloudflare Pages all serve from the root and want it empty — hence a
 * variable rather than a constant.
 */
const basePath = process.env.NEXT_BASE_PATH ?? (isExport ? "/my-instructions" : "");

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_STATIC_EXPORT: isExport ? "1" : "0" },
  ...(isExport
    ? {
        output: "export" as const,
        basePath,
        // A static host resolves `/a/b` by looking for `/a/b/index.html`.
        // Without the trailing slash a direct link to a nested route 404s on a
        // cold load while working fine after client-side navigation, which is
        // the worst possible way for it to break: invisible to whoever is
        // clicking around and total for whoever was sent the link.
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
