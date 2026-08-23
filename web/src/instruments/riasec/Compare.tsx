import { Verdict, Facts } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { compare, type RiasecResult } from "./spec";
import type { TypeKey } from "./items";

function Energises({ title, lead, t }: { title: string; lead: TypeKey; t: T }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="label-caps">{title}</span>
      <p className="max-w-[48ch] text-[0.95rem] leading-relaxed text-ink/90">{t(`type.${lead}.ask`)}</p>
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
  a: RiasecResult;
  b: RiasecResult;
  nameA?: string;
  nameB?: string;
  t: T;
}) {
  const { shared, gap, bodyKey } = compare(a, b);
  const names = shared.map((k) => t(`type.${k}.label`)).join(", ");
  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("compare.eyebrow")}
        title={t("compare.title", { a: a.code, b: b.code })}
        body={t(bodyKey, {
          nameA,
          nameB,
          shared: names,
          a: t(`type.${a.top[0]}.label`),
          b: t(`type.${b.top[0]}.label`),
        })}
      />
      <Facts
        pairs={[
          [t("compare.fact.codes"), t("compare.codesValue", { nameA, nameB, a: a.code, b: b.code })],
          [t("compare.fact.shared"), shared.length ? names : t("compare.sharedNone")],
          [t("compare.fact.distance"), t("compare.distanceValue", { steps: gap })],
        ]}
      />
      <div className="grid gap-8 sm:grid-cols-2">
        <Energises title={t("compare.givesEnergy", { name: nameA })} lead={a.top[0]} t={t} />
        <Energises title={t("compare.givesEnergy", { name: nameB })} lead={b.top[0]} t={t} />
      </div>
    </>
  );
}
