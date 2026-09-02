import type { Block } from "payload";
import { baseBlockFields } from "./fields/baseBlockFields";
import { backgroundColorField } from "./fields/backgroundColorField";
import { ctaTypeField } from "./fields/ctaTypeField";
import { cursorMarqueeTextField } from "./fields/cursorMarqueeTextField";

export const FeaturedNews: Block = {
  slug: "featuredNews",
  labels: { singular: "Layout 01", plural: "Layouts" },
  fields: [
    { name: "eyebrow", type: "text", defaultValue: "ACTUALIDAD" },
    { name: "title", type: "text", required: true, defaultValue: "Noticias que inspiran acción" },
    { name: "description", type: "textarea" },
    {
      name: "viewAllButton",
      type: "group",
      label: "Botón ver todas",
      fields: [
        { name: "label", type: "text", defaultValue: "Ver todas las noticias" },
        { name: "link", type: "text", defaultValue: "#" },
        ctaTypeField("magnetic"),
      ],
    },
    {
      name: "articles",
      type: "array",
      label: "Noticias",
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: "category", type: "text", label: "Categoría" },
        { name: "title", type: "text", required: true },
        { name: "excerpt", type: "textarea" },
        { name: "image", type: "upload", relationTo: "media" },
        { name: "imageAlt", type: "text" },
        {
          name: "imagePosition",
          type: "select",
          defaultValue: "center",
          options: [
            { label: "Izquierda", value: "left center" },
            { label: "Centro", value: "center" },
            { label: "Derecha", value: "right center" },
          ],
        },
        { name: "link", type: "text" },
        {
          name: "statistics",
          type: "array",
          label: "Cifras destacadas (opcional)",
          fields: [
            { name: "value", type: "text", required: true, label: "Valor (ej: 2.075)" },
            { name: "label", type: "text", required: true, label: "Etiqueta" },
          ],
        },
      ],
    },
    ...baseBlockFields,
    backgroundColorField,
    cursorMarqueeTextField("Ver noticia"),
  ],
};
