import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getI18n, isLocale, TAGS, LOCALES } from "@/core/locales";
import type { Locale } from "@/core/types";
import { Panel } from "@/components/panel/panel";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export function generateStaticParams() {
  return TAGS.map((locale) => ({ locale }));
}

const KEYS = [
  "heading", "lead", "headingSection", "headingNote", "displayName", "displayNamePlaceholder",
  "pronouns", "pronounsPlaceholder", "opening", "openingPlaceholder", "save", "saved",
  "resultsSection", "noResults", "dataSection", "storageOk", "storageBad",
  "export", "import", "imported", "wipe", "wipeConfirm", "languageSection", "languageNote",
] as const;

export default async function PanelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = await getI18n(locale as Locale);

  const copy: Record<string, string> = { loading: t("runner.loading") };
  for (const key of KEYS) copy[key] = t(`profile.${key}`);

  return <Panel locale={locale as Locale} locales={LOCALES.map((l) => ({ tag: l.tag, endonym: l.endonym }))} copy={copy} />;
}
