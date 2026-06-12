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
  | "budget"
  | "desiredArea"
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
  provinceSlug?: string;
  wardSlug?: string;
  budget?: number;
  desiredArea?: number;
  desiredDirection?: PropertyDirection | null;
  status?: RentRequestStatus;
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

export type CreateRentRequestPayload = FormData;
export type UpdateRentRequestPayload = FormData;

export const rentRequestService = {
  // Fetch one paginated rent-request list with the filter contract used by listings and CMS.
  getAll: async (params: RentRequestGetAllParams = {}) =>
    requestServerApi<RentRequest[]>(buildListPath("/rent-requests", params), {
      cache: "no-store",
      tags: buildListTags("rent-requests", {
        page: params.page,
        limit: params.limit,
      }),
    }),

  // Fetch rent requests resolved from one flat-url slug produced by the demand filters.
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

  // Fetch rent requests by category slug for category-specific landing pages.
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

  // Fetch one public rent-request detail by its SEO slug.
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

  // Fetch one rent-request detail by numeric id for authenticated CMS flows.
  getById: async (id: number) => {
    const response = await requestServerApi<RentRequest>(
      `/rent-requests/${id}`,
      {
        auth: "required",
        cache: "no-store",
        tags: ["rent-request-detail", String(id)],
      },
    );
    return response.data;
  },

  // Create one rent request through the authenticated CMS mutation contract.
  create: async (payload: CreateRentRequestPayload) => {
    const response = await requestServerApi<RentRequest>("/rent-requests", {
      method: "POST",
      auth: "required",
      body: payload,
    });
    return response.data;
  },

  // Update one rent request through the authenticated CMS mutation contract.
  update: async (id: number, payload: UpdateRentRequestPayload) => {
    const response = await requestServerApi<RentRequest>(
      `/rent-requests/${id}`,
      {
        method: "PATCH",
        auth: "required",
        body: payload,
      },
    );
    return response.data;
  },

  // Delete one rent request through the authenticated CMS mutation contract.
  remove: async (id: number) => {
    const response = await requestServerApi<RentRequest>(`/rent-requests/${id}`, {
      method: "DELETE",
      auth: "required",
    });
    return response.data;
  },

  // Fetch the current user's own rent requests for the account area.
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
