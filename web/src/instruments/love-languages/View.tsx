import { Bars, Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { GLYPHS } from "./items";
import type { LoveResult } from "./spec";

const rows = (result: LoveResult, t: T) =>
  result.ranked.map((x) => ({
    key: x.key,
    label: t(`lang.${x.key}.label`),
    score: x.score,
    share: x.share,
    blurb: t(`lang.${x.key}.blurb`),
  }));

export function View({ result, t }: { result: LoveResult; t: T }) {
  const p = result.primary.key;
  const s = result.secondary.key;
  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("view.eyebrow")}
        title={`${GLYPHS[p]} ${t(`lang.${p}.label`)}`}
        score={result.primary.score}
        body={`${t(`lang.${p}.fed`)} ${t(`lang.${p}.starved`)}`}
      />
      <Bars rows={rows(result, t)} showShare />
      <Facts
        pairs={[
          [t("view.fact.primary"), t("view.fact.primaryValue", { label: t(`lang.${p}.label`), share: result.primary.share })],
          [t("view.fact.secondary"), t("view.fact.secondaryValue", { label: t(`lang.${s}.label`), share: result.secondary.share })],
          [
            t("view.fact.quiet"),
            result.quiet.length ? result.quiet.map((k) => t(`lang.${k}.label`)).join(", ") : t("view.fact.quietNone"),
          ],
          [t("view.fact.profile"), result.flat ? t("view.fact.profileEven") : t("view.fact.profilePeaked")],
        ]}
      />
      <Note>{result.flat ? t("view.noteEven") : t("view.notePeaked", { language: t(`lang.${p}.inline`) })}</Note>
    </>
  );
}
