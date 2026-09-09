import { Bars, Verdict, Facts, Note } from "@/components/result/scorecard";
import type { T } from "@/core/types";
import { GLYPHS } from "./items";
import type { Contrast, WorkShapeResult } from "./spec";

const rows = (result: WorkShapeResult, t: T) =>
  result.ranked.map((r) => ({
    key: r.key,
    label: `${GLYPHS[r.key]} ${t(`shape.${r.key}.label`)}`,
    score: r.score,
    blurb: t(`shape.${r.key}.blurb`),
  }));

/** The sentence for one contrast, chosen by what the numbers actually support. */
function contrastLine(c: Contrast, t: T) {
  const vars = {
    a: t(`shape.${c.a}.label`),
    b: t(`shape.${c.b}.label`),
    lead: c.lead ? t(`shape.${c.lead}.label`) : "",
    other: c.other ? t(`shape.${c.other}.label`) : "",
    gap: c.gap,
  };
  if (c.kind === "both") return t(`contrast.${c.a}.both`, vars);
  if (c.kind === "neither") return t(`contrast.${c.a}.neither`, vars);
  if (c.kind === "leans") return t(`shape.${c.lead}.leans`, vars);
  return t("contrast.unclear", vars);
}

export function View({ result, t }: { result: WorkShapeResult; t: T }) {
  const [first, second] = result.top;
  const doubled = result.doubled.length > 0;

  return (
    <>
      <Verdict
        t={t}
        // Flat at the top of the range means something else entirely: not "no
        // ingredient is decisive" but "all of them are". Both are flat profiles
        // and they need opposite sentences.
        eyebrow={
          result.flat && doubled
            ? t("view.eyebrowFlatDoubled")
            : result.flat
              ? t("view.eyebrowFlat")
              : t("view.eyebrow")
        }
        title={
          result.flat && doubled
            ? t("view.titleFlatDoubled")
            : result.flat
              ? t("view.titleFlat")
              : t("view.title", { first: t(`shape.${first}.label`), second: t(`shape.${second}.label`) })
        }
        score={result.ranked[0].score}
        body={
          result.flat && doubled
            ? t("view.bodyFlatDoubled", { count: result.doubled.length })
            : result.flat
              ? t("view.bodyFlat", { spread: result.spread })
              : t("view.body", { first: t(`shape.${first}.label`), blurb: t(`shape.${first}.blurb`) })
        }
      />

      <section className="mt-9">
        <h4 className="mb-4 flex flex-wrap items-baseline gap-3 font-display text-lg">
          {t("view.contrastHeading")}
          <span className="label-caps">{t("view.contrastNote")}</span>
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          {result.contrasts.map((c) => (
            <div key={c.a} className="flex flex-col gap-2 border-l-2 border-brass bg-panel p-5">
              <span className="label-caps">{t(`contrast.${c.a}.label`)}</span>
              <h5 className="font-display text-base font-semibold">{t(`contrast.kind.${c.kind}`)}</h5>
              <p className="text-sm leading-relaxed text-muted">{contrastLine(c, t)}</p>
            </div>
          ))}
        </div>
      </section>

      <Bars rows={rows(result, t)} />

      <Facts
        pairs={[
          [
            t("view.fact.ingredients"),
            t("view.ingredientsValue", {
              first: t(`shape.${first}.label`),
              second: t(`shape.${second}.label`),
            }),
          ],
          [t("view.fact.avoid"), t("view.avoidValue", { shape: t(`shape.${result.lowest}.label`) })],
          [t("view.fact.spread"), t(result.flat ? "view.spreadFlat" : "view.spreadValue", { spread: result.spread })],
        ]}
      />

      {doubled ? (
        <Note>
          {t("view.doubledNote", {
            pairs: result.doubled
              .map(([a, b]) => `${t(`shape.${a}.label`)} + ${t(`shape.${b}.label`)}`)
              .join(" · "),
          })}
        </Note>
      ) : null}
      <Note>{t("view.notAJobNote")}</Note>
      <Note>{t("view.notAbilityNote")}</Note>
    </>
  );
}
