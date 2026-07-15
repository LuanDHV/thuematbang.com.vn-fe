import { NextResponse } from "next/server";
import { getPrivateApiBaseUrl } from "@/lib/env";

// Handle Google OAuth login redirection
export async function GET() {
  // Get API base URL and strip trailing slash
  const backendUrl = getPrivateApiBaseUrl().replace(/\/$/, "");

  // Redirect to backend Google auth endpoint
  return NextResponse.redirect(`${backendUrl}/auth/google`);
}
