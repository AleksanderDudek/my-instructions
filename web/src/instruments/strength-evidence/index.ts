import spec from "./spec";
import { View } from "./View";
import provenance from "./provenance";

/**
 * No `Compare`. Two people's strength claims do not read against each other —
 * there is no version of "you have different receipts" that is a finding, and
 * putting two lists of somebody's proudest moments side by side invents a
 * competition the instrument has no standing to judge.
 */
const strengthEvidence = { spec, View, provenance };

export default strengthEvidence;
