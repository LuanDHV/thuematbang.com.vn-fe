import type { Metadata } from "next";
import { connection } from "next/server";
import PageStructuredData from "@/components/common/PageStructuredData";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import ProjectListingClient from "@/components/listing-client/ProjectListingClient";
import { buildProjectCategoryBreadcrumbs } from "@/lib/listing/flat-url";
import { buildLatestListingTitle, createPageMetadata } from "@/lib/metadata";
import { buildWebPageSchema } from "@/lib/seo";
import { categoryService } from "@/services/category.service";
import { faqService } from "@/services/faq.service";
import { seoContentService } from "@/services/seo-content.service";
import { projectService } from "@/services/project.service";

export const metadata: Metadata = createPageMetadata({
  title: buildLatestListingTitle("Dự án bất động sản"),
  description:
    "Khám phá các dự án bất động sản nổi bật và mới nhất, kèm thông tin vị trí, quy mô, tiện ích và tiến độ để bạn so sánh, đánh giá và chọn đúng dự án phù hợp nhu cầu.",
  pathname: "/du-an",
});

export default async function DuAnPage() {
  await connection();

  // Fetch project categories for tabs/chips.
  const projectCategories = await categoryService.getProjectCategories();
  const [seoRes, faqRes] = await Promise.all([
    seoContentService.getByPage("du-an").catch(() => ({ data: null })),
    faqService
      .getByPage("du-an")
      .catch(() => ({ data: { page: "du-an", faqs: [] } })),
  ]);

  return (
    <>
      <PageStructuredData
        schemas={[
          buildWebPageSchema({
            title: buildLatestListingTitle("Dự án bất động sản"),
            description:
              "Khám phá các dự án bất động sản nổi bật và mới nhất, kèm thông tin vị trí, quy mô, tiện ích và tiến độ để bạn so sánh, đánh giá và chọn đúng dự án phù hợp nhu cầu.",
            url: "/du-an",
            schemaType: "CollectionPage",
          }),
        ]}
      />

      <SafeFetch
        fetcher={projectService.getAll({
          filters: {
            sortBy: "createdAt",
            sortOrder: "desc",
          },
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
      <PageSeoContent seoData={seoRes.data} />
      <PageFaq faqData={faqRes.data} />
    </>
  );
}
