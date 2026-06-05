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

export const bannersService = {
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
