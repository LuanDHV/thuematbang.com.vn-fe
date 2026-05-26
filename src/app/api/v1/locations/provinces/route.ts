import { proxyGet } from "@/app/api/v1/_utils/proxy";

// Handle fetching provinces list
export async function GET(request: Request) {
  // Forward GET request to backend
  return proxyGet({
    request,
    backendPaths: ["/locations/provinces"],
  });
}
