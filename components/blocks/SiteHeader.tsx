"use client";

import Image from "next/image";
import Link from "next/link";
import { CtaButton, type CtaButtonType } from "@/components/ui/CtaButton";
import { ThemeToggleButton } from "@/components/ui/ThemeToggleButton";
import { LanguageModal } from "@/components/ui/LanguageModal";
import { getMediaUrl, getMediaAlt, type MediaField } from "@/lib/media";
import { useSectionTheme } from "@/hooks/useSectionTheme";

type NavItem = { label: string; link: string; openInNewTab?: boolean | null };

const NAV_OFFSET = 40; // roughly half the navbar's height, used to sample which section sits behind it

export function SiteHeader({
  logo,
  navigationItems,
  primaryButton,
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
  const { theme } = useSectionTheme(NAV_OFFSET);
  const navTheme = theme || "light";

  return (
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
        {navItems.map((item, i) => (
          <Link
            key={i}
            href={item.link}
            target={item.openInNewTab ? "_blank" : undefined}
            rel={item.openInNewTab ? "noopener noreferrer" : undefined}
            className="favla-navbar__link focus-ring"
          >
            {item.label}
          </Link>
        ))}
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
    </nav>
  );
}
