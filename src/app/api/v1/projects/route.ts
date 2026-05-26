import { proxyGet } from "@/app/api/v1/_utils/proxy";

// Handle fetching real estate projects list
export async function GET(request: Request) {
  // Forward GET request with search filters to backend
  return proxyGet({
    request,
    backendPaths: ["/projects"],
  });
}
