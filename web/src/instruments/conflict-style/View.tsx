import { Bars, Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { MIDPOINT, type ConflictResult } from "./spec";

const rows = (result: ConflictResult, t: T) => [
  { key: "assertiveness", label: t("dim.assertiveness.label"), score: result.assertiveness, blurb: t("dim.assertiveness.blurb") },
  { key: "cooperativeness", label: t("dim.cooperativeness.label"), score: result.cooperativeness, blurb: t("dim.cooperativeness.blurb") },
];

export function View({ result, t }: { result: ConflictResult; t: T }) {
  const mode = result.mode;
  const fallback = result.fallback;
  return (
    <>
      <Verdict t={t} eyebrow={t("view.eyebrow")} title={t(`mode.${mode}.label`)} body={t(`mode.${mode}.blurb`)} />
      <Bars rows={rows(result, t)} />
      <Facts
        pairs={[
          [t("view.fact.opening"), t("view.openingValue", { mode: t(`mode.${mode}.label`), cost: t(`mode.${mode}.cost`) })],
          [t("view.fact.fallback"), t("view.fallbackValue", { mode: t(`mode.${fallback}.label`), blurb: t(`mode.${fallback}.blurb`) })],
          [
            t("dim.assertiveness.label"),
            t("view.dimValue", {
              score: result.assertiveness,
              blurb: t(`dim.assertiveness.${result.assertiveness >= MIDPOINT ? "high" : "low"}`),
            }),
          ],
          [
            t("dim.cooperativeness.label"),
            t("view.dimValue", {
              score: result.cooperativeness,
              blurb: t(`dim.cooperativeness.${result.cooperativeness >= MIDPOINT ? "high" : "low"}`),
            }),
          ],
        ]}
      />
      <Note>{t("view.noBestModeNote")}</Note>
      <Note>{t("view.middleNote")}</Note>
    </>
  );
}
