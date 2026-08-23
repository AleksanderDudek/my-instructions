"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/components/ui/link";
import { createI18n, type Messages } from "@/core/i18n";
import { CHANNELS } from "@/core/types";
import type { Channel, Locale, Run } from "@/core/types";
import { loadInstrumentModule } from "@/instruments/lazy";
import type { InstrumentModule } from "@/core/registry";
import { useStore } from "@/components/shell/store-provider";
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
 */
type Card = { channel: Channel; title: string; body: string; from: string; id: string };

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
      const loaded = await Promise.all(runs.map((r) => loadInstrumentModule(r.instrumentId)));
      if (!live) return;

      const cards: Card[] = [];
      runs.forEach((run, n) => {
        const instrument = loaded[n] as InstrumentModule | null;
        if (!instrument) return;
        const scoped = i18n.scope(instrument.spec.id);
        for (const card of instrument.spec.instructions(run.result, scoped.t)) {
          cards.push({ ...card, from: scoped.t("title"), id: instrument.spec.id });
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
                  <p className="mb-3 text-sm leading-relaxed text-muted">{card.body}</p>
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
