import spec from "./spec";
import { View } from "./View";
import provenance from "./provenance";

/**
 * The module shape the registry expects: logic, a view, and a paper trail.
 *
 * No `Compare`. Two people's stated positions are compared by `compareStances`
 * in the core, and the pairing UI for inventories is not built yet — a
 * `Compare` here would be a component nothing renders. It is the instrument
 * that would want one most, which is why it is worth saying that the want is
 * not a reason to ship a component with no caller.
 */
const beforeMarriage = { spec, View, provenance };

export default beforeMarriage;
