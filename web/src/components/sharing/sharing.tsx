"use client";

import { useEffect, useMemo, useState } from "react";
import { createI18n, type Messages } from "@/core/i18n";
import type { Locale, Run } from "@/core/types";
import { loadInstrumentModule } from "@/instruments/lazy";
import type { InstrumentModule } from "@/core/registry";
import { useStore } from "@/components/shell/store-provider";
import { Profiles } from "./profiles";
import { PROFILE_COPY_KEYS } from "./profile-copy";

/**
 * One place that decides who sees what, and only one way of deciding it.
 *
 * This page used to carry two mechanisms at once: a table setting a standing
 * audience on every element, and profiles built on top of it. Two controls
 * answering one question is how somebody comes to believe a thing is private
 * because they set it that way in the other one — and of the two, the table was
 * the weaker answer. A single audience per element cannot say "my colleague
 * sees how I want to be corrected and nothing about my faith, and my closest
 * friend is the other way round", which is the ordinary case rather than the
 * exotic one.
 *
 * So the ladder stopped being a control and kept the job it is good at: the
 * *ceiling*. An instrument's `maxAudience` still decides what may ever be
 * offered, and `encodeReport` checks it again while building a token —
 * consulting the instrument, never the profile, so a hand-edited profile
 * cannot widen anything.
 *
 * What the reader operates is the selection. A named profile, seeded from a
 * preset and then trimmed by hand, where every element is one checkbox and
 * nothing is implied by anything else.
 *
 * The property the whole feature rests on is unchanged: an element not in a
 * profile is **absent from that profile's link**, not hidden by the page that
 * renders it. A token carrying everything and leaving the filtering to the
 * viewer would be a convention rather than a permission.
 */
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
  const i18n = useMemo(
    () => createI18n({ locale, messages, fallbackMessages }),
    [locale, messages, fallbackMessages],
  );
  const { t } = i18n;

  const [loaded, setLoaded] = useState<{
    runs: Run[];
    instruments: Map<string, InstrumentModule>;
    identity: { displayName: string; pronouns: string; note: string };
  } | null>(null);

  useEffect(() => {
    // Inline rather than a `useCallback` called from the effect: the reads are
    // async, so without a liveness flag an unmount mid-load sets state on a
    // component that is gone.
    let live = true;
    void (async () => {
      const [runs, identity] = await Promise.all([store.runs(), store.profile()]);
      const instruments = new Map<string, InstrumentModule>();
      for (const run of runs) {
        const instrument = await loadInstrumentModule(run.instrumentId);
        if (instrument) instruments.set(run.instrumentId, instrument);
      }
      if (!live) return;
      setLoaded({
        runs,
        instruments,
        identity: { displayName: identity.displayName, pronouns: identity.pronouns, note: identity.note },
      });
    })();
    return () => {
      live = false;
    };
  }, [store]);

  if (!loaded) {
    return (
      <p className="py-16 text-muted" role="status">
        {t("runner.loading")}
      </p>
    );
  }

  const profilesCopy = Object.fromEntries(PROFILE_COPY_KEYS.map((key) => [key, t(key)]));

  return (
    <>
      <header className="flex flex-col gap-3 py-12">
        <h1 className="text-3xl">{t("sharing.heading")}</h1>
        <p className="max-w-[62ch] leading-relaxed text-muted">{t("sharing.lead")}</p>
      </header>

      <Profiles
        locale={locale}
        copy={profilesCopy}
        titleOf={Object.fromEntries([...loaded.instruments.keys()].map((id) => [id, i18n.scope(id).t("title")]))}
        identityLabels={{
          "profile.name": t("sharing.row.name"),
          "profile.pronouns": t("sharing.row.pronouns"),
          "profile.note": t("sharing.row.note"),
        }}
        identityValues={{
          "profile.name": loaded.identity.displayName || t("sharing.unset"),
          "profile.pronouns": loaded.identity.pronouns || t("sharing.unset"),
          "profile.note": loaded.identity.note || t("sharing.unset"),
        }}
        runs={loaded.runs}
        instruments={loaded.instruments}
        identity={loaded.identity}
      />

      <p className="mt-8 max-w-[62ch] text-sm leading-relaxed text-muted">{t("sharing.absentNote")}</p>
      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">{t("sharing.expiryNote")}</p>

      <span className="sr-only">{ids.length}</span>
    </>
  );
}
