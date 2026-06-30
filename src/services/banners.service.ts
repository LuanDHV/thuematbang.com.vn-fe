import "server-only";

import { Banner } from "@/types/banner";
import { requestServerApi } from "./shared/server-api-client";
import { buildListPath } from "./shared/list-service";
import { type BannerFormValues } from "@/schemas/admin-crud.schema";

export type BannerListFilters = {
  q?: string;
};

export type BannerGetAllParams = {
  page?: number;
  limit?: number;
  filters?: BannerListFilters;
};

export type BannerByPageResponse = {
  page: string;
  banners: Banner[];
};

export type BannerFetchOptions = {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
};

export type BannerUpsertPayload = BannerFormValues & {
  imageUrl?: string | null;
  imagePublicId?: string | null;
};

export const bannersService = {
  getPublicByPage: async (
    page: string,
    fetchOptions: BannerFetchOptions = {},
  ) =>
    requestServerApi<BannerByPageResponse>(
      `/banners/page/${encodeURIComponent(page)}`,
      {
        cache: fetchOptions.cache ?? "no-store",
        revalidate: fetchOptions.revalidate,
        tags: fetchOptions.tags ?? ["banners", `banners-${page}`],
      },
    ),

  getAll: async (params: BannerGetAllParams = {}) =>
    requestServerApi<Banner[]>(
      buildListPath("/banners", params),
      {
        auth: "required",
        cache: "no-store",
        tags: ["banners"],
      },
    ),

  getById: async (id: number) => {
    const response = await requestServerApi<Banner>(`/banners/${id}`, {
      auth: "required",
      cache: "no-store",
      tags: ["banner-detail", String(id)],
    });
    return response.data;
  },

  create: async (payload: BannerUpsertPayload) => {
    const response = await requestServerApi<Banner>("/banners", {
      method: "POST",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  update: async (id: number, payload: BannerUpsertPayload) => {
    const response = await requestServerApi<Banner>(`/banners/${id}`, {
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
    const response = await requestServerApi<Banner>(`/banners/${id}`, {
      method: "DELETE",
      auth: "required",
    });
    return response.data;
  },
};
