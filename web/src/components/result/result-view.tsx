"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/components/ui/link";
import { useSearchParams } from "next/navigation";
import { createI18n, type Messages } from "@/core/i18n";
import { loadInstrumentModule } from "@/instruments/lazy";
import type { InstrumentModule } from "@/core/registry";
import type { Locale, Run } from "@/core/types";
import { useStore } from "@/components/shell/store-provider";
import { Plate, PlateHead } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Playbook } from "@/components/result/playbook";

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
  pairwise,
  copy,
}: {
  id: string;
  locale: Locale;
  messages: Messages;
  fallbackMessages: Messages;
  pairwise: boolean;
  copy: { empty: string; emptyBody: string; emptyAction: string; loading: string; retake: string; sheet: string; stale: string };
}) {
  const store = useStore();
  const search = useSearchParams();
  const slot: "b" | null = pairwise && search.get("who") === "b" ? "b" : null;
  const [instrument, setInstrument] = useState<InstrumentModule | null>(null);
  const [run, setRun] = useState<Run | null | undefined>(undefined);
  const [armed, setArmed] = useState(false);

  const i18n = useMemo(() => createI18n({ locale, messages, fallbackMessages }), [locale, messages, fallbackMessages]);
  const scoped = useMemo(() => i18n.scope(id), [i18n, id]);

  useEffect(() => {
    let live = true;
    (async () => {
      const [m, r] = await Promise.all([loadInstrumentModule(id), store.run(id, slot)]);
      if (!live) return;
      setInstrument(m);
      setRun(r);
    })();
    return () => {
      live = false;
    };
  }, [id, slot, store]);

  if (run === undefined || !instrument) {
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

  const { View, spec } = instrument;
  const stale = run.instrumentVersion !== spec.version;
  const cards = spec.instructions(run.result, scoped.t);

  return (
    <>
      {stale ? (
        <div className="mb-8 border-l-2 border-madder pl-5 text-[0.95rem] text-ink/90">{copy.stale}</div>
      ) : null}

      <Plate>
        {/* `answers` reaches the View and nothing else, which is the whole
            arrangement: a stated reason is prose, prose must never be in a
            result, and a result is the only thing a share token can carry. The
            sentence lives in the answers, on this device, and is drawn here. */}
        <View result={run.result} answers={run.answers} t={scoped.t} />
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

      {/* A playbook is written down. A session-only run deliberately is not.
          `store.savePractice` goes through the adapter to localStorage, so
          offering these checkboxes for an instrument whose whole promise is
          that nothing survives the tab would leave the reader's own sentences
          on disk under `practice:<id>`, outliving the run they were written
          against — the one shape `store`'s ephemeral Map exists to make
          impossible.

          The slot check is the same guard read from the other end, and it
          names the worse failure. `pairwise` implies session persistence
          (registry.validate refuses any other combination) and the practice
          key carries no slot, so the second person of a pair would write over
          the first person's list and print their sentences on the first
          person's instruction sheet, under the first person's name. Both
          conditions are tested rather than one being inferred from the other:
          if the pairwise rule is ever relaxed, that must not silently create a
          stored record of somebody who was told there would not be one.

          If a pair is ever to have a playbook, the storage key has to carry
          the slot first. Until then the honest answer is no playbook. */}
      {spec.playbook && spec.persistence !== "session" && !slot ? (
        <Playbook
          id={id}
          suggestions={spec.playbook(run.result, scoped.t)}
          copy={{
            heading: i18n.t("playbook.heading"),
            note: i18n.t("playbook.note"),
            okHeading: i18n.t("playbook.okHeading"),
            notOkHeading: i18n.t("playbook.notOkHeading"),
            addOwn: i18n.t("playbook.addOwn"),
            addOwnPlaceholder: i18n.t("playbook.addOwnPlaceholder"),
            addButton: i18n.t("playbook.addButton"),
            removeLabel: i18n.t("playbook.removeLabel"),
            empty: i18n.t("playbook.empty"),
            localOnly: i18n.t("playbook.localOnly"),
          }}
        />
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link href={`/${locale}/instructions`}>
          <Button variant="primary">{copy.sheet}</Button>
        </Link>
        <Link href={`/${locale}/tests/${id}/take`}>
          <Button>{copy.retake}</Button>
        </Link>
        {/* The reader's way out, and the only caller of `clearRun`.
            Without it the run, its draft and the practice written against it
            could be removed only by wiping the whole account from the panel —
            so the reader who wanted one result gone had to choose between
            keeping it and losing everything, and the copy for this button sat
            unused in four locales while they did.

            Two steps, as the panel's wipe does it: a confirm dialog is
            answered by reflex, a button whose label has visibly changed cannot
            be. `clearRun` takes the practice with the run, which is the point
            — notes surviving the result they were written against is the
            surprise in the wrong direction — and it clears both halves of a
            pair, because a pair is one sitting in one tab. */}
        <Button
          variant="danger"
          onClick={async () => {
            if (!armed) {
              setArmed(true);
              return;
            }
            await store.clearRun(id);
            // Straight to the empty state rather than a redirect: the reader
            // asked for this result to be gone and is now looking at the page
            // that says it is, with the link to take it again.
            setRun(null);
          }}
        >
          {armed ? i18n.t("result.deleteConfirm") : i18n.t("result.delete")}
        </Button>
      </div>

      <p className="mt-10 max-w-[62ch] text-sm leading-relaxed text-muted">{scoped.t("sourceNote")}</p>
      {/* Two different apologies, because the two families owe different ones.
          A questionnaire estimates something from items with no norms and has
          to say so. An inventory estimates nothing, so the paragraph about
          reliability would be an apology for a claim it never made — what it
          owes the reader instead is that none of this was scored. */}
      {spec.family === "questionnaire" ? (
        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted">{i18n.t("app.noValidation")}</p>
      ) : null}
      {spec.family === "inventory" ? (
        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted">{i18n.t("result.inventoryNote")}</p>
      ) : null}
    </>
  );
}
