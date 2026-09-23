"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { applyThemeChoice, readThemeChoice, subscribeToTheme, THEMES, type ThemeChoice } from "@/core/theme";

/**
 * Which pane of the window this device shows.
 *
 * A radio group of four, styled as the language row beside it. The choice
 * lives in this browser, so the server snapshot is `null` and nothing is
 * marked until hydration — which is the truth about what the server knows.
 */
const readNull = () => null;

export function ThemePicker({ label, names }: { label: string; names: Record<ThemeChoice, string> }) {
  const choice = useSyncExternalStore<ThemeChoice | null>(subscribeToTheme, readThemeChoice, readNull);

  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {THEMES.map((t) => {
        const on = choice === t;
        return (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => applyThemeChoice(t)}
            className={cn(
              "tap rounded-sm border px-4 py-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] transition-colors",
              on ? "border-brass text-brass" : "border-rule text-muted hover:text-ink",
            )}
          >
            {names[t]}
          </button>
        );
      })}
    </div>
  );
}
