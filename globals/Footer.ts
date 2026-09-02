import type { GlobalConfig } from "payload";
import { cursorGrowField } from "../blocks/fields/cursorGrowField";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer (todas las páginas)",
  admin: {
    description: "Este contenido se muestra igual en todas las páginas del sitio. No hace falta repetirlo.",
  },
  fields: [
    { name: "logo", type: "upload", relationTo: "media", label: "Logo" },
    { name: "description", type: "textarea", label: "Mensaje breve de marca" },
    {
      name: "navigationColumns",
      type: "array",
      label: "Columnas de navegación",
      fields: [
        { name: "title", type: "text", required: true, label: "Título de columna" },
        {
          name: "links",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "link", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "contact",
      type: "group",
      label: "Contacto",
      fields: [
        { name: "phone", type: "text", label: "Teléfono" },
        { name: "email", type: "text", label: "Correo electrónico" },
        { name: "address", type: "text", label: "Dirección" },
      ],
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Redes sociales",
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "Instagram", value: "instagram" },
            { label: "Facebook", value: "facebook" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "YouTube", value: "youtube" },
            { label: "X / Twitter", value: "x" },
          ],
        },
        { name: "link", type: "text", required: true },
        {
          name: "iconStyle",
          type: "select",
          label: "Estilo del ícono",
          defaultValue: "fill",
          options: [
            { label: "Relleno (círculo de color sigue el cursor)", value: "fill" },
            { label: "Borde simple (sin relleno)", value: "outline" },
          ],
        },
        cursorGrowField,
      ],
    },
    {
      name: "legalLinks",
      type: "array",
      label: "Enlaces legales",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "link", type: "text", required: true },
      ],
    },
    { name: "copyright", type: "text", label: "Texto de copyright" },
  ],
};
