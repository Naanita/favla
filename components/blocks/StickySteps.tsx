"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { lineToHtml } from "@/components/ui/AnimatedHeading";
import { getMediaUrl, getMediaAlt, type MediaField } from "@/lib/media";
import { CtaButton, type CtaButtonType } from "@/components/ui/CtaButton";
import { resolveBlockBackground } from "@/lib/blockBackground";

gsap.registerPlugin(useGSAP);

type Initiative = {
  id?: string;
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  image?: MediaField;
  imageAlt?: string | null;
  link?: string | null;
  linkLabel?: string | null;
  type?: CtaButtonType | null;
  cursorGrow?: boolean | null;
};

/** Osmo Supply "Sticky Steps" — a sticky, crossfading visual on the right
 * that advances to match whichever text panel on the left is currently
 * closest to the viewport center. Recomputed every frame (via gsap.ticker,
 * the same clock Lenis's own smooth-scroll loop runs on — see useLenis)
 * rather than via threshold-crossing ScrollTrigger events: crossing
 * triggers fire once when a boundary is passed, which can read a frame or
 * two behind the actually-closest item while Lenis is still easing toward
 * its target, whereas a continuous "closest anchor wins" check can't drift
 * out of sync with what's on screen. */
export function StickySteps({
  initiatives = [],
  backgroundColor,
}: {
  initiatives?: Initiative[];
  backgroundColor?: string | null;
}) {
  const bg = resolveBlockBackground(backgroundColor);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const anchorRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
      const anchors = anchorRefs.current;
      if (!items.length) return;

      let lastActive = -1;

      function updateSteps() {
        const viewportCenter = window.innerHeight / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        anchors.forEach((anchor, index) => {
          if (!anchor) return;
          const rect = anchor.getBoundingClientRect();
          const anchorCenter = rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - anchorCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        if (closestIndex === lastActive) return;
        lastActive = closestIndex;
        items.forEach((item, index) => {
          item.setAttribute(
            "data-sticky-steps-status",
            index < closestIndex ? "before" : index > closestIndex ? "after" : "active",
          );
        });
      }

      updateSteps();
      gsap.ticker.add(updateSteps);

      return () => gsap.ticker.remove(updateSteps);
    },
    { scope: containerRef, dependencies: [initiatives.length] },
  );

  return (
    <section
      id="iniciativas"
      data-theme-section={bg?.theme ?? "light"}
      data-bg-section={bg?.theme ?? "light"}
      style={bg ? { backgroundColor: bg.color } : undefined}
      className="favla-sticky-steps bg-paper"
    >
      <div ref={containerRef} className="favla-container">
        <div className="favla-sticky-steps__collection">
          <div className="favla-sticky-steps__list">
            {initiatives.map((item, i) => (
              <div
                key={item.id ?? i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-sticky-steps-status={i === 0 ? "active" : "after"}
                className="flex flex-col md:flex-row md:items-start"
              >
                <div
                  ref={(el) => {
                    anchorRefs.current[i] = el;
                  }}
                  className="favla-sticky-steps__text"
                >
                  {item.eyebrow && <span className="favla-eyebrow text-muted">{item.eyebrow}</span>}
                  <h2
                    className="font-serif text-3xl leading-tight text-ink md:text-5xl"
                    dangerouslySetInnerHTML={{ __html: lineToHtml(item.title) }}
                  />
                  {item.description && (
                    <p className="text-base leading-relaxed text-muted md:text-lg">{item.description}</p>
                  )}
                  {item.link && (
                    <CtaButton
                      type={item.type || "arrow"}
                      href={item.link}
                      label={item.linkLabel || "Conoce más"}
                      tone="dark"
                      cursorGrow={item.cursorGrow}
                      className="mt-2 w-fit"
                    />
                  )}
                </div>

                <div className="favla-sticky-steps__media">
                  <div className="favla-sticky-steps__sticky">
                    <div className="favla-sticky-steps__visual">
                      <div className="favla-sticky-steps__cover">
                        <Image
                          src={getMediaUrl(item.image)}
                          alt={getMediaAlt(item.image, item.imageAlt || item.title)}
                          fill
                          sizes="(min-width: 992px) 40vw, 90vw"
                          className="favla-sticky-steps__cover-image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
