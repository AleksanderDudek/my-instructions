import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://myinstructions.app";

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
