import { Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { agenda, type ConversationsResult } from "./spec";

/**
 * No bars and no number, because there is nothing here that is a quantity.
 * The report is a list of five topics ordered by how little they have been
 * discussed, and the three notes underneath it are load-bearing: they are the
 * part that stops a reader turning a list of conversations into a verdict.
 */
export function View({ result, t }: { result: ConversationsResult; t: T }) {
  const rows = agenda(result);

  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("view.eyebrow")}
        title={t("view.title", { count: result.unspoken })}
        body={t(result.unspoken ? "view.body" : "view.bodyNoneUnspoken")}
      />

      <Facts
        pairs={rows.map((row): [string, string] => [
          t(`topic.${row.id}.label`),
          t("view.rowValue", {
            status: t(`status.${row.status ?? "never"}`),
            lean: row.lean ? t(`lean.${row.id}.${row.lean}`) : t("view.noPosition"),
          }),
        ])}
      />

      <Note>{t("view.childrenPrompt")}</Note>
      <Note>{t("view.notAPredictionNote")}</Note>
      <Note>{t("view.agreementNote")}</Note>
      {result.careless ? <Note tone="warn">{t("view.carelessNote")}</Note> : null}
    </>
  );
}
