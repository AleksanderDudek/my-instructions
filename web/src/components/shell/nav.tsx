"use client";

import { Link } from "@/components/ui/link";
import { usePathname } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import type { Locale } from "@/core/types";
import { cn } from "@/lib/cn";
import { Roundel, Uriel, type IconName } from "@/components/brand/art";

export type NavLabels = {
  title: string;
  home: string;
  tests: string;
  instructions: string;
  sharing: string;
  panel: string;
  paths: string;
  language: string;
};

/**
 * One set of destinations, drawn twice.
 *
 * The port shipped a single row of six pills plus a language menu. At 390px
 * that wraps to two rows and eats 96px of a 844px screen before a word of the
 * page appears — and it puts every destination at the top of the screen, which
 * is the part of a phone a thumb cannot reach.
 *
 * So: a bottom tab bar on phones, the inline row from `sm` up. Both are
 * rendered from the same array and both are always in the DOM — the choice is
 * made in CSS rather than by measuring the viewport in JavaScript, because a
 * hook that reads `window.innerWidth` renders the wrong nav on the server and
 * corrects it after hydration, which is a visible jump on every cold load.
 *
 * `Panel` is not a tab. It is the profile, the language and the data export —
 * settings, in a bar meant for the five things a reader came to do. It keeps a
 * home in the top bar at every width, where a settings control belongs.
 */

/**
 * The glass roundels, one per destination. They replace the typographic
 * glyphs the bar used to carry: the window has one visual vocabulary, and
 * every roundel sits above its word. Home is Uriel's medallion — the same
 * mark that leads the wordmark.
 */
const ROUNDEL: Record<"paths" | "tests" | "instructions" | "sharing", IconName> = {
  paths: "paths",
  tests: "tests",
  instructions: "sheet",
  sharing: "share",
};
type Key = "home" | keyof typeof ROUNDEL;

/** An inline pill: mono caps, `pill-on` (wine glass, gold line) when it is the page. */
const pill = (on: boolean) =>
  cn(
    "rounded-full px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] transition-colors",
    on ? "pill-on" : "text-muted hover:text-ink",
  );

export function Nav({
  locale,
  labels,
  locales,
}: {
  locale: Locale;
  labels: NavLabels;
  locales: { tag: string; endonym: string }[];
}) {
  const pathname = usePathname();
  const items: { key: Key; href: string; label: string; exact?: boolean }[] = [
    { key: "home", href: `/${locale}`, label: labels.home, exact: true },
    // Before the catalogue, because it is the answer to the question somebody
    // arrives with; the catalogue is the answer to a question they only have
    // once they know what they are looking for.
    { key: "paths", href: `/${locale}/paths`, label: labels.paths },
    { key: "tests", href: `/${locale}/tests`, label: labels.tests },
    { key: "instructions", href: `/${locale}/instructions`, label: labels.instructions },
    { key: "sharing", href: `/${locale}/sharing`, label: labels.sharing },
  ];

  const isOn = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  /** The same path under a different language, so switching keeps your place. */
  const swapLocale = (tag: string) => {
    const rest = pathname.split("/").slice(2).join("/");
    return `/${tag}${rest ? `/${rest}` : ""}`;
  };

  const panelOn = pathname.startsWith(`/${locale}/panel`);

  return (
    <>
      <header className="flex items-center justify-between gap-3 border-b border-rule py-4 sm:py-6">
        <Link href={`/${locale}`} className="flex min-w-0 items-center gap-2.5 font-display text-lg font-semibold text-ink">
          <Uriel mood="avatar" width={32} className="size-8" />
          <span className="truncate">{labels.title}</span>
        </Link>

        {/* The inline row. Hidden on phones, where the bar at the bottom is it. */}
        <nav
          aria-label={labels.home}
          className="hidden items-center gap-0.5 rounded-full border border-rule bg-panel p-[3px] sm:flex"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isOn(item.href, item.exact) ? "page" : undefined}
              className={pill(isOn(item.href, item.exact))}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href={`/${locale}/panel`}
            aria-current={panelOn ? "page" : undefined}
            className={cn("tap", pill(panelOn))}
          >
            {labels.panel}
          </Link>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              aria-label={labels.language}
              className="tap rounded-full border border-rule px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted hover:text-ink data-[state=open]:border-brass"
            >
              {locale}
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={6}
                className="z-50 min-w-40 rounded-sm border border-rule bg-panel p-1 shadow-plate"
              >
                {locales.map((l) => (
                  <DropdownMenu.Item key={l.tag} asChild>
                    <Link
                      href={swapLocale(l.tag)}
                      hrefLang={l.tag}
                      className={cn(
                        "block cursor-pointer rounded-sm px-3 py-2.5 text-sm outline-none",
                        l.tag === locale ? "text-brass" : "text-ink",
                        "data-[highlighted]:bg-brass/15",
                      )}
                    >
                      {l.endonym}
                    </Link>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </header>

      {/*
        The phone bar.

        `env(safe-area-inset-bottom)` is padding rather than height so the bar's
        touch targets stay 44px on a device with a home indicator instead of
        being partly under it. The page reserves room for this in the layout's
        `pb-*`, so nothing is ever hidden behind it.
      */}
      <nav
        aria-label={labels.home}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-ground/95 backdrop-blur-sm sm:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto flex max-w-lg items-stretch">
          {items.map((item) => {
            const on = isOn(item.href, item.exact);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "flex min-h-[3.5rem] flex-col items-center justify-center gap-1 px-1 py-2 transition-colors",
                    on ? "text-brass-hi" : "text-muted",
                  )}
                >
                  {item.key === "home" ? (
                    <Uriel mood="avatar" width={28} className="size-7" />
                  ) : (
                    <Roundel name={ROUNDEL[item.key]} size={28} className="size-7" />
                  )}
                  <span className="w-full truncate text-center font-mono text-[0.55rem] uppercase tracking-[0.1em]">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
