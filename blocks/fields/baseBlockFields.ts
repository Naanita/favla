import type { Field } from "payload";

// Deliberately does NOT include theme, spacing, or animation controls.
// Visual design and motion are owned entirely by the React component code
// for each block — the CMS only edits text, images, and links. This keeps
// every section's look consistent with the art direction and keeps the
// admin editing experience simple: no design decisions to make there.
// cursorMarquee is the one exception: it's an on/off interaction toggle,
// not a design choice, and only has an effect on blocks whose components
// already define hoverable cursor targets.
export const baseBlockFields: Field[] = [
  { name: "isVisible", type: "checkbox", label: "Visible en el sitio", defaultValue: true },
  {
    name: "cursorMarquee",
    type: "checkbox",
    label: "Cursor con texto animado al pasar el mouse (donde aplique)",
    defaultValue: true,
  },
];
