import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";
import { Fraunces, Spectral, IBM_Plex_Mono } from "next/font/google";
import { TAGS, isLocale, getI18n, LOCALES } from "@/core/locales";
import type { Locale } from "@/core/types";
import { Nav } from "@/components/shell/nav";
import { StoreProvider } from "@/components/shell/store-provider";
import "../globals.css";

/**
 * This is the root layout.
 *
 * Every route in the app sits under `[locale]`, so this segment is the first
 * one every request passes through — which means it owns `<html>` and can set
 * `lang` from the parameter directly. The alternative, a pass-through root
 * layout above it, forces the language onto the document from a client script
 * after hydration, and a page whose `lang` is wrong until JavaScript runs is a
 * page screen readers announce in the wrong language.
 *
 * Requests without a locale prefix never reach here; `proxy.ts` redirects them.
 */

const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-fraunces", display: "swap" });
const spectral = Spectral({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "600"],
  variable: "--font-spectral",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

/** Four locales, four static shells. Nothing about this layout is dynamic. */
export function generateStaticParams() {
  return TAGS.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0d13" },
    { media: "(prefers-color-scheme: light)", color: "#efe9dc" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { t } = await getI18n(locale);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://myinstructions.app"),
    title: { default: t("app.title"), template: `%s · ${t("app.title")}` },
    description: t("app.tagline"),
    // Every locale advertises every other. Without this, four translations of
    // one page compete with each other in search instead of consolidating into
    // one result that is served in the reader's language.
    alternates: {
      canonical: `/${locale}`,
      languages: { ...Object.fromEntries(TAGS.map((tag) => [tag, `/${tag}`])), "x-default": "/en" },
    },
    openGraph: { type: "website", locale, siteName: t("app.title"), title: t("app.title"), description: t("app.tagline") },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { t } = await getI18n(locale as Locale);

  return (
    /*
     * The font variables go on <html>, not <body>, and the difference is the
     * whole typographic identity.
     *
     * `@theme` declares `--font-display: var(--font-fraunces), Georgia, serif`
     * on `:root`. A custom property is substituted at the element that
     * *declares* it, so that inner `var()` is resolved against `:root` — and
     * with next/font's classes on <body>, `--font-fraunces` is undefined
     * there. `--font-display` then computes to guaranteed-invalid, every
     * `font-family: var(--font-display)` is invalid at computed-value time,
     * and the whole app silently renders in Tailwind's default sans stack.
     *
     * It looked fine, which is why it survived the port: a serif app rendering
     * in system sans is not a broken page, just a different and much duller
     * one. Putting the classes on the element that `:root` selects is the fix.
     */
    <html lang={locale} className={`${fraunces.variable} ${spectral.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body>
        <StoreProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:border focus:border-brass focus:bg-panel focus:px-4 focus:py-2"
          >
            {t("a11y.skipToContent")}
          </a>
          {/*
            The line the whole app is answered by.

            It sits above the navigation rather than inside it because it is
            not a control: nothing here is clickable, and a reader tabbing
            through the header should not have to pass it. Sticky, so the
            claim stays on screen while the tests below it do their measuring.
          */}
          <div className="sticky top-0 z-40 border-b border-brass/25 bg-ground/85 backdrop-blur-sm">
            <p className="mx-auto max-w-5xl px-4 py-2 text-center font-display text-[0.82rem] leading-snug text-balance text-brass-hi sm:px-5 sm:py-2.5 sm:text-[0.95rem]">
              {t("app.benediction")}
            </p>
          </div>

          {/*
            `pb` clears the phone tab bar (56px plus the safe-area inset) with
            room to spare, so the last card on a page is never the one sitting
            under the navigation. From `sm` the bar is gone and the padding is
            only page-bottom breathing room.
          */}
          <div className="mx-auto w-full max-w-5xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-5 sm:pb-32">
            <Nav
              locale={locale as Locale}
              labels={{
                title: t("app.title"),
                home: t("nav.home"),
                paths: t("nav.paths"),
                tests: t("nav.tests"),
                instructions: t("nav.instructions"),
                sharing: t("nav.sharing"),
                panel: t("nav.panel"),
                language: t("app.language"),
              }}
              locales={LOCALES.map((l) => ({ tag: l.tag, endonym: l.endonym }))}
            />
            <main id="main">{children}</main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
