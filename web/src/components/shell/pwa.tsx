"use client";

import { useEffect } from "react";

/**
 * The installed-app plumbing: the service worker, and the browser's offer to
 * install.
 *
 * Registration happens only in a production build. In development the worker
 * would keep yesterday's chunks alive under today's code, which is the kind
 * of bug that costs an afternoon and teaches nothing.
 *
 * `beforeinstallprompt` (Chromium only) fires once, early, often before the
 * panel that offers installation has mounted. So it is caught here, for the
 * whole app, and handed out as an external store. Safari has no such event;
 * the panel says how to add the app from the share sheet instead.
 */

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

let deferred: InstallEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    // Keep the browser's own mini-infobar from appearing unasked; the offer
    // lives in the panel, where somebody goes looking for settings.
    event.preventDefault();
    deferred = event as InstallEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    installed = true;
    emit();
  });
}

export type InstallState = "installed" | "prompt" | "ios" | "manual";

export function subscribeToInstall(onChange: () => void) {
  listeners.add(onChange);
  const standalone = window.matchMedia("(display-mode: standalone)");
  standalone.addEventListener("change", onChange);
  return () => {
    listeners.delete(onChange);
    standalone.removeEventListener("change", onChange);
  };
}

export function readInstallState(): InstallState {
  const nav = navigator as Navigator & { standalone?: boolean };
  if (installed || nav.standalone || window.matchMedia("(display-mode: standalone)").matches) return "installed";
  if (deferred) return "prompt";
  // iPadOS reports itself as a Mac; touch points tell them apart.
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return ios ? "ios" : "manual";
}

export async function promptInstall(): Promise<void> {
  const event = deferred;
  if (!event) return;
  deferred = null;
  await event.prompt();
  await event.userChoice;
  emit();
}

export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    // After load, so the worker's first fetches never compete with the page's.
    // A failed registration costs offline support and nothing on this page, so
    // there is nothing to tell the reader; the console still records it.
    const register = () =>
      void navigator.serviceWorker
        .register(`${base}/sw.js`, { scope: `${base}/` })
        .then(() => navigator.serviceWorker.ready)
        .then((ready) => {
          // This page and its files loaded before the worker could see them;
          // hand them over so the first page opened is also one kept offline.
          const loaded = performance
            .getEntriesByType("resource")
            .map((entry) => entry.name)
            .filter((name) => name.startsWith(location.origin));
          // Without the fragment: a shared report's key lives there, and the
          // page is the same page without it.
          const here = location.origin + location.pathname + location.search;
          ready.active?.postMessage({ type: "keep", urls: [here, ...loaded] });
        })
        .catch((error) => console.warn("service worker not registered", error));
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);
  return null;
}
