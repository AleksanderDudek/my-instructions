"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Answers, Form, InstrumentSpec, ItemsForm, Locale, T } from "@/core/types";
import { loadInstrumentModule } from "@/instruments/lazy";
import { ItemControl, FieldControl, type ItemValue } from "@/components/form/item-controls";
import { Button } from "@/components/ui/button";
import { useStore } from "@/components/shell/store-provider";
import { createI18n, format, type Messages } from "@/core/i18n";

/**
 * The runner.
 *
 * Client-only on purpose, and rendered behind a loading state rather than
 * hydrated from server markup. It needs local storage before it can decide
 * anything — which answers exist, which page to resume on, what order the
 * items were shuffled into — and a server render would have to guess all three
 * and then be corrected, which is a hydration mismatch by construction. The
 * runner is also the one route with nothing to index: it is a form.
 *
 * The state model is the fix for the reported bug. One `answers` object lives
 * in React state, every control is driven from it, and answering re-renders
 * the tree instead of replacing its markup. Nothing is destroyed mid-click, so
 * focus stays where the reader put it.
 */

/**
 * Message *patterns*, not finished strings.
 *
 * Four of these interpolate a value the finished string would have to have
 * baked in — how many items the reader has answered, which page they are on,
 * how many picks one particular multi-select allows — and a function cannot
 * cross the boundary from a server component to a client one. So the raw ICU
 * pattern is handed over and `format` runs here, which also keeps Polish
 * plural agreement correct on a count that only exists on the client.
 */
export type RunnerCopy = {
  count: string;
  page: string;
  next: string;
  back: string;
  finish: string;
  remaining: string;
  loading: string;
  /** How a multi-select behaves, said rather than left to be inferred. */
  chooseUpTo: string;
  chooseAny: string;
};

/** A deterministic shuffle, so a resumed draft shows the same order. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(list: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Cut the item order into pages.
 *
 * The default is arithmetic: every `pageSize` items, in whatever order the
 * shuffle left them. That is right for a scored bank, where the items are
 * interchangeable by construction and a page break falls in the middle of
 * nothing.
 *
 * `pageBy: "group"` is for a bank where a break in the wrong place changes the
 * question. A stance block is one position, one weight and one reason, and
 * asking how important something is on a screen that no longer shows the
 * something is asking a different question. So a group is never split, and
 * `pageSize` becomes a soft ceiling rather than a rule: groups are packed onto
 * a page until the next one would not fit, and a group larger than the ceiling
 * gets a page of its own that overruns it.
 *
 * The alternative — one group per page, always — was rejected because it makes
 * `pageSize` inert and forces an instrument of twelve one-line blocks to be
 * twelve screens of one question each.
 */
export function paginate(
  order: string[],
  itemOf: (id: string) => { group?: string } | undefined,
  pageSize: number,
  pageBy?: "group",
): string[][] {
  if (pageBy !== "group") {
    const pages: string[][] = [];
    for (let i = 0; i < order.length; i += pageSize) pages.push(order.slice(i, i + pageSize));
    return pages.length ? pages : [[]];
  }

  // An item with no group is a group of one, keyed on its own id so two
  // consecutive ungrouped items never merge into one indivisible run.
  const keyAt = (i: number) => itemOf(order[i])?.group ?? `\u0000${order[i]}`;
  const pages: string[][] = [];
  let current: string[] = [];

  for (let i = 0; i < order.length; ) {
    let end = i;
    while (end < order.length && keyAt(end) === keyAt(i)) end++;
    const run = order.slice(i, end);
    if (current.length && current.length + run.length > pageSize) {
      pages.push(current);
      current = [];
    }
    current = [...current, ...run];
    i = end;
  }
  if (current.length) pages.push(current);
  return pages.length ? pages : [[]];
}

/**
 * What a page is *about*, when it is about one thing — and `null` otherwise.
 *
 * `Item.section` has existed since before the inventories and nothing has ever
 * drawn it, which is why eight banks name their sections and none of them was
 * ever read out to a reader. §8.2 of `docs/next-four-instruments.md` is the
 * argument for drawing it, and it is also the reason `pageBy: "group"` exists:
 * "one topic per page, with the topic named at the top and one sentence saying
 * what it is for. Six pages, each of which feels like a subject rather than a
 * slog." The sentence is already written, translated and critiqued in every
 * bank. This is the function that decides whether the reader may see it.
 *
 * Four ways to have no header, and every one of them is deliberate.
 *
 * **An empty page**, which only a bank with no items can produce, has nothing
 * to be about.
 *
 * **No section on the first item.** Most banks set none at all — a scored
 * scale's items are interchangeable by construction and captioning five of
 * them would invent a grouping the instrument does not claim.
 *
 * **Two sections on one page.** This is the branch worth being explicit about,
 * because it is the one an accident would get wrong. Titling a mixed page with
 * whichever section happened to come first prints a caption over questions it
 * does not describe, and a caption that is wrong is worse than a caption that
 * is absent: the reader has no way to tell that the last two questions changed
 * subject, and answers them under the wrong heading. A whole page is something
 * a bank earns by setting `pageBy: "group"` and cutting `pageSize` to the size
 * of a section — `communication-style` spells the arithmetic out as `3 * 3` for
 * exactly this reason. A bank that has not done it gets no header.
 *
 * **A section with no copy behind it.** `intimacy-map` sets a `section` on all
 * fifty of its items and writes `section.<id>` as a bare title with no note,
 * because it uses the field to group a *result* rather than to caption a page
 * — and it pages by arithmetic, so a page that falls inside one section there
 * is a coincidence, not a subject. Resolving a key it never wrote would print
 * `section.acts.title` at the reader on some pages and not others. Asking
 * first is what keeps the header to the banks that wrote one.
 *
 * The note is optional where the title is not: a bank may caption a page
 * without explaining it, and half a header is still a header. The reverse is
 * not true, so a note with no title above it is treated as no header at all.
 */
export function sectionHeader(
  page: readonly string[],
  itemOf: (id: string) => { section?: string } | undefined,
  copy: { t: T; defines(key: string): boolean },
): { id: string; title: string; note: string | null } | null {
  if (!page.length) return null;
  const id = itemOf(page[0])?.section;
  if (!id) return null;
  if (!page.every((key) => itemOf(key)?.section === id)) return null;
  if (!copy.defines(`section.${id}.title`)) return null;
  return {
    id,
    title: copy.t(`section.${id}.title`),
    note: copy.defines(`section.${id}.note`) ? copy.t(`section.${id}.note`) : null,
  };
}

/**
 * The heading, kept deliberately small.
 *
 * A reader meets this four times in one sitting, so it is set in the page's
 * existing label vocabulary — `label-caps`, the mono small-caps used for the
 * page counter directly below it and for every eyebrow on a result — rather
 * than in the display face the `<h1>` above uses. A second serif heading per
 * screen would read as a chapter title in a textbook, and the register of
 * these instruments is a serious conversation rather than a syllabus. It takes
 * the full ink colour instead of `label-caps`'s muted one so that the title
 * leads and the sentence under it supports, which is the whole hierarchy.
 *
 * Three things it deliberately does not do:
 *
 * It carries no `aria-live` and no `role="status"`, and it is not folded into
 * the progress region above. The count is already a polite live region; a
 * second one turning over on the same click would announce the section beside
 * "6 of 36 answered" every time either changed, which is the section title read
 * out twice on arrival and again on every answer. A heading is how a screen
 * reader navigates structure, and it does that by being a heading.
 *
 * It takes no `tabIndex` and is never focused. `goto` scrolls the new page into
 * view and pointedly leaves focus where the reader's hands are — this whole
 * component exists because the vanilla app moved focus out from under people —
 * and a header that grabbed focus to announce itself would reintroduce exactly
 * that on every page turn.
 *
 * It is an `<h2>`: the take page's `<h1>` is the instrument's name, and the
 * sections are under it.
 */
export function SectionHeader({ title, note }: { title: string; note: string | null }) {
  return (
    <div className="mb-6" data-testid="section">
      <h2 className="label-caps text-ink">{title}</h2>
      {note ? <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">{note}</p> : null}
    </div>
  );
}

type Ready = {
  answers: Answers;
  order: string[];
  seed: number;
  page: number;
};

export function Runner({
  id,
  locale,
  form,
  meta,
  copy,
  pairwise,
  messages,
  fallbackMessages,
}: {
  id: string;
  locale: Locale;
  form: Form;
  meta: Pick<InstrumentSpec, "version" | "persistence" | "pairwise">;
  copy: RunnerCopy;
  pairwise: boolean;
  /**
   * The instrument's own table, so validation messages are sentences.
   *
   * A profiler validates on submit and the messages come from the instrument.
   * `t` is a function and cannot cross from a server component, so the table
   * travels as data and `t` is rebuilt here — an earlier version passed an
   * identity function instead and every validation error rendered its own
   * message key at the reader.
   */
  messages: Messages;
  fallbackMessages: Messages;
}) {
  const store = useStore();
  const router = useRouter();
  const scoped = useMemo(
    () => createI18n({ locale, messages, fallbackMessages }).scope(id),
    [locale, messages, fallbackMessages, id],
  );
  // `?who=b` is the second person of a pair answering on the same device. It
  // is read here rather than on the server because a statically exported page
  // has no server to read it on — and because it was always client state: the
  // half it selects lives in memory in this tab and nowhere else.
  const search = useSearchParams();
  const slot: "b" | null = pairwise && search.get("who") === "b" ? "b" : null;
  const [state, setState] = useState<Ready | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const items = useMemo(() => (form.kind === "items" ? form.items : []), [form]);
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const pageSize = form.kind === "items" ? (form.pageSize ?? 5) : items.length;
  const optional = form.kind === "items" ? Boolean(form.optional) : true;
  const sessionOnly = meta.persistence === "session";

  /* ── resume ─────────────────────────────────────────────────────
     One effect, once, before anything is drawn. A session-only
     instrument has no draft to find, which is the whole promise it
     made before the first question.                                */
  useEffect(() => {
    let live = true;
    (async () => {
      if (form.kind === "fields") {
        const existing = await store.run(id);
        if (!live) return;
        setState({ answers: { ...(existing?.answers ?? {}) }, order: [], seed: 0, page: 0 });
        return;
      }
      const draft = sessionOnly ? null : await store.draft(id);
      const existing = sessionOnly ? null : await store.run(id);
      if (!live) return;

      const seed = draft?.seed ?? ((Math.random() * 2 ** 31) | 0);
      const ids = items.map((i) => i.id);
      /**
       * A stored order is honoured only where the order was random to start
       * with.
       *
       * Reusing the draft's copy is what stops a shuffled bank re-shuffling
       * under somebody halfway through it. An unshuffled bank has nothing to
       * preserve: its order *is* the declared one, so a stored copy can only
       * differ from it by being stale — and under `pageBy: "group"` a stale
       * copy is not cosmetic. The append below puts a newly declared item at
       * the end of the list, so an item added to the first block lands after
       * the last one, and `paginate` reads it as a second, separate run for a
       * group that already closed. The group is split across a page break and
       * the reader is asked what a position rests on with the position off
       * the screen — the one thing the group paging exists to prevent.
       */
      const stored = draft?.order?.length ? draft.order.filter((x) => byId.has(x)) : null;
      let order = form.shuffle ? (stored ?? shuffled(ids, seed)) : ids;
      // An item added in a later version joins the end rather than reshuffling
      // a draft somebody is halfway through. A no-op for the declared order
      // above, which already contains every id there is.
      for (const key of ids) if (!order.includes(key)) order = [...order, key];

      const answers = { ...(draft?.answers ?? (existing?.instrumentVersion === meta.version ? existing.answers : {})) };
      // Clamped through the same paginator the render uses. A draft saved
      // before the item bank was regrouped can name a page that no longer
      // exists, and an out-of-range page renders an empty screen with a Next
      // button that does nothing.
      const pages = paginate(order, (key) => byId.get(key), pageSize, form.pageBy).length;
      setState({ answers, order, seed, page: Math.min(draft?.page ?? 0, pages - 1) });
    })();
    return () => {
      live = false;
    };
    // Deliberately once per instrument: re-running this would discard answers
    // the reader has typed since.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const persist = useCallback(
    (next: Ready) => {
      if (sessionOnly || form.kind !== "items") return;
      void store.saveDraft(id, {
        answers: next.answers,
        order: next.order,
        seed: next.seed,
        page: next.page,
        total: next.order.length,
      });
    },
    [store, id, sessionOnly, form.kind],
  );

  /**
   * When the next draft write is due, in milliseconds — or `null` for nothing
   * to write. See the effect below; it is a ref rather than state because
   * scheduling a save is not something the reader can see.
   */
  const draftDue = useRef<number | null>(null);

  /* ── saving ─────────────────────────────────────────────────────
     Answering is state; saving is an effect, and the two must not be
     one act.

     The write used to run inside the `setState` updater. An updater is
     required to be pure: React calls it during render, may call it more
     than once, and may throw its result away when a concurrent render
     re-bases — so a draft could be written for a render nobody ever
     saw, and StrictMode wrote every answer to disk twice on the way.
     Doing it here means the draft is written once, after the render
     that produced it was actually committed.

     How long it waits depends on what changed, because the two cases
     are not alike. A radio or a page turn happens at the speed of a
     hand, so `0` — the next macrotask, which is as immediate as an
     effect can be while still being an effect. A `text` item fires on
     every keypress, and each write serialises the entire draft — every
     answer and the whole order — into `localStorage` synchronously on
     the main thread; those coalesce. The window is deliberately short:
     what it can cost is the last few characters of somebody who types
     and closes the tab in the same breath, and seconds would start
     costing whole sentences.                                        */
  useEffect(() => {
    const due = draftDue.current;
    if (!state || due === null) return;
    const handle = setTimeout(() => {
      // Read again rather than trusting the schedule: `finish` cancels a
      // write that has not happened yet, because `saveRun` deletes the draft
      // and a keystroke still in flight would put it straight back — leaving
      // a completed instrument that resumes into a half-finished form.
      if (draftDue.current === null) return;
      draftDue.current = null;
      persist(state);
    }, due);
    return () => clearTimeout(handle);
  }, [state, persist]);

  const answer = useCallback(
    (itemId: string, value: ItemValue) => {
      draftDue.current = byId.get(itemId)?.kind === "text" ? 400 : 0;
      setState((prev) => (prev ? { ...prev, answers: { ...prev.answers, [itemId]: value } } : prev));
    },
    [byId],
  );

  if (!state) {
    return (
      <p className="py-16 text-muted" role="status">
        {copy.loading}
      </p>
    );
  }

  /* ── profiler ─────────────────────────────────────────────────── */

  if (form.kind === "fields") {
    const finish = async () => {
      setSaving(true);
      const values: Answers = {};
      for (const f of form.fields) values[f.id] = state.answers[f.id] ?? f.value ?? "";
      const instrument = await loadInstrumentModule(id);
      const found = instrument?.spec.validate?.(values, scoped.t) ?? {};
      if (Object.keys(found).length) {
        setErrors(found);
        setSaving(false);
        return;
      }
      await store.saveRun({
        instrumentId: id,
        instrumentVersion: meta.version,
        answers: values,
        result: instrument!.spec.score(values),
      });
      router.push(`/${locale}/tests/${id}/result`);
    };

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void finish();
        }}
      >
        {form.fields.map((field) => (
          <FieldControl
            key={field.id}
            field={field}
            value={state.answers[field.id]}
            error={errors[field.id]}
            onChange={(v) => answer(field.id, v)}
          />
        ))}
        {form.note ? <p className="mb-6 max-w-[62ch] text-sm text-muted">{form.note}</p> : null}
        <Button type="submit" variant="primary" disabled={saving} data-testid="finish">
          {copy.finish}
        </Button>
      </form>
    );
  }

  /* ── questionnaire ────────────────────────────────────────────── */

  const itemsForm = form as ItemsForm;
  const pageList = paginate(state.order, (key) => byId.get(key), pageSize, itemsForm.pageBy);
  const pages = pageList.length;
  const slice = pageList[Math.min(state.page, pages - 1)] ?? [];
  // Resolved through the instrument's own table, the same way the validation
  // messages below are: `scoped` is the `t` rebuilt on this side of the
  // server/client boundary, and the section copy lives in the same message
  // file as everything else the bank says.
  const section = sectionHeader(slice, (key) => byId.get(key), scoped);
  const answered = state.order.filter((k) => state.answers[k] !== undefined).length;
  const last = state.page === pages - 1;
  /**
   * An optional form never blocks. Requiring an answer is right for a scored
   * scale, where a gap is a hole in the arithmetic, and wrong for anything
   * asking about a marriage or a body — where "I would rather not" is a real
   * answer and forcing one produces a false one.
   *
   * A `text` item never blocks either way, whatever the form declares. "I would
   * rather not explain" is a real answer, and a form that will not advance
   * until a reason is typed collects reasons that were typed to advance the
   * form — which is worse than no reason, because it looks like one.
   */
  const blocking = (key: string) => byId.get(key)?.kind !== "text";
  const outstanding = state.order.filter((k) => blocking(k) && state.answers[k] === undefined).length;
  const pageDone = optional || slice.filter(blocking).every((k) => state.answers[k] !== undefined);
  const canFinish = optional || outstanding === 0;

  const goto = (page: number) => {
    draftDue.current = 0;
    setState((prev) => (prev ? { ...prev, page } : prev));
    // Move the reader to the top of the new page without stealing focus from
    // wherever the keyboard is.
    document.getElementById("runner-page")?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const finish = async () => {
    setSaving(true);
    // The run supersedes the draft and `saveRun` deletes it. A write still
    // waiting out the debounce above would land afterwards and restore it.
    draftDue.current = null;
    const instrument = await loadInstrumentModule(id);
    if (!instrument) return;
    await store.saveRun(
      {
        instrumentId: id,
        instrumentVersion: meta.version,
        answers: state.answers,
        result: instrument.spec.score(state.answers),
      },
      { session: sessionOnly, slot },
    );
    router.push(`/${locale}/tests/${id}/result${slot ? `?who=${slot}` : ""}`);
  };

  return (
    <div id="runner-page">
      <div className="mb-8 flex items-center gap-4">
        <span className="h-[3px] flex-1 bg-rule" aria-hidden>
          <i
            className="block h-full bg-brass transition-[width] duration-300"
            style={{ width: `${Math.round((answered / state.order.length) * 100)}%` }}
          />
        </span>
        <span className="num text-sm text-muted" role="status" aria-live="polite" data-testid="progress">
          {format(copy.count, { answered, total: state.order.length }, locale)}
        </span>
      </div>

      {/* Null on a mixed page, on a bank that sets no section, and on one that
          set a section it never wrote a title for. See `sectionHeader`: each
          of those is a decision, not a gap. */}
      {section ? <SectionHeader title={section.title} note={section.note} /> : null}

      <div>
        {slice.map((key) => {
          const item = byId.get(key);
          if (!item) return null;
          /**
           * What a derived item is *about*, handed to the control.
           *
           * `<block>.weight` and `<block>.why` ask the same two sentences in
           * every block of every inventory, deliberately — see `core/
           * stance.ts`. On the screen that is fine, because the block's own
           * question is directly above them. To anything that reads the page
           * as a list of controls it is not: a reader tabbing or using a forms
           * rotor meets two textareas called "Why does this matter to you?"
           * with nothing to tell them apart, and the association exists only
           * as source order, which is not an association.
           *
           * So the lead question travels down as a prop and the control folds
           * it into the accessible name. It is looked up here rather than
           * baked into the prompt because the prompt is what gets *printed* on
           * the page, and printing the question twice on one screen is the
           * other way to be unreadable. `paginate` guarantees the lead item is
           * on this page; `byId` finds it wherever it is.
           */
          const subject = item.group && item.group !== item.id ? byId.get(item.group)?.prompt : undefined;
          return (
            <ItemControl
              key={item.id}
              item={item}
              value={state.answers[item.id]}
              scale={itemsForm.scale}
              subject={subject}
              copy={{ chooseUpTo: copy.chooseUpTo, chooseAny: copy.chooseAny }}
              locale={locale}
              onChange={(v) => answer(item.id, v)}
            />
          );
        })}
      </div>

      <nav className="mt-8 flex items-center justify-between gap-4 border-t border-rule pt-6">
        <Button onClick={() => goto(state.page - 1)} disabled={state.page === 0} data-testid="prev">
          {copy.back}
        </Button>
        <span className="label-caps">{format(copy.page, { page: state.page + 1, pages }, locale)}</span>
        {last ? (
          <Button variant="primary" disabled={!canFinish || saving} onClick={() => void finish()} data-testid="finish">
            {canFinish ? copy.finish : format(copy.remaining, { count: outstanding }, locale)}
          </Button>
        ) : (
          <Button variant="primary" disabled={!pageDone} onClick={() => goto(state.page + 1)} data-testid="next">
            {copy.next}
          </Button>
        )}
      </nav>
    </div>
  );
}
