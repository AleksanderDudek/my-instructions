import spec from "./spec";
import { View } from "./View";
import provenance from "./provenance";

/**
 * The module shape the registry expects: logic, a view, and a paper trail.
 *
 * No `Compare`. Two people's stated positions are compared by `compareStances`
 * in the core — and this is the instrument where that comparison has the most
 * to say, since two people can hold the same belief at the same weight on
 * entirely different grounds — but the pairing UI for inventories is not built
 * yet, so a `Compare` here would be a component nothing renders.
 */
const faith = { spec, View, provenance };

export default faith;
