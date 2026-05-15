import type { Metadata } from "next";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ProjectListingClient from "@/components/listing-client/ProjectListingClient";
import { buildProjectCategoryBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/mocks/pageSeoFaq";

export const metadata: Metadata = createPageMetadata({
  title: "Dự án",
  description:
    "Cập nhật thông tin dự án bất động sản nổi bật và mới nhất.",
  pathname: "/du-an",
});

export default function DuAnPage() {
  const pageContent = pageSeoFaq["du-an"];

  return (
    <>
      <ProjectListingClient breadcrumbItems={buildProjectCategoryBreadcrumbs()} />
      <PageSeoContent content={pageContent.seoContent} />
      <PageFaq
        title={pageContent.faqTitle}
        description={pageContent.faqDescription}
        items={pageContent.faqs}
      />
    </>
  );
}
