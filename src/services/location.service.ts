import "server-only";

import { Province, Street, Ward } from "@/types/location";
import { buildListPath } from "./shared/list-service";
import { requestServerApi } from "./shared/server-api-client";
import { ensureArray } from "./shared/validation";

export const locationService = {
  getProvinces: async () => {
    const response = await requestServerApi<unknown>("/locations/provinces", {
      cache: "no-store",
      tags: ["provinces"],
    });
    return ensureArray<Province>(response.data, "provinces");
  },

  getWards: async (provinceId?: number) => {
    if (typeof provinceId !== "number") return [];
    const response = await requestServerApi<unknown>(
      `/locations/provinces/${provinceId}/wards`,
      {
        cache: "no-store",
        tags: ["wards"],
      },
    );
    return ensureArray<Ward>(response.data, "wards");
  },

  getStreetsByProvince: async (provinceId?: number, limit = 50) => {
    if (typeof provinceId !== "number") return [];
    const response = await requestServerApi<unknown>(
      buildListPath(`/locations/provinces/${provinceId}/streets`, { limit }),
      {
        cache: "no-store",
        tags: ["streets"],
      },
    );
    return ensureArray<Street>(response.data, "streets");
  },

  getStreetsByWard: async (wardId?: number, limit = 50) => {
    if (typeof wardId !== "number") return [];
    const response = await requestServerApi<unknown>(
      buildListPath(`/locations/wards/${wardId}/streets`, { limit }),
      {
        cache: "no-store",
        tags: ["streets"],
      },
    );
    return ensureArray<Street>(response.data, "streets");
  },
};
