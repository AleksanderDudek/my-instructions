import { Link } from "@/components/ui/link";
import { getI18n, isLocale } from "@/core/locales";
import { registry } from "@/instruments";
import type { Locale } from "@/core/types";
import { notFound } from "next/navigation";
import { Plate, PlateHead, Prose } from "@/components/ui/primitives";
import { Rail } from "@/components/onboarding/rail";
import { buttonClass } from "@/components/ui/button-styles";
import { Uriel } from "@/components/brand/art";
import { cn } from "@/lib/cn";

/**
 * The home page is the onboarding.
 *
 * There is no separate welcome route and no modal, per §1 of the approved
 * onboarding design: the explanation belongs where somebody needs it, and a
 * reader who dismisses a carousel has learned nothing and spent the app's one
 * first impression. What is here instead is the claim, the two buttons, and a
 * rail of three steps whose state comes from what is actually in the store —
 * so the same page serves a first visit and a fifth one without a flag
 * deciding which of two pages to render.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = await getI18n(locale as Locale);
  const total = registry.all().length;

  return (
    <>
      <header className="flex flex-col gap-5 py-10 sm:gap-6 sm:py-16">
        {/*
          Uriel greets beside the claim rather than above it: at 390px a
          panel on its own row pushes the two buttons below the fold, and the
          buttons are the point of this screen.
        */}
        <div className="flex items-end justify-between gap-4">
          <h1 className="max-w-[16ch] min-w-0">{t("home.titleAnon")}</h1>
          <Uriel mood="hello" className="w-[120px] sm:w-[160px]" width={160} />
        </div>
        <Prose className="text-[1.05rem] sm:text-lg">{t("home.lead")}</Prose>
        {/*
          Full-width buttons on a phone and shrink-wrapped from `sm`. A pair of
          auto-width buttons at 390px leaves a ragged half-row that reads as a
          layout fault, and the primary action ends up under the thumb either
          way — so let them fill the column instead of pretending to be a
          desktop toolbar.
        */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={`/${locale}/paths`}
            className={cn(buttonClass({ variant: "primary" }), "text-center")}
          >
            {t("home.startFirst")}
          </Link>
          <Link
            href={`/${locale}/instructions`}
            className={cn(buttonClass(), "text-center")}
          >
            {t("home.readSheet")}
          </Link>
        </div>
      </header>

      <Rail
        locale={locale as Locale}
        copy={{
          heading: t("start.heading"),
          lead: t("start.lead"),
          stepLabels: [1, 2, 3].map((n) => t("start.stepLabel", { n })),
          doneLabel: t("start.doneLabel"),
          nowLabel: t("start.nowLabel"),
          step1Title: t("start.step1Title"),
          step1Body: t("start.step1Body"),
          step1Cta: t("start.step1Cta"),
          step2Title: t("start.step2Title"),
          step2Body: t("start.step2Body"),
          step2Cta: t("start.step2Cta"),
          step2Locked: t("start.step2Locked"),
          step3Title: t("start.step3Title"),
          step3Body: t("start.step3Body"),
          step3Cta: t("start.step3Cta"),
          doneTitle: t("start.doneTitle"),
          doneBody: t("start.doneBody"),
          doneCta: t("start.doneCta"),
        }}
      />

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
