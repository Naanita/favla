export const ANIMATION_PRESETS = {
  none: "none",
  fade: "fade",
  fadeUp: "fade-up",
  splitText: "split-text",
  maskReveal: "mask-reveal",
  staggerCards: "stagger-cards",
  parallax: "parallax",
} as const;

export type AnimationPresetValue = (typeof ANIMATION_PRESETS)[keyof typeof ANIMATION_PRESETS];

export const EASE = {
  editorial: "power3.out",
  soft: "power2.out",
  elastic: "elastic.out(1, 0.5)",
  mask: "power4.inOut",
};

export const DURATION = {
  fast: 0.6,
  base: 0.9,
  slow: 1.4,
};

export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.12,
};

export type AnimationConfig = {
  preset?: AnimationPresetValue | string | null;
  duration?: number | null;
  delay?: number | null;
  stagger?: number | null;
  enableParallax?: boolean | null;
};

/**
 * True when motion should be skipped and content shown in its final state:
 * either the user has prefers-reduced-motion set, or the page is rendering
 * inside Payload's admin Live Preview iframe. Editors need to read and edit
 * static content, not watch entrance animations replay on every keystroke.
 */
export function prefersStaticMotion(): boolean {
  if (typeof window === "undefined") return true;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const inEditorFrame = window.self !== window.top;
  return reduced || inEditorFrame;
}

export function resolveAnimationConfig(animation?: AnimationConfig | null) {
  return {
    preset: (animation?.preset as AnimationPresetValue) || "fade-up",
    duration: animation?.duration ?? DURATION.base,
    delay: animation?.delay ?? 0,
    stagger: animation?.stagger ?? STAGGER.base,
    enableParallax: animation?.enableParallax ?? false,
  };
}
