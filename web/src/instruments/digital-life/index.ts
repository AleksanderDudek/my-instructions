import spec from "./spec";
import { View } from "./View";
import provenance from "./provenance";

/**
 * The module shape the registry expects: logic, a view, and a paper trail.
 *
 * No `Compare`. Two people's phone rules are compared by `compareStances` in
 * the core, and the pairing UI for inventories is not built yet — a `Compare`
 * here would be a component nothing renders.
 */
const digitalLife = { spec, View, provenance };

export default digitalLife;
