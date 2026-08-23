"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useStore } from "./store-provider";

/**
 * A closed section states that it exists and what kind of thing is in it, and
 * nothing else.
 *
 * The instrument titles are not rendered until the reader confirms — they are
 * absent from the DOM, not hidden by a style — so somebody reading over a
 * shoulder, or searching the page, finds nothing to find.
 *
 * The confirmation is self-attestation and the copy says so. It keeps explicit
 * material off the catalogue of somebody who has not asked for it, which is
 * what it is for; it is not age verification and does not pretend to be.
 */
export function AdultGate({
  count,
  copy,
  children,
}: {
  count: number;
  copy: { body: string; fine: string; confirm: string };
  children: React.ReactNode;
}) {
  const store = useStore();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let live = true;
    store.settings().then((s) => live && setOk(s.adultOk));
    return () => {
      live = false;
    };
  }, [store]);

  // `null` is "not yet read from storage". Rendering the gate during that
  // moment would flash a confirmation prompt at somebody who confirmed months
  // ago; rendering the children would flash the titles at somebody who has not.
  if (ok === null) return <div className="h-40" aria-busy="true" />;
  if (ok) return <>{children}</>;

  return (
    <div className="rounded-sm border border-dashed border-rule bg-panel-2 p-6" data-testid="adult-gate">
      <p className="mb-3 max-w-[62ch] leading-relaxed">{copy.body}</p>
      <p className="mb-5 max-w-[62ch] text-sm text-muted">{copy.fine}</p>
      <Button
        variant="primary"
        data-testid="adult-confirm"
        onClick={async () => {
          await store.saveSettings({ adultOk: true });
          setOk(true);
        }}
      >
        {copy.confirm}
      </Button>
      <span className="sr-only">{count}</span>
    </div>
  );
}
