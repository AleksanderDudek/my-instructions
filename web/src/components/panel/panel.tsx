"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/components/ui/link";
import type { Locale } from "@/core/types";
import { useStore } from "@/components/shell/store-provider";
import { Plate, PlateHead } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { FieldControl } from "@/components/form/item-controls";

/**
 * The panel: who the sheet is addressed from, which language, and the data.
 *
 * The destructive controls are deliberately two-step rather than behind a
 * modal. A dialog gets dismissed by muscle memory; a button that changes its
 * own label to say what the second click will do cannot be answered without
 * being read.
 */
export function Panel({
  locale,
  locales,
  copy,
}: {
  locale: Locale;
  locales: { tag: string; endonym: string }[];
  copy: Record<string, string>;
}) {
  const store = useStore();
  const router = useRouter();
  const [profile, setProfile] = useState<{ displayName: string; pronouns: string; note: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const [armed, setArmed] = useState(false);
  const [durable, setDurable] = useState(true);
  const [runCount, setRunCount] = useState(0);

  useEffect(() => {
    let live = true;
    (async () => {
      const [p, runs] = await Promise.all([store.profile(), store.runs()]);
      if (!live) return;
      setProfile({ displayName: p.displayName, pronouns: p.pronouns, note: p.note });
      setRunCount(runs.length);
      setDurable(store.durable);
    })();
    return () => {
      live = false;
    };
  }, [store]);

  if (!profile) {
    return (
      <p className="py-16 text-muted" role="status">
        {copy.loading}
      </p>
    );
  }

  const set = (key: keyof typeof profile) => (value: unknown) => {
    setProfile({ ...profile, [key]: String(value ?? "") });
    setSaved(false);
  };

  const exportAll = async () => {
    const dump = await store.exportAll();
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-instructions-${dump.exportedAt.slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="flex flex-col gap-3 py-12">
        <h1 className="text-3xl">{copy.heading}</h1>
        <p className="max-w-[62ch] leading-relaxed text-muted">{copy.lead}</p>
      </header>

      <Plate>
        <PlateHead title={copy.headingSection} note={copy.headingNote} />
        <FieldControl
          field={{ id: "displayName", kind: "text", label: copy.displayName, placeholder: copy.displayNamePlaceholder }}
          value={profile.displayName}
          onChange={set("displayName")}
        />
        <FieldControl
          field={{ id: "pronouns", kind: "text", label: copy.pronouns, placeholder: copy.pronounsPlaceholder }}
          value={profile.pronouns}
          onChange={set("pronouns")}
        />
        <FieldControl
          field={{ id: "note", kind: "text", label: copy.opening, placeholder: copy.openingPlaceholder }}
          value={profile.note}
          onChange={set("note")}
        />
        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            onClick={async () => {
              await store.saveProfile(profile);
              setSaved(true);
            }}
          >
            {copy.save}
          </Button>
          <span className="text-sm text-verdigris" role="status">
            {saved ? copy.saved : ""}
          </span>
        </div>
      </Plate>

      <Plate>
        <PlateHead title={copy.languageSection} note={copy.languageNote} />
        <div className="flex flex-wrap gap-2">
          {locales.map((l) => (
            <Link
              key={l.tag}
              href={`/${l.tag}/panel`}
              hrefLang={l.tag}
              onClick={() => void store.saveSettings({ locale: l.tag as Locale })}
              className={`rounded-sm border px-4 py-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] ${
                l.tag === locale ? "border-brass text-brass" : "border-rule text-muted hover:text-ink"
              }`}
            >
              {l.endonym}
            </Link>
          ))}
        </div>
      </Plate>

      <Plate>
        <PlateHead title={copy.dataSection} />
        <p className={`mb-4 max-w-[62ch] text-sm ${durable ? "text-muted" : "text-madder"}`}>
          {durable ? copy.storageOk : copy.storageBad}
        </p>
        <p className="mb-4 text-sm text-muted">
          {runCount ? copy.resultsSection : copy.noResults} — {runCount}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => void exportAll()}>{copy.export}</Button>
          <Button
            variant="danger"
            onClick={async () => {
              // Two steps, and the label says what the second one does. A
              // confirm dialog is answered by reflex; a button that has
              // visibly changed cannot be.
              if (!armed) {
                setArmed(true);
                return;
              }
              await store.wipe();
              router.push(`/${locale}`);
            }}
          >
            {armed ? copy.wipeConfirm : copy.wipe}
          </Button>
        </div>
      </Plate>
    </>
  );
}
