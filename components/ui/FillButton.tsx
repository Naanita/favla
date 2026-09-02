"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { prefersStaticMotion } from "@/lib/animations";

/** Osmo Supply "Button 046" — a colored circle grows in from wherever the
 * cursor entered, follows it while hovering, then shrinks back out toward
 * wherever the cursor left (nudged further off if it left near an edge, so
 * it doesn't look like it's snapping back to center). Works for any shape
 * via `shape` — "pill" for text CTAs, "circle" for icon-only buttons. */
export function FillButton({
  children,
  as,
  shape = "pill",
  className = "",
  fillClassName = "bg-accent",
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  shape?: "pill" | "circle";
  className?: string;
  fillClassName?: string;
  [key: string]: unknown;
}) {
  const btnRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const Component = (as ?? "button") as ElementType;

  function getXY(e: React.PointerEvent) {
    const el = btnRef.current;
    if (!el) return { x: 50, y: 50 };
    const { left, top, width, height } = el.getBoundingClientRect();
    return {
      x: gsap.utils.clamp(0, 100, gsap.utils.mapRange(0, width, 0, 100, e.clientX - left)),
      y: gsap.utils.clamp(0, 100, gsap.utils.mapRange(0, height, 0, 100, e.clientY - top)),
    };
  }

  function onEnter(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || prefersStaticMotion()) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const { x, y } = getXY(e);
    gsap.set(wrap, { xPercent: x, yPercent: y });
    gsap.to(wrap, { scale: 1, duration: 0.8, ease: "power3.out", overwrite: "auto" });
  }

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || prefersStaticMotion()) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const { x, y } = getXY(e);
    gsap.to(wrap, { xPercent: x, yPercent: y, duration: 0.5, ease: "power1.out", overwrite: "auto" });
  }

  function onLeave(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || prefersStaticMotion()) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const { x, y } = getXY(e);
    gsap.to(wrap, {
      xPercent: x > 90 ? x + 25 : x < 10 ? x - 25 : x,
      yPercent: y > 90 ? y + 25 : y < 10 ? y - 25 : y,
      scale: 0,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  return (
    <Component
      ref={btnRef}
      className={`favla-fill-btn favla-fill-btn--${shape} ${className}`}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...rest}
    >
      <span className="favla-fill-btn__clip" aria-hidden="true">
        <span ref={wrapRef} className="favla-fill-btn__wrap">
          <span className={`favla-fill-btn__fill ${fillClassName}`} />
        </span>
      </span>
      <span className="favla-fill-btn__content">{children}</span>
    </Component>
  );
}
