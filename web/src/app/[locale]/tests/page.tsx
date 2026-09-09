import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getI18n, isLocale, loadInstrument, TAGS } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";
import { Plate, PlateHead } from "@/components/ui/primitives";
import { AdultGate } from "@/components/shell/adult-gate";
import { Catalogue, type CatalogueItem } from "@/components/shell/catalogue";

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

export default async function CataloguePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Titles and taglines come from each instrument's own table, loaded here on
  // the server so the catalogue is indexable text rather than a spinner.
  const extra = Object.assign({}, ...(await Promise.all(registry.all().map((m) => loadInstrument(m.spec, locale)))));
  const { t } = await getI18n(locale as Locale, extra);

  const groups = registry.groups();

  /** The words a card shows, resolved here so the client list ships no `t`. */
  const itemsOf = (group: (typeof groups)[number]): CatalogueItem[] =>
    group.items.map(({ spec }) => ({
      id: spec.id,
      glyph: spec.glyph,
      title: t(`${spec.id}.title`),
      tagline: t(`${spec.id}.tagline`),
      minutes: t("common.minutes", { count: spec.minutes }),
      framework: t(`${spec.id}.framework`),
      premium: spec.tier === "premium" ? t("tier.premium") : null,
    }));

  return (
    <>
      <header className="flex flex-col gap-4 py-8 sm:py-12">
        <h1>{t("catalog.heading")}</h1>
        <p className="max-w-[62ch] leading-relaxed text-muted">{t("catalog.lead")}</p>

        {/*
          A jump index, because twenty-seven instruments in four groups is
          fourteen thousand pixels of phone scroll and the group you want may be
          the last one. Anchors rather than a filter: a filter would hide things,
          and every instrument staying reachable is the rule the catalogue is
          built on.
        */}
        <nav aria-label={t("catalog.heading")} className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <a
              key={group.family}
              href={`#group-${group.family}`}
              className="tap rounded-full border border-rule px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-brass hover:text-ink"
            >
              {t(group.labelKey)}
              <span className="num ml-2 text-faint">{group.items.length}</span>
            </a>
          ))}
        </nav>
      </header>

      {groups.map((group) => (
        <Plate key={group.family} className="scroll-mt-24" id={`group-${group.family}`}>
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
              <Catalogue locale={locale as Locale} items={itemsOf(group)} takenLabel={t("paths.taken")} />
            </AdultGate>
          ) : (
            <Catalogue locale={locale as Locale} items={itemsOf(group)} takenLabel={t("paths.taken")} />
          )}
        </Plate>
      ))}
    </>
  );
}
