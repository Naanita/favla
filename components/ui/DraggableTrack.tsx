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
    // computed column-gap is the string "normal" (not "0") on flex
    // containers without an explicit gap — parseFloat("normal") is NaN,
    // which silently poisoned every scroll target into 0.
    const gap = Number.parseFloat(style.columnGap || style.gap || "0");
    return first.getBoundingClientRect().width + (Number.isFinite(gap) ? gap : 0);
  }, []);

  useImperativeHandle(ref, () => ({
    scrollByCards(direction) {
      const track = trackRef.current;
      const step = getStep();
      if (!track || !step) return;
      // scrollBy on a snap-mandatory container can get cancelled by the snap
      // engine and land back where it started — computing the target snap
      // index and scrolling to its exact position is reliable everywhere.
      const current = Math.round(track.scrollLeft / step);
      const maxIndex = Math.ceil((track.scrollWidth - track.clientWidth) / step);
      const next = Math.max(0, Math.min(maxIndex, current + direction));
      track.scrollTo({ left: step * next, behavior: "smooth" });
    },
    scrollToIndex(index) {
      const track = trackRef.current;
      if (!track) return;
      track.scrollTo({ left: getStep() * index, behavior: "smooth" });
    },
  }));

  // With snap-mandatory, a card can only be navigated to if its snap-start
  // position is reachable — otherwise the snap engine reverts the scroll to
  // the nearest reachable point (with 2 cards, that's always 0, so arrows
  // appear dead). A trailing spacer of (track width - card width) makes
  // every card's snap-start reachable. It must be a real element, not track
  // padding: the cards' percentage widths resolve against the track's
  // content box, so padding would shrink them in a feedback loop.
  const spacerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function updateSpacer() {
      const el = trackRef.current;
      const spacer = spacerRef.current;
      const first = el?.children[0] as HTMLElement | undefined;
      if (!el || !spacer || !first || first === spacer) return;
      const width = Math.max(0, el.clientWidth - first.getBoundingClientRect().width);
      spacer.style.width = `${width}px`;
    }
    updateSpacer();
    const ro = new ResizeObserver(updateSpacer);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

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
      <div ref={spacerRef} aria-hidden="true" className="shrink-0" />
    </div>
  );
});
