import "server-only";

import { Category } from "@/types/category";
import { requestServerApi } from "./shared/server-api-client";

export const categoryService = {
  getAll: async (
    options: {
      cache?: RequestCache;
      revalidate?: number;
      tags?: string[];
    } = {},
  ) =>
    requestServerApi<Category[]>("/categories", {
      cache: options.cache ?? "no-store",
      revalidate: options.revalidate,
      tags: options.tags ?? ["categories"],
    }),

  getNewsCategories: async () => {
    const response = await categoryService.getAll({
      revalidate: 300,
      tags: ["categories"],
    });
    const categories = response.data ?? [];
    return categories.filter((item) => item.type === "NEWS");
  },

  getProjectCategories: async () => {
    const response = await categoryService.getAll({
      revalidate: 300,
      tags: ["categories"],
    });
    const categories = response.data ?? [];
    return categories.filter((item) => item.type === "PROJECT");
  },
};
