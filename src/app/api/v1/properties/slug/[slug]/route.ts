import { proxyGet } from "@/app/api/v1/_utils/proxy";

// Handle fetching property details by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params; // Extract property slug from URL parameters

  // Forward GET request to backend for specific property data
  return proxyGet({
    request,
    backendPaths: [`/properties/slug/${encodeURIComponent(slug)}`],
  });
}
