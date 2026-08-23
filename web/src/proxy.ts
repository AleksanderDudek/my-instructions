import { NextResponse, type NextRequest } from "next/server";
import { TAGS, DEFAULT_LOCALE, parseAcceptLanguage, resolveLocale } from "@/core/locales";

/**
 * Send every unprefixed request to a language.
 *
 * Next 16 renames `middleware.ts` to `proxy.ts` and the exported function with
 * it; this is the 16 shape, not the 15 one.
 *
 * The choice is made from a cookie first and `Accept-Language` second, and it
 * is a redirect rather than a rewrite: the URL a reader sees, copies and
 * shares should say which language they are reading, or a Polish link opens in
 * English for the person they send it to.
 */
const LOCALE_COOKIE = "mi_locale";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = TAGS.some((tag) => pathname === `/${tag}` || pathname.startsWith(`/${tag}/`));
  if (hasLocale) return NextResponse.next();

  const locale = resolveLocale(
    request.cookies.get(LOCALE_COOKIE)?.value,
    parseAcceptLanguage(request.headers.get("accept-language")),
  );

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  // Remember the choice so the second visit does not re-derive it, and so a
  // reader who switched language by hand is not sent back by their browser's
  // header on the next unprefixed link they follow.
  response.cookies.set(LOCALE_COOKIE, locale, { maxAge: 60 * 60 * 24 * 365, sameSite: "lax", path: "/" });
  return response;
}

export const config = {
  // Everything except Next's own assets, the files that must stay at the root
  // to be found, and anything with a file extension.
  matcher: ["/((?!_next|api|favicon|robots\\.txt|sitemap\\.xml|.*\\..*).*)"],
};

export { DEFAULT_LOCALE, LOCALE_COOKIE };
