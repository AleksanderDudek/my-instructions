import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getI18n, isLocale, loadInstrument, loadShell, DEFAULT_LOCALE, TAGS } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";
import { Sheet } from "@/components/sheet/sheet";

/** Somebody's own sheet. Not a page for a search engine to keep a copy of. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export function generateStaticParams() {
  return TAGS.map((locale) => ({ locale }));
}

export default async function Instructions({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = await getI18n(locale as Locale);

  // The sheet can draw a card from any instrument, so it needs every table.
  // They are sent as data rather than imported by the client, which keeps the
  // instrument *code* lazy while the words arrive with the page.
  const merge = async (tag: Locale) =>
    Object.assign({}, await loadShell(tag), ...(await Promise.all(registry.all().map((m) => loadInstrument(m.spec, tag)))));
  const messages = await merge(locale as Locale);
  const fallbackMessages = locale === DEFAULT_LOCALE ? messages : await merge(DEFAULT_LOCALE);

  return (
    <Sheet
      locale={locale as Locale}
      messages={messages}
      fallbackMessages={fallbackMessages}
      copy={{
        loading: t("runner.loading"),
        emptyTitle: t("sheet.emptyTitle"),
        emptyBody: t("sheet.emptyBody"),
        emptyAction: t("sheet.emptyAction"),
        print: t("sheet.print"),
        edit: t("sheet.editHeading"),
      }}
    />
  );
}
