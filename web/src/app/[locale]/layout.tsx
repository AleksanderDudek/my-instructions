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
    <html lang={locale} suppressHydrationWarning>
      <body className={`${fraunces.variable} ${spectral.variable} ${plexMono.variable}`}>
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
            <p className="mx-auto max-w-5xl px-5 py-2.5 text-center font-display text-[0.95rem] leading-snug text-balance text-brass-hi">
              {t("app.benediction")}
            </p>
          </div>

          <div className="mx-auto w-full max-w-5xl px-5 pb-32">
            <Nav
              locale={locale as Locale}
              labels={{
                title: t("app.title"),
                home: t("nav.home"),
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
