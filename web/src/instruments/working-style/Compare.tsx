import { Facts, Verdict } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { compare, type WorkingStyleResult } from "./spec";

/**
 * The clashes, named, in the order the questions are asked.
 *
 * No overall fit figure: two people's preferences do not average, they collide
 * on particular questions, and a card that says which one and what to do about
 * it is worth more than a percentage that says how close they are.
 */
export function Compare({
  a,
  b,
  nameA = "A",
  nameB = "B",
  t,
}: {
  a: WorkingStyleResult;
  b: WorkingStyleResult;
  nameA?: string;
  nameB?: string;
  t: T;
}) {
  const { clashes, agreements, sharedPeak } = compare(a, b);

  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("compare.eyebrow")}
        title={clashes.length ? t("compare.title", { count: clashes.length }) : t("compare.titleNone")}
        body={
          clashes.length
            ? t("compare.body", { nameA, nameB })
            : t("compare.bodyNone", { nameA, nameB })
        }
      />

      {clashes.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {clashes.map((id) => (
            <div key={id} className="rounded-sm border border-rule bg-panel-2 p-5">
              <span className="label-caps mb-2 block">{t(`field.${id}.label`)}</span>
              <h4 className="mb-2 text-base">
                {t("compare.clashHeading", {
                  nameA,
                  nameB,
                  a: t(`field.${id}.${a.choices[id]}`),
                  b: t(`field.${id}.${b.choices[id]}`),
                })}
              </h4>
              <p className="text-sm leading-relaxed text-muted">{t(`clash.${id}`)}</p>
            </div>
          ))}
        </div>
      ) : null}

      <Facts
        pairs={[
          [
            t("compare.fact.agreed"),
            agreements.length
              ? agreements.map((id) => t(`field.${id}.label`)).join(", ")
              : t("compare.agreedNone"),
          ],
          [
            t("compare.fact.peak"),
            sharedPeak.length
              ? sharedPeak.map((v) => t(`field.peak.${v}`)).join(", ")
              : t("compare.peakNone"),
          ],
        ]}
      />
    </>
  );
}
