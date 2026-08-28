import spec from "./spec";
import { View } from "./View";
import provenance from "./provenance";

/**
 * The module shape the registry expects: logic, a view, and a paper trail.
 *
 * No `Compare` component, though `spec.compare()` exists and is correct. The
 * pairing UI for inventories is not built yet, and a component nothing renders
 * is worse than none; what the comparison must get right — the private block
 * landing in `withheld` rather than in `unanswered` — is got right in
 * `spec.ts`, where it is testable today.
 */
const moneyManagement = { spec, View, provenance };

export default moneyManagement;
