import { Facts, Verdict } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { hours, toClock } from "./compute";
import { compare, type ChronotypeResult } from "./spec";

export function Compare({
  a,
  b,
  nameA = "A",
  nameB = "B",
  t,
}: {
  a: ChronotypeResult;
  b: ChronotypeResult;
  nameA?: string;
  nameB?: string;
  t: T;
}) {
  const comparison = compare(a, b);
  if (a.incomplete || b.incomplete || !comparison) {
    return <p className="max-w-[62ch] leading-relaxed text-muted">{t("view.incomplete")}</p>;
  }

  const { apart, overlap, from, to, band } = comparison;

  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("compare.eyebrow")}
        title={t("compare.title", { hours: hours(apart) })}
        body={t(`compare.${band}`, { nameA, nameB, hours: hours(apart), overlap: hours(overlap) })}
      />
      <Facts
        pairs={[
          [
            t("compare.fact.mid"),
            t("compare.midValue", { nameA, nameB, a: toClock(a.msfsc), b: toClock(b.msfsc) }),
          ],
          [
            t("compare.fact.overlap"),
            overlap > 0
              ? t("compare.overlapValue", { hours: hours(overlap), from: toClock(from), to: toClock(to) })
              : t("compare.overlapNone"),
          ],
          [
            t("compare.fact.jetlag"),
            t("compare.jetlagValue", { nameA, nameB, a: hours(a.socialJetlag), b: hours(b.socialJetlag) }),
          ],
        ]}
      />
    </>
  );
}
