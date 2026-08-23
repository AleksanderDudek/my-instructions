import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link } from "@/components/ui/link";
import {
  getI18n,
  isLocale,
  loadInstrument,
  loadShell,
  DEFAULT_LOCALE,
  TAGS,
} from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";
import { ResultView } from "@/components/result/result-view";

/** Somebody's result is not a page for search engines to hold a copy of. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Enumerated for the static export; still `noindex`. */
export function generateStaticParams() {
  return TAGS.flatMap((locale) => registry.ids().map((id) => ({ locale, id })));
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const instrument = registry.get(id);
  if (!isLocale(locale) || !instrument) notFound();

  const { spec } = instrument;
  const { t } = await getI18n(locale as Locale);

  const messages = {
    ...(await loadShell(locale)),
    ...(await loadInstrument(spec, locale)),
  };
  const fallbackMessages =
    locale === DEFAULT_LOCALE
      ? messages
      : {
          ...(await loadShell(DEFAULT_LOCALE)),
          ...(await loadInstrument(spec, DEFAULT_LOCALE)),
        };

  return (
    <>
      <header className="flex flex-col gap-3 py-10">
        <Link href={`/${locale}/tests`} className="label-caps hover:text-ink">
          {t("common.allTests")}
        </Link>
        <h1 className="text-3xl">{messages[`${spec.id}.title`]}</h1>
      </header>

      <Suspense
        fallback={<p className="py-16 text-muted">{t("runner.loading")}</p>}
      >
        <ResultView
          id={id}
          locale={locale as Locale}
          messages={messages}
          fallbackMessages={fallbackMessages}
          pairwise={Boolean(spec.pairwise)}
          copy={{
            empty: t("result.emptyTitle"),
            emptyBody: t("result.emptyBody"),
            emptyAction: t("result.emptyAction"),
            loading: t("runner.loading"),
            retake: t("result.retake"),
            sheet: t("nav.instructions"),
            stale: t("result.stale", { had: 1, now: spec.version }),
          }}
        />
      </Suspense>
    </>
  );
}

/**
 * The island is wrapped in Suspense because it reads `useSearchParams`.
 *
 * At build time there is no URL to read, so React needs somewhere to stop and
 * emit the fallback into the static HTML; the real value arrives in the
 * browser. Without the boundary the prerender throws rather than degrading,
 * which is the right way round — a silently empty query string would have
 * meant the second person of a pair overwriting the first.
 */
