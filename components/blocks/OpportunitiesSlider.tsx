"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { CtaButtonType } from "@/components/ui/CtaButton";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { SliderControls } from "@/components/ui/SliderControls";
import { DraggableTrack, type DraggableTrackHandle } from "@/components/ui/DraggableTrack";
import { getMediaUrl, getMediaAlt, type MediaField } from "@/lib/media";
import { prefersStaticMotion } from "@/lib/animations";
import { resolveBlockBackground } from "@/lib/blockBackground";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Opportunity = {
  id?: string;
  title: string;
  date?: string | null;
  location?: string | null;
  status?: "open" | "closed" | "upcoming" | null;
  statusLabel?: string | null;
  link?: string | null;
};

const statusDefaults: Record<string, string> = {
  open: "Abierta",
  closed: "Cerrada",
  upcoming: "Próximamente",
};

const statusColor: Record<string, string> = {
  open: "text-accent border-accent",
  closed: "text-paper/50 border-paper/30",
  upcoming: "text-paper/80 border-paper/50",
};

function OpportunityCard({ opportunity, offset }: { opportunity: Opportunity; offset: "left" | "right" | "none" }) {
  const status = opportunity.status || "open";
  const offsetClass = offset === "left" ? "md:mr-14" : offset === "right" ? "md:ml-14" : "";

  return (
    <Link
      href={opportunity.link || "#"}
      data-opportunity-card
      className={`focus-ring group block rounded-2xl border border-line-light bg-forest-deep/60 p-7 backdrop-blur-sm transition-all duration-400 hover:-translate-y-1 hover:border-accent/60 ${offsetClass}`}
    >
      <div className="flex items-start justify-between gap-4">
        {opportunity.date && <span className="favla-eyebrow text-paper/60">{opportunity.date}</span>}
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-paper/30 text-paper transition-transform duration-400 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:border-accent group-hover:text-accent">
          <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </div>

      <AnimatedHeading
        as="h3"
        lines={[opportunity.title]}
        className="mt-5 font-serif text-2xl leading-snug text-paper"
      />

      <div className="mt-6 flex items-center justify-between border-t border-line-light pt-5">
        {opportunity.location && <span className="text-sm text-paper/70">{opportunity.location}</span>}
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusColor[status]}`}>
          {opportunity.statusLabel || statusDefaults[status]}
        </span>
      </div>
    </Link>
  );
}

export function OpportunitiesSlider({
  eyebrow,
  title,
  description,
  backgroundImage,
  viewAllButton,
  opportunities = [],
  sliderSettings,
  backgroundColor,
}: {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  backgroundImage?: MediaField;
  viewAllButton?: { label?: string | null; link?: string | null; type?: CtaButtonType | null } | null;
  opportunities?: Opportunity[];
  sliderSettings?: { showArrows?: boolean | null; showPagination?: boolean | null } | null;
  backgroundColor?: string | null;
}) {
  const bgOverride = resolveBlockBackground(backgroundColor);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const trackHandle = useRef<DraggableTrackHandle>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const handleActiveIndexChange = useCallback((i: number) => setActiveIndex(i), []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const bg = bgRef.current;
      if (!section) return;
      const cards = section.querySelectorAll<HTMLElement>("[data-opportunity-card]");
      const reduced = prefersStaticMotion();

      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0 });
        if (bg) gsap.set(bg, { clipPath: "inset(0% 0% 0% 0%)" });
        return;
      }

      if (bg) {
        gsap.set(bg, { clipPath: "inset(0% 0% 100% 0%)" });
        ScrollTrigger.create({
          trigger: section,
          start: "top 85%",
          once: true,
          onEnter: () => gsap.to(bg, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.inOut" }),
        });
      }

      gsap.set(cards, { opacity: 0, y: 36 });
      ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        once: true,
        onEnter: () => gsap.to(cards, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="convocatorias"
      data-theme-section={bgOverride?.theme ?? "dark"}
      data-bg-section={bgOverride?.theme ?? "dark"}
      style={bgOverride ? { backgroundColor: bgOverride.color } : undefined}
      className="relative overflow-hidden bg-forest-deep py-24 text-paper md:py-36"
    >
      <div ref={bgRef} className="absolute inset-0 z-0">
        <Image
          src={getMediaUrl(backgroundImage)}
          alt={getMediaAlt(backgroundImage, "")}
          fill
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-forest-deep/85" />
      </div>

      <div className="favla-container relative z-10 grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-8">
        <SectionIntro
          eyebrow={eyebrow}
          title={title}
          description={description}
          cta={viewAllButton}
          tone="light"
          className="md:col-span-4"
        />

        <div className="md:col-span-8">
          <div className="hidden flex-col gap-6 md:flex">
            {opportunities.map((opp, i) => (
              <OpportunityCard key={opp.id ?? i} opportunity={opp} offset={i % 2 === 0 ? "left" : "right"} />
            ))}
          </div>

          <div className="md:hidden">
            <DraggableTrack
              ref={trackHandle}
              ariaLabel="Convocatorias"
              onActiveIndexChange={handleActiveIndexChange}
              itemClassName="w-[82%] pr-4"
            >
              {opportunities.map((opp, i) => (
                <OpportunityCard key={opp.id ?? i} opportunity={opp} offset="none" />
              ))}
            </DraggableTrack>

            {(sliderSettings?.showArrows !== false || sliderSettings?.showPagination !== false) &&
              opportunities.length > 1 && (
                <SliderControls
                  tone="light"
                  className="mt-6"
                  onPrev={sliderSettings?.showArrows !== false ? () => trackHandle.current?.scrollByCards(-1) : undefined}
                  onNext={sliderSettings?.showArrows !== false ? () => trackHandle.current?.scrollByCards(1) : undefined}
                  count={sliderSettings?.showPagination !== false ? opportunities.length : undefined}
                  activeIndex={activeIndex}
                  onDotClick={
                    sliderSettings?.showPagination !== false
                      ? (i) => trackHandle.current?.scrollToIndex(i)
                      : undefined
                  }
                />
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
