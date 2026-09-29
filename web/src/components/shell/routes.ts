/**
 * Where "up" goes from any page, and which pages are a focused flow.
 *
 * A phone app has two kinds of screen: the five destinations in the tab bar,
 * and the screens beneath them. The tab bar reaches the first kind; the
 * second needs a way back up, and it has to be the app's own — an installed
 * app on iOS runs without a browser back button at all, and a page opened
 * cold from a shared link has no history to go back through. So "up" is the
 * page's parent in the hierarchy, not the previous entry in history.
 */
export type Up = { href: string; label: "tests" | "back" | "home" };

/** `pathname` as `usePathname` gives it: no base path, maybe a trailing slash. */
function segments(pathname: string): string[] {
  return pathname.replace(/\/+$/, "").split("/").filter(Boolean);
}

export function parentOf(pathname: string): Up | null {
  const [locale, section, id, leaf] = segments(pathname);
  if (!locale || !section) return null;
  if (section === "tests" && id && leaf) return { href: `/${locale}/tests/${id}`, label: "back" };
  if (section === "tests" && id) return { href: `/${locale}/tests`, label: "tests" };
  // Pages somebody was sent to rather than navigated to: up is the app itself.
  if (section === "p" || section === "report") return { href: `/${locale}`, label: "home" };
  return null;
}

/**
 * Taking a test is a focused flow: the tab bar leaves so the questions have
 * the screen, and a mis-tap cannot drop someone out of a half-answered page.
 * Answers are drafted as they go, so leaving is never destructive — it is
 * just no longer one thumb-width away.
 */
export function isFocusFlow(pathname: string): boolean {
  const [, section, id, leaf] = segments(pathname);
  return section === "tests" && Boolean(id) && leaf === "take";
}
