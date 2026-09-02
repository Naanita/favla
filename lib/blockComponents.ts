import type { ComponentType } from "react";
import { Hero } from "@/components/blocks/Hero";
import { ProjectsSlider } from "@/components/blocks/ProjectsSlider";
import { FeaturedNews } from "@/components/blocks/FeaturedNews";
import { InitiativesSlider } from "@/components/blocks/InitiativesSlider";
import { StickySteps } from "@/components/blocks/StickySteps";
import { StoriesEditorial } from "@/components/blocks/StoriesEditorial";
import { OpportunitiesSlider } from "@/components/blocks/OpportunitiesSlider";
import { ScalingMedia } from "@/components/blocks/ScalingMedia";
import { SplitFeatureSlider } from "@/components/blocks/SplitFeatureSlider";

export type BlockData = {
  id?: string | null;
  blockType: string;
  blockName?: string | null;
  isVisible?: boolean | null;
  [key: string]: unknown;
};

// Payload blocks have heterogeneous, mutually incompatible prop shapes, so the
// registry necessarily erases them to a common component type at this boundary.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const blockComponents: Record<string, ComponentType<any>> = {
  hero: Hero,
  projectsSlider: ProjectsSlider,
  featuredNews: FeaturedNews,
  initiativesSlider: InitiativesSlider,
  stickySteps: StickySteps,
  storiesEditorial: StoriesEditorial,
  opportunitiesSlider: OpportunitiesSlider,
  scalingMedia: ScalingMedia,
  splitFeatureSlider: SplitFeatureSlider,
};
