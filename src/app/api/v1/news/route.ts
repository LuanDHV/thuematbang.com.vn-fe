import { proxyGet } from "@/app/api/v1/_utils/proxy";

// Handle fetching news articles list
export async function GET(request: Request) {
  // Forward GET request with filters and pagination to backend
  return proxyGet({
    request,
    backendPaths: ["/news"],
  });
}
