"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FillButton } from "./FillButton";
import { MagneticButton } from "./MagneticButton";

export type CtaButtonType = "fill" | "outline" | "underline" | "arrow" | "magnetic";

/** Shared renderer for the site's five text-CTA styles, so editors can pick
 * "Estilo del botón" per instance in Payload instead of each block hardcoding
 * one look. Icon-only controls (slider arrows, hamburger, social icons) and
 * SplitFeatureSlider (its own ivory/dark palette) intentionally stay outside
 * this system. */
export function CtaButton({
  type,
  href,
  label,
  newTab,
  cursorGrow,
  tone = "dark",
  className = "",
}: {
  type?: CtaButtonType | null;
  href: string;
  label: string;
  newTab?: boolean | null;
  cursorGrow?: boolean | null;
  tone?: "dark" | "light";
  className?: string;
}) {
  const target = newTab ? "_blank" : undefined;
  const rel = newTab ? "noopener noreferrer" : undefined;
  const cursorAttrs = cursorGrow ? { "data-cursor-grow": true } : {};
  const textTone = tone === "dark" ? "text-ink" : "text-paper";

  if (type === "fill") {
    return (
      <FillButton
        as={Link}
        href={href}
        target={target}
        rel={rel}
        fillClassName="bg-accent"
        className={`focus-ring inline-flex items-center border border-accent px-7 py-3 text-sm font-semibold uppercase tracking-wide text-accent hover:text-forest-deep ${className}`}
        {...cursorAttrs}
      >
        {label}
      </FillButton>
    );
  }

  if (type === "magnetic") {
    return (
      <MagneticButton
        as={Link}
        href={href}
        target={target}
        rel={rel}
        className={`focus-ring inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide decoration-accent decoration-2 underline-offset-4 hover:underline ${textTone} ${className}`}
        {...cursorAttrs}
      >
        {label}
        <ArrowRight size={16} aria-hidden="true" />
      </MagneticButton>
    );
  }

  if (type === "arrow") {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={`focus-ring group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide ${textTone} hover:text-accent ${className}`}
        {...cursorAttrs}
      >
        {label}
        <ArrowRight
          size={16}
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    );
  }

  if (type === "underline") {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={`focus-ring text-sm font-medium uppercase tracking-wide underline underline-offset-4 ${
          tone === "dark" ? "text-muted hover:text-ink" : "text-paper/80 hover:text-paper"
        } ${className}`}
        {...cursorAttrs}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={`focus-ring inline-flex items-center gap-2 rounded-full border border-accent px-7 py-3 text-sm font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-forest-deep ${className}`}
      {...cursorAttrs}
    >
      {label}
    </Link>
  );
}
