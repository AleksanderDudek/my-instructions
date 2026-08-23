import { defineConfig } from "eslint/config";
import next from "eslint-config-next";

export default defineConfig([
  ...next,
  {
    // Message tables and provenance records are data files: one exported
    // object each, by design. Naming a variable purely to satisfy a rule aimed
    // at components would be 68 files of churn for nothing.
    files: ["src/i18n/messages/*.ts", "src/instruments/*/i18n/*.ts", "src/instruments/*/provenance.ts"],
    rules: { "import/no-anonymous-default-export": "off" },
  },
]);
