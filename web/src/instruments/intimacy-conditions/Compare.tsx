import { Verdict, Note } from "@/components/result/scorecard";
import { Card, Label, PlateHead, Prose } from "@/components/ui/primitives";
import type { T } from "@/core/types";
import { compare, type IntimacyResult } from "./spec";

/** One person's requests that the other did not also make. */
function Column({ title, keys, t }: { title: string; keys: string[]; t: T }) {
  return (
    <div className="flex flex-col gap-3">
      <Label>{title}</Label>
      {keys.length ? (
        keys.map((key) => (
          <Prose key={key} className="text-[0.95rem]">
            {t(`${key}.card`)}
          </Prose>
        ))
      ) : (
        <Prose className="text-[0.95rem] text-muted">{t("compare.nothingHere")}</Prose>
      )}
    </div>
  );
}

/**
 * Two lists, side by side, and the overlap. No figure of any kind appears on
 * this page — not a percentage, not an out-of-100, not a distance — because a
 * number about two people's intimacy is a thing that gets quoted in an
 * argument, and it would not mean anything even if it did not.
 */
export function Compare({
  a,
  b,
  nameA = "A",
  nameB = "B",
  t,
}: {
  a: IntimacyResult;
  b: IntimacyResult;
  nameA?: string;
  nameB?: string;
  t: T;
}) {
  const { shared, aOnly, bOnly } = compare(a, b);
  return (
    <>
      <Verdict t={t} eyebrow={t("compare.eyebrow")} title={t("compare.title")} body={t("compare.body")} />

      {shared.length ? (
        <section className="my-8">
          <PlateHead title={t("compare.sharedHeading")} />
          <div className="grid gap-3 sm:grid-cols-2">
            {shared.map((key) => (
              <Card key={key}>
                <Prose className="text-[0.95rem]">{t(`${key}.card`)}</Prose>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-8 sm:grid-cols-2">
        <Column title={t("compare.asks", { name: nameA })} keys={aOnly} t={t} />
        <Column title={t("compare.asks", { name: nameB })} keys={bOnly} t={t} />
      </div>

      <Note>{t("compare.noScoreNote")}</Note>
    </>
  );
}
