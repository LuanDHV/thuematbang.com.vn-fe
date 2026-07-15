import type { Metadata } from "next";
import { connection } from "next/server";
import PageStructuredData from "@/components/common/PageStructuredData";
import SafeFetch from "@/components/common/SafeFetch";
import NewsListingClient from "@/components/listing-client/NewsListingClient";
import { buildNewsCategoryBreadcrumbs } from "@/lib/listing/flat-url";
import { buildLatestListingTitle, createPageMetadata } from "@/lib/metadata";
import { buildWebPageSchema } from "@/lib/seo";
import { categoryService } from "@/services/category.service";
import { newsService } from "@/services/news.service";

export const metadata: Metadata = createPageMetadata({
  title: buildLatestListingTitle("Tin tức bất động sản"),
  description:
    "Cập nhật tin tức, phân tích, xu hướng giá thuê và kinh nghiệm tìm mặt bằng bất động sản mới nhất để bạn theo dõi thị trường và ra quyết định nhanh hơn.",
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
            title: buildLatestListingTitle("Tin tức bất động sản"),
            description:
              "Cập nhật tin tức, phân tích, xu hướng giá thuê và kinh nghiệm tìm mặt bằng bất động sản mới nhất để bạn theo dõi thị trường và ra quyết định nhanh hơn.",
            url: "/tin-tuc",
            schemaType: "CollectionPage",
          }),
        ]}
      />
      <SafeFetch
        fetcher={newsService.getAll({
          filters: {
            sortBy: "createdAt",
            sortOrder: "desc",
          },
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
