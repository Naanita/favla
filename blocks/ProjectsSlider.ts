import type { Block } from "payload";
import { baseBlockFields } from "./fields/baseBlockFields";
import { backgroundColorField } from "./fields/backgroundColorField";
import { ctaTypeField } from "./fields/ctaTypeField";
import { cursorMarqueeTextField } from "./fields/cursorMarqueeTextField";

export const iconOptions = [
  { label: "Brote (agro)", value: "sprout" },
  { label: "Personas", value: "users" },
  { label: "Agua", value: "droplets" },
  { label: "Corazón", value: "heart" },
  { label: "Hoja", value: "leaf" },
  { label: "Brújula", value: "compass" },
];

export const ProjectsSlider: Block = {
  slug: "projectsSlider",
  labels: { singular: "Slider 01", plural: "Sliders" },
  fields: [
    { name: "eyebrow", type: "text", defaultValue: "NUESTRO IMPACTO" },
    { name: "title", type: "text", required: true, defaultValue: "Proyectos que generan cambio real" },
    { name: "description", type: "textarea" },
    {
      name: "viewAllButton",
      type: "group",
      label: "Botón ver todos",
      fields: [
        { name: "label", type: "text", defaultValue: "Ver todos los proyectos" },
        { name: "link", type: "text", defaultValue: "#" },
        ctaTypeField("magnetic"),
      ],
    },
    {
      name: "projects",
      type: "array",
      label: "Proyectos",
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: "category", type: "text", label: "Categoría" },
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
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
            { label: "Arriba", value: "center top" },
          ],
        },
        { name: "link", type: "text" },
        { name: "icon", type: "select", defaultValue: "sprout", options: iconOptions },
      ],
    },
    ...baseBlockFields,
    backgroundColorField,
    cursorMarqueeTextField("Ver proyecto"),
  ],
};
