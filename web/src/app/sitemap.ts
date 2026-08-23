import type { MetadataRoute } from "next";

/**
 * A static export has no request to respond to, so this file has to be a
 * build-time artifact rather than a route handler. Next needs to be told that
 * explicitly; without it the export fails rather than silently omitting the
 * file, which is the right way round.
 */
export const dynamic = "force-static";
import { TAGS } from "@/core/locales";
import { registry } from "@/instruments";

// The site URL and the path the app is mounted at are two different things:
// a GitHub project page lives at `https://user.github.io/my-instructions`, and
// a sitemap that omits the second half publishes URLs that all 404.
const BASE = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://myinstructions.app"}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;

/**
 * Only what a stranger should be able to find.
 *
 * The runner, the result and the sheet are all excluded: two of them are
 * personal and the third is a form. What is listed is the landing page, the
 * catalogue, and one description page per instrument per language — and adult
 * instruments are left out of that entirely.
 *
 * Every entry carries `alternates.languages`, which is what tells a search
 * engine that four URLs are one page in four languages rather than four pages
 * competing with each other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const listed = registry.all().filter((m) => !m.spec.adult);

  const withAlternates = (path: (tag: string) => string, priority: number): MetadataRoute.Sitemap =>
    TAGS.map((tag) => ({
      url: `${BASE}${path(tag)}`,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: Object.fromEntries(TAGS.map((other) => [other, `${BASE}${path(other)}`])) },
    }));

  return [
    ...withAlternates((tag) => `/${tag}`, 1),
    ...withAlternates((tag) => `/${tag}/tests`, 0.9),
    ...listed.flatMap((m) => withAlternates((tag) => `/${tag}/tests/${m.spec.id}`, 0.8)),
  ];
}
