"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FillButton } from "@/components/ui/FillButton";
import { SocialIconButton } from "@/components/ui/SocialIconButton";
import { AnimatedHeading, AnimatedText } from "@/components/ui/AnimatedHeading";
import { getMediaUrl, getMediaAlt, type MediaField } from "@/lib/media";
import { prefersStaticMotion } from "@/lib/animations";
import { socialLabels, type SocialLink } from "@/lib/social";
import { SocialIcon } from "@/lib/socialIcons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type NavColumn = {
  id?: string | null;
  title: string;
  links?: { id?: string | null; label: string; link: string }[] | null;
};

type LegalLink = { id?: string | null; label: string; link: string };

export function SiteFooter({
  logo,
  description,
  navigationColumns,
  contact,
  socialLinks,
  legalLinks,
  copyright,
}: {
  logo?: MediaField;
  description?: string | null;
  navigationColumns?: NavColumn[] | null;
  contact?: { phone?: string | null; email?: string | null; address?: string | null } | null;
  socialLinks?: SocialLink[] | null;
  legalLinks?: LegalLink[] | null;
  copyright?: string | null;
}) {
  const columns = navigationColumns ?? [];
  const social = socialLinks ?? [];
  const legal = legalLinks ?? [];
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const footer = footerRef.current;
      if (!footer) return;
      const reduced = prefersStaticMotion();
      const columnEls = footer.querySelectorAll<HTMLElement>("[data-footer-col]");
      const line = footer.querySelector<HTMLElement>("[data-footer-line]");

      if (reduced) {
        gsap.set(columnEls, { opacity: 1, y: 0 });
        if (line) gsap.set(line, { scaleX: 1 });
        return;
      }

      gsap.set(columnEls, { opacity: 0, y: 24 });
      if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

      ScrollTrigger.create({
        trigger: footer,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (line) gsap.to(line, { scaleX: 1, duration: 1, ease: "power3.out" });
          gsap.to(columnEls, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 });
        },
      });
    },
    { scope: footerRef },
  );

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: prefersStaticMotion() ? "auto" : "smooth" });
  }

  return (
    <footer ref={footerRef} className="bg-forest-deep pt-16 text-paper">
      <div className="favla-container">
        <div data-footer-line className="h-px w-full bg-line-light" />

        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
          <div data-footer-col className="md:col-span-4">
            {logo ? (
              <Image
                src={getMediaUrl(logo)}
                alt={getMediaAlt(logo, "FAVLA")}
                width={140}
                height={48}
                className="h-9 w-auto"
              />
            ) : (
              <span className="font-serif text-3xl">FAVLA</span>
            )}
            {description && (
              <AnimatedText text={description} className="mt-5 max-w-xs text-sm leading-relaxed text-paper/70" />
            )}
          </div>

          {columns.map((col, i) => (
            <div data-footer-col key={col.id ?? i} className="md:col-span-2">
              <AnimatedHeading as="h3" lines={[col.title]} className="favla-eyebrow text-paper/60" />
              <ul className="mt-5 flex flex-col gap-3">
                {col.links?.map((link, j) => (
                  <li key={link.id ?? j}>
                    <Link href={link.link} className="focus-ring text-sm text-paper/85 hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {contact && (contact.phone || contact.email || contact.address) && (
            <div data-footer-col className="md:col-span-4">
              <AnimatedHeading as="h3" lines={["Contacto"]} className="favla-eyebrow text-paper/60" />
              <ul className="mt-5 flex flex-col gap-3 text-sm text-paper/85">
                {contact.address && <li>{contact.address}</li>}
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className="focus-ring hover:text-accent">
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <a href={`tel:${contact.phone}`} className="focus-ring hover:text-accent">
                      {contact.phone}
                    </a>
                  </li>
                )}
              </ul>

              {social.length > 0 && (
                <ul className="mt-6 flex flex-wrap items-center gap-3">
                  {social.map((item, i) => (
                    <li key={item.id ?? i}>
                      <SocialIconButton
                        iconStyle={item.iconStyle}
                        href={item.link}
                        ariaLabel={socialLabels[item.platform] || item.platform}
                        {...(item.cursorGrow ? { "data-cursor-grow": true } : {})}
                        className="h-10 w-10"
                      >
                        <SocialIcon platform={item.platform} className="text-base" />
                      </SocialIconButton>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-6 border-t border-line-light py-8 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-paper/60">
            {copyright && <span>{copyright}</span>}
            {legal.map((link, i) => (
              <Link key={link.id ?? i} href={link.link} className="focus-ring hover:text-paper">
                {link.label}
              </Link>
            ))}
          </div>

          <FillButton
            onClick={scrollToTop}
            shape="circle"
            aria-label="Volver arriba"
            fillClassName="bg-accent"
            className="focus-ring inline-flex h-11 w-11 items-center justify-center border border-paper/30 text-paper hover:text-forest-deep"
          >
            <ArrowUp size={18} aria-hidden="true" />
          </FillButton>
        </div>
      </div>
    </footer>
  );
}
