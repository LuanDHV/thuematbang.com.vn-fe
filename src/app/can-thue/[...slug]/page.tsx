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
    title: "Chi tiết cần thuê",
    description: "Thông tin chi tiết nhu cầu cần thuê.",
    pathname: `/can-thue/${slug.join("/")}`,
  });
}

export default function DynamicPage() {
  return <div>Chi tiết cần thuê</div>;
}
