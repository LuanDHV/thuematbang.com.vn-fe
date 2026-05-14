import type { Metadata } from "next";
import ProjectListingClient from "@/components/client/ProjectListingClient";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import PageSeoContent from "@/components/common/PageSeoContent";
import PageFaq from "@/components/common/PageFaq";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/mocks/pageSeoFaq";

export const metadata: Metadata = createPageMetadata({
  title: "Dự án",
  description: "Cập nhật thông tin dự án bất động sản nổi bật và mới nhất.",
  pathname: "/du-an",
});

export default function DuAnPage() {
  const pageContent = pageSeoFaq["du-an"];

  return (
    <>
      <div className="mx-auto mt-6 max-w-7xl px-4">
        <DynamicBreadcrumb
          items={[{ label: "Trang chủ", href: "/" }, { label: "Dự án" }]}
        />
      </div>
      <ProjectListingClient />
      <PageSeoContent content={pageContent.seoContent} />
      <PageFaq
        title={pageContent.faqTitle}
        description={pageContent.faqDescription}
        items={pageContent.faqs}
      />
    </>
  );
}
