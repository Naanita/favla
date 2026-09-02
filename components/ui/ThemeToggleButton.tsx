"use client";

import { useSyncExternalStore } from "react";

function subscribeThemeStatus(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme-status"] });
  return () => observer.disconnect();
}

function getThemeStatusSnapshot() {
  return document.documentElement.getAttribute("data-theme-status") === "dark";
}

function getThemeStatusServerSnapshot() {
  return false;
}

/** Osmo Supply "Dark/light mode toggle" pattern, adapted to use localStorage
 * instead of a cookie library. Toggles [data-theme-status] on <html>; the
 * matching no-flash init script lives in app/(frontend)/layout.tsx. The DOM
 * attribute is the single source of truth — a MutationObserver via
 * useSyncExternalStore keeps this component in sync without a hydration
 * mismatch (same pattern as hooks/useMediaQuery.ts). */
export function ThemeToggleButton({ className = "" }: { className?: string }) {
  const isDark = useSyncExternalStore(subscribeThemeStatus, getThemeStatusSnapshot, getThemeStatusServerSnapshot);

  function toggleTheme() {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme-status", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme just won't persist
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`favla-theme-toggle ${className}`}
      aria-pressed={isDark}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <span className="favla-theme-toggle__icon">
        <span className={`favla-theme-toggle__icon-box ${isDark ? "is--hidden" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" width="100%" aria-hidden="true">
            <path
              d="M15.5355 8.46447C17.4882 10.4171 17.4882 13.5829 15.5355 15.5355C13.5829 17.4882 10.4171 17.4882 8.46447 15.5355C6.51184 13.5829 6.51184 10.4171 8.46447 8.46447C10.4171 6.51184 13.5829 6.51184 15.5355 8.46447Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M12 22V20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.3599 5.63999L19.0699 4.92999"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.93018 19.07L5.64018 18.36"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M20 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M18.3599 18.36L19.0699 19.07"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.93018 4.92999L5.64018 5.63999"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={`favla-theme-toggle__icon-box is--absolute ${isDark ? "" : "is--hidden"}`}>
          <svg viewBox="0 0 24 24" fill="none" width="100%" aria-hidden="true">
            <path
              d="M18.395 13.027C18.725 12.872 19.077 13.197 18.985 13.55C18.671 14.752 18.054 15.896 17.104 16.846C14.283 19.667 9.77001 19.726 7.02201 16.978C4.27401 14.23 4.33401 9.71601 7.15501 6.89501C8.10501 5.94501 9.24801 5.32801 10.451 5.01401C10.804 4.92201 11.128 5.27401 10.974 5.60401C9.97201 7.74301 10.301 10.305 11.998 12.002C13.694 13.7 16.256 14.029 18.395 13.027Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
      <span className="favla-theme-toggle__word">
        <span className={`favla-theme-toggle__word-p ${isDark ? "is--hidden" : ""}`}>Claro</span>
        <span className={`favla-theme-toggle__word-p is--absolute ${isDark ? "" : "is--hidden"}`}>Oscuro</span>
      </span>
    </button>
  );
}
