"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/components/ui/link";
import { createI18n, type Messages } from "@/core/i18n";
import { decodeReport, tokenFrom, REPORT_KEY, type DecodedReport } from "@/core/report";
import { loadInstrumentModule } from "@/instruments/lazy";
import type { InstrumentModule } from "@/core/registry";
import type { Locale } from "@/core/types";
import { Plate, PlateHead } from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button-styles";
import { useStore } from "@/components/shell/store-provider";
import type { Run } from "@/core/types";

/**
 * Someone else's report, rebuilt from the link.
 *
 * The token carries answers, not results: the reader's own copy of the
 * instrument re-runs `score()` on them. That is why a report cannot contain a
 * reading its sender did not have — and why it stays correct when an
 * instrument's wording is improved, because only the numbers travelled.
 *
 * Nothing here is written to the store. A received report is not the reader's
 * own data and must never be filed as if it were. The store is only READ: for
 * every instrument in the report that the reader has also taken, their own
 * run is scored beside the sender's and the instrument's `Compare` draws the
 * two together. That is the one place the app's purpose — understanding
 * someone by comparing results — becomes a page, and it needs no link format
 * of its own: the report link the sender already made is the comparison link.
 */
/** The address bar, as an external store. Strings, so the snapshot is stable. */
const subscribeToHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const readHash = () => window.location.hash;
const readNothing = () => "";

export function Report({
  locale,
  messages,
  fallbackMessages,
  ids,
  token: given,
}: {
  locale: Locale;
  messages: Messages;
  fallbackMessages: Messages;
  ids: string[];
  /**
   * A token that came from somewhere other than this page's own address.
   *
   * The published route decrypts one out of a service and hands it here, so the
   * two paths share every line of rendering rather than growing a second copy
   * that drifts. `undefined` means "read the URL"; `null` means "there is
   * genuinely nothing", which is what a caller says while it is still fetching
   * and after it has failed.
   */
  token?: string | null;
}) {
  /**
   * The fragment is read as an external store rather than into state.
   *
   * It is one: the address bar is owned by the browser, changes without this
   * component doing anything, and has no server-side value at all. Copying it
   * into state through an effect would be a render, then a second render, then
   * — the shape lint calls a cascading render, and it is right to. The empty
   * server snapshot is not a lie either: on the server there is genuinely no
   * fragment, because a fragment is never sent to one, which is the whole
   * reason the token lives there.
   *
   * `useSearchParams` is still read, but only so the legacy `?d=` form keeps
   * opening. See `tokenFrom` in core/report.ts for why one character of URL is
   * a privacy boundary.
   */
  const search = useSearchParams();
  const hash = useSyncExternalStore(subscribeToHash, readHash, readNothing);
  const located = tokenFrom(hash, search.toString());
  const supplied = given !== undefined;
  const token = supplied ? given : located.token;
  const fromQuery = supplied ? false : located.fromQuery;

  useEffect(() => {
    /**
     * Get a legacy token out of the address bar once it has been read.
     *
     * It is already in this browser's history and it has already reached the
     * host, so this recovers nothing that was lost on the way in. What it stops
     * is the next step: a URL sitting in the bar is the one that gets copied,
     * screenshotted, restored by session sync and sent as a referrer. Moving it
     * to the fragment costs nothing and makes onward travel silent.
     */
    if (fromQuery && token) {
      window.history.replaceState(null, "", `${window.location.pathname}#${REPORT_KEY}=${token}`);
    }
  }, [fromQuery, token]);
  const i18n = useMemo(() => createI18n({ locale, messages, fallbackMessages }), [locale, messages, fallbackMessages]);
  const { t } = i18n;
  const store = useStore();

  const [state, setState] = useState<
    | { ok: true; report: DecodedReport; instruments: Map<string, InstrumentModule>; own: Map<string, Run>; ownName: string }
    | { ok: false; error: string }
    | null
  >(null);

  useEffect(() => {
    let live = true;
    (async () => {
      if (!token) {
        if (live) setState({ ok: false, error: t("report.missing") });
        return;
      }
      // The instruments have to be loaded before the token can be read: the
      // packed format is one character per item *in the instrument's own item
      // order*, so decoding needs the bank to reconstruct the keys.
      const loaded = new Map<string, InstrumentModule>();
      for (const id of ids) {
        const instrument = await loadInstrumentModule(id);
        if (instrument) loaded.set(id, instrument);
      }
      if (!live) return;
      try {
        const report = decodeReport(token, { get: (id: string) => loaded.get(id) ?? null }, t, Date.now());
        // The reader's side of each comparison: their own stored run of every
        // instrument the sender shared, where one exists.
        const own = new Map<string, Run>();
        for (const run of report.runs) {
          const mine = await store.run(run.instrumentId);
          if (mine) own.set(run.instrumentId, mine);
        }
        const profile = await store.profile();
        if (!live) return;
        setState({ ok: true, report, instruments: loaded, own, ownName: profile.displayName });
      } catch (err) {
        setState({ ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    })();
    return () => {
      live = false;
    };
  }, [token, ids, t, store]);

  if (!state) {
    return (
      <p className="py-16 text-muted" role="status">
        {t("runner.loading")}
      </p>
    );
  }

  if (!state.ok) {
    return (
      <div className="py-16">
        <h1 className="mb-3 text-2xl">{t("report.brokenTitle")}</h1>
        <p className="mb-6 max-w-[62ch] leading-relaxed text-muted">{state.error}</p>
        <Link href={`/${locale}`} className="label-caps hover:text-ink">
          {t("common.goHome")}
        </Link>
      </div>
    );
  }

  const { report, instruments, own, ownName } = state;
  const name = report.profile.displayName;
  const you = ownName || t("compare.you");
  const them = name || t("compare.them");

  return (
    <article>
      <header className="flex flex-col gap-3 py-12">
        <span className="label-caps">{t(`audience.${report.audience}`)}</span>
        <h1 className="text-3xl">{name ? t("sheet.titleNamed", { name }) : t("sheet.titleAnon")}</h1>
        {report.profile.pronouns ? <p className="text-muted">{report.profile.pronouns}</p> : null}
        {report.profile.note ? <p className="max-w-[62ch] text-lg leading-relaxed">{report.profile.note}</p> : null}
      </header>

      {report.runs.length === 0 ? (
        <Plate>
          <p className="max-w-[62ch] leading-relaxed text-muted">{t("report.nothingShared")}</p>
        </Plate>
      ) : (
        report.runs.map((run) => {
          const instrument = instruments.get(run.instrumentId);
          if (!instrument) return null;
          const { spec, View, Compare } = instrument;
          const scoped = i18n.scope(spec.id);
          // Re-scored here from the answers that travelled, never trusted from
          // the link — a result in a token would be a number nobody could check.
          const result = spec.score(run.answers);
          const mine = own.get(run.instrumentId);
          // The reader's run is re-scored too, so both sides meet the current
          // items; a run from an older version of the bank cannot, and says so.
          const current = mine && mine.instrumentVersion === spec.version;
          return (
            <Plate key={run.instrumentId}>
              <PlateHead title={scoped.t("title")} note={scoped.t("framework")} />
              <View result={result} t={scoped.t} />
              {Compare ? (
                <section className="mt-8 border-t border-rule pt-6" data-compare={run.instrumentId}>
                  {current ? (
                    <>
                      <PlateHead
                        title={t("compare.bothHeading", { a: you, b: them })}
                        note={t("compare.bothLead", { test: scoped.t("title") })}
                      />
                      <Compare a={spec.score(mine.answers)} b={result} nameA={you} nameB={them} t={scoped.t} />
                    </>
                  ) : mine ? (
                    <>
                      <h3 className="text-lg">{t("compare.takeFirstTitle")}</h3>
                      <p className="mt-2 max-w-[62ch] leading-relaxed text-muted">
                        {t("result.stale", { had: mine.instrumentVersion, now: spec.version })}
                      </p>
                      <Link href={`/${locale}/tests/${spec.id}/take`} className={buttonClass({ variant: "primary", className: "mt-4" })}>
                        {t("compare.takeFirstAction", { test: scoped.t("title") })}
                      </Link>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg">{t("compare.takeFirstTitle")}</h3>
                      <p className="mt-2 max-w-[62ch] leading-relaxed text-muted">
                        {t("compare.takeFirstBody", { test: scoped.t("title") })}
                      </p>
                      <Link href={`/${locale}/tests/${spec.id}/take`} className={buttonClass({ variant: "primary", className: "mt-4" })}>
                        {t("compare.takeFirstAction", { test: scoped.t("title") })}
                      </Link>
                    </>
                  )}
                </section>
              ) : null}
            </Plate>
          );
        })
      )}

      <p className="mt-10 max-w-[62ch] text-sm leading-relaxed text-muted">{t("report.footer")}</p>
    </article>
  );
}
