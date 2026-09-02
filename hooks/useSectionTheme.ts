"use client";

import { useEffect, useState } from "react";

/** Osmo Supply "Check section theme on scroll" pattern, ported to React
 * state. Watches every [data-theme-section] (and its sibling
 * [data-bg-section]) and reports whichever one currently sits behind the
 * given offset — typically half the nav's own height — so the nav can adopt
 * that section's theme/background as the visitor scrolls past it. */
export function useSectionTheme(offset: number) {
  const [theme, setTheme] = useState<string | null>(null);
  const [bg, setBg] = useState<string | null>(null);

  useEffect(() => {
    let ticking = false;

    function check() {
      const sections = document.querySelectorAll<HTMLElement>("[data-theme-section]");
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom >= offset) {
          setTheme(section.getAttribute("data-theme-section"));
          setBg(section.getAttribute("data-bg-section"));
          break;
        }
      }
      ticking = false;
    }

    function onScrollOrResize() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(check);
      }
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    check();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [offset]);

  return { theme, bg };
}
