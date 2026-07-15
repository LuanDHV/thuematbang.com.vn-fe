"use server";

import { newsService } from "@/services/news.service";

export async function getMostViewedNewsAction(
  categorySlug: string,
  limit = 6,
) {
  return newsService.getAll({
    categorySlug: categorySlug === "tin-tuc" ? undefined : categorySlug,
    filters: {
      sortBy: "viewCount",
      sortOrder: "desc",
    },
    limit,
  });
}
