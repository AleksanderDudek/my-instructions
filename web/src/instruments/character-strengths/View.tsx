import { Bars, Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { CORE_ORDER, VIRTUES, type StrengthKey, type VirtueKey } from "./items";
import type { StrengthsResult } from "./spec";

const virtueOf = (key: StrengthKey) =>
  (Object.entries(VIRTUES) as [VirtueKey, StrengthKey[]][]).find(([, keys]) => keys.includes(key))![0];

export function View({ result, t }: { result: StrengthsResult; t: T }) {
  const score = (key: StrengthKey) => result.scores[key];
  const label = (key: StrengthKey) => t(`trait.${key}.label`);
  return (
    <>
      <Verdict
        eyebrow={t("view.eyebrow")}
        title={result.flat ? t("view.headlineFlat") : t("view.headline", { strength: label(result.signature[0]) })}
        body={result.flat ? t("view.bodyFlat") : t("view.bodyRanked")}
      />

      {result.flat ? null : (
        <>
          <h4 className="label-caps mt-8">{t("view.signatureHeading")}</h4>
          <Bars
            rows={result.signature.map((key) => ({
              key,
              label: `${label(key)} · ${t(`virtue.${virtueOf(key)}`)}`,
              score: score(key),
              blurb: t(`trait.${key}.blurb`),
            }))}
          />
          {result.tiedAtCut ? <Note>{t("view.tiedAtCut")}</Note> : null}

          <h4 className="label-caps mt-8">{t("view.leastHeading")}</h4>
          <Facts pairs={result.least.map((key): [string, string] => [label(key), t(`trait.${key}.blurb`)])} />
          <Note>
            {t("view.leastNote")}
            {result.tiedAtFloor ? ` ${t("view.tiedAtFloor")}` : null}
          </Note>
        </>
      )}

      <h4 className="label-caps mt-8">{t("view.coreHeading")}</h4>
      <Facts pairs={CORE_ORDER.map((key): [string, string] => [t(`core.${key}.label`), t("view.coreValue", { score: result.core[key], blurb: t(`core.${key}.blurb`) })])} />
      <Note>{t("view.coreNote")}</Note>

      <h4 className="label-caps mt-8">{t("view.allHeading")}</h4>
      <Bars rows={result.ranked.map((r) => ({ key: r.key, label: label(r.key), score: r.score }))} />

      {result.suspect ? <Note tone="warn">{t("view.straightlining")}</Note> : null}
      <Note>{t("view.researchNote")}</Note>
    </>
  );
}
