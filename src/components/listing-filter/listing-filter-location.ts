import type { FlatUrlContext } from "@/lib/flat-url";
import { normalizeVietnameseText } from "@/lib/text-normalize";
import type { AdvancedFilterValue } from "@/types/filter";
import type { Province, Ward } from "@/types/location";
import type { Property } from "@/types/property";
import type { RentRequest } from "@/types/rent-request";

export type ProvinceWardMap = Record<string, Record<string, string[]>>;

type ListingMode = "property" | "rentRequest";

type SourceLocationMap = {
  provinceMap: Map<string, Province>;
  wardMap: Map<string, Ward[]>;
};

// Listing pages reuse the same UI for supply and demand, so these helpers keep
// the location orchestration in one place instead of duplicating it per component.
function resolveLocationParts(
  item: Property | RentRequest,
  listingMode: ListingMode,
) {
  if (listingMode === "rentRequest") {
    const rentRequest = item as RentRequest;
    return {
      province: rentRequest.desiredProvince,
      ward: rentRequest.desiredWard,
    };
  }

  const property = item as Property;
  return {
    province: property.province,
    ward: property.ward,
  };
}

export function buildSourceLocationMap(
  sourceItems: Array<Property | RentRequest>,
  listingMode: ListingMode,
): SourceLocationMap {
  const provinceMap = new Map<string, Province>();
  const wardMap = new Map<string, Ward[]>();

  for (const item of sourceItems) {
    const { province, ward } = resolveLocationParts(item, listingMode);

    if (province?.name && !provinceMap.has(province.name)) {
      provinceMap.set(province.name, {
        id: province.id,
        name: province.name,
        slug: province.slug,
      });
    }

    if (province?.name && ward?.name) {
      const existing = wardMap.get(province.name) ?? [];

      if (!existing.some((entry) => entry.name === ward.name)) {
        existing.push({
          id: ward.id,
          provinceId: ward.provinceId,
          name: ward.name,
          slug: ward.slug,
        });
        wardMap.set(province.name, existing);
      }
    }
  }

  return { provinceMap, wardMap };
}

// Merge server lookups and local fallback data into the map consumed by filter UI.
export function buildProvinceWardMap(options: {
  provinces: Province[];
  selectedProvinceId: number | null;
  selectedProvinceWards: Ward[];
  sourceLocationMap: SourceLocationMap;
}): ProvinceWardMap {
  const {
    provinces,
    selectedProvinceId,
    selectedProvinceWards,
    sourceLocationMap,
  } = options;

  return provinces.reduce<ProvinceWardMap>((acc, province) => {
    const sourceWards = sourceLocationMap.wardMap.get(province.name) ?? [];
    const wardsForProvince =
      selectedProvinceId === province.id ? selectedProvinceWards : sourceWards;

    acc[province.name] = wardsForProvince.reduce<Record<string, string[]>>(
      (wardAcc, ward) => {
        wardAcc[ward.name] = [];
        return wardAcc;
      },
      {},
    );

    return acc;
  }, {});
}

// Prefer the freshly loaded wards for the currently selected province in the drawer.
export function buildEffectiveProvinceWardMap(
  provinceWardMap: ProvinceWardMap,
  provinceName: string,
  selectedProvinceWards: Ward[],
): ProvinceWardMap {
  if (!provinceName || !selectedProvinceWards.length) {
    return provinceWardMap;
  }

  return {
    ...provinceWardMap,
    [provinceName]: selectedProvinceWards.reduce<Record<string, string[]>>(
      (acc, ward) => {
        acc[ward.name] = [];
        return acc;
      },
      {},
    ),
  };
}

// Build the flat-url lookup context from the same location data used by the filter.
export function buildFlatUrlLocationContext(options: {
  provinces: Province[];
  selectedProvinceWards: Ward[];
  sourceLocationMap: SourceLocationMap;
}): FlatUrlContext {
  const { provinces, selectedProvinceWards, sourceLocationMap } = options;
  const wardMap = new Map<string, Pick<Ward, "name" | "slug" | "provinceId">>();

  sourceLocationMap.wardMap.forEach((wards) => {
    wards.forEach((ward) => {
      wardMap.set(`${ward.provinceId}:${ward.slug}`, {
        name: ward.name,
        slug: ward.slug,
        provinceId: ward.provinceId,
      });
    });
  });

  selectedProvinceWards.forEach((ward) => {
    wardMap.set(`${ward.provinceId}:${ward.slug}`, {
      name: ward.name,
      slug: ward.slug,
      provinceId: ward.provinceId,
    });
  });

  return {
    provinces: provinces.map((province) => ({
      id: province.id,
      name: province.name,
      slug: province.slug,
    })),
    wards: Array.from(wardMap.values()),
  };
}

// Snap incoming filter state back to the canonical province and ward labels in the map.
export function reconcileLocationFilter(
  value: AdvancedFilterValue,
  provinceWardMap: ProvinceWardMap,
): AdvancedFilterValue {
  const provinceEntries = Object.keys(provinceWardMap);
  if (!provinceEntries.length) return value;

  const matchedProvince =
    provinceEntries.find(
      (province) =>
        normalizeVietnameseText(province) ===
        normalizeVietnameseText(value.province),
    ) ?? "";

  if (!matchedProvince) {
    return {
      ...value,
      province: "",
      ward: "",
      street: "",
    };
  }

  const wardEntries = Object.keys(provinceWardMap[matchedProvince] ?? {});
  const matchedWard =
    wardEntries.find(
      (ward) =>
        normalizeVietnameseText(ward) === normalizeVietnameseText(value.ward),
    ) ?? "";

  return {
    ...value,
    province: matchedProvince,
    ward: matchedWard,
    street: matchedWard ? value.street : "",
  };
}
