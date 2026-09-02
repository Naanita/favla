import { AnimatedHeading, AnimatedText } from "./AnimatedHeading";
import { SectionLabel } from "./SectionLabel";
import { CtaButton, type CtaButtonType } from "./CtaButton";

export function SectionIntro({
  eyebrow,
  title,
  description,
  cta,
  tone = "dark",
  className = "",
}: {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  cta?: { label?: string | null; link?: string | null; type?: CtaButtonType | null } | null;
  tone?: "dark" | "light";
  className?: string;
}) {
  const textTone = tone === "dark" ? "text-ink" : "text-paper";
  const mutedTone = tone === "dark" ? "text-muted" : "text-paper/75";

  return (
    <div className={className}>
      {eyebrow && (
        <SectionLabel tone={tone === "dark" ? "accent" : "paper"} className="mb-5">
          {eyebrow}
        </SectionLabel>
      )}
      <AnimatedHeading
        as="h2"
        lines={title.split("\n")}
        className={`font-serif text-4xl leading-[1.1] sm:text-5xl ${textTone}`}
      />
      {description && (
        <AnimatedText
          text={description}
          className={`mt-5 max-w-md text-base leading-relaxed ${mutedTone}`}
        />
      )}
      {cta?.label && (
        <CtaButton
          type={cta.type || "magnetic"}
          href={cta.link || "#"}
          label={cta.label}
          tone={tone}
          className="mt-8"
        />
      )}
    </div>
  );
}
