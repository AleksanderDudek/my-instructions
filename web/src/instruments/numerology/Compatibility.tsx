"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Accordion } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Note } from "@/components/result/scorecard";
import { useStore } from "@/components/shell/store-provider";
import { granted } from "@/core/entitlements";
import { dateLabel, view, type Fit } from "@/core/fits";
import { cn } from "@/lib/cn";
import type { T } from "@/core/types";
import { match, profile } from "./compute";
import { ELEMENTS } from "./data";
import { validate } from "./spec";
import type { NumerologyResult } from "./spec";

/**
 * Your chart against every date you have kept.
 *
 * The arithmetic predates this screen — `match()` has been in `compute.ts`
 * since the port, reachable only through `spec.compare()`, which needed two
 * people who had each taken the instrument and swapped a link. Nobody asks
 * their grandmother to fill in a form. They know her birthday, they want to
 * look, and then they want to look again next week.
 *
 * ── What is kept, and what is not ─────────────────────────────────────
 *
 * The dates are kept; the readings are not. A stored total would go quietly
 * wrong the first time a table or a calendar boundary was corrected, and
 * nothing downstream could tell — the same argument that puts answers rather
 * than scores in a share link. See `core/fits.ts`.
 *
 * These are other people's dates of birth. They stay on this device, they are
 * in no share link and on no instruction sheet, and each one deletes on its
 * own. That is a weaker promise than the one this screen made when it kept
 * nothing at all, and the copy now says the weaker thing rather than the old
 * one — a sentence promising nothing is saved, printed above a saved list, is
 * worse than never having promised.
 *
 * ── Why it stays fast with three hundred of them ──────────────────────
 *
 * A comparison is computed for the ten rows on screen and nowhere else, so the
 * cost of a page is fixed however long the list gets. Search and sort run over
 * what the reader typed — a name and a date — so a keystroke costs a string
 * compare per record rather than a chart. A collapsed row is a heading.
 *
 * ── And the number is still not a measurement ─────────────────────────
 *
 * A total out of a hundred beside four labelled bars looks exactly like every
 * scored instrument here. Those are hedged because their evidence is thin; this
 * one has none at all.
 */

type Draft = { name: string; day: string; month: string; year: string };
const EMPTY: Draft = { name: "", day: "", month: "", year: "" };

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());

export function Compatibility({ mine, t }: { mine: NumerologyResult; t: T }) {
  const store = useStore();
  const [fits, setFits] = useState<Fit[] | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<string[]>([]);

  const reload = useCallback(async () => setFits(await store.fits()), [store]);

  useEffect(() => {
    let live = true;
    void (async () => {
      const found = await store.fits();
      if (live) setFits(found);
    })();
    return () => {
      live = false;
    };
  }, [store]);

  const paged = useMemo(() => view(fits ?? [], query, page), [fits, query, page]);

  /**
   * Ten readings, not three hundred.
   *
   * This hook is the whole performance argument: `match` runs for the rows on
   * screen and for nothing else.
   */
  const readings = useMemo(() => {
    const out = new Map<string, { theirs: ReturnType<typeof profile>; reading: ReturnType<typeof match> }>();
    for (const fit of paged.rows) {
      const theirs = profile(fit.day, fit.month, fit.year, fit.name);
      out.set(fit.id, { theirs, reading: match(mine, theirs, t) });
    }
    return out;
  }, [paged.rows, mine, t]);

  if (!granted("numerology.compatibility")) return null;

  const submit = async () => {
    const answers = { day: Number(draft.day), month: Number(draft.month), year: Number(draft.year) };
    // The instrument's own validator, not a second copy of it. Whether 31
    // September exists is its business; a date this screen accepted and the
    // form rejected would be two instruments wearing one name.
    const found = validate(answers, t);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setErrors({});

    const now = new Date().toISOString();
    const existing = editing ? (fits ?? []).find((f) => f.id === editing) : undefined;
    await store.saveFit({
      id: existing?.id ?? newId(),
      name: draft.name.trim(),
      ...answers,
      // An edit keeps its original creation time, so correcting a typo does not
      // jump the row to the top of a list the reader has ordered in their head.
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
    await reload();
    setDraft(EMPTY);
    setEditing(null);
    // Searching for something else and then adding a date would otherwise file
    // it into a list it does not match, and it would look as though nothing
    // had been saved.
    setQuery("");
    setPage(0);
  };

  const startEdit = (fit: Fit) => {
    setEditing(fit.id);
    setDraft({ name: fit.name, day: String(fit.day), month: String(fit.month), year: String(fit.year) });
    setErrors({});
    document.getElementById("fit-day")?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const remove = async (fit: Fit) => {
    await store.deleteFit(fit.id);
    if (editing === fit.id) {
      setEditing(null);
      setDraft(EMPTY);
    }
    await reload();
  };

  if (!fits) return null;

  return (
    <section className="mt-10 border-t border-rule pt-8" data-compatibility>
      <span className="label-caps mb-2 block">{t("fit.eyebrow")}</span>
      <h3 className="mb-3 text-2xl">{t("fit.heading")}</h3>
      <p className="mb-6 max-w-[62ch] leading-relaxed text-muted">{t("fit.lead")}</p>

      <div className="mb-3 grid gap-3 sm:grid-cols-4">
        <Field
          id="fit-name"
          label={t("fit.name")}
          value={draft.name}
          onChange={(v) => setDraft({ ...draft, name: v })}
        />
        <Field
          id="fit-day"
          label={t("form.day")}
          value={draft.day}
          numeric
          error={errors.day}
          onChange={(v) => setDraft({ ...draft, day: v })}
        />
        <Field
          id="fit-month"
          label={t("form.month")}
          value={draft.month}
          numeric
          error={errors.month}
          onChange={(v) => setDraft({ ...draft, month: v })}
        />
        <Field
          id="fit-year"
          label={t("form.year")}
          value={draft.year}
          numeric
          error={errors.year}
          onChange={(v) => setDraft({ ...draft, year: v })}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => void submit()} data-testid="fit-save">
          {editing ? t("fit.saveEdit") : t("fit.check")}
        </Button>
        {editing ? (
          <Button
            onClick={() => {
              setEditing(null);
              setDraft(EMPTY);
              setErrors({});
            }}
            data-testid="fit-cancel"
          >
            {t("fit.cancelEdit")}
          </Button>
        ) : null}
      </div>

      <Note tone="warn">{t("fit.privacy")}</Note>

      {fits.length ? (
        <>
          <div className="mt-8 mb-4 flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-56 flex-1">
              <label htmlFor="fit-search" className="label-caps mb-2 block">
                {t("fit.search")}
              </label>
              <input
                id="fit-search"
                type="search"
                value={query}
                autoComplete="off"
                placeholder={t("fit.searchPlaceholder")}
                onChange={(e) => {
                  setQuery(e.target.value);
                  // A new list is a new first page. Staying on page four of a
                  // list that now has one is how a search appears to find
                  // nothing when it found something.
                  setPage(0);
                }}
                className="w-full rounded-sm border border-rule bg-panel-2 px-4 py-3 text-ink"
              />
            </div>
            <p className="num text-sm text-muted" role="status" aria-live="polite" data-testid="fit-count">
              {t("fit.count", { shown: paged.rows.length, total: paged.total })}
            </p>
          </div>

          {paged.rows.length === 0 ? (
            <p className="py-8 text-muted" data-testid="fit-none">
              {t("fit.noMatches")}
            </p>
          ) : (
            <Accordion.Root type="multiple" value={open} onValueChange={setOpen} className="flex flex-col gap-2">
              {paged.rows.map((fit) => {
                const computed = readings.get(fit.id);
                if (!computed) return null;
                const { theirs, reading } = computed;
                return (
                  <Accordion.Item
                    key={fit.id}
                    value={fit.id}
                    data-fit={fit.id}
                    className="rounded-sm border border-rule bg-panel-2"
                  >
                    <Accordion.Header>
                      <Accordion.Trigger className="group flex w-full items-center gap-4 px-5 py-4 text-left">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{fit.name || dateLabel(fit)}</span>
                          <span className="num block text-sm text-muted">{dateLabel(fit)}</span>
                        </span>
                        <span className="num shrink-0 text-lg text-brass">
                          {reading.total}
                          <span className="ml-1 text-xs text-muted">/ 100</span>
                        </span>
                        {/* Decorative: the primitive announces expanded state
                            through its own ARIA, so a second cue would be read
                            out twice. */}
                        <span
                          aria-hidden
                          className="shrink-0 text-muted transition-transform group-data-[state=open]:rotate-180"
                        >
                          ▾
                        </span>
                      </Accordion.Trigger>
                    </Accordion.Header>

                    <Accordion.Content className="border-t border-rule px-5 pb-5">
                      <p className="mt-4 mb-2 text-sm text-muted">{reading.band}</p>
                      <SideBySide mine={mine} theirs={theirs} label={fit.name || dateLabel(fit)} t={t} />

                      <div className="my-6 flex flex-col gap-4">
                        {reading.parts.map((part) => (
                          <div key={part.t}>
                            <div className="mb-2 flex items-baseline justify-between gap-4">
                              <span className="text-[0.95rem] text-ink/80">{part.t}</span>
                              <span className="num text-sm text-muted">
                                {part.v} <span className="text-faint">/ {part.max}</span>
                              </span>
                            </div>
                            <span className="block h-[3px] w-full bg-rule" aria-hidden>
                              <i
                                className="block h-full bg-brass"
                                style={{ width: `${Math.round((part.v / part.max) * 100)}%` }}
                              />
                            </span>
                            <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-muted">{part.note}</p>
                          </div>
                        ))}
                      </div>

                      <p className="mb-4 max-w-[62ch] text-sm leading-relaxed text-muted">
                        {t("fit.union", { n: reading.unionNum })}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <Button onClick={() => startEdit(fit)}>{t("fit.edit")}</Button>
                        <Button onClick={() => void remove(fit)}>{t("fit.forget")}</Button>
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                );
              })}
            </Accordion.Root>
          )}

          {paged.pages > 1 ? (
            <nav className="mt-6 flex items-center justify-between gap-4 border-t border-rule pt-5">
              <Button disabled={paged.page === 0} onClick={() => setPage(paged.page - 1)} data-testid="fit-prev">
                {t("fit.prev")}
              </Button>
              <span className="label-caps">{t("fit.page", { page: paged.page + 1, pages: paged.pages })}</span>
              <Button
                disabled={paged.page >= paged.pages - 1}
                onClick={() => setPage(paged.page + 1)}
                data-testid="fit-next"
              >
                {t("fit.next")}
              </Button>
            </nav>
          ) : null}

          <Note>{t("fit.caveat")}</Note>
        </>
      ) : null}
    </section>
  );
}

/** One row per thing the traditions name, the two charts in two columns. */
function SideBySide({
  mine,
  theirs,
  label,
  t,
}: {
  mine: NumerologyResult;
  theirs: ReturnType<typeof profile>;
  label: string;
  t: T;
}) {
  const lit = (chart: { counts: Record<number, number> }) =>
    [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => chart.counts[n] > 0);

  const rows: [string, string, string][] = [
    [
      t("identity.destiny"),
      `${mine.destiny.value} — ${t(`num.${mine.destiny.value}.name`)}`,
      `${theirs.destiny.value} — ${t(`num.${theirs.destiny.value}.name`)}`,
    ],
    [
      t("identity.lunarYear"),
      `${t(`element.${ELEMENTS[mine.elementIdx]}`)} ${t(`animal.${mine.animalIdx}.name`)} · ${t(`polarity.${mine.polarity}`)}`,
      `${t(`element.${ELEMENTS[theirs.elementIdx]}`)} ${t(`animal.${theirs.animalIdx}.name`)} · ${t(`polarity.${theirs.polarity}`)}`,
    ],
    [
      t("fit.row.sign"),
      `${t(`sign.${mine.sign}.name`)} · ${t(`element.${mine.signElement}`)}`,
      `${t(`sign.${theirs.sign}.name`)} · ${t(`element.${theirs.signElement}`)}`,
    ],
    [t("fit.row.squares"), lit(mine).join(" "), lit(theirs).join(" ")],
  ];

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[0.95rem]">
        <thead>
          <tr className="border-b border-rule">
            <th scope="col" className="label-caps py-2 pr-4 font-normal" />
            <th scope="col" className="label-caps py-2 pr-4 font-normal">
              {t("fit.you")}
            </th>
            <th scope="col" className="label-caps py-2 font-normal">
              {label}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, a, b]) => (
            <tr key={name} className="border-b border-rule/50">
              <th scope="row" className="py-3 pr-4 font-normal text-muted">
                {name}
              </th>
              <td className="py-3 pr-4 text-ink/90">{a}</td>
              <td className="py-3 text-ink/90">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  numeric = false,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  numeric?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="label-caps mb-2 block">
        {label}
      </label>
      <input
        id={id}
        value={value}
        inputMode={numeric ? "numeric" : undefined}
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn("w-full rounded-sm border bg-panel-2 px-4 py-3 text-ink", error ? "border-madder" : "border-rule")}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-madder">
          {error}
        </p>
      ) : null}
    </div>
  );
}
