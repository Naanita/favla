"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { Observer } from "gsap/Observer";
import { useIsTouchDevice } from "@/hooks/useMediaQuery";
import { prefersStaticMotion } from "@/lib/animations";
import { getMediaUrl, getMediaAlt, type MediaField } from "@/lib/media";
import { resolveBlockBackground } from "@/lib/blockBackground";

gsap.registerPlugin(useGSAP, CustomEase, Observer);

CustomEase.create("sliderMove", "M0,0 C0.42,0 0.001,1 1,1");
CustomEase.create("sliderFade", "M0,0 C0.437,0 0.093,0.943 1,1");
CustomEase.create("progressFill", "M0,0 C0.344,0.026 0.355,0.994 1,1");

const SLIDE_DURATION = 1.5;
const INACTIVE_OPACITY = 0.04;
const ACTIVE_OPACITY = 1;
const DEFAULT_AUTOPLAY_DELAY = 3000;
const SWIPE_DRAG_MINIMUM = 20;
const HOVER_BG = "rgba(28, 22, 10, 0.08)";
const HOVER_BG_OUT = "rgba(28, 22, 10, 0)";
const INACTIVE_CARD_COLOR = "#8a8a85";
const DEFAULT_ACTIVE_CARD_COLOR = "#1C160A";

type SlideLink = { label?: string | null; url?: string | null; newTab?: boolean | null } | null | undefined;

type ViewAllButton = { label?: string | null; link?: string | null; cursorGrow?: boolean | null } | null | undefined;

type Slide = {
  id?: string;
  title: string;
  description: string;
  image?: MediaField;
  imageAltOverride?: string | null;
  link?: SlideLink;
};

type Behavior =
  | {
      initialSlide?: number | null;
      loop?: boolean | null;
      autoplay?: boolean | null;
      autoplayDelayMs?: number | null;
      enableTouchSwipe?: boolean | null;
      sectionAriaLabel?: string | null;
    }
  | null
  | undefined;

type RenderedSlide = { key: string; realIndex: number; isClone: boolean };

type Direction = "next" | "prev";

export function SplitFeatureSlider({
  eyebrow,
  heading,
  description,
  viewAllButton,
  contentCardColor,
  slides = [],
  behavior,
  cursorMarquee = true,
  backgroundColor,
}: {
  eyebrow?: string | null;
  heading: string;
  description?: string | null;
  viewAllButton?: ViewAllButton;
  contentCardColor?: string | null;
  slides?: Slide[];
  behavior?: Behavior;
  cursorMarquee?: boolean | null;
  backgroundColor?: string | null;
}) {
  const sectionBg = resolveBlockBackground(backgroundColor);
  const realSlides = slides;
  const loop = (behavior?.loop ?? true) && realSlides.length >= 2;
  const autoplay = behavior?.autoplay ?? true;
  const autoplayDelayMs = behavior?.autoplayDelayMs || DEFAULT_AUTOPLAY_DELAY;
  const enableTouchSwipe = behavior?.enableTouchSwipe ?? true;
  const sectionAriaLabel = behavior?.sectionAriaLabel || "Featured content carousel";
  const activeCardColor = contentCardColor || DEFAULT_ACTIVE_CARD_COLOR;
  const isTouch = useIsTouchDevice();

  const initialRealIndex = Math.min(
    Math.max(behavior?.initialSlide ?? 0, 0),
    Math.max(realSlides.length - 1, 0),
  );

  const rendered: RenderedSlide[] = useMemo(() => {
    if (realSlides.length === 0) return [];
    if (!loop) return realSlides.map((_, i) => ({ key: `real-${i}`, realIndex: i, isClone: false }));
    const lastIndex = realSlides.length - 1;
    return [
      { key: "clone-last", realIndex: lastIndex, isClone: true },
      ...realSlides.map((_, i) => ({ key: `real-${i}`, realIndex: i, isClone: false })),
      { key: "clone-first", realIndex: 0, isClone: true },
    ];
  }, [realSlides, loop]);

  const initialRenderedIndex = loop ? initialRealIndex + 1 : initialRealIndex;
  const priorityIndices = new Set(
    [initialRenderedIndex - 1, initialRenderedIndex, initialRenderedIndex + 1].filter(
      (i) => i >= 0 && i < rendered.length,
    ),
  );

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideElsRef = useRef<(HTMLElement | null)[]>([]);
  const contentCardElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressFillElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const prevIconRef = useRef<SVGSVGElement>(null);
  const nextIconRef = useRef<SVGSVGElement>(null);
  const viewAllBtnRef = useRef<HTMLAnchorElement>(null);

  const renderedIndexRef = useRef(initialRenderedIndex);
  const navigateRef = useRef<(direction: Direction) => void>(() => {});

  const [activeRealIndex, setActiveRealIndex] = useState(initialRealIndex);

  useGSAP(
    () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport || rendered.length === 0) return;

      renderedIndexRef.current = initialRenderedIndex;

      const isAnimatingRef = { current: false };
      const pendingDirectionRef = { current: null as Direction | null };
      const progressTweenRef = { current: null as gsap.core.Tween | null };
      const isIntersectingRef = { current: true };
      const isKeyboardFocusedRef = { current: false };
      const isHoveredRef = { current: false };
      const reducedMotionRef = { current: prefersStaticMotion() };
      const touchNavigatedRef = { current: false };

      function getSlideEl(i: number) {
        return slideElsRef.current[i] ?? null;
      }

      function computeTargetX(renderedIdx: number) {
        const el = getSlideEl(renderedIdx);
        if (!el || !viewport) return 0;
        const viewportCenter = viewport.clientWidth / 2;
        return viewportCenter - (el.offsetLeft + el.offsetWidth / 2);
      }

      function setAllOpacitiesAndColors(activeRenderedIdx: number) {
        slideElsRef.current.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, { opacity: i === activeRenderedIdx ? ACTIVE_OPACITY : INACTIVE_OPACITY });
        });
        contentCardElsRef.current.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, { backgroundColor: i === activeRenderedIdx ? activeCardColor : INACTIVE_CARD_COLOR });
        });
      }

      function killProgress() {
        progressTweenRef.current?.kill();
        progressTweenRef.current = null;
      }

      function canAutoplay() {
        return (
          autoplay &&
          !reducedMotionRef.current &&
          isIntersectingRef.current &&
          !isKeyboardFocusedRef.current &&
          !isHoveredRef.current &&
          !document.hidden
        );
      }

      function startProgress() {
        killProgress();
        const activeFill = progressFillElsRef.current[renderedIndexRef.current];
        if (!activeFill) return;
        gsap.set(activeFill, { scaleX: 0 });
        if (!canAutoplay()) return;
        progressTweenRef.current = gsap.to(activeFill, {
          scaleX: 1,
          duration: autoplayDelayMs / 1000,
          ease: "progressFill",
          onComplete: () => navigate("next"),
        });
      }

      function pauseProgress() {
        if (isAnimatingRef.current) return;
        progressTweenRef.current?.pause();
      }

      function resumeProgress() {
        if (isAnimatingRef.current) return;
        if (progressTweenRef.current) {
          if (canAutoplay()) progressTweenRef.current.play();
        } else if (canAutoplay()) {
          startProgress();
        }
      }

      function mapRenderedToReal(renderedIdx: number) {
        return rendered[renderedIdx]?.realIndex ?? 0;
      }

      function finishTransition(landedRenderedIndex: number) {
        let finalIdx = landedRenderedIndex;
        if (loop) {
          const lastCloneIdx = rendered.length - 1;
          if (landedRenderedIndex === lastCloneIdx) {
            finalIdx = 1;
          } else if (landedRenderedIndex === 0) {
            finalIdx = rendered.length - 2;
          }
          if (finalIdx !== landedRenderedIndex) {
            gsap.set(track, { x: computeTargetX(finalIdx) });
            const staleEl = getSlideEl(landedRenderedIndex);
            const realEl = getSlideEl(finalIdx);
            if (staleEl) gsap.set(staleEl, { opacity: INACTIVE_OPACITY });
            if (realEl) gsap.set(realEl, { opacity: ACTIVE_OPACITY });
            const staleCard = contentCardElsRef.current[landedRenderedIndex];
            const realCard = contentCardElsRef.current[finalIdx];
            if (staleCard) gsap.set(staleCard, { backgroundColor: INACTIVE_CARD_COLOR });
            if (realCard) gsap.set(realCard, { backgroundColor: activeCardColor });
          }
        }

        renderedIndexRef.current = finalIdx;
        isAnimatingRef.current = false;
        setActiveRealIndex(mapRenderedToReal(finalIdx));
        startProgress();

        if (pendingDirectionRef.current) {
          const pending = pendingDirectionRef.current;
          pendingDirectionRef.current = null;
          runTransition(pending);
        }
      }

      function runTransition(direction: Direction) {
        const total = rendered.length;
        if (total <= 1) return;

        const targetIndex = renderedIndexRef.current + (direction === "next" ? 1 : -1);
        if (!loop) {
          if (targetIndex < 0 || targetIndex > total - 1) return;
        }

        isAnimatingRef.current = true;
        killProgress();

        const outgoingEl = getSlideEl(renderedIndexRef.current);
        const incomingEl = getSlideEl(targetIndex);
        if (!outgoingEl || !incomingEl) {
          isAnimatingRef.current = false;
          return;
        }

        gsap.set(incomingEl, { opacity: INACTIVE_OPACITY });
        const targetX = computeTargetX(targetIndex);
        const duration = reducedMotionRef.current ? 0.01 : SLIDE_DURATION;
        const outgoingCard = contentCardElsRef.current[renderedIndexRef.current];
        const incomingCard = contentCardElsRef.current[targetIndex];

        const tl = gsap.timeline({
          defaults: { overwrite: "auto" },
          onComplete: () => finishTransition(targetIndex),
        });
        tl.to(track, { x: targetX, duration, ease: "sliderMove", force3D: true, autoRound: false }, 0)
          .to(outgoingEl, { opacity: INACTIVE_OPACITY, duration, ease: "sliderFade" }, 0)
          .to(incomingEl, { opacity: ACTIVE_OPACITY, duration, ease: "sliderFade" }, 0);
        if (outgoingCard) tl.to(outgoingCard, { backgroundColor: INACTIVE_CARD_COLOR, duration, ease: "sliderFade" }, 0);
        if (incomingCard) tl.to(incomingCard, { backgroundColor: activeCardColor, duration, ease: "sliderFade" }, 0);
      }

      function navigate(direction: Direction) {
        if (isAnimatingRef.current) {
          pendingDirectionRef.current = direction;
          return;
        }
        runTransition(direction);
      }
      navigateRef.current = navigate;

      // ---- initial placement (no animation, no flash) ----
      gsap.set(track, { x: computeTargetX(renderedIndexRef.current), force3D: true });
      setAllOpacitiesAndColors(renderedIndexRef.current);
      progressFillElsRef.current.forEach((el) => {
        if (el) gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
      });
      viewport.dataset.ready = "true";

      // ---- resize handling: reposition instantly, never re-animate ----
      const ro = new ResizeObserver(() => {
        gsap.set(track, { x: computeTargetX(renderedIndexRef.current) });
      });
      ro.observe(viewport);

      // ---- breakpoint + reduced-motion contexts ----
      const mm = gsap.matchMedia();
      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isMobile: "(max-width: 767px)",
          isReduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const conditions = (context.conditions ?? {}) as { isReduced?: boolean };
          reducedMotionRef.current = !!conditions.isReduced || prefersStaticMotion();
          gsap.set(track, { x: computeTargetX(renderedIndexRef.current) });
        },
      );

      // ---- keyboard navigation + focus pause/resume (keyboard focus only, not mouse clicks) ----
      const sectionEl = sectionRef.current;
      function onKeyDown(e: KeyboardEvent) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          navigate("next");
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          navigate("prev");
        }
      }
      function onFocusIn(e: FocusEvent) {
        const target = e.target as HTMLElement | null;
        if (!target?.matches(":focus-visible")) return;
        isKeyboardFocusedRef.current = true;
        pauseProgress();
      }
      function onFocusOut() {
        requestAnimationFrame(() => {
          if (sectionEl && !sectionEl.contains(document.activeElement)) {
            isKeyboardFocusedRef.current = false;
            resumeProgress();
          }
        });
      }
      sectionEl?.addEventListener("keydown", onKeyDown);
      sectionEl?.addEventListener("focusin", onFocusIn);
      sectionEl?.addEventListener("focusout", onFocusOut);

      // ---- pointer hover pause/resume ----
      function onPointerEnter() {
        isHoveredRef.current = true;
        pauseProgress();
      }
      function onPointerLeave() {
        isHoveredRef.current = false;
        resumeProgress();
      }
      viewport.addEventListener("pointerenter", onPointerEnter);
      viewport.addEventListener("pointerleave", onPointerLeave);

      // ---- tab visibility pause/resume ----
      function onVisibilityChange() {
        if (document.hidden) pauseProgress();
        else resumeProgress();
      }
      document.addEventListener("visibilitychange", onVisibilityChange);

      // ---- viewport intersection pause/resume ----
      const io = new IntersectionObserver(
        ([entry]) => {
          isIntersectingRef.current = entry.isIntersecting;
          if (!entry.isIntersecting) pauseProgress();
          else resumeProgress();
        },
        { threshold: 0 },
      );
      if (sectionEl) io.observe(sectionEl);

      // ---- touch/pointer swipe (touch devices only) ----
      let swipeObserver: Observer | null = null;
      if (enableTouchSwipe && isTouch) {
        swipeObserver = Observer.create({
          target: viewport,
          type: "touch,pointer",
          dragMinimum: SWIPE_DRAG_MINIMUM,
          tolerance: 10,
          preventDefault: false,
          onPress: () => {
            touchNavigatedRef.current = false;
          },
          onLeft: () => {
            if (touchNavigatedRef.current) return;
            touchNavigatedRef.current = true;
            navigate("next");
          },
          onRight: () => {
            if (touchNavigatedRef.current) return;
            touchNavigatedRef.current = true;
            navigate("prev");
          },
        });
      }

      // ---- control button hover / press micro-interactions ----
      const buttonCleanups: Array<() => void> = [];
      function attachButtonHover(btn: Element | null, icon: SVGSVGElement | null, shift: number) {
        if (!btn) return;
        const onEnter = () => {
          gsap.to(btn, { backgroundColor: HOVER_BG, scale: 1.03, duration: 0.25, ease: "power2.out" });
          if (icon) gsap.to(icon, { x: shift, duration: 0.25, ease: "power2.out" });
        };
        const onLeave = () => {
          gsap.to(btn, { backgroundColor: HOVER_BG_OUT, scale: 1, duration: 0.3, ease: "power2.out" });
          if (icon) gsap.to(icon, { x: 0, duration: 0.3, ease: "power2.out" });
        };
        const onDown = () => gsap.to(btn, { scale: 0.94, duration: 0.12, ease: "power2.out" });
        const onUp = () => gsap.to(btn, { scale: 1.03, duration: 0.18, ease: "power2.out" });
        btn.addEventListener("pointerenter", onEnter);
        btn.addEventListener("pointerleave", onLeave);
        btn.addEventListener("pointerdown", onDown);
        btn.addEventListener("pointerup", onUp);
        buttonCleanups.push(() => {
          btn.removeEventListener("pointerenter", onEnter);
          btn.removeEventListener("pointerleave", onLeave);
          btn.removeEventListener("pointerdown", onDown);
          btn.removeEventListener("pointerup", onUp);
        });
      }
      attachButtonHover(prevBtnRef.current, prevIconRef.current, -2);
      attachButtonHover(nextBtnRef.current, nextIconRef.current, 2);
      attachButtonHover(viewAllBtnRef.current, null, 0);

      // ---- kick off autoplay for the initial slide ----
      startProgress();

      return () => {
        ro.disconnect();
        io.disconnect();
        mm.revert();
        document.removeEventListener("visibilitychange", onVisibilityChange);
        sectionEl?.removeEventListener("keydown", onKeyDown);
        sectionEl?.removeEventListener("focusin", onFocusIn);
        sectionEl?.removeEventListener("focusout", onFocusOut);
        viewport.removeEventListener("pointerenter", onPointerEnter);
        viewport.removeEventListener("pointerleave", onPointerLeave);
        swipeObserver?.kill();
        buttonCleanups.forEach((fn) => fn());
        killProgress();
      };
    },
    { scope: sectionRef, dependencies: [rendered.length, loop, autoplay, autoplayDelayMs, enableTouchSwipe, isTouch] },
  );

  if (realSlides.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      data-theme-section={sectionBg?.theme ?? "light"}
      data-bg-section={sectionBg?.theme ?? "light"}
      style={sectionBg ? { backgroundColor: sectionBg.color } : undefined}
      className="favla-split-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label={sectionAriaLabel}
    >
      <div className="favla-split-slider__header">
        <div className="favla-split-slider__header-left">
          {eyebrow && <span className="favla-split-slider__eyebrow">{eyebrow}</span>}
          <h2 className="favla-split-slider__heading">
            {heading.split("\n").map((line, i) => (
              <span key={i} className="favla-split-slider__heading-line">
                {line}
              </span>
            ))}
          </h2>
          {description && <p className="favla-split-slider__description">{description}</p>}
          {viewAllButton?.label && (
            <Link
              ref={viewAllBtnRef}
              href={viewAllButton.link || "#"}
              className="favla-split-slider__view-all"
              {...(viewAllButton.cursorGrow ? { "data-cursor-grow": true } : {})}
            >
              {viewAllButton.label}
            </Link>
          )}
        </div>
        <div className="favla-split-slider__controls">
          <button
            ref={prevBtnRef}
            type="button"
            className="favla-split-slider__control-btn"
            data-direction="previous"
            aria-label="Previous slide"
            disabled={realSlides.length <= 1 || (!loop && activeRealIndex === 0)}
            onClick={() => navigateRef.current("prev")}
          >
            <svg
              ref={prevIconRef}
              className="favla-split-slider__control-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 5L8 12L15 19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            ref={nextBtnRef}
            type="button"
            className="favla-split-slider__control-btn"
            data-direction="next"
            aria-label="Next slide"
            disabled={realSlides.length <= 1 || (!loop && activeRealIndex === realSlides.length - 1)}
            onClick={() => navigateRef.current("next")}
          >
            <svg
              ref={nextIconRef}
              className="favla-split-slider__control-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 5L16 12L9 19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {`Slide ${activeRealIndex + 1} of ${realSlides.length}`}
      </span>

      <div className="favla-split-slider__viewport" ref={viewportRef}>
        <div className="favla-split-slider__track" ref={trackRef}>
          {rendered.map((entry, renderedIdx) => {
            const slide = realSlides[entry.realIndex];
            if (!slide) return null;
            const isActive = !entry.isClone && entry.realIndex === activeRealIndex;
            const imageAlt = slide.imageAltOverride || getMediaAlt(slide.image, slide.title);
            const hasLink = !!slide.link?.url;

            const cardContent = (
              <>
                <div
                  ref={(el) => {
                    contentCardElsRef.current[renderedIdx] = el;
                  }}
                  className="favla-split-slider__content-card"
                >
                  <h3 className="favla-split-slider__content-title">{slide.title}</h3>
                  <div className="favla-split-slider__bottom">
                    <p className="favla-split-slider__content-description">{slide.description}</p>
                    {slide.link?.label && (
                      <span className="favla-split-slider__content-link">{slide.link.label}</span>
                    )}
                    <div className="favla-split-slider__progress-track">
                      <div
                        ref={(el) => {
                          progressFillElsRef.current[renderedIdx] = el;
                        }}
                        className="favla-split-slider__progress-fill"
                      />
                    </div>
                  </div>
                </div>

                <figure className="favla-split-slider__media-card">
                  <Image
                    src={getMediaUrl(slide.image)}
                    alt={imageAlt}
                    fill
                    sizes="(min-width: 1024px) 46vw, (min-width: 768px) 51vw, 88vw"
                    className="favla-split-slider__media-image"
                    priority={priorityIndices.has(renderedIdx)}
                  />
                </figure>
              </>
            );

            if (hasLink) {
              return (
                <Link
                  key={entry.key}
                  ref={(el) => {
                    slideElsRef.current[renderedIdx] = el;
                  }}
                  href={slide.link?.url || "#"}
                  target={slide.link?.newTab ? "_blank" : undefined}
                  rel={slide.link?.newTab ? "noopener noreferrer" : undefined}
                  className="favla-split-slider__group favla-split-slider__group--link"
                  aria-hidden={!isActive}
                  tabIndex={isActive ? undefined : -1}
                  {...(cursorMarquee ? { "data-cursor-marquee-text": slide.link?.label || slide.title } : {})}
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <article
                key={entry.key}
                ref={(el) => {
                  slideElsRef.current[renderedIdx] = el;
                }}
                className="favla-split-slider__group"
                aria-hidden={!isActive}
              >
                {cardContent}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
