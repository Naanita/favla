"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { ImageMaskReveal } from "@/components/ui/ImageMaskReveal";
import { AnimatedHeading, AnimatedText } from "@/components/ui/AnimatedHeading";
import { getMediaUrl, getMediaAlt, type MediaField } from "@/lib/media";
import { prefersStaticMotion } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Story = {
  id?: string;
  title: string;
  excerpt?: string | null;
  image?: MediaField;
  imageAlt?: string | null;
  link?: string | null;
  visualPosition?: string | null;
};

function StoryUnit({ story, index }: { story: Story; index: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const reversed = story.visualPosition === "large-right" || (!story.visualPosition && index % 2 === 1);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const imageBox = imageBoxRef.current;
      const card = cardRef.current;
      const line = lineRef.current;
      if (!wrap || !imageBox || !card) return;
      const reduced = prefersStaticMotion();

      if (line) {
        if (reduced) {
          gsap.set(line, { width: "100%" });
        } else {
          gsap.set(line, { width: "0%" });
          ScrollTrigger.create({
            trigger: wrap,
            start: "top 70%",
            once: true,
            onEnter: () => gsap.to(line, { width: "100%", duration: 1, ease: "power3.out" }),
          });
        }
      }

      if (reduced) return;

      gsap.to(imageBox, {
        yPercent: reversed ? 6 : -6,
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.to(card, {
        yPercent: reversed ? -4 : 4,
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: wrapRef, dependencies: [reversed] },
  );

  return (
    <div
      ref={wrapRef}
      className={`relative flex flex-col gap-6 md:flex-row md:items-end md:gap-0 ${reversed ? "md:flex-row-reverse" : ""}`}
    >
      <div ref={imageBoxRef} className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:w-[58%]">
        <ImageMaskReveal
          src={getMediaUrl(story.image)}
          alt={getMediaAlt(story.image, story.imageAlt || story.title)}
          sizes="(min-width: 768px) 55vw, 90vw"
          className="h-full w-full"
        />
      </div>

      <div
        ref={cardRef}
        className={`relative z-10 w-full rounded-2xl border border-line-light bg-forest p-8 md:w-[42%] md:p-10 ${
          reversed ? "md:-mr-10 md:-mb-10" : "md:-ml-10 md:-mb-10"
        }`}
      >
        <span className="favla-eyebrow text-accent">Historia {String(index + 1).padStart(2, "0")}</span>
        <AnimatedHeading
          as="h3"
          lines={[story.title]}
          className="mt-4 font-serif text-3xl leading-tight text-paper md:text-4xl"
        />
        {story.excerpt && <AnimatedText text={story.excerpt} className="mt-4 text-paper/80" />}
        <Link
          href={story.link || "#"}
          className="focus-ring mt-7 inline-flex items-center gap-2 border-b border-accent pb-1 text-sm font-semibold uppercase tracking-wide text-accent transition-transform hover:translate-x-1"
        >
          Leer historia
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <span ref={lineRef} className="mt-7 block h-px bg-accent" aria-hidden="true" />
      </div>
    </div>
  );
}

export function StoriesEditorial({
  eyebrow,
  title,
  description,
  viewAllButton,
  stories = [],
}: {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  viewAllButton?: { label?: string | null; link?: string | null } | null;
  stories?: Story[];
}) {
  return (
    <section id="historias" className="bg-forest-deep py-24 md:py-40">
      <div className="favla-container">
        <SectionIntro
          eyebrow={eyebrow}
          title={title}
          description={description}
          cta={viewAllButton}
          tone="light"
          className="mb-20 max-w-xl md:mb-28"
        />

        <div className="flex flex-col gap-24 md:gap-32">
          {stories.map((story, i) => (
            <StoryUnit key={story.id ?? i} story={story} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
