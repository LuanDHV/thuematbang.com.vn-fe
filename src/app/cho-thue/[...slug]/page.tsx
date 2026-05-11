import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return createPageMetadata({
    title: "Chi tiết cho thuê",
    description: "Thông tin chi tiết tin đăng cho thuê.",
    pathname: `/cho-thue/${slug.join("/")}`,
  });
}

export default function DynamicPage() {
  return <div>Chi tiết cho thuê</div>;
}
