import type { Block } from "payload";
import { baseBlockFields } from "./fields/baseBlockFields";
import { backgroundColorField } from "./fields/backgroundColorField";
import { cursorGrowField } from "./fields/cursorGrowField";

export const SplitFeatureSlider: Block = {
  slug: "splitFeatureSlider",
  labels: { singular: "Slider 02", plural: "Sliders" },
  fields: [
    { name: "eyebrow", type: "text", label: "Eyebrow (etiqueta pequeña arriba del título)" },
    {
      name: "heading",
      type: "textarea",
      required: true,
      label: "Título (usa saltos de línea para dividir en líneas)",
    },
    { name: "description", type: "textarea", label: "Descripción (debajo del título)" },
    {
      name: "viewAllButton",
      type: "group",
      label: "Botón ver todas (opcional, aparece debajo del título)",
      fields: [
        { name: "label", type: "text", label: "Etiqueta" },
        { name: "link", type: "text", label: "Link" },
        cursorGrowField,
      ],
    },
    {
      name: "contentCardColor",
      type: "text",
      label: "Color de fondo de la tarjeta de contenido (hex, ej: #1C160A)",
      defaultValue: "#1C160A",
    },
    {
      name: "slides",
      type: "array",
      label: "Slides",
      required: true,
      minRows: 2,
      maxRows: 12,
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", required: true, label: "Título" },
        { name: "description", type: "textarea", required: true, label: "Descripción" },
        { name: "image", type: "upload", relationTo: "media", required: true, label: "Imagen" },
        {
          name: "imageAltOverride",
          type: "text",
          label: "Texto alternativo (opcional, usa el de la imagen si se deja vacío)",
        },
        {
          name: "link",
          type: "group",
          label: "Enlace (opcional)",
          fields: [
            { name: "label", type: "text", label: "Etiqueta" },
            { name: "url", type: "text", label: "URL" },
            { name: "newTab", type: "checkbox", label: "Abrir en pestaña nueva", defaultValue: false },
          ],
        },
      ],
    },
    {
      name: "behavior",
      type: "group",
      label: "Comportamiento",
      fields: [
        { name: "initialSlide", type: "number", label: "Slide inicial (índice, empieza en 0)", defaultValue: 0 },
        { name: "loop", type: "checkbox", label: "Loop infinito", defaultValue: true },
        { name: "autoplay", type: "checkbox", label: "Autoplay", defaultValue: true },
        {
          name: "autoplayDelayMs",
          type: "number",
          label: "Duración del autoplay (ms)",
          defaultValue: 3000,
          min: 1500,
          max: 10000,
        },
        { name: "enableTouchSwipe", type: "checkbox", label: "Permitir swipe táctil", defaultValue: true },
        {
          name: "sectionAriaLabel",
          type: "text",
          label: "Aria label de la sección (accesibilidad)",
          defaultValue: "Featured content carousel",
        },
      ],
    },
    ...baseBlockFields,
    backgroundColorField,
  ],
};
