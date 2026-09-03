"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { prefersStaticMotion } from "@/lib/animations";

gsap.registerPlugin(CustomEase);
CustomEase.create("osmo", "0.625, 0.05, 0, 1");

const LETTERS = "FAVLA".split("");

type TransitionContextValue = {
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used within <PageTransitionProvider>");
  return ctx;
}

/**
 * Osmo-style curved wipe transition, ported to Next's App Router.
 *
 * Barba.js (the library this effect is normally built with) pre-fetches the
 * next page's full HTML and keeps it hidden in the DOM, so its "leave" and
 * "enter" timelines can run back-to-back at fixed offsets. Next's router
 * instead swaps the RSC payload in asynchronously with variable latency, so
 * there's no fixed instant to schedule "enter" against. This splits the
 * effect into two independent timelines: "leave" plays once (fully covering
 * the screen, logo revealed) and holds there for however long the
 * navigation actually takes; "enter" only starts once `usePathname()`
 * confirms the target route has actually mounted.
 */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const pendingHref = useRef<string | null>(null);
  const isAnimating = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || isAnimating.current) return;

      if (prefersStaticMotion()) {
        router.push(href);
        return;
      }

      const panel = panelRef.current;
      const top = topRef.current;
      const bottom = bottomRef.current;
      const logo = logoRef.current;
      const letters = lettersRef.current;
      if (!panel || !top || !bottom || !logo || letters.length === 0) {
        router.push(href);
        return;
      }

      isAnimating.current = true;
      pendingHref.current = href;

      const tl = gsap.timeline({ defaults: { ease: "osmo" } });

      tl.set(panel, { autoAlpha: 1 }, 0);
      tl.set(top, { scaleY: 0, height: "15vw" }, 0);
      tl.set(bottom, { scaleY: 1, height: "20vw" }, 0);
      tl.set(logo, { autoAlpha: 1 }, 0);
      tl.set(letters, { yPercent: 105 }, 0);

      tl.fromTo(panel, { yPercent: 0 }, { yPercent: -100, duration: 1 }, 0);
      tl.fromTo(top, { scaleY: 0 }, { scaleY: 1, duration: 1 }, "<");
      tl.fromTo(
        letters,
        { yPercent: 105 },
        { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: { amount: 0.06 } },
        "<+=0.4",
      );

      // At this point (~1.2s in) the panel fully covers the screen and the
      // logo is fully revealed — it holds here until the route below
      // actually finishes changing, then the effect below runs "enter".
      tl.call(() => router.push(href));
    },
    [pathname, router],
  );

  useEffect(() => {
    if (!isAnimating.current || pendingHref.current !== pathname) return;
    pendingHref.current = null;

    const panel = panelRef.current;
    const bottom = bottomRef.current;
    const letters = lettersRef.current;
    if (!panel || !bottom) {
      isAnimating.current = false;
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "osmo" },
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    tl.fromTo(panel, { yPercent: -100 }, { yPercent: -200, duration: 1 }, 0);
    tl.to(bottom, { scaleY: 0, duration: 1 }, 0);
    tl.to(
      letters,
      { yPercent: -130, duration: 1.2, ease: "expo.inOut", stagger: { amount: -0.06 } },
      0.6,
    );
    tl.set(panel, { autoAlpha: 0 });
  }, [pathname]);

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div className="favla-transition" aria-hidden="true">
        <div ref={panelRef} className="favla-transition__panel">
          <div ref={topRef} className="favla-transition__panel-top">
            <div className="favla-transition__panel-circle" />
          </div>
          <div ref={bottomRef} className="favla-transition__panel-bottom">
            <div className="favla-transition__panel-circle" />
          </div>
        </div>
        <div ref={logoRef} className="favla-transition__logo">
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) lettersRef.current[i] = el;
              }}
              className="favla-transition__letter"
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
