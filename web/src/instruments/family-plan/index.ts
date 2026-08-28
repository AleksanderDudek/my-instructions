import spec from "./spec";
import { View } from "./View";
import provenance from "./provenance";

/**
 * The module shape the registry expects: logic, a view, and a paper trail.
 *
 * No `Compare`. Two people's positions on children are compared by
 * `compareStances` in the core — and this is the bank that comparison was
 * argued for, since a collision on `change-of-mind` is the one finding neither
 * person could have worked out alone. But the pairing UI for inventories is not
 * built yet, so a `Compare` here would be a component nothing renders.
 */
const familyPlan = { spec, View, provenance };

export default familyPlan;
