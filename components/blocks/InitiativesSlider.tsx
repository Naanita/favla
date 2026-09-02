"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { lineToHtml } from "@/components/ui/AnimatedHeading";
import { getMediaUrl, getMediaAlt, type MediaField } from "@/lib/media";
import { useStaticEntrance } from "@/lib/useStaticEntrance";
import { CtaButton, type CtaButtonType } from "@/components/ui/CtaButton";
import { resolveBlockBackground, type BlockBackground } from "@/lib/blockBackground";

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);

type CTA =
  | { label?: string | null; link?: string | null; type?: CtaButtonType | null; cursorGrow?: boolean | null }
  | null
  | undefined;

/** Osmo Supply "Scaling element on scroll with Flip" — the same mechanic
 * used by components/blocks/ScalingMedia.tsx. A small photo in the header
 * morphs, via GSAP Flip, into a full-width photo in the section below as
 * the visitor scrolls between the two — handing off into the Sticky Steps
 * sequence beneath it. Only one media element ever exists in the DOM; Flip
 * re-measures and transforms it to match whichever box it's scrolling
 * toward, rather than fading a circle into a full-bleed background. */
function ScalingEntrance({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  viewAllButton,
  bg,
}: {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  image?: MediaField;
  imageAlt?: string | null;
  viewAllButton?: CTA;
  bg?: BlockBackground | null;
}) {
  const smallWrapRef = useRef<HTMLDivElement>(null);
  const bigWrapRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const titleHtml = title.split("\n").map(lineToHtml).join("<br />");

  useGSAP(() => {
    const wrapperElements = [smallWrapRef.current, bigWrapRef.current].filter(Boolean) as HTMLElement[];
    const targetEl = targetRef.current;
    if (wrapperElements.length < 2 || !targetEl) return;

    let tl: gsap.core.Timeline | undefined;

    const flipTimeline = () => {
      if (tl) {
        tl.kill();
        gsap.set(targetEl, { clearProps: "all" });
      }

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperElements[0],
          start: "center center",
          endTrigger: wrapperElements[wrapperElements.length - 1],
          end: "center center",
          scrub: 0.25,
        },
      });

      wrapperElements.forEach((element, index) => {
        const nextIndex = index + 1;
        if (nextIndex >= wrapperElements.length) return;
        const nextWrapperEl = wrapperElements[nextIndex];
        const nextRect = nextWrapperEl.getBoundingClientRect();
        const thisRect = element.getBoundingClientRect();
        const nextDistance = nextRect.top + window.pageYOffset + nextWrapperEl.offsetHeight / 2;
        const thisDistance = thisRect.top + window.pageYOffset + element.offsetHeight / 2;
        const offset = nextDistance - thisDistance;

        tl!.add(Flip.fit(targetEl, nextWrapperEl, { duration: offset, ease: "none" }) as gsap.core.Tween);
      });
    };

    flipTimeline();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(flipTimeline, 100);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      tl?.kill();
    };
  }, []);

  return (
    <div
      className="favla-scaling-media"
      data-theme-section={bg?.theme ?? "light"}
      data-bg-section={bg?.theme ?? "light"}
      style={bg ? { backgroundColor: bg.color } : undefined}
    >
      <section className="favla-scaling-media__header">
        <SectionLabel tone="accent" className="justify-center">
          {eyebrow || "CONECTA CON NUESTRO IMPACTO"}
        </SectionLabel>

        <h2
          className="favla-scaling-media__h2"
          dangerouslySetInnerHTML={{ __html: titleHtml }}
        />

        {description && (
          <p className="max-w-md text-base leading-relaxed text-muted md:text-lg">{description}</p>
        )}

        <div className="favla-scaling-media__small-box">
          <div className="favla-scaling-media__before" aria-hidden="true" />
          <div ref={smallWrapRef} className="favla-scaling-media__wrap">
            <div ref={targetRef} className="favla-scaling-media__target">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getMediaUrl(image)}
                alt={getMediaAlt(image, imageAlt || "")}
                className="favla-scaling-media__media"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="favla-scaling-media__video-section">
        <div className="favla-scaling-media__big-box">
          <div className="favla-scaling-media__before" aria-hidden="true" />
          <div ref={bigWrapRef} className="favla-scaling-media__wrap" />
        </div>

        {viewAllButton?.label && (
          <CtaButton
            type={viewAllButton.type || "outline"}
            href={viewAllButton.link || "#"}
            label={viewAllButton.label}
            tone="dark"
            cursorGrow={viewAllButton.cursorGrow}
          />
        )}
      </section>
    </div>
  );
}

/** Compact, always-visible substitute for ScalingEntrance used in the admin
 * Live Preview and under prefers-reduced-motion — same content, no
 * scroll-driven mechanics, everything visible immediately. */
function StaticEntrance({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  viewAllButton,
  bg,
}: {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  image?: MediaField;
  imageAlt?: string | null;
  viewAllButton?: CTA;
  bg?: BlockBackground | null;
}) {
  return (
    <section
      data-theme-section={bg?.theme ?? "light"}
      data-bg-section={bg?.theme ?? "light"}
      style={bg ? { backgroundColor: bg.color } : undefined}
      className="bg-paper py-24 text-ink md:py-36"
      aria-label="Iniciativas FAVLA"
    >
      <div className="favla-container mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <SectionLabel tone="accent" className="justify-center">
          {eyebrow || "CONECTA CON NUESTRO IMPACTO"}
        </SectionLabel>

        <h2
          className="font-serif text-4xl leading-[1.08] tracking-tight text-ink md:text-6xl"
          dangerouslySetInnerHTML={{ __html: title.split("\n").map(lineToHtml).join("<br />") }}
        />

        {description && <p className="text-base leading-relaxed text-muted md:text-lg">{description}</p>}

        {image && (
          <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-2xl">
            <Image
              src={getMediaUrl(image)}
              alt={getMediaAlt(image, imageAlt || "")}
              fill
              sizes="(min-width: 768px) 32rem, 90vw"
              className="object-cover"
            />
          </div>
        )}

        {viewAllButton?.label && (
          <CtaButton
            type={viewAllButton.type || "outline"}
            href={viewAllButton.link || "#"}
            label={viewAllButton.label}
            tone="dark"
            cursorGrow={viewAllButton.cursorGrow}
            className="mt-2"
          />
        )}
      </div>
    </section>
  );
}

export function InitiativesSlider({
  eyebrow,
  title,
  description,
  entranceImage,
  entranceImageAlt,
  viewAllButton,
  backgroundColor,
}: {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  entranceImage?: MediaField;
  entranceImageAlt?: string | null;
  viewAllButton?: CTA;
  backgroundColor?: string | null;
}) {
  const staticEntrance = useStaticEntrance();
  const bg = resolveBlockBackground(backgroundColor);

  return staticEntrance ? (
    <StaticEntrance
      eyebrow={eyebrow}
      title={title}
      description={description}
      image={entranceImage}
      imageAlt={entranceImageAlt}
      viewAllButton={viewAllButton}
      bg={bg}
    />
  ) : (
    <ScalingEntrance
      eyebrow={eyebrow}
      title={title}
      description={description}
      image={entranceImage}
      imageAlt={entranceImageAlt}
      viewAllButton={viewAllButton}
      bg={bg}
    />
  );
}
