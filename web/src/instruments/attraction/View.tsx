import { Bars, Verdict, Facts, Note, type BarRow } from "@/components/result/scorecard";
import { PlateHead } from "@/components/ui/primitives";
import type { T } from "@/core/types";
import { PREFIX, TARGETS, depth, type AxisKind } from "./axes";
import type { AttractionResult } from "./spec";

const barsFor = (result: AttractionResult, kind: AxisKind, t: T): BarRow[] =>
  TARGETS.map((target) => {
    const level = result.axes[`${PREFIX[kind]}.${target}`];
    return {
      key: `${kind}.${target}`,
      label: t(`axis.${kind}.${target}`),
      // The bars want 1..100; the answers are four steps. Rendered as quarters
      // so nobody mistakes a four-point answer for a measurement.
      score: Math.max(1, depth(level) * 33),
      blurb: t(`level.${level}`),
    };
  });

export function View({ result, t }: { result: AttractionResult; t: T }) {
  return (
    <>
      {/* No score beside the title, deliberately. The heading is the word the
          person chose for themselves, and a number next to it would read as a
          grade on it. */}
      <Verdict
        t={t}
        eyebrow={t("view.eyebrow")}
        title={result.ownWord || t(`identity.${result.identity}`)}
        body={t(`view.certainty.${result.certainty}`)}
      />

      <section>
        <PlateHead title={t("view.sexualHeading")} note={t("view.axisNote")} />
        <Bars rows={barsFor(result, "sexual", t)} />
      </section>

      <section>
        <PlateHead title={t("view.romanticHeading")} note={t("view.axisNote")} />
        <Bars rows={barsFor(result, "romantic", t)} />
      </section>

      <Facts
        pairs={[
          [
            t("view.fact.behaviour"),
            result.behaviour.length
              ? result.behaviour.map((value) => t(`behaviour.${value}`)).join(", ")
              : t("view.behaviourUnanswered"),
          ],
          [t("view.fact.assume"), t(`assume.${result.assume}.long`)],
        ]}
      />

      {result.divergent ? <Note>{t("view.divergentNote")}</Note> : null}
      {result.sexualLow || result.romanticLow ? <Note>{t("view.lowNote")}</Note> : null}
      <Note>{t("view.threeThingsNote")}</Note>
      <Note>{t("view.noLabelNote")}</Note>
    </>
  );
}
