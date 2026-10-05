import { Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { compare, type InterpersonalResult } from "./spec";

export function Compare({
  a,
  b,
  nameA = "A",
  nameB = "B",
  t,
}: {
  a: InterpersonalResult;
  b: InterpersonalResult;
  nameA?: string;
  nameB?: string;
  t: T;
}) {
  const c = compare(a, b);
  return (
    <>
      <Verdict
        eyebrow={t("compare.eyebrow")}
        title={t("compare.title", { nameA, nameB, quadrantA: t(`quadrant.${c.quadrantA}.inline`), quadrantB: t(`quadrant.${c.quadrantB}.inline`) })}
        body={t("compare.body")}
      />
      <Facts
        pairs={c.axes.map((g): [string, string] => [
          t(`axis.${g.key}.label`),
          t("compare.axisValue", { nameA, nameB, a: g.a, b: g.b, gap: g.gap }),
        ])}
      />
      <h4 className="label-caps mt-8">{t("compare.octantsHeading")}</h4>
      <Facts
        pairs={c.octants.slice(0, 3).map((g): [string, string] => [
          t(`octant.${g.key}.label`),
          t("compare.octantValue", { nameA, nameB, a: g.a, b: g.b, gap: g.gap }),
        ])}
      />
      <Note>{t("compare.note")}</Note>
    </>
  );
}
