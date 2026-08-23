import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getI18n, isLocale, loadInstrument, loadShell, DEFAULT_LOCALE, TAGS } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";
import { Report } from "@/components/report/report";

/** Somebody else's report, addressed to one reader. Never for an index. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export function generateStaticParams() {
  return TAGS.map((locale) => ({ locale }));
}

export default async function ReportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = await getI18n(locale as Locale);

  const merge = async (tag: Locale) =>
    Object.assign({}, await loadShell(tag), ...(await Promise.all(registry.all().map((m) => loadInstrument(m.spec, tag)))));
  const messages = await merge(locale as Locale);
  const fallbackMessages = locale === DEFAULT_LOCALE ? messages : await merge(DEFAULT_LOCALE);

  return (
    <Suspense fallback={<p className="py-16 text-muted">{t("runner.loading")}</p>}>
      <Report locale={locale as Locale} messages={messages} fallbackMessages={fallbackMessages} ids={registry.ids()} />
    </Suspense>
  );
}
