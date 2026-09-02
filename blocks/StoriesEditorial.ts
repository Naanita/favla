import type { Block } from "payload";
import { baseBlockFields } from "./fields/baseBlockFields";

export const StoriesEditorial: Block = {
  slug: "storiesEditorial",
  labels: { singular: "Layout 02", plural: "Layouts" },
  fields: [
    { name: "eyebrow", type: "text", defaultValue: "HISTORIAS QUE TRANSFORMAN" },
    { name: "title", type: "text", required: true, defaultValue: "Historias FAVLA" },
    { name: "description", type: "textarea" },
    {
      name: "viewAllButton",
      type: "group",
      label: "Botón ver más",
      fields: [
        { name: "label", type: "text", defaultValue: "Ver más historias" },
        { name: "link", type: "text", defaultValue: "#" },
      ],
    },
    {
      name: "stories",
      type: "array",
      label: "Historias",
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "excerpt", type: "textarea" },
        { name: "image", type: "upload", relationTo: "media" },
        { name: "imageAlt", type: "text" },
        { name: "link", type: "text" },
        {
          name: "visualPosition",
          type: "select",
          label: "Posición visual",
          options: [
            { label: "Automática (alterna)", value: "" },
            { label: "Imagen grande a la izquierda", value: "large-left" },
            { label: "Imagen grande a la derecha", value: "large-right" },
          ],
        },
      ],
    },
    ...baseBlockFields,
  ],
};
