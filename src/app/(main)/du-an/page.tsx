import type { Metadata } from "next";
import { connection } from "next/server";
import PageStructuredData from "@/components/common/PageStructuredData";
import SafeFetch from "@/components/common/SafeFetch";
import PageFaq from "@/components/common/PageFaq";
import PageSeoContent from "@/components/common/PageSeoContent";
import Title from "@/components/common/Title";
import ProjectListingClient from "@/components/listing-client/ProjectListingClient";
import { buildProjectCategoryBreadcrumbs } from "@/lib/listing/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { buildWebPageSchema } from "@/lib/seo";
import { categoryService } from "@/services/category.service";
import { faqService } from "@/services/faq.service";
import { seoContentService } from "@/services/seo-content.service";
import { projectService } from "@/services/project.service";

export const metadata: Metadata = createPageMetadata({
  title: "Dự án bất động sản",
  description: "Cập nhật thông tin dự án bất động sản nổi bật và mới nhất.",
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
            title: "Dự án bất động sản",
            description:
              "Cập nhật thông tin dự án bất động sản nổi bật và mới nhất.",
            url: "/du-an",
            schemaType: "CollectionPage",
          }),
        ]}
      />
      <section className="layout-container layout-section-sm pb-0">
        <Title
          eyebrow="Dự án"
          title="Dự án bất động sản"
          description="Cập nhật thông tin dự án bất động sản nổi bật và mới nhất."
          align="left"
          level={1}
        />
      </section>
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
      <PageSeoContent seoData={seoRes.data} />
      <PageFaq faqData={faqRes.data} />
    </>
  );
}
