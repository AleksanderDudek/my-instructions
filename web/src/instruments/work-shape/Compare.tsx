import { Verdict, Facts } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { compare, type WorkShapeResult } from "./spec";

export function Compare({
  a, b, nameA = "A", nameB = "B", t,
}: { a: WorkShapeResult; b: WorkShapeResult; nameA?: string; nameB?: string; t: T }) {
  const { both, aOnly, bOnly } = compare(a, b);
  const label = (k: string) => t(`shape.${k}.label`);
  const names = (list: string[]) => (list.length ? list.map(label).join(", ") : t("compare.none"));
  const split = aOnly.length > 0 || bOnly.length > 0;

  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("compare.eyebrow")}
        title={
          both.length && split
            ? t("compare.titleMixed")
            : both.length
              ? t("compare.titleSame")
              : split
                ? t("compare.titleSplit")
                : t("compare.titleNeither")
        }
        body={t(split ? "compare.body" : "compare.bodySame", { nameA, nameB })}
      />
      <Facts
        pairs={[
          [t("compare.fact.both"), names(both)],
          [t("compare.fact.aOnly", { name: nameA }), names(aOnly)],
          [t("compare.fact.bOnly", { name: nameB }), names(bOnly)],
        ]}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <span className="label-caps">{t("compare.givesEnergy", { name: nameA })}</span>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{t(`shape.${a.top[0]}.ask`)}</p>
        </div>
        <div>
          <span className="label-caps">{t("compare.givesEnergy", { name: nameB })}</span>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{t(`shape.${b.top[0]}.ask`)}</p>
        </div>
      </div>
    </>
  );
}
