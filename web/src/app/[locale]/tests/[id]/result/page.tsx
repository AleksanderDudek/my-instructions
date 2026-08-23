import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getI18n, isLocale, loadInstrument, loadShell, DEFAULT_LOCALE } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";
import { ResultView } from "@/components/result/result-view";

/** Somebody's result is not a page for search engines to hold a copy of. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, id } = await params;
  const { who } = await searchParams;
  const module = registry.get(id);
  if (!isLocale(locale) || !module) notFound();

  const { spec } = module;
  const { t } = await getI18n(locale as Locale);

  const messages = { ...(await loadShell(locale)), ...(await loadInstrument(spec, locale)) };
  const fallbackMessages =
    locale === DEFAULT_LOCALE
      ? messages
      : { ...(await loadShell(DEFAULT_LOCALE)), ...(await loadInstrument(spec, DEFAULT_LOCALE)) };

  return (
    <>
      <header className="flex flex-col gap-3 py-10">
        <Link href={`/${locale}/tests`} className="label-caps hover:text-ink">
          {t("common.allTests")}
        </Link>
        <h1 className="text-3xl">{messages[`${spec.id}.title`]}</h1>
      </header>

      <ResultView
        id={id}
        locale={locale as Locale}
        messages={messages}
        fallbackMessages={fallbackMessages}
        slot={spec.pairwise && who === "b" ? "b" : null}
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
    </>
  );
}
