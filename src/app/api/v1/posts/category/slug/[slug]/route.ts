import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const backendUrl = process.env.NEXT_PRIVATE_API_URL;

    const res = await fetch(
      `${backendUrl}/posts/category/slug/${slug}?page=${page}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok)
      return NextResponse.json(
        { error: "Backend error" },
        { status: res.status },
      );

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}
