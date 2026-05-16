"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import type { BreadcrumbItem } from "@/lib/flat-url";
import NewsCard from "@/components/common/NewsCard";
import FeaturedNewsCard from "@/components/common/FeaturedNewsCard";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import { CategoryChips } from "@/components/common/CategoryChips";
import { mockNews } from "@/mocks/news";
import { mockCategories } from "@/mocks/categories";

const INITIAL_VISIBLE_NEWS = 4;
const LOAD_MORE_STEP = 4;

export default function NewsListingClient({
  initialCategorySlug = "tin-tuc",
  breadcrumbItems,
}: {
  initialCategorySlug?: string;
  breadcrumbItems?: BreadcrumbItem[];
}) {
  const router = useRouter();
  const [selectedCategorySlug, setSelectedCategorySlug] =
    useState<string>(initialCategorySlug);
  const [visibleNewsCount, setVisibleNewsCount] =
    useState(INITIAL_VISIBLE_NEWS);

  const tintucCategory = mockCategories.find((cat) => cat.slug === "tin-tuc");

  const categoryItems = useMemo(() => {
    if (!tintucCategory) return [];
    return [
      {
        id: tintucCategory.id,
        label: tintucCategory.name,
        value: tintucCategory.slug,
      },
      ...(tintucCategory.children ?? []).map((category) => ({
        id: category.id,
        label: category.name,
        value: category.slug,
      })),
    ];
  }, [tintucCategory]);

  const handleSelectCategory = (categorySlug: string) => {
    setSelectedCategorySlug(categorySlug);
    setVisibleNewsCount(INITIAL_VISIBLE_NEWS);
    router.replace(
      categorySlug === "tin-tuc" ? "/tin-tuc" : `/tin-tuc/${categorySlug}`,
      {
        scroll: false,
      },
    );
  };

  const newsList = useMemo(() => {
    if (selectedCategorySlug === "tin-tuc") {
      return mockNews.filter((newsItem) =>
        ["kien-truc-xay-dung", "tu-van-luat", "phong-thuy"].includes(
          newsItem.category?.slug || "",
        ),
      );
    }
    return mockNews.filter(
      (newsItem) => newsItem.category?.slug === selectedCategorySlug,
    );
  }, [selectedCategorySlug]);

  const featuredNews = newsList[0];
  const remainingNews = newsList.slice(1);
  const visibleRemainingNews = remainingNews.slice(0, visibleNewsCount);
  const hasMoreNews = visibleNewsCount < remainingNews.length;

  const mostViewedNews = [...remainingNews]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 6);

  const handleLoadMore = () => {
    setVisibleNewsCount((currentCount) => currentCount + LOAD_MORE_STEP);
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
            {visibleRemainingNews.length > 0 ? (
              visibleRemainingNews.map((newsItem) => (
                <NewsCard key={newsItem.id} news={newsItem} />
              ))
            ) : newsList.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">Không có bài viết nào</p>
              </div>
            ) : null}
          </div>

          {remainingNews.length > 0 && hasMoreNews ? (
            <SeeMoreButton onClick={handleLoadMore} />
          ) : null}
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
