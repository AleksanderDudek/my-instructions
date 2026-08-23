import type { MetadataRoute } from "next";

/**
 * A static export has no request to respond to, so this file has to be a
 * build-time artifact rather than a route handler. Next needs to be told that
 * explicitly; without it the export fails rather than silently omitting the
 * file, which is the right way round.
 */
export const dynamic = "force-static";

// The site URL and the path the app is mounted at are two different things:
// a GitHub project page lives at `https://user.github.io/my-instructions`, and
// a sitemap that omits the second half publishes URLs that all 404.
const BASE = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://myinstructions.app"}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Answering, reading a result, and the sheet are all personal or
      // uncrawlable. Excluding them here as well as with per-route metadata is
      // deliberate: the sitemap says what to fetch, this says what not to.
      disallow: ["/*/tests/*/take", "/*/tests/*/result", "/*/instructions", "/*/sharing", "/*/panel", "/*/report"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
