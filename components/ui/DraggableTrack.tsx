"use client";

import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type DraggableTrackHandle = {
  scrollByCards: (direction: 1 | -1) => void;
  scrollToIndex: (index: number) => void;
};

export const DraggableTrack = forwardRef<
  DraggableTrackHandle,
  {
    children: React.ReactNode;
    className?: string;
    itemClassName?: string;
    ariaLabel?: string;
    onActiveIndexChange?: (index: number) => void;
  }
>(function DraggableTrack({ children, className = "", itemClassName = "", ariaLabel, onActiveIndexChange }, ref) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, startScroll: 0, dragging: false, moved: false });
  const [count] = useState(() => Children.count(children));

  const getStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const first = track.children[0] as HTMLElement | undefined;
    if (!first) return 0;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0");
    return first.getBoundingClientRect().width + gap;
  }, []);

  useImperativeHandle(ref, () => ({
    scrollByCards(direction) {
      const track = trackRef.current;
      if (!track) return;
      track.scrollBy({ left: getStep() * direction, behavior: "smooth" });
    },
    scrollToIndex(index) {
      const track = trackRef.current;
      if (!track) return;
      track.scrollTo({ left: getStep() * index, behavior: "smooth" });
    },
  }));

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !onActiveIndexChange) return;
    const notify = onActiveIndexChange;
    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const step = getStep();
        if (!step || !track) return;
        const index = Math.round(track.scrollLeft / step);
        notify(Math.max(0, Math.min(count - 1, index)));
      });
    }
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [getStep, onActiveIndexChange, count]);

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "touch") return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = { startX: e.clientX, startScroll: track.scrollLeft, dragging: true, moved: false };
    track.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current.dragging) return;
    const track = trackRef.current;
    if (!track) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 4) drag.current.moved = true;
    track.scrollLeft = drag.current.startScroll - delta;
  }

  function onPointerUp(e: React.PointerEvent) {
    const track = trackRef.current;
    drag.current.dragging = false;
    if (track && track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
  }

  function onClickCapture(e: React.MouseEvent) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  return (
    <div
      ref={trackRef}
      role="group"
      aria-label={ariaLabel}
      className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth ${className}`}
      style={{ touchAction: "pan-y", cursor: "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onClickCapture={onClickCapture}
    >
      {Children.map(children, (child, i) => (
        <div className={`snap-start shrink-0 ${itemClassName}`} key={i}>
          {child}
        </div>
      ))}
    </div>
  );
});
