import { Verdict, Facts } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { compare, type BigFiveResult } from "./spec";

export function Compare({
  a,
  b,
  nameA = "A",
  nameB = "B",
  t,
}: {
  a: BigFiveResult;
  b: BigFiveResult;
  nameA?: string;
  nameB?: string;
  t: T;
}) {
  const { gaps, widest, closest, mean } = compare(a, b);
  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("compare.eyebrow")}
        title={t("compare.title", { mean })}
        body={t("compare.body", {
          widest: t(`factor.${widest.key}.inline`),
          closest: t(`factor.${closest.key}.inline`),
          nameA,
          nameB,
          widestA: widest.a,
          widestB: widest.b,
        })}
      />
      <Facts
        pairs={gaps.map((g): [string, string] => [
          t(`factor.${g.key}.label`),
          t("compare.factValue", { nameA, nameB, a: g.a, b: g.b, gap: g.gap }),
        ])}
      />
    </>
  );
}
