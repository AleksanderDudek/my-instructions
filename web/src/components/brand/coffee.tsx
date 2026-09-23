"use client";

import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui/button-styles";
import { Moment } from "./moments";

/**
 * Coffee with Uriel: an invitation to a toast, never a plea.
 *
 * It exists only when the deploy carries a support link — the same shape as
 * the publish endpoint: no variable, no feature, and nothing on the page
 * pointing at a door that is not there. When it does exist it appears only
 * after a moment of value (the caller decides which), at most once a
 * session, is dismissible from the corner or from "not now", and never
 * blocks anything. It says the tests stay free, because they do.
 *
 * "Thank you" follows the click on the link, not a confirmed payment: this
 * page cannot see the payment, and thanking someone for the gesture is the
 * honest thing it can say.
 */
const SUPPORT_URL = process.env.NEXT_PUBLIC_SUPPORT_URL ?? "";
const SEEN = "mi:coffee";

export type CoffeeCopy = {
  label: string;
  title: string;
  line: string;
  cta: string;
  notNow: string;
  close: string;
  thanksKicker: string;
  thanksTitle: string;
  thanksLine: string;
};

/**
 * Whether this session has not seen the invitation yet. No session storage
 * means no way to keep "once a session" true, so the answer is then no: not
 * shown at all rather than shown on every page view.
 */
function unseen(): boolean {
  if (!SUPPORT_URL || typeof window === "undefined") return false;
  try {
    return !sessionStorage.getItem(SEEN);
  } catch {
    return false;
  }
}

/**
 * Callers mount this only after their own data has loaded in the browser —
 * the sheet does, after reading the store — so the first render is already
 * client-side and reading storage in the initializer cannot mismatch a
 * server render.
 */
export function CoffeeInvite({ copy }: { copy: CoffeeCopy }) {
  const [state, setState] = useState<"hidden" | "invite" | "thanks">(() => (unseen() ? "invite" : "hidden"));

  // Recorded once shown, not when decided: the initializer must stay pure.
  useEffect(() => {
    if (state !== "invite") return;
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {
      // Unreachable in practice: `unseen` already required storage.
    }
  }, [state]);

  if (state === "hidden") return null;

  const dismiss = () => setState("hidden");

  if (state === "thanks") {
    return (
      <Moment
        as="aside"
        label={copy.label}
        mood="coffee"
        kicker={copy.thanksKicker}
        kickerTone="done"
        title={copy.thanksTitle}
        line={copy.thanksLine}
        onDismiss={dismiss}
        dismissLabel={copy.close}
        className="print:hidden"
      />
    );
  }

  return (
    <Moment
      as="aside"
      label={copy.label}
      mood="cheers"
      icon="coffee"
      kicker={copy.label}
      title={copy.title}
      line={copy.line}
      onDismiss={dismiss}
      dismissLabel={copy.close}
      className="print:hidden"
      actions={
        <>
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setState("thanks")}
            className={buttonClass({ variant: "primary" })}
          >
            {copy.cta}
          </a>
          <button type="button" onClick={dismiss} className={buttonClass({ variant: "ghost" })}>
            {copy.notNow}
          </button>
        </>
      }
    />
  );
}
