import { proxyGet } from "@/app/api/v1/_utils/proxy";

// Handle fetching categories list
export async function GET(request: Request) {
  // Forward GET request with query params to backend
  return proxyGet({
    request,
    backendPaths: ["/categories"],
  });
}
