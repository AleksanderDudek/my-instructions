import { Card, Label, Prose } from "@/components/ui/primitives";
import { WEIGHT_MAX, type StanceResult } from "@/core/stance";
import type { Answers, T } from "@/core/types";
import { BLOCKS, SECTIONS } from "./blocks";

/**
 * What you said about your own money, handed back.
 *
 * There is no reading here in the sense the profilers have one — no band, no
 * plane, no ratio between what you save and what you give. That is not an
 * omission. An inventory records a position rather than estimating a trait, so
 * the only honest thing to draw is the position, what it rests on, its weight,
 * and the sentence the reader wrote under it. Anything on top of that would be
 * the app inferring something from thirteen answers it promised to infer
 * nothing from — and on this subject an inferred verdict is the exact thing
 * every commercial instrument in the area sells.
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
 * every row, so the ranking is legible without being imposed, and a page that
 * reorders somebody's answers away from the order they gave them makes them
 * hunt for the one they remember writing. The two short lists at the foot are
 * where the weights are read back as an order, and they are lists of questions
 * rather than of answers.
 */

/** Declared once, read twice: the section flow and the two weight lists. */
const PRIVATE = new Set(BLOCKS.filter((block) => block.private).map((block) => block.id));

function Weight({ weight, t }: { weight: number | null; t: T }) {
  if (weight === null) return null;
  return (
    <p className="mt-2 text-sm text-muted">
      {t("stance.weightPrompt")}{" "}
      <span className="num text-ink">
        {weight}/{WEIGHT_MAX}
      </span>
    </p>
  );
}

/**
 * The reason, as the reader wrote it, or nothing at all.
 *
 * An empty box draws no quotation marks. "I would rather not explain" is a real
 * answer and the honest way to render it is silence, not a blank rule with a
 * heading over it.
 */
function Why({ said }: { said: string }) {
  if (!said) return null;
  return (
    <blockquote className="mt-3 border-l-2 border-rule pl-4 text-[0.95rem] leading-relaxed text-ink/90">
      {said}
    </blockquote>
  );
}

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
  if (!stance) return null;
  const answer =
    typeof stance.choice === "string"
      ? t(`stance.${id}.opt.${stance.choice}`)
      : Array.isArray(stance.choice) && stance.choice.length
        ? stance.choice.map((value) => t(`stance.${id}.opt.${value}`)).join(" · ")
        : null;
  if (answer === null) return null;

  const why = answers?.[`${id}.why`];

  return (
    <Card className="mt-3">
      <Label>{t(`stance.${id}.prompt`)}</Label>
      <Prose className="mt-2 text-[0.95rem]">
        <strong className="font-normal text-brass">{answer}</strong>
      </Prose>
      {/* What the position rests on, where the block asked. Printed as the
          reader's own ticks in the flat grounds vocabulary — the same words
          under every question, which is the only reason two of these answers
          can be read as the same ground. */}
      {stance.grounds.length ? (
        <p className="mt-2 text-sm text-muted">
          {stance.grounds.map((value) => t(`stance.grounds.${value}`)).join(" · ")}
        </p>
      ) : null}
      <Weight weight={stance.weight} t={t} />
      <Why said={typeof why === "string" ? why.trim() : ""} />
    </Card>
  );
}

/**
 * The private block, and the decision about how it appears here.
 *
 * It is drawn, and it is drawn differently, and both halves of that were
 * decided rather than defaulted into.
 *
 * **It is drawn** because this page is local. `undisclosed-debt` is stripped
 * from every share token by its tier, it is on no instruction card, and
 * `compareStances` files it under `withheld` and compares nothing — so the one
 * place the reader's own answer is allowed to exist is the one place it was
 * typed. Dropping it from their own result would be the app keeping a secret
 * *from* the person whose secret it is, and it would leave them with no way to
 * see what they said without answering the whole instrument again.
 *
 * **It is drawn apart** because a row identical to the twelve above it teaches
 * the reader something false about where it goes. Every other card on this page
 * is in the share link and on the printed sheet; this one is in neither, and a
 * page that draws them the same way is the page somebody turns a laptop round
 * to show. The marked card is the difference between a promise made in a
 * `sourceNote` nine hundred words long and a promise the reader can see being
 * kept while they look at the answer.
 *
 * It is not redacted and it is not put behind a click. A page that hides the
 * reader's answer from the reader is theatre — the answer is on this device
 * either way — and the interesting failure would be a page that showed the
 * *weight* of it in a ranking, which is what `settled` and `open` below refuse
 * to do.
 */
function Sealed({
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
  if (!stance || typeof stance.choice !== "string") return null;
  const why = answers?.[`${id}.why`];

  return (
    <Card className="mt-3 border-dashed">
      <div className="flex items-baseline justify-between gap-4">
        <Label>{t(`stance.${id}.prompt`)}</Label>
        <span className="label-caps shrink-0 text-verdigris">{t("private.label")}</span>
      </div>
      <Prose className="mt-2 text-[0.95rem]">
        <strong className="font-normal text-brass">{t(`stance.${id}.opt.${stance.choice}`)}</strong>
      </Prose>
      <Weight weight={stance.weight} t={t} />
      <Why said={typeof why === "string" ? why.trim() : ""} />
      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">{t("private.note")}</p>
    </Card>
  );
}

/**
 * The weights, read back as an order — and the one block that is not in it.
 *
 * `settled` and `open` are the instrument's own lists: answered and weighted at
 * eight or more, answered and weighted at three or less. They are drawn as the
 * *questions* rather than the answers, because the answers are already above in
 * full and repeating them here would be a second, shorter, ranked copy of the
 * same page.
 *
 * The private block is filtered out of both, and this is the same argument
 * `compareStances` makes when it refuses to sort `withheld` by weight. A list
 * headed "what you would not move on" with "Do you owe money that nobody close
 * to you knows about?" at the top of it is the private answer wearing a sort:
 * nobody rates that question at nine with nothing to declare. The card above
 * shows the reader their own weight beside their own answer, where it means
 * what they meant by it. The ranking is where it would start meaning something
 * to somebody reading over their shoulder.
 */
function Weighted({ ids, headingKey, t }: { ids: string[]; headingKey: string; t: T }) {
  const shown = ids.filter((id) => !PRIVATE.has(id));
  if (!shown.length) return null;
  return (
    <div className="mt-6">
      <Label>{t(headingKey)}</Label>
      <ul className="mt-2 max-w-[62ch] text-[0.95rem] leading-relaxed text-ink/90">
        {shown.map((id) => (
          <li key={id} className="mt-1">
            {t(`stance.${id}.prompt`)}
          </li>
        ))}
      </ul>
    </div>
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
        const ids = BLOCKS.filter((block) => block.section === section).map((block) => block.id);
        // A section none of whose questions were answered draws no heading.
        const any = ids.some((id) => {
          const choice = result.stances[id]?.choice;
          return typeof choice === "string" || (Array.isArray(choice) && choice.length > 0);
        });
        if (!any) return null;
        return (
          <section key={section} className="my-8">
            <h3 className="text-lg">{t(`section.${section}.title`)}</h3>
            <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">
              {t(`section.${section}.note`)}
            </p>
            {ids.map((id) =>
              PRIVATE.has(id) ? (
                <Sealed key={id} id={id} result={result} answers={answers} t={t} />
              ) : (
                <Stance key={id} id={id} result={result} answers={answers} t={t} />
              ),
            )}
          </section>
        );
      })}

      <Weighted ids={result.settled} headingKey="weight.heaviest" t={t} />
      <Weighted ids={result.open} headingKey="weight.lightest" t={t} />
    </>
  );
}
