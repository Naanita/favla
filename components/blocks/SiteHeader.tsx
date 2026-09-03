"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CtaButton, type CtaButtonType } from "@/components/ui/CtaButton";
import { ThemeToggleButton } from "@/components/ui/ThemeToggleButton";
import { LanguageModal } from "@/components/ui/LanguageModal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { SiteMenu } from "@/components/layout/SiteMenu";
import { getMediaUrl, getMediaAlt, type MediaField } from "@/lib/media";
import { useSectionTheme } from "@/hooks/useSectionTheme";

type NavItem = { label: string; link: string; openInNewTab?: boolean | null };

const NAV_OFFSET = 40; // roughly half the navbar's height, used to sample which section sits behind it

export function SiteHeader({
  logo,
  navigationItems,
  primaryButton,
  menuLabel = "Menú",
}: {
  logo?: MediaField;
  navigationItems?: NavItem[] | null;
  primaryButton?: {
    label?: string | null;
    link?: string | null;
    type?: CtaButtonType | null;
    cursorGrow?: boolean | null;
  } | null;
  menuLabel?: string | null;
  sticky?: boolean | null;
  hideOnScrollDown?: boolean | null;
}) {
  const navItems = navigationItems ?? [];
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useSectionTheme(NAV_OFFSET);
  const navTheme = theme || "light";

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [menuOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <nav className="favla-navbar" data-theme-nav={navTheme} aria-label="Navegación principal">
        <Link href="/" className="favla-navbar__logo focus-ring" aria-label="FAVLA — inicio">
          {logo ? (
            <Image
              src={getMediaUrl(logo)}
              alt={getMediaAlt(logo, "FAVLA")}
              width={100}
              height={34}
              className="h-6 w-auto"
              priority
            />
          ) : (
            <span className="font-serif text-lg tracking-wide">FAVLA</span>
          )}
        </Link>

        <div className="favla-navbar__links">
          {navItems.map((item, i) =>
            item.openInNewTab ? (
              <Link
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="favla-navbar__link focus-ring"
              >
                {item.label}
              </Link>
            ) : (
              <TransitionLink key={i} href={item.link} className="favla-navbar__link focus-ring">
                {item.label}
              </TransitionLink>
            ),
          )}
        </div>

        {primaryButton?.label && (
          <>
            <span className="favla-navbar__divider" aria-hidden="true" />
            <CtaButton
              type={primaryButton.type || "fill"}
              href={primaryButton.link || "#"}
              label={primaryButton.label}
              tone="light"
              cursorGrow={primaryButton.cursorGrow}
              className="!px-4 !py-2 text-xs"
            />
          </>
        )}

        <span className="favla-navbar__divider" aria-hidden="true" />

        <div className="favla-navbar__controls">
          <LanguageModal />
          <ThemeToggleButton />
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          data-menu-open={menuOpen}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Cerrar menú" : menuLabel || "Abrir menú"}
          className="favla-navbar__burger focus-ring"
        >
          <span className="favla-navbar__burger-bar" aria-hidden="true" />
          <span className="favla-navbar__burger-bar" aria-hidden="true" />
        </button>
      </nav>

      <SiteMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={navItems}
        primaryButton={primaryButton}
      />
    </>
  );
}
