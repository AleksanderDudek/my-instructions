/**
 * One dynamic import per instrument, written out as literals.
 *
 * The runner and the result page both need an instrument's own code — `score`
 * to compute a reading, `View` to draw it — and both are client routes,
 * because a result lives in local storage and never reaches a server. Importing
 * the registry there would put all sixteen instruments in the bundle of
 * whichever one the reader opened.
 *
 * A map of literal `import()` calls is what lets the bundler split them: a
 * computed specifier resolves at runtime but leaves the graph unknowable, so
 * the bundler either ships everything or nothing.
 */
import type { InstrumentModule } from "@/core/registry";

const LOADERS: Record<string, () => Promise<{ default: InstrumentModule }>> = {
  "love-languages": () => import("./love-languages") as Promise<{ default: InstrumentModule }>,
};

export const hasInstrument = (id: string) => id in LOADERS;

export async function loadInstrumentModule(id: string): Promise<InstrumentModule | null> {
  const loader = LOADERS[id];
  if (!loader) return null;
  return (await loader()).default;
}
