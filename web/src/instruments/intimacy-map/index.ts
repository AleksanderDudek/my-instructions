import spec from "./spec";
import { View } from "./View";
import { PairView } from "./PairView";
import provenance from "./provenance";

/** The module shape the registry expects: logic, a view, and a paper trail. */
const intimacyMap = { spec, View, PairView, provenance };

export default intimacyMap;
