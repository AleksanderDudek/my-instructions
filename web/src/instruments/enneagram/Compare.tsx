import { Verdict } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { compare, type EnneagramResult } from "./spec";

/** One person's half of the exchange: what they ask for, and how they fight. */
function Side({ title, type, t }: { title: string; type: number; t: T }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="label-caps">{title}</span>
      <p className="max-w-[48ch] text-[0.95rem] leading-relaxed text-ink/90">{t(`type.${type}.ask`)}</p>
      <p className="max-w-[48ch] text-[0.95rem] leading-relaxed text-ink/90">{t(`type.${type}.conflict`)}</p>
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
  a: EnneagramResult;
  b: EnneagramResult;
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
        title={t("compare.title", {
          a: a.type,
          b: b.type,
          nameA: t(`type.${a.type}.name`),
          nameB: t(`type.${b.type}.name`),
        })}
        body={t(bodyKey)}
      />
      <div className="grid gap-8 sm:grid-cols-2">
        <Side title={t("compare.needsFrom", { a: nameA, b: nameB })} type={a.type} t={t} />
        <Side title={t("compare.needsFrom", { a: nameB, b: nameA })} type={b.type} t={t} />
      </div>
    </>
  );
}
