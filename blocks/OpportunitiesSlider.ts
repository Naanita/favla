import type { Block } from "payload";
import { baseBlockFields } from "./fields/baseBlockFields";
import { backgroundColorField } from "./fields/backgroundColorField";
import { ctaTypeField } from "./fields/ctaTypeField";

export const OpportunitiesSlider: Block = {
  slug: "opportunitiesSlider",
  labels: { singular: "Layout 03", plural: "Layouts" },
  fields: [
    { name: "eyebrow", type: "text", defaultValue: "SÚMATE AL TALENTO" },
    { name: "title", type: "text", required: true, defaultValue: "Convocatorias abiertas" },
    { name: "description", type: "textarea" },
    { name: "backgroundImage", type: "upload", relationTo: "media", label: "Imagen de fondo" },
    {
      name: "viewAllButton",
      type: "group",
      label: "Botón ver todas",
      fields: [
        { name: "label", type: "text", defaultValue: "Ver todas las convocatorias" },
        { name: "link", type: "text", defaultValue: "#" },
        ctaTypeField("magnetic"),
      ],
    },
    {
      name: "opportunities",
      type: "array",
      label: "Convocatorias",
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "date", type: "text", label: "Fecha" },
        { name: "location", type: "text", label: "Ubicación" },
        {
          name: "status",
          type: "select",
          defaultValue: "open",
          options: [
            { label: "Abierta", value: "open" },
            { label: "Cerrada", value: "closed" },
            { label: "Próximamente", value: "upcoming" },
          ],
        },
        { name: "statusLabel", type: "text", label: "Etiqueta de estado (opcional)" },
        { name: "link", type: "text" },
      ],
    },
    {
      name: "sliderSettings",
      type: "group",
      label: "Configuración (mobile)",
      fields: [
        { name: "drag", type: "checkbox", defaultValue: true },
        { name: "showArrows", type: "checkbox", defaultValue: true },
        { name: "showPagination", type: "checkbox", defaultValue: true },
      ],
    },
    ...baseBlockFields,
    backgroundColorField,
  ],
};
