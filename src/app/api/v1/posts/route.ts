import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PRIVATE_API_URL;

    const res = await fetch(`${backendUrl}/posts`, {
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}
