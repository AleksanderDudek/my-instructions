import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getI18n, isLocale, loadInstrument, loadShell, DEFAULT_LOCALE, TAGS } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";
import { Opened } from "@/components/report/opened";

/**
 * One page for every published link there will ever be.
 *
 * A static export cannot answer `/p/<id>` for an id that did not exist when the
 * site was built, so the handle rides in the fragment — and that turned out to
 * be the better design rather than the compromise. With the id in the path this
 * host's access log would record which record was opened, from where, at what
 * hour, which is most of what a log of readers would be. In the fragment, the
 * only party that learns it is the service holding the bytes, which cannot read
 * them.
 *
 * What a preview crawler fetches is therefore this page with nothing in it,
 * which is exactly what a crawler should get.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export function generateStaticParams() {
  return TAGS.map((locale) => ({ locale }));
}

export default async function PublishedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = await getI18n(locale as Locale);

  const merge = async (tag: Locale) =>
    Object.assign({}, await loadShell(tag), ...(await Promise.all(registry.all().map((m) => loadInstrument(m.spec, tag)))));
  const messages = await merge(locale as Locale);
  const fallbackMessages = locale === DEFAULT_LOCALE ? messages : await merge(DEFAULT_LOCALE);

  return (
    <Suspense fallback={<p className="py-16 text-muted">{t("runner.loading")}</p>}>
      <Opened
        locale={locale as Locale}
        messages={messages}
        fallbackMessages={fallbackMessages}
        ids={registry.ids()}
        copy={{
          loading: t("runner.loading"),
          gone: t("opened.gone"),
          goneBody: t("opened.goneBody"),
          unreadable: t("opened.unreadable"),
          missing: t("opened.missing"),
          home: t("common.goHome"),
        }}
      />
    </Suspense>
  );
}
