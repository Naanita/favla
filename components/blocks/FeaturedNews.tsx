"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { CtaButtonType } from "@/components/ui/CtaButton";
import { AnimatedHeading, AnimatedText } from "@/components/ui/AnimatedHeading";
import { ImageMaskReveal } from "@/components/ui/ImageMaskReveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { DraggableTrack, type DraggableTrackHandle } from "@/components/ui/DraggableTrack";
import { SliderControls } from "@/components/ui/SliderControls";
import { getMediaUrl, getMediaAlt, type MediaField } from "@/lib/media";
import { prefersStaticMotion } from "@/lib/animations";
import { resolveBlockBackground } from "@/lib/blockBackground";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Stat = { id?: string; value: string; label: string };
type Article = {
  id?: string;
  category?: string | null;
  title: string;
  excerpt?: string | null;
  image?: MediaField;
  imageAlt?: string | null;
  imagePosition?: string | null;
  link?: string | null;
  statistics?: Stat[] | null;
};

function ArticleCard({
  article,
  dimmed,
  onHover,
  cursorMarqueeText,
}: {
  article: Article;
  dimmed: boolean;
  onHover: (hovering: boolean) => void;
  cursorMarqueeText?: string | null;
}) {
  return (
    <Link
      href={article.link || "#"}
      data-news-card
      {...(cursorMarqueeText ? { "data-cursor-marquee-text": cursorMarqueeText } : {})}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      className={`focus-ring group relative block aspect-[3/4] w-full flex-1 overflow-hidden rounded-2xl transition-opacity duration-500 sm:aspect-[4/5] ${
        dimmed ? "opacity-55" : "opacity-100"
      }`}
    >
      <ImageMaskReveal
        src={getMediaUrl(article.image)}
        alt={getMediaAlt(article.image, article.imageAlt || article.title)}
        sizes="(min-width: 768px) 45vw, 85vw"
        objectPosition={article.imagePosition || "center"}
        className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/95 from-0% via-forest-deep/45 via-40% to-transparent to-72%" />

      <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 md:p-8">
        <div className="flex items-center justify-between gap-3">
          {article.category && (
            <span className="favla-eyebrow min-w-0 break-words text-paper/85">{article.category}</span>
          )}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-paper/40 text-paper transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 sm:h-10 sm:w-10">
            <ArrowUpRight size={16} aria-hidden="true" className="sm:hidden" />
            <ArrowUpRight size={18} aria-hidden="true" className="hidden sm:block" />
          </span>
        </div>

        <div className="min-w-0">
          <AnimatedHeading
            as="h3"
            lines={[article.title]}
            className="max-w-sm break-words font-serif text-xl leading-tight text-paper sm:text-2xl md:text-3xl"
          />
          {article.excerpt && (
            <AnimatedText
              text={article.excerpt}
              className="mt-2 max-w-sm break-words text-sm leading-relaxed text-paper/80"
            />
          )}

          {article.statistics && article.statistics.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-line-light pt-4 sm:mt-6 sm:gap-x-8 sm:pt-5">
              {article.statistics.map((stat, i) => (
                <div key={stat.id ?? i} className="max-w-[9.5rem]">
                  <p className="font-serif text-xl text-accent sm:text-2xl">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <AnimatedText
                    text={stat.label}
                    className="favla-eyebrow mt-1 break-words text-paper/70"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function FeaturedNews({
  eyebrow,
  title,
  description,
  viewAllButton,
  articles = [],
  cursorMarquee = true,
  cursorMarqueeText,
  backgroundColor,
}: {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  viewAllButton?: { label?: string | null; link?: string | null; type?: CtaButtonType | null } | null;
  articles?: Article[];
  cursorMarquee?: boolean | null;
  cursorMarqueeText?: string | null;
  backgroundColor?: string | null;
}) {
  const resolvedCursorText = cursorMarquee ? cursorMarqueeText || "Ver noticia" : undefined;
  const bg = resolveBlockBackground(backgroundColor);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const trackHandle = useRef<DraggableTrackHandle>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const handleActiveIndexChange = useCallback((i: number) => setActiveIndex(i), []);

  useGSAP(
    () => {
      const bar = progressRef.current;
      const grid = gridRef.current;
      if (!bar || !grid) return;
      const reduced = prefersStaticMotion();
      if (reduced) {
        gsap.set(bar, { scaleX: 1 });
        return;
      }
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      ScrollTrigger.create({
        trigger: grid,
        start: "top 80%",
        once: true,
        onEnter: () => gsap.to(bar, { scaleX: 1, duration: 1.1, ease: "power3.out" }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-theme-section={bg?.theme ?? "dark"}
      data-bg-section={bg?.theme ?? "dark"}
      style={bg ? { backgroundColor: bg.color } : undefined}
      className="bg-forest-deep py-24 text-paper md:py-36"
    >
      <div className="favla-container grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
        <SectionIntro
          eyebrow={eyebrow}
          title={title}
          description={description}
          cta={viewAllButton}
          tone="light"
          className="lg:col-span-4"
        />

        <div className="lg:col-span-8" ref={gridRef}>
          <div className="hidden gap-6 lg:flex">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.id ?? i}
                article={article}
                dimmed={hovered !== null && hovered !== i}
                onHover={(h) => setHovered(h ? i : null)}
                cursorMarqueeText={resolvedCursorText}
              />
            ))}
          </div>

          <div className="lg:hidden">
            <DraggableTrack
              ref={trackHandle}
              ariaLabel="Noticias"
              onActiveIndexChange={handleActiveIndexChange}
              itemClassName="w-[85%] pr-4 sm:w-[65%] md:w-[56%]"
            >
              {articles.map((article, i) => (
                <ArticleCard
                  key={article.id ?? i}
                  article={article}
                  dimmed={false}
                  onHover={() => {}}
                  cursorMarqueeText={resolvedCursorText}
                />
              ))}
            </DraggableTrack>

            {articles.length > 1 && (
              <SliderControls
                tone="light"
                className="mt-6"
                onPrev={() => trackHandle.current?.scrollByCards(-1)}
                onNext={() => trackHandle.current?.scrollByCards(1)}
                count={articles.length}
                activeIndex={activeIndex}
                onDotClick={(i) => trackHandle.current?.scrollToIndex(i)}
              />
            )}
          </div>

          <div className="mt-8 h-px w-full bg-line-light">
            <div ref={progressRef} className="h-full w-full bg-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}
