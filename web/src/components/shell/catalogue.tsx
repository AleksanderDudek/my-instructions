"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/ui/link";
import { useStore, useStoreVersion } from "@/components/shell/store-provider";
import { cn } from "@/lib/cn";
import type { Locale } from "@/core/types";

/**
 * The catalogue list, with the one thing a server cannot know drawn on top.
 *
 * Twenty-seven instruments stacked one per row is 14,000px of phone scroll and
 * no way to tell, at a glance, which of them you have already answered. Both
 * are fixed here and neither costs a second rendering: every card is in the
 * server HTML with its title, tagline and pills, and what arrives after
 * hydration is a mark on rows that were already there — the same discipline
 * `tracks.tsx` was written to.
 *
 * `null` until the store has been read. Unknown is not the same fact as "has
 * taken nothing", and only the second may draw a mark.
 */

export type CatalogueItem = {
  id: string;
  glyph: string;
  title: string;
  tagline: string;
  minutes: string;
  framework: string;
  premium: string | null;
};

export function Catalogue({
  locale,
  items,
  takenLabel,
}: {
  locale: Locale;
  items: CatalogueItem[];
  takenLabel: string;
}) {
  const store = useStore();
  const version = useStoreVersion();
  const [taken, setTaken] = useState<Set<string> | null>(null);

  useEffect(() => {
    let live = true;
    void (async () => {
      const runs = await store.runs();
      if (live) setTaken(new Set(runs.map((run) => run.instrumentId)));
    })();
    return () => {
      live = false;
    };
  }, [store, version]);

  return (
    // One column on a phone, two from `md`. The taglines are full sentences, so
    // a third column would set a measure nobody can read comfortably.
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => {
        const done = taken?.has(item.id) ?? false;
        return (
          <Link
            key={item.id}
            href={`/${locale}/tests/${item.id}`}
            className={cn(
              "group flex items-start gap-3 rounded-sm border border-rule bg-panel-2 p-4 transition-colors hover:border-brass sm:gap-4 sm:p-5",
              done && "border-verdigris/40",
            )}
          >
            <span aria-hidden className="font-display text-2xl leading-none text-brass">
              {item.glyph}
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-lg font-semibold">{item.title}</span>
                {done ? <span className="label-caps text-verdigris">{takenLabel}</span> : null}
              </span>
              {/*
                Clamped to three lines on a phone and released from `sm`. A
                twenty-seven-row list where every row is a four-line paragraph
                cannot be scanned, and the full sentence is on the instrument's
                own page one tap away.
              */}
              {/* No `block` here: `line-clamp` sets `display: -webkit-box`, and a
                  display utility beside it wins on cascade order and silently
                  turns the clamp off. */}
              <span className="mb-3 line-clamp-3 max-w-[58ch] text-sm leading-relaxed text-muted sm:line-clamp-none">
                {item.tagline}
              </span>
              <span className="flex flex-wrap gap-2">
                <span className="label-caps rounded-full border border-rule px-2 py-0.5">{item.minutes}</span>
                {/* The framework name is a clause, not a label — "attraction,
                    behaviour and identity, on independent axes" wraps to two
                    lines inside a pill and outweighs the title next to it. It
                    belongs on the instrument's own page, and on a phone that is
                    one tap away. */}
                <span className="label-caps hidden rounded-full border border-rule px-2 py-0.5 sm:inline">
                  {item.framework}
                </span>
                {item.premium ? (
                  <span className="label-caps rounded-full border border-brass/50 px-2 py-0.5 text-brass">
                    {item.premium}
                  </span>
                ) : null}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
