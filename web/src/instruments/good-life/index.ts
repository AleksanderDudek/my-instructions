import spec from "./spec";
import { View } from "./View";
import provenance from "./provenance";

/**
 * The module shape the registry expects: logic, a view, and a paper trail.
 *
 * No `Compare`. Two people's accounts of a good life are compared by
 * `compareStances` in the core, and the pairing UI for inventories is not built
 * yet — a `Compare` here would be a component nothing renders. The four open
 * questions would be absent from it in any case: they are not blocks, so
 * nothing walks them, which is the mechanism behind «never compared».
 */
const goodLife = { spec, View, provenance };

export default goodLife;
