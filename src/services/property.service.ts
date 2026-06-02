import "server-only";

import { Property } from "@/types/property";
import {
  PropertyDirection,
  PropertyPriority,
  PublishSource,
  PublishStatus,
} from "@/types/enums";
import { requestServerApi } from "./shared/server-api-client";
import {
  buildListPath,
  buildListTags,
  buildScopedListPath,
} from "./shared/list-service";

export type PropertySortBy =
  | "createdAt"
  | "price"
  | "area"
  | "viewCount"
  | "boostedAt"
  | "priorityStatus"
  | "isFeatured";

export type PropertyListFilters = {
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
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  minBedrooms?: number;
  bathrooms?: number;
  minBathrooms?: number;
  isNegotiable?: boolean;
  direction?: PropertyDirection;
  priorityStatus?: PropertyPriority;
  publishSource?: PublishSource;
  isBoosted?: boolean;
  status?: PublishStatus;
  isFeatured?: boolean;
  sortBy?: PropertySortBy;
  sortOrder?: "asc" | "desc";
};

export type PropertyGetAllParams = {
  filters?: PropertyListFilters;
  page?: number;
  limit?: number;
};

export type PropertyGetByFlatSlugParams = {
  flatSlug: string;
  page?: number;
  limit?: number;
};

export type PropertyMineParams = {
  page?: number;
  limit?: number;
};

export const propertyService = {
  getAll: async (params: PropertyGetAllParams = {}) =>
    requestServerApi<Property[]>(buildListPath("/properties", params), {
      cache: "no-store",
      tags: buildListTags("properties", {
        page: params.page,
        limit: params.limit,
      }),
    }),

  getAllByFlatSlug: async (params: PropertyGetByFlatSlugParams) =>
    requestServerApi<Property[]>(
      buildScopedListPath("/properties/search/by-slug", params.flatSlug, {
        page: params.page,
        limit: params.limit,
      }),
      {
        cache: "no-store",
        tags: buildListTags("properties", {
          page: params.page,
          limit: params.limit,
          scope: { key: "flat", value: params.flatSlug },
        }),
      },
    ),

  getBySlug: async (slug: string) => {
    const response = await requestServerApi<Property>(
      `/properties/slug/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
        tags: ["property-detail", slug],
      },
    );
    return response.data;
  },

  getMine: async (params: PropertyMineParams = {}) =>
    requestServerApi<Property[]>(buildListPath("/me/properties", params), {
      auth: "required",
      cache: "no-store",
      tags: buildListTags("my-properties", {
        page: params.page,
        limit: params.limit,
      }),
    }),
};
