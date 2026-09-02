export function SectionLabel({
  children,
  className = "",
  tone = "accent",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "accent" | "paper";
}) {
  const toneClass = tone === "accent" ? "text-accent" : "text-paper/80";
  return (
    <span className={`favla-eyebrow inline-flex items-center gap-3 ${toneClass} ${className}`}>
      <span className="h-px w-8 bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}
