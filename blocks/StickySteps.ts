import type { Block } from "payload";
import { baseBlockFields } from "./fields/baseBlockFields";
import { backgroundColorField } from "./fields/backgroundColorField";
import { cursorGrowField } from "./fields/cursorGrowField";
import { ctaTypeField } from "./fields/ctaTypeField";

export const StickySteps: Block = {
  slug: "stickySteps",
  labels: { singular: "Sticky Steps 01", plural: "Sticky Steps" },
  fields: [
    {
      name: "initiatives",
      type: "array",
      label: "Iniciativas",
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: "eyebrow", type: "text", label: "Etiqueta" },
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
        { name: "image", type: "upload", relationTo: "media" },
        { name: "imageAlt", type: "text" },
        { name: "link", type: "text" },
        { name: "linkLabel", type: "text", label: "Texto del enlace", defaultValue: "Conoce más" },
        ctaTypeField("arrow"),
        cursorGrowField,
      ],
    },
    ...baseBlockFields,
    backgroundColorField,
  ],
};
