import { proxyGet } from "@/app/api/v1/_utils/proxy";

// Handle fetching news article details by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params; // Extract article slug from URL parameters

  // Forward GET request to backend for specific article data
  return proxyGet({
    request,
    backendPaths: [`/news/slug/${encodeURIComponent(slug)}`],
  });
}
