import { Verdict, Note } from "@/components/result/scorecard";
import { Card, Label, Prose } from "@/components/ui/primitives";
import type { T } from "@/core/types";
import { BUCKETS, type BucketName, type PairResult } from "./spec";

/**
 * The comparison, rendered from the perspective of whoever's page this is.
 *
 * The result page always passes the page owner first, so "you" and "they"
 * stay correct on both people's screens without either set of answers being
 * labelled with a name.
 *
 * There is no copy button here and no textarea, on purpose: a person's own
 * answers are theirs to take away, but a document of both of them is a
 * different object and only one of the two would be choosing to create it.
 */

function BucketCard({ comparison, t, name }: { comparison: PairResult; t: T; name: BucketName }) {
  const rows = comparison[name];
  if (!rows.length) return null;
  return (
    <Card>
      <Label>{t(`pair.${name}`)}</Label>
      <Prose className="mt-2 text-[0.95rem] text-muted">{t(`pair.${name}.means`)}</Prose>
      {rows.map(({ id, keen }) => (
        <Prose key={id} className="mt-2 text-[0.95rem]">
          <strong className="font-normal text-brass">{t(`act.${id}`)}</strong>
          {keen === "both" ? "" : ` — ${t(`pair.keen.${keen}`)}`}
        </Prose>
      ))}
    </Card>
  );
}

export function PairView({ comparison, t }: { comparison: PairResult; t: T }) {
  return (
    <>
      <Verdict
        t={t}
        eyebrow={t("pair.eyebrow")}
        title={t(`roles.${comparison.roles}.title`)}
        body={t(`roles.${comparison.roles}.body`)}
      />

      {comparison.spark.length ? <Note>{t("pair.sparkLead", { count: comparison.spark.length })}</Note> : null}

      <div className="my-8 grid gap-3 sm:grid-cols-2">
        {BUCKETS.map((name) => (
          <BucketCard key={name} comparison={comparison} t={t} name={name} />
        ))}
      </div>

      {comparison.overlap === 0 ? <Note>{t("pair.noOverlap")}</Note> : null}

      <Note tone="warn">{t("pair.goneNote")}</Note>
      <Note>{t("pair.limitsNote")}</Note>
    </>
  );
}
