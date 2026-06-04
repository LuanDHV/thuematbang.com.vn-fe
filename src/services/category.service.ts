import "server-only";

import { Category } from "@/types/category";
import { CategoryType } from "@/types/enums";
import { requestServerApi } from "./shared/server-api-client";
import { buildListPath, buildListTags } from "./shared/list-service";

export type CategoryListFilters = {
  type?: CategoryType;
  q?: string;
};

export type CategoryGetAllParams = {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
  filters?: CategoryListFilters;
};

export const categoryService = {
  getAll: async (options: CategoryGetAllParams = {}) =>
    requestServerApi<Category[]>(
      buildListPath("/categories", {
        filters: options.filters,
      }),
      {
        cache: options.cache ?? "no-store",
        revalidate: options.revalidate,
        tags:
          options.tags ??
          buildListTags("categories", {
            scope: options.filters?.type
              ? { key: "type", value: options.filters.type }
              : undefined,
          }),
      },
    ),

  getNewsCategories: async () => {
    const response = await categoryService.getAll({
      revalidate: 300,
      filters: {
        type: "NEWS",
      },
    });
    const categories = response.data ?? [];
    return categories.filter((item) => item.type === "NEWS");
  },

  getProjectCategories: async () => {
    const response = await categoryService.getAll({
      revalidate: 300,
      filters: {
        type: "PROJECT",
      },
    });
    const categories = response.data ?? [];
    return categories.filter((item) => item.type === "PROJECT");
  },
};
