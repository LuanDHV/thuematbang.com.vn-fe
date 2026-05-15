import type { Metadata } from "next";
import ProjectListingClient from "@/components/listing-client/ProjectListingClient";
import PageSeoContent from "@/components/common/PageSeoContent";
import PageFaq from "@/components/common/PageFaq";
import { buildProjectCategoryBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/mocks/pageSeoFaq";

export const metadata: Metadata = createPageMetadata({
  title: "Dá»± Ã¡n",
  description: "Cáº­p nháº­t thÃ´ng tin dá»± Ã¡n báº¥t Ä‘á»™ng sáº£n ná»•i báº­t vÃ  má»›i nháº¥t.",
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
