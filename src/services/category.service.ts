import { Category } from "@/types/category";
import { getApiResponse } from "./shared/api-client";

export const categoryService = {
  getAll: async () =>
    getApiResponse<Category[]>("/categories", {
      revalidate: 300,
      tags: ["categories"],
    }),
};


