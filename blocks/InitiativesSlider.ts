import type { Block } from "payload";
import { baseBlockFields } from "./fields/baseBlockFields";
import { backgroundColorField } from "./fields/backgroundColorField";
import { cursorGrowField } from "./fields/cursorGrowField";
import { ctaTypeField } from "./fields/ctaTypeField";

export const InitiativesSlider: Block = {
  slug: "initiativesSlider",
  labels: { singular: "Opening 01", plural: "Openings" },
  fields: [
    { name: "eyebrow", type: "text", defaultValue: "CONECTA CON NUESTRO IMPACTO" },
    { name: "title", type: "text", required: true, defaultValue: "Iniciativas FAVLA" },
    { name: "description", type: "textarea" },
    { name: "entranceImage", type: "upload", relationTo: "media", label: "Imagen de entrada (zoom)" },
    { name: "entranceImageAlt", type: "text", label: "Texto alternativo" },
    {
      name: "viewAllButton",
      type: "group",
      label: "Botón ver todas",
      fields: [
        { name: "label", type: "text", defaultValue: "Conoce todas" },
        { name: "link", type: "text", defaultValue: "#" },
        ctaTypeField("outline"),
        cursorGrowField,
      ],
    },
    ...baseBlockFields,
    backgroundColorField,
  ],
};
