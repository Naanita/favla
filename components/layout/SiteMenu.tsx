"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersStaticMotion } from "@/lib/animations";
import { CtaButton, type CtaButtonType } from "@/components/ui/CtaButton";
import { ThemeToggleButton } from "@/components/ui/ThemeToggleButton";
import { LanguageModal } from "@/components/ui/LanguageModal";

gsap.registerPlugin(useGSAP);

type NavItem = { label: string; link: string; openInNewTab?: boolean | null };

/** Full-screen mobile menu opened by the navbar hamburger: every nav link
 * as a big list, plus the CTA, language picker and theme toggle that don't
 * fit in the compact mobile bar. */
export function SiteMenu({
  open,
  onClose,
  items = [],
  primaryButton,
}: {
  open: boolean;
  onClose: () => void;
  items?: NavItem[];
  primaryButton?: {
    label?: string | null;
    link?: string | null;
    type?: CtaButtonType | null;
    cursorGrow?: boolean | null;
  } | null;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const links = listRef.current?.querySelectorAll("li");
      const footer = footerRef.current;
      if (!panel) return;

      const reduced = prefersStaticMotion();

      if (open) {
        gsap.set(panel, { display: "flex" });
        if (reduced) {
          gsap.set(panel, { clipPath: "inset(0% 0% 0% 0%)" });
        } else {
          // One overlapping timeline: an expo curtain reveal with the list
          // and footer easing in while it's still finishing, so the whole
          // sequence reads as a single fluid motion instead of steps.
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          tl.fromTo(
            panel,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" },
          );
          if (links?.length) {
            tl.fromTo(
              links,
              { y: 48, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.07 },
              "-=0.45",
            );
          }
          if (footer) {
            tl.fromTo(footer, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.55");
          }
        }
      } else {
        if (reduced) {
          gsap.set(panel, { display: "none" });
        } else {
          gsap.to(panel, {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.55,
            ease: "expo.inOut",
            onComplete: () => gsap.set(panel, { display: "none" }),
          });
        }
      }
    },
    { dependencies: [open] },
  );

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => firstLinkRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      className="fixed inset-0 z-[150] hidden flex-col justify-between bg-forest-deep px-6 pb-10 pt-32 text-paper"
      style={{ clipPath: "inset(0% 0% 100% 0%)" }}
    >
      <nav aria-label="Navegación móvil">
        <ul ref={listRef} className="flex flex-col gap-1">
          {items.map((item, i) => (
            <li key={i} className="overflow-hidden border-b border-line-light py-3">
              <Link
                ref={i === 0 ? firstLinkRef : undefined}
                href={item.link}
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                onClick={onClose}
                className="favla-site-menu__link focus-ring flex items-center gap-4 font-serif text-4xl"
              >
                {item.label}
                <span className="favla-site-menu__dot" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div ref={footerRef} className="favla-site-menu__footer">
        {primaryButton?.label && (
          <CtaButton
            type={primaryButton.type || "outline"}
            href={primaryButton.link || "#"}
            label={primaryButton.label}
            tone="light"
            cursorGrow={primaryButton.cursorGrow}
            className="w-fit"
          />
        )}

        <div className="flex items-center gap-2">
          <LanguageModal />
          <ThemeToggleButton />
        </div>
      </div>
    </div>
  );
}
