type QueryLike =
  | string
  | Array<string | null | undefined>
  | null
  | undefined
  | {
      address?: string | null;
      street?: string | null;
      ward?: string | null;
      district?: string | null;
      city?: string | null;
      province?: string | null;
      lat?: number | string | null;
      lng?: number | string | null;
      latitude?: number | string | null;
      longitude?: number | string | null;
      query?: string | Array<string | null | undefined> | null;
      q?: string | null;
    };

const GOOGLE_MAPS_EMBED_BASE = "https://www.google.com/maps";

function normalizePart(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value).trim();
  return text;
}

function isFiniteNumber(value: unknown): value is number {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "string") return false;
  if (value.trim() === "") return false;
  return Number.isFinite(Number(value));
}

function toLatLng(value: unknown): string | null {
  return isFiniteNumber(value) ? String(Number(value)) : null;
}

export function buildMapQuery(input: QueryLike): string {
  if (typeof input === "string") {
    return input.trim();
  }

  if (Array.isArray(input)) {
    return input.map(normalizePart).filter(Boolean).join(", ");
  }

  if (!input) {
    return "";
  }

  const parts = [
    normalizePart(input.address),
    normalizePart(input.street),
    normalizePart(input.ward),
    normalizePart(input.district),
    normalizePart(input.city),
    normalizePart(input.province),
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(", ");
  }

  if (Array.isArray(input.query)) {
    return input.query.map(normalizePart).filter(Boolean).join(", ");
  }

  if (typeof input.query === "string") {
    return input.query.trim();
  }

  return normalizePart(input.q);
}

export function buildGoogleMapEmbedSrc(
  input: QueryLike,
  ...rest: Array<string | number | null | undefined>
): string {
  const zoomCandidate = rest.length > 0 ? rest[rest.length - 1] : undefined;
  const zoom =
    isFiniteNumber(zoomCandidate) && rest.length !== 2 ? Number(zoomCandidate) : 15;

  if (typeof input === "object" && input && !Array.isArray(input)) {
    const lat = toLatLng(input.lat ?? input.latitude);
    const lng = toLatLng(input.lng ?? input.longitude);

    if (lat && lng) {
      return `${GOOGLE_MAPS_EMBED_BASE}?q=${encodeURIComponent(
        `${lat},${lng}`,
      )}&z=${zoom}&output=embed`;
    }
  }

  if (rest.length >= 2 && isFiniteNumber(rest[0]) && isFiniteNumber(rest[1])) {
    const lat = toLatLng(rest[0]);
    const lng = toLatLng(rest[1]);
    if (lat && lng) {
      return `${GOOGLE_MAPS_EMBED_BASE}?q=${encodeURIComponent(
        `${lat},${lng}`,
      )}&z=${zoom}&output=embed`;
    }
  }

  const query = buildMapQuery(input);
  if (!query) {
    return "";
  }

  return `${GOOGLE_MAPS_EMBED_BASE}?q=${encodeURIComponent(
    query,
  )}&z=${zoom}&output=embed`;
}
