"use client";

import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { lineToHtml } from "@/components/ui/AnimatedHeading";
import { CtaButton, type CtaButtonType } from "@/components/ui/CtaButton";
import { SocialIconButton } from "@/components/ui/SocialIconButton";
import { ImageMaskReveal } from "@/components/ui/ImageMaskReveal";
import { getMediaUrl, getMediaAlt, type MediaField } from "@/lib/media";
import { prefersStaticMotion } from "@/lib/animations";
import { useSocialLinks } from "@/components/SocialLinksContext";
import { socialLabels } from "@/lib/social";
import { SocialIcon } from "@/lib/socialIcons";

gsap.registerPlugin(useGSAP);

type HeroProps = {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  backgroundType?: string | null;
  image?: MediaField;
  imageAlt?: string | null;
  imagePosition?: string | null;
  video?: MediaField;
  primaryButton?: {
    label?: string | null;
    link?: string | null;
    type?: CtaButtonType | null;
    cursorGrow?: boolean | null;
  } | null;
  secondaryButton?: { label?: string | null; link?: string | null; type?: CtaButtonType | null } | null;
  cursorMarquee?: boolean | null;
  cursorMarqueeText?: string | null;
};

export function Hero({
  eyebrow,
  title,
  description,
  backgroundType,
  image,
  imageAlt,
  imagePosition,
  video,
  primaryButton,
  secondaryButton,
  cursorMarquee = true,
  cursorMarqueeText,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const useVideo = backgroundType === "video" && !!video;
  const socialLinks = useSocialLinks();
  const resolvedCursorText = cursorMarquee ? cursorMarqueeText || "Seguir" : undefined;

  useGSAP(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersStaticMotion()) video.pause();
    else video.play().catch(() => {});
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme-section="dark"
      data-bg-section="dark"
      className="relative isolate flex h-[100svh] min-h-[720px] w-full items-stretch overflow-hidden bg-forest-deep text-paper md:h-[92vh]"
      aria-label="Hero principal"
    >
      <div ref={imageWrapRef} className="absolute inset-0 z-0 h-full">
        {useVideo ? (
          <video
            ref={videoRef}
            src={getMediaUrl(video)}
            poster={image ? getMediaUrl(image) : undefined}
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            style={{ objectPosition: imagePosition || "left center" }}
          />
        ) : (
          <ImageMaskReveal
            src={getMediaUrl(image)}
            alt={getMediaAlt(image, imageAlt || "")}
            priority
            sizes="100vw"
            className="h-full w-full"
            objectPosition={imagePosition || "left center"}
            trigger="mount"
          />
        )}
        <div className="absolute inset-0 bg-forest-deep/55" aria-hidden="true" />
      </div>

      <div className="favla-container relative z-10 flex w-full flex-col justify-end pb-16 pt-32 md:flex-row md:items-center md:justify-end md:pb-0 md:pt-0">
        {socialLinks.length > 0 && (
          <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 md:left-16 lg:flex">
            {socialLinks.map((item, i) => (
              <SocialIconButton
                key={item.id ?? i}
                iconStyle={item.iconStyle}
                href={item.link}
                ariaLabel={socialLabels[item.platform] || item.platform}
                {...(resolvedCursorText
                  ? { "data-cursor-marquee-text": resolvedCursorText }
                  : item.cursorGrow
                    ? { "data-cursor-grow": true }
                    : {})}
                className="h-10 w-10"
              >
                <SocialIcon platform={item.platform} className="text-base" />
              </SocialIconButton>
            ))}
          </div>
        )}

        <div className="max-w-[650px] md:ml-auto">
          <SectionLabel tone="paper" className="mb-6">
            {eyebrow || "EN FAVLA"}
          </SectionLabel>

          <h1
            className="font-serif text-[42px] leading-[1.08] tracking-tight text-paper sm:text-6xl md:text-[64px]"
            dangerouslySetInnerHTML={{ __html: title.split("\n").map(lineToHtml).join("<br />") }}
          />

          {description && (
            <p className="mt-6 max-w-md text-base leading-relaxed text-paper/85 md:text-lg">{description}</p>
          )}

          {(primaryButton?.label || secondaryButton?.label) && (
            <div className="mt-9 flex flex-wrap items-center gap-4">
              {primaryButton?.label && (
                <CtaButton
                  type={primaryButton.type || "fill"}
                  href={primaryButton.link || "#"}
                  label={primaryButton.label}
                  tone="light"
                  cursorGrow={primaryButton.cursorGrow}
                />
              )}
              {secondaryButton?.label && (
                <CtaButton
                  type={secondaryButton.type || "underline"}
                  href={secondaryButton.link || "#"}
                  label={secondaryButton.label}
                  tone="light"
                />
              )}
            </div>
          )}

          {socialLinks.length > 0 && (
            <div className="mt-8 flex items-center gap-3 lg:hidden">
              {socialLinks.map((item, i) => (
                <SocialIconButton
                  key={item.id ?? i}
                  iconStyle={item.iconStyle}
                  href={item.link}
                  ariaLabel={socialLabels[item.platform] || item.platform}
                  {...(resolvedCursorText
                    ? { "data-cursor-marquee-text": resolvedCursorText }
                    : item.cursorGrow
                      ? { "data-cursor-grow": true }
                      : {})}
                  className="h-9 w-9"
                >
                  <SocialIcon platform={item.platform} className="text-sm" />
                </SocialIconButton>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-2 text-paper/70 md:right-16 lg:flex"
        aria-hidden="true"
      >
        <span className="favla-eyebrow [writing-mode:vertical-rl]">Scroll</span>
        <ArrowDown size={16} />
      </div>
    </section>
  );
}
