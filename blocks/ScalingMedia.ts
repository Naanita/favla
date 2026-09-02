import type { Block } from "payload";
import { baseBlockFields } from "./fields/baseBlockFields";
import { backgroundColorField } from "./fields/backgroundColorField";
import { cursorGrowField } from "./fields/cursorGrowField";
import { ctaTypeField } from "./fields/ctaTypeField";

export const ScalingMedia: Block = {
  slug: "scalingMedia",
  labels: { singular: "Scaling Element 01", plural: "Scaling Elements" },
  fields: [
    { name: "eyebrow", type: "text", defaultValue: "[ Recurso ]" },
    { name: "title", type: "text", required: true, label: "Título inicial" },
    {
      name: "backgroundType",
      type: "select",
      label: "Tipo de contenido",
      defaultValue: "video",
      options: [
        { label: "Video", value: "video" },
        { label: "Imagen", value: "image" },
      ],
    },
    { name: "image", type: "upload", relationTo: "media", label: "Imagen" },
    { name: "imageAlt", type: "text", label: "Texto alternativo" },
    {
      name: "video",
      type: "upload",
      relationTo: "media",
      label: "Video",
      admin: { condition: (_, siblingData) => siblingData?.backgroundType === "video" },
    },
    { name: "secondTitle", type: "text", label: "Título después de expandir" },
    {
      name: "primaryButton",
      type: "group",
      label: "Botón principal",
      fields: [
        { name: "label", type: "text" },
        { name: "link", type: "text" },
        ctaTypeField("outline"),
        cursorGrowField,
      ],
    },
    {
      name: "secondaryLink",
      type: "group",
      label: "Enlace de texto (opcional)",
      fields: [
        { name: "label", type: "text" },
        { name: "link", type: "text" },
        ctaTypeField("underline"),
      ],
    },
    ...baseBlockFields,
    backgroundColorField,
  ],
};
