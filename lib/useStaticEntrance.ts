"use client";

import { useSyncExternalStore } from "react";
import { prefersStaticMotion } from "@/lib/animations";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getServerSnapshot() {
  // The server can't know about reduced-motion or the admin iframe, so it
  // must report "interactive" — matching what the client's first hydration
  // pass will also compute if we didn't, this keeps SSR and hydration in
  // sync. React re-checks the real value via prefersStaticMotion right after.
  return false;
}

/** True once mounted in the admin Live Preview iframe or under
 * prefers-reduced-motion — hydration-safe (see subscribe/getServerSnapshot
 * above) so components can swap a scroll-driven entrance for a compact
 * static one without a server/client markup mismatch. */
export function useStaticEntrance(): boolean {
  return useSyncExternalStore(subscribe, prefersStaticMotion, getServerSnapshot);
}
