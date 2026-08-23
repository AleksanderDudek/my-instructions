import spec from "./spec";
import { View } from "./View";
import { Compare } from "./Compare";
import provenance from "./provenance";

/** The module shape the registry expects: logic, a view, and a paper trail. */
const attachment = { spec, View, Compare, provenance };

export default attachment;
