import { Card, Label, Prose } from "@/components/ui/primitives";
import { WEIGHT_MAX, type StanceResult } from "@/core/stance";
import type { Answers, T } from "@/core/types";
import { BLOCKS, SECTIONS } from "./blocks";

/**
 * What you said, handed back.
 *
 * There is no reading here in the sense the scored instruments have one — no
 * band, no plane, no primary-and-fallback. That is not an omission. An
 * inventory records a position rather than estimating a trait, so the only
 * honest thing to draw is the position, its weight, the grounds under it and
 * the sentence the reader wrote. Anything on top of that would be the app
 * inferring something from twelve answers it promised to infer nothing from.
 *
 * On this instrument the promise is narrower than usual and worth naming.
 * Nothing here counts anything. There is no devoutness figure, no orthodoxy
 * figure and no number that could be read as either, which rules out the four
 * things a page like this reaches for by reflex: a total of the weights, a
 * count of how many blocks were answered "religiously", a proportion of
 * grounds that were `scripture`, and any ordering of readers against each
 * other. The weights are printed one at a time, as the reader gave them, and
 * are never added.
 *
 * ── And no answer is the complete one ─────────────────────────────────
 *
 * Somebody who holds a faith firmly, somebody who has left one and somebody
 * who never had one all reach this page, and none of the three may find copy
 * here that treats their answers as the partial version of somebody else's.
 * That is why every heading below is about *what was said* rather than about
 * what it amounts to, and why the two weight lists are named for the reader's
 * own stakes — where there is no give, and where there is room to move —
 * rather than for anything they could be measured against.
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
 * hunt for the one they remember writing. The two lists at the foot are the
 * heaviest-first reading, kept to the ends of the range where it says something.
 */

/** Whichever kind the block is, what the reader picked, as a list. */
const picked = (result: StanceResult, id: string): string[] => {
  const choice = result.stances[id]?.choice;
  if (typeof choice === "string") return [choice];
  return Array.isArray(choice) ? choice : [];
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
  const chosen = picked(result, id);
  // A block nobody answered gets no row. An empty row under a question reads as
  // a thing the reader failed to do; declining to state a position is a real
  // answer here — six of the twelve offer it in as many words — and the honest
  // way to render it is silence.
  if (!stance || !chosen.length) return null;

  const why = answers?.[`${id}.why`];
  const said = typeof why === "string" ? why.trim() : "";

  return (
    <Card className="mt-3">
      <Label>{t(`stance.${id}.prompt`)}</Label>
      <Prose className="mt-2 text-[0.95rem]">
        <strong className="font-normal text-brass">
          {chosen.map((value) => t(`stance.${id}.opt.${value}`)).join(" · ")}
        </strong>
      </Prose>
      {/* The grounds, in the reader's own words from one flat vocabulary. Under
          every question, which is the whole point of them: "scripture" here is
          the same word as "scripture" four blocks down, so two positions held
          on different grounds can be seen to be. */}
      {stance.grounds.length ? (
        <p className="mt-2 text-sm text-muted">
          {t("view.rests")}{" "}
          <span className="text-ink">
            {stance.grounds.map((value) => t(`stance.grounds.${value}`)).join(" · ")}
          </span>
        </p>
      ) : null}
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

/**
 * One end of the range, as a list of questions and the weights given to them.
 *
 * The prompt and the number, and nothing else. Repeating the answer here would
 * put the same sentence on the page twice; summarising it would be this file
 * writing a sentence the reader did not. `settled` and `open` are the core's
 * own lists, and an empty one draws nothing — a reader who weighted everything
 * in the middle has not failed to produce a finding.
 */
function Weights({
  ids,
  result,
  titleKey,
  noteKey,
  t,
}: {
  ids: string[];
  result: StanceResult;
  titleKey: string;
  noteKey: string;
  t: T;
}) {
  if (!ids.length) return null;
  return (
    <section className="my-8">
      <h3 className="text-lg">{t(titleKey)}</h3>
      <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">{t(noteKey)}</p>
      <ul className="mt-3">
        {ids.map((id) => (
          <li key={id} className="mt-2 flex items-baseline justify-between gap-4 border-b border-rule pb-2 text-[0.95rem]">
            <span className="text-ink/90">{t(`stance.${id}.prompt`)}</span>
            <span className="num shrink-0 text-muted">
              {result.stances[id]?.weight}/{WEIGHT_MAX}
            </span>
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
        const any = ids.some((id) => picked(result, id).length > 0);
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

      <Weights ids={result.settled} result={result} titleKey="view.heaviest.title" noteKey="view.heaviest.note" t={t} />
      <Weights ids={result.open} result={result} titleKey="view.lightest.title" noteKey="view.lightest.note" t={t} />
    </>
  );
}
