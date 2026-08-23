import { Bars, Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { MIDPOINT, type AttachmentResult } from "./spec";

const rows = (result: AttachmentResult, t: T) => [
  { key: "anxiety", label: t("dim.anxiety.label"), score: result.anxiety, blurb: t("dim.anxiety.blurb") },
  { key: "avoidance", label: t("dim.avoidance.label"), score: result.avoidance, blurb: t("dim.avoidance.blurb") },
];

export function View({ result, t }: { result: AttachmentResult; t: T }) {
  const style = t(`style.${result.style}.label`);
  return (
    <>
      <Verdict
        t={t}
        eyebrow={result.borderline ? t("view.eyebrowBorderline") : t("view.eyebrow")}
        title={style}
        body={
          result.borderline
            ? t("view.bodyBorderline", { style, anxiety: result.anxiety, avoidance: result.avoidance })
            : t(`style.${result.style}.blurb`)
        }
      />
      <Bars rows={rows(result, t)} />
      <Facts
        pairs={[
          [
            t("dim.anxiety.label"),
            t("view.dimValue", {
              score: result.anxiety,
              blurb: t(`dim.anxiety.${result.anxiety >= MIDPOINT ? "high" : "low"}`),
            }),
          ],
          [
            t("dim.avoidance.label"),
            t("view.dimValue", {
              score: result.avoidance,
              blurb: t(`dim.avoidance.${result.avoidance >= MIDPOINT ? "high" : "low"}`),
            }),
          ],
          [t("view.fact.position"), t("view.positionValue", { strength: result.strength })],
          [t("view.fact.underStress"), t(`style.${result.style}.stress`)],
        ]}
      />
      <Note>{t("view.notCategoriesNote")}</Note>
      <Note>{t("view.changeNote")}</Note>
    </>
  );
}
