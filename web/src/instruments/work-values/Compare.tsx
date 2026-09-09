import { Verdict, Facts } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { compare, type WorkValuesResult } from "./spec";

export function Compare({
  a, b, nameA = "A", nameB = "B", t,
}: { a: WorkValuesResult; b: WorkValuesResult; nameA?: string; nameB?: string; t: T }) {
  const { oneSided, shared, needsFirst } = compare(a, b);
  const label = (k: string) => t(`value.${k}.label`);

  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("compare.eyebrow")}
        title={oneSided.length ? t("compare.title", { count: oneSided.length }) : t("compare.titleNone")}
        body={t(oneSided.length ? "compare.body" : "compare.bodyNone", { nameA, nameB })}
      />
      {oneSided.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {oneSided.map((k, i) => (
            <div key={k} className="flex flex-col gap-2 border-l-2 border-brass bg-panel p-5">
              <span className="label-caps">{label(k)}</span>
              <h5 className="font-display text-base font-semibold">
                {t("compare.clashHeading", {
                  needs: needsFirst[i] ? nameA : nameB,
                  shrugs: needsFirst[i] ? nameB : nameA,
                })}
              </h5>
              <p className="text-sm leading-relaxed text-muted">{t(`value.${k}.clash`)}</p>
            </div>
          ))}
        </div>
      ) : null}
      <Facts
        pairs={[
          [t("compare.fact.shared"), shared.length ? shared.map(label).join(", ") : t("compare.sharedNone")],
          [t("compare.fact.leads"), t("compare.leadsValue", { nameA, nameB, a: label(a.lead), b: label(b.lead) })],
        ]}
      />
    </>
  );
}
