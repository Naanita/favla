"use client";

import Link from "next/link";
import { forwardRef, type MouseEvent, type ReactNode } from "react";
import { usePageTransition } from "@/components/layout/PageTransition";

/** Drop-in replacement for next/link that plays the curved wipe transition
 * instead of an instant swap. Falls back to a normal navigation when the
 * user modifier-clicks (new tab, etc.) so browser defaults keep working. */
export const TransitionLink = forwardRef<
  HTMLAnchorElement,
  {
    href: string;
    children: ReactNode;
    className?: string;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  }
>(function TransitionLink({ href, children, className, onClick }, ref) {
  const { navigate } = usePageTransition();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href);
  }

  return (
    <Link ref={ref} href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
});
