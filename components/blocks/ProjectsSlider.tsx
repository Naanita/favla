"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionIntro } from "@/components/ui/SectionIntro";
import type { CtaButtonType } from "@/components/ui/CtaButton";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { LoopSlider } from "@/components/ui/LoopSlider";
import { ImageMaskReveal } from "@/components/ui/ImageMaskReveal";
import { getMediaUrl, getMediaAlt, type MediaField } from "@/lib/media";
import { DynamicIcon } from "@/lib/icons";
import { prefersStaticMotion } from "@/lib/animations";
import { resolveBlockBackground } from "@/lib/blockBackground";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Project = {
  id?: string;
  category?: string | null;
  title: string;
  description?: string | null;
  image?: MediaField;
  imageAlt?: string | null;
  imagePosition?: string | null;
  link?: string | null;
  icon?: string | null;
};

function ProjectCard({
  project,
  cursorMarqueeText,
}: {
  project: Project;
  cursorMarqueeText?: string | null;
}) {
  return (
    <Link
      href={project.link || "#"}
      data-project-card
      {...(cursorMarqueeText ? { "data-cursor-marquee-text": cursorMarqueeText } : {})}
      className="focus-ring group relative block aspect-[3/4.2] overflow-hidden rounded-2xl"
    >
      <ImageMaskReveal
        src={getMediaUrl(project.image)}
        alt={getMediaAlt(project.image, project.imageAlt || project.title)}
        sizes="(min-width: 1024px) 32vw, (min-width: 768px) 45vw, 78vw"
        objectPosition={project.imagePosition || "center"}
        className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-forest-deep/45 transition-colors duration-500 group-hover:bg-forest-deep/55" />

      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          {project.category && <span className="favla-eyebrow text-paper/85">{project.category}</span>}
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/40 text-paper">
            <DynamicIcon iconName={project.icon} size={16} aria-hidden="true" />
          </span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <AnimatedHeading
              as="h3"
              lines={[project.title]}
              className="break-words font-serif text-xl leading-tight text-paper transition-transform duration-500 group-hover:-translate-y-1 sm:text-2xl"
            />
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent text-accent transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProjectsSlider({
  eyebrow,
  title,
  description,
  viewAllButton,
  projects = [],
  cursorMarquee = true,
  cursorMarqueeText,
  backgroundColor,
}: {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  viewAllButton?: { label?: string | null; link?: string | null; type?: CtaButtonType | null } | null;
  projects?: Project[];
  sliderSettings?: { showArrows?: boolean | null; showPagination?: boolean | null; drag?: boolean | null } | null;
  cursorMarquee?: boolean | null;
  cursorMarqueeText?: string | null;
  backgroundColor?: string | null;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const resolvedCursorText = cursorMarquee ? cursorMarqueeText || "Ver proyecto" : undefined;
  const bg = resolveBlockBackground(backgroundColor);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const cards = section.querySelectorAll<HTMLElement>("[data-project-card]");
      if (prefersStaticMotion()) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(cards, { opacity: 0, y: 40 });
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () =>
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            onComplete: () => gsap.set(cards, { clearProps: "opacity,transform" }),
          }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="proyectos"
      data-theme-section={bg?.theme ?? "light"}
      data-bg-section={bg?.theme ?? "light"}
      style={bg ? { backgroundColor: bg.color } : undefined}
      className="bg-paper py-24 md:py-36"
    >
      <div className="favla-container grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-8">
        <SectionIntro
          eyebrow={eyebrow}
          title={title}
          description={description}
          cta={viewAllButton}
          tone="dark"
          className="md:col-span-4"
        />

        <div className="overflow-hidden md:col-span-8">
          <LoopSlider
            items={projects}
            ariaLabel="Proyectos destacados"
            tone="dark"
            itemClassName="w-[78%] pr-5 sm:w-[55%] md:w-[45%] lg:w-[34%]"
            renderItem={(project, i) => (
              <ProjectCard key={project.id ?? i} project={project} cursorMarqueeText={resolvedCursorText} />
            )}
          />
        </div>
      </div>
    </section>
  );
}
