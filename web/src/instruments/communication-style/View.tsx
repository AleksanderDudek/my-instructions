import { Card, Label, Prose } from "@/components/ui/primitives";
import { WEIGHT_MAX, type StanceResult } from "@/core/stance";
import type { Answers, T } from "@/core/types";
import { BLOCKS, SECTIONS } from "./blocks";

/**
 * What you said, handed back.
 *
 * There is no reading here in the sense the other fifteen Views have one — no
 * band, no plane, no primary-and-fallback. That is not an omission. An
 * inventory records a position rather than estimating a trait, so the only
 * honest thing to draw is the position, its weight, and the sentence the reader
 * wrote under it. Anything added on top would be the app inferring something
 * from twelve answers it promised not to infer anything from.
 *
 * ── Why this View takes `answers` ─────────────────────────────────────
 *
 * Because the reader's own words are deliberately not in the result. A result
 * is stored, shared and re-read in another language, so prose inside one is
 * prose that cannot be translated later — and it is the only thing a share
 * token can carry. The sentences stay in `answers`, which is local and which no
 * token can reach, and this is the one component that reads them. See the note
 * on `InstrumentModule.View` in `core/registry.ts`.
 *
 * ── Order ─────────────────────────────────────────────────────────────
 *
 * Asked order, grouped by section, rather than heaviest-first. The weight is on
 * every row, so the ranking is legible without being imposed — and a page that
 * reorders somebody's answers away from the order they gave them makes them
 * hunt for the one they remember writing. The heaviest-first reading is what
 * the playbook and the instruction sheet are for.
 */

function Stance({
  id,
  result,
  answers,
  t,
}: {
  id: string;
  result: StanceResult;
  answers: Answers | undefined;
  t: T;
}) {
  const stance = result.stances[id];
  // A block nobody answered gets no row. An empty row under a question reads as
  // a thing the reader failed to do; declining to state a position is a real
  // answer and the honest way to render it is silence.
  if (!stance || typeof stance.choice !== "string") return null;

  const why = answers?.[`${id}.why`];
  const said = typeof why === "string" ? why.trim() : "";

  return (
    <Card className="mt-3">
      <Label>{t(`stance.${id}.prompt`)}</Label>
      <Prose className="mt-2 text-[0.95rem]">
        <strong className="font-normal text-brass">{t(`stance.${id}.opt.${stance.choice}`)}</strong>
      </Prose>
      {stance.weight !== null ? (
        <p className="mt-2 text-sm text-muted">
          {t("stance.weightPrompt")}{" "}
          <span className="num text-ink">
            {stance.weight}/{WEIGHT_MAX}
          </span>
        </p>
      ) : null}
      {said ? (
        <blockquote className="mt-3 border-l-2 border-rule pl-4 text-[0.95rem] leading-relaxed text-ink/90">
          {said}
        </blockquote>
      ) : null}
    </Card>
  );
}

export function View({
  result,
  answers,
  t,
}: {
  result: StanceResult;
  answers?: Answers;
  t: T;
}) {
  return (
    <>
      {/* No `sourceNote` and no "none of this was scored" note here, though
          both belong on this page and both were drawn here once.
          `ResultView` already renders them in the page footer — the second
          from a `family === "inventory"` branch written for exactly this — so
          a View that repeats them shows the reader the same two paragraphs
          twice, the longer of them nine hundred words. The apologia belongs to
          the shell because every inventory owes the same one; what belongs to
          the instrument is below. */}
      {SECTIONS.map((section) => {
        const ids = BLOCKS.filter((b) => b.section === section).map((b) => b.id);
        // A section none of whose questions were answered draws no heading.
        const any = ids.some((id) => typeof result.stances[id]?.choice === "string");
        if (!any) return null;
        return (
          <section key={section} className="my-8">
            <h3 className="text-lg">{t(`section.${section}.title`)}</h3>
            <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">
              {t(`section.${section}.note`)}
            </p>
            {ids.map((id) => (
              <Stance key={id} id={id} result={result} answers={answers} t={t} />
            ))}
          </section>
        );
      })}

    </>
  );
}
