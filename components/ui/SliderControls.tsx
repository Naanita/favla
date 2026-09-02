import { ChevronLeft, ChevronRight } from "lucide-react";

export function SliderControls({
  onPrev,
  onNext,
  count,
  activeIndex,
  onDotClick,
  tone = "dark",
  className = "",
}: {
  onPrev?: () => void;
  onNext?: () => void;
  count?: number;
  activeIndex?: number;
  onDotClick?: (index: number) => void;
  tone?: "dark" | "light";
  className?: string;
}) {
  const borderClass = tone === "dark" ? "border-line text-ink" : "border-line-light text-paper";
  const dotInactive = tone === "dark" ? "bg-ink/25 hover:bg-ink/50" : "bg-paper/40 hover:bg-paper/70";

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          aria-label="Anterior"
          className={`focus-ring flex h-11 w-11 items-center justify-center rounded-full border ${borderClass} transition-colors hover:border-accent hover:text-accent`}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
      )}

      {typeof count === "number" && count > 1 && onDotClick && (
        <div className="flex items-center gap-2" role="tablist" aria-label="Seleccionar elemento">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Ir al elemento ${i + 1}`}
              onClick={() => onDotClick(i)}
              className={`focus-ring h-2 rounded-full transition-all ${
                i === activeIndex ? "w-8 bg-accent" : `w-2 ${dotInactive}`
              }`}
            />
          ))}
        </div>
      )}

      {onNext && (
        <button
          type="button"
          onClick={onNext}
          aria-label="Siguiente"
          className={`focus-ring flex h-11 w-11 items-center justify-center rounded-full border ${borderClass} transition-colors hover:border-accent hover:text-accent`}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
