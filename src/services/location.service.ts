import "server-only";

import {
  extractPropertyFilterRouteParts,
  type FlatUrlContext,
} from "@/lib/flat-url";
import { compactSlugToken } from "@/lib/text-normalize";
import { Province, Ward } from "@/types/location";
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

type PropertyFilterLocationContext = Required<
  Pick<FlatUrlContext, "provinces" | "wards">
>;

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

  // Listing pages only need all provinces plus the ward list for the slug's province.
  resolvePropertyFilterLocationContext:
    async (rawSlug?: string): Promise<PropertyFilterLocationContext> => {
      try {
        const provinces = await locationService.getProvinces();
        const { provinceSlug } = extractPropertyFilterRouteParts(rawSlug);
        const selectedProvince = provinceSlug
          ? provinces.find(
              (province) =>
                compactSlugToken(province.slug).replace(/^tp-/, "") ===
                provinceSlug,
            )
          : undefined;

        const wards = selectedProvince
          ? await locationService.getWards({ provinceId: selectedProvince.id })
          : [];

        return {
          provinces: provinces.map((province) => ({
            id: province.id,
            name: province.name,
            slug: province.slug,
          })),
          wards: wards.map((ward) => ({
            name: ward.name,
            slug: ward.slug,
            provinceId: ward.provinceId,
          })),
        };
      } catch {
        return { provinces: [], wards: [] };
      }
    },
};
