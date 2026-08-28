import { Card, Label, Prose } from "@/components/ui/primitives";
import { WEIGHT_MAX, type StanceResult } from "@/core/stance";
import type { Answers, T } from "@/core/types";
import { BLOCKS, SECTIONS } from "./blocks";

/**
 * What you said about children, handed back.
 *
 * There is no reading here in the sense the fifteen scored Views have one — no
 * band, no plane, no primary-and-fallback, and on this instrument in particular
 * no number of children, no readiness figure and no forecast. That is not an
 * omission. An inventory records a position rather than estimating a trait, so
 * the only honest thing to draw is the position, its weight, and the sentence
 * the reader wrote under it. Anything added on top would be the app inferring
 * something from thirteen answers it promised not to infer anything from — and
 * the thing it would be tempted to infer, an intended family size, is a weak
 * predictor of what actually happens.
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
 * ── What is not drawn here, because it is drawn around here ───────────
 *
 * The `sourceNote` and the "nothing here was scored" paragraph both belong on
 * this page and neither is below. `ResultView` already renders them in the page
 * footer — the second from a `family === "inventory"` branch written for
 * exactly this — so a View that repeats them shows the reader the same two
 * paragraphs twice, the longer of them nine hundred words. So do the
 * instruction cards and the playbook. The apologia belongs to the shell because
 * every inventory owes the same one; what belongs to this instrument is below.
 *
 * ── The register, on this instrument ──────────────────────────────────
 *
 * Every block here presupposes a decision, and every block carries an option
 * that declines the premise. "I have not decided" is a common and correct
 * answer, so nothing on this page may treat it as a gap: it is rendered exactly
 * as every other position is, in the same place, at the same size, with the
 * same weight beside it. There is no count of how many were decided, no
 * "questions still open" heading and no prompt to go back and finish — those
 * are the three shapes a page takes when it reads an answer as a failure to
 * answer.
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
  // A block nobody answered at all gets no row. An empty row under a question
  // reads as a thing the reader failed to do; declining to state a position is
  // a real answer and the honest way to render it is silence. This is about a
  // *skipped* block, and not about the "I have not decided" option — that one
  // is a stated position and is drawn like any other.
  if (!stance) return null;
  const said = typeof stance.choice === "string" ? [stance.choice] : (stance.choice ?? []);
  if (!said.length) return null;

  const why = answers?.[`${id}.why`];
  const reason = typeof why === "string" ? why.trim() : "";

  return (
    <Card className="mt-3">
      <Label>{t(`stance.${id}.prompt`)}</Label>
      {/* `if-not-natural` is a `multi`, so an answer here can be several
          routes. They are drawn as separate lines rather than joined into a
          sentence: a comma between "Adoption" and "Fostering" would read as a
          preference order that the block never asked for. */}
      <Prose className="mt-2 text-[0.95rem]">
        {said.map((value) => (
          <span key={value} className="block font-normal text-brass">
            {t(`stance.${id}.opt.${value}`)}
          </span>
        ))}
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
 * The heaviest and the lightest, as two lists of questions.
 *
 * `settled` and `open` come straight out of `scoreStances`: answered and rated
 * 8 or more, answered and rated 3 or less. They are not a top-three and a
 * bottom-three, and the difference is the point. A rank would manufacture an
 * order between two questions a person rated identically, and it would always
 * produce a "least important" even for somebody who rated all thirteen at nine
 * — which on this subject is a sentence the app would be putting in their mouth.
 * A threshold produces nothing when there is nothing, which is correct.
 *
 * What is drawn is the question, not the answer and not the number. The answer
 * is three inches above under its own section, and repeating it here would make
 * this look like a summary of the reading rather than an index into it. No bar,
 * no percentage, no count.
 */
function Weighted({ ids, title, note, t }: { ids: string[]; title: string; note: string; t: T }) {
  if (!ids.length) return null;
  return (
    <section className="my-8">
      <h3 className="text-lg">{title}</h3>
      <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">{note}</p>
      <ul className="mt-3 max-w-[62ch] space-y-2">
        {ids.map((id) => (
          <li key={id} className="border-l-2 border-rule pl-4 text-[0.95rem] leading-relaxed">
            {t(`stance.${id}.prompt`)}
          </li>
        ))}
      </ul>
    </section>
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
  const stated = (id: string) => {
    const choice = result.stances[id]?.choice;
    return Array.isArray(choice) ? choice.length > 0 : typeof choice === "string";
  };

  return (
    <>
      {/* Asked order, grouped by section, rather than heaviest-first. The
          weight is on every row, so the ranking is legible without being
          imposed — and a page that reorders somebody's answers away from the
          order they gave them makes them hunt for the one they remember
          writing. The two lists below are where the ordering happens. */}
      {SECTIONS.map((section) => {
        const ids = BLOCKS.filter((b) => b.section === section).map((b) => b.id);
        // A section none of whose questions were answered draws no heading.
        if (!ids.some(stated)) return null;
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

      <Weighted ids={result.settled} title={t("weight.settledTitle")} note={t("weight.settledNote")} t={t} />
      <Weighted ids={result.open} title={t("weight.openTitle")} note={t("weight.openNote")} t={t} />
    </>
  );
}
