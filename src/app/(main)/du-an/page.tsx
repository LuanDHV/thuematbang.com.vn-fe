import type { Metadata } from "next";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ProjectListingClient from "@/components/listing-client/ProjectListingClient";
import { buildProjectCategoryBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/constants/pageSeoFaq";
import { projectService } from "@/services/project.service";

export const metadata: Metadata = createPageMetadata({
  title: "Dự án",
  description: "Cập nhật thông tin dự án bất động sản nổi bật và mới nhất.",
  pathname: "/du-an",
});

export default async function DuAnPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const pageContent = pageSeoFaq["du-an"];
  const params = searchParams ? await searchParams : undefined;
  const page = Math.max(1, Number(params?.page || "1") || 1);
  const limit = 12;

  return (
    <>
      <SafeFetch fetcher={projectService.getAll({ page, limit })}>
        {(response) => (
          <ProjectListingClient
            projects={response.data ?? []}
            breadcrumbItems={buildProjectCategoryBreadcrumbs()}
            paginationMeta={response.meta}
          />
        )}
      </SafeFetch>
      <PageSeoContent content={pageContent.seoContent} />
      <PageFaq
        title={pageContent.faqTitle}
        description={pageContent.faqDescription}
        items={pageContent.faqs}
      />
    </>
  );
}





