import { proxyGet } from "@/app/api/v1/_utils/proxy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page } = await params;

  return proxyGet({
    request,
    backendPaths: [`/seo-contents/page/${encodeURIComponent(page)}`],
  });
}
