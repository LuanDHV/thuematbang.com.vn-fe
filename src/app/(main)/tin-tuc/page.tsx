import type { Metadata } from "next";
import { connection } from "next/server";
import PageStructuredData from "@/components/common/PageStructuredData";
import SafeFetch from "@/components/common/SafeFetch";
import Title from "@/components/common/Title";
import NewsListingClient from "@/components/listing-client/NewsListingClient";
import { buildNewsCategoryBreadcrumbs } from "@/lib/listing/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { buildWebPageSchema } from "@/lib/seo";
import { categoryService } from "@/services/category.service";
import { newsService } from "@/services/news.service";

export const metadata: Metadata = createPageMetadata({
  title: "Tin tức",
  description:
    "Tổng hợp tin tức, phân tích và kiến thức bất động sản mới nhất.",
  pathname: "/tin-tuc",
});

export default async function TinTucPage() {
  await connection();

  // Fetch news categories for listing filter tabs.
  const categories = await categoryService.getNewsCategories();

  return (
    <>
      <PageStructuredData
        schemas={[
          buildWebPageSchema({
            title: "Tin tức",
            description:
              "Tổng hợp tin tức, phân tích và kiến thức bất động sản mới nhất.",
            url: "/tin-tuc",
            schemaType: "CollectionPage",
          }),
        ]}
      />
      <section className="layout-container layout-section-sm pb-0">
        <Title
          eyebrow="Cập nhật"
          title="Tin tức bất động sản"
          description="Tổng hợp tin tức, phân tích và kiến thức bất động sản mới nhất."
          align="left"
          level={1}
        />
      </section>
      <SafeFetch
        fetcher={newsService.getAll({
          limit: 8,
        })}
        debugLabel="News Response"
      >
        {(response) => (
          <NewsListingClient
            newsList={response.data ?? []}
            categories={categories}
            breadcrumbItems={buildNewsCategoryBreadcrumbs(
              undefined,
              categories,
            )}
            paginationMeta={response.meta}
          />
        )}
      </SafeFetch>
    </>
  );
}
