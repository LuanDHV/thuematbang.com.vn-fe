"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { buildPagedPath, type BreadcrumbItem } from "@/lib/flat-url";
import { resolvePaginationClientMeta } from "@/lib/client-side";
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
    10,
  );

  const mostViewedNews = useMemo(() => {
    return mostViewedNewsResponse?.data ?? sourceNews.slice(0, 10);
  }, [mostViewedNewsResponse?.data, sourceNews]);

  const resolvedPaginationMeta = resolvePaginationClientMeta(paginationMeta);
  const totalPages = Math.max(1, resolvedPaginationMeta.totalPage ?? 1);
  const currentPage = Math.max(1, resolvedPaginationMeta.currentPage ?? 1);

  const handleSelectCategory = useCallback(
    (categorySlug: string) => {
      setSelectedCategorySlug(categorySlug);

      router.replace(getCategoryPath(categorySlug), {
        scroll: false,
      });
    },
    [router],
  );

  return (
    <div className="layout-container layout-section-sm h-auto">
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
        <div className="flex w-full flex-col lg:w-4/6">
          <div className="surface-card space-y-5 p-5">
            {featuredNews ? (
              <FeaturedNewsCard
                news={featuredNews}
                className="aspect-16/10 lg:aspect-16/8"
              />
            ) : null}

            {remainingNews.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {remainingNews.map((newsItem) => (
                  <NewsCard key={newsItem.id} news={newsItem} />
                ))}
              </div>
            ) : sourceNews.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">Không có bài viết nào</p>
              </div>
            ) : null}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={(nextPage) =>
              router.replace(
                buildPagedPath(getCategoryPath(selectedCategorySlug), nextPage),
                {
                  scroll: false,
                },
              )
            }
          />
        </div>

        <aside className="w-full lg:w-2/6">
          <div className="lg:sticky lg:top-24">
            <section className="surface-card hidden rounded-2xl border p-5 lg:block">
              <h2 className="text-heading text-base font-medium">
                <span className="bg-primary mr-2 inline-block h-4 w-0.5 rounded-full align-middle" />
                Bài viết được xem nhiều nhất
              </h2>

              {mostViewedNews.length > 0 ? (
                <div className="mt-3 grid divide-y divide-gray-100">
                  {mostViewedNews.map((newsItem) => (
                    <Link
                      key={newsItem.id}
                      href={`/tin-tuc/${newsItem.slug}`}
                      className="group text-body hover:text-primary py-2.5 text-sm font-medium transition-all duration-200"
                    >
                      <span className="line-clamp-2">{newsItem.title}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500">Không có bài viết</p>
              )}
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
