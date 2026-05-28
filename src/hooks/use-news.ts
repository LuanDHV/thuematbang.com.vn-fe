"use client";

import { useQuery } from "@tanstack/react-query";
import { newsService } from "@/services/news.service";

// Hook to fetch most viewed news by current category.
export function useMostViewedNews(categorySlug: string, limit = 6) {
  return useQuery({
    queryKey: ["news", "most-viewed", categorySlug, limit],
    queryFn: () =>
      newsService.getAll({
        categorySlug: categorySlug === "tin-tuc" ? undefined : categorySlug,
        filters: {
          sortBy: "viewCount",
          sortOrder: "desc",
        },
        limit,
      }),
    staleTime: 60 * 1000,
  });
}
