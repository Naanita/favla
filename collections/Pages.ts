import type { CollectionConfig } from "payload";
import { Hero } from "../blocks/Hero";
import { ProjectsSlider } from "../blocks/ProjectsSlider";
import { FeaturedNews } from "../blocks/FeaturedNews";
import { InitiativesSlider } from "../blocks/InitiativesSlider";
import { StickySteps } from "../blocks/StickySteps";
import { StoriesEditorial } from "../blocks/StoriesEditorial";
import { OpportunitiesSlider } from "../blocks/OpportunitiesSlider";
import { ScalingMedia } from "../blocks/ScalingMedia";
import { SplitFeatureSlider } from "../blocks/SplitFeatureSlider";

export const Pages: CollectionConfig = {
  slug: "pages",
  access: { read: () => true },
  admin: {
    useAsTitle: "titulo",
    defaultColumns: ["titulo", "slug", "_status", "updatedAt"],
    livePreview: {
      url: ({ data }) => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
        const path = data?.slug === "home" ? "" : (data?.slug ?? "");
        return `${base}/${path}?preview=true`;
      },
      breakpoints: [
        { label: "Celular", name: "mobile", width: 390, height: 844 },
        { label: "Escritorio", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  versions: {
    drafts: { autosave: { interval: 800 } },
  },
  fields: [
    { name: "titulo", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    {
      name: "layout",
      label: "Secciones de la página",
      type: "blocks",
      minRows: 1,
      blocks: [
        Hero,
        ProjectsSlider,
        FeaturedNews,
        InitiativesSlider,
        StickySteps,
        StoriesEditorial,
        OpportunitiesSlider,
        ScalingMedia,
        SplitFeatureSlider,
      ],
      admin: {
        initCollapsed: true,
        description:
          "El header y el footer no van aquí: se editan una sola vez desde Header y Footer en el menú lateral, y aparecen automáticamente en todas las páginas.",
      },
    },
  ],
};
