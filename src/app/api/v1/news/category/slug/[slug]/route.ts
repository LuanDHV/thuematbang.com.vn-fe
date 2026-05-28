import { proxyGet } from "@/app/api/v1/_utils/proxy";

// Handle fetching news list by category slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params; // Extract slug from URL parameters

  // Forward GET request with encoded category slug to backend
  return proxyGet({
    request,
    backendPaths: [`/news/category/slug/${encodeURIComponent(slug)}`],
  });
}
