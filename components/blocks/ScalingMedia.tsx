"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { getMediaUrl, getMediaAlt, type MediaField } from "@/lib/media";
import { useStaticEntrance } from "@/lib/useStaticEntrance";
import { CtaButton, type CtaButtonType } from "@/components/ui/CtaButton";
import { resolveBlockBackground } from "@/lib/blockBackground";

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);

type CTA =
  | { label?: string | null; link?: string | null; type?: CtaButtonType | null; cursorGrow?: boolean | null }
  | null
  | undefined;

type ScalingMediaProps = {
  eyebrow?: string | null;
  title: string;
  backgroundType?: string | null;
  image?: MediaField;
  imageAlt?: string | null;
  video?: MediaField;
  secondTitle?: string | null;
  primaryButton?: CTA;
  secondaryLink?: CTA;
  backgroundColor?: string | null;
};

const Mark = () => (
  <svg viewBox="0 0 138 138" fill="none" className="favla-scaling-media__mark" aria-hidden="true">
    <path
      d="M81.7432 46.534C79.5777 48.6995 75.875 47.1659 75.875 44.1034V0.25H62.125V51.8124C62.125 57.5079 57.5079 62.1249 51.8125 62.1249H0.25V75.8749H44.1034C47.1659 75.8749 48.6996 79.5776 46.5341 81.7431L16.0136 112.263L25.7364 121.986L56.2569 91.466C58.416 89.3069 62.1031 90.825 62.125 93.8693V137.75H75.8751L75.875 86.1874C75.875 80.492 80.4921 75.8749 86.1875 75.8749H137.75V62.1249H93.8692C90.8339 62.1031 89.3157 58.4375 91.4469 56.2759L91.4659 56.2569L121.986 25.7363L112.264 16.0137L81.7432 46.534Z"
      fill="currentColor"
    />
  </svg>
);

function Media({
  useVideo,
  video,
  image,
  imageAlt,
  mediaRef,
}: {
  useVideo: boolean;
  video?: MediaField;
  image?: MediaField;
  imageAlt?: string | null;
  mediaRef?: React.RefObject<HTMLImageElement | HTMLVideoElement | null>;
}) {
  return useVideo ? (
    <video
      ref={mediaRef as React.RefObject<HTMLVideoElement>}
      src={getMediaUrl(video)}
      poster={image ? getMediaUrl(image) : undefined}
      autoPlay
      muted
      loop
      playsInline
      className="favla-scaling-media__media"
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={mediaRef as React.RefObject<HTMLImageElement>}
      src={getMediaUrl(image)}
      alt={getMediaAlt(image, imageAlt || "")}
      className="favla-scaling-media__media"
    />
  );
}

function BelowBox({ secondTitle, primaryButton, secondaryLink }: Pick<ScalingMediaProps, "secondTitle" | "primaryButton" | "secondaryLink">) {
  if (!secondTitle && !primaryButton?.label && !secondaryLink?.label) return null;
  return (
    <>
      {secondTitle && <h2 className="favla-scaling-media__h2">{secondTitle}</h2>}
      {(primaryButton?.label || secondaryLink?.label) && (
        <div className="flex flex-wrap items-center justify-center gap-5">
          {primaryButton?.label && (
            <CtaButton
              type={primaryButton.type || "outline"}
              href={primaryButton.link || "#"}
              label={primaryButton.label}
              tone="dark"
              cursorGrow={primaryButton.cursorGrow}
            />
          )}
          {secondaryLink?.label && (
            <CtaButton
              type={secondaryLink.type || "underline"}
              href={secondaryLink.link || "#"}
              label={secondaryLink.label}
              tone="dark"
            />
          )}
        </div>
      )}
    </>
  );
}

/** Compact, always-visible substitute used in the admin Live Preview and
 * under prefers-reduced-motion — the media renders twice (once compact,
 * once full-width) instead of scroll-morphing between the two. */
function StaticScalingMedia({
  eyebrow,
  title,
  backgroundType,
  image,
  imageAlt,
  video,
  secondTitle,
  primaryButton,
  secondaryLink,
  backgroundColor,
}: ScalingMediaProps) {
  const useVideo = backgroundType === "video" && !!video;
  const bg = resolveBlockBackground(backgroundColor);
  return (
    <div
      className="favla-scaling-media"
      data-theme-section={bg?.theme ?? "light"}
      data-bg-section={bg?.theme ?? "light"}
      style={bg ? { backgroundColor: bg.color } : undefined}
    >
      <section className="favla-scaling-media__header">
        {eyebrow && <span className="favla-scaling-media__eyebrow">{eyebrow}</span>}
        <h2 className="favla-scaling-media__h2">{title}</h2>
        <div className="favla-scaling-media__small-box">
          <div className="favla-scaling-media__before" aria-hidden="true" />
          <div className="favla-scaling-media__wrap">
            <div className="favla-scaling-media__target">
              <Media useVideo={useVideo} video={video} image={image} imageAlt={imageAlt} />
              <Mark />
            </div>
          </div>
        </div>
      </section>

      <section className="favla-scaling-media__video-section">
        <div className="favla-scaling-media__big-box">
          <div className="favla-scaling-media__before" aria-hidden="true" />
          <div className="favla-scaling-media__wrap">
            <div className="favla-scaling-media__target">
              <Media useVideo={useVideo} video={video} image={image} imageAlt={imageAlt} />
            </div>
          </div>
        </div>
        <BelowBox secondTitle={secondTitle} primaryButton={primaryButton} secondaryLink={secondaryLink} />
      </section>
    </div>
  );
}

/** Osmo Supply "Scaling element on scroll with Flip" — a small media box in
 * the header morphs, via GSAP Flip, into a full-width box in the section
 * below as the visitor scrolls between the two. Only one element ever
 * exists in the DOM; Flip.fit() re-measures and transforms it to match
 * wherever it's scrolling toward. */
function FlipScalingMedia({
  eyebrow,
  title,
  backgroundType,
  image,
  imageAlt,
  video,
  secondTitle,
  primaryButton,
  secondaryLink,
  backgroundColor,
}: ScalingMediaProps) {
  const bg = resolveBlockBackground(backgroundColor);
  const smallWrapRef = useRef<HTMLDivElement>(null);
  const bigWrapRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const useVideo = backgroundType === "video" && !!video;

  useGSAP(() => {
    const wrapperElements = [smallWrapRef.current, bigWrapRef.current].filter(Boolean) as HTMLElement[];
    const targetEl = targetRef.current;
    if (wrapperElements.length < 2 || !targetEl) return;

    if (useVideo && mediaRef.current instanceof HTMLVideoElement) {
      mediaRef.current.play().catch(() => {});
    }

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
        {eyebrow && <span className="favla-scaling-media__eyebrow">{eyebrow}</span>}
        <h2 className="favla-scaling-media__h2">{title}</h2>
        <div className="favla-scaling-media__small-box">
          <div className="favla-scaling-media__before" aria-hidden="true" />
          <div ref={smallWrapRef} className="favla-scaling-media__wrap">
            <div ref={targetRef} className="favla-scaling-media__target">
              <Media useVideo={useVideo} video={video} image={image} imageAlt={imageAlt} mediaRef={mediaRef} />
              <Mark />
            </div>
          </div>
        </div>
      </section>

      <section className="favla-scaling-media__video-section">
        <div className="favla-scaling-media__big-box">
          <div className="favla-scaling-media__before" aria-hidden="true" />
          <div ref={bigWrapRef} className="favla-scaling-media__wrap" />
        </div>
        <BelowBox secondTitle={secondTitle} primaryButton={primaryButton} secondaryLink={secondaryLink} />
      </section>
    </div>
  );
}

export function ScalingMedia(props: ScalingMediaProps) {
  const staticEntrance = useStaticEntrance();
  return staticEntrance ? <StaticScalingMedia {...props} /> : <FlipScalingMedia {...props} />;
}
