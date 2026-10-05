import { Bars, Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import type { InterpersonalResult } from "./spec";

export function View({ result, t }: { result: InterpersonalResult; t: T }) {
  const tied = result.leading.length > 1;
  return (
    <>
      <Verdict
        eyebrow={t("view.eyebrow")}
        title={t(`quadrant.${result.quadrant}.label`)}
        body={t(`quadrant.${result.quadrant}.body`)}
      />
      <Facts
        pairs={[
          [t("axis.dominance.label"), t("view.axisValue", { score: result.dominance, blurb: t(`axis.dominance.${result.dominance > 50 ? "high" : "low"}`) })],
          [t("axis.warmth.label"), t("view.axisValue", { score: result.warmth, blurb: t(`axis.warmth.${result.warmth > 50 ? "high" : "low"}`) })],
        ]}
      />
      <h4 className="label-caps mt-8">{t("view.octantsHeading")}</h4>
      <Bars
        rows={result.octants.map((o) => ({
          key: o.key,
          label: t(`octant.${o.key}.label`),
          score: o.score,
          blurb: t(`octant.${o.key}.blurb`),
        }))}
      />
      {tied ? <Note>{t("view.tied", { octants: result.leading.map((k) => t(`octant.${k}.inline`)).join(", ") })}</Note> : null}
      {result.suspect ? <Note tone="warn">{t("view.straightlining")}</Note> : null}
      <Note>{t("view.researchNote")}</Note>
    </>
  );
}
