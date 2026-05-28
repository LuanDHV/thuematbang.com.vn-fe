import { proxyGet } from "@/app/api/v1/_utils/proxy";

// Handle searching properties by flat slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ flatSlug: string }> },
) {
  const { flatSlug } = await params; // Extract flat slug from URL parameters

  // Forward GET request with encoded flat slug to backend
  return proxyGet({
    request,
    backendPaths: [
      `/properties/search/by-slug/${encodeURIComponent(flatSlug)}`,
    ],
  });
}
