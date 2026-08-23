"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import { LocalAdapter, makeStore, type Store } from "@/core/store";

/**
 * One store per tab, created lazily on the client.
 *
 * `makeStore` is called inside a ref rather than at module scope so it is never
 * constructed during server rendering, where `localStorage` does not exist and
 * every reader would share one process-wide object. The adapter already
 * survives having no storage — it falls back to memory — but sharing one memory
 * store between two visitors on a server is not a fallback, it is a leak.
 */
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // `useState`'s initialiser runs once and never during a later render, which
  // is what makes it safe here — an assignment to a ref during render is not.
  const [store] = useState(() =>
    makeStore(new LocalAdapter(typeof window === "undefined" ? undefined : window.localStorage)),
  );
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside a StoreProvider");
  return store;
}

/**
 * Re-render when anything in the store changes.
 *
 * `useSyncExternalStore` rather than an effect plus state: it is the API React
 * provides for exactly this shape, and it does not tear during a concurrent
 * render the way a manually-subscribed `useState` can.
 */
export function useStoreVersion(): number {
  const store = useStore();
  return useSyncExternalStore(
    (onChange) => store.subscribe(onChange),
    () => store.version(),
    // The server has no store and no writes, so its snapshot is a constant.
    // Returning `store.version()` here instead would read a client-only object
    // during server rendering.
    () => 0,
  );
}
