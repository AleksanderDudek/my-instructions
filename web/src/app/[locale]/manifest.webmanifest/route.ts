import type { MetadataRoute } from "next";
import { getI18n, isLocale, TAGS } from "@/core/locales";
import type { Locale } from "@/core/types";
import { GROUND } from "@/core/theme";

/**
 * One web app manifest per language.
 *
 * Next's `app/manifest.ts` convention makes one manifest for the whole site,
 * which would install "My Instructions" starting in English on a Polish
 * phone. Each locale's layout links its own instead, so the home-screen name,
 * the description and the start page are the reader's language — and the
 * scope is the whole app, so switching language inside it stays inside it.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return TAGS.map((locale) => ({ locale }));
}

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
// The static host resolves `/en/` to `/en/index.html`; the server resolves `/en`.
const slash = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1" ? "/" : "";

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response(null, { status: 404 });
  const { t } = await getI18n(locale as Locale);
  const at = (path: string) => `${base}/${locale}${path}${slash}`;

  const manifest: MetadataRoute.Manifest = {
    id: at(""),
    name: t("app.title"),
    short_name: t("app.shortName"),
    description: t("app.tagline"),
    lang: locale,
    dir: "ltr",
    start_url: at(""),
    scope: `${base}/`,
    display: "standalone",
    // The splash is the night window, the primary world: whichever theme the
    // reader chose, the first frame is dark glass rather than a white flash.
    background_color: GROUND.dark,
    theme_color: GROUND.dark,
    categories: ["lifestyle", "education", "social"],
    icons: [
      { src: `${base}/brand/app/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${base}/brand/app/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${base}/brand/app/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: t("nav.tests"), url: at("/tests"), icons: [{ src: `${base}/brand/app/shortcut-tests-96.png`, sizes: "96x96" }] },
      {
        name: t("nav.instructions"),
        url: at("/instructions"),
        icons: [{ src: `${base}/brand/app/shortcut-sheet-96.png`, sizes: "96x96" }],
      },
      { name: t("nav.sharing"), url: at("/sharing"), icons: [{ src: `${base}/brand/app/shortcut-share-96.png`, sizes: "96x96" }] },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  });
}
