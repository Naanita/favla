import type { Block } from "payload";
import { baseBlockFields } from "./fields/baseBlockFields";
import { cursorGrowField } from "./fields/cursorGrowField";
import { ctaTypeField } from "./fields/ctaTypeField";
import { cursorMarqueeTextField } from "./fields/cursorMarqueeTextField";

export const Hero: Block = {
  slug: "hero",
  labels: { singular: "Hero 01", plural: "Heroes" },
  fields: [
    { name: "eyebrow", type: "text", label: "Eyebrow", defaultValue: "EN FAVLA" },
    {
      name: "title",
      type: "text",
      label: "Título (usa *texto* para marcar la parte en cursiva)",
      required: true,
    },
    { name: "description", type: "textarea", label: "Descripción" },
    {
      name: "backgroundType",
      type: "select",
      label: "Tipo de fondo",
      defaultValue: "image",
      options: [
        { label: "Imagen", value: "image" },
        { label: "Video", value: "video" },
      ],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Imagen de fondo (o poster del video mientras carga)",
    },
    { name: "imageAlt", type: "text", label: "Texto alternativo de la imagen" },
    {
      name: "imagePosition",
      type: "select",
      label: "Posición del sujeto en la imagen",
      defaultValue: "left center",
      options: [
        { label: "Izquierda", value: "left center" },
        { label: "Centro", value: "center" },
        { label: "Derecha", value: "right center" },
      ],
    },
    {
      name: "video",
      type: "upload",
      relationTo: "media",
      label: "Archivo de video de fondo",
      admin: { condition: (_, siblingData) => siblingData?.backgroundType === "video" },
    },
    {
      name: "primaryButton",
      type: "group",
      label: "Botón principal",
      fields: [
        { name: "label", type: "text", defaultValue: "Conoce más" },
        { name: "link", type: "text", defaultValue: "#proyectos" },
        ctaTypeField("fill"),
        cursorGrowField,
      ],
    },
    {
      name: "secondaryButton",
      type: "group",
      label: "Botón secundario (opcional)",
      fields: [
        { name: "label", type: "text" },
        { name: "link", type: "text" },
        ctaTypeField("underline"),
      ],
    },
    ...baseBlockFields,
    cursorMarqueeTextField("Seguir"),
  ],
};
