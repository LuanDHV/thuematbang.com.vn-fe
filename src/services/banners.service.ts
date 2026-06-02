import "server-only";

import { Category } from "@/types/category";
import { requestServerApi } from "./shared/server-api-client";

export const categoryService = {
  getAll: async () =>
    requestServerApi<Category[]>("/banners", {
      revalidate: 300,
      tags: ["banners"],
    }),
};
