"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Note } from "@/components/result/scorecard";
import { granted } from "@/core/entitlements";
import type { T } from "@/core/types";
import { match, profile } from "./compute";
import { validate } from "./spec";
import type { NumerologyResult } from "./spec";

/**
 * Your chart against any date, as many times as you like.
 *
 * The arithmetic for this already existed — `match()` has been in `compute.ts`
 * since the port, reachable only through `spec.compare()`, which needs two
 * people who have each taken the instrument and exchanged a link. That is the
 * wrong shape for what this is actually used for. Nobody asks their
 * grandmother to fill in a form; they know her birthday and they want to look.
 *
 * So this takes one saved chart — the reader's own — and computes the other
 * side from a date typed in. No second run, no second person, no link.
 *
 * ── Nothing typed here is written down ────────────────────────────────
 *
 * A date entered here is somebody else's date of birth, and that person is not
 * present, has not agreed to anything, and in most cases will never know this
 * happened. It is the only place in the app where a reader can enter data about
 * a third party, so it is the one place that has to be strictest about it.
 *
 * Everything below lives in React state and nowhere else. It is not in the
 * store, so it is not in an export, not in a share token, not on the printed
 * sheet, and not there after a reload. The rule the codebase already lives by
 * for session-only runs — the guarantee is that there is no key to find, rather
 * than a filter that remembers to run — applies here for a stronger reason:
 * that data was never the reader's to keep.
 *
 * ── And the number is not a measurement ───────────────────────────────
 *
 * A total out of a hundred, beside four labelled bars, looks exactly like every
 * scored instrument in this app. Those are hedged because their evidence is
 * thin. This one has none at all: it is traditional correspondence tables,
 * computed exactly as the traditions specify, and the instrument's own
 * `sourceNote` says it is here for the vocabulary rather than the prediction.
 * The copy under the total says so again, because this is the screen where
 * somebody is most likely to forget it.
 */
export function Compatibility({ mine, t }: { mine: NumerologyResult; t: T }) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<
    { key: string; label: string; reading: ReturnType<typeof match> }[]
  >([]);

  if (!granted("numerology.compatibility")) return null;

  const check = () => {
    const answers = { day: Number(day), month: Number(month), year: Number(year) };
    const found = validate(answers, t);
    // The instrument's own validator, not a second copy of it. A date this
    // screen accepted and the form rejected would be two different instruments
    // wearing one name.
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setErrors({});

    const theirs = profile(answers.day, answers.month, answers.year, name.trim());
    setChecked((prev) => [
      {
        key: `${answers.year}-${answers.month}-${answers.day}-${prev.length}`,
        label: name.trim() || `${day}.${month}.${year}`,
        reading: match(mine, theirs, t),
      },
      ...prev,
    ]);
    setName("");
  };

  return (
    <section className="mt-10 border-t border-rule pt-8" data-compatibility>
      <span className="label-caps mb-2 block">{t("fit.eyebrow")}</span>
      <h3 className="mb-3 text-2xl">{t("fit.heading")}</h3>
      <p className="mb-6 max-w-[62ch] leading-relaxed text-muted">{t("fit.lead")}</p>

      <div className="mb-3 grid gap-3 sm:grid-cols-4">
        <Field id="fit-name" label={t("fit.name")} value={name} onChange={setName} />
        <Field id="fit-day" label={t("form.day")} value={day} onChange={setDay} numeric error={errors.day} />
        <Field id="fit-month" label={t("form.month")} value={month} onChange={setMonth} numeric error={errors.month} />
        <Field id="fit-year" label={t("form.year")} value={year} onChange={setYear} numeric error={errors.year} />
      </div>

      <Button variant="primary" onClick={check} data-testid="fit-check">
        {t("fit.check")}
      </Button>

      <Note tone="warn">{t("fit.privacy")}</Note>

      {checked.map(({ key, label, reading }) => (
        <article key={key} className="mt-8 rounded-sm border border-rule bg-panel-2 p-6">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <h4 className="text-xl">{t("fit.against", { name: label })}</h4>
            <p className="num text-2xl text-brass">
              {reading.total}
              <span className="ml-2 text-sm text-muted">/ 100 · {reading.band}</span>
            </p>
          </div>

          <div className="my-6 flex flex-col gap-4">
            {reading.parts.map((part) => (
              <div key={part.t}>
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <span className="text-[0.95rem] text-ink/80">{part.t}</span>
                  <span className="num text-sm text-muted">
                    {part.v} <span className="text-faint">/ {part.max}</span>
                  </span>
                </div>
                {/* Decoration for a number already written beside it. */}
                <span className="block h-[3px] w-full bg-rule" aria-hidden>
                  <i className="block h-full bg-brass" style={{ width: `${Math.round((part.v / part.max) * 100)}%` }} />
                </span>
                <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-muted">{part.note}</p>
              </div>
            ))}
          </div>

          <p className="max-w-[62ch] text-sm leading-relaxed text-muted">
            {t("fit.union", { n: reading.unionNum })}
          </p>

          <button
            type="button"
            onClick={() => setChecked((prev) => prev.filter((row) => row.key !== key))}
            className="label-caps mt-4 hover:text-ink"
          >
            {t("fit.forget")}
          </button>
        </article>
      ))}

      {checked.length ? <Note>{t("fit.caveat")}</Note> : null}
    </section>
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
        className={`w-full rounded-sm border bg-panel-2 px-4 py-3 text-ink ${error ? "border-madder" : "border-rule"}`}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-madder">
          {error}
        </p>
      ) : null}
    </div>
  );
}
