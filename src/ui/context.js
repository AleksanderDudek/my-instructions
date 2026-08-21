/**
 * The render context.
 *
 * One factory so the shell and the tests build the same object. `t` is the
 * shell's own translator; `instrument(spec)` hands back the same context with
 * `t` scoped to that instrument's namespace, which is how a page can render
 * an instrument's words without either side knowing the other's key prefix.
 */
function makeContext({ store, registry, i18n, router = { go() {} } }) {
  const ctx = { store, registry, i18n, router, t: i18n.t, locale: i18n.locale };
  ctx.instrument = (spec) => ({ ...ctx, t: i18n.scope(spec.id).t });
  return ctx;
}

export { makeContext };
