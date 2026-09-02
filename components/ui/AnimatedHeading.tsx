"use client";

import { useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { STAGGER, prefersStaticMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function lineToHtml(line: string) {
  return line
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part) => {
      const isItalic = part.startsWith("*") && part.endsWith("*");
      const text = escapeHtml(isItalic ? part.slice(1, -1) : part);
      return isItalic ? `<span class="italic font-serif text-accent">${text}</span>` : text;
    })
    .join("");
}

export function AnimatedHeading({
  lines,
  as = "h2",
  className = "",
  trigger = "scroll",
  stagger = STAGGER.base,
  delay = 0,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  trigger?: "scroll" | "mount";
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;
  const html = lines.map(lineToHtml).join("<br />");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      let split: SplitText | null = null;
      let cancelled = false;

      const run = () => {
        if (cancelled || !el) return;

        if (prefersStaticMotion()) {
          gsap.set(el, { autoAlpha: 1 });
          return;
        }

        split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "line",
          onSplit(instance) {
            gsap.set(el, { autoAlpha: 1 });
            return gsap.from(instance.lines, {
              yPercent: 110,
              duration: 0.9,
              stagger,
              delay,
              ease: "expo.out",
              scrollTrigger:
                trigger === "scroll" ? { trigger: el, start: "clamp(top 80%)", once: true } : undefined,
            });
          },
        });
      };

      if (document.fonts?.ready) {
        document.fonts.ready.then(run);
      } else {
        run();
      }

      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { scope: ref, dependencies: [html, trigger, stagger, delay] },
  );

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ visibility: "hidden" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Same masked-line scroll reveal as AnimatedHeading, tuned for body copy:
 * defaults to a <p> tag and a lighter/faster stagger so paragraphs don't
 * feel as ceremonious as display headings.
 */
export function AnimatedText({
  text,
  as = "p",
  className = "",
  trigger = "scroll",
  stagger = STAGGER.tight,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  trigger?: "scroll" | "mount";
  stagger?: number;
  delay?: number;
}) {
  return (
    <AnimatedHeading
      as={as}
      lines={text.split("\n")}
      className={className}
      trigger={trigger}
      stagger={stagger}
      delay={delay}
    />
  );
}
