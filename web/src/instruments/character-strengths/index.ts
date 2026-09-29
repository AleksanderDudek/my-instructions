import spec from "./spec";
import { View } from "./View";
import provenance from "./provenance";

/** The module shape the registry expects: logic, a view, and a paper trail. */
const characterStrengths = { spec, View, provenance };

export default characterStrengths;
