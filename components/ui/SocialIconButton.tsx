"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { FillButton } from "./FillButton";

/** Renders a social icon as either the site's fill-on-hover circle (default)
 * or a plain bordered circle, per the "Estilo del ícono" field on each
 * social link. Shared by Hero and the footer since both read the same
 * socialLinks data from the Footer global. */
export function SocialIconButton({
  iconStyle,
  href,
  ariaLabel,
  className = "",
  children,
  ...rest
}: {
  iconStyle?: "fill" | "outline" | null;
  href: string;
  ariaLabel: string;
  className?: string;
  children: ReactNode;
  [key: string]: unknown;
}) {
  if (iconStyle === "outline") {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={`focus-ring inline-flex items-center justify-center rounded-full border border-paper/30 text-paper hover:border-accent hover:text-accent ${className}`}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <FillButton
      as="a"
      shape="circle"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      fillClassName="bg-accent"
      className={`focus-ring inline-flex items-center justify-center border border-paper/30 text-paper hover:text-forest-deep ${className}`}
      {...rest}
    >
      {children}
    </FillButton>
  );
}
