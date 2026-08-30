import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getI18n, isLocale, loadInstrument, TAGS } from "@/core/locales";
import { registry } from "@/instruments";
import { TRACK_LIST } from "@/core/tracks";
import type { Locale } from "@/core/types";
import { Tracks } from "@/components/shell/tracks";

/**
 * The page for the question a reader actually arrives with.
 *
 * It is never "which of these twenty-four instruments" — it is "I am seeing
 * somebody new", or "my team keeps misreading me", or "I want to understand
 * myself". The catalogue answers none of those, and this is that question
 * answered as an order.
 *
 * Indexable on purpose, and the only page in the app where that is worth
 * arranging deliberately: somebody searching for what to take before getting
 * married should be able to find the route rather than the list.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { t } = await getI18n(locale);
  return {
    title: t("paths.heading"),
    description: t("paths.lead"),
    alternates: {
      canonical: `/${locale}/paths`,
      languages: Object.fromEntries(TAGS.map((tag) => [tag, `/${tag}/paths`])),
    },
  };
}

export function generateStaticParams() {
  return TAGS.map((locale) => ({ locale }));
}

const COPY_KEYS = [
  "paths.heading",
  "paths.lead",
  "paths.taken",
  "paths.next",
  "paths.count",
  "paths.endsAt",
  "paths.toSharing",
  "paths.note",
  "profiles.preset.public",
  "profiles.preset.team",
  "profiles.preset.partner",
  ...TRACK_LIST.flatMap((track) => [
    `track.${track.id}.title`,
    `track.${track.id}.lead`,
    `track.${track.id}.endsWith`,
  ]),
];

export default async function Paths({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Only the instruments the routes actually name, so a track's rows are real
  // titles in the reader's language rather than ids.
  const named = [...new Set(TRACK_LIST.flatMap((track) => track.steps))];
  const extra = Object.assign(
    {},
    ...(await Promise.all(named.map((id) => loadInstrument(registry.get(id)!.spec, locale)))),
  );
  const i18n = await getI18n(locale as Locale, extra);
  const { t } = i18n;

  /**
   * Two of these are patterns, not finished sentences.
   *
   * `t` interpolates when it resolves, so asking it for a string containing
   * `{done}` without supplying one hands back the sentence with the hole
   * *removed* — "1 of 5" arrives as " of ". They cross as raw patterns and are
   * filled in the island, the way the runner already does with its counts.
   */
  const INTERPOLATED = new Set(["paths.count", "paths.endsAt"]);
  const copy = Object.fromEntries(
    COPY_KEYS.map((key) => [key, INTERPOLATED.has(key) ? i18n.raw(key) : t(key)]),
  );

  return (
    <>
      <header className="flex flex-col gap-4 py-12">
        <h1 className="text-3xl">{t("paths.heading")}</h1>
        <p className="max-w-[62ch] leading-relaxed text-muted">{t("paths.lead")}</p>
      </header>

      <Tracks
        locale={locale as Locale}
        copy={copy}
        titleOf={Object.fromEntries(named.map((id) => [id, t(`${id}.title`)]))}
        taglineOf={Object.fromEntries(named.map((id) => [id, t(`${id}.tagline`)]))}
      />

      <p className="mt-8 max-w-[62ch] text-sm leading-relaxed text-muted">{t("paths.note")}</p>
    </>
  );
}
