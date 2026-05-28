import { proxyGet } from "@/app/api/v1/_utils/proxy";

// Handle fetching wards by province ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ provinceId: string }> },
) {
  const { provinceId } = await params;

  // Forward GET request with province parameter to backend
  return proxyGet({
    request,
    backendPaths: [`/locations/provinces/${provinceId}/wards`],
  });
}
