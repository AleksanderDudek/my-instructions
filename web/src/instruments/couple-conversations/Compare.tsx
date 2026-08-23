import { Verdict, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { compare, type ConversationsResult } from "./spec";

/**
 * Two columns of positions and no distance between them.
 *
 * The card order comes from `compare()`, which sorts by how little the pair has
 * discussed a topic rather than by how far apart they are — so the top of the
 * page is the next conversation, not the worst disagreement.
 */
export function Compare({
  a,
  b,
  nameA = "A",
  nameB = "B",
  t,
}: {
  a: ConversationsResult;
  b: ConversationsResult;
  nameA?: string;
  nameB?: string;
  t: T;
}) {
  const { rows, unspoken } = compare(a, b);

  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("compare.eyebrow")}
        title={t("compare.title", { count: unspoken })}
        body={t(unspoken ? "compare.body" : "compare.bodyAllDiscussed", { nameA, nameB })}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.id} className="rounded-sm border border-rule bg-panel-2 p-5">
            <span className="label-caps mb-2 block">
              {t(`topic.${row.id}.label`)} · {t(`status.${row.status ?? "never"}`)}
            </span>
            <h4 className="mb-2 text-base">
              {t("compare.positions", {
                nameA,
                nameB,
                a: row.mine.lean ? t(`lean.${row.id}.${row.mine.lean}`) : t("view.noPosition"),
                b: row.theirs.lean ? t(`lean.${row.id}.${row.theirs.lean}`) : t("view.noPosition"),
              })}
            </h4>
            {row.statusDiffers ? (
              <p className="mb-2 text-sm leading-relaxed text-muted">{t("compare.statusDiffers")}</p>
            ) : null}
            {row.surprise ? <p className="mb-2 text-sm leading-relaxed text-muted">{t("compare.surprise")}</p> : null}
            <p className="text-sm leading-relaxed text-muted">{t(`topic.${row.id}.opener`)}</p>
          </div>
        ))}
      </div>

      <Note>{t("compare.notAScoreNote")}</Note>
    </>
  );
}
