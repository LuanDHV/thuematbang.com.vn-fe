import { RentRequest } from "@/types/rent-request";
import { PropertyDirection, RentRequestStatus } from "@/types/enums";
import { getApiResponse } from "./shared/api-client";
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

export const rentRequestService = {
  getAll: async (params: RentRequestGetAllParams = {}) =>
    getApiResponse<RentRequest[]>(buildListPath("/rent-requests", params), {
      cache: "no-store",
      tags: buildListTags("rent-requests", {
        page: params.page,
        limit: params.limit,
      }),
    }),

  getAllByFlatSlug: async (params: RentRequestGetByFlatSlugParams) =>
    getApiResponse<RentRequest[]>(
      buildScopedListPath(
        "/rent-requests/search/by-slug",
        params.flatSlug,
        {
          page: params.page,
          limit: params.limit,
        },
      ),
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
    getApiResponse<RentRequest[]>(`/rent-requests/category/${encodeURIComponent(slug)}`, {
      cache: "no-store",
      tags: buildListTags("rent-requests", {
        scope: { key: "category", value: slug },
      }),
    }),

  getBySlug: async (slug: string) => {
    const response = await getApiResponse<RentRequest>(
      `/rent-requests/slug/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
        tags: ["rent-request-detail", slug],
      },
    );
    return response.data;
  },
};


