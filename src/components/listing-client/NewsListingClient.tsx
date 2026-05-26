"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react";
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
import { useMostViewedNews } from "@/hooks/use-news";

type NewsListingClientProps = {
  newsList: News[];
  categories?: Category[];
  initialCategorySlug?: string;
  breadcrumbItems?: BreadcrumbItem[];
  paginationMeta?: PaginationMeta;
};

const DEFAULT_CATEGORY_SLUG = "tin-tuc";

function getCategoryPath(categorySlug: string) {
  return categorySlug === DEFAULT_CATEGORY_SLUG
    ? "/tin-tuc"
    : `/tin-tuc/${categorySlug}`;
}

export default function NewsListingClient({
  newsList: sourceNews,
  categories = [],
  initialCategorySlug = DEFAULT_CATEGORY_SLUG,
  breadcrumbItems,
  paginationMeta,
}: NewsListingClientProps) {
  const router = useRouter();

  const [selectedCategorySlug, setSelectedCategorySlug] =
    useState(initialCategorySlug);

  useEffect(() => {
    if (initialCategorySlug !== selectedCategorySlug) {
      // Defer the state update to avoid synchronous cascading renders
      startTransition(() => {
        setSelectedCategorySlug(initialCategorySlug);
      });
    }
  }, [initialCategorySlug, selectedCategorySlug]);

  const categoryItems = useMemo(() => {
    const newsCategories = categories
      .filter((item) => item.type === "NEWS")
      .toSorted((a, b) => a.priority - b.priority)
      .map((item) => ({
        id: String(item.id),
        label: item.name,
        value: item.slug,
      }));

    const hasDefaultCategory = newsCategories.some(
      (item) => item.value === DEFAULT_CATEGORY_SLUG,
    );

    return hasDefaultCategory
      ? newsCategories
      : [
          {
            id: DEFAULT_CATEGORY_SLUG,
            label: "Tin tức",
            value: DEFAULT_CATEGORY_SLUG,
          },
          ...newsCategories,
        ];
  }, [categories]);

  const [featuredNews, remainingNews] = useMemo(() => {
    return [sourceNews[0], sourceNews.slice(1)];
  }, [sourceNews]);

  const { data: mostViewedNewsResponse } = useMostViewedNews(
    selectedCategorySlug,
    4,
  );

  const mostViewedNews = useMemo(() => {
    return mostViewedNewsResponse?.data ?? sourceNews.slice(0, 4);
  }, [mostViewedNewsResponse?.data, sourceNews]);

  const totalPages = Math.max(1, paginationMeta?.totalPage ?? 1);
  const currentPage = Math.max(1, paginationMeta?.currentPage ?? 1);

  const handleSelectCategory = useCallback(
    (categorySlug: string) => {
      setSelectedCategorySlug(categorySlug);

      router.replace(getCategoryPath(categorySlug), {
        scroll: false,
      });
    },
    [router],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      router.replace(
        buildPagedPath(getCategoryPath(selectedCategorySlug), nextPage),
        {
          scroll: false,
        },
      );
    },
    [router, selectedCategorySlug],
  );

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
          {featuredNews ? <FeaturedNewsCard news={featuredNews} /> : null}

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

          {totalPages > 1 ? (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          ) : null}
        </div>

        <aside className="lg:w-2/lg w-full space-y-6">
          <h4 className="mb-4 text-lg font-bold">
            Bài viết được xem nhiều nhất
          </h4>

          <div className="grid gap-4">
            {mostViewedNews.length > 0 ? (
              mostViewedNews.map((newsItem) => (
                <NewsCard key={newsItem.id} news={newsItem} />
              ))
            ) : (
              <p className="text-gray-500">Không có bài viết</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
