import { Property } from "@/types/property";
import {
  PropertyDirection,
  PropertyPriority,
  PublishSource,
  PublishStatus,
} from "@/types/enums";
import { getApiResponse } from "./shared/api-client";
import { getPrivateApiResponse } from "./shared/private-api-client";
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

export type PropertyMineRequestOptions = {
  accessToken: string;
};

export const propertyService = {
  getAll: async (params: PropertyGetAllParams = {}) =>
    getApiResponse<Property[]>(buildListPath("/properties", params), {
      cache: "no-store",
      tags: buildListTags("properties", { page: params.page, limit: params.limit }),
    }),

  getAllByFlatSlug: async (params: PropertyGetByFlatSlugParams) =>
    getApiResponse<Property[]>(
      buildScopedListPath(
        "/properties/search/by-slug",
        params.flatSlug,
        {
          page: params.page,
          limit: params.limit,
        },
      ),
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
    const response = await getApiResponse<Property>(
      `/properties/slug/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
        tags: ["property-detail", slug],
      },
    );
    return response.data;
  },

  getMine: async (
    params: PropertyMineParams = {},
    requestOptions?: PropertyMineRequestOptions,
  ) =>
    getPrivateApiResponse<Property[]>(buildListPath("/me/properties", params), {
      accessToken: requestOptions?.accessToken ?? "",
      cache: "no-store",
      tags: buildListTags("my-properties", {
        page: params.page,
        limit: params.limit,
      }),
    }),
};


