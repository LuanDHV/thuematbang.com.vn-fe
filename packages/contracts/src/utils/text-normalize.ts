const DIACRITIC_REGEX = /[\u0300-\u036f]/g;
const NON_ALPHANUMERIC_REGEX = /[^a-z0-9]+/g;
const EDGE_DASH_REGEX = /^-+|-+$/g;

export function normalizeVietnameseText(value: string) {
  return value
    .replace(/[Đđ]/g, "d")
    .normalize("NFD")
    .replace(DIACRITIC_REGEX, "")
    .toLowerCase()
    .trim();
}

export function compactSlugToken(value: string) {
  return normalizeVietnameseText(value)
    .replace(NON_ALPHANUMERIC_REGEX, "-")
    .replace(EDGE_DASH_REGEX, "");
}

export function humanizeSlugToken(value: string) {
  if (!value) return "";
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
