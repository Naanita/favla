"use client";

import { createContext, useContext } from "react";
import type { SocialLink } from "@/lib/social";

const SocialLinksContext = createContext<SocialLink[]>([]);

export function SocialLinksProvider({
  links,
  children,
}: {
  links?: SocialLink[] | null;
  children: React.ReactNode;
}) {
  return <SocialLinksContext.Provider value={links ?? []}>{children}</SocialLinksContext.Provider>;
}

export function useSocialLinks() {
  return useContext(SocialLinksContext);
}
