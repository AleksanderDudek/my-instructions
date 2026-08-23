import { Bars, Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { GLYPHS } from "./items";
import type { JungianResult } from "./spec";

const rows = (result: JungianResult, t: T) =>
  result.ranked.map((r) => ({
    key: r.key,
    label: `${GLYPHS[r.key]} ${t(`fn.${r.key}.label`)}`,
    score: r.score,
    blurb: t(`fn.${r.key}.blurb`),
  }));

/** The stack read top to bottom: what leads, what supports, what is weakest. */
const POSITIONS = ["dominant", "auxiliary", "tertiary", "inferior"];

export function View({ result, t }: { result: JungianResult; t: T }) {
  return (
    <>
      <Verdict
        t={t}
        eyebrow={result.confident ? t("view.eyebrowConfident") : t("view.eyebrowClose")}
        title={t("view.title", { code: result.code, fn: t(`fn.${result.dominant}.label`) })}
        score={result.ranked[0].score}
        body={
          result.confident
            ? t("view.bodyConfident", {
                blurb: t(`fn.${result.dominant}.blurb`),
                aux: t(`fn.${result.auxiliary}.label`),
              })
            : t("view.bodyClose", {
                a: t(`fn.${result.dominant}.label`),
                b: t(`fn.${result.runnerUp}.label`),
                margin: result.margin,
              })
        }
      />
      <Bars rows={rows(result, t)} />
      <Facts
        pairs={[
          [
            t("view.position.temperament"),
            t("view.temperamentValue", {
              name: t(`temperament.${result.temperament}.label`),
              blurb: t(`temperament.${result.temperament}.blurb`),
            }),
          ],
          ...result.stack.map((fn, i): [string, string] => [
            t(`view.position.${POSITIONS[i]}`),
            t("view.stackValue", { fn: t(`fn.${fn}.label`), score: result.scores[fn], blurb: t(`fn.${fn}.blurb`) }),
          ]),
        ]}
      />
      <Note>
        {t("view.inferiorNote", {
          fn: t(`fn.${result.inferior}.label`),
          grip: t(`fn.${result.inferior}.inferior`),
        })}
      </Note>
      <Note>{t("view.codeNote")}</Note>
    </>
  );
}
