import { proxyGet } from "@/app/api/v1/_utils/proxy";

// Handle fetching rent request details by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params; // Extract rent request slug from URL parameters

  // Forward GET request to backend for specific rent request data
  return proxyGet({
    request,
    backendPaths: [`/rent-requests/slug/${encodeURIComponent(slug)}`],
  });
}
