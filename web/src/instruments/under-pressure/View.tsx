import { Bars, Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { GLYPHS } from "./items";
import type { UnderPressureResult } from "./spec";

export function View({ result, t }: { result: UnderPressureResult; t: T }) {
  const headline = result.marked.length
    ? result.marked.map((p) => t("view.headlineItem", { band: t(p.bandKey), trait: t(`trait.${p.key}.inline`) })).join(", ")
    : t("view.headlineFlat");
  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("view.eyebrow")}
        title={headline}
        body={result.flat ? t("view.bodyFlat") : t("view.bodyMarked")}
      />
      <Bars
        rows={result.profile.map((p) => ({
          key: p.key,
          label: `${GLYPHS[p.key]} ${t(`trait.${p.key}.label`)}`,
          score: p.score,
          blurb: t(`trait.${p.key}.${p.side}`),
        }))}
      />
      <Facts
        pairs={[
          ...result.profile.map((p): [string, string] => [
            t(`trait.${p.key}.label`),
            t("view.factValue", { score: p.score, band: t(p.bandKey), blurb: t(`trait.${p.key}.${p.side}`) }),
          ]),
          [t("view.overallLabel"), t("view.overallValue", { score: result.overall, band: t(result.overallBand) })],
        ]}
      />
      {result.suspect ? <Note tone="warn">{t("view.straightlining")}</Note> : null}
      <Note>{t("view.researchNote")}</Note>
    </>
  );
}
