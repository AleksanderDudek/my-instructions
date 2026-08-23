import { Bars, Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { wingsOf } from "./items";
import type { EnneagramResult } from "./spec";

const rows = (result: EnneagramResult, t: T) =>
  result.ranked.map((x) => ({
    key: x.key,
    label: t("view.typeLabel", { number: x.type, name: t(`type.${x.type}.name`) }),
    score: x.score,
    blurb: t(`type.${x.type}.core`),
  }));

export function View({ result, t }: { result: EnneagramResult; t: T }) {
  const n = result.type;
  const c = result.dominantCentre;
  const [wa, wb] = wingsOf(n);
  return (
    <>
      <Verdict
        t={t}
        eyebrow={result.confident ? t("view.eyebrowConfident") : t("view.eyebrowShortlist")}
        title={
          result.confident
            ? t("view.titleConfident", { number: n, wing: result.wing, name: t(`type.${n}.name`) })
            : t("view.titleShortlist", { a: n, b: result.second })
        }
        score={result.ranked[0].score}
        body={
          result.confident
            ? t("view.bodyConfident", { blurb: t(`type.${n}.blurb`), motive: t(`type.${n}.core`) })
            : t("view.bodyShortlist", {
                a: n,
                b: result.second,
                nameA: t(`type.${n}.name`),
                nameB: t(`type.${result.second}.name`),
                margin: result.margin,
                fearA: t(`type.${n}.fear`),
                fearB: t(`type.${result.second}.fear`),
              })
        }
      />
      <Bars rows={rows(result, t)} />
      <Facts
        pairs={[
          [t("view.fact.fear"), t(`type.${n}.fear`)],
          [t("view.fact.desire"), t(`type.${n}.want`)],
          [
            t("view.fact.wing"),
            result.wingClose
              ? t("view.wingUnsettled", { number: n, a: wa, b: wb, margin: result.wingMargin })
              : t("view.wingSettled", { number: n, wing: result.wing, motive: t(`type.${result.wing}.core`) }),
          ],
          [t("view.fact.centre"), t("view.centreValue", { label: t(`centre.${c}.label`), blurb: t(`centre.${c}.blurb`) })],
          [t("view.fact.stress"), t("view.lineValue", { to: result.lines.stress, body: t(`type.${n}.stress`) })],
          [t("view.fact.growth"), t("view.lineValue", { to: result.lines.ease, body: t(`type.${n}.ease`) })],
        ]}
      />
      <Note>{t("view.motiveNote")}</Note>
    </>
  );
}
