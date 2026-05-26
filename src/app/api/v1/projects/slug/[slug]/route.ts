import { proxyGet } from "@/app/api/v1/_utils/proxy";

// Handle fetching project details by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params; // Extract project slug from URL parameters

  // Forward GET request to backend for specific project data
  return proxyGet({
    request,
    backendPaths: [`/projects/slug/${encodeURIComponent(slug)}`],
  });
}
