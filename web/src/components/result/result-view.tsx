"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createI18n, type Messages } from "@/core/i18n";
import { loadInstrumentModule } from "@/instruments/lazy";
import type { InstrumentModule } from "@/core/registry";
import type { Locale, Run } from "@/core/types";
import { useStore } from "@/components/shell/store-provider";
import { Plate, PlateHead } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

/**
 * A result page reads from local storage, so it renders on the client.
 *
 * The words do not: the server sends the instrument's whole message table as
 * plain data and `t` is rebuilt here. That keeps the copy out of the client
 * bundle for every instrument except the one being read, and it means the View
 * component — which is written against `t` and knows nothing about where it
 * came from — is the same component whether it renders here or on a server.
 */
export function ResultView({
  id,
  locale,
  messages,
  fallbackMessages,
  slot,
  copy,
}: {
  id: string;
  locale: Locale;
  messages: Messages;
  fallbackMessages: Messages;
  slot: "b" | null;
  copy: { empty: string; emptyBody: string; emptyAction: string; loading: string; retake: string; sheet: string; stale: string };
}) {
  const store = useStore();
  const [module, setModule] = useState<InstrumentModule | null>(null);
  const [run, setRun] = useState<Run | null | undefined>(undefined);

  const i18n = useMemo(() => createI18n({ locale, messages, fallbackMessages }), [locale, messages, fallbackMessages]);
  const scoped = useMemo(() => i18n.scope(id), [i18n, id]);

  useEffect(() => {
    let live = true;
    (async () => {
      const [m, r] = await Promise.all([loadInstrumentModule(id), store.run(id, slot)]);
      if (!live) return;
      setModule(m);
      setRun(r);
    })();
    return () => {
      live = false;
    };
  }, [id, slot, store]);

  if (run === undefined || !module) {
    return (
      <p className="py-16 text-muted" role="status">
        {copy.loading}
      </p>
    );
  }

  if (!run) {
    return (
      <div className="py-16">
        <h2 className="mb-3 text-2xl">{copy.empty}</h2>
        <p className="mb-6 max-w-[62ch] leading-relaxed text-muted">{copy.emptyBody}</p>
        <Link
          href={`/${locale}/tests/${id}/take`}
          className="inline-block rounded-sm border border-brass bg-brass/10 px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-brass-hi"
        >
          {copy.emptyAction}
        </Link>
      </div>
    );
  }

  const { View, spec } = module;
  const stale = run.instrumentVersion !== spec.version;
  const cards = spec.instructions(run.result, scoped.t);

  return (
    <>
      {stale ? (
        <div className="mb-8 border-l-2 border-madder pl-5 text-[0.95rem] text-ink/90">{copy.stale}</div>
      ) : null}

      <Plate>
        <View result={run.result} t={scoped.t} />
      </Plate>

      <Plate>
        <PlateHead title={i18n.t("result.addedHeading")} note={i18n.t("result.addedNote")} />
        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map((card, n) => (
            <div key={`${card.channel}-${n}`} className="rounded-sm border border-rule bg-panel-2 p-5">
              <span className="label-caps mb-2 block">{i18n.t(`channel.${card.channel}`)}</span>
              <h4 className="mb-2 text-base">{card.title}</h4>
              <p className="text-sm leading-relaxed text-muted">{card.body}</p>
            </div>
          ))}
        </div>
      </Plate>

      <div className="flex flex-wrap gap-3">
        <Link href={`/${locale}/instructions`}>
          <Button variant="primary">{copy.sheet}</Button>
        </Link>
        <Link href={`/${locale}/tests/${id}/take`}>
          <Button>{copy.retake}</Button>
        </Link>
      </div>

      <p className="mt-10 max-w-[62ch] text-sm leading-relaxed text-muted">{scoped.t("sourceNote")}</p>
      {spec.family === "questionnaire" ? (
        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted">{i18n.t("app.noValidation")}</p>
      ) : null}
    </>
  );
}
