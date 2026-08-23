/**
 * Messages.
 *
 * A deliberate subset of ICU MessageFormat: interpolation, `plural`, and
 * `select`. Those three cover what Polish, Spanish and German actually ask of
 * this app — Polish alone forces the plural machinery, since `one`/`few`/`many`
 * is a grammatical requirement and not a nicety. Anything outside the subset
 * throws: a parser that does not cover a form should say so rather than
 * quietly render something plausible.
 *
 * Plural categories come from `Intl.PluralRules` rather than a hand-written
 * table. The platform already knows Polish has three of them and that 22 is
 * `few` while 25 is `many`; re-deriving that by hand is how you ship a language
 * you cannot read with confidently wrong grammar.
 *
 * This is deliberately not a library. `next-intl` was installed and then
 * removed: it reads a dot in a key as a namespace separator, and every key in
 * this project is a flat dotted string — `catalog.group.tests` is one key, not
 * three levels. Adopting it meant transforming roughly six thousand five
 * hundred strings, and losing the parity and pseudo-locale gates that already
 * guard them, in exchange for locale detection that is thirty lines.
 */
import type { Locale, T } from "./types";

export type Messages = Record<string, string>;
export type Vars = Record<string, string | number>;

/** Index of the `}` closing the `{` at `start`. */
export function matchBrace(source: string, start: number): number {
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}" && --depth === 0) return i;
  }
  throw new SyntaxError(`unbalanced braces in message: ${source}`);
}

/** `one{…} few{…} other{…}` → Map. */
export function branches(source: string): Map<string, string> {
  const out = new Map<string, string>();
  let i = 0;
  while (i < source.length) {
    if (/\s/.test(source[i])) {
      i++;
      continue;
    }
    const brace = source.indexOf("{", i);
    if (brace === -1) break;
    const end = matchBrace(source, brace);
    out.set(source.slice(i, brace).trim(), source.slice(brace + 1, end));
    i = end + 1;
  }
  return out;
}

function argument(body: string, vars: Vars, locale: string, source: string): string {
  const comma = body.indexOf(",");
  if (comma === -1) {
    const value = vars[body.trim()];
    return value == null ? "" : String(value);
  }

  const name = body.slice(0, comma).trim();
  const rest = body.slice(comma + 1);
  const second = rest.indexOf(",");
  if (second === -1) throw new SyntaxError(`argument "${name}" has a type but no branches: ${source}`);

  const type = rest.slice(0, second).trim();
  const cases = branches(rest.slice(second + 1));

  if (type === "plural") {
    const n = Number(vars[name]);
    const chosen = cases.get(`=${n}`) ?? cases.get(new Intl.PluralRules(locale).select(n)) ?? cases.get("other");
    if (chosen == null) throw new SyntaxError(`plural argument "${name}" has no matching branch and no "other": ${source}`);
    return format(chosen, vars, locale, n);
  }

  if (type === "select") {
    const chosen = cases.get(String(vars[name])) ?? cases.get("other");
    if (chosen == null) throw new SyntaxError(`select argument "${name}" has no matching branch and no "other": ${source}`);
    return format(chosen, vars, locale);
  }

  throw new SyntaxError(`unsupported argument type "${type}" in message: ${source}`);
}

/**
 * Render one pattern. `hash` is the number a surrounding `plural` selected on,
 * which is what `#` stands for inside its branches.
 */
export function format(pattern: string, vars: Vars = {}, locale = "en", hash: number | null = null): string {
  let out = "";
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === "#" && hash !== null) {
      out += new Intl.NumberFormat(locale).format(hash);
      i++;
      continue;
    }
    if (ch !== "{") {
      out += ch;
      i++;
      continue;
    }
    const end = matchBrace(pattern, i);
    out += argument(pattern.slice(i + 1, end), vars, locale, pattern);
    i = end + 1;
  }
  return out;
}

export type I18n = {
  t: T;
  /**
   * The unformatted pattern behind a key.
   *
   * A server component cannot hand a client component a function, so a client
   * island that interpolates a value the server does not have — a live answer
   * count, a page number — needs the ICU source rather than a finished string.
   */
  raw(key: string): string;
  locale: Locale;
  scope(prefix: string): { t: T; locale: Locale };
  has(key: string): boolean;
  keys(): string[];
  gaps(): string[];
};

/**
 * Bind a message table to a locale.
 *
 * A key absent from the active locale renders the English string rather than a
 * gap in the page, and is recorded in `gaps()`. That fallback is a safety net
 * for production, not a workflow: the parity test fails on any gap, so a
 * shipped locale never relies on it.
 */
export function createI18n({
  locale = "en" as Locale,
  messages = {} as Messages,
  fallbackMessages,
  onMissing,
}: {
  locale?: Locale;
  messages?: Messages;
  fallbackMessages?: Messages;
  onMissing?: (key: string, locale: Locale) => void;
} = {}): I18n {
  const fallback = fallbackMessages ?? messages;
  const gaps = new Set<string>();
  const warned = new Set<string>();

  const t: T = (key, vars) => {
    const pattern = messages[key] ?? fallback[key];
    if (pattern == null) {
      if (!warned.has(key)) {
        warned.add(key);
        if (onMissing) onMissing(key, locale);
        else console.warn(`i18n: no message for "${key}" in ${locale} or the fallback`);
      }
      return key;
    }
    if (messages[key] == null) gaps.add(key);
    return format(pattern, vars ?? {}, locale);
  };

  const defines = (key: string) => Object.hasOwn(messages, key) || Object.hasOwn(fallback, key);

  return {
    t,
    raw: (key: string) => messages[key] ?? fallback[key] ?? key,
    locale,
    /**
     * A `t` bound to one instrument's namespace.
     *
     * Instrument message files use bare keys and the loader namespaces them,
     * so a folder never learns its own prefix. A key the instrument does not
     * define falls through to the shared table, which is how `band.high` is
     * written once and used by every questionnaire.
     */
    scope(prefix: string) {
      return { t: ((key, vars) => t(defines(`${prefix}.${key}`) ? `${prefix}.${key}` : key, vars)) as T, locale };
    },
    has: (key: string) => Object.hasOwn(messages, key),
    keys: () => Object.keys(messages),
    gaps: () => [...gaps],
  };
}
