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

export type BannerFetchOptions = {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
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

};
