type GoogleMapEmbedParams = {
  latitude?: number | string | null;
  longitude?: number | string | null;
  query?: string | null;
  zoom?: number;
};

export function buildGoogleMapQuery(
  parts: Array<string | null | undefined>,
): string {
  return parts.filter(Boolean).join(", ");
}

function parseGoogleMapCoordinate(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string" && !value.trim()) {
    return undefined;
  }

  const normalizedValue = Number(value);
  return Number.isFinite(normalizedValue) ? normalizedValue : undefined;
}

export function buildGoogleMapEmbedSrc({
  latitude,
  longitude,
  query,
  zoom = 15,
}: GoogleMapEmbedParams): string | null {
  const normalizedLatitude = parseGoogleMapCoordinate(latitude);
  const normalizedLongitude = parseGoogleMapCoordinate(longitude);
  const normalizedQuery = String(query ?? "").trim();

  if (
    typeof normalizedLatitude !== "number" ||
    typeof normalizedLongitude !== "number"
  ) {
    if (!normalizedQuery) {
      return null;
    }

    const searchParams = new URLSearchParams({
      q: normalizedQuery,
      z: String(zoom),
      output: "embed",
      hl: "vi",
    });

    return `https://www.google.com/maps?${searchParams.toString()}`;
  }

  const searchParams = new URLSearchParams({
    q: `${normalizedLatitude},${normalizedLongitude}`,
    ll: `${normalizedLatitude},${normalizedLongitude}`,
    z: String(zoom),
    output: "embed",
    hl: "vi",
  });

  return `https://www.google.com/maps?${searchParams.toString()}`;
}
