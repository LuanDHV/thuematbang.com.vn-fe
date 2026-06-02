import "server-only";

import { Category } from "@/types/category";
import { requestServerApi } from "./shared/server-api-client";

export const categoryService = {
  getAll: async () =>
    requestServerApi<Category[]>("/categories", {
      revalidate: 300,
      tags: ["categories"],
    }),

  getNewsCategories: async () => {
    const response = await requestServerApi<Category[]>("/categories", {
      revalidate: 300,
      tags: ["categories"],
    });
    const categories = response.data ?? [];
    return categories.filter((item) => item.type === "NEWS");
  },

  getProjectCategories: async () => {
    const response = await requestServerApi<Category[]>("/categories", {
      revalidate: 300,
      tags: ["categories"],
    });
    const categories = response.data ?? [];
    return categories.filter((item) => item.type === "PROJECT");
  },
};
