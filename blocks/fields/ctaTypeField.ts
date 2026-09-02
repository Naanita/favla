import type { Field } from "payload";

export function ctaTypeField(defaultValue: "fill" | "outline" | "underline" | "arrow" | "magnetic"): Field {
  return {
    name: "type",
    type: "select",
    label: "Estilo del botón",
    defaultValue,
    options: [
      { label: "Relleno (círculo de color sigue el cursor)", value: "fill" },
      { label: "Borde (se rellena en hover)", value: "outline" },
      { label: "Subrayado simple", value: "underline" },
      { label: "Flecha + texto", value: "arrow" },
      { label: "Magnético (subrayado + flecha sigue el cursor)", value: "magnetic" },
    ],
  };
}
