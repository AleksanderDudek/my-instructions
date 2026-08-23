import { Facts, Note, Verdict } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { FIELDS, MULTI } from "./fields";
import { listOf, type WorkingStyleResult } from "./spec";

/**
 * The answers, arranged — and deliberately no number anywhere on the page.
 *
 * There is nothing to band and nothing to rank, so there are no bars: a bar
 * would imply that "a week's notice" is more of something than "a day's", and
 * it is not. It is a different request.
 */
export function View({ result, t }: { result: WorkingStyleResult; t: T }) {
  return (
    <>
      <Verdict t={t} eyebrow={t("view.eyebrow")} title={t("view.title")} body={t("view.body")} />
      <Facts
        pairs={[
          ...FIELDS.map((f): [string, string] => [
            t(`field.${f.id}.label`),
            t(`answer.${f.id}.${result.choices[f.id]}`),
          ]),
          ...MULTI.map((f): [string, string] => [
            t(`field.${f.id}.label`),
            listOf(result, f.id, t) || t("view.nonePicked"),
          ]),
        ]}
      />
      <Note>{t("view.notAMeasureNote")}</Note>
      <Note tone="warn">{t("view.notForDecisionsNote")}</Note>
    </>
  );
}
