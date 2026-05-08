import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";
import { Category } from "@/types/category";

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PRIVATE_API_URL;

    const res = await fetch(`${backendUrl}/categories`, {
      cache: "no-store",
    });

    const categories = await res.json();

    const response: ApiResponse<Category[]> = {
      data: categories,
      statusCode: 200,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}
