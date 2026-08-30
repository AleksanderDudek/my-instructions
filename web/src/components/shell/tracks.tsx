"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/ui/link";
import { Plate, PlateHead } from "@/components/ui/primitives";
import { useStore } from "@/components/shell/store-provider";
import { TRACK_LIST, progressOf } from "@/core/tracks";
import { cn } from "@/lib/cn";
import type { Locale } from "@/core/types";

/**
 * Five routes through a catalogue that is too long to be a first screen.
 *
 * A client component that renders on the server first, which is the point: the
 * five headings, their reasons and every link are in the static HTML, so the
 * page is indexable and correct with JavaScript off. What arrives after
 * hydration is the one thing a server cannot know — which of these this person
 * has already taken — and it arrives as marks on rows that were already there
 * rather than as a second copy of the list.
 *
 * The earlier draft had a server list and a client island that reached into the
 * DOM to annotate it. That is two renderings of one thing, kept in step by
 * hand, in a codebase whose form controls carry a comment about exactly why
 * that goes wrong.
 *
 * A count, never a percentage and never a progress bar. Somebody who takes two
 * of five and stops has got what they came for; "40% complete" tells them they
 * failed at something they were not attempting.
 */
export function Tracks({
  locale,
  copy,
  titleOf,
  taglineOf,
}: {
  locale: Locale;
  copy: Record<string, string>;
  titleOf: Record<string, string>;
  taglineOf: Record<string, string>;
}) {
  const store = useStore();
  // `null` until the store has been read, and null is not the same fact as "has
  // taken nothing": one is unknown, the other is a claim. Marks are drawn only
  // for the second.
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
  }, [store]);

  return (
    <>
      {TRACK_LIST.map((track) => {
        const { done, total, next } = taken
          ? progressOf(track, taken)
          : { done: 0, total: track.steps.length, next: null };

        return (
          <Plate key={track.id}>
            <div data-track={track.id}>
              <PlateHead
                title={`${track.glyph}  ${copy[`track.${track.id}.title`]}`}
                note={taken ? copy["paths.count"].replace("{done}", String(done)).replace("{total}", String(total)) : ""}
              />
              <p className="mb-6 max-w-[62ch] leading-relaxed text-muted">{copy[`track.${track.id}.lead`]}</p>

              <ol className="flex flex-col divide-y divide-rule">
                {track.steps.map((step, index) => (
                  <li key={step} data-step={step} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4">
                    <span className="num w-6 shrink-0 text-muted">{index + 1}</span>
                    <span className="min-w-48 flex-1">
                      <Link href={`/${locale}/tests/${step}`} className="block hover:text-brass">
                        {titleOf[step] ?? step}
                      </Link>
                      <span className="block text-sm text-muted">{taglineOf[step] ?? ""}</span>
                    </span>
                    <span
                      className={cn(
                        "label-caps shrink-0",
                        taken?.has(step) ? "text-verdigris" : step === next ? "text-brass" : "text-transparent",
                      )}
                    >
                      {/* A non-breaking space keeps the row height identical
                          before and after hydration, so nothing shifts under a
                          reader who is already reaching for a link. */}
                      {taken?.has(step) ? copy["paths.taken"] : step === next ? copy["paths.next"] : " "}
                    </span>
                  </li>
                ))}
              </ol>

              {track.preset ? (
                <p className="mt-6 max-w-[62ch] border-l-2 border-rule pl-5 text-sm leading-relaxed text-muted">
                  {copy["paths.endsAt"].replace("{profile}", copy[`profiles.preset.${track.preset}`])}{" "}
                  <Link href={`/${locale}/sharing`} className="text-brass hover:text-brass-hi">
                    {copy["paths.toSharing"]}
                  </Link>
                </p>
              ) : (
                <p className="mt-6 max-w-[62ch] border-l-2 border-rule pl-5 text-sm leading-relaxed text-muted">
                  {copy[`track.${track.id}.endsWith`]}
                </p>
              )}
            </div>
          </Plate>
        );
      })}
    </>
  );
}
