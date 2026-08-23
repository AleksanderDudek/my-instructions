import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link } from "@/components/ui/link";
import { getInstrumentI18n, isLocale, TAGS } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";
import { Runner } from "@/components/runner/runner";

/**
 * Taking the test is a separate route from reading about it.
 *
 * A form is not a landing page: nobody should arrive on question one from a
 * search result with no idea what they opened, and no crawler can complete it.
 * So this route is excluded from the index while `../page.tsx` — real prose
 * about the instrument, in four languages — is the thing that gets found.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * A static export has to know every page it will ever serve, so the route is
 * enumerated rather than rendered on demand. It stays `noindex` regardless:
 * being generated is not the same as being worth finding.
 */
export function generateStaticParams() {
  return TAGS.flatMap((locale) => registry.ids().map((id) => ({ locale, id })));
}

export default async function Take({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const instrument = registry.get(id);
  if (!isLocale(locale) || !instrument) notFound();

  const { spec } = instrument;
  const { i18n, scoped } = await getInstrumentI18n(spec, locale as Locale);

  // `form()` returns plain data — resolved prompts, resolved option labels, a
  // scale with its labels — so it crosses to the client island as JSON. The
  // spec's functions do not travel; the island imports its own copy.
  const form = spec.form(scoped.t, locale as Locale);

  return (
    <>
      <header className="flex flex-col gap-3 py-10">
        <Link
          href={`/${locale}/tests/${id}`}
          className="label-caps hover:text-ink"
        >
          {i18n.t("common.back")}
        </Link>
        <h1 className="text-3xl">{scoped.t("title")}</h1>
        <p className="max-w-[62ch] leading-relaxed text-muted">
          {scoped.t("tagline")}
        </p>
      </header>

      <Suspense
        fallback={
          <p className="py-16 text-muted">{i18n.t("runner.loading")}</p>
        }
      >
        <Runner
          id={id}
          locale={locale as Locale}
          form={form}
          meta={{
            version: spec.version,
            persistence: spec.persistence,
            pairwise: spec.pairwise,
          }}
          pairwise={Boolean(spec.pairwise)}
          copy={{
            count: i18n.raw("runner.count"),
            page: i18n.raw("runner.page"),
            remaining: i18n.raw("runner.remaining"),
            next: i18n.t("runner.next"),
            back: i18n.t("common.back"),
            finish: i18n.t("runner.finish"),
            loading: i18n.t("runner.loading"),
          }}
        />
      </Suspense>
    </>
  );
}

/**
 * The island is wrapped in Suspense because it reads `useSearchParams`.
 *
 * At build time there is no URL to read, so React needs somewhere to stop and
 * emit the fallback into the static HTML; the real value arrives in the
 * browser. Without the boundary the prerender throws rather than degrading,
 * which is the right way round — a silently empty query string would have
 * meant the second person of a pair overwriting the first.
 */
