"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@/components/ui/link";
import { createI18n, type Messages } from "@/core/i18n";
import { SHAREABLE, audiencesFor } from "@/core/audience";
import { elementsFor, reportLink } from "@/core/report";
import type { Audience, Locale, Run } from "@/core/types";
import type { Sharing as SharingMap } from "@/core/store";
import { loadInstrumentModule } from "@/instruments/lazy";
import type { InstrumentModule } from "@/core/registry";
import { useStore } from "@/components/shell/store-provider";
import { Plate, PlateHead } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * One place that decides who sees what.
 *
 * Each row is one shareable thing and one audience. The links underneath are
 * built from those rows and nothing else — which is the property the whole
 * feature rests on: a thing set to "only me" is *absent from the link*, not
 * hidden by the page that renders it. A token carrying everything and leaving
 * the filtering to the viewer would be a convention, not a permission.
 */
type Row = { id: string; label: string; value: string; audiences: Audience[]; sensitive: boolean };

export function Sharing({
  locale,
  messages,
  fallbackMessages,
  ids,
}: {
  locale: Locale;
  messages: Messages;
  fallbackMessages: Messages;
  ids: string[];
}) {
  const store = useStore();
  const i18n = useMemo(() => createI18n({ locale, messages, fallbackMessages }), [locale, messages, fallbackMessages]);
  const { t } = i18n;

  const [rows, setRows] = useState<Row[] | null>(null);
  const [sharing, setSharing] = useState<SharingMap>({});
  const [runs, setRuns] = useState<Run[]>([]);
  const [instruments, setInstruments] = useState<Map<string, InstrumentModule>>(new Map());
  const [profile, setProfile] = useState<{ displayName: string; pronouns: string; note: string } | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const [map, allRuns, p] = await Promise.all([store.sharing(), store.runs(), store.profile()]);
    const loaded = new Map<string, InstrumentModule>();
    for (const run of allRuns) {
      const instrument = await loadInstrumentModule(run.instrumentId);
      if (instrument) loaded.set(run.instrumentId, instrument);
    }

    const next: Row[] = [
      { id: "profile.name", label: t("sharing.row.name"), value: p.displayName || t("sharing.unset"), audiences: [...SHAREABLE], sensitive: false },
      { id: "profile.pronouns", label: t("sharing.row.pronouns"), value: p.pronouns || t("sharing.unset"), audiences: [...SHAREABLE], sensitive: false },
      { id: "profile.note", label: t("sharing.row.note"), value: p.note || t("sharing.unset"), audiences: [...SHAREABLE], sensitive: false },
    ];
    for (const run of allRuns) {
      const instrument = loaded.get(run.instrumentId);
      if (!instrument) continue;
      const { spec } = instrument;
      next.push({
        id: `run.${spec.id}`,
        label: i18n.scope(spec.id).t("title"),
        value: t("sharing.cardCount", { count: spec.instructions(run.result, i18n.scope(spec.id).t).length }),
        // A ceiling is an option that never appears, not a discouraged button.
        audiences: audiencesFor(spec).filter((a) => a !== "private"),
        sensitive: Boolean(spec.sensitive),
      });
    }

    setSharing(map);
    setRuns(allRuns);
    setInstruments(loaded);
    setProfile({ displayName: p.displayName, pronouns: p.pronouns, note: p.note });
    setRows(next);
  }, [store, t, i18n]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!rows || !profile) {
    return (
      <p className="py-16 text-muted" role="status">
        {t("runner.loading")}
      </p>
    );
  }

  const registryLike = { get: (id: string) => instruments.get(id) ?? null };
  const linkFor = (audience: Audience) =>
    reportLink(locale, { registry: registryLike, profile, runs, sharing, audience });

  const copyLink = async (audience: Audience) => {
    try {
      await navigator.clipboard.writeText(linkFor(audience));
      setMessage(t("sharing.copied"));
    } catch {
      setMessage(t("sharing.selectAndCopy"));
    }
  };

  return (
    <>
      <header className="flex flex-col gap-3 py-12">
        <h1 className="text-3xl">{t("sharing.heading")}</h1>
        <p className="max-w-[62ch] leading-relaxed text-muted">{t("sharing.lead")}</p>
      </header>

      <Plate>
        <PlateHead title={t("sharing.tableHeading")} note={t("sharing.tableNote")} />
        <div className="flex flex-col divide-y divide-rule">
          {rows.map((row) => {
            const current = sharing[row.id] ?? "private";
            return (
              <div key={row.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <span className="min-w-48 flex-1">
                  <span className="block">{row.label}</span>
                  <span className="block text-sm text-muted">
                    {row.value}
                    {row.sensitive ? ` · ${t("sharing.sensitiveNote")}` : ""}
                  </span>
                </span>
                <span role="group" aria-label={t("sharing.audienceFor", { element: row.label })} className="flex gap-1">
                  {(["private", ...row.audiences] as Audience[]).map((audience) => (
                    <button
                      key={audience}
                      type="button"
                      aria-pressed={current === audience}
                      onClick={async () => {
                        await store.setAudience(row.id, audience);
                        setSharing((prev) => ({ ...prev, [row.id]: audience }));
                      }}
                      className={cn(
                        "rounded-sm border px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em]",
                        current === audience ? "border-brass text-brass" : "border-rule text-muted hover:text-ink",
                      )}
                    >
                      {t(`audience.${audience}`)}
                    </button>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      </Plate>

      <Plate>
        <PlateHead title={t("sharing.linksHeading")} />
        <div className="grid gap-3 sm:grid-cols-3">
          {SHAREABLE.map((audience) => (
            <div key={audience} className="flex flex-col gap-3 rounded-sm border border-rule bg-panel-2 p-5">
              <span className="label-caps">{t(`audience.${audience}`)}</span>
              <h4 className="text-base">{t("sharing.linkCount", { count: elementsFor(sharing, audience).length })}</h4>
              <p className="text-sm leading-relaxed text-muted">{t(`sharing.explain.${audience}`)}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" onClick={() => void copyLink(audience)}>
                  {t("sharing.copyLink")}
                </Button>
                <Link href={`/${locale}/report?d=${encodeURIComponent(linkFor(audience).split("d=")[1] ?? "")}`}>
                  <Button>{t("sharing.preview")}</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-verdigris" role="status">
          {message}
        </p>
        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted">{t("sharing.absentNote")}</p>
        <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">{t("sharing.expiryNote")}</p>
      </Plate>
      <span className="sr-only">{ids.length}</span>
    </>
  );
}
