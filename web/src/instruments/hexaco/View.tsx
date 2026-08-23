import { Bars, Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { GLYPHS } from "./items";
import type { HexacoResult } from "./spec";

const rows = (result: HexacoResult, t: T) =>
  result.profile.map((p) => ({
    key: p.key,
    label: `${GLYPHS[p.key]} ${t(`factor.${p.key}.label`)}`,
    score: p.score,
    blurb: t(`factor.${p.key}.${p.side}`),
  }));

export function View({ result, t }: { result: HexacoResult; t: T }) {
  const h = result.honesty;
  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("view.eyebrow")}
        title={t("view.honestyTitle", { band: t(h.bandKey) })}
        score={h.score}
        body={t(`factor.honesty.${h.side}`)}
      />
      <Bars rows={rows(result, t)} />
      <Facts
        pairs={result.profile.map((p): [string, string] => [
          t(`factor.${p.key}.label`),
          t("view.factValue", { score: p.score, band: t(p.bandKey), blurb: t(`factor.${p.key}.${p.side}`) }),
        ])}
      />
      {result.suspect ? <Note tone="warn">{t("view.straightlining")}</Note> : null}
      <Note>{t("view.sixthFactorNote")}</Note>
    </>
  );
}
