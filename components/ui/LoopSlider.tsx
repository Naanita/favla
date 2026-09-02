"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { horizontalLoop, type HorizontalLoopTimeline } from "@/lib/horizontalLoop";
import { prefersStaticMotion } from "@/lib/animations";

function CornerButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Slide anterior" : "Siguiente slide"}
      className="favla-slider-btn focus-ring"
    >
      <svg
        className={`favla-slider-btn__arrow ${direction === "next" ? "favla-slider-btn__arrow--next" : ""}`}
        viewBox="0 0 17 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6.28871 12L7.53907 10.9111L3.48697 6.77778H16.5V5.22222H3.48697L7.53907 1.08889L6.28871 0L0.5 6L6.28871 12Z"
          fill="currentColor"
        />
      </svg>
      <span className="favla-slider-btn__overlay" aria-hidden="true">
        <span className="favla-slider-btn__corner" />
        <span className="favla-slider-btn__corner top-right" />
        <span className="favla-slider-btn__corner bottom-left" />
        <span className="favla-slider-btn__corner bottom-right" />
      </span>
    </button>
  );
}

export function LoopSlider<T>({
  items,
  renderItem,
  itemClassName = "",
  ariaLabel,
  tone = "dark",
}: {
  items: T[];
  renderItem: (item: T, index: number, isActive: boolean) => ReactNode;
  itemClassName?: string;
  ariaLabel?: string;
  tone?: "dark" | "light";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HorizontalLoopTimeline | null>(null);
  const digitRowRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  const count = items.length;

  useEffect(() => {
    const row = digitRowRef.current;
    if (!row) return;

    const measure = () => setRowHeight(row.getBoundingClientRect().height);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;

    const staticMotion = prefersStaticMotion();
    const slides = Array.from(track.children) as HTMLElement[];

    const loop = horizontalLoop(slides, {
      paused: true,
      draggable: !staticMotion,
      center: false,
      onChange: (_el, index) => setActiveIndex(index),
    });
    loopRef.current = loop;

    // horizontalLoop repositions the slides (and, on the first item, may
    // shift layout) after each card's own entrance ScrollTrigger has
    // already measured its start position. Refresh once the new layout has
    // painted so those triggers don't stay stuck mid-way through their
    // "from" state.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      loop.kill();
      loopRef.current = null;
    };
  }, [count]);

  function goPrev() {
    loopRef.current?.previous({ ease: "power3", duration: 0.725 });
  }
  function goNext() {
    loopRef.current?.next({ ease: "power3", duration: 0.725 });
  }
  function goTo(i: number) {
    if (i !== activeIndex) loopRef.current?.toIndex(i, { ease: "power3", duration: 0.725 });
  }

  const counterTone = tone === "dark" ? "text-ink" : "text-paper";
  const dividerTone = tone === "dark" ? "bg-line" : "bg-line-light";

  return (
    <div>
      <div ref={trackRef} role="group" aria-label={ariaLabel} className="flex items-stretch">
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => goTo(i)}
            className={`shrink-0 ${i === activeIndex ? "cursor-default" : "cursor-pointer"} ${itemClassName}`}
          >
            {renderItem(item, i, i === activeIndex)}
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className={`flex items-center gap-3 font-serif text-2xl ${counterTone}`}>
          <div className="h-[1em] w-[2ch] overflow-hidden">
            <div
              style={{
                transform: `translateY(${-rowHeight * activeIndex}px)`,
                transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {items.map((_, i) => (
                <div key={i} ref={i === 0 ? digitRowRef : undefined} className="h-[1em] leading-[1]">
                  {String(i + 1).padStart(2, "0")}
                </div>
              ))}
            </div>
          </div>
          <span className={`h-3 w-px rotate-[15deg] ${dividerTone}`} aria-hidden="true" />
          <span>{String(count).padStart(2, "0")}</span>
        </div>

        <div className="favla-slider-nav flex items-center gap-4">
          <CornerButton direction="prev" onClick={goPrev} />
          <CornerButton direction="next" onClick={goNext} />
        </div>
      </div>
    </div>
  );
}
