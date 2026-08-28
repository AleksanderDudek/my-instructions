"use client";

import { RadioGroup, Checkbox, Select } from "radix-ui";
import { useId } from "react";
import { cn } from "@/lib/cn";
import { format } from "@/core/i18n";
import type { Item, Field, Locale, ScaleDef } from "@/core/types";

/**
 * The controls, and the bug they exist to make impossible.
 *
 * In the vanilla app every answer replaced the surrounding markup wholesale —
 * `host.innerHTML = render()` — so the control being clicked was destroyed
 * mid-interaction. Focus fell back to the document, an open native <select>
 * was torn out from under the pointer, and the reported symptom was that the
 * field simply did not work.
 *
 * Two things here mean that cannot recur. React reconciles rather than
 * replaces, so a re-render caused by an answer leaves the DOM node alone. And
 * these are Radix primitives, which own focus, roving tabindex and the ARIA
 * wiring — a radio group is arrow-navigable and a select is keyboard-operable
 * because the primitive does it, not because a page remembered to.
 *
 * Controlled inputs, deliberately: `value` comes from state and the only way
 * an answer changes is through `onChange`. There is no path where the DOM
 * holds an answer the application has not seen.
 */

const optionStyles = (checked: boolean) =>
  cn(
    "flex w-full cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-left transition-colors",
    checked ? "border-brass bg-brass/10 text-ink" : "border-rule bg-panel-2 text-ink/80 hover:border-brass/50",
  );

const dot = (checked: boolean) =>
  cn("grid size-4 shrink-0 place-items-center rounded-full border", checked ? "border-brass" : "border-muted");

/**
 * The item *is* the control — no `<label>` around it.
 *
 * Wrapping a Radix radio in a label nests one interactive element inside
 * another: `<button>` is labelable, so the label's implicit control is the very
 * button it contains, and a click on the button bubbles to the label which
 * forwards a click back to it. Radix selects on arrow-key navigation by
 * calling `.click()` from the item's focus handler, and that call was being
 * lost in the round trip — focus moved, selection did not follow, which is
 * precisely the "radio does not work" report in a different disguise.
 *
 * The button carries its own text, so it names itself and needs no label.
 */
function Radio({ value, label, checked }: { value: string; label: string; checked: boolean }) {
  return (
    <RadioGroup.Item value={value} className={optionStyles(checked)}>
      <span className={dot(checked)} aria-hidden>
        {checked ? <span className="block size-2 rounded-full bg-brass" /> : null}
      </span>
      <span>{label}</span>
    </RadioGroup.Item>
  );
}

export type ItemValue = string | number | string[] | undefined;

/**
 * What a tick does to a multi-select, given the options that mean *none*.
 *
 * Pure and exported so the rule can be read back in a test: this repo runs its
 * tests in Node with no DOM, and a selection rule locked inside an event
 * handler is a rule nothing can check. The component below owns the markup;
 * these two own the arithmetic.
 *
 * An `exclusive` option is the honest escape every option set is required to
 * carry — "nothing at the moment", "I have not thought about it", "it touches
 * none of my money". Ticking one replaces the whole selection with itself,
 * because that is what the words say; ticking an ordinary option drops every
 * escape on the way in, for the same reason. Unticking is untouched, and stays
 * the one gesture that always does exactly and only what it says.
 */
export function nextSelection(
  picked: readonly string[],
  value: string,
  on: boolean,
  exclusive: readonly string[] = [],
): string[] {
  if (!on) return picked.filter((v) => v !== value);
  if (exclusive.includes(value)) return [value];
  return [...picked.filter((v) => !exclusive.includes(v)), value];
}

/**
 * Whether the cap has been spent — and an escape spends none of it.
 *
 * `max` limits how many positions a reader may take, and "none of these" is not
 * a position competing for the same room. So an exclusive option is counted by
 * neither side of this: it does not fill the cap, and the caller must not let
 * the cap disable it. A reader who has used all three picks and then realises
 * none of them are true has to be able to say so in one click. That is the same
 * argument the disabled rule below already makes about a box ticked by mistake,
 * one step on: a limit stops you adding, and must never stop you withdrawing.
 */
export function selectionAtCap(picked: readonly string[], max?: number, exclusive: readonly string[] = []): boolean {
  return max !== undefined && picked.filter((v) => !exclusive.includes(v)).length >= max;
}

/**
 * The prompt, plus what it is about when the prompt does not say.
 *
 * A stance block's derived items — `<block>.weight`, `<block>.why` — carry the
 * same two sentences in every block of every inventory, on purpose: eight
 * instruments asking "how important is this to you?" eight slightly different
 * ways is eight chances for a reader to look for a meaning in the difference.
 * Printed under the question they belong to, they are unambiguous. Read out of
 * that context they are not, and a screen-reader user moving control to
 * control meets two textareas with byte-identical names on one page.
 *
 * The block's own question is therefore folded into the accessible name and
 * hidden from the page, which is the one place the ambiguity exists. It is
 * hidden rather than printed because the question is already on the screen a
 * few lines up — `paginate` keeps a group whole precisely so that it is — and
 * repeating it under itself would be its own kind of unreadable.
 *
 * The prompt element stays the accessible name in both cases: a `<legend>`
 * pointed at by `aria-labelledby` for the grouped controls, a `<label>` for
 * the textarea. Nothing here overrides a name with `aria-label`, so what the
 * markup says and what is announced cannot drift apart.
 */
function Subject({ subject }: { subject?: string }) {
  return subject ? <span className="sr-only">{subject} </span> : null;
}

/**
 * The two sentences that say how a multi-select behaves.
 *
 * Strings rather than a `t`, because a function cannot cross from a server
 * component and every other piece of copy in the runner crosses as data. The
 * "up to" line is the raw ICU pattern for the same reason the progress count
 * is: `max` belongs to the item, so the value is only known here, and `format`
 * needs the locale to reach Polish plural agreement if a translator ever asks
 * for it.
 */
export type MultiCopy = { chooseUpTo: string; chooseAny: string };

export function ItemControl({
  item,
  value,
  scale,
  subject,
  copy,
  locale,
  onChange,
}: {
  item: Item;
  value: ItemValue;
  scale?: ScaleDef;
  /** The lead question of the item's group, where this item is not it. */
  subject?: string;
  copy: MultiCopy;
  locale: Locale;
  onChange: (next: ItemValue) => void;
}) {
  const labelId = useId();

  if (item.kind === "likert") {
    if (!scale) throw new Error(`likert item "${item.id}" rendered without a scale`);
    const points = Array.from({ length: scale.max - scale.min + 1 }, (_, i) => scale.min + i);
    return (
      <fieldset data-item={item.id} className="mb-6">
        <legend id={labelId} className="mb-3 block max-w-[54ch] text-base leading-snug">
          <Subject subject={subject} />
          {item.prompt}
        </legend>
        <RadioGroup.Root
          aria-labelledby={labelId}
          value={value === undefined ? "" : String(value)}
          onValueChange={(next) => onChange(Number(next))}
          className="grid gap-2 sm:grid-cols-5"
        >
          {points.map((point, i) => (
            <Radio key={point} value={String(point)} label={scale.labels[i]} checked={value === point} />
          ))}
        </RadioGroup.Root>
      </fieldset>
    );
  }

  if (item.kind === "choice") {
    return (
      <fieldset data-item={item.id} className="mb-6">
        <legend id={labelId} className="mb-3 block max-w-[54ch] text-base leading-snug">
          <Subject subject={subject} />
          {item.prompt}
        </legend>
        <RadioGroup.Root
          aria-labelledby={labelId}
          value={value === undefined ? "" : String(value)}
          onValueChange={onChange}
          className="grid gap-2"
        >
          {item.options.map((o) => (
            <Radio key={o.value} value={o.value} label={o.label} checked={value === o.value} />
          ))}
        </RadioGroup.Root>
      </fieldset>
    );
  }

  /**
   * A rating: ten small targets in one row, words only at the ends.
   *
   * Still a Radix radio group, so it arrow-navigates and announces "3 of 10"
   * like any other set of radios — but laid out as a row of numbers rather than
   * a stack of sentences, because the thing being asked is "how much", and ten
   * translated verbal anchors would be ten sentences nobody reads standing
   * between the reader and a number they already knew.
   *
   * The end labels are attached to the first and last target's accessible name
   * rather than left as loose text beneath. A screen-reader user arrowing
   * through the row hears "1, not important" where a sighted reader sees the
   * caption; putting the words only in the caption means they are announced
   * once, before the group, and never again where they are needed.
   */
  if (item.kind === "rating") {
    const points = Array.from({ length: item.max - item.min + 1 }, (_, i) => item.min + i);
    const endLabel = (point: number) =>
      point === item.min && item.minLabel
        ? `${point} — ${item.minLabel}`
        : point === item.max && item.maxLabel
          ? `${point} — ${item.maxLabel}`
          : undefined;

    return (
      <fieldset data-item={item.id} className="mb-6">
        <legend id={labelId} className="mb-3 block max-w-[54ch] text-base leading-snug">
          <Subject subject={subject} />
          {item.prompt}
        </legend>
        <RadioGroup.Root
          aria-labelledby={labelId}
          value={value === undefined ? "" : String(value)}
          onValueChange={(next) => onChange(Number(next))}
          className="flex flex-wrap gap-2"
        >
          {points.map((point) => (
            <RadioGroup.Item
              key={point}
              value={String(point)}
              aria-label={endLabel(point)}
              className={cn(
                "num min-w-[2.75rem] flex-1 cursor-pointer rounded-sm border py-3 text-center transition-colors",
                value === point
                  ? "border-brass bg-brass/10 text-brass-hi"
                  : "border-rule bg-panel-2 text-ink/80 hover:border-brass/50",
              )}
            >
              {point}
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
        {item.minLabel || item.maxLabel ? (
          <div aria-hidden className="mt-2 flex justify-between gap-6 text-sm text-faint">
            <span>{item.minLabel}</span>
            <span className="text-right">{item.maxLabel}</span>
          </div>
        ) : null}
      </fieldset>
    );
  }

  /**
   * Free text, with a real `<label>` — the opposite of the radio rule above.
   *
   * A textarea is not itself a labelable interactive container, so wrapping is
   * not in question and `htmlFor` is simply the correct wiring: clicking the
   * prompt puts the caret in the box, which is what everybody expects of a
   * question with a space under it.
   *
   * No character counter, deliberately. A counter turns "why does this matter
   * to you" into a task with a target, and the answers get longer rather than
   * truer. An emptied box stores `undefined` rather than an empty string, so
   * deleting what you wrote leaves the item unanswered instead of answered with
   * nothing — the progress count and the stored draft both depend on the
   * difference.
   */
  if (item.kind === "text") {
    return (
      <div data-item={item.id} className="mb-6">
        <label htmlFor={labelId} className="mb-3 block max-w-[54ch] text-base leading-snug">
          <Subject subject={subject} />
          {item.prompt}
        </label>
        {/* The focus ring is the app's, not this control's. `globals.css` puts
            one on every `:focus-visible` and says why — the vanilla app lost
            focus on every repaint, and hiding the ring would have hidden the
            evidence. `focus:outline-none` here would beat that rule on
            specificity and leave a box whose only focus signal is a colour
            change on a border it already had. */}
        <textarea
          id={labelId}
          rows={item.rows ?? 3}
          value={typeof value === "string" ? value : ""}
          placeholder={item.placeholder}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value === "" ? undefined : e.target.value)}
          className="w-full max-w-[62ch] rounded-sm border border-rule bg-panel-2 px-4 py-3 leading-relaxed text-ink placeholder:text-faint focus:border-brass"
        />
      </div>
    );
  }

  /**
   * Tick as many as apply — and one tick that means none of them.
   *
   * `item.exclusive` names the options that cannot be held with anything else.
   * Both halves of the rule are in `nextSelection` above; the cap's blind spot
   * is in `selectionAtCap`. What is left here is the one thing that has to be
   * said in the markup: an escape is never the capped box. A reader at the cap
   * who then decides none of these are true would otherwise have to work out
   * that they must first untick something in order to say so.
   *
   * The cap is also *stated*, not only enforced. A limit that exists solely as
   * greyed-out boxes is a rule the reader has to infer from a page that has
   * started refusing them, and the sentence costs one line.
   */
  const picked = Array.isArray(value) ? value : [];
  const exclusive = item.exclusive ?? [];
  const atLimit = selectionAtCap(picked, item.max, exclusive);
  return (
    <fieldset data-item={item.id} className="mb-6">
      {/* No `aria-labelledby` here and none needed: the checkboxes are in the
          fieldset itself rather than in a Radix group inside it, so the legend
          names the group natively. */}
      <legend className="mb-3 block max-w-[54ch] text-base leading-snug">
        <Subject subject={subject} />
        {item.prompt}
      </legend>
      <p className="mb-3 max-w-[54ch] text-sm text-muted">
        {item.max !== undefined ? format(copy.chooseUpTo, { max: item.max }, locale) : copy.chooseAny}
      </p>
      <div className="grid gap-2">
        {item.options.map((o) => {
          const on = picked.includes(o.value);
          const capped = !on && atLimit && !exclusive.includes(o.value);
          return (
            <Checkbox.Root
              key={o.value}
              checked={on}
              /**
               * `aria-disabled`, and the refusal in the handler rather than on
               * the element.
               *
               * A limit stops you adding, never stops you removing, and never
               * stops you saying none of these — so only an unticked ordinary
               * option is ever capped. But `Checkbox.Root` renders a real
               * `<button>`, and `disabled` on it takes the option out of the
               * tab order without a word: a keyboard or screen-reader user at
               * the cap meets a list that has quietly lost some of its members
               * while keeping others, which reads as a rendering fault rather
               * than as a rule. `aria-disabled` keeps the option reachable and
               * announced as unavailable, which is what it is. Nothing then
               * blocks the click, so the handler has to.
               */
              aria-disabled={capped || undefined}
              onCheckedChange={(checked) => {
                if (capped) return;
                onChange(nextSelection(picked, o.value, Boolean(checked), exclusive));
              }}
              className={cn(optionStyles(on), capped && "opacity-50")}
            >
              <span
                aria-hidden
                className={cn(
                  "grid size-4 shrink-0 place-items-center rounded-[2px] border text-[10px] leading-none",
                  on ? "border-brass bg-brass/20 text-brass" : "border-muted text-transparent",
                )}
              >
                ✓
              </span>
              <span>{o.label}</span>
            </Checkbox.Root>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ══ profiler fields ══════════════════════════════════════════════ */

export function FieldControl({
  field,
  value,
  error,
  onChange,
}: {
  field: Field;
  value: ItemValue;
  error?: string;
  onChange: (next: ItemValue) => void;
}) {
  const id = useId();
  const described = error ? `${id}-error` : undefined;
  /**
   * The same selection rule as the items above, not a second copy of it.
   *
   * `nextSelection` was extracted so the arithmetic would live in one place,
   * and this branch had gone on inlining the old version — which also meant
   * `field.max` was declared and then ignored, so a profiler's cap existed only
   * in its `validate()` and the reader met it as an error after submitting. A
   * `Field` cannot declare an escape today, so there is no exclusive list to
   * pass and the default empty one is the whole truth; if fields ever grow one,
   * the rule is already written where both callers read it.
   *
   * `field.max` means two different things on two different kinds — a cap on a
   * multi, a numeric bound on a number input — so only the first is read here.
   */
  const picked = Array.isArray(value) ? value : [];
  const atLimit = field.kind === "multi" && selectionAtCap(picked, field.max);

  return (
    <div className="mb-6" data-field={field.id}>
      <label htmlFor={id} className="label-caps mb-2 block">
        {field.label}
      </label>
      {field.hint ? <p className="mb-2 text-sm text-muted">{field.hint}</p> : null}

      {field.kind === "select" ? (
        <SelectField
          id={id}
          field={field}
          value={value === undefined ? String(field.value ?? "") : String(value)}
          onChange={onChange}
          describedBy={described}
        />
      ) : field.kind === "multi" ? (
        <div className="grid gap-2">
          {(field.options ?? []).map((o) => {
            const on = picked.includes(o.value);
            const capped = !on && atLimit;
            return (
              <Checkbox.Root
                key={o.value}
                checked={on}
                // Announced as unavailable and still reachable, for the reason
                // spelled out on the item control above: `disabled` would drop
                // the option out of the tab order without saying anything.
                aria-disabled={capped || undefined}
                onCheckedChange={(next) => {
                  if (capped) return;
                  onChange(nextSelection(picked, o.value, Boolean(next)));
                }}
                className={cn(optionStyles(on), capped && "opacity-50")}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded-[2px] border text-[10px] leading-none",
                    on ? "border-brass bg-brass/20 text-brass" : "border-muted text-transparent",
                  )}
                >
                  ✓
                </span>
                <span>{o.label}</span>
              </Checkbox.Root>
            );
          })}
        </div>
      ) : (
        <input
          id={id}
          type={
            field.kind === "number" ? "number" : field.kind === "date" ? "date" : field.kind === "time" ? "time" : "text"
          }
          inputMode={field.kind === "number" ? "numeric" : undefined}
          value={value === undefined ? String(field.value ?? "") : String(value)}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={described}
          onChange={(e) => onChange(e.target.value)}
          className={cn("w-full rounded-sm border bg-panel-2 px-4 py-3 text-ink", error ? "border-madder" : "border-rule")}
        />
      )}

      {error ? (
        <p id={described} role="alert" className="mt-2 text-sm text-madder">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * A select that works with a keyboard.
 *
 * Radix renders a button plus a portalled listbox rather than a native
 * `<select>`, which is what makes it survivable: the value is owned by React
 * state, so no re-render can interrupt a choice in progress, and the listbox
 * is arrow-navigable and type-ahead searchable without the page implementing
 * either.
 */
function SelectField({
  id,
  field,
  value,
  onChange,
  describedBy,
}: {
  id: string;
  field: Field;
  value: string;
  onChange: (next: string) => void;
  describedBy?: string;
}) {
  const current = (field.options ?? []).find((o) => o.value === value);
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        id={id}
        aria-describedby={describedBy}
        className="flex w-full items-center justify-between gap-3 rounded-sm border border-rule bg-panel-2 px-4 py-3 text-left text-ink data-[state=open]:border-brass"
      >
        <Select.Value data-testid="select-value">{current?.label ?? ""}</Select.Value>
        {/* Decorative. Without this the caret joins the control's accessible
            name and a screen reader announces the chosen option followed by a
            down-pointing triangle. */}
        <Select.Icon aria-hidden className="text-muted">
          ▾
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="z-50 max-h-72 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-sm border border-rule bg-panel shadow-plate"
        >
          <Select.Viewport className="p-1">
            {(field.options ?? []).map((o) => (
              <Select.Item
                key={o.value}
                value={o.value}
                className="cursor-pointer rounded-sm px-3 py-2 text-ink outline-none data-[highlighted]:bg-brass/15 data-[highlighted]:text-brass-hi"
              >
                <Select.ItemText>{o.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
