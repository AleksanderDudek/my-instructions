import { Verdict, Facts } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { compare, type ConflictResult } from "./spec";

function WorksWith({ title, ask }: { title: string; ask: string }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="label-caps">{title}</span>
      <p className="max-w-[48ch] text-[0.95rem] leading-relaxed text-ink/90">{ask}</p>
    </div>
  );
}

export function Compare({
  a,
  b,
  nameA = "A",
  nameB = "B",
  t,
}: {
  a: ConflictResult;
  b: ConflictResult;
  nameA?: string;
  nameB?: string;
  t: T;
}) {
  const { bodyKey } = compare(a, b);
  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("compare.eyebrow")}
        title={t("compare.title", { a: t(`mode.${a.mode}.label`), b: t(`mode.${b.mode}.label`) })}
        body={t(bodyKey, { nameA, nameB, mode: t(`mode.${a.mode}.label`) })}
      />
      <Facts
        pairs={[
          [t("dim.assertiveness.label"), t("compare.dimValue", { nameA, nameB, a: a.assertiveness, b: b.assertiveness })],
          [t("dim.cooperativeness.label"), t("compare.dimValue", { nameA, nameB, a: a.cooperativeness, b: b.cooperativeness })],
          [
            t("compare.fact.fallbacks"),
            t("compare.fallbackValue", { nameA, nameB, a: t(`mode.${a.fallback}.label`), b: t(`mode.${b.fallback}.label`) }),
          ],
        ]}
      />
      <div className="grid gap-8 sm:grid-cols-2">
        <WorksWith title={t("compare.worksWith", { name: nameA })} ask={t(`mode.${a.mode}.ask`)} />
        <WorksWith title={t("compare.worksWith", { name: nameB })} ask={t(`mode.${b.mode}.ask`)} />
      </div>
    </>
  );
}
