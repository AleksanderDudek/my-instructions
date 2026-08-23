/**
 * Result widgets shared by every scored instrument.
 *
 * These live in the UI layer and are imported *by* instruments, which inverts
 * the usual dependency direction on purpose: the alternative is each test
 * drawing its own bars, and five hand-drawn bar charts is how a product starts
 * looking like five products.
 *
 * Server components, all of them. Nothing here holds state or listens for
 * anything, so a result page renders on the server and ships no JavaScript for
 * the parts that only need to be read.
 */
import { band } from "@/core/scoring";
import type { T } from "@/core/types";
import { cn } from "@/lib/cn";

export type BarRow = { key: string; label: string; score: number; share?: number; blurb?: string };

/** A ranked column of 1..100 bars. */
export function Bars({ rows, showShare = false }: { rows: BarRow[]; showShare?: boolean }) {
  const top = Math.max(...rows.map((r) => r.score), 1);
  return (
    <div className="my-8 flex flex-col gap-5">
      {rows.map((r) => {
        const lead = r.score === top;
        return (
          <div key={r.key} data-bar={r.key}>
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <span className={cn("text-[0.95rem]", lead ? "text-ink" : "text-ink/75")}>{r.label}</span>
              <span className="num text-sm text-muted">
                <span className={lead ? "text-brass" : undefined}>{r.score}</span>
                {showShare && r.share != null ? <span className="ml-2 text-faint">{r.share}%</span> : null}
              </span>
            </div>
            {/* The bar is decoration for a number that is already written above
                it, so it is hidden from assistive technology rather than given
                a redundant label. */}
            <span className="block h-[3px] w-full bg-rule" aria-hidden>
              <i
                className={cn("block h-full", lead ? "bg-brass" : "bg-muted")}
                style={{ width: `${r.score}%` }}
              />
            </span>
            {r.blurb ? <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-muted">{r.blurb}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

/**
 * The headline: one dominant scale, named and explained.
 *
 * `t` is needed only for the verbal band beside the score, so it is optional —
 * a caller with no score to show does not have to supply one.
 */
export function Verdict({
  eyebrow,
  title,
  score,
  body,
  t,
}: {
  eyebrow: string;
  title: string;
  score?: number | null;
  body: string;
  t?: T;
}) {
  return (
    <div className="mb-8 border-l-2 border-brass pl-6">
      <span className="label-caps mb-2 block">{eyebrow}</span>
      <h3 className="mb-2 text-2xl">{title}</h3>
      {score != null ? (
        <p className="num mb-3 text-3xl text-brass">
          {score}
          <span className="ml-2 text-sm text-muted">/ 100 · {(t ?? ((k: string) => k))(band(score))}</span>
        </p>
      ) : null}
      <p className="max-w-[62ch] leading-relaxed text-ink/90">{body}</p>
    </div>
  );
}

/** A small labelled grid — centres, wings, triads, anything with 2–4 entries. */
export function Facts({ pairs }: { pairs: [string, string][] }) {
  return (
    <dl className="my-8 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
      {pairs.map(([k, v]) => (
        <div key={k} className="bg-panel p-4">
          <dt className="label-caps mb-1">{k}</dt>
          <dd className="text-[0.95rem] text-ink/90">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** An aside the reader should notice but not obey. */
export function Note({ children, tone = "plain" }: { children: React.ReactNode; tone?: "plain" | "warn" }) {
  return (
    <div
      className={cn(
        "my-6 border-l-2 pl-5 text-[0.95rem] leading-relaxed",
        tone === "warn" ? "border-madder text-ink/90" : "border-rule text-muted",
      )}
    >
      {children}
    </div>
  );
}
