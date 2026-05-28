import type { Metadata } from "next";
import { connection } from "next/server";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ProjectListingClient from "@/components/listing-client/ProjectListingClient";
import { buildProjectCategoryBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { pageSeoFaq } from "@/constants/pageSeoFaq";
import { categoryService } from "@/services/category.service";
import { projectService } from "@/services/project.service";

export const metadata: Metadata = createPageMetadata({
  title: "Dự án",
  description: "Cập nhật thông tin dự án bất động sản nổi bật và mới nhất.",
  pathname: "/du-an",
});

export default async function DuAnPage() {
  await connection();

  // Fetch project categories for tabs/chips.
  const projectCategories = await categoryService.getProjectCategories();
  // Load static SEO/FAQ content for project page.
  const pageContent = pageSeoFaq["du-an"];

  return (
    <>
      <SafeFetch
        fetcher={projectService.getAll({
          limit: 24,
        })}
        debugLabel="Projects Response"
      >
        {(response) => (
          <ProjectListingClient
            projects={response.data ?? []}
            categories={projectCategories}
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
