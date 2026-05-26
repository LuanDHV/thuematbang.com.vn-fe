"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { buildPagedPath, type BreadcrumbItem } from "@/lib/flat-url";
import NewsCard from "@/components/common/NewsCard";
import FeaturedNewsCard from "@/components/common/FeaturedNewsCard";
import { CategoryChips } from "@/components/common/CategoryChips";
import { Pagination } from "@/components/common/Pagination";
import { News } from "@/types/news";
import { Category } from "@/types/category";
import type { PaginationMeta } from "@/types/api";

export default function NewsListingClient({
  newsList: sourceNews,
  categories = [],
  initialCategorySlug = "tin-tuc",
  breadcrumbItems,
  paginationMeta,
}: {
  newsList: News[];
  categories?: Category[];
  initialCategorySlug?: string;
  breadcrumbItems?: BreadcrumbItem[];
  paginationMeta?: PaginationMeta;
}) {
  const router = useRouter();
  const [selectedCategorySlug, setSelectedCategorySlug] =
    useState<string>(initialCategorySlug);

  const categoryItems = useMemo(() => {
    const newsCategories = categories
      .filter((item) => item.type === "NEWS")
      .sort((a, b) => a.priority - b.priority)
      .map((item) => ({
        id: String(item.id),
        label: item.name,
        value: item.slug,
      }));

    const hasDefaultCategory = newsCategories.some(
      (item) => item.value === "tin-tuc",
    );

    return hasDefaultCategory
      ? newsCategories
      : [
          { id: "tin-tuc", label: "Tin tức", value: "tin-tuc" },
          ...newsCategories,
        ];
  }, [categories]);

  const handleSelectCategory = (categorySlug: string) => {
    setSelectedCategorySlug(categorySlug);
    const targetPath =
      categorySlug === "tin-tuc" ? "/tin-tuc" : `/tin-tuc/${categorySlug}`;
    router.replace(targetPath, { scroll: false });
  };

  const featuredNews = sourceNews[0];
  const remainingNews = sourceNews.slice(1);

  const mostViewedNews = useMemo(
    () =>
      [...sourceNews]
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 6),
    [sourceNews],
  );

  const totalPages = Math.max(1, paginationMeta?.totalPage ?? 1);
  const currentPage = Math.max(1, paginationMeta?.currentPage ?? 1);

  const targetPathFromCategory = (categorySlug: string) =>
    categorySlug === "tin-tuc" ? "/tin-tuc" : `/tin-tuc/${categorySlug}`;

  const handlePageChange = (nextPage: number) => {
    router.replace(
      buildPagedPath(targetPathFromCategory(selectedCategorySlug), nextPage),
      {
        scroll: false,
      },
    );
  };

  return (
    <div className="mx-auto h-auto max-w-7xl px-4 py-8">
      {breadcrumbItems?.length ? (
        <DynamicBreadcrumb items={breadcrumbItems} />
      ) : null}

      <div className="my-6">
        <CategoryChips
          activeValue={selectedCategorySlug}
          onChange={handleSelectCategory}
          items={categoryItems}
        />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full space-y-6 lg:w-4/6">
          {featuredNews && <FeaturedNewsCard news={featuredNews} />}

          <div className="grid gap-6">
            {remainingNews.length > 0 ? (
              remainingNews.map((newsItem) => (
                <NewsCard key={newsItem.id} news={newsItem} />
              ))
            ) : sourceNews.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">Không có bài viết nào</p>
              </div>
            ) : null}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>

        <div className="w-full space-y-6 lg:w-2/6">
          <h4 className="mb-4 text-lg font-bold">
            Bài viết được xem nhiều nhất
          </h4>
          <div className="grid gap-6">
            {mostViewedNews.length > 0 ? (
              mostViewedNews.map((newsItem) => (
                <NewsCard key={newsItem.id} news={newsItem} />
              ))
            ) : (
              <p className="text-gray-500">Không có bài viết</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
