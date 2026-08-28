"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/ui/link";
import { Report } from "./report";
import { decryptToken, fetchPublished, handleFromFragment, publishEndpoint } from "@/core/publish";
import type { Messages } from "@/core/i18n";
import type { Locale } from "@/core/types";

/**
 * A published link, opened.
 *
 * The whole handle — which record, and the key that opens it — is in the
 * fragment, so this page's own host learns neither. What it does is fetch some
 * bytes by id, decrypt them here, and hand the result to the same `Report` that
 * renders a self-contained link. One renderer, two ways in.
 *
 * Three endings, and they are deliberately not three messages.
 *
 * **Gone.** Withdrawn or expired, and the service answers identically for both
 * on purpose: which one happened is a fact about the sender's recent decisions,
 * and that is the sender's business rather than the holder's.
 *
 * **Unreadable.** A truncated link — a messenger that wrapped it, a paste that
 * dropped the tail — leaves bytes that will not decrypt. Distinct from gone,
 * because the fix is different: ask for the link again rather than accept that
 * it is over.
 *
 * **Nothing to open.** No handle in the address at all.
 */
export function Opened({
  locale,
  messages,
  fallbackMessages,
  ids,
  copy,
}: {
  locale: Locale;
  messages: Messages;
  fallbackMessages: Messages;
  ids: string[];
  copy: { loading: string; gone: string; goneBody: string; unreadable: string; missing: string; home: string };
}) {
  const [state, setState] = useState<
    { at: "loading" } | { at: "ready"; token: string } | { at: "gone" | "unreadable" | "missing" }
  >({ at: "loading" });

  useEffect(() => {
    let live = true;
    void (async () => {
      const endpoint = publishEndpoint();
      const handle = handleFromFragment(window.location.hash);
      if (!handle || !endpoint) {
        if (live) setState({ at: "missing" });
        return;
      }
      try {
        const body = await fetchPublished(endpoint, handle.id);
        if (!live) return;
        if (!body) {
          setState({ at: "gone" });
          return;
        }
        // Decryption failing is authentication failing: AES-GCM refuses bytes
        // that were altered as loudly as it refuses the wrong key, so there is
        // no path where a tampered record renders as a plausible report.
        setState({ at: "ready", token: await decryptToken(body, handle.key) });
      } catch {
        if (live) setState({ at: "unreadable" });
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  if (state.at === "loading") {
    return (
      <p className="py-16 text-muted" role="status">
        {copy.loading}
      </p>
    );
  }

  if (state.at !== "ready") {
    const headline = state.at === "gone" ? copy.gone : state.at === "unreadable" ? copy.unreadable : copy.missing;
    return (
      <div className="py-16">
        <h1 className="mb-3 text-2xl">{headline}</h1>
        {state.at === "gone" ? (
          <p className="mb-6 max-w-[62ch] leading-relaxed text-muted">{copy.goneBody}</p>
        ) : null}
        <Link href={`/${locale}`} className="label-caps hover:text-ink">
          {copy.home}
        </Link>
      </div>
    );
  }

  return (
    <Report
      locale={locale}
      messages={messages}
      fallbackMessages={fallbackMessages}
      ids={ids}
      token={state.token}
    />
  );
}
