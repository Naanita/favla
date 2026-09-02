"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";
import { prefersStaticMotion } from "@/lib/animations";

const HOVER_OUT_DELAY = 0.4; // seconds before pausing the marquee after leaving a trigger
const FOLLOW_DURATION = 0.4; // seconds for the cursor to catch up to the pointer
const SPEED_MULTIPLIER = 5; // higher = faster marquee scroll

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLSpanElement[]>([]);
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (isTouch) return;
    const cursor = cursorRef.current;
    if (!cursor || prefersStaticMotion()) return;

    const targets = textRefs.current;
    const xTo = gsap.quickTo(cursor, "x", { duration: FOLLOW_DURATION, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: FOLLOW_DURATION, ease: "power3" });

    let pauseTimeout: ReturnType<typeof setTimeout> | null = null;
    let activeEl: HTMLElement | null = null;
    let lastX = 0;
    let lastY = 0;

    function playFor(el: HTMLElement) {
      if (pauseTimeout) clearTimeout(pauseTimeout);
      const text = el.getAttribute("data-cursor-marquee-text");
      if (text !== null) {
        const seconds = (text.length || 1) / SPEED_MULTIPLIER;
        targets.forEach((t) => {
          t.textContent = text;
          t.style.animationPlayState = "running";
          t.style.animationDuration = `${seconds}s`;
        });
        cursor!.setAttribute("data-cursor-marquee-mode", "text");
      } else {
        targets.forEach((t) => {
          t.style.animationPlayState = "paused";
        });
        cursor!.setAttribute("data-cursor-marquee-mode", "grow");
      }
      cursor!.setAttribute("data-cursor-marquee-status", "active");
      activeEl = el;
    }

    function pauseLater() {
      cursor!.setAttribute("data-cursor-marquee-status", "not-active");
      if (pauseTimeout) clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(() => {
        targets.forEach((t) => {
          t.style.animationPlayState = "paused";
        });
      }, HOVER_OUT_DELAY * 1000);
      activeEl = null;
    }

    function checkTarget() {
      const el = document.elementFromPoint(lastX, lastY);
      const hit =
        (el as HTMLElement | null)?.closest<HTMLElement>("[data-cursor-marquee-text], [data-cursor-grow]") ?? null;
      if (hit !== activeEl) {
        if (activeEl) pauseLater();
        if (hit) playFor(hit);
      }
    }

    function onMove(e: PointerEvent) {
      lastX = e.clientX;
      lastY = e.clientY;
      xTo(lastX);
      yTo(lastY);
      checkTarget();
    }

    function onScroll() {
      xTo(lastX);
      yTo(lastY);
      checkTarget();
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (pauseTimeout) clearTimeout(pauseTimeout);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div ref={cursorRef} className="cursor-marquee" data-cursor-marquee-status="not-active" aria-hidden="true">
      <div className="cursor-marquee__card">
        <span
          ref={(el) => {
            if (el) textRefs.current[0] = el;
          }}
          className="cursor-marquee__text-span"
        />
        <span
          ref={(el) => {
            if (el) textRefs.current[1] = el;
          }}
          className="cursor-marquee__text-span is--duplicate"
        />
      </div>
    </div>
  );
}
