"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RadioGroup } from "radix-ui";
import { cn } from "@/lib/cn";
import { useStore } from "@/components/shell/store-provider";
import { WEIGHT_MAX, WEIGHT_MIN, type Reflectable, type Reflections } from "@/core/reflect";

/**
 * How much does this matter to you, and why — for every instrument.
 *
 * The inventories ask it per question, because each of their questions is
 * about something. A scored questionnaire's items are not, so this asks at the
 * level where the instrument is actually saying something: the scale. "Openness
 * — 78" is a claim somebody can hold an opinion about; item 17 is not.
 *
 * On the result rather than in the runner, and the ordering is the point.
 * Weighing "openness" before seeing your own is weighing an abstraction;
 * weighing it afterwards is the first moment reflection is possible. It costs
 * an anchoring effect, which would matter if this were a measurement. It is
 * not: it is the reader's stated view of their own reading, and that is exactly
 * the thing anchoring cannot spoil.
 *
 * ── The reason never leaves this device ───────────────────────────────
 *
 * It is typed prose, which is the one kind of answer in this app whose contents
 * nobody has reviewed. It lives under its own storage key, `encodeReport` reads
 * runs and nothing else, and `test/core/reflect.test.ts` asserts a report token
 * built from a reflected instrument contains none of it.
 */

export type ReflectCopy = {
  heading: string;
  note: string;
  weight: string;
  weightLow: string;
  weightHigh: string;
  why: string;
  whyPlaceholder: string;
  saved: string;
};

/** Long enough to coalesce a sentence, short enough to survive a closed tab. */
const TYPING_PAUSE = 400;

export function Reflect({
  instrumentId,
  rows,
  copy,
}: {
  instrumentId: string;
  rows: Reflectable[];
  copy: ReflectCopy;
}) {
  const store = useStore();
  const [saved, setSaved] = useState<Reflections | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  /**
   * What is owed to storage, readable from a cleanup that runs after the last
   * render. A cleanup closes over the render that scheduled it, so reading
   * `draft` there would flush whatever was true one keystroke ago.
   */
  const latestWhy = useRef<Record<string, string>>({});

  useEffect(() => {
    let live = true;
    void (async () => {
      const found = await store.reflections(instrumentId);
      if (!live) return;
      setSaved(found);
      setDraft(Object.fromEntries(Object.entries(found).map(([key, one]) => [key, one.why ?? ""])));
    })();
    return () => {
      live = false;
    };
  }, [store, instrumentId]);

  /**
   * Flush pending writes on the way out — do not drop them.
   *
   * An earlier version cleared the timers and lost whatever was inside the
   * window, on the reasoning that it is the same thing a closed tab does. It is
   * not. Closing a tab is rare and deliberate; clicking a link in the nav is
   * neither, and it happens most often in exactly the moment somebody has
   * finished a sentence and looked away. Losing it then reads as the app
   * discarding what you wrote.
   *
   * The store call is safe here because it is a write and not a state update:
   * nothing re-renders a component that is already gone.
   */
  useEffect(() => {
    const pending = timers.current;
    const latest = latestWhy;
    return () => {
      for (const [key, timer] of pending) {
        clearTimeout(timer);
        const why = latest.current[key];
        if (why !== undefined) void store.saveReflection(instrumentId, key, { why });
      }
      pending.clear();
    };
  }, [store, instrumentId, latestWhy]);

  const persistWhy = useCallback(
    (key: string, why: string) => {
      latestWhy.current[key] = why;
      const pending = timers.current;
      const existing = pending.get(key);
      if (existing) clearTimeout(existing);
      pending.set(
        key,
        setTimeout(() => {
          pending.delete(key);
          delete latestWhy.current[key];
          void store.saveReflection(instrumentId, key, { why });
        }, TYPING_PAUSE),
      );
    },
    [store, instrumentId],
  );

  const setWeight = async (key: string, weight: number) => {
    // A rating is one click at the speed of a hand, so it is written at once —
    // there is nothing to coalesce and a delay would only be a way to lose it.
    setSaved((prev) => ({ ...(prev ?? {}), [key]: { ...(prev ?? {})[key], weight } }));
    await store.saveReflection(instrumentId, key, { weight });
  };

  if (!saved || rows.length === 0) return null;

  const points = Array.from({ length: WEIGHT_MAX - WEIGHT_MIN + 1 }, (_, i) => WEIGHT_MIN + i);

  return (
    <section className="mt-10 border-t border-rule pt-8" data-reflect={instrumentId}>
      <h3 className="mb-2 text-xl">{copy.heading}</h3>
      <p className="mb-8 max-w-[62ch] leading-relaxed text-muted">{copy.note}</p>

      <div className="flex flex-col gap-8">
        {rows.map((row) => {
          const weight = saved[row.key]?.weight;
          return (
            <div key={row.key} data-reflect-row={row.key} className="rounded-sm border border-rule bg-panel-2 p-5">
              <h4 className="mb-4 text-base">{row.label}</h4>

              <fieldset className="mb-5">
                <legend className="label-caps mb-3">{copy.weight}</legend>
                <RadioGroup.Root
                  value={weight === undefined ? "" : String(weight)}
                  onValueChange={(next) => void setWeight(row.key, Number(next))}
                  className="flex flex-wrap gap-2"
                >
                  {points.map((point) => (
                    <RadioGroup.Item
                      key={point}
                      value={String(point)}
                      aria-label={
                        point === WEIGHT_MIN
                          ? `${point} — ${copy.weightLow}`
                          : point === WEIGHT_MAX
                            ? `${point} — ${copy.weightHigh}`
                            : undefined
                      }
                      className={cn(
                        "num min-w-[2.75rem] flex-1 cursor-pointer rounded-sm border py-3 text-center transition-colors",
                        weight === point
                          ? "border-brass bg-brass/10 text-brass-hi"
                          : "border-rule bg-panel text-ink/80 hover:border-brass/50",
                      )}
                    >
                      {point}
                    </RadioGroup.Item>
                  ))}
                </RadioGroup.Root>
                <div aria-hidden className="mt-2 flex justify-between gap-6 text-sm text-faint">
                  <span>{copy.weightLow}</span>
                  <span className="text-right">{copy.weightHigh}</span>
                </div>
              </fieldset>

              <label htmlFor={`why-${row.key}`} className="label-caps mb-2 block">
                {copy.why}
              </label>
              <textarea
                id={`why-${row.key}`}
                rows={3}
                value={draft[row.key] ?? ""}
                placeholder={copy.whyPlaceholder}
                autoComplete="off"
                onChange={(e) => {
                  const next = e.target.value;
                  setDraft((prev) => ({ ...prev, [row.key]: next }));
                  persistWhy(row.key, next);
                }}
                className="w-full rounded-sm border border-rule bg-panel px-4 py-3 leading-relaxed text-ink"
              />
            </div>
          );
        })}
      </div>

      <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted">{copy.saved}</p>
    </section>
  );
}
