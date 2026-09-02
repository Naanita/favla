import type { GlobalConfig } from "payload";
import { cursorGrowField } from "../blocks/fields/cursorGrowField";
import { ctaTypeField } from "../blocks/fields/ctaTypeField";

export const Header: GlobalConfig = {
  slug: "header",
  label: "Header (todas las páginas)",
  admin: {
    description: "Este contenido se muestra igual en todas las páginas del sitio. No hace falta repetirlo.",
  },
  fields: [
    { name: "logo", type: "upload", relationTo: "media", label: "Logo" },
    {
      name: "navigationItems",
      type: "array",
      label: "Enlaces de navegación",
      minRows: 1,
      fields: [
        { name: "label", type: "text", required: true },
        { name: "link", type: "text", required: true },
        { name: "openInNewTab", type: "checkbox", label: "Abrir en pestaña nueva", defaultValue: false },
      ],
    },
    {
      name: "primaryButton",
      type: "group",
      label: "Botón principal",
      fields: [
        { name: "label", type: "text", defaultValue: "Dona ahora" },
        { name: "link", type: "text", defaultValue: "/dona" },
        ctaTypeField("fill"),
        cursorGrowField,
      ],
    },
    { name: "menuLabel", type: "text", label: "Etiqueta del menú (accesibilidad)", defaultValue: "Menú" },
    { name: "hideOnScrollDown", type: "checkbox", label: "Ocultar al bajar, mostrar al subir", defaultValue: true },
  ],
};
