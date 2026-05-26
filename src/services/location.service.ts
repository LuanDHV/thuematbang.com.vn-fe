import { Province, Ward } from "@/types/location";
import { getApiResponse } from "./shared/api-client";
import { ensureArray } from "./shared/validation";

export const locationService = {
  getProvinces: async () => {
    const response = await getApiResponse<unknown>("/locations/provinces", {
      cache: "no-store",
      tags: ["provinces"],
    });
    return ensureArray<Province>(response.data, "provinces");
  },

  getWards: async (provinceId?: number) => {
    if (typeof provinceId !== "number") return [];
    const response = await getApiResponse<unknown>(
      `/locations/provinces/${provinceId}/wards`,
      {
        cache: "no-store",
        tags: ["wards"],
      },
    );
    return ensureArray<Ward>(response.data, "wards");
  },
};


