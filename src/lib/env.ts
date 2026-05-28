// Fallback API path if env variable is missing
const FALLBACK_PUBLIC_API_BASE = "/api/v1";

// Get public API URL for client-side
export function getPublicApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || FALLBACK_PUBLIC_API_BASE;
}

// Get private API URL for server-side (required)
export function getPrivateApiBaseUrl() {
  const value = process.env.NEXT_PRIVATE_API_URL;
  if (!value) {
    throw new Error("Missing NEXT_PRIVATE_API_URL");
  }
  return value;
}
