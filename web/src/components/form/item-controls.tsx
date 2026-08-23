"use client";

import { RadioGroup, Checkbox, Select } from "radix-ui";
import { useId } from "react";
import { cn } from "@/lib/cn";
import type { Item, Field, ScaleDef } from "@/core/types";

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

function Radio({ value, label, checked }: { value: string; label: string; checked: boolean }) {
  return (
    <label className={optionStyles(checked)}>
      <RadioGroup.Item value={value} className={dot(checked)}>
        <RadioGroup.Indicator className="block size-2 rounded-full bg-brass" />
      </RadioGroup.Item>
      <span>{label}</span>
    </label>
  );
}

export type ItemValue = string | number | string[] | undefined;

export function ItemControl({
  item,
  value,
  scale,
  onChange,
}: {
  item: Item;
  value: ItemValue;
  scale?: ScaleDef;
  onChange: (next: ItemValue) => void;
}) {
  const labelId = useId();

  if (item.kind === "likert") {
    if (!scale) throw new Error(`likert item "${item.id}" rendered without a scale`);
    const points = Array.from({ length: scale.max - scale.min + 1 }, (_, i) => scale.min + i);
    return (
      <fieldset data-item={item.id} className="mb-6">
        <legend id={labelId} className="mb-3 block max-w-[54ch] text-base leading-snug">
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

  const picked = Array.isArray(value) ? value : [];
  const atLimit = item.max !== undefined && picked.length >= item.max;
  return (
    <fieldset data-item={item.id} className="mb-6">
      <legend className="mb-3 block max-w-[54ch] text-base leading-snug">{item.prompt}</legend>
      <div className="grid gap-2">
        {item.options.map((o) => {
          const on = picked.includes(o.value);
          return (
            <label key={o.value} className={optionStyles(on)}>
              <Checkbox.Root
                checked={on}
                // A limit stops you adding, never stops you removing. Disabling
                // a ticked box at the cap traps somebody who picked wrong.
                disabled={!on && atLimit}
                onCheckedChange={(next) =>
                  onChange(next ? [...picked, o.value] : picked.filter((v) => v !== o.value))
                }
                className={cn(
                  "grid size-4 shrink-0 place-items-center rounded-[2px] border",
                  on ? "border-brass bg-brass/20" : "border-muted",
                  !on && atLimit && "opacity-40",
                )}
              >
                <Checkbox.Indicator className="text-[10px] leading-none text-brass">✓</Checkbox.Indicator>
              </Checkbox.Root>
              <span>{o.label}</span>
            </label>
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
            const picked = Array.isArray(value) ? value : [];
            const on = picked.includes(o.value);
            return (
              <label key={o.value} className={optionStyles(on)}>
                <Checkbox.Root
                  checked={on}
                  onCheckedChange={(next) =>
                    onChange(next ? [...picked, o.value] : picked.filter((v) => v !== o.value))
                  }
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded-[2px] border",
                    on ? "border-brass bg-brass/20" : "border-muted",
                  )}
                >
                  <Checkbox.Indicator className="text-[10px] leading-none text-brass">✓</Checkbox.Indicator>
                </Checkbox.Root>
                <span>{o.label}</span>
              </label>
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
        <Select.Value>{current?.label ?? ""}</Select.Value>
        <Select.Icon className="text-muted">▾</Select.Icon>
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
