import "server-only";

import { News } from "@/types/news";
import { ContentStatus } from "@/types/enums";
import { requestServerApi } from "./shared/server-api-client";
import {
  buildListPath,
  buildListTags,
  buildScopedListPath,
} from "./shared/list-service";

export type NewsSortBy = "createdAt" | "viewCount";

export type NewsListFilters = {
  categoryId?: number;
  categorySlug?: string;
  q?: string;
  status?: ContentStatus;
  slug?: string;
  title?: string;
  isFeatured?: boolean;
  sortBy?: NewsSortBy;
  sortOrder?: "asc" | "desc";
};

export type NewsGetAllParams = {
  filters?: NewsListFilters;
  categorySlug?: string;
  page?: number;
  limit?: number;
};

export type NewsUpsertPayload = {
  categoryId: number;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  status?: ContentStatus | null;
  isFeatured?: boolean;
  imageUrl?: string | null;
  imagePublicId?: string | null;
};

export const newsService = {
  getAll: async (params: NewsGetAllParams = {}) => {
    const filters = {
      ...params.filters,
      categorySlug: params.categorySlug ?? params.filters?.categorySlug,
    };

    return requestServerApi<News[]>(
      buildListPath("/news", {
        filters,
        page: params.page,
        limit: params.limit,
      }),
      {
        cache: "no-store",
        tags: buildListTags("news", {
          page: params.page,
          limit: params.limit,
          scope: filters.categorySlug
            ? { key: "category", value: String(filters.categorySlug) }
            : undefined,
        }),
      },
    );
  },

  getByCategorySlug: async (
    slug: string,
    params: Omit<NewsGetAllParams, "filters" | "categorySlug"> = {},
  ) =>
    requestServerApi<News[]>(
      buildScopedListPath("/news/category/slug", slug, {
        page: params.page,
        limit: params.limit,
      }),
      {
        cache: "no-store",
        tags: buildListTags("news", {
          page: params.page,
          limit: params.limit,
          scope: { key: "category", value: slug },
        }),
      },
    ),

  getBySlug: async (slug: string) => {
    const response = await requestServerApi<News>(
      `/news/slug/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
        tags: ["news-detail", slug],
        viewTrackingSource: "public",
      },
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await requestServerApi<News>(`/news/${id}`, {
      auth: "required",
      cache: "no-store",
      tags: ["news-detail", String(id)],
    });
    return response.data;
  },

  create: async (payload: NewsUpsertPayload) => {
    const response = await requestServerApi<News>("/news", {
      method: "POST",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  update: async (id: number, payload: NewsUpsertPayload) => {
    const response = await requestServerApi<News>(`/news/${id}`, {
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
    const response = await requestServerApi<News>(`/news/${id}`, {
      method: "DELETE",
      auth: "required",
    });
    return response.data;
  },
};
