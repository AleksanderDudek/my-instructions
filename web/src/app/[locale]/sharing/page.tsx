import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, loadInstrument, loadShell, DEFAULT_LOCALE, TAGS } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";
import { Sharing } from "@/components/sharing/sharing";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export function generateStaticParams() {
  return TAGS.map((locale) => ({ locale }));
}

export default async function SharingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const merge = async (tag: Locale) =>
    Object.assign({}, await loadShell(tag), ...(await Promise.all(registry.all().map((m) => loadInstrument(m.spec, tag)))));
  const messages = await merge(locale as Locale);
  const fallbackMessages = locale === DEFAULT_LOCALE ? messages : await merge(DEFAULT_LOCALE);

  return <Sharing locale={locale as Locale} messages={messages} fallbackMessages={fallbackMessages} ids={registry.ids()} />;
}
