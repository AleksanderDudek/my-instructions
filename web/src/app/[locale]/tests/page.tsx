import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getI18n, isLocale, loadInstrument, TAGS } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";
import { Plate, PlateHead } from "@/components/ui/primitives";
import { AdultGate } from "@/components/shell/adult-gate";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { t } = await getI18n(locale);
  return {
    title: t("catalog.heading"),
    description: t("catalog.lead"),
    alternates: { canonical: `/${locale}/tests`, languages: Object.fromEntries(TAGS.map((tag) => [tag, `/${tag}/tests`])) },
  };
}

export function generateStaticParams() {
  return TAGS.map((locale) => ({ locale }));
}

export default async function Catalogue({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Titles and taglines come from each instrument's own table, loaded here on
  // the server so the catalogue is indexable text rather than a spinner.
  const extra = Object.assign({}, ...(await Promise.all(registry.all().map((m) => loadInstrument(m.spec, locale)))));
  const { t } = await getI18n(locale as Locale, extra);

  return (
    <>
      <header className="flex flex-col gap-4 py-12">
        <h1 className="text-3xl">{t("catalog.heading")}</h1>
        <p className="max-w-[62ch] leading-relaxed text-muted">{t("catalog.lead")}</p>
      </header>

      {registry.groups().map((group) => (
        <Plate key={group.family}>
          <PlateHead title={t(group.labelKey)} note={t(group.noteKey)} />
          {group.gated ? (
            <AdultGate
              count={group.items.length}
              copy={{
                body: t("catalog.gate.body", { count: group.items.length }),
                fine: t("catalog.gate.fine"),
                confirm: t("catalog.gate.confirm"),
              }}
            >
              <Cards locale={locale as Locale} items={group.items} t={t} />
            </AdultGate>
          ) : (
            <Cards locale={locale as Locale} items={group.items} t={t} />
          )}
        </Plate>
      ))}
    </>
  );
}

function Cards({
  locale,
  items,
  t,
}: {
  locale: Locale;
  items: ReturnType<typeof registry.all>;
  t: (key: string, vars?: Record<string, string | number>) => string;
}) {
  return (
    <div className="grid gap-3">
      {items.map(({ spec }) => (
        <Link
          key={spec.id}
          href={`/${locale}/tests/${spec.id}`}
          className="group flex items-start gap-4 rounded-sm border border-rule bg-panel-2 p-5 transition-colors hover:border-brass"
        >
          <span aria-hidden className="font-display text-2xl text-brass">
            {spec.glyph}
          </span>
          <span className="flex-1">
            <span className="mb-1 block font-display text-lg font-semibold">{t(`${spec.id}.title`)}</span>
            <span className="mb-3 block max-w-[58ch] text-sm leading-relaxed text-muted">{t(`${spec.id}.tagline`)}</span>
            <span className="flex flex-wrap gap-2">
              <span className="label-caps rounded-full border border-rule px-2 py-0.5">
                {t("common.minutes", { count: spec.minutes })}
              </span>
              <span className="label-caps rounded-full border border-rule px-2 py-0.5">{t(`${spec.id}.framework`)}</span>
              {spec.tier === "premium" ? (
                <span className="label-caps rounded-full border border-brass/50 px-2 py-0.5 text-brass">
                  {t("tier.premium")}
                </span>
              ) : null}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
