"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Answers, Form, InstrumentSpec, ItemsForm, Locale } from "@/core/types";
import { loadInstrumentModule } from "@/instruments/lazy";
import { ItemControl, FieldControl, type ItemValue } from "@/components/form/item-controls";
import { Button } from "@/components/ui/button";
import { useStore } from "@/components/shell/store-provider";
import { format } from "@/core/i18n";

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
 * Three of these interpolate values the server does not know — how many items
 * the reader has answered, which page they are on — and a function cannot
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
}: {
  id: string;
  locale: Locale;
  form: Form;
  meta: Pick<InstrumentSpec, "version" | "persistence" | "pairwise">;
  copy: RunnerCopy;
  pairwise: boolean;
}) {
  const store = useStore();
  const router = useRouter();
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
      let order = draft?.order?.length ? draft.order.filter((x) => byId.has(x)) : form.shuffle ? shuffled(ids, seed) : ids;
      // An item added in a later version joins the end rather than reshuffling
      // a draft somebody is halfway through.
      for (const key of ids) if (!order.includes(key)) order = [...order, key];

      const answers = { ...(draft?.answers ?? (existing?.instrumentVersion === meta.version ? existing.answers : {})) };
      const pages = Math.max(1, Math.ceil(order.length / pageSize));
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

  const answer = useCallback(
    (itemId: string, value: ItemValue) => {
      setState((prev) => {
        if (!prev) return prev;
        const next = { ...prev, answers: { ...prev.answers, [itemId]: value } };
        persist(next);
        return next;
      });
    },
    [persist],
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
      const found = instrument?.spec.validate?.(values, (k) => k) ?? {};
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
  const pages = Math.max(1, Math.ceil(state.order.length / pageSize));
  const slice = state.order.slice(state.page * pageSize, (state.page + 1) * pageSize);
  const answered = state.order.filter((k) => state.answers[k] !== undefined).length;
  const last = state.page === pages - 1;
  // An optional form never blocks. Requiring an answer is right for a scored
  // scale, where a gap is a hole in the arithmetic, and wrong for anything
  // asking about a marriage or a body — where "I would rather not" is a real
  // answer and forcing one produces a false one.
  const pageDone = optional || slice.every((k) => state.answers[k] !== undefined);
  const canFinish = optional || answered === state.order.length;

  const goto = (page: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, page };
      persist(next);
      return next;
    });
    // Move the reader to the top of the new page without stealing focus from
    // wherever the keyboard is.
    document.getElementById("runner-page")?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const finish = async () => {
    setSaving(true);
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

      <div>
        {slice.map((key) => {
          const item = byId.get(key);
          if (!item) return null;
          return (
            <ItemControl
              key={item.id}
              item={item}
              value={state.answers[item.id]}
              scale={itemsForm.scale}
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
            {canFinish ? copy.finish : format(copy.remaining, { count: state.order.length - answered }, locale)}
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
