import { NextResponse } from "next/server";
import { proxyGet } from "@/app/api/v1/_utils/proxy";

// Handle fetching wards by province ID from query parameter
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get("provinceId");

  // Validate province ID existence
  if (!provinceId) {
    return NextResponse.json(
      {
        error: "Missing provinceId query parameter",
        statusCode: 400,
      },
      { status: 400 },
    );
  }

  // Forward GET request with province parameter to backend
  return proxyGet({
    request,
    backendPaths: [`/locations/provinces/${provinceId}/wards`],
  });
}
