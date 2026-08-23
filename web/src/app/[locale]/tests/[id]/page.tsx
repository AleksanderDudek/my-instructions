import { Link } from "@/components/ui/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getInstrumentI18n, isLocale, TAGS } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";
import { Plate, PlateHead, Prose } from "@/components/ui/primitives";

/**
 * The indexable page for one instrument.
 *
 * This exists as a route of its own, separate from taking the test, and that
 * split is the entire search strategy. Sixteen instruments across four locales
 * is sixty-four static pages of real prose about a thing people search for by
 * name — while the runner, which is a form nobody should land on cold and
 * which no crawler can complete, stays out of the index.
 */

export function generateStaticParams() {
  return TAGS.flatMap((locale) => registry.ids().map((id) => ({ locale, id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const instrument = registry.get(id);
  if (!isLocale(locale) || !instrument) return {};
  const { scoped } = await getInstrumentI18n(instrument.spec, locale);
  const path = (tag: string) => `/${tag}/tests/${id}`;
  return {
    title: scoped.t("title"),
    description: scoped.t("tagline"),
    alternates: { canonical: path(locale), languages: Object.fromEntries(TAGS.map((tag) => [tag, path(tag)])) },
    openGraph: { type: "article", title: scoped.t("title"), description: scoped.t("tagline"), locale },
    // Adult instruments stay out of the index entirely. A description page for
    // an explicit questionnaire is not something to compete for traffic on.
    robots: instrument.spec.adult ? { index: false, follow: false } : undefined,
  };
}

export default async function InstrumentPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const instrument = registry.get(id);
  if (!isLocale(locale) || !instrument) notFound();

  const { spec, provenance } = instrument;
  const { i18n, scoped } = await getInstrumentI18n(spec, locale as Locale);
  const { t } = i18n;
  const it = scoped.t;
  const form = spec.form(it, locale as Locale);
  const count = form.kind === "items" ? form.items.length : form.fields.length;

  return (
    <>
      <script
        type="application/ld+json"
        // Marked up as a Quiz rather than an Article: it is the type search
        // engines actually have for this, and it carries the question count
        // and the time estimate that people are choosing between.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Quiz",
            name: it("title"),
            description: it("tagline"),
            inLanguage: locale,
            educationalLevel: it("framework"),
            timeRequired: `PT${spec.minutes}M`,
            isAccessibleForFree: spec.tier === "free",
            numberOfQuestions: count,
          }),
        }}
      />

      <header className="flex flex-col gap-5 py-14">
        <Link href={`/${locale}/tests`} className="label-caps hover:text-ink">
          {t("common.allTests")}
        </Link>
        <div className="flex items-start gap-5">
          <span aria-hidden className="font-display text-5xl text-brass">
            {spec.glyph}
          </span>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl">{it("title")}</h1>
            <Prose className="text-lg">{it("tagline")}</Prose>
          </div>
        </div>

        <dl className="flex flex-wrap gap-x-8 gap-y-3">
          {[
            [t("instrument.questions"), String(count)],
            [t("common.minutes", { count: spec.minutes }), it("framework")],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="label-caps">{k}</dt>
              <dd className="num text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        <div>
          <Link
            href={`/${locale}/tests/${id}/take`}
            className="inline-block rounded-sm border border-brass bg-brass/10 px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-brass-hi hover:bg-brass/20"
          >
            {t("instrument.start")}
          </Link>
        </div>
      </header>

      <Plate>
        <PlateHead title={t("instrument.whatThisIs")} />
        <Prose>{it("sourceNote")}</Prose>
      </Plate>

      <Plate>
        <PlateHead title={t("instrument.provenance")} note={t("instrument.provenanceNote")} />
        <dl className="grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
          {[
            [t("instrument.construct"), provenance.construct.name],
            [t("instrument.items"), provenance.items.origin],
            [t("instrument.reliability"), provenance.evidence.reliability],
            [t("instrument.factors"), provenance.evidence.factorStructure],
          ].map(([k, v]) => (
            <div key={k} className="bg-panel p-4">
              <dt className="label-caps mb-1">{k}</dt>
              <dd className="text-[0.95rem] text-ink/90">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted">{t("app.noValidation")}</p>
      </Plate>
    </>
  );
}
