import type { Field } from "payload";

export const backgroundColorField: Field = {
  name: "backgroundColor",
  type: "select",
  label: "Color de fondo del bloque",
  defaultValue: "",
  options: [
    { label: "Original del diseño", value: "" },
    { label: "Papel (claro)", value: "paper" },
    { label: "Blanco cálido (claro)", value: "white" },
    { label: "Verde (oscuro)", value: "forest" },
    { label: "Verde profundo (oscuro)", value: "forestDeep" },
    { label: "Tinta (oscuro)", value: "ink" },
  ],
};
