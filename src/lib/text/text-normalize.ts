const DIACRITIC_REGEX = /[\u0300-\u036f]/g;
const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;
const EDGE_DASH_REGEX = /^-+|-+$/g;

// Normalize Vietnamese text for case-insensitive and accent-insensitive matching.
export function normalizeVietnameseText(value: string) {
  return value
    .replace(/[Đđ]/g, "d")
    .normalize("NFD")
    .replace(DIACRITIC_REGEX, "")
    .toLowerCase()
    .trim();
}

// Collapse user-facing text into a slug-safe token used in route parsing/building.
export function compactSlugToken(value: string) {
  return normalizeVietnameseText(value)
    .replace(NON_ALPHANUMERIC_REGEX, "-")
    .replace(EDGE_DASH_REGEX, "");
}

// Convert a slug token back into a readable label when no explicit label exists.
export function humanizeSlugToken(value: string) {
  if (!value) return "";

  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
