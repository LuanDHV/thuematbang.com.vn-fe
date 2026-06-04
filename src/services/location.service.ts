import "server-only";

import { Province, Street, Ward } from "@/types/location";
import { buildListPath } from "./shared/list-service";
import { requestServerApi } from "./shared/server-api-client";
import { ensureArray } from "./shared/validation";

export type LocationSearchFilters = {
  q?: string;
};

export type LocationGetProvincesParams = {
  filters?: LocationSearchFilters;
};

export type LocationGetWardsParams = {
  provinceId?: number;
  filters?: LocationSearchFilters;
};

export type LocationGetStreetsByWardParams = {
  wardId?: number;
  limit?: number;
  filters?: LocationSearchFilters;
};

export const locationService = {
  getProvinces: async (params: LocationGetProvincesParams = {}) => {
    const response = await requestServerApi<unknown>(
      buildListPath("/locations/provinces", params),
      {
        cache: "no-store",
        tags: ["provinces"],
      },
    );
    return ensureArray<Province>(response.data, "provinces");
  },

  getWards: async (params: LocationGetWardsParams = {}) => {
    if (typeof params.provinceId !== "number") return [];
    const response = await requestServerApi<unknown>(
      buildListPath(`/locations/provinces/${params.provinceId}/wards`, {
        filters: params.filters,
      }),
      {
        cache: "no-store",
        tags: ["wards"],
      },
    );
    return ensureArray<Ward>(response.data, "wards");
  },

  getStreetsByWard: async (params: LocationGetStreetsByWardParams = {}) => {
    if (typeof params.wardId !== "number") return [];
    const response = await requestServerApi<unknown>(
      buildListPath(`/locations/wards/${params.wardId}/streets`, {
        limit: params.limit ?? 50,
        filters: params.filters,
      }),
      {
        cache: "no-store",
        tags: ["streets"],
      },
    );
    return ensureArray<Street>(response.data, "streets");
  },
};
