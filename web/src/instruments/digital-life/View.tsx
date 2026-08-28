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
 * ── The direction of the three multis, which this page must not reverse ──
 *
 * `posted-about-me`, `group-chats` and `not-in-writing` ask what may **not**
 * happen, so their answers are lists of prohibitions. Every one of them is
 * printed directly under the question it answers, and no heading on this page
 * says "what you allow", "your rules" or "what you have agreed to". The bank's
 * `rejected` list records that a permissive framing inverted every not-OK line
 * derived from it once already; a caption on a result page does the same
 * damage one step later, and does it silently, because "Anything about my
 * health" under a heading reading *what may be shared* is a sentence the
 * reader never wrote and cannot see is wrong until somebody acts on it.
 *
 * ── And no claim about phubbing, sharenting or accounts after death ───
 *
 * There is no research sentence anywhere below, and that is deliberate rather
 * than an oversight. The hedged version — r = −0.22 across 30 samples and
 * 9,040 people, almost entirely cross-sectional; an effect that attaches to
 * feeling phubbed rather than to a partner's measured phone use and did not
 * survive two months; around four in five of 1,460 parents posting and around
 * one in five asking the child; and no useful evidence at all for group chats,
 * for what should never be typed, or for what people want done with their
 * accounts afterwards — is written, critiqued and cited in the bank's
 * `sourceNote`, which `ResultView` already draws in the page footer. Repeating
 * it here prints it twice; restating it shorter is how a hedged association
 * becomes a claim about the person reading it. So this page says what they
 * said, and the footer says what is known.
 *
 * ── Why this View takes `answers` ─────────────────────────────────────
 *
 * Because the reader's own words are deliberately not in the result. A result
 * is stored, shared and re-read in another language, so prose inside one is
 * prose that cannot be translated later — and it is the only thing a share
 * token can carry. The sentences stay in `answers`, which is local and which
 * no token can reach, and this is the one component that reads them. See the
 * note on `InstrumentModule.View` in `core/registry.ts`.
 *
 * ── Order ─────────────────────────────────────────────────────────────
 *
 * Asked order, grouped by section, rather than heaviest-first. The weight is
 * on every row, so the ranking is legible without being imposed — and a page
 * that reorders somebody's answers away from the order they gave them makes
 * them hunt for the one they remember writing. The two lists at the foot are
 * the heaviest-first reading, kept to the ends of the range where it says
 * something.
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
  // A block nobody answered gets no row. An empty row under a question reads
  // as a thing the reader failed to do; declining to state a position is a
  // real answer and the honest way to render it is silence.
  if (!stance || !chosen.length) return null;

  const why = answers?.[`${id}.why`];
  const said = typeof why === "string" ? why.trim() : "";

  return (
    <Card className="mt-3">
      <Label>{t(`stance.${id}.prompt`)}</Label>
      {/* The prompt is directly above the answer on every row, and on the three
          restrictive multis that adjacency is the whole meaning: "Screenshots
          of my messages" is an answer to "What of yours should stay out of a
          group chat?" and means the opposite on its own. Nothing here is ever
          printed without the question over it. */}
      <Prose className="mt-2 text-[0.95rem]">
        <strong className="font-normal text-brass">
          {chosen.map((value) => t(`stance.${id}.opt.${value}`)).join(" · ")}
        </strong>
      </Prose>
      {/* The grounds, in the reader's own words from one flat vocabulary. The
          same phrase appears under every question that asked, which is the
          whole point of them: "Somebody else has not agreed to it" here is the
          same ground as four blocks down, so a rule kept for consent and a rule
          kept for safety can be seen to be different rules. */}
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
 * writing a sentence the reader did not — and on the three restrictive multis
 * a summary is the specific failure the header warns about, since the summary
 * a page reaches for is "what you are relaxed about". `settled` and `open` are
 * the core's own lists, and an empty one draws nothing: a reader who weighted
 * everything in the middle has not failed to produce a finding.
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
