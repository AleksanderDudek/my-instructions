import Link from "next/link";
import { getI18n, isLocale } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";
import { notFound } from "next/navigation";
import { Plate, PlateHead, Prose } from "@/components/ui/primitives";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = await getI18n(locale as Locale);
  const total = registry.all().length;

  return (
    <>
      <header className="flex flex-col gap-6 py-16">
        <h1 className="max-w-[18ch] text-4xl sm:text-5xl">{t("home.titleAnon")}</h1>
        <Prose className="text-lg">{t("home.lead")}</Prose>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}/tests`}
            className="rounded-sm border border-brass bg-brass/10 px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-brass-hi hover:bg-brass/20"
          >
            {t("home.startFirst")}
          </Link>
          <Link
            href={`/${locale}/instructions`}
            className="rounded-sm border border-rule px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink hover:border-brass"
          >
            {t("home.readSheet")}
          </Link>
        </div>
      </header>

      <Plate>
        <PlateHead title={t("home.howHeading")} />
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ["home.how1Title", "home.how1Body"],
            ["home.how2Title", "home.how2Body"],
            ["home.how3Title", "home.how3Body"],
          ].map(([title, body]) => (
            <div key={title} className="flex flex-col gap-2">
              <h3 className="text-base">{t(title)}</h3>
              <p className="text-sm leading-relaxed text-muted">{t(body, { count: total })}</p>
            </div>
          ))}
        </div>
      </Plate>
    </>
  );
}
