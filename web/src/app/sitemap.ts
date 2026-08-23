import type { MetadataRoute } from "next";
import { TAGS } from "@/core/locales";
import { registry } from "@/instruments";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://myinstructions.app";

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
