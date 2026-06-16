import "server-only";

import { Banner } from "@/types/banner";
import { requestServerApi } from "./shared/server-api-client";
import { buildListPath } from "./shared/list-service";

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

export type BannerUpsertPayload = FormData;

export const bannersService = {
  getPublicByPage: async (page: string) =>
    requestServerApi<BannerByPageResponse>(
      `/banners/page/${encodeURIComponent(page)}`,
      {
      cache: "no-store",
      tags: ["banners", `banners-${page}`],
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
      body: payload,
    });
    return response.data;
  },

  update: async (id: number, payload: BannerUpsertPayload) => {
    const response = await requestServerApi<Banner>(`/banners/${id}`, {
      method: "PATCH",
      auth: "required",
      body: payload,
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
