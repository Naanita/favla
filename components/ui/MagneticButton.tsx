"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  as,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: ElementType;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  const Component = (as ?? "button") as ElementType;

  function handlePointerMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.5,
      ease: "power3.out",
    });
  }

  function handlePointerLeave() {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
  }

  return (
    <Component
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}
