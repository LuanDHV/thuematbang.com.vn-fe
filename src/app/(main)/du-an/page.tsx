import type { Metadata } from "next";
import ProjectListingClient from "@/components/client/ProjectListingClient";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Dự án",
  description: "Cập nhật thông tin dự án bất động sản nổi bật và mới nhất.",
  pathname: "/du-an",
});

export default function DuAnPage() {
  return (
    <>
      <div className="mx-auto mt-6 max-w-7xl px-4">
        <DynamicBreadcrumb
          items={[{ label: "Trang chủ", href: "/" }, { label: "Dự án" }]}
        />
      </div>
      <ProjectListingClient />
    </>
  );
}
