import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getInstrumentI18n, isLocale } from "@/core/locales";
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

export default async function Take({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, id } = await params;
  const { who } = await searchParams;
  const module = registry.get(id);
  if (!isLocale(locale) || !module) notFound();

  const { spec } = module;
  const { i18n, scoped } = await getInstrumentI18n(spec, locale as Locale);

  // `form()` returns plain data — resolved prompts, resolved option labels, a
  // scale with its labels — so it crosses to the client island as JSON. The
  // spec's functions do not travel; the island imports its own copy.
  const form = spec.form(scoped.t, locale as Locale);

  return (
    <>
      <header className="flex flex-col gap-3 py-10">
        <Link href={`/${locale}/tests/${id}`} className="label-caps hover:text-ink">
          {i18n.t("common.back")}
        </Link>
        <h1 className="text-3xl">{scoped.t("title")}</h1>
        <p className="max-w-[62ch] leading-relaxed text-muted">{scoped.t("tagline")}</p>
      </header>

      <Runner
        id={id}
        locale={locale as Locale}
        form={form}
        meta={{ version: spec.version, persistence: spec.persistence, pairwise: spec.pairwise }}
        slot={spec.pairwise && who === "b" ? "b" : null}
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
    </>
  );
}
