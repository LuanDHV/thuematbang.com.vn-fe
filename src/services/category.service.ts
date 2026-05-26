import { Category } from "@/types/category";
import { getApiResponse } from "./shared/api-client";

export const categoryService = {
  getAll: async () =>
    getApiResponse<Category[]>("/categories", {
      revalidate: 300,
      tags: ["categories"],
    }),

  getNewsCategories: async () => {
    const response = await getApiResponse<Category[]>("/categories", {
      revalidate: 300,
      tags: ["categories"],
    });
    const categories = response.data ?? [];
    return categories.filter((item) => item.type === "NEWS");
  },

  getProjectCategories: async () => {
    const response = await getApiResponse<Category[]>("/categories", {
      revalidate: 300,
      tags: ["categories"],
    });
    const categories = response.data ?? [];
    return categories.filter((item) => item.type === "PROJECT");
  },
};
