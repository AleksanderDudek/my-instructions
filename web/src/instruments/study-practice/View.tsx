import { Verdict, Facts, Note } from "@/components/result/scorecard";
import { Card, Label, PlateHead, Prose } from "@/components/ui/primitives";
import type { T } from "@/core/types";
import { CHOICES, TECHNIQUES } from "./techniques";
import type { StudyResult } from "./spec";

/**
 * A result page with no bar chart on it, on purpose.
 *
 * The headline is a count — four of six things you say you do — and a count
 * has no bar, because a bar implies a maximum somebody else is measured
 * against. What the reader gets instead is the six frequencies read back, and
 * advice for the well-evidenced techniques they are not currently using, which
 * is the only part of the page that is trying to change anything.
 */
export function View({ result, t }: { result: StudyResult; t: T }) {
  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("view.eyebrow")}
        title={t("view.title", { count: result.repertoire, total: result.total })}
        body={t(`view.leaning.${result.leaning}`)}
      />

      <Facts
        pairs={TECHNIQUES.map((tech): [string, string] => [
          t(`technique.${tech.id}.label`),
          t("view.techniqueValue", {
            often: t(`often.${result.uses[tech.id]}`),
            what: t(`technique.${tech.id}.what`),
          }),
        ])}
      />

      <section className="my-8">
        <PlateHead title={t("view.adviceHeading")} note={t("view.adviceNote")} />
        <div className="grid gap-3 sm:grid-cols-2">
          {result.missing.length ? (
            result.missing.map((id) => (
              <Card key={id}>
                <Label>{t("view.adviceLabel")}</Label>
                <h4 className="mt-1 mb-2 text-lg">{t(`technique.${id}.label`)}</h4>
                <Prose className="text-[0.95rem]">{t(`technique.${id}.advice`)}</Prose>
              </Card>
            ))
          ) : (
            <Card>
              <Prose className="text-[0.95rem]">{t("view.adviceNoneMissing")}</Prose>
            </Card>
          )}
        </div>
      </section>

      <Facts
        pairs={CHOICES.map((f): [string, string] => [
          t(`field.${f.id}.label`),
          t(`answer.${f.id}.${result.choices[f.id]}`),
        ])}
      />

      <Note>{t("view.notAStyleNote")}</Note>
      <Note>{t("view.countNote")}</Note>
    </>
  );
}
