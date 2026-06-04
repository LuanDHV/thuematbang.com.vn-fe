import "server-only";

import { RentRequest } from "@/types/rent-request";
import { PropertyDirection, RentRequestStatus } from "@/types/enums";
import { requestServerApi } from "./shared/server-api-client";
import {
  buildListPath,
  buildListTags,
  buildScopedListPath,
} from "./shared/list-service";

export type RentRequestSortBy =
  | "createdAt"
  | "minBudget"
  | "maxBudget"
  | "viewCount";

export type RentRequestListFilters = {
  categoryId?: number;
  userId?: number;
  categorySlug?: string;
  q?: string;
  slug?: string;
  title?: string;
  provinceId?: number;
  wardId?: number;
  streetId?: number;
  provinceSlug?: string;
  wardSlug?: string;
  streetSlug?: string;
  minBudget?: number;
  maxBudget?: number;
  minArea?: number;
  maxArea?: number;
  direction?: PropertyDirection;
  preferredDirection?: PropertyDirection;
  status?: RentRequestStatus;
  isFeatured?: boolean;
  sortBy?: RentRequestSortBy;
  sortOrder?: "asc" | "desc";
};

export type RentRequestGetAllParams = {
  filters?: RentRequestListFilters;
  page?: number;
  limit?: number;
};

export type RentRequestGetByFlatSlugParams = {
  flatSlug: string;
  page?: number;
  limit?: number;
};

export type RentRequestMineParams = {
  page?: number;
  limit?: number;
};

export const rentRequestService = {
  getAll: async (params: RentRequestGetAllParams = {}) =>
    requestServerApi<RentRequest[]>(buildListPath("/rent-requests", params), {
      cache: "no-store",
      tags: buildListTags("rent-requests", {
        page: params.page,
        limit: params.limit,
      }),
    }),

  getAllByFlatSlug: async (params: RentRequestGetByFlatSlugParams) =>
    requestServerApi<RentRequest[]>(
      buildScopedListPath("/rent-requests/search/by-slug", params.flatSlug, {
        page: params.page,
        limit: params.limit,
      }),
      {
        cache: "no-store",
        tags: buildListTags("rent-requests", {
          page: params.page,
          limit: params.limit,
          scope: { key: "flat", value: params.flatSlug },
        }),
      },
    ),

  getByCategorySlug: async (slug: string) =>
    requestServerApi<RentRequest[]>(
      `/rent-requests/category/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
        tags: buildListTags("rent-requests", {
          scope: { key: "category", value: slug },
        }),
      },
    ),

  getBySlug: async (slug: string) => {
    const response = await requestServerApi<RentRequest>(
      `/rent-requests/slug/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
        tags: ["rent-request-detail", slug],
      },
    );
    return response.data;
  },

  getMine: async (params: RentRequestMineParams = {}) =>
    requestServerApi<RentRequest[]>(buildListPath("/me/rent-requests", params), {
      auth: "required",
      cache: "no-store",
      tags: buildListTags("my-rent-requests", {
        page: params.page,
        limit: params.limit,
      }),
    }),
};
