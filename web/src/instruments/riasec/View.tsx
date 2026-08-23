import { Bars, Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { GLYPHS } from "./items";
import type { RiasecResult } from "./spec";

const rows = (result: RiasecResult, t: T) =>
  result.ranked.map((r) => ({
    key: r.key,
    label: `${GLYPHS[r.key]} ${t(`type.${r.key}.label`)}`,
    score: r.score,
    blurb: t(`type.${r.key}.blurb`),
  }));

export function View({ result, t }: { result: RiasecResult; t: T }) {
  const [first, second, third] = result.top;
  return (
    <>
      <Verdict
        t={t}
        eyebrow={result.flat ? t("view.eyebrowFlat") : t("view.eyebrow")}
        title={
          result.flat
            ? t("view.titleFlat")
            : t("view.title", { code: result.code, first: t(`type.${first}.label`) })
        }
        score={result.ranked[0].score}
        body={
          result.flat
            ? t("view.bodyFlat", { spread: result.spread })
            : t("view.body", {
                first: t(`type.${first}.label`),
                second: t(`type.${second}.label`),
                blurb: t(`type.${first}.blurb`),
              })
        }
      />
      <Bars rows={rows(result, t)} />
      <Facts
        pairs={[
          [
            t("view.fact.code"),
            t("view.codeValue", {
              code: result.code,
              names: [first, second, third].map((k) => t(`type.${k}.label`)).join(" · "),
            }),
          ],
          [t("view.fact.spread"), t(result.flat ? "view.spreadFlat" : "view.spreadValue", { spread: result.spread })],
          [
            t("view.fact.consistency"),
            t(`view.consistency.${result.consistency}`, {
              a: t(`type.${first}.label`),
              b: t(`type.${second}.label`),
            }),
          ],
        ]}
      />
      <Note>{t("view.hexagonNote")}</Note>
      <Note>{t("view.notACareerNote")}</Note>
    </>
  );
}
