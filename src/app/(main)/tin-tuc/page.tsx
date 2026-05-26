import type { Metadata } from "next";
import SafeFetch from "@/components/common/SafeFetch";
import NewsListingClient from "@/components/listing-client/NewsListingClient";
import { buildNewsCategoryBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { categoryService } from "@/services/category.service";
import { newsService } from "@/services/news.service";
import { Category } from "@/types/category";

export const metadata: Metadata = createPageMetadata({
  title: "Tin tức",
  description: "Tổng hợp tin tức và kiến thức bất động sản mới nhất.",
  pathname: "/tin-tuc",
});

export default async function TinTucPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const page = Math.max(1, Number(params?.page || "1") || 1);
  const limit = 12;

  let categories: Category[] = [];
  try {
    const categoryResponse = await categoryService.getAll();
    categories = categoryResponse.data ?? [];
  } catch {
    categories = [];
  }

  return (
    <SafeFetch fetcher={newsService.getAll({ page, limit })}>
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
