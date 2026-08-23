/**
 * Every instrument, in catalogue order.
 *
 * Static imports rather than a glob: the list is the manifest, a missing entry
 * is a visible diff, and the bundler can see the whole graph. Message tables
 * stay lazy — they are the large part — so adding a locale costs nothing at
 * the entry point.
 */
import { createRegistry, type InstrumentModule } from "@/core/registry";

import loveLanguages from "./love-languages";

const MODULES = [loveLanguages] as unknown as InstrumentModule[];

export const registry = createRegistry(MODULES);
export default registry;
