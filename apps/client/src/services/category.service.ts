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

export type CategoryUpsertPayload = {
  type: CategoryType;
  name: string;
  slug: string;
  priority?: number;
  isActive?: boolean;
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

  getById: async (id: number) => {
    const response = await requestServerApi<Category>(`/categories/${id}`, {
      auth: "required",
      cache: "no-store",
      tags: ["category-detail", String(id)],
    });
    return response.data;
  },

  create: async (payload: CategoryUpsertPayload) => {
    const response = await requestServerApi<Category>("/categories", {
      method: "POST",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  update: async (id: number, payload: Partial<CategoryUpsertPayload>) => {
    const response = await requestServerApi<Category>(`/categories/${id}`, {
      method: "PATCH",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  remove: async (id: number) => {
    const response = await requestServerApi<Category>(`/categories/${id}`, {
      method: "DELETE",
      auth: "required",
    });
    return response.data;
  },
};
