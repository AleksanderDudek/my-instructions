"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/ui/link";
import { useStore, useStoreVersion } from "@/components/shell/store-provider";
import { cn } from "@/lib/cn";
import type { Locale } from "@/core/types";

/**
 * Onboarding as three moves, not three screens.
 *
 * The approved design (docs/superpowers/specs/2026-08-25-onboarding-and-
 * credibility-design.md §1) says to explain the app where somebody actually
 * needs it and without an overlay, and a modal carousel would be the exact
 * thing it refuses: a reader dismisses it, learns nothing, and the app has
 * spent its one first impression on a slideshow.
 *
 * So the rail is a permanent part of the home page whose steps are completed
 * by *doing them*. Nothing here is a "seen" flag — every state below is derived
 * from what is actually in the store, which means it cannot lie, it survives a
 * reinstall of nothing, and a reader who arrives already three tests deep is
 * shown where they are rather than a tour of what they have done.
 *
 * The steps are the three things this app is for, in the order they become
 * possible:
 *
 *   1. answer one          — you cannot have a sheet without a run
 *   2. read your sheet     — the page the whole app exists to produce, and the
 *                            step the rail is built to hand over to
 *   3. give it to somebody — the reason the sheet is a page and not a feeling
 *
 * Step 2 opens at three runs rather than one. A sheet built from a single
 * instrument has two channels filled out of six, and sending somebody to the
 * thing the app is for while it is still mostly blank is how a good feature
 * gets written off in four seconds.
 *
 * No percentage, no bar, no badge. `tracks.tsx` already argues this: somebody
 * who takes two and stops has got what they came for, and "40% complete" tells
 * them they failed at something they were not attempting.
 */

/** Runs before the sheet is worth opening. Two channels of six is not a sheet. */
const SHEET_READY = 3;

export type RailCopy = {
  heading: string;
  lead: string;
  /**
   * One resolved label per step, not a template.
   *
   * `t("start.stepLabel")` interpolates `{n}` against the vars it was given —
   * none — so the placeholder is gone by the time a string reaches this
   * component, and a `.replace("{n}", …)` here matched nothing and silently
   * rendered "Step" with no number. Interpolation belongs at the `t()` call.
   */
  stepLabels: string[];
  doneLabel: string;
  nowLabel: string;
  step1Title: string;
  step1Body: string;
  step1Cta: string;
  step2Title: string;
  step2Body: string;
  step2Cta: string;
  step2Locked: string;
  step3Title: string;
  step3Body: string;
  step3Cta: string;
  doneTitle: string;
  doneBody: string;
  doneCta: string;
};

type Progress = { runs: number; profiles: number };

export function Rail({ locale, copy }: { locale: Locale; copy: RailCopy }) {
  const store = useStore();
  const version = useStoreVersion();
  // `null` until the store has been read. Unknown is not the same fact as
  // "has done nothing", and only the second may draw a state.
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    let live = true;
    void (async () => {
      const [runs, profiles] = await Promise.all([store.runs(), store.shareProfiles()]);
      if (live) setProgress({ runs: runs.length, profiles: profiles.length });
    })();
    return () => {
      live = false;
    };
  }, [store, version]);

  const runs = progress?.runs ?? 0;
  const steps = [
    {
      n: 1,
      done: runs >= 1,
      title: copy.step1Title,
      body: copy.step1Body,
      cta: copy.step1Cta,
      href: `/${locale}/paths`,
    },
    {
      n: 2,
      done: runs >= SHEET_READY,
      title: copy.step2Title,
      // The one step whose copy changes before it opens, because "you cannot do
      // this yet" is more use than a button that goes somewhere empty.
      body: runs >= 1 && runs < SHEET_READY ? copy.step2Locked : copy.step2Body,
      cta: copy.step2Cta,
      href: `/${locale}/instructions`,
    },
    {
      n: 3,
      done: (progress?.profiles ?? 0) >= 1,
      title: copy.step3Title,
      body: copy.step3Body,
      cta: copy.step3Cta,
      href: `/${locale}/sharing`,
    },
  ];

  const allDone = progress !== null && steps.every((s) => s.done);
  /** The first unfinished step is the only one that gets a button. */
  const current = steps.find((s) => !s.done)?.n ?? 0;

  if (allDone) {
    return (
      <section className="plate-edge mb-8 overflow-hidden rounded-sm border border-rule bg-panel p-5 shadow-plate sm:mb-10 sm:p-8">
        <h2 className="text-xl">{copy.doneTitle}</h2>
        <p className="mt-2 max-w-[62ch] leading-relaxed text-muted">{copy.doneBody}</p>
        <Link
          href={`/${locale}/instructions`}
          className="tap mt-5 inline-flex rounded-sm border border-rule px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink hover:border-brass"
        >
          {copy.doneCta}
        </Link>
      </section>
    );
  }

  return (
    <section className="plate-edge mb-8 overflow-hidden rounded-sm border border-rule bg-panel p-5 shadow-plate sm:mb-10 sm:p-8">
      <div className="rule-head mb-2">
        <h2 className="min-w-0 text-xl">{copy.heading}</h2>
        <span className="rule" aria-hidden />
      </div>
      <p className="mb-6 max-w-[62ch] leading-relaxed text-muted">{copy.lead}</p>

      <ol className="flex flex-col gap-px bg-rule">
        {steps.map((step) => {
          const isCurrent = step.n === current;
          return (
            <li
              key={step.n}
              className={cn("flex gap-4 bg-panel px-1 py-5 sm:px-2", step.done && "opacity-60")}
            >
              <span aria-hidden className={cn("stamp mt-0.5", step.done && "stamp-done")}>
                {step.done ? "✓" : step.n}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-base sm:text-lg">{step.title}</h3>
                  <span className="label-caps">
                    {step.done ? copy.doneLabel : isCurrent ? copy.nowLabel : copy.stepLabels[step.n - 1]}
                  </span>
                </div>
                <p className="mt-1.5 max-w-[58ch] text-[0.95rem] leading-relaxed text-muted">{step.body}</p>
                {isCurrent ? (
                  <Link
                    href={step.href}
                    className="tap mt-4 inline-flex rounded-sm border border-brass bg-brass/10 px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-brass-hi hover:bg-brass/20"
                  >
                    {step.cta}
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
