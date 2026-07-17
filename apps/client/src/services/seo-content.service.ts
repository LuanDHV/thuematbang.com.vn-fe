import "server-only";

import { SeoContent } from "@/types/seo-content";
import { buildListPath, buildListTags } from "./shared/list-service";
import { requestServerApi } from "./shared/server-api-client";

export type SeoContentListFilters = {
  q?: string;
  pageGroup?: string;
  isActive?: boolean;
};

export type SeoContentGetAllParams = {
  page?: number;
  limit?: number;
  filters?: SeoContentListFilters;
};

export type SeoContentUpsertPayload = {
  page: string;
  targetPath: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  seoContent?: string | null;
  isActive?: boolean;
};

export const seoContentService = {
  getAll: async (params: SeoContentGetAllParams = {}) =>
    requestServerApi<SeoContent[]>(
      buildListPath("/seo-contents", params),
      {
        auth: "required",
        cache: "no-store",
        tags: buildListTags("seo-contents", {
          page: params.page,
          limit: params.limit,
        }),
      },
    ),

  getByPage: async (page: string) =>
    requestServerApi<SeoContent>(
      `/seo-contents/page/${encodeURIComponent(page)}`,
      {
        cache: "no-store",
        tags: ["seo-contents", `seo-contents-${page}`],
      },
    ),

  resolveByPath: async (path: string) =>
    requestServerApi<SeoContent>(
      `/seo-contents/resolve?path=${encodeURIComponent(path)}`,
      {
        cache: "no-store",
        tags: ["seo-contents", `seo-contents-path-${encodeURIComponent(path)}`],
      },
    ),

  getById: async (id: number) => {
    const response = await requestServerApi<SeoContent>(`/seo-contents/${id}`, {
      auth: "required",
      cache: "no-store",
      tags: ["seo-content-detail", String(id)],
    });
    return response.data;
  },

  create: async (payload: SeoContentUpsertPayload) => {
    const response = await requestServerApi<SeoContent>("/seo-contents", {
      method: "POST",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  update: async (id: number, payload: Partial<SeoContentUpsertPayload>) => {
    const response = await requestServerApi<SeoContent>(`/seo-contents/${id}`, {
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
    const response = await requestServerApi<SeoContent>(`/seo-contents/${id}`, {
      method: "DELETE",
      auth: "required",
    });
    return response.data;
  },
};
