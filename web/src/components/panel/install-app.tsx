"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { promptInstall, readInstallState, subscribeToInstall, type InstallState } from "@/components/shell/pwa";

/**
 * Installing, offered where settings live rather than in a banner over the
 * page: somebody who wants the app on their home screen comes looking, and
 * somebody who does not is never asked twice.
 *
 * Chromium hands over a prompt, so there is a button. Safari has none, so
 * there is the one sentence that says where the share sheet hides it. Any
 * other browser gets the menu's wording. Installed, the section says so.
 */
const readNull = () => null;

export function InstallApp({ copy }: { copy: Record<"cta" | "ios" | "manual" | "done", string> }) {
  const state = useSyncExternalStore<InstallState | null>(subscribeToInstall, readInstallState, readNull);
  if (state === null) return null;
  if (state === "installed") return <p className="max-w-[62ch] text-sm leading-relaxed text-verdigris">{copy.done}</p>;
  if (state === "prompt")
    return (
      <Button variant="primary" onClick={() => void promptInstall()}>
        {copy.cta}
      </Button>
    );
  return <p className="max-w-[62ch] leading-relaxed text-ink/90">{state === "ios" ? copy.ios : copy.manual}</p>;
}
