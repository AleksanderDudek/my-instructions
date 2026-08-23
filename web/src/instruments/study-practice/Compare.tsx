import { Verdict, Facts } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { compare, type StudyResult } from "./spec";

/**
 * A swap, not a diagnosis. Two people revising differently costs nobody
 * anything, so the only reading worth printing is what each one does that the
 * other does not — and the count at the top is two counts, side by side,
 * rather than a distance between them.
 */
export function Compare({
  a,
  b,
  nameA = "A",
  nameB = "B",
  t,
}: {
  a: StudyResult;
  b: StudyResult;
  nameA?: string;
  nameB?: string;
  t: T;
}) {
  const { shared, aOnly, bOnly, same } = compare(a, b);
  const names = (list: string[]) => list.map((id) => t(`technique.${id}.label`)).join(", ");

  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("compare.eyebrow")}
        title={t("compare.title", { a: a.repertoire, b: b.repertoire, total: a.total })}
        body={t(same ? "compare.bodySame" : "compare.body", { nameA, nameB })}
      />
      <Facts
        pairs={[
          [t("compare.fact.shared"), shared.length ? names(shared) : t("compare.none")],
          [t("compare.fact.aOnly", { name: nameA }), aOnly.length ? names(aOnly) : t("compare.none")],
          [t("compare.fact.bOnly", { name: nameB }), bOnly.length ? names(bOnly) : t("compare.none")],
        ]}
      />
    </>
  );
}
