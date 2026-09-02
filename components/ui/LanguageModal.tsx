"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
];

// Same-tab localStorage writes don't fire a native "storage" event, so this
// keeps its own tiny subscriber list and notifies it manually from
// setLanguagePreference — the useSyncExternalStore pattern still buys us a
// hydration-safe read (see hooks/useMediaQuery.ts for the same idea).
let languageListeners: Array<() => void> = [];

function subscribeLanguage(callback: () => void) {
  languageListeners.push(callback);
  return () => {
    languageListeners = languageListeners.filter((l) => l !== callback);
  };
}

function getLanguageSnapshot() {
  try {
    return localStorage.getItem("language") || "es";
  } catch {
    return "es";
  }
}

function getLanguageServerSnapshot() {
  return "es";
}

function setLanguagePreference(code: string) {
  try {
    localStorage.setItem("language", code);
  } catch {
    // localStorage unavailable — selection just won't persist
  }
  languageListeners.forEach((listener) => listener());
}

/** Visual-only language picker: stores the choice in localStorage for a
 * future i18n pass to read, but doesn't translate any content yet — every
 * page is still Spanish-only. */
export function LanguageModal({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const language = useSyncExternalStore(subscribeLanguage, getLanguageSnapshot, getLanguageServerSnapshot);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function selectLanguage(code: string) {
    setLanguagePreference(code);
    close();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={`favla-language-trigger ${className}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Cambiar idioma"
      >
        {language.toUpperCase()}
      </button>

      {open &&
        createPortal(
          <div className="favla-language-modal" role="presentation" onClick={close}>
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Seleccionar idioma"
              className="favla-language-modal__panel"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="favla-language-modal__title">Idioma</p>
              <ul className="favla-language-modal__list">
                {LANGUAGES.map((lang) => (
                  <li key={lang.code}>
                    <button
                      type="button"
                      onClick={() => selectLanguage(lang.code)}
                      aria-current={language === lang.code}
                      className="favla-language-modal__option"
                    >
                      {lang.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
