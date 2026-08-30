"use client";

import { Link } from "@/components/ui/link";
import { usePathname } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import type { Locale } from "@/core/types";
import { cn } from "@/lib/cn";

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
  const items = [
    { href: `/${locale}`, label: labels.home, exact: true },
    // Before the catalogue, because it is the answer to the question somebody
    // arrives with; the catalogue is the answer to a question they only have
    // once they know what they are looking for.
    { href: `/${locale}/paths`, label: labels.paths },
    { href: `/${locale}/tests`, label: labels.tests },
    { href: `/${locale}/instructions`, label: labels.instructions },
    { href: `/${locale}/sharing`, label: labels.sharing },
    { href: `/${locale}/panel`, label: labels.panel },
  ];

  /** The same path under a different language, so switching keeps your place. */
  const swapLocale = (tag: string) => {
    const rest = pathname.split("/").slice(2).join("/");
    return `/${tag}${rest ? `/${rest}` : ""}`;
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-rule py-6">
      <Link href={`/${locale}`} className="font-display text-lg font-semibold text-ink">
        {labels.title}
      </Link>

      <nav aria-label={labels.home} className="flex flex-wrap items-center gap-1">
        {items.map((item) => {
          const on = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={on ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] transition-colors",
                on ? "bg-brass/15 text-brass-hi" : "text-muted hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          );
        })}

        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            aria-label={labels.language}
            className="rounded-full border border-rule px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted hover:text-ink data-[state=open]:border-brass"
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
                      "block cursor-pointer rounded-sm px-3 py-2 text-sm outline-none",
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
      </nav>
    </header>
  );
}
