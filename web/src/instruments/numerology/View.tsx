import { digits, sumd } from "./compute";
import { ANIMALS, ELEMENTS, WEST } from "./data";
import type { T } from "@/core/types";
import type { NumerologyResult } from "./spec";

/**
 * The chart, drawn.
 *
 * The vanilla version built HTML strings and injected them. Here the same
 * geometry is JSX: the pyramid is computed from two coordinate tables rather
 * than hand-authored path data, so moving a row means changing one number
 * instead of editing thirty attributes.
 *
 * Everything a reader sees comes from the message table, so this file contains
 * no prose — which is also why it needs no escaping. React escapes what it
 * renders, and there is no `dangerouslySetInnerHTML` anywhere in it.
 */

const X = { l: 200, c: 380, r: 560, ml: 290, mr: 470 };
const Y = { crown: 50, spire: 145, rise: 240, core: 335, root: 430, base: 520 };

const NODE_FILL: Record<string, string> = {
  axis: "var(--color-brass)",
  sum: "var(--color-verdigris)",
  diff: "var(--color-madder)",
  core: "var(--color-muted)",
};

const dateOf = (p: NumerologyResult) => new Date(p.y, p.m - 1, p.d);
const longDate = (p: NumerologyResult, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(dateOf(p));
const weekdayOf = (p: NumerologyResult, locale: string) =>
  new Intl.DateTimeFormat(locale, { weekday: "long" }).format(dateOf(p));
const dayMonth = (m: number, d: number, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(new Date(2001, m - 1, d));

function Node({ x, y, value, kind, cap, tip }: { x: number; y: number; value: number; kind: string; cap: string; tip: string }) {
  return (
    <g>
      <title>{tip}</title>
      <circle cx={x} cy={y} r={30} fill="none" stroke={NODE_FILL[kind]} strokeWidth={1.5} />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-mono)"
        fontSize={22}
        fill={value === 0 ? "var(--color-faint)" : "var(--color-ink)"}
      >
        {value}
      </text>
      <text x={x} y={y + 47} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} letterSpacing="0.12em" fill="var(--color-muted)">
        {cap.toUpperCase()}
      </text>
    </g>
  );
}

const Edge = ({ x1, y1, x2, y2, kind }: { x1: number; y1: number; x2: number; y2: number; kind: string }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={NODE_FILL[kind]} strokeWidth={1} opacity={0.4} />
);

function Pyramid({ p, t, locale }: { p: NumerologyResult; t: T; locale: string }) {
  const rows: [number, string][] = [
    [Y.crown, "pyramid.row.crown"], [Y.spire, "pyramid.row.spire"], [Y.rise, "pyramid.row.rise"],
    [Y.core, "pyramid.row.core"], [Y.root, "pyramid.row.root"], [Y.base, "pyramid.row.base"],
  ];
  const rising: [number, number, number, number][] = [
    [X.l, Y.core, X.ml, Y.rise], [X.c, Y.core, X.ml, Y.rise], [X.c, Y.core, X.mr, Y.rise],
    [X.r, Y.core, X.mr, Y.rise], [X.ml, Y.rise, X.c, Y.spire], [X.mr, Y.rise, X.c, Y.spire],
  ];
  const falling: [number, number, number, number][] = [
    [X.l, Y.core, X.ml, Y.root], [X.c, Y.core, X.ml, Y.root], [X.c, Y.core, X.mr, Y.root],
    [X.r, Y.core, X.mr, Y.root], [X.ml, Y.root, X.c, Y.base], [X.mr, Y.root, X.c, Y.base],
  ];

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 900 585"
        role="img"
        className="w-full min-w-[560px]"
        aria-label={t("pyramid.alt", { date: longDate(p, locale), a: p.A, b: p.B, c: p.C, crown: p.crown, base: p.base })}
      >
        {rows.map(([y, key]) => (
          <text key={key} x={14} y={y + 4} fontFamily="var(--font-mono)" fontSize={9} letterSpacing="0.12em" fill="var(--color-faint)">
            {t(key).toUpperCase()}
          </text>
        ))}
        {rising.map((e, i) => <Edge key={`r${i}`} x1={e[0]} y1={e[1]} x2={e[2]} y2={e[3]} kind="sum" />)}
        {falling.map((e, i) => <Edge key={`f${i}`} x1={e[0]} y1={e[1]} x2={e[2]} y2={e[3]} kind="diff" />)}
        <path d={`M ${X.l} ${Y.core} Q 90 170 ${X.c} ${Y.crown}`} fill="none" stroke="var(--color-brass)" opacity={0.4} />
        <path d={`M ${X.r} ${Y.core} Q 660 170 ${X.c} ${Y.crown}`} fill="none" stroke="var(--color-brass)" opacity={0.4} />

        <rect x={658} y={298} width={222} height={74} rx={3} fill="none" stroke="var(--color-rule)" />
        <text x={678} y={322} fontFamily="var(--font-mono)" fontSize={9} letterSpacing="0.12em" fill="var(--color-muted)">
          {t("pyramid.allDigits", { total: p.total }).toUpperCase()}
        </text>
        <text x={678} y={357} fontFamily="var(--font-mono)" fontSize={24} fill="var(--color-brass)">
          {p.destiny.value}
          {p.destiny.value > 9 ? <tspan dx={10} fontSize={9} fill="var(--color-muted)">{t("pyramid.master")}</tspan> : null}
        </text>

        <Node x={X.c} y={Y.crown} value={p.crown} kind="axis" cap={t("pyramid.cap.crown")}
          tip={t("pyramid.tip.crown", { a: p.A, c: p.C, sum: p.A + p.C, out: p.crown })} />
        <Node x={X.c} y={Y.spire} value={p.spire} kind="sum" cap={t("pyramid.cap.sum")}
          tip={t("pyramid.tip.plain", { x: p.rise1, y: p.rise2, sum: p.rise1 + p.rise2, out: p.spire })} />
        <Node x={X.ml} y={Y.rise} value={p.rise1} kind="sum" cap={t("pyramid.cap.md")}
          tip={t("pyramid.tip.monthDay", { a: p.A, b: p.B, sum: p.A + p.B, out: p.rise1 })} />
        <Node x={X.mr} y={Y.rise} value={p.rise2} kind="sum" cap={t("pyramid.cap.dy")}
          tip={t("pyramid.tip.dayYear", { b: p.B, c: p.C, sum: p.B + p.C, out: p.rise2 })} />
        <Node x={X.l} y={Y.core} value={p.A} kind="core" cap={t("pyramid.cap.month")}
          tip={t("pyramid.tip.digits", { field: "MM", value: p.MM, sum: digits(p.MM).join(" + "), total: sumd(p.MM), out: p.A })} />
        <Node x={X.c} y={Y.core} value={p.B} kind="core" cap={t("pyramid.cap.day")}
          tip={t("pyramid.tip.digits", { field: "DD", value: p.DD, sum: digits(p.DD).join(" + "), total: sumd(p.DD), out: p.B })} />
        <Node x={X.r} y={Y.core} value={p.C} kind="core" cap={t("pyramid.cap.year")}
          tip={t("pyramid.tip.digits", { field: "YYYY", value: p.YYYY, sum: digits(p.YYYY).join(" + "), total: sumd(p.YYYY), out: p.C })} />
        <Node x={X.ml} y={Y.root} value={p.root1} kind="diff" cap={t("pyramid.cap.mdDiff")}
          tip={t("pyramid.tip.diff", { x: p.A, y: p.B, abs: Math.abs(p.A - p.B), out: p.root1 })} />
        <Node x={X.mr} y={Y.root} value={p.root2} kind="diff" cap={t("pyramid.cap.dyDiff")}
          tip={t("pyramid.tip.diff", { x: p.B, y: p.C, abs: Math.abs(p.B - p.C), out: p.root2 })} />
        <Node x={X.c} y={Y.base} value={p.base} kind="diff" cap={t("pyramid.cap.diff")}
          tip={t("pyramid.tip.diff", { x: p.root1, y: p.root2, abs: Math.abs(p.root1 - p.root2), out: p.base })} />
      </svg>
      <div className="mt-3 flex flex-wrap gap-5">
        {([["sum", "pyramid.legend.rising"], ["diff", "pyramid.legend.falling"], ["axis", "pyramid.legend.axis"]] as const).map(
          ([kind, key]) => (
            <span key={kind} className="label-caps flex items-center gap-2">
              <i className="block h-px w-5" style={{ background: NODE_FILL[kind] }} aria-hidden />
              {t(key)}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

/* ══ square of nine ═══════════════════════════════════════════════ */

const SQUARE = [[3, 6, 9], [2, 4, 8], [1, 5, 7]];
const LINES: [string, number[]][] = [
  ["square.line.topRow", [3, 6, 9]], ["square.line.middleRow", [2, 4, 8]], ["square.line.bottomRow", [1, 5, 7]],
  ["square.line.leftColumn", [3, 2, 1]], ["square.line.centreColumn", [6, 4, 5]], ["square.line.rightColumn", [9, 8, 7]],
  ["square.line.diagonalDown", [3, 4, 7]], ["square.line.diagonalUp", [9, 4, 1]],
];

const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function Square({ p, t }: { p: NumerologyResult; t: T }) {
  const present = ALL.filter((n) => p.counts[n] > 0);
  const missing = ALL.filter((n) => p.counts[n] === 0);
  const max = Math.max(...Object.values(p.counts));
  const strongest = present.filter((n) => p.counts[n] === max);
  const lines = LINES.filter(([, set]) => set.every((n) => p.counts[n] > 0)).map(([key]) => t(key));

  return (
    <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
      <div className="grid w-fit grid-cols-3 gap-px bg-rule">
        {SQUARE.flat().map((n) => (
          <div key={n} className="flex size-20 flex-col items-center justify-center gap-1 bg-panel-2">
            <span className={`num text-lg ${p.counts[n] ? "text-ink" : "text-faint"}`}>{n}</span>
            {p.counts[n] ? <span className="num text-[0.65rem] text-brass">{p.counts[n]}×</span> : null}
          </div>
        ))}
      </div>
      <dl className="grid content-start gap-3 text-[0.92rem]">
        {(
          [
            [t("square.digitsRead"), digits(p.DD + p.MM + p.YYYY).join(" · ")],
            [t("square.present"), present.map((n) => `${n}×${p.counts[n]}`).join("  ") || "—"],
            [t("square.absent"), missing.join("  ") || t("square.noneAbsent")],
            [t("square.heaviest"), strongest.map((n) => `${n} — ${t(`num.${n}.name`)}`).join(", ")],
            [t("square.fullLines"), lines.length ? lines.join(", ") : t("square.noLines")],
          ] as [string, string][]
        ).map(([k, v]) => (
          <div key={k}>
            <dt className="label-caps">{k}</dt>
            <dd className="text-ink/90">{v}</dd>
          </div>
        ))}
        <p className="mt-2 max-w-[54ch] text-sm text-muted">{t("square.note")}</p>
      </dl>
    </div>
  );
}

/* ══ identity strip ═══════════════════════════════════════════════ */

function Identity({ p, t, locale }: { p: NumerologyResult; t: T; locale: string }) {
  const pretty = longDate(p, locale);
  const cells: { label?: string; glyph?: string; big: string; sub: React.ReactNode }[] = [
    {
      label: t(p.name ? "identity.whose" : "identity.theDate"),
      big: p.name || pretty,
      sub: (
        <>
          {p.name ? `${pretty} · ` : ""}
          {weekdayOf(p, locale)} · {t("identity.written")}{" "}
          <span className="num">{`${p.DD}·${p.MM}·${p.YYYY}`}</span>
        </>
      ),
    },
    {
      glyph: ANIMALS[p.animalIdx][1],
      big: `${t(`element.${ELEMENTS[p.elementIdx]}`)} ${t(`animal.${p.animalIdx}.name`)}`,
      sub: (
        <>
          {t(`polarity.${p.polarity}`)} ·{" "}
          {t("identity.lunarYear", { year: p.zodiacYear, opened: dayMonth(p.cny.m, p.cny.d, locale) })}
          {p.cnyExact ? "" : <span className="text-madder"> ({t("identity.estimated")})</span>} {t(`animal.${p.animalIdx}.blurb`)}
        </>
      ),
    },
    {
      glyph: WEST[p.sign][0],
      big: t(`sign.${p.sign}.name`),
      sub: (
        <>
          {t("identity.signElement", { element: t(`element.${p.signElement}`) })} {t(`sign.${p.sign}.blurb`)}
        </>
      ),
    },
    {
      label: t("identity.destiny"),
      big: `${p.destiny.value}`,
      sub: (
        <>
          <strong className="font-normal text-ink">{t(`num.${p.destiny.value}.name`)}.</strong>{" "}
          {t(`num.${p.destiny.value}.blurb`)}
        </>
      ),
    },
  ];

  return (
    <div className="mb-8 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
      {cells.map((cell, i) => (
        <div key={i} className="flex flex-col gap-1 bg-panel p-5">
          {cell.label ? <span className="label-caps">{cell.label}</span> : null}
          <span className="font-display text-lg">
            {cell.glyph ? <span aria-hidden>{cell.glyph} </span> : null}
            {cell.big}
          </span>
          <span className="text-sm leading-relaxed text-muted">{cell.sub}</span>
        </div>
      ))}
    </div>
  );
}

/* ══ the nine ═════════════════════════════════════════════════════ */

function Meanings({ p, t }: { p: NumerologyResult; t: T }) {
  const set = new Set(p.chartNums);
  return (
    <>
      <div className="grid gap-2 sm:grid-cols-3">
        {ALL.map((n) => (
          <div
            key={n}
            className={`flex gap-3 rounded-sm border p-4 ${set.has(n) ? "border-brass/40 bg-panel-2" : "border-rule opacity-55"}`}
          >
            <span className="num text-xl text-brass">{n}</span>
            <div>
              <h4 className="mb-1 text-base">{t(`num.${n}.name`)}</h4>
              <p className="text-sm leading-relaxed text-muted">{t(`num.${n}.blurb`)}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 max-w-[62ch] text-sm text-muted">
        {t("meanings.note")}
        {p.destiny.value > 9
          ? t("meanings.plusMaster", { number: p.destiny.value, name: t(`num.${p.destiny.value}.name`) })
          : ""}
      </p>
    </>
  );
}

export function View({ result, t, locale = "en" }: { result: NumerologyResult; t: T; locale?: string }) {
  return (
    <>
      <Identity p={result} t={t} locale={locale} />

      <section className="mt-10">
        <h4 className="mb-4 text-lg">
          {t("view.pyramidHeading")} <span className="label-caps ml-2">{t("view.pyramidNote")}</span>
        </h4>
        <div className="rounded-sm border border-rule bg-panel-2 p-5">
          <Pyramid p={result} t={t} locale={locale} />
        </div>
      </section>

      <section className="mt-10">
        <h4 className="mb-4 text-lg">
          {t("view.squareHeading")} <span className="label-caps ml-2">{t("view.squareNote")}</span>
        </h4>
        <div className="rounded-sm border border-rule bg-panel-2 p-5">
          <Square p={result} t={t} />
        </div>
      </section>

      <section className="mt-10">
        <h4 className="mb-4 text-lg">
          {t("view.meaningsHeading")} <span className="label-caps ml-2">1 – 9</span>
        </h4>
        <Meanings p={result} t={t} />
      </section>

      {result.outOfRange ? (
        <div className="mt-8 border-l-2 border-madder pl-5 text-[0.95rem] text-ink/90">{t("view.outOfRange")}</div>
      ) : null}
    </>
  );
}
