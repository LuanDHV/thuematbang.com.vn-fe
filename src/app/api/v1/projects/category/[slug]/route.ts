import { proxyGet } from "@/app/api/v1/_utils/proxy";

// Handle fetching projects list by category slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params; // Extract category slug from URL parameters

  // Forward GET request with encoded slug to backend
  return proxyGet({
    request,
    backendPaths: [`/projects/category/${encodeURIComponent(slug)}`],
  });
}
