import "server-only";

import { Property } from "@/types/property";
import {
  PropertyDirection,
  PropertyPriority,
  PublishSource,
  PublishStatus,
} from "@/types/enums";
import type { UploadedCloudinaryImage } from "@/types/cloudinary";
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
  | "priorityStatus";

export type PropertyListFilters = {
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

export type PropertyUpsertPayload = {
  title: string;
  slug: string;
  categoryId?: number;
  priceAmount?: number;
  priceUnit?: string;
  price?: number | null;
  isNegotiable?: boolean;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  direction?: PropertyDirection | null;
  provinceId?: number;
  wardId?: number;
  contactName: string;
  contactPhone: string;
  addressDetail?: string;
  longitude?: number;
  latitude?: number;
  content?: string;
  priorityStatus?: PropertyPriority | null;
  publishSource?: PublishSource | null;
  isBoosted?: boolean;
  boostCount?: number;
  status?: PublishStatus | null;
  userId?: number;
  images?: UploadedCloudinaryImage[];
};

export type PropertyCreatePayload = Omit<
  PropertyUpsertPayload,
  "removeImageIds" | "orderedExistingImageIds"
>;

export type PropertyUpdatePayload = PropertyUpsertPayload & {
  removeImageIds?: number[];
  orderedExistingImageIds?: number[];
};

export const propertyService = {
  // Fetch one paginated property list with the filter contract used across public and CMS pages.
  getAll: async (params: PropertyGetAllParams = {}) =>
    requestServerApi<Property[]>(buildListPath("/properties", params), {
      cache: "no-store",
      tags: buildListTags("properties", {
        page: params.page,
        limit: params.limit,
      }),
    }),

  // Fetch the property list resolved from one flat-url slug produced by the listing filters.
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

  // Fetch one public property detail by its SEO slug.
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

  // Fetch one property by numeric id for authenticated CMS flows.
  getById: async (id: number) => {
    const response = await requestServerApi<Property>(`/properties/${id}`, {
      auth: "required",
      cache: "no-store",
      tags: ["property-detail", String(id)],
    });
    return response.data;
  },

  // Create one property through the authenticated CMS mutation contract.
  create: async (payload: PropertyCreatePayload) => {
    const response = await requestServerApi<Property>("/properties", {
      method: "POST",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  // Fetch the current user's own property listings for the account area.
  getMine: async (params: PropertyMineParams = {}) =>
    requestServerApi<Property[]>(buildListPath("/me/properties", params), {
      auth: "required",
      cache: "no-store",
      tags: buildListTags("my-properties", {
        page: params.page,
        limit: params.limit,
      }),
    }),

  // Update one property through the authenticated CMS mutation contract.
  update: async (id: number, payload: PropertyUpdatePayload) => {
    const response = await requestServerApi<Property>(`/properties/${id}`, {
      method: "PATCH",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  // Delete one property through the authenticated CMS mutation contract.
  remove: async (id: number) => {
    const response = await requestServerApi<Property>(`/properties/${id}`, {
      method: "DELETE",
      auth: "required",
    });
    return response.data;
  },
};
