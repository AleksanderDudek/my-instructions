import { Bars, Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { GLYPHS } from "./items";
import type { BigFiveResult } from "./spec";

const rows = (result: BigFiveResult, t: T) =>
  result.profile.map((p) => ({
    key: p.key,
    label: `${GLYPHS[p.key]} ${t(`factor.${p.key}.label`)}`,
    score: p.score,
    blurb: t(`factor.${p.key}.${p.side}`),
  }));

export function View({ result, t }: { result: BigFiveResult; t: T }) {
  const headline = result.marked.length
    ? result.marked
        .map((p) => t("view.headlineItem", { band: t(p.bandKey), factor: t(`factor.${p.key}.inline`) }))
        .join(", ")
    : t("view.headlineFlat");
  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("view.eyebrow")}
        title={headline}
        body={result.flat ? t("view.bodyFlat") : t("view.bodyMarked")}
      />
      <Bars rows={rows(result, t)} />
      <Facts
        pairs={result.profile.map((p): [string, string] => [
          t(`factor.${p.key}.label`),
          t("view.factValue", { score: p.score, band: t(p.bandKey), blurb: t(`factor.${p.key}.${p.side}`) }),
        ])}
      />
      {result.suspect ? <Note tone="warn">{t("view.straightlining")}</Note> : null}
      <Note>{t("view.researchNote")}</Note>
    </>
  );
}
