import { Verdict, Facts, Note } from "@/components/result/scorecard";
import { Card, PlateHead, Prose } from "@/components/ui/primitives";
import type { T } from "@/core/types";
import type { IntimacyResult } from "./spec";

/**
 * A result page with no result on it, in the usual sense.
 *
 * There is no bar chart here and there is not going to be one: nothing was
 * scored, so there is nothing to draw a bar of. What the reader gets is the
 * set of sentences they composed by answering — arranged so any one of them
 * could be handed over without having to find the words in the moment, which
 * is the part most people find hard.
 */
export function View({ result, t }: { result: IntimacyResult; t: T }) {
  return (
    <>
      <Verdict t={t} eyebrow={t("view.eyebrow")} title={t("view.title")} body={t("view.body")} />

      <section className="my-8">
        <PlateHead title={t("view.cardsHeading")} note={t("view.cardsNote")} />
        <div className="grid gap-3 sm:grid-cols-2">
          {result.cards.length ? (
            result.cards.map((key) => (
              <Card key={key}>
                <Prose className="text-[0.95rem]">{t(`${key}.card`)}</Prose>
              </Card>
            ))
          ) : (
            <Card>
              <Prose className="text-[0.95rem]">{t("view.noCards")}</Prose>
            </Card>
          )}
        </div>
      </section>

      {result.hardest ? (
        <Facts pairs={[[t("view.fact.hardest"), t(`comfort.${result.hardest}.support`)]]} />
      ) : null}

      <Note>{t("view.healthNote")}</Note>
      <Note>{t("view.noNormNote")}</Note>
      {/* Beliefs are never reported as a trait. Their entire use is choosing
          which of these two paragraphs closes the page. */}
      <Note>{t(result.beliefs === "destiny" ? "view.closing.destiny" : "view.closing.growth")}</Note>
      <Note>{t("view.supportNote")}</Note>
    </>
  );
}
