/**
 * The languages this app speaks.
 *
 * Message files load by dynamic `import()` so an English reader never
 * downloads Polish. Every specifier below is a literal string rather than a
 * template, because `tools/build.mjs` resolves them by reading the source —
 * a computed path would bundle to a module that is not there.
 */

const LOCALES = [
  { tag: "en", label: "English", endonym: "English" },
  { tag: "pl", label: "Polish", endonym: "Polski" },
  { tag: "es", label: "Spanish", endonym: "Español" },
  { tag: "de", label: "German", endonym: "Deutsch" },
];

const DEFAULT_LOCALE = "en";

const SHELL = {
  en: () => import("../ui/i18n/en.js"),
  pl: () => import("../ui/i18n/pl.js"),
  es: () => import("../ui/i18n/es.js"),
  de: () => import("../ui/i18n/de.js"),
};

const isSupported = (tag) => LOCALES.some((l) => l.tag === tag);

/**
 * Stored preference, else the first browser language this app speaks, else
 * English. Browser tags are matched by prefix so `de-AT` counts as German.
 */
function resolveLocale(stored, preferred = []) {
  if (stored && isSupported(stored)) return stored;
  for (const tag of preferred ?? []) {
    const base = String(tag).toLowerCase().split("-")[0];
    if (isSupported(base)) return base;
  }
  return DEFAULT_LOCALE;
}

/** The shell's own messages for one locale, English behind it. */
async function loadShell(tag) {
  const load = SHELL[tag] ?? SHELL[DEFAULT_LOCALE];
  return (await load()).default;
}

/**
 * Every registered instrument's messages for one locale, namespaced by
 * instrument id so two instruments may both define `item.1` without
 * colliding. An instrument that has not been translated yet contributes
 * nothing and its keys fall back to English at render time.
 */
async function loadInstruments(instruments, tag) {
  const out = {};
  for (const spec of instruments) {
    const load = spec.messages?.[tag];
    if (!load) continue;
    const table = (await load()).default;
    for (const [key, value] of Object.entries(table)) out[`${spec.id}.${key}`] = value;
  }
  return out;
}

/** Everything the app needs to render one locale. */
async function loadMessages(instruments, tag) {
  const [shell, byInstrument] = await Promise.all([loadShell(tag), loadInstruments(instruments, tag)]);
  return { ...shell, ...byInstrument };
}

export { LOCALES, DEFAULT_LOCALE, isSupported, resolveLocale, loadShell, loadInstruments, loadMessages };
