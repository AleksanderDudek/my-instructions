import { Link } from "@/components/ui/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getInstrumentI18n, isLocale, TAGS } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";
import { Card, Plate, PlateHead, Prose } from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button-styles";

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
        <Link href={`/${locale}/tests`} className="label-caps hidden self-start hover:text-ink sm:inline">
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
            className={buttonClass({ variant: "primary" })}
          >
            {t("instrument.start")}
          </Link>
        </div>
      </header>

      <Plate>
        <PlateHead title={t("instrument.whatThisIs")} />
        <Prose>{it("sourceNote")}</Prose>
      </Plate>

      {/*
        Where it comes from: the framework's record beside ours. Putting them
        side by side is the argument — the idea may be old, serious and
        replicated, and these questions are still unmeasured, and a reader
        should see both claims without being able to mistake one for the
        other. Every value is a translated word, never a field printed raw;
        the long disclaimer is one tap away rather than a wall under it.
      */}
      <Plate>
        <PlateHead title={t("instrument.provenance")} note={t("instrument.provenanceNote")} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="flex flex-col gap-2">
            <span className="label-caps">{t("provenance.framework")}</span>
            <h3 className="text-lg">{it("framework")}</h3>
            <p className="text-[0.95rem] leading-relaxed text-ink/90">{it("lineage")}</p>
          </Card>

          <Card className="flex flex-col gap-3">
            <span className="label-caps">{t("provenance.ours")}</span>
            <p className="font-display text-lg">{t(`provenance.origin.${provenance.items.origin}`)}</p>
            {spec.family === "inventory" ? (
              // An inventory measures nothing by design; three rows of "not
              // measured" would read as a shortfall rather than as the point.
              <p className="text-[0.95rem] leading-relaxed text-ink/90">{t("provenance.inventory")}</p>
            ) : (
              <dl className="flex flex-col">
                {(["reliability", "factorStructure", "criterion"] as const).map((k) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-t border-rule py-2">
                    <dt className="label-caps">{t(`provenance.${k}`)}</dt>
                    <dd className="text-right text-[0.95rem] text-ink/90">
                      {t(`provenance.evidence.${provenance.evidence[k]}`)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </Card>
        </div>

        {provenance.references?.length ? (
          <>
            <h3 className="label-caps mt-8">{t("provenance.reading")}</h3>
            <ul className="mt-3 flex flex-col">
              {provenance.references.map((ref) => (
                <li
                  key={`${ref.authors}-${ref.year}-${ref.title}`}
                  className="flex flex-col gap-1 border-t border-rule py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  {/* A citation is quoted as written, never translated; `lang`
                      tells a screen reader which voice to read it in. */}
                  <span className="max-w-[68ch] text-[0.95rem] leading-relaxed text-ink/90">
                    {ref.authors} ({ref.year}).{" "}
                    {ref.url ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        lang={ref.lang ?? "en"}
                        className="text-brass underline underline-offset-4 hover:text-brass-hi"
                      >
                        {ref.title}
                        <span className="sr-only"> ({t("provenance.opensNewTab")})</span>
                      </a>
                    ) : (
                      <cite lang={ref.lang ?? "en"} className="not-italic">
                        {ref.title}
                      </cite>
                    )}
                    {/[.?!]$/.test(ref.title) ? "" : "."}
                    {ref.source ? <span className="text-muted"> {ref.source}</span> : null}
                  </span>
                  <span className="label-caps shrink-0">
                    {t(`provenance.kind.${ref.kind}`)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <p className="mt-6 max-w-[62ch] leading-relaxed text-ink/90">{t("provenance.readAs")}</p>
        <details className="group mt-2 max-w-[62ch]">
          <summary className="tap flex cursor-pointer list-none items-center gap-2 text-[0.95rem] text-brass hover:text-brass-hi [&::-webkit-details-marker]:hidden">
            <span aria-hidden className="inline-block text-lg leading-none group-open:rotate-90">
              ›
            </span>
            <span className="underline underline-offset-4">{t("provenance.why")}</span>
          </summary>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{t("app.noValidation")}</p>
        </details>
      </Plate>
    </>
  );
}
