"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersStaticMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function AnimatedCounter({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^([\d.,]+)(.*)$/);
  const numericPart = match ? match[1] : value;
  const suffix = match ? match[2] : "";
  const targetNumber = parseInt(numericPart.replace(/[.,]/g, ""), 10) || 0;
  const hasThousandsSep = /[.,]/.test(numericPart);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduced = prefersStaticMotion();

      if (reduced) {
        el.textContent = value;
        return;
      }

      const counter = { val: 0 };
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            val: targetNumber,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              const rounded = Math.round(counter.val);
              el.textContent = (hasThousandsSep ? rounded.toLocaleString("es-CO") : String(rounded)) + suffix;
            },
          });
        },
      });

      return () => st.kill();
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <span ref={ref} className={className}>{`0${suffix}`}</span>
  );
}
