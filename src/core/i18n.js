/**
 * Messages.
 *
 * A deliberate subset of ICU MessageFormat: interpolation, `plural`, and
 * `select`. Those three cover what Polish, Spanish and German actually ask of
 * this app — Polish alone forces the plural machinery, since `one`/`few`/`many`
 * is a grammatical requirement and not a nicety. Anything outside the subset
 * throws, on the same principle as `tools/build.mjs`: a parser that does not
 * cover a form should say so rather than quietly render something plausible.
 *
 * Plural categories come from `Intl.PluralRules` rather than a hand-written
 * table. The platform already knows that Polish has three of them and that
 * 22 is `few` while 25 is `many`; re-deriving that by hand is how you ship a
 * language you cannot read with confidently wrong grammar.
 */

/** Index of the `}` closing the `{` at `start`. */
function matchBrace(source, start) {
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}" && --depth === 0) return i;
  }
  throw new SyntaxError(`unbalanced braces in message: ${source}`);
}

/** `one{…} few{…} other{…}` -> Map. */
function branches(source) {
  const out = new Map();
  let i = 0;
  while (i < source.length) {
    if (/\s/.test(source[i])) { i++; continue; }
    const brace = source.indexOf("{", i);
    if (brace === -1) break;
    const end = matchBrace(source, brace);
    out.set(source.slice(i, brace).trim(), source.slice(brace + 1, end));
    i = end + 1;
  }
  return out;
}

function argument(body, vars, locale, source) {
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
function format(pattern, vars = {}, locale = "en", hash = null) {
  let out = "";
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === "#" && hash !== null) { out += new Intl.NumberFormat(locale).format(hash); i++; continue; }
    if (ch !== "{") { out += ch; i++; continue; }
    const end = matchBrace(pattern, i);
    out += argument(pattern.slice(i + 1, end), vars, locale, pattern);
    i = end + 1;
  }
  return out;
}

/**
 * Bind a message table to a locale.
 *
 * A key absent from the active locale renders the English string instead of a
 * gap in the page, and is recorded in `gaps()`. That fallback is a safety net
 * for production, not a workflow: the parity test fails on any gap, so a
 * shipped locale never relies on it.
 */
function createI18n({ locale = "en", messages = {}, fallbackMessages = messages, onMissing = null } = {}) {
  const gaps = new Set();
  const warned = new Set();

  function t(key, vars) {
    const pattern = messages[key] ?? fallbackMessages[key];
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
  }

  return {
    t,
    locale,
    /** Whether the *active* locale defines this key, ignoring the fallback. */
    has: (key) => Object.hasOwn(messages, key),
    keys: () => Object.keys(messages),
    /** Keys this locale borrowed from the fallback during rendering. */
    gaps: () => [...gaps],
  };
}

export { createI18n, format, branches, matchBrace };
