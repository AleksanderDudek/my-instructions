import { Bars, Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { GLYPHS } from "./items";
import type { WorkValuesResult } from "./spec";

const rows = (result: WorkValuesResult, t: T) =>
  result.ranked.map((r) => ({
    key: r.key,
    label: `${GLYPHS[r.key]} ${t(`value.${r.key}.label`)}`,
    score: r.score,
    blurb: t(`value.${r.key}.blurb`),
  }));

export function View({ result, t }: { result: WorkValuesResult; t: T }) {
  const [first, second] = result.top;
  const names = (keys: string[]) => keys.map((k) => t(`value.${k}.label`)).join(", ");

  return (
    <>
      <Verdict
        t={t}
        // A flat profile at the *top* of the range is not the flat profile the
        // "no value stands out" copy describes. Someone who called all six
        // essential has a very definite list; what they lack is a way to choose
        // between its items, and telling them they carry no checklist into a job
        // would be the exact opposite of true. Elevation decides which sentence
        // a flat profile gets, so the two readings can never both be printed.
        eyebrow={
          result.undiscriminating
            ? t("view.eyebrowEverything")
            : result.flat
              ? t("view.eyebrowFlat")
              : t("view.eyebrow")
        }
        title={
          result.undiscriminating
            ? t("view.titleEverything")
            : result.flat
              ? t("view.titleFlat")
              : t("view.title", { first: t(`value.${first}.label`) })
        }
        score={result.ranked[0].score}
        body={
          result.undiscriminating
            ? t("view.bodyEverything", {
                count: result.mustHaves.length,
                first: t(`value.${first}.label`),
                second: t(`value.${second}.label`),
              })
            : result.flat
              ? t("view.bodyFlat", { spread: result.spread })
              : t("view.body", {
                  first: t(`value.${first}.label`),
                  second: t(`value.${second}.label`),
                  blurb: t(`value.${first}.blurb`),
                })
        }
      />

      <Bars rows={rows(result, t)} />

      <section className="mt-9">
        <h4 className="mb-4 flex flex-wrap items-baseline gap-3 font-display text-lg">
          {t("view.askHeading")}
          <span className="label-caps">{t("view.askNote")}</span>
        </h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.top.map((key) => (
            <div key={key} className="flex flex-col gap-2 border-l-2 border-brass bg-panel p-5">
              <span className="label-caps">{t(`value.${key}.label`)}</span>
              <h5 className="font-display text-base font-semibold">{t(`value.${key}.lookFor`)}</h5>
              <p className="text-sm leading-relaxed text-muted">{t(`value.${key}.ask`)}</p>
            </div>
          ))}
        </div>
      </section>

      <Facts
        pairs={[
          [
            t("view.fact.essential"),
            result.nothingEssential
              ? t("view.essentialNone")
              : t("view.essentialValue", { count: result.mustHaves.length, names: names(result.mustHaves) }),
          ],
          [
            t("view.fact.tradeable"),
            result.tradeable.length
              ? t("view.tradeableValue", { names: names(result.tradeable) })
              : t("view.tradeableNone"),
          ],
          [
            t("view.fact.spread"),
            t(result.flat ? "view.spreadFlat" : "view.spreadValue", { spread: result.spread }),
          ],
        ]}
      />

      {result.undiscriminating ? (
        <Note>{t("view.undiscriminatingNote", { count: result.mustHaves.length })}</Note>
      ) : null}
      <Note>{t("view.notAbilityNote")}</Note>
      <Note tone="warn">{t("view.fitNote")}</Note>
    </>
  );
}
