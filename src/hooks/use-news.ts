"use client";

import { useQuery } from "@tanstack/react-query";
import { getMostViewedNewsAction } from "@/actions/news.actions";

// Hook to fetch most viewed news by current category.
export function useMostViewedNews(categorySlug: string, limit = 6) {
  return useQuery({
    queryKey: ["news", "most-viewed", categorySlug, limit],
    queryFn: () => getMostViewedNewsAction(categorySlug, limit),
    staleTime: 60 * 1000,
  });
}
