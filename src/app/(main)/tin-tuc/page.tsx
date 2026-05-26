import type { Metadata } from "next";
import SafeFetch from "@/components/common/SafeFetch";
import NewsListingClient from "@/components/listing-client/NewsListingClient";
import { buildNewsCategoryBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { categoryService } from "@/services/category.service";
import { newsService } from "@/services/news.service";

export const metadata: Metadata = createPageMetadata({
  title: "Tin tức",
  description: "Tổng hợp tin tức và kiến thức bất động sản mới nhất.",
  pathname: "/tin-tuc",
});

export default async function TinTucPage() {
  // Fetch news categories for listing filter tabs.
  const categories = await categoryService.getNewsCategories();
  console.log("[server] Fetch news", {
    limit: 8,
  });

  return (
    <SafeFetch
      fetcher={newsService.getAll({
        limit: 8,
      })}
    >
      {(response) => (
        <NewsListingClient
          newsList={response.data ?? []}
          categories={categories}
          breadcrumbItems={buildNewsCategoryBreadcrumbs(undefined, categories)}
          paginationMeta={response.meta}
        />
      )}
    </SafeFetch>
  );
}

