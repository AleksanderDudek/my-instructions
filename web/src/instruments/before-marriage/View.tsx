import { Card, Label, Prose } from "@/components/ui/primitives";
import { WEIGHT_MAX, type StanceReading, type StanceResult } from "@/core/stance";
import type { Answers, T } from "@/core/types";
import { BLOCKS, SECTIONS } from "./blocks";

/**
 * What you said, handed back.
 *
 * There is no reading here in the sense the profilers have one — no band, no
 * plane, no primary-and-fallback. That is not an omission. An inventory records
 * a position rather than estimating a trait, so the only honest thing to draw
 * is the position, its weight, and the sentence the reader wrote under it.
 *
 * ── The one thing this page must never do ─────────────────────────────
 *
 * It must not tell two people whether to marry. Nothing here is totalled,
 * compared against anything, or captioned as readiness, agreement or risk; the
 * instrument has never been tested and the `sourceNote` says so in the reader's
 * own copy. Fifteen answers to fifteen questions are printed under the headings
 * they were asked beneath, and the only arithmetic on the page is the reader's
 * own numbers read back at the two ends.
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
 * Asked order, grouped by section, and then — and only then — the two lists the
 * weights make. The weight is on every row, so the ranking is legible from the
 * start without being imposed on the reader's own order, and a page that
 * reordered somebody's answers away from the order they gave them makes them
 * hunt for the one they remember writing.
 */

/** A `choice` answers with a string and a `multi` with an array; a row prints either. */
const picked = (choice: StanceReading["choice"] | undefined): readonly string[] =>
  typeof choice === "string" ? [choice] : Array.isArray(choice) ? choice : [];

const answerOf = (id: string, result: StanceResult, t: T): string | null => {
  const chosen = picked(result.stances[id]?.choice);
  return chosen.length ? chosen.map((value) => t(`stance.${id}.opt.${value}`)).join(", ") : null;
};

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
  // answer and the honest way to render it is silence. Three of the fifteen are
  // a `multi`, which a reader may leave empty on purpose, and that is the whole
  // escape those blocks have.
  const said = answerOf(id, result, t);
  if (!stance || said === null) return null;

  const why = answers?.[`${id}.why`];
  const reason = typeof why === "string" ? why.trim() : "";

  return (
    <Card className="mt-3">
      <Label>{t(`stance.${id}.prompt`)}</Label>
      <Prose className="mt-2 text-[0.95rem]">
        <strong className="font-normal text-brass">{said}</strong>
      </Prose>
      {stance.weight !== null ? (
        <p className="mt-2 text-sm text-muted">
          {t("stance.weightPrompt")}{" "}
          <span className="num text-ink">
            {stance.weight}/{WEIGHT_MAX}
          </span>
        </p>
      ) : null}
      {reason ? (
        <blockquote className="mt-3 border-l-2 border-rule pl-4 text-[0.95rem] leading-relaxed text-ink/90">
          {reason}
        </blockquote>
      ) : null}
    </Card>
  );
}

/**
 * One of the two weight lists.
 *
 * `settled` and `open` are thresholds rather than a ranking — eight and above,
 * three and below — and they are drawn in the order the questions were asked
 * rather than sorted, because a sorted list is a league table and the weight is
 * a number the reader chose about themselves rather than a score anybody gave
 * them. An empty list draws nothing at all: a heading with nothing under it
 * invites the reader to work out what they failed to do.
 */
function Weighted({
  ids,
  title,
  note,
  result,
  t,
}: {
  ids: readonly string[];
  title: string;
  note: string;
  result: StanceResult;
  t: T;
}) {
  const rows = ids
    .map((id) => ({ id, said: answerOf(id, result, t), weight: result.stances[id]?.weight ?? null }))
    .filter((row): row is { id: string; said: string; weight: number } => row.said !== null && row.weight !== null);
  if (!rows.length) return null;

  return (
    <Card className="mt-3">
      <Label>{title}</Label>
      <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">{note}</p>
      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.id} className="text-[0.95rem] leading-relaxed">
            <span className="text-muted">{t(`stance.${row.id}.prompt`)}</span>{" "}
            <strong className="font-normal text-brass">{row.said}</strong>{" "}
            <span className="num text-ink">
              {row.weight}/{WEIGHT_MAX}
            </span>
          </li>
        ))}
      </ul>
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
          both belong on this page. `ResultView` already renders them in the
          page footer — the second from a `family === "inventory"` branch
          written for exactly this — so a View that repeats them shows the
          reader the same two paragraphs twice, the longer of them nine hundred
          words. The apologia belongs to the shell because every inventory owes
          the same one; what belongs to the instrument is below. */}
      {SECTIONS.map((section) => {
        const ids = BLOCKS.filter((b) => b.section === section).map((b) => b.id);
        // A section none of whose questions were answered draws no heading.
        const any = ids.some((id) => answerOf(id, result, t) !== null);
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

      {result.settled.length || result.open.length ? (
        <section className="my-8">
          <h3 className="text-lg">{t("view.weightTitle")}</h3>
          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">{t("view.weightNote")}</p>
          <Weighted
            ids={result.settled}
            title={t("view.heaviestTitle")}
            note={t("view.heaviestNote")}
            result={result}
            t={t}
          />
          <Weighted
            ids={result.open}
            title={t("view.lightestTitle")}
            note={t("view.lightestNote")}
            result={result}
            t={t}
          />
        </section>
      ) : null}
    </>
  );
}
