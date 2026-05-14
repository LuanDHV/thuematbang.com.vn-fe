"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import NewsCard from "@/components/common/NewsCard";
import FeaturedNewsCard from "@/components/common/FeaturedNewsCard";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import { CategoryChips } from "@/components/common/CategoryChips";
import { mockPosts } from "../../mocks/post";
import { mockCategories } from "../../mocks/categories";

const INITIAL_VISIBLE_POSTS = 4;
const LOAD_MORE_STEP = 4;

export default function NewsListingClient({
  initialCategorySlug = "tin-tuc",
}: {
  initialCategorySlug?: string;
}) {
  const router = useRouter();
  const [selectedCategorySlug, setSelectedCategorySlug] =
    useState<string>(initialCategorySlug);
  const [visiblePostsCount, setVisiblePostsCount] = useState(
    INITIAL_VISIBLE_POSTS,
  );

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
    setVisiblePostsCount(INITIAL_VISIBLE_POSTS);
    router.replace(
      categorySlug === "tin-tuc" ? "/tin-tuc" : `/tin-tuc/${categorySlug}`,
      {
        scroll: false,
      },
    );
  };

  const posts = useMemo(() => {
    if (selectedCategorySlug === "tin-tuc") {
      return mockPosts.filter((post) =>
        ["kien-truc-xay-dung", "tu-van-luat", "phong-thuy"].includes(
          post.category?.slug || "",
        ),
      );
    }
    return mockPosts.filter(
      (post) => post.category?.slug === selectedCategorySlug,
    );
  }, [selectedCategorySlug]);

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);
  const visibleRemainingPosts = remainingPosts.slice(0, visiblePostsCount);
  const hasMorePosts = visiblePostsCount < remainingPosts.length;

  const mostViewedPosts = [...remainingPosts]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 6);

  const handleLoadMore = () => {
    setVisiblePostsCount((currentCount) => currentCount + LOAD_MORE_STEP);
  };

  return (
    <div className="mx-auto h-auto max-w-7xl px-4 py-12 lg:py-20">
      <div className="my-6">
        <CategoryChips
          activeValue={selectedCategorySlug}
          onChange={handleSelectCategory}
          items={categoryItems}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {featuredPost && <FeaturedNewsCard post={featuredPost} />}

          <div className="grid gap-6">
            {visibleRemainingPosts.length > 0 ? (
              visibleRemainingPosts.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))
            ) : posts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">Không có bài viết nào</p>
              </div>
            ) : null}
          </div>

          {remainingPosts.length > 0 && hasMorePosts ? (
            <SeeMoreButton onClick={handleLoadMore} />
          ) : null}
        </div>

        <div className="h-fit">
          <h4 className="mb-4 text-lg font-bold">
            Bài viết được xem nhiều nhất
          </h4>
          <div className="grid gap-6">
            {mostViewedPosts.length > 0 ? (
              mostViewedPosts.map((post) => (
                <NewsCard key={post.id} post={post} />
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
