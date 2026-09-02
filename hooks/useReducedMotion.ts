"use client";

import { useCallback, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useReducedMotion(): boolean {
  const subscribe = useCallback((callback: () => void) => {
    const mq = window.matchMedia(QUERY);
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
