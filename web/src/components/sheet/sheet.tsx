"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/cn";
import { createI18n, type Messages } from "@/core/i18n";
import { CHANNELS } from "@/core/types";
import type { Channel, Locale, Run } from "@/core/types";
import { loadInstrumentModule } from "@/instruments/lazy";
import type { InstrumentModule } from "@/core/registry";
import { useStore } from "@/components/shell/store-provider";
import { resolvePlaybook, isEmptyPlaybook, type ResolvedPlaybook } from "@/core/playbook";
import { Plate, PlateHead } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

/**
 * The instruction sheet — the thing the whole app is for.
 *
 * Every instrument contributes cards tagged with a channel, and this page is
 * nothing but a regroup of those cards by channel rather than by test. That
 * inversion is the product: nobody wants to read four test results, they want
 * to know how to talk to you.
 *
 * It loads only the instruments the reader has actually completed. On a
 * catalogue of sixteen that is the difference between a page that ships every
 * instrument's code and one that ships the three somebody took.
 *
 * Some cards are not ours. A card with `lines` is the reader's own playbook —
 * sentences they ticked and sentences they wrote — and it is the only content
 * on the sheet that was not generated from a result. It is filed under the
 * first channel the instrument declares rather than under a channel of its own,
 * because the sheet's organising promise is that everything about talking to
 * somebody is in one place; a seventh section called "their notes" would put
 * the most actionable lines on the page furthest from the ones they answer.
 */
type Card = {
  channel: Channel;
  title: string;
  body: string;
  from: string;
  id: string;
  lines?: ResolvedPlaybook;
};

export function Sheet({
  locale,
  messages,
  fallbackMessages,
  copy,
}: {
  locale: Locale;
  messages: Messages;
  fallbackMessages: Messages;
  copy: Record<string, string>;
}) {
  const store = useStore();
  const [state, setState] = useState<{ cards: Card[]; runs: Run[]; name: string; note: string } | null>(null);

  const i18n = useMemo(() => createI18n({ locale, messages, fallbackMessages }), [locale, messages, fallbackMessages]);

  useEffect(() => {
    let live = true;
    (async () => {
      const [runs, profile] = await Promise.all([store.runs(), store.profile()]);
      const [loaded, practices] = await Promise.all([
        Promise.all(runs.map((r) => loadInstrumentModule(r.instrumentId))),
        Promise.all(runs.map((r) => store.practice(r.instrumentId))),
      ]);
      if (!live) return;

      const cards: Card[] = [];
      runs.forEach((run, n) => {
        const instrument = loaded[n] as InstrumentModule | null;
        if (!instrument) return;
        const { spec } = instrument;
        const scoped = i18n.scope(spec.id);
        for (const card of instrument.spec.instructions(run.result, scoped.t)) {
          cards.push({ ...card, from: scoped.t("title"), id: spec.id });
        }

        // Regenerated from today's result rather than read back as text, so a
        // line whose suggestion no longer exists disappears instead of being
        // printed under somebody's name as a position they no longer hold.
        const lines = resolvePlaybook(spec.playbook?.(run.result, scoped.t), practices[n]);
        if (!isEmptyPlaybook(lines)) {
          cards.push({
            channel: spec.channels[0],
            title: i18n.t("sheet.playbookTitle"),
            body: "",
            from: i18n.t("sheet.playbookFrom", { test: scoped.t("title") }),
            id: spec.id,
            lines,
          });
        }
      });
      setState({ cards, runs, name: profile.displayName, note: profile.note });
    })();
    return () => {
      live = false;
    };
  }, [store, i18n]);

  if (!state) {
    return (
      <p className="py-16 text-muted" role="status">
        {copy.loading}
      </p>
    );
  }

  if (!state.cards.length) {
    return (
      <div className="py-16">
        <h2 className="mb-3 text-2xl">{copy.emptyTitle}</h2>
        <p className="mb-6 max-w-[62ch] leading-relaxed text-muted">{copy.emptyBody}</p>
        <Link
          href={`/${locale}/tests`}
          className="inline-block rounded-sm border border-brass bg-brass/10 px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-brass-hi"
        >
          {copy.emptyAction}
        </Link>
      </div>
    );
  }

  const byChannel = new Map<Channel, Card[]>();
  for (const card of state.cards) byChannel.set(card.channel, [...(byChannel.get(card.channel) ?? []), card]);

  return (
    <article>
      <header className="flex flex-col gap-4 py-12">
        <h1 className="text-3xl">
          {state.name ? i18n.t("sheet.titleNamed", { name: state.name }) : i18n.t("sheet.titleAnon")}
        </h1>
        {state.note ? <p className="max-w-[62ch] text-lg leading-relaxed">{state.note}</p> : null}
        <p className="max-w-[62ch] text-sm text-muted">
          {i18n.t("sheet.summary", {
            lines: state.cards.length,
            instruments: state.runs.length,
            shown: state.cards.length,
          })}
        </p>
        <div className="flex flex-wrap gap-3 print:hidden">
          <Button onClick={() => window.print()}>{copy.print}</Button>
          <Link href={`/${locale}/panel`}>
            <Button>{copy.edit}</Button>
          </Link>
        </div>
      </header>

      {CHANNELS.filter((ch) => byChannel.has(ch)).map((ch) => {
        const cards = byChannel.get(ch)!;
        return (
          <Plate key={ch}>
            <PlateHead title={i18n.t(`channel.${ch}`)} note={String(cards.length)} />
            <div className="grid gap-3 sm:grid-cols-2">
              {cards.map((card, n) => (
                <div key={`${card.id}-${n}`} className="rounded-sm border border-rule bg-panel-2 p-5">
                  <h4 className="mb-2 text-base">{card.title}</h4>
                  {card.lines ? (
                    <div className="mb-3 grid gap-3">
                      {(["ok", "notOk"] as const)
                        .filter((side) => card.lines![side].length)
                        .map((side) => (
                          <div key={side}>
                            <span
                              className={cn(
                                "label-caps mb-1 block border-l-2 pl-2",
                                side === "ok" ? "border-brass" : "border-madder",
                              )}
                            >
                              {i18n.t(side === "ok" ? "playbook.okHeading" : "playbook.notOkHeading")}
                            </span>
                            <ul className="grid gap-1 text-sm leading-relaxed text-ink/90">
                              {card.lines![side].map((line) => (
                                <li key={line.id}>{line.text}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="mb-3 text-sm leading-relaxed text-muted">{card.body}</p>
                  )}
                  <Link
                    href={`/${locale}/tests/${card.id}/result`}
                    className="label-caps hover:text-ink print:hidden"
                  >
                    {card.from}
                  </Link>
                </div>
              ))}
            </div>
          </Plate>
        );
      })}
    </article>
  );
}
