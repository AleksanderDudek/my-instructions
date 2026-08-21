/**
 * The plugin manifest.
 *
 * Adding a test is: write the folder, add the import, add it to the array.
 * Nothing else in the application knows any instrument by name.
 */
import { createRegistry } from "../core/registry.js";
import numerology from "./numerology/index.js";
import loveLanguages from "./love-languages/index.js";
import enneagram from "./enneagram/index.js";
import bigFive from "./big-five/index.js";

const INSTRUMENTS = [loveLanguages, enneagram, bigFive, numerology];

const registry = createRegistry();
for (const spec of INSTRUMENTS) registry.register(spec);

export { registry, INSTRUMENTS };
