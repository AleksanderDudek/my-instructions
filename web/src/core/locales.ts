/**
 * Which languages exist, and how their words are fetched.
 *
 * Every import specifier below is a literal. A computed one — `import(
 * \`./messages/${tag}\`)` — would resolve at runtime but leaves the bundler
 * guessing, which on a static build means either shipping every locale to
 * every reader or shipping none.
 */
import { createI18n, type I18n, type Messages } from "./i18n";
import type { InstrumentSpec, Locale } from "./types";

export const LOCALES = [
  { tag: "en", label: "English", endonym: "English" },
  { tag: "pl", label: "Polish", endonym: "Polski" },
  { tag: "es", label: "Spanish", endonym: "Español" },
  { tag: "de", label: "German", endonym: "Deutsch" },
] as const;

export const TAGS = LOCALES.map((l) => l.tag) as readonly Locale[];
export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (value: unknown): value is Locale => TAGS.includes(value as Locale);

const SHELL: Record<Locale, () => Promise<{ default: Messages }>> = {
  en: () => import("@/i18n/messages/en"),
  pl: () => import("@/i18n/messages/pl"),
  es: () => import("@/i18n/messages/es"),
  de: () => import("@/i18n/messages/de"),
};

/**
 * Pick a language from a stored choice and the browser's list.
 *
 * A stored choice always wins. Otherwise the first `Accept-Language` entry
 * whose base tag we ship is used, so `pt-BR, pt, es` lands on Spanish rather
 * than falling all the way to English.
 */
export function resolveLocale(stored: string | null | undefined, preferred: readonly string[] = []): Locale {
  if (isLocale(stored)) return stored;
  for (const raw of preferred) {
    const base = raw.split("-")[0]?.toLowerCase();
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

/** Parse an Accept-Language header into tags, best first. */
export function parseAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.trim(), q: q ? Number(q.split("=")[1]) : 1 };
    })
    .filter((x) => x.tag)
    .sort((a, b) => b.q - a.q)
    .map((x) => x.tag);
}

export const loadShell = async (locale: Locale): Promise<Messages> => (await SHELL[locale]()).default;

/** One instrument's table, namespaced under its own id. */
export async function loadInstrument(spec: InstrumentSpec, locale: Locale): Promise<Messages> {
  const table = (await spec.messages[locale]()).default;
  return Object.fromEntries(Object.entries(table).map(([k, v]) => [`${spec.id}.${k}`, v]));
}

/**
 * The shell's own words, with English behind them.
 *
 * English is loaded as the fallback for every other locale so a missing key
 * renders a real sentence rather than a key. The parity test fails on any gap,
 * so nothing shipped relies on it.
 */
export async function getI18n(locale: Locale, extra: Messages = {}): Promise<I18n> {
  const messages = { ...(await loadShell(locale)), ...extra };
  const fallbackMessages =
    locale === DEFAULT_LOCALE ? messages : { ...(await loadShell(DEFAULT_LOCALE)), ...extra };
  return createI18n({ locale, messages, fallbackMessages });
}

/** The shell plus one instrument, with a `t` already scoped to that instrument. */
export async function getInstrumentI18n(spec: InstrumentSpec, locale: Locale) {
  const own = await loadInstrument(spec, locale);
  const fallbackOwn = locale === DEFAULT_LOCALE ? own : await loadInstrument(spec, DEFAULT_LOCALE);
  const shell = await loadShell(locale);
  const fallbackShell = locale === DEFAULT_LOCALE ? shell : await loadShell(DEFAULT_LOCALE);
  const i18n = createI18n({
    locale,
    messages: { ...shell, ...own },
    fallbackMessages: { ...fallbackShell, ...fallbackOwn },
  });
  return { i18n, scoped: i18n.scope(spec.id) };
}
