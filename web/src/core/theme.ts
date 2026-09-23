/**
 * Which pane of the window the reader sees.
 *
 * Three themes exist — dark (the primary world), light and white — plus
 * "system", which follows the OS between dark and light. The choice is a
 * display preference of this device, not something the reader told us about
 * themselves, so it lives beside the store rather than in it: an export does
 * not carry it and a wipe does not need to.
 *
 * The stylesheet only ever sees a resolved `data-theme` on <html>. Resolving
 * "system" here rather than in a media query is what lets globals.css write
 * each palette exactly once.
 */
export const THEMES = ["system", "dark", "light", "white"] as const;
export type ThemeChoice = (typeof THEMES)[number];
export type Theme = Exclude<ThemeChoice, "system">;

export const THEME_KEY = "mi:theme";

export const isThemeChoice = (value: unknown): value is ThemeChoice => THEMES.includes(value as ThemeChoice);

/** A stored choice wins; anything else follows the OS. */
export function resolveTheme(stored: string | null | undefined, prefersLight: boolean): Theme {
  if (stored === "dark" || stored === "light" || stored === "white") return stored;
  return prefersLight ? "light" : "dark";
}

/**
 * The same resolution, as a string the root layout inlines into <head>.
 *
 * It has to run before first paint — a theme applied after hydration is a
 * flash of the wrong window on every cold load — so it cannot be a module.
 * It stays subscribed to the OS setting and re-reads the stored choice on
 * each change, so "system" keeps following and an explicit choice ignores it.
 * Storage that throws (private mode, a sandboxed frame) leaves the dark
 * default in place, which is the primary world rather than a broken page.
 */
export const THEME_SCRIPT = `(function(){try{var d=document.documentElement,m=matchMedia("(prefers-color-scheme: light)");function a(){var s=null;try{s=localStorage.getItem(${JSON.stringify(THEME_KEY)})}catch(e){}d.dataset.theme=s==="dark"||s==="light"||s==="white"?s:m.matches?"light":"dark"}a();m.addEventListener("change",a)}catch(e){}})()`;

/** Fired on `window` whenever this page changes the choice, for anything showing it. */
export const THEME_EVENT = "mi:theme";

/** For `useSyncExternalStore`: this tab's own changes, and other tabs' through `storage`. */
export function subscribeToTheme(onChange: () => void): () => void {
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function readThemeChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return isThemeChoice(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

/** Store the choice and repaint now; the inline script's listener covers later OS changes. */
export function applyThemeChoice(choice: ThemeChoice): void {
  try {
    if (choice === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, choice);
  } catch {
    // Unstorable: the choice still applies to this page view.
  }
  const prefersLight = matchMedia("(prefers-color-scheme: light)").matches;
  document.documentElement.dataset.theme = choice === "system" ? resolveTheme(null, prefersLight) : choice;
  window.dispatchEvent(new Event(THEME_EVENT));
}
