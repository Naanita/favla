import type { Field } from "payload";

export function cursorMarqueeTextField(defaultValue: string): Field {
  return {
    name: "cursorMarqueeText",
    type: "text",
    label: "Texto del cursor animado",
    defaultValue,
    admin: {
      condition: (_, siblingData) => siblingData?.cursorMarquee !== false,
    },
  };
}
