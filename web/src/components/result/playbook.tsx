"use client";

import { useEffect, useId, useState } from "react";
import { Checkbox } from "radix-ui";
import { cn } from "@/lib/cn";
import { useStore } from "@/components/shell/store-provider";
import { Plate, PlateHead } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import type { Practice } from "@/core/store";
import type { Playbook as Suggestions, PlaybookSuggestion } from "@/core/types";

/**
 * "So here is what to do about it" — written by the reader.
 *
 * Every result in this app ends with a reading and then stops, which leaves the
 * hardest part to the person holding it: turning "you score high on avoidance"
 * into a sentence somebody else can act on. This is where that happens, and the
 * two halves are not symmetrical in value. A suggested line the reader ticks is
 * a sentence we wrote that they endorsed. A line they type is one we could not
 * have written. The second is the point; the suggestions exist because
 * recognising a sentence is a far smaller act than composing one from nothing,
 * and a blank box on a result page stays blank.
 *
 * Nothing is submitted. Every tick and every added line writes through to the
 * store as it happens, because a Save button on a page nobody expects to be a
 * form is a button that gets missed, and the reader who missed it finds an
 * empty sheet later with no idea why.
 *
 * None of it enters a share token. The reader's typed sentences are prose
 * nobody has reviewed, and the argument that keeps a stated reason out of a
 * link applies to them unchanged — with the difference that these were written
 * deliberately to be handed over, so it is a scope decision rather than a
 * permanent rule. They go on the instruction sheet, which is local, printable,
 * and the thing the app exists to produce.
 */

/**
 * Resolved strings, exactly as `ResultView` takes them.
 *
 * `t` is a function and a function cannot cross from a server component, so
 * copy travels as finished text. This component interpolates nothing, which is
 * why plain strings are enough here where the runner needed ICU patterns.
 */
export type PlaybookCopy = {
  heading: string;
  note: string;
  okHeading: string;
  notOkHeading: string;
  addOwn: string;
  addOwnPlaceholder: string;
  addButton: string;
  removeLabel: string;
  empty: string;
  localOnly: string;
};

type Side = "ok" | "notOk";
const OWN: Record<Side, "ownOk" | "ownNotOk"> = { ok: "ownOk", notOk: "ownNotOk" };

export function Playbook({
  id,
  suggestions,
  copy,
}: {
  id: string;
  suggestions: Suggestions;
  copy: PlaybookCopy;
}) {
  const store = useStore();
  const [practice, setPractice] = useState<Practice | null>(null);

  useEffect(() => {
    let live = true;
    void store.practice(id).then((found) => {
      if (live) setPractice(found);
    });
    return () => {
      live = false;
    };
  }, [store, id]);

  // Nothing is rendered until the stored picks are in hand. Drawing empty
  // checkboxes first and filling them a tick later shows the reader their own
  // list unticking itself, which reads as data loss.
  if (!practice) return null;

  /**
   * Optimistic, and deliberately so.
   *
   * The checkbox state comes from React and the write goes out behind it,
   * because the alternative — await the store, then re-render — puts a visible
   * lag between the click and the tick on the one interaction in the app that
   * has to feel like ticking a box on paper.
   *
   * What the optimism must not do is lie. The store is local storage and the
   * failure it has is quota, `StorageFullError` out of `LocalAdapter.set` —
   * including Safari in private browsing, where the adapter's one-byte probe
   * succeeds at construction and a real write throws later, so `store.durable`
   * stays true and the panel's storage sentence goes on saying everything is
   * fine. Fire and forget would make that an unhandled rejection, a box that
   * stays ticked, and an instruction sheet that prints nothing, with the three
   * of them never connected.
   *
   * So a failed write is caught and the picks are re-read from the store
   * rather than left as drawn: the tick that did not survive comes back off.
   * Re-reading rather than reverting to a remembered snapshot is what keeps a
   * later write that *did* succeed from being undone by an earlier one that
   * did not. Saying why, in a sentence on the page, needs a `playbook` copy key
   * in four locales; until that exists the console carries the reason and the
   * page carries the fact.
   */
  const write = (patch: Partial<Practice>) => {
    setPractice({ ...practice, ...patch });
    void store.savePractice(id, patch).catch((err: unknown) => {
      console.error(`playbook: the practice for "${id}" could not be saved`, err);
      void store.practice(id).then(setPractice).catch(() => {});
    });
  };

  // Spelled out rather than keyed by a computed `[side]`. A computed key on a
  // union widens the patch to an index signature, and an index signature is
  // exactly what would let a typo write a fifth array into the record that
  // nothing reads and nothing clears.
  const put = (field: keyof Practice & ("ok" | "notOk" | "ownOk" | "ownNotOk"), lines: string[]) =>
    write(
      field === "ok"
        ? { ok: lines }
        : field === "notOk"
          ? { notOk: lines }
          : field === "ownOk"
            ? { ownOk: lines }
            : { ownNotOk: lines },
    );

  const toggle = (side: Side, suggestionId: string, on: boolean) =>
    put(side, on ? [...practice[side], suggestionId] : practice[side].filter((v) => v !== suggestionId));

  // A line already in this column is not added a second time. `ownLineId` keys
  // the reader's own lines by position, so two identical strings are two lines
  // that both survive `resolvePlaybook` and both print on the instruction
  // sheet — the same request, under one name, as if it had been made twice.
  // The draft still clears in `submit`, so the sentence visibly lands on the
  // entry that is already there rather than appearing to be swallowed.
  const add = (side: Side, text: string) => {
    if (practice[OWN[side]].includes(text)) return;
    put(OWN[side], [...practice[OWN[side]], text]);
  };

  const remove = (side: Side, index: number) =>
    put(OWN[side], practice[OWN[side]].filter((_, i) => i !== index));

  return (
    <Plate>
      <PlateHead title={copy.heading} note={copy.note} />
      <div className="grid gap-8 sm:grid-cols-2">
        <Column
          heading={copy.okHeading}
          tone="ok"
          copy={copy}
          suggestions={suggestions.ok}
          picked={practice.ok}
          own={practice.ownOk}
          onToggle={(suggestionId, on) => toggle("ok", suggestionId, on)}
          onAdd={(text) => add("ok", text)}
          onRemove={(index) => remove("ok", index)}
        />
        <Column
          heading={copy.notOkHeading}
          tone="notOk"
          copy={copy}
          suggestions={suggestions.notOk}
          picked={practice.notOk}
          own={practice.ownNotOk}
          onToggle={(suggestionId, on) => toggle("notOk", suggestionId, on)}
          onAdd={(text) => add("notOk", text)}
          onRemove={(index) => remove("notOk", index)}
        />
      </div>
      <p className="mt-8 max-w-[62ch] text-sm leading-relaxed text-muted">{copy.localOnly}</p>
    </Plate>
  );
}

function Column({
  heading,
  tone,
  copy,
  suggestions,
  picked,
  own,
  onToggle,
  onAdd,
  onRemove,
}: {
  heading: string;
  tone: Side;
  copy: PlaybookCopy;
  suggestions: PlaybookSuggestion[];
  picked: string[];
  own: string[];
  onToggle: (id: string, on: boolean) => void;
  onAdd: (text: string) => void;
  onRemove: (index: number) => void;
}) {
  const groupId = useId();
  const inputId = useId();
  const [draft, setDraft] = useState("");
  // The one place in this component that can be wrong: a line of whitespace on
  // somebody's instruction sheet, printed, under their name.
  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onAdd(text);
    setDraft("");
  };

  const accent = tone === "ok" ? "border-brass" : "border-madder";

  return (
    <section aria-labelledby={groupId}>
      <h3 id={groupId} className={cn("label-caps mb-4 border-l-2 pl-3", accent)}>
        {heading}
      </h3>

      {!suggestions.length && !own.length ? <p className="mb-4 text-sm text-faint">{copy.empty}</p> : null}

      <ul className="mb-4 grid gap-2">
        {suggestions.map((s) => {
          const on = picked.includes(s.id);
          return (
            <li key={s.id}>
              <Checkbox.Root
                checked={on}
                onCheckedChange={(next) => onToggle(s.id, next === true)}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-3 rounded-sm border px-4 py-3 text-left text-sm leading-relaxed transition-colors",
                  on ? "border-brass bg-brass/10 text-ink" : "border-rule bg-panel-2 text-ink/80 hover:border-brass/50",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-[2px] grid size-4 shrink-0 place-items-center rounded-[2px] border text-[10px] leading-none",
                    on ? "border-brass bg-brass/20 text-brass" : "border-muted text-transparent",
                  )}
                >
                  ✓
                </span>
                <span>{s.text}</span>
              </Checkbox.Root>
            </li>
          );
        })}

        {own.map((text, i) => (
          <li
            key={`${i}-${text}`}
            className="flex items-start gap-3 rounded-sm border border-brass/50 bg-panel-2 px-4 py-3 text-sm leading-relaxed text-ink"
          >
            <span className="grow">{text}</span>
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label={`${copy.removeLabel}: ${text}`}
              className="shrink-0 text-muted transition-colors hover:text-madder"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <label htmlFor={inputId} className="label-caps mb-2 block">
        {copy.addOwn}
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type="text"
          value={draft}
          placeholder={copy.addOwnPlaceholder}
          autoComplete="off"
          onChange={(e) => setDraft(e.target.value)}
          // Enter adds the line. This is not inside a <form>: a form on the
          // result page would submit the page on Enter, and the page has
          // nowhere to submit to.
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            submit();
          }}
          className="w-full rounded-sm border border-rule bg-panel-2 px-4 py-3 text-sm text-ink placeholder:text-faint focus:border-brass focus:outline-none"
        />
        <Button onClick={submit} disabled={!draft.trim()}>
          {copy.addButton}
        </Button>
      </div>
    </section>
  );
}
