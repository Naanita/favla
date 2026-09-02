export type BlockBackground = { color: string; theme: "light" | "dark" };

const BLOCK_BACKGROUNDS: Record<string, BlockBackground> = {
  paper: { color: "var(--paper)", theme: "light" },
  white: { color: "var(--white)", theme: "light" },
  forest: { color: "var(--forest)", theme: "dark" },
  forestDeep: { color: "var(--forest-deep)", theme: "dark" },
  ink: { color: "var(--ink)", theme: "dark" },
};

/** Maps the admin's "Color de fondo del bloque" selection to an inline
 * background color plus the light/dark theme tag the navbar sync and the
 * [data-theme-section="dark"] text-flip CSS both key off of. Returns null
 * for "" (keep the block's designed default). */
export function resolveBlockBackground(value?: string | null): BlockBackground | null {
  if (!value) return null;
  return BLOCK_BACKGROUNDS[value] ?? null;
}
