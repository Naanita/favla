export const FAVLA_PLACEHOLDER_IMAGE = "/images/favla-placeholder.jpg";

export type PayloadMediaObject = {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

export type MediaField = PayloadMediaObject | string | number | null | undefined;

export function getMediaUrl(media?: MediaField): string {
  if (!media) return FAVLA_PLACEHOLDER_IMAGE;
  if (typeof media === "string") return media || FAVLA_PLACEHOLDER_IMAGE;
  if (typeof media === "number") return FAVLA_PLACEHOLDER_IMAGE;
  return media.url || FAVLA_PLACEHOLDER_IMAGE;
}

export function getMediaAlt(media?: MediaField, fallback = ""): string {
  if (media && typeof media === "object" && media.alt) return media.alt;
  return fallback;
}

export function getMediaDimensions(media?: MediaField) {
  if (media && typeof media === "object") {
    return { width: media.width ?? 1920, height: media.height ?? 1440 };
  }
  return { width: 1920, height: 1440 };
}
